import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Sparkles, 
  Loader2, 
  RotateCw 
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export function PostMortemModal({ 
  isOpen, 
  onClose, 
  markdown, 
  isGenerating, 
  onGenerate, 
  scenarioKey 
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown || ''], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-postmortem-${scenarioKey || 'rca'}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b101c] border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#0e1526] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-600/50 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">Automated Post-Mortem RCA</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  Gemini 2.5 Pro Generated
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Root Cause Analysis, Mermaid Architecture Diagram, 5-Whys, & Action Items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Regenerate */}
            <button
              onClick={() => onGenerate(scenarioKey)}
              disabled={isGenerating}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition disabled:opacity-50"
              title="Regenerate Post-Mortem"
            >
              <RotateCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>

            {/* Copy Markdown */}
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy MD'}</span>
            </button>

            {/* Download Report */}
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm shadow-blue-600/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>

            {/* Print / Save PDF */}
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Print / Save PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 max-h-[75vh] bg-[#070a12]">
          {isGenerating && !markdown ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
              <p className="text-sm font-semibold">Gemini 2.5 Pro synthesizing Root Cause Analysis...</p>
              <p className="text-xs text-slate-500 mt-1">Correlating telemetry curves, execution logs, and architecture topology</p>
            </div>
          ) : markdown ? (
            <div className="prose prose-invert max-w-none">
              <MarkdownRenderer content={markdown} />
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
              <FileText className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No post-mortem generated yet.</p>
              <button
                onClick={() => onGenerate(scenarioKey)}
                className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Post-Mortem Report</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
