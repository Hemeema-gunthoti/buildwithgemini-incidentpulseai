import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/server.js';
import { simulator } from '../src/simulator.js';
import { store } from '../src/store.js';
import { dispatchAutonomousAgents, generatePostMortem } from '../src/gemini.js';
import { executeRunbook } from '../src/runbook.js';

describe('End-to-End Autonomous Incident War-Room Flow', () => {
  it('should run full incident lifecycle: Inject -> Autonomous Triage & RCA -> Runbook Approval -> Recovery -> Post-Mortem', async () => {
    // 1. Reset system to baseline
    simulator.reset();
    expect(store.incidentState.status).toBe('STEADY');

    // 2. Inject Failure Scenario A (Stripe 504 Timeout Cascade)
    const injectStart = Date.now();
    const injectRes = await request(app)
      .post('/api/simulator/inject')
      .send({ scenario: 'payment_cascade', intensity: 1.0 });

    const injectDuration = Date.now() - injectStart;
    expect(injectDuration).toBeLessThan(300); // Trigger within 300ms
    expect(injectRes.status).toBe(200);
    expect(injectRes.body.incident.status).toBe('ACTIVE');
    expect(['ACTIVE', 'INVESTIGATING']).toContain(store.incidentState.status);
    // 3. Wait for background Autonomous Multi-Agent Loop (dispatched by /api/simulator/inject)
    let retries = 0;
    while (store.agentStates.comms.status !== 'done' && retries < 100) {
      await new Promise(r => setTimeout(r, 20));
      retries++;
    }

    // Verify Triage Agent completed
    expect(store.agentStates.triage.status).toBe('done');
    expect(store.agentStates.triage.thought).toContain('Triage Assessment');
    expect(store.agentStates.triage.tokens).toBeGreaterThan(0);

    // Verify Investigator Agent completed
    expect(store.agentStates.investigator.status).toBe('done');
    expect(store.agentStates.investigator.thought).toContain('Root Cause');
    expect(store.agentStates.investigator.thought).toContain('Stripe');

    // Verify Remediation Agent completed & prepared runbook
    expect(store.agentStates.remediation.status).toBe('done');
    expect(store.incidentState.activeRunbook).toBeDefined();
    expect(store.incidentState.activeRunbook.steps.length).toBe(4);
    expect(store.incidentState.activeRunbook.diff).toBeDefined();

    // Verify Comms Agent completed
    expect(store.agentStates.comms.status).toBe('done');
    expect(store.agentStates.comms.thought).toContain('Status Page');

    // 4. Operator approves Runbook -> Execute Fix
    const runbookId = store.incidentState.activeRunbook.id;
    const execResult = await executeRunbook(runbookId);
    expect(execResult.success).toBe(true);

    // System should now be restored to RESOLVED
    expect(store.incidentState.status).toBe('RESOLVED');
    expect(store.incidentState.mitigatedAt).toBeDefined();
    expect(store.incidentState.mttmSeconds).toBeGreaterThanOrEqual(0);

    // 5. Generate Post-Mortem Report
    const postMortemRes = await request(app)
      .post('/api/postmortem/generate')
      .send({ scenarioKey: 'payment_cascade' });

    expect(postMortemRes.status).toBe(200);
    expect(postMortemRes.body.markdown).toContain('# Post-Mortem: Incident');
    expect(postMortemRes.body.markdown).toContain('```mermaid');
    expect(postMortemRes.body.markdown).toContain('5-Whys Root Cause Analysis');
    expect(postMortemRes.body.markdown).toContain('Action Items & Preventative Measures');
  });
});
