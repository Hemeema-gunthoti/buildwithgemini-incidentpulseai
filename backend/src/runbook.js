import { store } from './store.js';
import { simulator } from './simulator.js';

let isExecuting = false;

export async function executeRunbook(runbookId) {
  if (isExecuting) {
    throw new Error('A runbook is currently being executed.');
  }

  const activeRunbook = store.incidentState.activeRunbook;
  if (!activeRunbook || activeRunbook.id !== runbookId) {
    throw new Error('Runbook not found or no longer active.');
  }

  isExecuting = true;
  store.updateIncidentState({ status: 'MITIGATING' });
  store.addTimelineEvent(
    'Operator Approved Runbook',
    `Human operator confirmed safety gate. Beginning automated execution of ${activeRunbook.steps.length} remediation commands.`,
    'WARN'
  );

  try {
    const steps = activeRunbook.steps;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepIndex = i + 1;
      const totalSteps = steps.length;

      // Broadcast step start
      store.broadcast('runbook_progress', {
        runbookId,
        stepIndex,
        totalSteps,
        status: 'executing',
        step,
      });

      // Emits execution log to terminal
      store.addLog({
        level: 'INFO',
        service: 'runbook-executor',
        message: `[RUNBOOK EXEC] [Step ${stepIndex}/${totalSteps}] ${step.title}: \`${step.command}\``,
      });

      // Realistic command execution delay (fast during testing)
      const stepDelay = process.env.NODE_ENV === 'test' ? 10 : 750;
      await new Promise(resolve => setTimeout(resolve, stepDelay));

      // Generated realistic command output
      let stdout = '';
      if (step.command.startsWith('kubectl patch')) {
        stdout = 'configmap/payment-routing-config patched\npayment-service-deployment restarted with updated config';
      } else if (step.command.startsWith('kubectl set env')) {
        stdout = 'deployment.apps/payment-service env updated (HTTP_POOL_MAX_CONNECTIONS=250, HTTP_SOCKET_TIMEOUT_MS=3000)';
      } else if (step.command.startsWith('kubectl scale')) {
        stdout = 'deployment.apps/checkout-api scaled to 8 replicas (8/8 ready in 1.4s)';
      } else if (step.command.startsWith('psql')) {
        stdout = 'pg_terminate_backend: PID 14022 terminated successfully. Lock released. Query duration: 0.12ms';
      } else if (step.command.startsWith('pgbouncer-cli')) {
        stdout = 'PAUSE users_db: OK\nRELOAD configuration: OK\nRESUME users_db: OK (active connections reset: 18/90)';
      } else if (step.command.startsWith('kubectl rollout restart')) {
        stdout = 'deployment.apps/analytics-collector restarted\npod/analytics-collector-8d2a1-jk91 ready';
      } else {
        stdout = 'Command executed successfully. Exit code 0.';
      }

      store.addLog({
        level: 'INFO',
        service: 'runbook-executor',
        message: `[SUCCESS] ${stdout.split('\n')[0]}`,
      });

      // Broadcast step complete
      store.broadcast('runbook_progress', {
        runbookId,
        stepIndex,
        totalSteps,
        status: 'completed',
        stdout,
      });

      await new Promise(resolve => setTimeout(resolve, 250));
    }

    // All steps completed! Transition simulator back to normal
    simulator.reset();

    store.broadcast('runbook_completed', {
      runbookId,
      status: 'SUCCESS',
      message: 'All remediation commands completed successfully. Systems restored.',
    });

    return { success: true, message: 'Runbook executed successfully' };
  } finally {
    isExecuting = false;
  }
}

export function rejectRunbook(runbookId, reason) {
  store.updateIncidentState({
    activeRunbook: null,
  });

  store.addTimelineEvent(
    'Runbook Rejected by Operator',
    `Operator declined proposed execution. Reason: ${reason || 'Alternative mitigation requested.'}`,
    'WARN'
  );

  store.addLog({
    level: 'WARN',
    service: 'operator-gate',
    message: `Runbook [${runbookId}] rejected by operator. Reason: ${reason || 'Operator override'}`,
  });

  return { success: true, message: 'Runbook rejected' };
}
