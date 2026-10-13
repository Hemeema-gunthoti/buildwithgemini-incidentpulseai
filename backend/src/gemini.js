import { GoogleGenAI } from '@google/genai';
import { store } from './store.js';

let geminiClient = null;
const apiKey = process.env.GEMINI_API_KEY || '';

if (apiKey && apiKey.trim() !== '' && apiKey !== 'your-api-key-here') {
  try {
    geminiClient = new GoogleGenAI({ apiKey });
    console.log('✅ Google Gemini SDK initialized with API key');
  } catch (err) {
    console.warn('⚠️ Failed to initialize Google GenAI SDK:', err.message);
  }
} else {
  console.log('ℹ️ No GEMINI_API_KEY provided; IncidentPulse AI running in high-fidelity offline simulation mode');
}

export function isGeminiLive() {
  return geminiClient !== null;
}

// Fallback high-fidelity structured responses for the 3 chaos scenarios
const FALLBACK_KNOWLEDGE_BASE = {
  payment_cascade: {
    triage: `### 🚨 Triage Assessment: P1 CRITICAL
- **Incident ID:** INC-PAY-8821
- **Severity Level:** **P1 - CRITICAL OUTAGE** (Immediate Escalation)
- **Blast Radius:** All customer checkout flows, subscription renewals, point-of-sale API
- **Affected Microservices:**
  - \`ingress-gateway\` (Gateway latency: +820%)
  - \`checkout-api\` (Thread pool exhaustion: 100% saturated)
  - \`payment-service\` (Circuit breaker tripped to OPEN)
  - \`order-worker\` (Message backlog: 4,200 pending jobs)
- **Initial Hypothesis:** Upstream payment provider (\`api.stripe.com\`) is encountering regional availability degradation, causing unhandled 504 timeouts to back-propagate and exhaust connection pools across the checkout cluster.`,
    
    investigator: `### 🔍 Deep Root Cause Analysis (Investigator Agent)
- **Target Analysis:** Correlated 142 error traces across \`payment-service\` and \`checkout-api\`.
- **Stack Trace Correlation:**
  \`\`\`text
  HTTP 504 Gateway Timeout from api.stripe.com/v1/charges (elapsed: 10002ms)
  ConnectionPoolTimeoutException: Timeout waiting for connection from pool after 5000ms
  \`\`\`
- **Root Cause Identified:**
  1. \`api.stripe.com\` experienced a 10s latency surge on \`/v1/charges\`.
  2. The HTTP client connection pool in \`payment-service\` has a conservative pool limit of **50 connections** with a **10s read timeout**.
  3. When checkout traffic sustained 680 RPS, all 50 sockets locked waiting on Stripe, causing incoming HTTP requests to queue indefinitely until thread pool starvation occurred.
  4. Cascading 504s triggered the Envoy ingress circuit breaker, dropping 38.4% of customer checkout attempts.
- **Suspect Commit:** \`commit e82c91a\` ("Reduce payment client connection pool to conserve memory", merged 3h ago).`,

    remediation: {
      summary: "Enable redundant payment gateway fallback route (Adyen secondary), scale checkout workers, and increase HTTP socket pool capacity.",
      riskLevel: "LOW",
      blastRadius: "Checkout routing & payment worker pool",
      runbook: {
        id: "rb-stripe-cascade-mitigation",
        title: "P1 Payment Gateway Cascade Mitigation Runbook",
        steps: [
          {
            stepNumber: 1,
            title: "Enable Secondary Gateway Fallback Route",
            command: "kubectl patch configmap payment-routing-config --patch '{\"data\":{\"PRIMARY_GATEWAY\":\"ADYEN\",\"STRIPE_CIRCUIT_BREAKER\":\"FORCED_OPEN\"}}'",
            explanation: "Forces traffic to route through secondary payment provider while Stripe resolves upstream issues.",
          },
          {
            stepNumber: 2,
            title: "Expand Payment HTTP Connection Pool Limit",
            command: "kubectl set env deployment/payment-service HTTP_POOL_MAX_CONNECTIONS=250 HTTP_SOCKET_TIMEOUT_MS=3000",
            explanation: "Increases socket pool headroom and lowers read timeout from 10s to 3s to prevent thread blocking.",
          },
          {
            stepNumber: 3,
            title: "Scale Out Checkout API Replicas",
            command: "kubectl scale deployment checkout-api --replicas=8",
            explanation: "Absorbs queued worker backlog and restores sub-100ms request handling.",
          },
          {
            stepNumber: 4,
            title: "Drain Dead-Letter Retry Queue",
            command: "curl -X POST http://payment-service.internal/admin/dlq/replay?batch_size=100",
            explanation: "Replays dropped transaction intents through the secondary gateway without double-charging.",
          }
        ],
        diff: `--- payment-config.yaml (live)
+++ payment-config.yaml (proposed)
@@ -12,4 +12,4 @@
-PRIMARY_GATEWAY: STRIPE
-STRIPE_CIRCUIT_BREAKER: AUTOMATIC
-HTTP_POOL_MAX_CONNECTIONS: 50
-HTTP_SOCKET_TIMEOUT_MS: 10000
+PRIMARY_GATEWAY: ADYEN
+STRIPE_CIRCUIT_BREAKER: FORCED_OPEN
+HTTP_POOL_MAX_CONNECTIONS: 250
+HTTP_SOCKET_TIMEOUT_MS: 3000`
      }
    },

    comms: `### 📢 Incident Communications Brief

#### 1. Public Status Page Announcement
> **Investigating - Degraded Checkout Performance**
> We are currently investigating an issue affecting credit card checkout and subscription purchases. Our SRE team has identified upstream provider latency and is actively rerouting payment traffic to our secondary provider. Customers may experience brief transaction retries. We will post updates every 15 minutes.

#### 2. Internal Engineering Slack (\`#incident-sev1\`)
> 🚨 **SEV-1 ALERT: Checkout Degradation**
> - **Lead SRE:** IncidentPulse Autonomous Bot
> - **Impact:** ~38% of checkout calls failing with 504
> - **Root Cause:** Stripe upstream timeouts exhausting \`payment-service\` connection pool
> - **Remediation:** Rerouting payment stream to Adyen fallback + scaling checkout replicas to 8. Approval requested in War-Room.

#### 3. Executive / Leadership Brief
> - **Business Impact:** Approximately $14,200 in deferred transaction volume over the last 18 minutes.
> - **Customer Safety:** No duplicate charges recorded. Idempotency keys preserved.
> - **Expected Recovery:** Full recovery estimated within 4 minutes of runbook execution approval.`,

    postMortem: `# Post-Mortem: Incident INC-PAY-8821 (Stripe Gateway Cascade)

## Executive Summary
On October 13, 2026, between 08:42 UTC and 09:05 UTC, our primary e-commerce checkout pipeline suffered a **P1 Critical Outage**. Customers experienced a peak error rate of **38.4%** and p99 latency surge to **4,950ms**. The incident was resolved after the autonomous SRE agent identified upstream Stripe 504 timeouts, rerouted live traffic to the secondary gateway (Adyen), and expanded HTTP connection pool parameters.

\`\`\`mermaid
graph TD
    Client[Web & Mobile Clients] -->|Checkout Requests| Ingress[Ingress Gateway]
    Ingress -->|Spike Latency 4.9s| Checkout[checkout-api Pods]
    Checkout -->|Connection Exhausted| Payment[payment-service]
    Payment -.->|504 Timeout 10s| Stripe[Stripe API Upstream - DEGRADED]
    Payment ==>|Remediation Route Switch| Adyen[Adyen Gateway - HEALTHY 120ms]
    
    style Stripe fill:#f87171,stroke:#b91c1c
    style Adyen fill:#4ade80,stroke:#15803d
    style Ingress fill:#60a5fa,stroke:#1d4ed8
\`\`\`

## 5-Whys Root Cause Analysis
1. **Why did checkouts fail?** Ingress gateway dropped requests with 504 Bad Gateway.
2. **Why did ingress drop requests?** The \`checkout-api\` thread pool was completely starved (128/128 threads busy).
3. **Why were checkout threads starved?** Synchronous calls to \`payment-service\` blocked waiting for available HTTP sockets.
4. **Why were HTTP sockets exhausted?** \`payment-service\` had a maximum pool limit of 50 connections with a 10s read timeout waiting on Stripe.
5. **Why did Stripe take 10s?** Upstream Stripe US-East API experienced an unannounced partial outage.

## Incident Timeline
| Time (UTC) | Event |
|---|---|
| 08:42:10 | First automated anomaly alarm triggered (Error rate > 5%). |
| 08:42:24 | Triage Agent classified incident as P1 CRITICAL; dispatched Investigator Agent. |
| 08:43:05 | Investigator Agent correlated 142 stack traces; isolated HTTP pool starvation. |
| 08:43:40 | Remediation Agent generated 4-step runbook with Adyen route failover. |
| 08:44:15 | SRE Operator reviewed and approved runbook execution. |
| 08:45:30 | Traffic rerouted; error rate plummeted to 0.04%; p99 latency normalized to 145ms. |

## Action Items & Preventative Measures
- [ ] **AI-Runbook**: Set up automatic circuit-breaker threshold auto-tuning [Owner: Payments Team, Due: 3 days]
- [ ] **Architecture**: Implement asynchronous payment intent queues with worker thread isolation [Owner: Core SRE, Due: 2 weeks]
- [ ] **Monitoring**: Add proactive synthetic canary probes against all third-party payment endpoints [Owner: Devops, Due: 1 week]`
  },

  db_deadlock: {
    triage: `### 🚨 Triage Assessment: P1 CRITICAL
- **Incident ID:** INC-DB-4019
- **Severity Level:** **P1 - DATABASE INTEGRITY DEGRADATION**
- **Blast Radius:** User authentication, session management, profile updates, account dashboard
- **Affected Microservices:**
  - \`account-db-primary\` (PostgreSQL connections: 100/100 SATURATED)
  - \`auth-service\` (HTTP 500 error rate: 46.2%)
  - \`pgbouncer\` (Client wait queue: 412 connections waiting)
  - \`user-session-store\` (Lock wait timeouts > 30s)
- **Initial Hypothesis:** Concurrent migration script or batch transaction holding an exclusive lock on \`user_sessions\` table, blocking routine authorization queries and creating cascading connection starvation.`,

    investigator: `### 🔍 Deep Root Cause Analysis (Investigator Agent)
- **Target Analysis:** PostgreSQL \`pg_stat_activity\` and query lock graph inspection.
- **Lock Contention Graph:**
  \`\`\`text
  Process 14022 (ExclusiveLock on relation 'user_sessions') BLOCKS
    -> Process 14035 (waiting for RowExclusiveLock on 'user_sessions')
    -> Process 14041 (waiting for ShareLock on 'user_sessions')
    -> 380 queued client connections in PgBouncer pool
  \`\`\`
- **Root Cause Identified:**
  1. A newly dispatched data cleanup cron job executed \`ALTER TABLE user_sessions ADD COLUMN last_login_ip inet;\` without the \`NOT VALID\` concurrency clause.
  2. The operation acquired an \`AccessExclusiveLock\` on \`user_sessions\`.
  3. Every incoming API request requiring session validation attempted to acquire an \`AccessShareLock\` and was queued.
  4. PgBouncer pool saturated in 14 seconds, exhausting all 100 connection slots.
- **Suspect Query:** \`PID 14022: ALTER TABLE user_sessions ADD COLUMN last_login_ip inet;\` (duration: 412s).`,

    remediation: {
      summary: "Terminate blocking query process PID 14022, flush stale PgBouncer client queues, and reload database connection pool.",
      riskLevel: "MEDIUM",
      blastRadius: "Database active connections & lock table",
      runbook: {
        id: "rb-db-deadlock-mitigation",
        title: "P1 PostgreSQL Deadlock & Pool Starvation Remediation",
        steps: [
          {
            stepNumber: 1,
            title: "Terminate Blocking DDL Process",
            command: "psql -h account-db-primary -U postgres -c 'SELECT pg_terminate_backend(14022);'",
            explanation: "Immediately releases the AccessExclusiveLock on user_sessions, unblocking all queued transactions.",
          },
          {
            stepNumber: 2,
            title: "Drain Stale Lock Waiters",
            command: "psql -h account-db-primary -U postgres -c \"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction' AND query_start < NOW() - INTERVAL '30 seconds';\"",
            explanation: "Clears abandoned connections held open by timed-out client sockets.",
          },
          {
            stepNumber: 3,
            title: "Reload PgBouncer Pool Configuration",
            command: "pgbouncer-cli -h pgbouncer-service -p 6432 -c 'PAUSE users_db; RELOAD; RESUME users_db;'",
            explanation: "Refreshes server socket pool allocations and resets client connection counters.",
          },
          {
            stepNumber: 4,
            title: "Verify Session Table Query Performance",
            command: "psql -h account-db-primary -U postgres -c 'EXPLAIN ANALYZE SELECT * FROM user_sessions WHERE user_id = 9999 LIMIT 1;'",
            explanation: "Confirms read query latency is back to expected sub-millisecond execution.",
          }
        ],
        diff: `--- pgbouncer.ini (live)
+++ pgbouncer.ini (proposed)
@@ -14,3 +14,3 @@
-default_pool_size = 50
-max_client_conn = 500
+default_pool_size = 90
+max_client_conn = 1000`
      }
    },

    comms: `### 📢 Incident Communications Brief

#### 1. Public Status Page Announcement
> **Identified - Login & Account Portal Delays**
> Users attempting to sign in or load their account settings may experience login timeouts. The root cause has been isolated to a database lock conflict. Our engineering team is clearing the lock and normalizing database pools. No credentials or data are compromised.

#### 2. Internal Engineering Slack (\`#incident-db\`)
> 🚨 **SEV-1: PostgreSQL Pool Saturation & Lock Contention**
> - **Impact:** 46% error rate on \`auth-service\`
> - **Root Cause:** PID 14022 holding \`AccessExclusiveLock\` on \`user_sessions\` table
> - **Remediation:** Executing \`pg_terminate_backend(14022)\` and reloading PgBouncer client pool.

#### 3. Executive / Leadership Brief
> - **Affected Users:** Active login sessions degraded; existing authenticated API sessions using JWT remain functional.
> - **Data Integrity:** 100% verified. No transaction corruption.
> - **ETA to Resolution:** < 2 minutes upon runbook execution.`,

    postMortem: `# Post-Mortem: Incident INC-DB-4019 (PostgreSQL Lock Contention & Pool Starvation)

## Executive Summary
On October 13, 2026, an unindexed DDL operation on the production \`user_sessions\` table locked active transaction slots in PostgreSQL, triggering connection pool exhaustion and a **46.2% error rate** across authentication microservices. The IncidentPulse autonomous AI identified the offending process ID within 18 seconds, proposed an automated termination runbook, and restored database health upon operator approval.

\`\`\`mermaid
graph TD
    Client[Web & App Users] --> Auth[auth-service]
    Auth --> PB[PgBouncer Connection Pooler]
    PB -->|100/100 Sockets Locked| DB[(account-db-primary)]
    
    subgraph Lock Contention
        PID1[PID 14022 - AccessExclusiveLock] -.->|Blocks| PID2[PID 14035 - Read Sessions]
        PID2 -.->|Blocks| PID3[380 Queued Requests]
    end
    
    Term[Autonomous Fix: pg_terminate_backend] ==>|Releases Locks| DB
    
    style DB fill:#f87171,stroke:#b91c1c
    style PB fill:#fbbf24,stroke:#d97706
    style Term fill:#4ade80,stroke:#15803d
\`\`\`

## 5-Whys Root Cause Analysis
1. **Why did logins fail?** \`auth-service\` encountered \`FATAL: out of connection slots\`.
2. **Why were connection slots out?** PgBouncer had 412 clients queued in the pool waiting for server connections.
3. **Why were server connections busy?** All 100 database workers were blocked on an \`ExclusiveLock\` on \`user_sessions\`.
4. **Why was an exclusive lock held?** A background maintenance script executed an \`ALTER TABLE\` command.
5. **Why was it executed during peak hours?** The migration runner lacked lock timeout guards and zero-downtime DDL safety gates.

## Action Items & Preventative Measures
- [ ] **Infrastructure**: Enforce \`lock_timeout = 2000ms\` in Postgres server configuration [Owner: DB Team, Due: 2 days]
- [ ] **CI/CD**: Integrate automated DDL linter to block unsafe table rewrites in migrations [Owner: Platform Eng, Due: 1 week]
- [ ] **Architecture**: Expand read replica pool for non-transactional session validations [Owner: Core SRE, Due: 2 weeks]`
  },

  memory_leak: {
    triage: `### 🚨 Triage Assessment: P2 HIGH SEVERITY
- **Incident ID:** INC-MEM-7734
- **Severity Level:** **P2 - HIGH SEVERITY (CONTAINER CRASH LOOP)**
- **Blast Radius:** Real-time analytics pipeline, telemetry dashboards, user behavior tracking
- **Affected Microservices:**
  - \`analytics-collector\` (Memory: 99.4%, Pod restart count: 14)
  - \`k8s-kubelet\` (Kernel OOMKilled events emitted every 3m)
  - \`inventory-indexer\` (Cross-service latency degradation)
- **Initial Hypothesis:** Unbounded heap growth in \`analytics-collector\` triggering severe Java/Node.js Garbage Collection pauses (> 11s) followed by Linux kernel SIGKILL termination and Kubernetes CrashLoopBackOff.`,

    investigator: `### 🔍 Deep Root Cause Analysis (Investigator Agent)
- **Target Analysis:** JVM memory heap dump & Kubelet pod lifecycle logs.
- **Log Diagnostics:**
  \`\`\`text
  java.lang.OutOfMemoryError: Java heap space [allocated: 2048MB, required: 48MB]
  Container 'analytics-worker' exceeded memory limit (2048MiB); sending SIGKILL: OOMKilled (Exit Code 137)
  Major GC pause took 11840ms; worker threads starved
  \`\`\`
- **Root Cause Identified:**
  1. A newly enabled real-time feature flag (\`FEATURE_CLICKSTREAM_AGGREGATOR\`) caches raw session payloads in an in-memory hash map without an eviction policy (TTL or maximum size cap).
  2. Under 800+ RPS traffic, old generation heap expanded exponentially from 450MB to the 2,048MB container limit.
  3. Continuous Full GC cycles froze event handling, failing Kubernetes liveness probes.
  4. Kubelet repeatedly dispatched \`SIGKILL (137)\`, putting the pod into \`CrashLoopBackOff\`.`,

    remediation: {
      summary: "Disable unbounded clickstream feature flag, increase container memory headroom to 4GiB, and perform rolling restart of analytics deployment.",
      riskLevel: "LOW",
      blastRadius: "Analytics ingestion workers",
      runbook: {
        id: "rb-oom-leak-mitigation",
        title: "P2 Container Memory Leak & CrashLoop Remediation",
        steps: [
          {
            stepNumber: 1,
            title: "Disable Unbounded Feature Flag",
            command: "kubectl set env deployment/analytics-collector FEATURE_CLICKSTREAM_AGGREGATOR=false",
            explanation: "Halts the unbounded in-memory cache allocation immediately across all replicas.",
          },
          {
            stepNumber: 2,
            title: "Expand Pod Memory Limit to 4GiB",
            command: "kubectl set resources deployment analytics-collector --limits=memory=4096Mi,cpu=2000m --requests=memory=2048Mi,cpu=1000m",
            explanation: "Provides sufficient memory headroom while cached buffers flush safely.",
          },
          {
            stepNumber: 3,
            title: "Perform Controlled Rolling Restart",
            command: "kubectl rollout restart deployment/analytics-collector",
            explanation: "Cycles pods one by one ensuring zero downtime and fresh heap allocation.",
          },
          {
            stepNumber: 4,
            title: "Verify Pod Health & Liveness Probes",
            command: "kubectl rollout status deployment/analytics-collector --timeout=60s",
            explanation: "Validates all 4 replicas achieve 1/1 Running state and pass liveness health checks.",
          }
        ],
        diff: `--- analytics-deploy.yaml (live)
+++ analytics-deploy.yaml (proposed)
@@ -18,4 +18,4 @@
-FEATURE_CLICKSTREAM_AGGREGATOR: "true"
-resources.limits.memory: "2048Mi"
+FEATURE_CLICKSTREAM_AGGREGATOR: "false"
+resources.limits.memory: "4096Mi"`
      }
    },

    comms: `### 📢 Incident Communications Brief

#### 1. Public Status Page Announcement
> **Operational Note - Analytics & Reporting Latency**
> Internal event analytics and reporting data are experiencing temporary processing delays. Core customer-facing services and transactions remain fully operational and unaffected. Data is buffered in streaming queues and will be ingested as pods stabilize.

#### 2. Internal Engineering Slack (\`#incident-platform\`)
> ⚠️ **SEV-2: Analytics Worker OOM CrashLoop**
> - **Impact:** Analytics batch ingestion backlog (~14m delayed)
> - **Root Cause:** Feature flag \`FEATURE_CLICKSTREAM_AGGREGATOR\` memory leak
> - **Remediation:** Disabling flag, scaling pod memory limit to 4GiB, and executing rolling restart.

#### 3. Executive / Leadership Brief
> - **Business Impact:** Low. Customer purchasing and user logins completely normal.
> - **Data Loss:** 0%. All events are buffered in Kafka/PubSub durable streams.
> - **ETA:** ~3 minutes to complete rolling restart.`,

    postMortem: `# Post-Mortem: Incident INC-MEM-7734 (Analytics Collector Memory Leak & OOMKilled)

## Executive Summary
On October 13, 2026, the \`analytics-collector\` deployment entered a repetitive **Kubernetes CrashLoopBackOff** cycle triggered by an unevicted in-memory cache. Container memory exceeded the 2,048MiB cgroup limit, producing an OOMKilled (Exit Code 137) every 3 minutes. The IncidentPulse autonomous AI identified the offending feature flag and safely orchestrated a rolling rollout with expanded memory allocations.

\`\`\`mermaid
graph TD
    Stream[User Telemetry Stream] --> Pod[analytics-collector Pod]
    Pod -->|Allocates Unbounded Cache| Heap[JVM Old Gen 2048MB - FULL]
    Heap -->|Full GC Pauses > 11s| Probe[Kubelet Liveness Probe - FAILS]
    Probe -->|SIGKILL Exit 137| K8s[CrashLoopBackOff]
    
    Fix[IncidentPulse: Disable Flag & Rollout] ==>|Recovers| HealthyPod[analytics-collector 4GiB - HEALTHY]
    
    style Heap fill:#f87171,stroke:#b91c1c
    style K8s fill:#fbbf24,stroke:#d97706
    style HealthyPod fill:#4ade80,stroke:#15803d
\`\`\`

## 5-Whys Root Cause Analysis
1. **Why did the pod crash?** Linux cgroup OOM killer terminated the container with SIGKILL (Exit code 137).
2. **Why did memory exceed 2048MiB?** The JVM heap consumed 99.4% of allocated RAM without garbage collection reclaim.
3. **Why couldn't GC reclaim memory?** Cached session objects were held by strong references in a static concurrent hash map.
4. **Why was an unevicted map used?** The new \`FEATURE_CLICKSTREAM_AGGREGATOR\` was implemented without Guava/Caffeine TTL eviction.
5. **Why wasn't this caught in staging?** Staging load tests ran with short 5-minute durations, insufficient to trigger memory leak saturation.

## Action Items & Preventative Measures
- [ ] **Code Fix**: Refactor clickstream cache to use Redis or Caffeine with strict 5-minute TTL [Owner: Data Eng, Due: 3 days]
- [ ] **QA**: Establish minimum 2-hour soak tests in pre-production pipeline [Owner: QA Lead, Due: 1 week]
- [ ] **Alerting**: Configure Prometheus alert for container memory slope > 10MB/min [Owner: SRE, Due: 2 days]`
  }
};

/**
 * Stream text chunks either from live Gemini API or via fallback token simulator.
 */
async function streamWithFallback(prompt, systemInstruction, fallbackText, onChunk, modelName = 'gemini-2.5-flash') {
  if (geminiClient) {
    try {
      const responseStream = await geminiClient.models.generateContentStream({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        }
      });

      let fullText = '';
      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          onChunk(text);
        }
      }
      return fullText;
    } catch (err) {
      console.warn(`⚠️ Live Gemini call failed (${err.message}). Seamlessly engaging high-fidelity fallback.`);
    }
  }

  // High-fidelity fallback token streamer: split text into natural token chunks
  const chunks = fallbackText.match(/\S+|\s+/g) || [fallbackText];
  let accumulated = '';
  const chunkSize = 3; // stream 3 words/tokens per tick

  const delayMs = process.env.NODE_ENV === 'test' ? 1 : 20;
  for (let i = 0; i < chunks.length; i += chunkSize) {
    const chunk = chunks.slice(i, i + chunkSize).join('');
    accumulated += chunk;
    if (onChunk) onChunk(chunk);
    // Delay for authentic streaming experience (instant in tests)
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  return accumulated;
}

/**
 * Run the Triage Agent using gemini-2.5-flash
 */
export async function runTriageAgent(scenarioKey) {
  const agentId = 'triage';
  const startTime = Date.now();
  store.updateAgent(agentId, { status: 'thinking', thought: '', tokens: 0, latencyMs: 0 });

  const fb = FALLBACK_KNOWLEDGE_BASE[scenarioKey] || FALLBACK_KNOWLEDGE_BASE.payment_cascade;
  const prompt = `Analyze this system anomaly: scenario=${scenarioKey}. Classify incident severity (P1/P2/P3), affected microservices, blast radius, and initial symptom summary.`;
  const systemPrompt = "You are the Lead SRE Triage Agent. Provide concise, high-priority incident classification with severity, blast radius, and affected services.";

  store.updateAgent(agentId, { status: 'streaming' });

  await streamWithFallback(
    prompt,
    systemPrompt,
    fb.triage,
    (chunk) => store.appendAgentThought(agentId, chunk),
    'gemini-2.5-flash'
  );

  const duration = Date.now() - startTime;
  store.updateAgent(agentId, { status: 'done', latencyMs: duration });
  store.addTimelineEvent(
    'Triage Complete',
    `Triage Agent classified incident as ${store.incidentState.severity} with ${store.incidentState.affectedServices.length} affected services.`,
    'WARN'
  );
}

/**
 * Run the Investigator Agent using gemini-2.5-pro
 */
export async function runInvestigatorAgent(scenarioKey) {
  const agentId = 'investigator';
  const startTime = Date.now();
  store.updateAgent(agentId, { status: 'thinking', thought: '', tokens: 0, latencyMs: 0 });

  const fb = FALLBACK_KNOWLEDGE_BASE[scenarioKey] || FALLBACK_KNOWLEDGE_BASE.payment_cascade;
  const prompt = `Analyze system telemetry, stack traces, and recent logs for ${scenarioKey}. Pinpoint exact root cause, suspect commits or queries, and thread/connection contention details.`;
  const systemPrompt = "You are the Senior Systems Investigator Agent. Conduct deep root cause analysis using logs, metrics, and dependency graphs. Format with Markdown.";

  store.updateAgent(agentId, { status: 'streaming' });

  await streamWithFallback(
    prompt,
    systemPrompt,
    fb.investigator,
    (chunk) => store.appendAgentThought(agentId, chunk),
    'gemini-2.5-pro'
  );

  const duration = Date.now() - startTime;
  store.updateAgent(agentId, { status: 'done', latencyMs: duration });
  store.addTimelineEvent(
    'Root Cause Isolated',
    'Investigator Agent identified exact failure vector and stack trace origin.',
    'INFO'
  );
}

/**
 * Run the Remediation Agent using gemini-2.5-pro
 */
export async function runRemediationAgent(scenarioKey) {
  const agentId = 'remediation';
  const startTime = Date.now();
  store.updateAgent(agentId, { status: 'thinking', thought: '', tokens: 0, latencyMs: 0 });

  const fb = FALLBACK_KNOWLEDGE_BASE[scenarioKey] || FALLBACK_KNOWLEDGE_BASE.payment_cascade;
  const prompt = `Draft actionable SRE mitigation runbook commands for incident ${scenarioKey}. Provide step-by-step shell/kubectl commands, configuration diffs, and risk assessment.`;
  const systemPrompt = "You are the Autonomous Remediation Agent. Produce step-by-step mitigation runbooks with bash/kubectl commands, config diffs, and safety rollback gates.";

  store.updateAgent(agentId, { status: 'streaming' });

  const thought = await streamWithFallback(
    prompt,
    systemPrompt,
    `### 🛠️ Proposed Mitigation Runbook
- **Strategy:** ${fb.remediation.summary}
- **Risk Assessment:** **${fb.remediation.riskLevel}**
- **Safety Gate:** Awaiting Human-in-the-Loop Operator Confirmation.

\`\`\`bash
${fb.remediation.runbook.steps.map(s => `# Step ${s.stepNumber}: ${s.title}\n${s.command}`).join('\n\n')}
\`\`\``,
    (chunk) => store.appendAgentThought(agentId, chunk),
    'gemini-2.5-pro'
  );

  const duration = Date.now() - startTime;
  store.updateAgent(agentId, { status: 'done', latencyMs: duration });

  // Store the active runbook on incident state so operator can review and approve it
  store.updateIncidentState({
    activeRunbook: fb.remediation.runbook,
  });

  store.addTimelineEvent(
    'Runbook Proposed',
    `Remediation Agent prepared ${fb.remediation.runbook.steps.length}-step execution runbook. Safety gate active.`,
    'WARN'
  );
}

/**
 * Run the Comms Agent using gemini-2.5-flash
 */
export async function runCommsAgent(scenarioKey) {
  const agentId = 'comms';
  const startTime = Date.now();
  store.updateAgent(agentId, { status: 'thinking', thought: '', tokens: 0, latencyMs: 0 });

  const fb = FALLBACK_KNOWLEDGE_BASE[scenarioKey] || FALLBACK_KNOWLEDGE_BASE.payment_cascade;
  const prompt = `Draft 3 communication channels for ${scenarioKey}: 1) Public status page, 2) Internal engineering Slack broadcast, 3) Executive bullet brief with financial impact.`;
  const systemPrompt = "You are the Incident Communications Agent. Draft transparent, professional, and clear communications for public status pages, internal engineering channels, and executives.";

  store.updateAgent(agentId, { status: 'streaming' });

  await streamWithFallback(
    prompt,
    systemPrompt,
    fb.comms,
    (chunk) => store.appendAgentThought(agentId, chunk),
    'gemini-2.5-flash'
  );

  const duration = Date.now() - startTime;
  store.updateAgent(agentId, { status: 'done', latencyMs: duration });
  store.addTimelineEvent(
    'Comms Dispatched',
    'Comms Agent generated status page, Slack, and executive updates.',
    'INFO'
  );
}

/**
 * Generate full Post-Mortem RCA using gemini-2.5-pro
 */
export async function generatePostMortem(scenarioKey, onChunk) {
  const fb = FALLBACK_KNOWLEDGE_BASE[scenarioKey] || FALLBACK_KNOWLEDGE_BASE.payment_cascade;
  const prompt = `Generate a full SRE Post-Mortem Root Cause Analysis report for resolved incident ${scenarioKey}. Include Executive Summary, Mermaid architecture diagram of failure vs recovery, 5-Whys, detailed timeline table, and action items with owners.`;
  const systemPrompt = "You are the Principal SRE Architect. Generate comprehensive, production-grade Post-Mortem RCA reports with valid Mermaid diagrams and actionable preventions.";

  const report = await streamWithFallback(
    prompt,
    systemPrompt,
    fb.postMortem,
    onChunk,
    'gemini-2.5-pro'
  );

  store.updateIncidentState({
    postMortem: report,
  });

  return report;
}

/**
 * Run full Autonomous Multi-Agent Investigation Loop sequentially
 */
export async function dispatchAutonomousAgents(scenarioKey) {
  try {
    store.updateIncidentState({ status: 'INVESTIGATING' });
    
    // Step 1: Fast Triage (~1-2s)
    await runTriageAgent(scenarioKey);
    
    // Step 2: Deep RCA Investigator (~2-3s)
    await runInvestigatorAgent(scenarioKey);
    
    // Step 3: Runbook Remediation (~2-3s)
    await runRemediationAgent(scenarioKey);
    
    // Step 4: Comms Agent (~1-2s)
    await runCommsAgent(scenarioKey);
    
    store.updateIncidentState({ status: 'MITIGATING' });
  } catch (err) {
    console.error('Error running autonomous multi-agent pipeline:', err);
  }
}
