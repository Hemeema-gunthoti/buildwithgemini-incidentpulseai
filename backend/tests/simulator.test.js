import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { simulator, SCENARIOS } from '../src/simulator.js';
import { store } from '../src/store.js';

describe('Chaos Simulator Engine', () => {
  beforeEach(() => {
    simulator.reset();
  });

  afterEach(() => {
    simulator.reset();
  });

  it('should define all three required outage scenarios', () => {
    expect(SCENARIOS).toHaveProperty('payment_cascade');
    expect(SCENARIOS).toHaveProperty('db_deadlock');
    expect(SCENARIOS).toHaveProperty('memory_leak');

    expect(SCENARIOS.payment_cascade.name).toContain('Payment Gateway Timeout');
    expect(SCENARIOS.db_deadlock.name).toContain('PostgreSQL Connection Pool');
    expect(SCENARIOS.memory_leak.name).toContain('Memory Leak');
  });

  it('should start in steady state with low error rate and healthy status', () => {
    expect(store.incidentState.status).toBe('STEADY');
    expect(store.incidentState.severity).toBe('P3');
  });

  it('should inject failure scenario and transition state to ACTIVE', () => {
    const incident = simulator.injectFailure('payment_cascade', 1.0);
    expect(incident.status).toBe('ACTIVE');
    expect(incident.severity).toBe('P1');
    expect(incident.scenarioKey).toBe('payment_cascade');
    expect(incident.affectedServices).toContain('payment-service');
    expect(incident.affectedServices).toContain('checkout-api');

    // Recent logs should contain error messages
    const logs = store.getLogs({ level: 'ERROR' });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs.some(l => l.service === 'payment-service' || l.service === 'checkout-api')).toBe(true);
  });

  it('should reset system and transition state to RESOLVED/STEADY', () => {
    simulator.injectFailure('db_deadlock', 1.0);
    expect(store.incidentState.status).toBe('ACTIVE');

    const resolved = simulator.reset();
    expect(resolved.status).toBe('RESOLVED');
    expect(resolved.mitigatedAt).toBeDefined();
    expect(resolved.mttmSeconds).toBeGreaterThanOrEqual(0);
  });

  it('should support search and level filtering on logs', () => {
    store.addLog({ level: 'ERROR', service: 'custom-auth', message: 'Token validation failure' });
    store.addLog({ level: 'INFO', service: 'custom-auth', message: 'Worker initialized' });

    const errorLogs = store.getLogs({ level: 'ERROR', service: 'custom-auth' });
    expect(errorLogs.length).toBe(1);
    expect(errorLogs[0].message).toBe('Token validation failure');

    const searchLogs = store.getLogs({ search: 'Token validation' });
    expect(searchLogs.length).toBe(1);
  });
});
