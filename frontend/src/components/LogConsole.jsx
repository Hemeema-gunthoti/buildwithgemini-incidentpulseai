import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Search, 
  Filter, 
  ArrowDown, 
  Trash2, 
  Download, 
  Pause, 
  Play, 
  Check, 
  Copy
} from 'lucide-react';

export function LogConsole({ logs, onClear }) {
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('ALL');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const consoleEndRef = useRef(null);

  // Extract unique services
  const services = ['ALL', ...Array.from(new Set(logs.map(l => l.service).filter(Boolean)))];

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (levelFilter !== 'ALL' && log.level !== levelFilter) return false;
    if (selectedService !== 'ALL' && log.service !== selectedService) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMsg = log.message && log.message.toLowerCase().includes(q);
      const matchSvc = log.service && log.service.toLowerCase().includes(q);
      const matchTrace = log.traceId && log.traceId.toLowerCase().includes(q);
      if (!matchMsg && !matchSvc && !matchTrace) return false;
    }
    return true;
  });

  // Auto-scroll logic
  useEffect(() => {
    if (autoScroll && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredLogs, autoScroll]);

  const handleDownload = () => {
    const text = filteredLogs.map(l => `[${l.timestamp}] [${l.level}] [${l.service}] [${l.traceId}] ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incidentpulse-logs-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLog = (log) => {
    navigator.clipboard.writeText(`[${log.timestamp}] [${log.level}] [${log.service}] ${log.message}`);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'ERROR':
        return 'text-rose-400 bg-rose-950/60 border-rose-800';
      case 'WARN':
        return 'text-amber-400 bg-amber-950/60 border-amber-800';
      case 'INFO':
        return 'text-blue-400 bg-blue-950/60 border-blue-800';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  return (
    <div className="rounded-xl bg-[#080d19] border border-slate-800 flex flex-col h-[380px] shadow-lg overflow-hidden">
      {/* Console Top Toolbar */}
      <div className="px-3.5 py-2 bg-[#0c1220] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Title & Counters */}
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200 tracking-wide uppercase text-[11px]">
            Live SRE Ingestion Stream
          </span>
          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
            {filteredLogs.length} / {logs.length} events
          </span>
        </div>

        {/* Center: Search & Level Filters */}
        <div className="flex items-center gap-1.5">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="Search logs / trace IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2 py-1 rounded bg-slate-900/90 border border-slate-700 text-[11px] text-slate-200 placeholder-slate-500 w-36 sm:w-44 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Level Filter Buttons */}
          <div className="flex rounded bg-slate-900 border border-slate-700 p-0.5">
            {['ALL', 'ERROR', 'WARN', 'INFO'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition ${
                  levelFilter === lvl
                    ? lvl === 'ERROR'
                      ? 'bg-rose-600 text-white'
                      : lvl === 'WARN'
                      ? 'bg-amber-600 text-white'
                      : lvl === 'INFO'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Service dropdown */}
          {services.length > 2 && (
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="py-1 px-1.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300 focus:outline-none focus:border-blue-500"
            >
              {services.map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition ${
              autoScroll
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title={autoScroll ? 'Pause Auto-Scroll' : 'Resume Auto-Scroll'}
          >
            {autoScroll ? <Play className="w-2.5 h-2.5" /> : <Pause className="w-2.5 h-2.5" />}
            <span>{autoScroll ? 'Auto-Scroll ON' : 'PAUSED'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Download Log Stream"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClear}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 transition"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Console Log Area */}
      <div 
        className="flex-1 p-3 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1 select-text bg-[#070b14]"
        onWheel={() => setAutoScroll(false)}
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs">
            No matching log entries found in the active stream.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2 py-0.5 px-1.5 rounded hover:bg-slate-900/60 group transition-colors"
            >
              {/* Timestamp */}
              <span className="text-slate-500 text-[10px] shrink-0 select-none">
                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })}
              </span>

              {/* Level Badge */}
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border shrink-0 ${getLevelColor(log.level)}`}>
                {log.level}
              </span>

              {/* Service Tag */}
              <span className="text-indigo-400 text-[10px] font-semibold shrink-0">
                [{log.service}]
              </span>

              {/* Message */}
              <span className={`flex-1 break-all ${
                log.level === 'ERROR' ? 'text-rose-200' : log.level === 'WARN' ? 'text-amber-200' : 'text-slate-300'
              }`}>
                {log.message}
              </span>

              {/* Quick Copy on Hover */}
              <button
                onClick={() => handleCopyLog(log)}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-white transition shrink-0"
                title="Copy log line"
              >
                {copiedId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          ))
        )}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
}
