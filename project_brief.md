# My agent: IncidentPulse AI — Autonomous Real-Time SRE Incident War-Room

One-liner: IncidentPulse AI is a real-time, autonomous Site Reliability Engineering (SRE) war-room platform powered by Google Gemini 2.5 (Flash and Pro). When critical production outages occur, an autonomous multi-agent swarm continuously correlates streaming telemetry, pinpoints root causes from high-velocity logs, synthesizes executable remediation runbooks with Human-in-the-Loop safety approval, and generates audit-ready post-mortems with interactive Mermaid architecture diagrams.

## Key Capabilities
- Autonomous Multi-Agent Swarm: Triage, Investigator, Remediation, and Comms agents coordinating across Gemini 2.5 Flash and Pro.
- Real-Time Streaming Telemetry: Low-latency SSE bus streaming latency distributions (p50/p95/p99), error rates, CPU/memory, and database connection pools.
- Chaos Outage Simulator: 3 realistic failure scenarios (payment gateway 504 cascades, database deadlocks, microservice memory leaks).
- Human-in-the-Loop Safety Gate: Runbook preview, command explanations, declarative YAML config diffs, and real-time execution feedback.
- Automated Post-Mortem RCA: 5-Whys analysis, action items, and interactive Mermaid architecture diagrams with markdown export.
