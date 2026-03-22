import React, { useEffect, useRef, useState } from 'react';
import { webGLSubstrate } from '../services/webglSubstrate';

export const WebGLVisualization: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for a custom event to toggle visibility
    const handleToggle = (e: any) => {
      setIsVisible(e.detail.visible);
      if (e.detail.type) {
        webGLSubstrate.create3DModel(e.detail.type);
      }
    };

    window.addEventListener('toggle-webgl', handleToggle);

    if (isVisible && canvasRef.current) {
      webGLSubstrate.initialize(canvasRef.current);
    }

    return () => {
      window.removeEventListener('toggle-webgl', handleToggle);
      webGLSubstrate.dispose();
    };
  }, [isVisible]);

  const handleEnterVR = async () => {
    await webGLSubstrate.enterVR();
  };

  if (!isVisible) return null;

  return (
    <div 
      id="webgl-overlay"
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/20 backdrop-blur-sm"
    >
      <div className="relative w-[80vw] h-[80vh] bg-zinc-900/80 rounded-2xl border border-white/10 overflow-hidden pointer-events-auto shadow-2xl">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
        />
        <div className="absolute top-4 right-4 text-white/50 text-xs font-mono flex flex-col items-end gap-2">
          <span>WEBGL_SUBSTRATE_ACTIVE</span>
          <span className="text-[10px] text-sky-400/50">WEBXR_READY</span>
        </div>
        
        <div className="absolute top-4 left-4 flex items-center gap-3">
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-bold uppercase tracking-widest transition-colors border border-white/10"
          >
            Close
          </button>
          <button 
            onClick={handleEnterVR}
            className="p-2 px-4 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-widest transition-colors border border-sky-500/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
          >
            Enter VR Experience
          </button>
        </div>
      </div>
    </div>
  );
});
