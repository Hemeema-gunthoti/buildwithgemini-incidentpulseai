# IncidentPulse AI — Demo Video Production Package & Presentation Script

This document provides a comprehensive, turn-key production package for recording an impactful, professional **2-Minute Demo Video** of **IncidentPulse AI**. It contains a second-by-second storyboard, click-through choreography, and a word-for-word presenter voiceover script suitable for human delivery or AI text-to-speech generators (e.g. ElevenLabs, Google Cloud Text-to-Speech).

---

## 🎬 2-Minute Video Storyboard & Script Breakdown

| Timestamp | Visual / Screen Action | Spoken Voiceover Script (Word-for-Word) | On-Screen Highlights |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:15** | Open on IncidentPulse AI dashboard in healthy steady state. Show live telemetry area charts (p50: 42ms, Error Rate: 0.04%), green "SYSTEMS STEADY" badge, ticking UTC clock. | *"In high-scale cloud engineering, every second of downtime costs thousands of dollars. Meet IncidentPulse AI — an autonomous SRE war-room powered by Google Gemini 2.5 that detects, triages, investigates, and remediates critical production outages in real time."* | Cursor circles the Live Telemetry charts and steady status badge. |
| **0:15 - 0:30** | Click bottom Chaos Controller dock. Select **"Scenario A: Stripe Gateway 504 Timeout Cascade"** with **1.5x Intensity**. Click **"Inject Failure"**. | *"Let’s inject a severe production failure: a cascading timeout surge from an upstream payment gateway. Within 300 milliseconds, our telemetry detects the anomaly."* | Red glowing "SEV-1 CRITICAL" badge lights up. Latency chart spikes to 4,950ms; error rate surges to 38.4%. |
| **0:30 - 0:50** | Pan to the Multi-Agent Reasoning Feed. Show **Triage Agent** (Gemini 2.5 Flash) streaming severity & blast radius, followed immediately by **Investigator Agent** (Gemini 2.5 Pro) pinpointing socket starvation and the suspect commit. | *"Instantly, our autonomous multi-agent pipeline springs to life. First, the Triage Agent classifies this as a P1 incident, identifying four affected microservices. Simultaneously, the Investigator Agent correlates thousands of raw logs, isolating a socket starvation deadlock and upstream Stripe 504 timeouts."* | Streaming tokens light up in real time with animated thinking pulses and token counters. |
| **0:50 - 1:10** | Highlight **Remediation Agent** card. Click the pulsing green **"Review & Execute Runbook"** button to open the Human-in-the-Loop Safety Gate modal. | *"Rather than waiting for an engineer to draft a manual hotfix, the Remediation Agent generates an actionable, four-step Kubernetes runbook, complete with a declarative configuration diff."* | Modal opens showing bash commands (`kubectl patch`, `apply`) and side-by-side color-coded YAML diff. |
| **1:10 - 1:30** | Click **"Approve & Execute Fix"**. Watch the real-time execution progress bar advance from 0% to 100% with live CLI output streaming. Confetti bursts across the screen as status transitions to **"RESOLVED"**. | *"With one click, our operator approves the fix. The engine executes the runbook commands step-by-step with real-time safety validation. Circuit breakers trip to fallback mode, idle connections flush, and immediately our latency plummets back under 45 milliseconds. Outage resolved."* | Live progress bar fills, stdout lines tick in green, confetti explosion triggers, MTTM counter locks in. |
| **1:30 - 1:50** | Click **"Post-Mortem"** in the top navigation. The modal displays a complete, executive-ready RCA report with an interactive Mermaid architecture diagram and 5-Whys analysis. Click **"Download .md"**. | *"Finally, the system eliminates hours of manual paperwork by generating a comprehensive post-mortem in seconds. Powered by Gemini 2.5 Pro, it includes interactive Mermaid architecture diagrams, a 5-Whys root cause analysis, and preventative action items ready to export to GitHub or Jira."* | Mermaid diagram renders live in dark theme; cursor demonstrates 5-Whys table and "Copy Markdown" button. |
| **1:50 - 2:00** | Return to main dashboard. Show all systems nominal, MTTD (14s) and MTTM (38s) metrics locked. Show project GitHub & Docker command. | *"IncidentPulse AI transforms SRE incident response from frantic firefighting into calm, autonomous orchestration. Experience the future of reliability engineering today."* | Final branding title card with "Built with Google Gemini 2.5 & Google DeepMind Antigravity". |

---

## 📋 Presenter Click-Through Choreography

Follow this exact sequence of clicks during recording for a flawless demonstration:

### Phase 1: Baseline Establishment (0:00 - 0:15)
1. Ensure the browser is full-screen at 1920x1080 resolution.
2. Verify the status badge reads **SYSTEMS STEADY** with latency around 42ms.
3. Hover smoothly over the Latency AreaChart and Error Rate LineChart to show interactive tooltip popups.

### Phase 2: Failure Injection (0:15 - 0:30)
1. Move cursor to the bottom **Chaos Controller** dock.
2. Click the scenario dropdown: select `Scenario A: Stripe Gateway 504 Timeout Cascade`.
3. Select `1.5x` intensity.
4. Click the bright red **"Inject Failure"** button.
5. Immediately observe:
   - Severity badge shifts to **SEV-1 CRITICAL** with glowing red pulse.
   - Latency chart climbs dramatically.
   - Terminal log console starts streaming red `[ERROR]` lines with high velocity.

### Phase 3: Autonomous Agent Collaboration (0:30 - 0:50)
1. Scroll gently to the **Autonomous Multi-Agent Reasoning Pipeline** section.
2. Note the **Triage Agent** (`gemini-2.5-flash`) displaying blast radius and affected microservices.
3. Note the **Investigator Agent** (`gemini-2.5-pro`) streaming root cause deductions.
4. Note the token counter and latency badges updating dynamically.

### Phase 4: Human-in-the-Loop Remediation (0:50 - 1:30)
1. On the **Remediation Agent** card, click **"Review & Execute Runbook"**.
2. In the modal:
   - Click the **"Config Diff Preview"** tab to showcase the red/green configuration change.
   - Switch back to **"Execution Commands"**.
   - Hover over the "Copy" button on Step 1 (`kubectl patch ...`).
3. Click the green **"Approve & Execute Fix"** button.
4. Watch the progress bar advance (25% -> 50% -> 75% -> 100%) and watch terminal stdout appear.
5. Let the **Canvas-Confetti** celebration fire!
6. Click **"Close & Return to War-Room"**.
7. Point out that the metrics in the charts have returned to healthy baseline values (< 50ms, 0.04% error rate).

### Phase 5: Post-Mortem Generation & Wrap-Up (1:30 - 2:00)
1. Click the **"Post-Mortem"** button in the top navigation.
2. Showcase the **Mermaid architecture diagram** visualizing the failure route and healthy fallback.
3. Scroll through the **5-Whys Analysis** and **Action Items**.
4. Click **"Copy MD"** (shows green checkmark feedback) and click **"Download .md"**.
5. Close the modal and conclude on the main war-room overview.

---

## 🎙️ Word-for-Word Audio Voiceover Transcript

For single-take audio recording or AI speech synthesis, read this continuous transcript:

> "In modern high-scale cloud environments, every second of downtime costs thousands of dollars and damages user trust. 
> 
> Welcome to IncidentPulse AI — an autonomous site reliability engineering war-room powered by Google Gemini 2.5 that detects, triages, investigates, and mitigates critical production outages in real time.
> 
> Right now, our production cluster is in steady state, maintaining a p50 latency of forty-two milliseconds. Let’s inject a realistic production disaster: an upstream payment gateway timeout cascade.
> 
> In less than three hundred milliseconds, our telemetry stream detects the anomaly. The latency surges past four thousand milliseconds, error rates spike to thirty-eight percent, and a Sev-One Critical alert is declared.
> 
> Immediately, our multi-agent intelligence pipeline springs into action. Using Gemini 2.5 Flash, the Triage Agent classifies the severity and identifies four compromised microservices. Next, our Investigator Agent, powered by Gemini 2.5 Pro, correlates thousands of streaming logs to pinpoint socket pool starvation caused by unhandled five-hundred-four gateway timeouts.
> 
> Rather than waiting for engineers to write a manual hotfix, the Remediation Agent autonomously designs an executable Kubernetes runbook with a declarative configuration diff.
> 
> Because safety is paramount, IncidentPulse AI enforces a Human-in-the-Loop gate. With a single click, our operator approves the remediation. The engine executes the commands in real time, isolating failing connections, tripping the circuit breaker, and restoring healthy traffic. Within seconds, latency plummets back to normal and our outage is resolved.
> 
> To wrap up, IncidentPulse AI eliminates hours of tedious documentation. With one click, Gemini 2.5 Pro synthesizes a complete post-mortem report featuring an interactive Mermaid architecture diagram, a five-whys analysis, and actionable preventative measures.
> 
> IncidentPulse AI transforms incident management from chaotic firefighting into calm, autonomous reliability. Thank you."

---

## ⚙️ Recommended Recording Setup
- **Resolution:** 1920x1080 (16:9), 60 FPS.
- **Browser:** Google Chrome or Chromium in Dark Mode.
- **Recording Software:** OBS Studio, QuickTime, or Screen Studio.
- **Audio:** 48 kHz / 24-bit stereo voiceover track.
