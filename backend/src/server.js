import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

import { store } from './store.js';
import { simulator, SCENARIOS } from './simulator.js';
import { dispatchAutonomousAgents, generatePostMortem, isGeminiLive } from './gemini.js';
import { executeRunbook, rejectRunbook } from './runbook.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    geminiLive: isGeminiLive(),
    mode: isGeminiLive() ? 'live-gemini-2.5' : 'high-fidelity-simulation',
    activeScenario: simulator.currentScenario ? simulator.currentScenario.key : null,
    incidentStatus: store.incidentState.status,
    timestamp: new Date().toISOString(),
  });
});

// 2. Server-Sent Events (SSE) stream
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable proxy buffering
  res.flushHeaders();

  // Send an immediate heartbeat comment to establish connection
  res.write(': connected\n\n');

  store.addSubscriber(res);

  req.on('close', () => {
    store.removeSubscriber(res);
  });
});

// 3. Current State
app.get('/api/state', (req, res) => {
  res.json({
    incident: store.incidentState,
    agents: store.agentStates,
    metrics: simulator.currentMetrics,
  });
});

// 4. Logs
app.get('/api/logs', (req, res) => {
  const { level, service, search } = req.query;
  const logs = store.getLogs({ level, service, search });
  res.json({ total: logs.length, logs });
});

// 5. Scenarios list
app.get('/api/simulator/scenarios', (req, res) => {
  res.json({ scenarios: Object.values(SCENARIOS) });
});

// 6. Chaos Simulator - Inject Failure
app.post('/api/simulator/inject', async (req, res) => {
  try {
    const { scenario = 'payment_cascade', intensity = 1.0 } = req.body;
    
    if (!SCENARIOS[scenario]) {
      return res.status(400).json({ error: `Invalid scenario '${scenario}'. Must be one of: ${Object.keys(SCENARIOS).join(', ')}` });
    }

    // Reset previous agents
    store.resetAgents();

    // Inject failure into simulator
    const incident = simulator.injectFailure(scenario, intensity);

    // Asynchronously dispatch the Autonomous Multi-Agent Loop
    dispatchAutonomousAgents(scenario);

    res.json({
      success: true,
      message: `Injected failure scenario: ${SCENARIOS[scenario].name}`,
      incident,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Chaos Simulator - Reset System
app.post('/api/simulator/reset', (req, res) => {
  try {
    const incident = simulator.reset();
    res.json({
      success: true,
      message: 'System restored to steady state baseline',
      incident,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Runbook - Execute Approved Fix
app.post('/api/runbook/execute', async (req, res) => {
  try {
    const { runbookId } = req.body;
    if (!runbookId) {
      return res.status(400).json({ error: 'runbookId is required' });
    }

    // Execute runbook steps asynchronously
    executeRunbook(runbookId).catch(err => {
      console.error('Runbook execution error:', err.message);
    });

    res.json({
      success: true,
      message: 'Runbook execution initiated. Streaming command progress.',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Runbook - Reject Fix
app.post('/api/runbook/reject', (req, res) => {
  try {
    const { runbookId, reason } = req.body;
    const result = rejectRunbook(runbookId, reason);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Post-Mortem Generator
app.post('/api/postmortem/generate', async (req, res) => {
  try {
    const scenarioKey = req.body.scenarioKey || store.incidentState.scenarioKey || 'payment_cascade';
    
    // Broadcast status
    store.broadcast('postmortem_generating', { scenarioKey });

    const markdown = await generatePostMortem(scenarioKey, (chunk) => {
      store.broadcast('postmortem_chunk', { chunk });
    });

    store.broadcast('postmortem_ready', { markdown });

    res.json({
      success: true,
      markdown,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Incidents history
app.get('/api/incidents', (req, res) => {
  res.json({
    active: store.incidentState,
    history: store.incidents,
  });
});

// Production static file serving
const frontendDist = process.env.FRONTEND_DIST || path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(frontendDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('IncidentPulse AI API Server running. Build frontend to view War-Room UI.');
    }
  });
});

export { app };

// If run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 IncidentPulse AI Backend running on http://localhost:${PORT}`);
    console.log(`📡 SSE Stream available at http://localhost:${PORT}/api/stream`);
  });
}
