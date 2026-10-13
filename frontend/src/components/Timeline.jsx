import React from 'react';
import { 
  AlertCircle, 
  Search, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export function Timeline({ timeline, incident, onOpenRunbook }) {
  const getEventIcon = (severity) => {
    switch (severity) {
      case 'ERROR':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-400" />;
      case 'WARN':
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="rounded-xl bg-[#080d19] border border-slate-800 flex flex-col h-[380px] shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-3.5 py-2.5 bg-[#0c1220] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-slate-200 tracking-wide uppercase text-[11px]">
            Incident Timeline & Milestones
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {timeline.length} milestone events
        </span>
      </div>

      {/* Timeline list */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#070b14]">
        {timeline.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
            <Clock className="w-6 h-6 mb-2 opacity-30" />
            <p>No active incidents recorded.</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Inject chaos to view chronological response milestones.</p>
          </div>
        ) : (
          timeline.map((evt, idx) => {
            const isLast = idx === timeline.length - 1;
            return (
              <div key={evt.id || idx} className="relative flex items-start gap-3 group">
                {/* Vertical connecting line */}
                {!isLast && (
                  <div className="absolute left-[13px] top-6 bottom-0 w-0.5 bg-slate-800 group-hover:bg-slate-700 transition" />
                )}

                {/* Node icon */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border z-10 ${
                  evt.severity === 'ERROR'
                    ? 'bg-rose-950/80 border-rose-600/60'
                    : evt.severity === 'WARN'
                    ? 'bg-amber-950/80 border-amber-600/60'
                    : evt.severity === 'SUCCESS'
                    ? 'bg-emerald-950/80 border-emerald-600/60'
                    : 'bg-blue-950/80 border-blue-600/60'
                }`}>
                  {getEventIcon(evt.severity)}
                </div>

                {/* Content */}
                <div className="flex-1 pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-200">
                      {evt.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {evt.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Footer if Runbook Available */}
      {incident.activeRunbook && incident.status !== 'RESOLVED' && (
        <div className="p-3 bg-emerald-950/20 border-t border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold">Remediation Runbook Ready</span>
          </div>
          <button
            onClick={onOpenRunbook}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1 transition shadow-sm"
          >
            <span>Execute Fix</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
