import React, { useState } from 'react';
import { 
  ShieldAlert, 
  SearchCode, 
  Wrench, 
  Megaphone, 
  Sparkles, 
  CheckCircle, 
  Loader2, 
  Maximize2, 
  Minimize2,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export function AgentFeed({ agents, onOpenRunbook, activeRunbook }) {
  const [collapsed, setCollapsed] = useState({
    triage: false,
    investigator: false,
    remediation: false,
    comms: false,
  });

  const toggleCollapse = (id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getAgentConfig = (id) => {
    switch (id) {
      case 'triage':
        return {
          icon: ShieldAlert,
          color: 'text-rose-400',
          borderColor: 'border-rose-900/40',
          activeBorder: 'border-rose-500 shadow-rose-950/40',
          bgHeader: 'bg-rose-950/20',
          accent: 'rose',
        };
      case 'investigator':
        return {
          icon: SearchCode,
          color: 'text-amber-400',
          borderColor: 'border-amber-900/40',
          activeBorder: 'border-amber-500 shadow-amber-950/40',
          bgHeader: 'bg-amber-950/20',
          accent: 'amber',
        };
      case 'remediation':
        return {
          icon: Wrench,
          color: 'text-emerald-400',
          borderColor: 'border-emerald-900/40',
          activeBorder: 'border-emerald-500 shadow-emerald-950/40',
          bgHeader: 'bg-emerald-950/20',
          accent: 'emerald',
        };
      case 'comms':
        return {
          icon: Megaphone,
          color: 'text-sky-400',
          borderColor: 'border-sky-900/40',
          activeBorder: 'border-sky-500 shadow-sky-950/40',
          bgHeader: 'bg-sky-950/20',
          accent: 'sky',
        };
      default:
        return {
          icon: Sparkles,
          color: 'text-blue-400',
          borderColor: 'border-blue-900/40',
          activeBorder: 'border-blue-500',
          bgHeader: 'bg-blue-950/20',
          accent: 'blue',
        };
    }
  };

  return (
    <div className="my-3">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
          <h2 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
            Autonomous Multi-Agent Reasoning Pipeline
          </h2>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800">
            4 Coordinated Agents
          </span>
        </div>
        <div className="text-[11px] text-slate-400 hidden sm:block">
          Parallel Reasoning & Automated Root Cause Analysis
        </div>
      </div>

      {/* Grid of 4 Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {Object.entries(agents).map(([id, agent]) => {
          const cfg = getAgentConfig(id);
          const IconComponent = cfg.icon;
          const isStreaming = agent.status === 'streaming';
          const isThinking = agent.status === 'thinking';
          const isDone = agent.status === 'done';
          const isCollapsed = collapsed[id];

          return (
            <div
              key={id}
              className={`rounded-xl bg-[#0c111e] border transition-all duration-300 flex flex-col overflow-hidden ${
                isStreaming || isThinking ? `${cfg.activeBorder} shadow-lg` : cfg.borderColor
              }`}
            >
              {/* Card Header */}
              <div className={`px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between ${cfg.bgHeader}`}>
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg bg-slate-900 border border-slate-800 ${cfg.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100">{agent.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
                        {agent.model}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">{agent.role}</div>
                  </div>
                </div>

                {/* Status Indicator & Token stats */}
                <div className="flex items-center gap-2">
                  {isThinking && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                    </span>
                  )}
                  {isStreaming && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" /> Streaming
                    </span>
                  )}
                  {isDone && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      <CheckCircle className="w-3 h-3" />
                      {agent.tokens > 0 ? `${agent.tokens} tok` : 'Done'}
                      {agent.latencyMs > 0 && ` (${(agent.latencyMs / 1000).toFixed(1)}s)`}
                    </span>
                  )}
                  {agent.status === 'idle' && (
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                      Idle / Ready
                    </span>
                  )}

                  <button
                    onClick={() => toggleCollapse(id)}
                    className="p-1 text-slate-400 hover:text-white transition"
                    title={isCollapsed ? 'Expand Card' : 'Minimize Card'}
                  >
                    {isCollapsed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Card Body */}
              {!isCollapsed && (
                <div className="p-3.5 flex-1 flex flex-col justify-between text-xs min-h-[140px] max-h-[280px] overflow-y-auto">
                  {agent.thought ? (
                    <div>
                      <MarkdownRenderer content={agent.thought} />
                      {isStreaming && (
                        <span className="inline-block w-2 h-3 ml-1 bg-blue-400 animate-pulse" />
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 py-6">
                      <IconComponent className="w-6 h-6 mb-2 opacity-30" />
                      <p className="text-[11px]">Awaiting telemetry anomaly trigger...</p>
                    </div>
                  )}

                  {/* Remediation Action Gate Button */}
                  {id === 'remediation' && activeRunbook && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400">
                        <strong className="text-emerald-400 font-semibold">{activeRunbook.steps.length} commands</strong> generated · Operator approval required
                      </div>
                      <button
                        onClick={onOpenRunbook}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition shadow-sm shadow-emerald-700/40"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Review & Execute Runbook</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
