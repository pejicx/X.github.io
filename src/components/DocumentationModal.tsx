import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X } from 'lucide-react';

interface DocumentationModalProps {
  showDocs: boolean;
  setShowDocs: (show: boolean) => void;
}

const DocumentationModal: React.FC<DocumentationModalProps> = ({ showDocs, setShowDocs }) => {
  return (
    <AnimatePresence>
      {showDocs && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-2xl glass-panel p-8 relative"
          >
            <button 
              onClick={() => setShowDocs(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Info className="text-sky-400" />
              System Documentation
            </h2>

            <div className="space-y-6 text-sm text-white/70">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="font-bold text-white uppercase tracking-widest text-[10px]">App Version</p>
                  <p className="font-mono">v2.5.0-STABLE</p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-white uppercase tracking-widest text-[10px]">Neural Substrate</p>
                  <p className="font-mono">Active / Encrypted</p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-white uppercase tracking-widest text-[10px]">License</p>
                  <p className="font-mono text-sky-400">MIT Open Source</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Sovereign Substrate</span>
                  <span className="text-sky-400 font-mono text-[10px]">v4.2-SIGMA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Node Alpha Status</span>
                  <span className="text-emerald-400 font-mono text-[10px]">ACTIVE_STABLE</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-center">
                  <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">CPU Load</p>
                  <p className="text-sky-400 font-mono">12.4%</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Latency</p>
                  <p className="text-emerald-400 font-mono">18ms</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Uptime</p>
                  <p className="text-white font-mono">99.99%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Neural Link Status</span>
                <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest">Stable</span>
              </div>

              <div className="space-y-4">
                <p className="font-bold text-white uppercase tracking-widest text-[10px]">Shortcut Commands</p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                    <span className="font-mono text-sky-400">/neural</span>
                    <span className="group-hover:text-white transition-colors">View substrate visualization</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                    <span className="font-mono text-sky-400">/status</span>
                    <span className="group-hover:text-white transition-colors">Check system health</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                    <span className="font-mono text-sky-400">/gan</span>
                    <span className="group-hover:text-white transition-colors">Synthesize neural data (TensorFlow.js)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                    <span className="font-mono text-sky-400">/gan-train</span>
                    <span className="group-hover:text-white transition-colors">Run adversarial training step</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                    <span className="font-mono text-sky-400">/clear</span>
                    <span className="group-hover:text-white transition-colors">Reset neural pathways</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl">
                <p className="text-sky-400 font-bold mb-2">Visual Effects</p>
                <p>Neural background reflects real-time processing activity. Pulsing cells indicate assistant engagement. Mouse proximity influences neural node attraction.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(DocumentationModal);
