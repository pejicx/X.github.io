import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Zap, 
  Code, 
  ImageIcon, 
  Video, 
  Cpu, 
  Binary, 
  Search, 
  Download, 
  Share2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Maximize2,
  Minimize2,
  Send,
  FileText,
  Layers,
  Box,
  Monitor,
  Shield,
  Palette,
  Type as TypeIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { generateUniversal, GenerationType, GenerationResult } from '../services/universalGenerator';

const GENERATION_TYPES: { id: GenerationType; label: string; icon: any; color: string; desc: string }[] = [
  { id: GenerationType.TEXT, label: 'Text & Docs', icon: FileText, color: 'text-blue-400', desc: 'Documentation, explanations, and creative writing.' },
  { id: GenerationType.CODE, label: 'Source Code', icon: Code, color: 'text-emerald-400', desc: 'Functional code in any language or framework.' },
  { id: GenerationType.IMAGE, label: 'Visual Art', icon: ImageIcon, color: 'text-purple-400', desc: 'Concept art, diagrams, and UI visualizations.' },
  { id: GenerationType.VIDEO, label: 'Video Concept', icon: Video, color: 'text-red-400', desc: 'Scene sequences and storyboard structures.' },
  { id: GenerationType.SYSTEM, label: 'System Arch', icon: Cpu, color: 'text-amber-400', desc: 'APIs, backend services, and database schemas.' },
  { id: GenerationType.ARTIFACT, label: 'Unique Artifact', icon: Box, color: 'text-indigo-400', desc: 'Deterministic artifacts and tool definitions.' }
];

export default function UniversalGeneratorView() {
  const [prompt, setPrompt] = useState('');
  const [activeType, setActiveType] = useState<GenerationType>(GenerationType.TEXT);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [history, setHistory] = useState<GenerationResult[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const res = await generateUniversal(prompt, activeType);
      setResult(res);
      setHistory(prev => [res, ...prev].slice(0, 10));
    } catch (err: any) {
      setError(err.message || "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderResult = () => {
    if (!result) return result;

    switch (result.type) {
      case GenerationType.IMAGE:
        return (
          <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src={result.content} 
              alt="Generated Artifact" 
              className="w-full h-auto object-contain bg-black/40"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
              <div className="flex gap-4">
                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all">
                  <Download size={20} />
                </button>
                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        );
      case GenerationType.CODE:
      case GenerationType.SYSTEM:
      case GenerationType.ARTIFACT:
        return (
          <div className="p-8 bg-[#0A0A0A] border border-white/10 rounded-2xl font-mono text-sm overflow-x-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-500">Functional Realization</span>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(result.content)}
                className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
              >
                Copy Code
              </button>
            </div>
            <pre className="text-emerald-400/90 leading-relaxed">
              {result.content}
            </pre>
          </div>
        );
      default:
        return (
          <div className="p-8 bg-surface border border-white/10 rounded-2xl shadow-xl">
            <div className="markdown-body prose prose-invert max-w-none">
              <Markdown>{result.content}</Markdown>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-[#E0E0E0] font-sans overflow-hidden relative">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Control Panel */}
        <div className="w-96 border-r border-white/10 bg-[#0A0A0A]/50 flex flex-col p-8 space-y-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white flex items-center gap-3">
              <Sparkles className="text-accent" />
              Universal
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-text-secondary">Multimodal Generator</p>
          </div>

          <div className="space-y-6">
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Generation Substrate</div>
            <div className="grid grid-cols-1 gap-3">
              {GENERATION_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setActiveType(type.id)}
                  className={`p-4 rounded-2xl border transition-all text-left flex items-start gap-4 group ${activeType === type.id ? 'bg-white/5 border-white/20 shadow-lg' : 'border-transparent hover:bg-white/5'}`}
                >
                  <div className={`p-2 rounded-xl bg-white/5 ${type.color} group-hover:scale-110 transition-transform`}>
                    <type.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-widest mb-1">{type.label}</div>
                    <div className="text-[9px] opacity-40 leading-tight">{type.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">History</div>
            <div className="space-y-2">
              {history.map((h, i) => (
                <button 
                  key={i}
                  onClick={() => setResult(h)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all text-left flex items-center gap-3 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent opacity-40 group-hover:opacity-100 transition-opacity" />
                  <div className="flex-1 truncate text-[10px] uppercase tracking-widest opacity-60">
                    {h.metadata?.prompt || 'Generated Content'}
                  </div>
                </button>
              ))}
              {history.length === 0 && (
                <div className="text-[10px] uppercase tracking-widest opacity-20 text-center py-8 italic">No generation history</div>
              )}
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Output Area */}
          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="h-full flex flex-col items-center justify-center space-y-8"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto text-accent animate-pulse" size={32} />
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-xl font-black tracking-tighter uppercase italic text-white">Synthesizing Realization</div>
                    <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent animate-pulse">Accessing Sovereign Intelligence</div>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-5xl mx-auto space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 rounded-2xl">
                        <CheckCircle2 className="text-accent" size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic text-white">Generation Complete</h2>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-secondary">Multimodal Artifact Realized</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                        <Share2 size={18} />
                      </button>
                      <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                  {renderResult()}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20">
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                    <Zap size={48} />
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-black tracking-tighter uppercase italic">Awaiting Prompt</div>
                    <div className="text-[10px] uppercase tracking-[0.4em] font-bold">Universal Engine Idle</div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-12 pt-0">
            <div className="max-w-5xl mx-auto relative">
              <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full opacity-50 pointer-events-none" />
              <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-2 shadow-2xl flex items-end gap-4 focus-within:border-accent/50 transition-all">
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                  placeholder={`Describe the ${activeType} you wish to realize...`}
                  className="flex-1 bg-transparent border-none focus:ring-0 p-6 text-sm uppercase tracking-widest placeholder:opacity-20 resize-none h-32 custom-scrollbar"
                />
                <div className="flex flex-col gap-2 p-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="p-4 bg-accent text-white rounded-2xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent/20"
                  >
                    {isGenerating ? <RefreshCw className="animate-spin" size={24} /> : <Send size={24} />}
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between px-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-text-secondary">
                    <Shield size={12} className="text-accent" />
                    Sovereign Encryption
                  </div>
                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-text-secondary">
                    <Zap size={12} className="text-amber-500" />
                    High-Priority Compute
                  </div>
                </div>
                <div className="text-[9px] uppercase tracking-widest font-bold opacity-20">
                  PejicAIX Universal Engine v1.0
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 right-12 z-[100] p-6 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-md flex items-center gap-4 text-red-400 shadow-2xl"
          >
            <AlertCircle size={24} />
            <div>
              <div className="text-xs font-bold uppercase tracking-widest">Generation Error</div>
              <div className="text-[10px] opacity-80 mt-1">{error}</div>
            </div>
            <button onClick={() => setError(null)} className="ml-4 opacity-40 hover:opacity-100">
              <Zap size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
