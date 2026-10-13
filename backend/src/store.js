import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const INCIDENTS_FILE = path.join(DATA_DIR, 'incidents.json');

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Store {
  constructor() {
    this.subscribers = new Set();
    this.logs = [];
    this.maxLogs = 500;
    
    this.incidentState = {
      id: null,
      title: 'Systems Nominal',
      status: 'STEADY', // STEADY, ACTIVE, INVESTIGATING, MITIGATING, RESOLVED
      severity: 'P3', // P1, P2, P3
      scenarioKey: null,
      scenarioName: 'Normal Operations',
      startedAt: null,
      detectedAt: null,
      mitigatedAt: null,
      mttdSeconds: 0,
      mttmSeconds: 0,
      affectedServices: [],
      errorRate: 0.05,
      latencyP99: 140,
      activeRunbook: null,
      timeline: [],
      postMortem: null,
    };

    this.agentStates = {
      triage: { id: 'triage', name: 'Triage Agent', role: 'Severity & Blast Radius', model: 'gemini-2.5-flash', status: 'idle', thought: '', tokens: 0, latencyMs: 0 },
      investigator: { id: 'investigator', name: 'Investigator Agent', role: 'Root Cause & Log Correlation', model: 'gemini-2.5-pro', status: 'idle', thought: '', tokens: 0, latencyMs: 0 },
      remediation: { id: 'remediation', name: 'Remediation Agent', role: 'Runbook Generation & Safety Gate', model: 'gemini-2.5-pro', status: 'idle', thought: '', tokens: 0, latencyMs: 0 },
      comms: { id: 'comms', name: 'Comms Agent', role: 'Status Page & Stakeholder Briefs', model: 'gemini-2.5-flash', status: 'idle', thought: '', tokens: 0, latencyMs: 0 },
    };

    this.loadIncidents();
  }

  loadIncidents() {
    try {
      if (fs.existsSync(INCIDENTS_FILE)) {
        const raw = fs.readFileSync(INCIDENTS_FILE, 'utf-8');
        this.incidents = JSON.parse(raw);
      } else {
        this.incidents = [];
      }
    } catch (err) {
      console.warn('Could not load incidents history:', err.message);
      this.incidents = [];
    }
  }

  saveIncidents() {
    try {
      fs.writeFileSync(INCIDENTS_FILE, JSON.stringify(this.incidents, null, 2));
    } catch (err) {
      console.error('Failed to persist incidents:', err.message);
    }
  }

  addSubscriber(res) {
    this.subscribers.add(res);
    // Send initial snapshot
    this.sendToClient(res, 'init', {
      incident: this.incidentState,
      agents: this.agentStates,
      recentLogs: this.logs.slice(-50),
    });
  }

  removeSubscriber(res) {
    this.subscribers.delete(res);
  }

  sendToClient(res, event, data) {
    try {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    } catch {
      this.subscribers.delete(res);
    }
  }

  broadcast(event, data) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of this.subscribers) {
      try {
        client.write(payload);
      } catch {
        this.subscribers.delete(client);
      }
    }
  }

  addLog(log) {
    const enrichedLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: log.timestamp || new Date().toISOString(),
      level: log.level || 'INFO',
      service: log.service || 'system',
      message: log.message || '',
      traceId: log.traceId || `tr-${Math.random().toString(36).substring(2, 9)}`,
      metadata: log.metadata || {},
    };
    this.logs.push(enrichedLog);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    this.broadcast('log', enrichedLog);
    return enrichedLog;
  }

  getLogs(filter = {}) {
    let result = [...this.logs];
    if (filter.level && filter.level !== 'ALL') {
      result = result.filter(l => l.level === filter.level);
    }
    if (filter.service) {
      result = result.filter(l => l.service.toLowerCase().includes(filter.service.toLowerCase()));
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(l => l.message.toLowerCase().includes(q) || l.service.toLowerCase().includes(q));
    }
    return result;
  }

  updateIncidentState(updates) {
    this.incidentState = { ...this.incidentState, ...updates };
    this.broadcast('incident_state', this.incidentState);
    return this.incidentState;
  }

  updateAgent(agentId, updates) {
    if (this.agentStates[agentId]) {
      this.agentStates[agentId] = { ...this.agentStates[agentId], ...updates };
      this.broadcast('agent_update', { agentId, ...this.agentStates[agentId] });
    }
  }

  appendAgentThought(agentId, chunk) {
    if (this.agentStates[agentId]) {
      this.agentStates[agentId].thought += chunk;
      this.agentStates[agentId].tokens += chunk.split(/\s+/).filter(Boolean).length;
      this.broadcast('agent_thought_chunk', {
        agentId,
        chunk,
        totalThought: this.agentStates[agentId].thought,
        tokens: this.agentStates[agentId].tokens,
      });
    }
  }

  resetAgents() {
    for (const key of Object.keys(this.agentStates)) {
      this.agentStates[key].status = 'idle';
      this.agentStates[key].thought = '';
      this.agentStates[key].tokens = 0;
      this.agentStates[key].latencyMs = 0;
    }
    this.broadcast('agents_reset', this.agentStates);
  }

  addTimelineEvent(title, description, severity = 'INFO') {
    const event = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title,
      description,
      severity,
    };
    this.incidentState.timeline.push(event);
    this.broadcast('timeline_event', event);
    return event;
  }

  archiveCurrentIncident() {
    if (this.incidentState.id && this.incidentState.status === 'RESOLVED') {
      const existing = this.incidents.find(i => i.id === this.incidentState.id);
      if (!existing) {
        this.incidents.unshift({ ...this.incidentState, archivedAt: new Date().toISOString() });
        this.saveIncidents();
      }
    }
  }
}

export const store = new Store();
