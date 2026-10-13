import { useState, useEffect, useRef, useCallback } from 'react';

const MAX_CHART_POINTS = 30;
const MAX_LOGS = 300;

export function useIncidentStream() {
  const [connected, setConnected] = useState(false);
  const [incident, setIncident] = useState({
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
    activeRunbook: null,
    timeline: [],
    postMortem: null,
  });

  const [agents, setAgents] = useState({
    triage: { id: 'triage', name: 'Triage Agent', role: 'Severity & Blast Radius', model: 'gemini-2.5-flash', status: 'idle', thought: '', tokens: 0, latencyMs: 0 },
    investigator: { id: 'investigator', name: 'Investigator Agent', role: 'Root Cause & Log Correlation', model: 'gemini-2.5-pro', status: 'idle', thought: '', tokens: 0, latencyMs: 0 },
    remediation: { id: 'remediation', name: 'Remediation Agent', role: 'Runbook Generation & Safety Gate', model: 'gemini-2.5-pro', status: 'idle', thought: '', tokens: 0, latencyMs: 0 },
    comms: { id: 'comms', name: 'Comms Agent', role: 'Status Page & Stakeholder Briefs', model: 'gemini-2.5-flash', status: 'idle', thought: '', tokens: 0, latencyMs: 0 },
  });

  const [metricsHistory, setMetricsHistory] = useState([]);
  const [latestMetrics, setLatestMetrics] = useState({
    latencyP50: 42,
    latencyP95: 98,
    latencyP99: 145,
    errorRate: 0.04,
    rps: 1350,
    cpu: 24,
    memory: 46,
    dbPoolActive: 18,
    dbPoolWaiting: 0,
  });

  const [logs, setLogs] = useState([]);
  const [runbookProgress, setRunbookProgress] = useState(null);
  const [postMortemMarkdown, setPostMortemMarkdown] = useState('');
  const [isGeneratingPostMortem, setIsGeneratingPostMortem] = useState(false);
  const [backendMeta, setBackendMeta] = useState({ geminiLive: false, mode: 'unknown' });

  const eventSourceRef = useRef(null);

  // Fetch initial health/meta
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setBackendMeta({ geminiLive: data.geminiLive, mode: data.mode });
      }
    } catch (err) {
      console.warn('Backend health check error:', err);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Connect to SSE stream
  useEffect(() => {
    let es;
    let retryTimer;

    const connect = () => {
      es = new EventSource('/api/stream');
      eventSourceRef.current = es;

      es.onopen = () => {
        setConnected(true);
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        retryTimer = setTimeout(connect, 3000);
      };

      // 1. Initial snapshot
      es.addEventListener('init', (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.incident) setIncident(data.incident);
          if (data.agents) setAgents(data.agents);
          if (data.recentLogs) setLogs(data.recentLogs);
        } catch (err) {
          console.error('Error parsing init event:', err);
        }
      });

      // 2. Telemetry metrics tick
      es.addEventListener('metrics', (e) => {
        try {
          const m = JSON.parse(e.data);
          setLatestMetrics(m);

          const timeLabel = new Date(m.timestamp || Date.now()).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
          setMetricsHistory((prev) => {
            const next = [...prev, { ...m, time: timeLabel }];
            if (next.length > MAX_CHART_POINTS) return next.slice(-MAX_CHART_POINTS);
            return next;
          });
        } catch (err) {
          console.error('Error parsing metrics event:', err);
        }
      });

      // 3. New log entry
      es.addEventListener('log', (e) => {
        try {
          const logItem = JSON.parse(e.data);
          setLogs((prev) => {
            const next = [...prev, logItem];
            if (next.length > MAX_LOGS) return next.slice(-MAX_LOGS);
            return next;
          });
        } catch (err) {
          console.error('Error parsing log event:', err);
        }
      });

      // 4. Incident state update
      es.addEventListener('incident_state', (e) => {
        try {
          const inc = JSON.parse(e.data);
          setIncident(inc);
        } catch (err) {
          console.error('Error parsing incident_state event:', err);
        }
      });

      // 5. Agent state update
      es.addEventListener('agent_update', (e) => {
        try {
          const data = JSON.parse(e.data);
          setAgents((prev) => ({
            ...prev,
            [data.agentId]: { ...prev[data.agentId], ...data },
          }));
        } catch (err) {
          console.error('Error parsing agent_update event:', err);
        }
      });

      // 6. Agent thought streaming chunk
      es.addEventListener('agent_thought_chunk', (e) => {
        try {
          const data = JSON.parse(e.data);
          setAgents((prev) => {
            const current = prev[data.agentId];
            if (!current) return prev;
            return {
              ...prev,
              [data.agentId]: {
                ...current,
                status: 'streaming',
                thought: data.totalThought,
                tokens: data.tokens,
              },
            };
          });
        } catch (err) {
          console.error('Error parsing agent_thought_chunk event:', err);
        }
      });

      // 7. Agents reset
      es.addEventListener('agents_reset', (e) => {
        try {
          const resetMap = JSON.parse(e.data);
          setAgents(resetMap);
        } catch (err) {
          console.error('Error parsing agents_reset event:', err);
        }
      });

      // 8. Timeline event
      es.addEventListener('timeline_event', (e) => {
        try {
          const event = JSON.parse(e.data);
          setIncident((prev) => ({
            ...prev,
            timeline: [...(prev.timeline || []), event],
          }));
        } catch (err) {
          console.error('Error parsing timeline_event event:', err);
        }
      });

      // 9. Runbook execution progress
      es.addEventListener('runbook_progress', (e) => {
        try {
          const progress = JSON.parse(e.data);
          setRunbookProgress(progress);
        } catch (err) {
          console.error('Error parsing runbook_progress event:', err);
        }
      });

      // 10. Runbook completed
      es.addEventListener('runbook_completed', (e) => {
        try {
          const data = JSON.parse(e.data);
          setRunbookProgress({ ...data, isFinished: true });
        } catch (err) {
          console.error('Error parsing runbook_completed event:', err);
        }
      });

      // 11. Post-Mortem events
      es.addEventListener('postmortem_generating', () => {
        setIsGeneratingPostMortem(true);
        setPostMortemMarkdown('');
      });

      es.addEventListener('postmortem_chunk', (e) => {
        try {
          const data = JSON.parse(e.data);
          setPostMortemMarkdown((prev) => prev + data.chunk);
        } catch (err) {
          console.error('Error parsing postmortem_chunk:', err);
        }
      });

      es.addEventListener('postmortem_ready', (e) => {
        try {
          const data = JSON.parse(e.data);
          setPostMortemMarkdown(data.markdown);
          setIsGeneratingPostMortem(false);
        } catch (err) {
          console.error('Error parsing postmortem_ready:', err);
        }
      });
    };

    connect();

    return () => {
      if (es) es.close();
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, []);

  // Action methods
  const injectFailure = async (scenario, intensity = 1.0) => {
    try {
      const res = await fetch('/api/simulator/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, intensity }),
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to inject failure:', err);
      throw err;
    }
  };

  const resetSystem = async () => {
    try {
      setRunbookProgress(null);
      const res = await fetch('/api/simulator/reset', { method: 'POST' });
      return await res.json();
    } catch (err) {
      console.error('Failed to reset system:', err);
      throw err;
    }
  };

  const executeRunbook = async (runbookId) => {
    try {
      const res = await fetch('/api/runbook/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runbookId }),
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to execute runbook:', err);
      throw err;
    }
  };

  const rejectRunbook = async (runbookId, reason) => {
    try {
      const res = await fetch('/api/runbook/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runbookId, reason }),
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to reject runbook:', err);
      throw err;
    }
  };

  const generatePostMortem = async (scenarioKey) => {
    try {
      setIsGeneratingPostMortem(true);
      const res = await fetch('/api/postmortem/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioKey }),
      });
      const data = await res.json();
      setPostMortemMarkdown(data.markdown);
      setIsGeneratingPostMortem(false);
      return data;
    } catch (err) {
      setIsGeneratingPostMortem(false);
      console.error('Failed to generate post-mortem:', err);
      throw err;
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return {
    connected,
    incident,
    agents,
    metricsHistory,
    latestMetrics,
    logs,
    runbookProgress,
    postMortemMarkdown,
    isGeneratingPostMortem,
    backendMeta,
    injectFailure,
    resetSystem,
    executeRunbook,
    rejectRunbook,
    generatePostMortem,
    clearLogs,
  };
}
