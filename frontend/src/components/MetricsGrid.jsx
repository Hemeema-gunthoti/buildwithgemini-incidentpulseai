import React from 'react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Gauge, 
  Activity, 
  Cpu, 
  HardDrive, 
  Database, 
  TrendingUp, 
  TrendingDown, 
  Server
} from 'lucide-react';

export function MetricsGrid({ metricsHistory, latestMetrics, incident }) {
  const isOutage = incident.status !== 'STEADY' && incident.status !== 'RESOLVED';
  
  const p99 = latestMetrics.latencyP99 || 145;
  const p50 = latestMetrics.latencyP50 || 42;
  const errorRate = latestMetrics.errorRate || 0.04;
  const cpu = latestMetrics.cpu || 24;
  const memory = latestMetrics.memory || 46;
  const rps = latestMetrics.rps || 1350;
  const dbActive = latestMetrics.dbPoolActive || 18;
  const dbWaiting = latestMetrics.dbPoolWaiting || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 my-3">
      {/* 1. Latency Stream (p50 / p95 / p99) */}
      <div className={`p-3.5 rounded-xl bg-[#0d1322] border transition-all duration-300 ${
        p99 > 1000 ? 'border-rose-600/60 shadow-lg shadow-rose-950/40' : 'border-slate-800'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${p99 > 1000 ? 'bg-rose-950 text-rose-400' : 'bg-blue-950 text-blue-400'}`}>
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-300">API Response Latency</div>
              <div className="text-[10px] text-slate-400">p50 / p95 / p99 percentiles</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-bold ${p99 > 1000 ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
              {p99} <span className="text-xs font-normal text-slate-400">ms</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-end gap-1.5">
              <span>p50: {p50}ms</span>
            </div>
          </div>
        </div>

        {/* Latency Area Chart */}
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metricsHistory} margin={{ top: 2, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={p99 > 1000 ? '#f43f5e' : '#3b82f6'} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={p99 > 1000 ? '#f43f5e' : '#3b82f6'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 'auto']} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '11px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area 
                type="monotone" 
                dataKey="latencyP99" 
                name="p99 (ms)"
                stroke={p99 > 1000 ? '#f43f5e' : '#60a5fa'} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#latencyGrad)" 
                isAnimationActive={false}
              />
              <Area 
                type="monotone" 
                dataKey="latencyP50" 
                name="p50 (ms)"
                stroke="#38bdf8" 
                strokeWidth={1}
                strokeDasharray="2 2"
                fill="transparent" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Error Rate % */}
      <div className={`p-3.5 rounded-xl bg-[#0d1322] border transition-all duration-300 ${
        errorRate > 5 ? 'border-rose-600/60 shadow-lg shadow-rose-950/40' : 'border-slate-800'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${errorRate > 5 ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'}`}>
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-300">Failure / Error Rate</div>
              <div className="text-[10px] text-slate-400">HTTP 5xx & connection drops</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-mono font-bold ${errorRate > 5 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
              {errorRate.toFixed(2)}%
            </div>
            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-end gap-1">
              {errorRate > 5 ? (
                <span className="text-rose-400 flex items-center font-semibold"><TrendingUp className="w-3 h-3" /> CRITICAL</span>
              ) : (
                <span className="text-emerald-400 flex items-center"><TrendingDown className="w-3 h-3" /> SLA OK</span>
              )}
            </div>
          </div>
        </div>

        {/* Error Rate Line Chart */}
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metricsHistory} margin={{ top: 2, right: 0, left: -25, bottom: 0 }}>
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 50]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '11px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Line 
                type="stepAfter" 
                dataKey="errorRate" 
                name="Error Rate (%)"
                stroke={errorRate > 5 ? '#f43f5e' : '#10b981'} 
                strokeWidth={2.5} 
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Compute Saturation (CPU & Memory) */}
      <div className={`p-3.5 rounded-xl bg-[#0d1322] border transition-all duration-300 ${
        cpu > 80 || memory > 85 ? 'border-amber-600/60 shadow-lg shadow-amber-950/40' : 'border-slate-800'
      }`}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-300">Cluster Compute Health</div>
              <div className="text-[10px] text-slate-400">K8s worker nodes & pods</div>
            </div>
          </div>
          <div className="text-xs font-mono font-bold text-slate-300">
            {rps} <span className="text-[10px] font-normal text-slate-400">RPS</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {/* CPU Bar */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400 flex items-center gap-1"><Cpu className="w-3 h-3" /> CPU Load</span>
              <span className={`font-mono font-bold ${cpu > 85 ? 'text-rose-400' : cpu > 70 ? 'text-amber-400' : 'text-slate-200'}`}>
                {cpu}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  cpu > 85 ? 'bg-rose-500' : cpu > 70 ? 'bg-amber-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(100, cpu)}%` }}
              />
            </div>
          </div>

          {/* Memory Bar */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400 flex items-center gap-1"><HardDrive className="w-3 h-3" /> JVM/Node Memory</span>
              <span className={`font-mono font-bold ${memory > 90 ? 'text-rose-400 animate-pulse' : memory > 75 ? 'text-amber-400' : 'text-slate-200'}`}>
                {Number(memory).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  memory > 90 ? 'bg-rose-500' : memory > 75 ? 'bg-amber-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${Math.min(100, memory)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Database Connection Pool & Threads */}
      <div className={`p-3.5 rounded-xl bg-[#0d1322] border transition-all duration-300 ${
        dbActive >= 95 || dbWaiting > 50 ? 'border-rose-600/60 shadow-lg shadow-rose-950/40' : 'border-slate-800'
      }`}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${dbActive >= 95 ? 'bg-rose-950 text-rose-400' : 'bg-teal-950 text-teal-400'}`}>
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-300">PostgreSQL Pool & Locks</div>
              <div className="text-[10px] text-slate-400">PgBouncer client sockets</div>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              dbActive >= 95 ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-slate-800 text-slate-300'
            }`}>
              {dbActive >= 95 ? 'STARVED' : 'HEALTHY'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center mt-2">
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Connections</div>
            <div className={`text-base font-mono font-bold ${dbActive >= 95 ? 'text-rose-400' : 'text-teal-400'}`}>
              {dbActive} <span className="text-xs font-normal text-slate-500">/ 100</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Queue / Waiting</div>
            <div className={`text-base font-mono font-bold ${dbWaiting > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`}>
              {dbWaiting} <span className="text-xs font-normal text-slate-500">clients</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
