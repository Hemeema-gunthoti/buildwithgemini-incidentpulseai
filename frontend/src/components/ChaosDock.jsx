import React, { useState } from 'react';
import { 
  Zap, 
  RotateCcw, 
  Flame, 
  Sliders, 
  ShieldAlert, 
  Loader2, 
  Layers 
} from 'lucide-react';

export const SCENARIO_OPTIONS = [
  {
    key: 'payment_cascade',
    name: 'Scenario A: Stripe Gateway 504 Timeout Cascade',
    desc: '3rd-party latency surge, checkout thread exhaustion & circuit breaker trip',
    severity: 'P1',
  },
  {
    key: 'db_deadlock',
    name: 'Scenario B: PostgreSQL Deadlock & Pool Exhaustion',
    desc: 'Unindexed migration locking user_sessions table, pool saturation (100/100)',
    severity: 'P1',
  },
  {
    key: 'memory_leak',
    name: 'Scenario C: Microservice Memory Leak & OOMKilled Loop',
    desc: 'Unbounded heap cache growth, full GC pauses > 11s, SIGKILL exit 137',
    severity: 'P2',
  },
];

export function ChaosDock({ onInject, onReset, activeScenario, incidentStatus }) {
  const [selectedScenario, setSelectedScenario] = useState('payment_cascade');
  const [intensity, setIntensity] = useState(1.0);
  const [isInjecting, setIsInjecting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const isOutageActive = incidentStatus !== 'STEADY' && incidentStatus !== 'RESOLVED';

  const handleInject = async () => {
    setIsInjecting(true);
    try {
      await onInject(selectedScenario, intensity);
    } finally {
      setIsInjecting(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await onReset();
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 w-full max-w-4xl px-3">
      <div className="bg-[#0f1629]/95 border border-slate-700/80 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs">
        {/* Left: Chaos Controller Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-900/30">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-100 flex items-center gap-1.5">
              <span>CHAOS CONTROLLER</span>
              {isOutageActive && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <div className="text-[10px] text-slate-400">Production Outage Simulator</div>
          </div>
        </div>

        {/* Center: Scenario Selector */}
        <div className="flex-1 min-w-[240px] flex items-center gap-2">
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            disabled={isInjecting}
            className="w-full py-1.5 px-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium focus:outline-none focus:border-rose-500 transition cursor-pointer"
          >
            {SCENARIO_OPTIONS.map((sc) => (
              <option key={sc.key} value={sc.key}>
                [{sc.severity}] {sc.name}
              </option>
            ))}
          </select>

          {/* Intensity Selector */}
          <div className="hidden md:flex items-center gap-1 shrink-0 bg-slate-900 border border-slate-700 rounded-xl p-1 text-[11px]">
            <Sliders className="w-3 h-3 text-slate-400 ml-1" />
            {[1.0, 1.5, 2.0].map((val) => (
              <button
                key={val}
                onClick={() => setIntensity(val)}
                className={`px-2 py-0.5 rounded-lg font-mono font-semibold transition ${
                  intensity === val
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {val}x
              </button>
            ))}
          </div>
        </div>

        {/* Right: Trigger & Reset Buttons */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          {/* Inject Failure Button */}
          <button
            onClick={handleInject}
            disabled={isInjecting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-rose-900/40 disabled:opacity-50"
          >
            {isInjecting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Injecting...</span>
              </>
            ) : (
              <>
                <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
                <span>Inject Failure</span>
              </>
            )}
          </button>

          {/* Reset System Button */}
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700 disabled:opacity-50"
            title="Restore baseline steady-state health metrics"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset System</span>
          </button>
        </div>
      </div>
    </div>
  );
}
