import React, { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    darkMode: true,
    background: '#0d1117',
    primaryColor: '#3b82f6',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#60a5fa',
    lineColor: '#94a3b8',
    secondaryColor: '#f59e0b',
    tertiaryColor: '#10b981',
  },
});

function MermaidDiagram({ code }) {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState('');
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

    mermaid.render(id, code)
      .then(({ svg }) => {
        if (isMounted) {
          setSvg(svg);
          setRenderError(false);
        }
      })
      .catch((err) => {
        console.warn('Mermaid render error:', err);
        if (isMounted) setRenderError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [code]);

  if (renderError) {
    return (
      <div className="p-3 my-2 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-slate-400 overflow-x-auto">
        <div className="text-amber-400 mb-1 font-semibold">Diagram Architecture Code:</div>
        <pre>{code}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-3 p-4 bg-[#0a0f1d] border border-blue-900/40 rounded-lg flex justify-center items-center overflow-x-auto shadow-inner"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (lang === 'mermaid') {
    return <MermaidDiagram code={code} />;
  }

  if (lang === 'diff') {
    const lines = code.split('\n');
    return (
      <div className="my-2 rounded-lg bg-[#0b0f19] border border-slate-800 text-xs font-mono overflow-hidden">
        <div className="flex justify-between items-center px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 text-slate-400">
          <span className="text-[11px] font-semibold text-slate-300">CONFIGURATION DIFF</span>
          <button onClick={handleCopy} className="hover:text-white transition flex items-center gap-1 text-[11px]">
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="p-3 overflow-x-auto space-y-0.5">
          {lines.map((line, idx) => {
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
              <div key={idx} className={`px-2 py-0.5 rounded ${bg} ${color}`}>
                {line}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="my-2 rounded-lg bg-[#090d16] border border-slate-800 text-xs font-mono overflow-hidden group">
      <div className="flex justify-between items-center px-3 py-1 bg-slate-900/60 border-b border-slate-800 text-slate-400">
        <span className="text-[10px] uppercase font-semibold text-blue-400">{lang || 'text'}</span>
        <button onClick={handleCopy} className="hover:text-white transition flex items-center gap-1 text-[11px]">
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content }) {
  if (!content) return null;

  // Split by fenced code blocks
  const parts = [];
  const regex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', text: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', lang: match[1], code: match[2].trim() });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', text: content.slice(lastIndex) });
  }

  const renderTextSegment = (text, key) => {
    const lines = text.split('\n');
    return (
      <div key={key} className="space-y-1.5 text-sm leading-relaxed text-slate-200">
        {lines.map((line, idx) => {
          // Headers
          if (line.startsWith('### ')) {
            return <h3 key={idx} className="text-base font-bold text-slate-100 mt-2 mb-1 flex items-center gap-1.5">{line.replace('### ', '')}</h3>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={idx} className="text-lg font-bold text-blue-300 mt-3 mb-1 border-b border-slate-800 pb-1">{line.replace('## ', '')}</h2>;
          }
          if (line.startsWith('# ')) {
            return <h1 key={idx} className="text-xl font-extrabold text-blue-400 mt-4 mb-2">{line.replace('# ', '')}</h1>;
          }
          // Blockquote
          if (line.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-2 border-blue-500 bg-blue-950/20 pl-3 py-1 my-1 italic text-slate-300 text-xs">
                {line.replace('> ', '')}
              </blockquote>
            );
          }
          // List item
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const itemText = line.trim().replace(/^[-*]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 ml-2 text-xs">
                <span className="text-blue-400 font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(itemText) }} />
              </div>
            );
          }
          // Empty line
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }
          // Regular paragraph
          return (
            <p key={idx} className="text-xs" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          );
        })}
      </div>
    );
  };

  const formatInline = (str) => {
    return str
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 font-mono text-[11px]">$1</code>');
  };

  return (
    <div className="space-y-2">
      {parts.map((p, i) => {
        if (p.type === 'code') {
          return <CodeBlock key={i} code={p.code} lang={p.lang} />;
        }
        return renderTextSegment(p.text, i);
      })}
    </div>
  );
}
