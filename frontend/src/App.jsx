import React, { useState } from 'react';
import { useIncidentStream } from './hooks/useIncidentStream';
import { Header } from './components/Header';
import { MetricsGrid } from './components/MetricsGrid';
import { AgentFeed } from './components/AgentFeed';
import { LogConsole } from './components/LogConsole';
import { Timeline } from './components/Timeline';
import { RemediationModal } from './components/RemediationModal';
import { PostMortemModal } from './components/PostMortemModal';
import { ChaosDock } from './components/ChaosDock';

export default function App() {
  const {
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
  } = useIncidentStream();

  const [isRunbookModalOpen, setIsRunbookModalOpen] = useState(false);
  const [isPostMortemModalOpen, setIsPostMortemModalOpen] = useState(false);

  const handleOpenRunbook = () => {
    setIsRunbookModalOpen(true);
  };

  const handleOpenPostMortem = () => {
    setIsPostMortemModalOpen(true);
    // If no post-mortem yet, generate one automatically
    if (!postMortemMarkdown && !isGeneratingPostMortem) {
      generatePostMortem(incident.scenarioKey || 'payment_cascade');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col pb-24">
      {/* Real-Time War-Room Header */}
      <Header
        incident={incident}
        backendMeta={backendMeta}
        onReset={resetSystem}
        onOpenPostMortem={handleOpenPostMortem}
      />

      {/* Main War-Room Dashboard */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 py-2 space-y-3">
        {/* Connection lost warning banner if backend is unreachable */}
        {!connected && (
          <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-600/60 text-amber-300 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Reconnecting to IncidentPulse real-time SSE stream...
            </span>
            <span className="text-[11px] font-mono">Attempting reconnect every 3s</span>
          </div>
        )}

        {/* 1. Live Telemetry & Metrics Charts Grid */}
        <MetricsGrid
          metricsHistory={metricsHistory}
          latestMetrics={latestMetrics}
          incident={incident}
        />

        {/* 2. Autonomous Multi-Agent Reasoning Feed (Triage, Investigator, Remediation, Comms) */}
        <AgentFeed
          agents={agents}
          onOpenRunbook={handleOpenRunbook}
          activeRunbook={incident.activeRunbook}
        />

        {/* 3. Dual SRE Workspaces: Live Log Console (Left) + Chronological Timeline (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 my-2">
          {/* SRE Terminal Logs (2 cols) */}
          <div className="lg:col-span-2">
            <LogConsole
              logs={logs}
              onClear={clearLogs}
            />
          </div>

          {/* Chronological Incident Timeline (1 col) */}
          <div className="lg:col-span-1">
            <Timeline
              timeline={incident.timeline || []}
              incident={incident}
              onOpenRunbook={handleOpenRunbook}
            />
          </div>
        </div>
      </main>

      {/* 4. Bottom Floating Chaos Simulator Controller */}
      <ChaosDock
        onInject={injectFailure}
        onReset={resetSystem}
        activeScenario={incident.scenarioKey}
        incidentStatus={incident.status}
      />

      {/* 5. Human-in-the-Loop Remediation Gate Modal */}
      <RemediationModal
        isOpen={isRunbookModalOpen}
        onClose={() => setIsRunbookModalOpen(false)}
        runbook={incident.activeRunbook}
        onExecute={executeRunbook}
        onReject={rejectRunbook}
        progress={runbookProgress}
        incident={incident}
      />

      {/* 6. Post-Mortem RCA Viewer Modal */}
      <PostMortemModal
        isOpen={isPostMortemModalOpen}
        onClose={() => setIsPostMortemModalOpen(false)}
        markdown={postMortemMarkdown}
        isGenerating={isGeneratingPostMortem}
        onGenerate={generatePostMortem}
        scenarioKey={incident.scenarioKey}
      />
    </div>
  );
}
