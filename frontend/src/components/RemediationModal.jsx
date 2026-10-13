import React, { useState, useEffect } from 'react';
import { 
  X, 
  Terminal, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Copy, 
  Check, 
  Play, 
  Loader2, 
  Code2, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function RemediationModal({ 
  isOpen, 
  onClose, 
  runbook, 
  onExecute, 
  onReject, 
  progress, 
  incident 
}) {
  const [activeTab, setActiveTab] = useState('steps'); // 'steps' | 'diff'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Trigger confetti on successful completion
  useEffect(() => {
    if (progress && progress.isFinished) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#6366f1']
      });
    }
  }, [progress]);

  if (!isOpen || !runbook) return null;

  const handleCopyCommand = (cmd, idx) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onExecute(runbook.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectClick = () => {
    const reason = prompt('Please provide reason for rejecting runbook (optional):') || 'Operator override';
    onReject(runbook.id, reason);
    onClose();
  };

  const isCompleted = progress && progress.isFinished;
  const currentStep = progress ? progress.stepIndex : 0;
  const totalSteps = runbook.steps.length;
  const progressPercent = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b101c] border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#0e1526] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">{runbook.title}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  HUMAN-IN-THE-LOOP SAFETY GATE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous SRE Runbook · Review commands before executing on cluster
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status / Progress Banner if executing or finished */}
        {progress && (
          <div className={`px-5 py-3 border-b flex flex-col gap-2 ${
            isCompleted 
              ? 'bg-emerald-950/40 border-emerald-800/60' 
              : 'bg-blue-950/40 border-blue-800/60'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Runbook Execution Completed — System Returned to Healthy State</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    <span>Executing Step {progress.stepIndex} of {totalSteps}...</span>
                  </>
                )}
              </span>
              <span className="font-mono font-bold text-slate-300">{progressPercent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  isCompleted ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {progress.stdout && (
              <div className="mt-1 p-2 rounded bg-black/60 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                $ {progress.stdout}
              </div>
            )}
          </div>
        )}

        {/* Tab Controls */}
        <div className="px-5 py-2 bg-[#090d16] border-b border-slate-800 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeTab === 'steps'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Execution Commands ({runbook.steps.length})</span>
          </button>

          {runbook.diff && (
            <button
              onClick={() => setActiveTab('diff')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'diff'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Config Diff Preview</span>
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1 max-h-[460px]">
          {activeTab === 'steps' ? (
            <div className="space-y-3">
              {runbook.steps.map((step, idx) => {
                const isStepFinished = currentStep > step.stepNumber || isCompleted;
                const isStepActive = currentStep === step.stepNumber && !isCompleted;

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition ${
                      isStepFinished
                        ? 'bg-emerald-950/20 border-emerald-800/40'
                        : isStepActive
                        ? 'bg-blue-950/30 border-blue-600 shadow-md shadow-blue-950/40'
                        : 'bg-[#080d17] border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                          isStepFinished
                            ? 'bg-emerald-500 text-black'
                            : isStepActive
                            ? 'bg-blue-500 text-white animate-pulse'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {isStepFinished ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.stepNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-200">{step.title}</span>
                      </div>

                      <button
                        onClick={() => handleCopyCommand(step.command, idx)}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition flex items-center gap-1 text-[11px]"
                      >
                        {copiedIndex === idx ? (
                          <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Copied</span>
                        ) : (
                          <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</span>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-2 pl-7">
                      {step.explanation}
                    </p>

                    <div className="pl-7">
                      <div className="p-2.5 rounded-lg bg-black/80 border border-slate-800/80 font-mono text-xs text-blue-300 overflow-x-auto flex items-center justify-between">
                        <code>$ {step.command}</code>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Diff Tab */
            <div className="rounded-xl bg-[#080d17] border border-slate-800 p-3 font-mono text-xs overflow-x-auto">
              <div className="text-[11px] text-slate-400 mb-2 font-semibold">Declarative Configuration Changes:</div>
              {runbook.diff.split('\n').map((line, i) => {
                let color = 'text-slate-300';
                let bg = 'transparent';
                if (line.startsWith('+') && !line.startsWith('+++')) {
                  color = 'text-emerald-400';
                  bg = 'bg-emerald-950/40';
                } else if (line.startsWith('-') && !line.startsWith('---')) {
                  color = 'text-rose-400';
                  bg = 'bg-rose-950/40';
                } else if (line.startsWith('@@')) {
                  color = 'text-blue-400';
                }
                return (
                  <div key={i} className={`px-2 py-0.5 rounded ${bg} ${color}`}>
                    {line}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#0e1526] border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Target Environment: <strong>production-cluster-us-east</strong></span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRejectClick}
              disabled={progress && !isCompleted}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-300 text-xs font-semibold transition disabled:opacity-50"
            >
              Reject Runbook
            </button>

            {isCompleted ? (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-700/40 flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Close & Return to War-Room</span>
              </button>
            ) : (
              <button
                onClick={handleApprove}
                disabled={isSubmitting || (progress && !isCompleted)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-700/40 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Executing Commands...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Approve & Execute Fix</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
