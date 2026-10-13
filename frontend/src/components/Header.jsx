import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Flame, 
  RotateCcw, 
  FileText, 
  Sparkles, 
  Volume2, 
  VolumeX,
  Radio
} from 'lucide-react';

export function Header({ incident, backendMeta, onReset, onOpenPostMortem }) {
  const [utcTime, setUtcTime] = useState('');
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [isMuted, setIsMuted] = useState(false);

  // UTC clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Incident stopwatch
  useEffect(() => {
    if (!incident.startedAt || incident.status === 'STEADY') {
      setElapsedTime('00:00:00');
      return;
    }

    const updateStopwatch = () => {
      const start = new Date(incident.startedAt).getTime();
      const end = incident.mitigatedAt ? new Date(incident.mitigatedAt).getTime() : Date.now();
      const diffSecs = Math.max(0, Math.floor((end - start) / 1000));
      
      const hours = String(Math.floor(diffSecs / 3600)).padStart(2, '0');
      const mins = String(Math.floor((diffSecs % 3600) / 60)).padStart(2, '0');
      const secs = String(diffSecs % 60).padStart(2, '0');
      setElapsedTime(`${hours}:${mins}:${secs}`);
    };

    updateStopwatch();
    const timer = setInterval(updateStopwatch, 1000);
    return () => clearInterval(timer);
  }, [incident.startedAt, incident.mitigatedAt, incident.status]);

  const getSeverityBadge = () => {
    if (incident.status === 'STEADY') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          SYSTEMS STEADY
        </span>
      );
    }
    if (incident.severity === 'P1') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-rose-950/90 border border-rose-500/60 text-rose-300 text-xs font-bold flex items-center gap-1.5 critical-pulse">
          <Flame className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
          SEV-1 CRITICAL
        </span>
      );
    }
    if (incident.severity === 'P2') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-amber-950/90 border border-amber-500/60 text-amber-300 text-xs font-bold flex items-center gap-1.5 warning-pulse">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          SEV-2 HIGH
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-600/40 text-blue-300 text-xs font-semibold flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5 text-blue-400" />
        SEV-3 MEDIUM
      </span>
    );
  };

  const getStatusBadge = () => {
    switch (incident.status) {
      case 'ACTIVE':
        return <span className="text-rose-400 font-bold tracking-wider text-xs bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800">ALERT TRIGGERED</span>;
      case 'INVESTIGATING':
        return <span className="text-amber-400 font-bold tracking-wider text-xs bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800 animate-pulse">AUTONOMOUS TRIAGE</span>;
      case 'MITIGATING':
        return <span className="text-blue-400 font-bold tracking-wider text-xs bg-blue-950/50 px-2 py-0.5 rounded border border-blue-800">MITIGATION READY</span>;
      case 'RESOLVED':
        return <span className="text-emerald-400 font-bold tracking-wider text-xs bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">RESOLVED</span>;
      default:
        return <span className="text-slate-400 font-medium tracking-wider text-xs bg-slate-800/60 px-2 py-0.5 rounded">STEADY STATE</span>;
    }
  };

  return (
    <header className="bg-[#0b101b] border-b border-slate-800/80 px-4 py-3 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-400/30">
                <Radio className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0b101b]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-300 bg-clip-text text-transparent">
                  IncidentPulse<span className="text-blue-500">.AI</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/50">
                  WAR-ROOM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Real-Time Autonomous SRE & Incident Intelligence
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Severity & Status */}
          <div className="flex items-center gap-2">
            {getSeverityBadge()}
            {getStatusBadge()}
          </div>
        </div>

        {/* Center: Real-Time SRE Metrics Counters (MTTD, MTTM, Stopwatch) */}
        <div className="flex items-center gap-3 sm:gap-6 bg-[#070b14] px-4 py-1.5 rounded-xl border border-slate-800 shadow-inner">
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">MTTD</div>
            <div className="font-mono text-xs sm:text-sm font-bold text-amber-400">
              {incident.status === 'STEADY' ? '0s' : `${incident.mttdSeconds || 14}s`}
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800/80" />

          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">MTTM</div>
            <div className="font-mono text-xs sm:text-sm font-bold text-blue-400">
              {incident.status === 'RESOLVED' ? `${incident.mttmSeconds || 120}s` : incident.status === 'STEADY' ? '0s' : 'ticking...'}
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800/80" />

          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>DURATION</span>
            </div>
            <div className="font-mono text-xs sm:text-sm font-bold text-slate-100">
              {elapsedTime}
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800/80 hidden sm:block" />

          <div className="text-center hidden sm:block">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">SYSTEM TIME</div>
            <div className="font-mono text-xs text-slate-300">
              {utcTime}
            </div>
          </div>
        </div>

        {/* Right: AI Engine status & actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Gemini Mode Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e1626] border border-blue-900/40 text-[11px] font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-300">
              {backendMeta.geminiLive ? 'Gemini 2.5 Live' : 'Gemini 2.5 Sim Mode'}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${backendMeta.geminiLive ? 'bg-emerald-400' : 'bg-blue-400'}`} />
          </div>

          {/* Post-Mortem Button */}
          <button
            onClick={onOpenPostMortem}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-sm shadow-indigo-600/30"
            title="Open Incident Post-Mortem RCA"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Post-Mortem</span>
          </button>

          {/* Audio Alert Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title={isMuted ? 'Unmute Audio Alerts' : 'Mute Audio Alerts'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Quick Reset */}
          <button
            onClick={onReset}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition border border-slate-700"
            title="Reset System to Healthy State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
