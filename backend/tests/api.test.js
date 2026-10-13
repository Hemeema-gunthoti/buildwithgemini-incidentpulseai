import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/server.js';
import { simulator } from '../src/simulator.js';

describe('IncidentPulse AI API Endpoints', () => {
  beforeEach(() => {
    simulator.reset();
  });

  afterEach(() => {
    simulator.reset();
  });

  it('GET /api/health should return ok with system mode', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('geminiLive');
    expect(res.body).toHaveProperty('mode');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET /api/simulator/scenarios should list all 3 scenarios', async () => {
    const res = await request(app).get('/api/simulator/scenarios');
    expect(res.status).toBe(200);
    expect(res.body.scenarios).toHaveLength(3);
    const keys = res.body.scenarios.map(s => s.key);
    expect(keys).toContain('payment_cascade');
    expect(keys).toContain('db_deadlock');
    expect(keys).toContain('memory_leak');
  });

  it('POST /api/simulator/inject should trigger failure within 300ms', async () => {
    const startTime = Date.now();
    const res = await request(app)
      .post('/api/simulator/inject')
      .send({ scenario: 'memory_leak', intensity: 1.2 });
    
    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeLessThan(300);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.incident.status).toBe('ACTIVE');
    expect(res.body.incident.severity).toBe('P2');
  });

  it('POST /api/simulator/reset should return system to steady state', async () => {
    await request(app)
      .post('/api/simulator/inject')
      .send({ scenario: 'db_deadlock' });

    const res = await request(app).post('/api/simulator/reset');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.incident.status).toBe('RESOLVED');
  });

  it('POST /api/postmortem/generate should return formatted markdown with Mermaid diagram', async () => {
    const res = await request(app)
      .post('/api/postmortem/generate')
      .send({ scenarioKey: 'payment_cascade' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.markdown).toContain('# Post-Mortem: Incident');
    expect(res.body.markdown).toContain('```mermaid');
    expect(res.body.markdown).toContain('5-Whys Root Cause Analysis');
  });

  it('POST /api/runbook/execute should initiate execution of active runbook', async () => {
    // Inject failure which sets active runbook
    await request(app).post('/api/simulator/inject').send({ scenario: 'payment_cascade' });
    
    // Simulate setting active runbook
    const { store } = await import('../src/store.js');
    store.updateIncidentState({
      activeRunbook: {
        id: 'rb-test-1',
        title: 'Test Runbook',
        steps: [
          { stepNumber: 1, title: 'Step 1', command: 'echo test' }
        ]
      }
    });

    const res = await request(app)
      .post('/api/runbook/execute')
      .send({ runbookId: 'rb-test-1' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/runbook/reject should reject proposed runbook', async () => {
    const res = await request(app)
      .post('/api/runbook/reject')
      .send({ runbookId: 'rb-test-1', reason: 'Unsafe command' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
