import { store } from './store.js';

export const SCENARIOS = {
  payment_cascade: {
    key: 'payment_cascade',
    name: 'Payment Gateway Timeout Cascades (Stripe API 504s)',
    severity: 'P1',
    affectedServices: ['payment-service', 'checkout-api', 'order-worker', 'ingress-gateway'],
    summary: 'Third-party Stripe API upstream latency surge causing connection pool exhaustion, thread starvation, and cascading 504 Gateway Timeouts across checkout services.',
    targetMetrics: {
      latencyP50: 1250,
      latencyP95: 3800,
      latencyP99: 4950,
      errorRate: 38.4,
      rps: 680,
      cpu: 89,
      memory: 76,
      dbPoolActive: 92,
      dbPoolWaiting: 180,
    },
    logTemplates: [
      { level: 'ERROR', service: 'payment-service', message: 'HTTP 504 Gateway Timeout from api.stripe.com/v1/charges (elapsed: 10002ms)', error: 'UpstreamGatewayTimeout' },
      { level: 'ERROR', service: 'checkout-api', message: 'ConnectionPoolTimeoutException: Timeout waiting for connection from pool after 5000ms [pool=stripe-http-client, max=50]', error: 'PoolExhaustion' },
      { level: 'WARN', service: 'ingress-gateway', message: 'CircuitBreaker "stripe-charges" state transitioned from CLOSED to OPEN (failure rate: 42.8% > threshold: 20%)', error: 'CircuitBreakerOpen' },
      { level: 'ERROR', service: 'order-worker', message: 'Thread pool starvation detected in PaymentProcessorTaskExecutor (activeThreads=128/128, queuedTasks=492)', error: 'ThreadStarvation' },
      { level: 'WARN', service: 'payment-service', message: 'Backoff retry attempt 3/3 exhausted for charge_txn_9a7d83f; routing to dead-letter queue', error: 'RetryExhausted' },
      { level: 'INFO', service: 'checkout-api', message: 'Fallback degrade mode: showing user retry prompt on checkout confirmation', error: null },
    ],
  },
  db_deadlock: {
    key: 'db_deadlock',
    name: 'PostgreSQL Connection Pool Exhaustion & Deadlock',
    severity: 'P1',
    affectedServices: ['auth-service', 'account-db-primary', 'user-session-store', 'pgbouncer'],
    summary: 'Unindexed migration locking user_sessions table causing mutual exclusive lock contention, transaction deadlocks, and pool saturation.',
    targetMetrics: {
      latencyP50: 950,
      latencyP95: 2900,
      latencyP99: 4200,
      errorRate: 46.2,
      rps: 520,
      cpu: 98,
      memory: 88,
      dbPoolActive: 100,
      dbPoolWaiting: 412,
    },
    logTemplates: [
      { level: 'ERROR', service: 'account-db-primary', message: 'FATAL: remaining connection slots are reserved for non-replication superuser connections (max_connections=100)', error: 'OutOfConnections' },
      { level: 'ERROR', service: 'account-db-primary', message: 'ERROR: deadlock detected: Process 14022 waits for ExclusiveLock on relation user_sessions (blocked by Process 14035)', error: 'DeadlockDetected' },
      { level: 'ERROR', service: 'pgbouncer', message: 'server_login_retry: out of connections in pool "users_db", 380 clients queued in wait queue', error: 'PgBouncerPoolStarved' },
      { level: 'WARN', service: 'auth-service', message: 'Transaction rollback rate exceeded 64% over 60s sliding window on /api/v2/auth/verify', error: 'HighRollbackRate' },
      { level: 'ERROR', service: 'user-session-store', message: 'QueryExecutionException: Lock wait timeout of 30000ms exceeded on UPDATE user_sessions SET last_active_at = NOW()', error: 'LockWaitTimeout' },
      { level: 'INFO', service: 'auth-service', message: 'Health probe /healthz degraded: database latency 3240ms > threshold 500ms', error: null },
    ],
  },
  memory_leak: {
    key: 'memory_leak',
    name: 'Microservice Memory Leak & Container OOMKilled Loop',
    severity: 'P2',
    affectedServices: ['analytics-collector', 'k8s-kubelet', 'inventory-indexer'],
    summary: 'Unbounded in-memory LRU cache with non-evicting hash map causing JVM old gen exhaustion, constant full GC pauses, and recurring SIGKILL OOM terminations.',
    targetMetrics: {
      latencyP50: 640,
      latencyP95: 2100,
      latencyP99: 3400,
      errorRate: 26.8,
      rps: 810,
      cpu: 94,
      memory: 99.4,
      dbPoolActive: 44,
      dbPoolWaiting: 12,
    },
    logTemplates: [
      { level: 'ERROR', service: 'analytics-collector', message: 'java.lang.OutOfMemoryError: Java heap space [allocated: 2048MB, required: 48MB]', error: 'OutOfMemoryError' },
      { level: 'WARN', service: 'analytics-collector', message: 'Major GC pause took 11840ms; stop-the-world collector paused 8 application worker threads', error: 'SevereGCPause' },
      { level: 'ERROR', service: 'k8s-kubelet', message: 'Container "analytics-worker" exceeded memory limit (2048MiB); sending SIGKILL: OOMKilled (Exit Code 137)', error: 'OOMKilled' },
      { level: 'WARN', service: 'k8s-kubelet', message: 'Back-off 5m0s restarting failed container analytics-worker pod analytics-collector-7f9b6-xk82l', error: 'CrashLoopBackOff' },
      { level: 'ERROR', service: 'inventory-indexer', message: 'Liveness probe failed: HTTP probe for http://10.244.2.81:8080/health failed with statuscode: 500', error: 'LivenessProbeFailure' },
      { level: 'INFO', service: 'analytics-collector', message: 'Pod analytics-collector-7f9b6-xk82l restarted (restartCount: 14)', error: null },
    ],
  },
};

const STEADY_METRICS = {
  latencyP50: 42,
  latencyP95: 98,
  latencyP99: 145,
  errorRate: 0.04,
  rps: 1350,
  cpu: 24,
  memory: 46,
  dbPoolActive: 18,
  dbPoolWaiting: 0,
};

const STEADY_LOGS = [
  { level: 'INFO', service: 'ingress-gateway', message: 'GET /api/v1/catalog/items status=200 duration=38ms user_agent="Mozilla/5.0"' },
  { level: 'INFO', service: 'auth-service', message: 'Token validated successfully for user_id=usr_88291 token_type=Bearer' },
  { level: 'INFO', service: 'checkout-api', message: 'POST /api/v2/orders/checkout status=201 order_id=ord_81726 txn_status=SUCCESS' },
  { level: 'INFO', service: 'payment-service', message: 'Payment intent pi_3Nx928a completed via primary route [stripe-us-east]' },
  { level: 'INFO', service: 'account-db-primary', message: 'Connection pool active: 18/100, idle: 82, avg_query_time: 2.4ms' },
  { level: 'INFO', service: 'analytics-collector', message: 'Batch telemetry flush: 1200 events committed to downstream storage' },
];

class ChaosSimulator {
  constructor() {
    this.currentScenario = null;
    this.intensity = 1.0;
    this.isRunning = false;
    this.metricsTimer = null;
    this.logsTimer = null;
    this.currentMetrics = { ...STEADY_METRICS };
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Stream metrics every 1 second
    this.metricsTimer = setInterval(() => {
      this.tickMetrics();
    }, 1000);

    // Stream logs every 700ms
    this.logsTimer = setInterval(() => {
      this.tickLogs();
    }, 700);
  }

  stop() {
    this.isRunning = false;
    if (this.metricsTimer) clearInterval(this.metricsTimer);
    if (this.logsTimer) clearInterval(this.logsTimer);
  }

  injectFailure(scenarioKey, intensity = 1.0) {
    const scenario = SCENARIOS[scenarioKey];
    if (!scenario) {
      throw new Error(`Unknown scenario: ${scenarioKey}`);
    }

    this.currentScenario = scenario;
    this.intensity = Math.max(0.5, Math.min(2.0, intensity));

    const incidentId = `INC-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    store.updateIncidentState({
      id: incidentId,
      title: scenario.name,
      status: 'ACTIVE',
      severity: scenario.severity,
      scenarioKey: scenario.key,
      scenarioName: scenario.name,
      startedAt: now,
      detectedAt: now,
      mitigatedAt: null,
      mttdSeconds: Math.floor(12 + Math.random() * 8), // Realistic 12-20s detection time
      mttmSeconds: 0,
      affectedServices: scenario.affectedServices,
      summary: scenario.summary,
      timeline: [],
      activeRunbook: null,
      postMortem: null,
    });

    store.addTimelineEvent(
      'Anomaly Detected',
      `Error rate spiked across [${scenario.affectedServices.join(', ')}]. Automated alerting threshold breached.`,
      'ERROR'
    );

    // Immediately emit 3 critical failure logs
    for (let i = 0; i < 3; i++) {
      const tmpl = scenario.logTemplates[i % scenario.logTemplates.length];
      store.addLog({
        level: tmpl.level,
        service: tmpl.service,
        message: tmpl.message,
        metadata: { error: tmpl.error, intensity: this.intensity },
      });
    }

    return store.incidentState;
  }

  reset() {
    this.currentScenario = null;
    this.intensity = 1.0;
    this.currentMetrics = { ...STEADY_METRICS };

    const wasActive = store.incidentState.status !== 'STEADY';
    if (wasActive) {
      const now = new Date().toISOString();
      const started = new Date(store.incidentState.startedAt || now).getTime();
      const mttm = Math.max(1, Math.floor((Date.now() - started) / 1000));

      store.updateIncidentState({
        status: 'RESOLVED',
        mitigatedAt: now,
        mttmSeconds: mttm,
      });

      store.addTimelineEvent(
        'System Stabilized',
        'All telemetry parameters returned to steady-state baselines. Health probes 100% green.',
        'SUCCESS'
      );

      store.archiveCurrentIncident();
    } else {
      store.updateIncidentState({
        id: null,
        title: 'Systems Nominal',
        status: 'STEADY',
        severity: 'P3',
        scenarioKey: null,
        scenarioName: 'Normal Operations',
        startedAt: null,
        detectedAt: null,
        mitigatedAt: null,
        mttdSeconds: 0,
        mttmSeconds: 0,
        affectedServices: [],
      });
      store.resetAgents();
    }

    // Add steady log
    store.addLog({
      level: 'INFO',
      service: 'orchestrator',
      message: 'System baseline restored. Active connections and latency within SLA.',
    });

    return store.incidentState;
  }

  tickMetrics() {
    const jitter = (val, pct = 0.05) => {
      const delta = (Math.random() * 2 - 1) * pct * val;
      return Math.max(0, Number((val + delta).toFixed(1)));
    };

    if (this.currentScenario) {
      const t = this.currentScenario.targetMetrics;
      const factor = this.intensity;
      this.currentMetrics = {
        timestamp: new Date().toISOString(),
        latencyP50: Math.round(jitter(t.latencyP50 * factor, 0.08)),
        latencyP95: Math.round(jitter(t.latencyP95 * factor, 0.08)),
        latencyP99: Math.round(jitter(t.latencyP99 * factor, 0.06)),
        errorRate: Math.min(99.9, jitter(t.errorRate * factor, 0.1)),
        rps: Math.round(jitter(t.rps, 0.1)),
        cpu: Math.min(100, Math.round(jitter(t.cpu * factor, 0.04))),
        memory: Math.min(100, jitter(t.memory * (0.9 + 0.1 * factor), 0.02)),
        dbPoolActive: Math.min(100, Math.round(jitter(t.dbPoolActive, 0.05))),
        dbPoolWaiting: Math.round(jitter(t.dbPoolWaiting * factor, 0.1)),
      };
    } else {
      // Steady State
      this.currentMetrics = {
        timestamp: new Date().toISOString(),
        latencyP50: Math.round(jitter(STEADY_METRICS.latencyP50, 0.08)),
        latencyP95: Math.round(jitter(STEADY_METRICS.latencyP95, 0.08)),
        latencyP99: Math.round(jitter(STEADY_METRICS.latencyP99, 0.06)),
        errorRate: jitter(STEADY_METRICS.errorRate, 0.2),
        rps: Math.round(jitter(STEADY_METRICS.rps, 0.05)),
        cpu: Math.round(jitter(STEADY_METRICS.cpu, 0.06)),
        memory: jitter(STEADY_METRICS.memory, 0.02),
        dbPoolActive: Math.round(jitter(STEADY_METRICS.dbPoolActive, 0.1)),
        dbPoolWaiting: 0,
      };
    }

    store.broadcast('metrics', this.currentMetrics);
  }

  tickLogs() {
    if (this.currentScenario) {
      const templates = this.currentScenario.logTemplates;
      // 80% chance failure log, 20% background log
      if (Math.random() < 0.8) {
        const tmpl = templates[Math.floor(Math.random() * templates.length)];
        store.addLog({
          level: tmpl.level,
          service: tmpl.service,
          message: tmpl.message,
          metadata: { error: tmpl.error },
        });
      } else {
        const steady = STEADY_LOGS[Math.floor(Math.random() * STEADY_LOGS.length)];
        store.addLog(steady);
      }
    } else {
      // Steady mode: 1 log every 1.5-2s
      if (Math.random() < 0.6) {
        const tmpl = STEADY_LOGS[Math.floor(Math.random() * STEADY_LOGS.length)];
        store.addLog(tmpl);
      }
    }
  }
}

export const simulator = new ChaosSimulator();
simulator.start();
