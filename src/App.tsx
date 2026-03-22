import React, { useEffect, useState, useRef, useCallback, Suspense, lazy } from 'react';
import { 
  initSample, 
  initSampleData, 
  sovereignState, 
} from './core';
import { 
  BookOpen, 
  Layers,
  X,
  Terminal,
  Command,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from './api';
import { frontendRuntime } from './core';

// Lazy load heavy components
const NeuralNodeView = lazy(() => import('./components/NeuralNodeView'));
const NeuralBackground = lazy(() => import('./components/NeuralBackground'));
const WebGLVisualization = lazy(() => import('./components/WebGLVisualization').then(m => ({ default: m.WebGLVisualization })));
const AssistantPanel = lazy(() => import('./components/AssistantPanel'));
const DocumentationModal = lazy(() => import('./components/DocumentationModal'));
const NotificationsOverlay = lazy(() => import('./components/NotificationsOverlay'));

const App: React.FC = () => {
  const [state, setState] = useState(sovereignState.getState());
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [currentView, setCurrentView] = useState<'neural' | 'settings'>();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; isReplaying?: boolean }[]>([
    { role: 'assistant', content: 'Neural link established. System ready for commands. Type / to begin.' }
  ]);
  const [isTyping, setIsTyping] = useState(true);
  const [isSurging, setIsSurging] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Sovereign Runtime
    frontendRuntime.init();

    const bootstrap = async () => {
      initSample({ verbose: true });
      await initSampleData();
      const unsubscribe = sovereignState.subscribe(() => {
        setState(sovereignState.getState());
      });
      setIsInitialized(true);
      return unsubscribe;
    };
    bootstrap();

    // Initial System Check via Sovereign API
    const performSystemCheck = async () => {
      console.log('[SOVEREIGN_SYSTEM] Initiating neural substrate check...');
      const status = api.substrate.getStatus();
      const origin = api.origin.getSystemOrigin();
      
      await api.memory.save("last_session", { 
        status: "SECURE", 
        timestamp: status.timestamp,
        root_origin: origin.root 
      });
      
      if (status.active) {
        console.log(`[SOVEREIGN_SYSTEM] Substrate active at ${origin.root}. Neural nodes synchronized.`);
      }

      // Report initial health
      await frontendRuntime.reportHealth();
    };
    performSystemCheck();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    api.guardian.logNeuralActivity('USER_COMMAND', { message: userMessage });
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsTyping(true);
    setShowAssistant(true);

    // Command handling
    if (userMessage.toLowerCase() === '/neural') {
      api.guardian.logNeuralActivity('VIEW_TRANSITION', { target: 'neural' });
      setCurrentView('neural');
      setShowAssistant(true);
      setIsTyping(false);
      return;
    }
    if (userMessage.toLowerCase() === '/clear') {
      api.guardian.logNeuralActivity('SUBSTRATE_PURGE_REQUEST', { scope: 'chat' });
      setMessages([{ role: 'assistant', content: 'Neural pathways cleared.' }]);
      setIsTyping(false);
      return;
    }

    if (userMessage.toLowerCase() === '/status') {
      api.guardian.logNeuralActivity('SYSTEM_DIAGNOSTIC', { scope: 'full' });
      const status = api.substrate.getStatus();
      const security = api.security.getPosture();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `System Status: ${status.active ? 'ACTIVE' : 'INACTIVE'}. Security Level: ${security.level.toUpperCase()}. Entropy: ${api.security.getEntropyLevel().toFixed(4)}. Nodes Synced: 128.` 
      }]);
      setIsTyping(false);
      return;
    }

    if (userMessage.toLowerCase() === '/gan') {
      try {
        api.guardian.logNeuralActivity('GAN_SYNTHESIS_REQUEST', { scope: 'neural' });
        const syntheticData = await api.gan.synthesize();
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `GAN Synthesis Complete. Latent vector generated: [${syntheticData.map(v => v.toFixed(4)).join(', ')}]. Neural substrate updated with synthetic weights.` 
        }]);
      } catch (error) {
        console.error('GAN Synthesis error:', error);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Critical Error: GAN Substrate synthesis failed. ${error instanceof Error ? error.message : 'Unknown error'}` 
        }]);
      } finally {
        setIsTyping(false);
      }
      return;
    }

    if (userMessage.toLowerCase() === '/gan-train') {
      try {
        api.guardian.logNeuralActivity('GAN_TRAINING_INITIATED', { scope: 'adversarial' });
        const { genLoss, discLoss } = await api.gan.train();
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Adversarial Training Step Complete. Generator Loss: ${genLoss.toFixed(6)}. Discriminator Loss: ${discLoss.toFixed(6)}. Substrate equilibrium maintained.` 
        }]);
      } catch (error) {
        console.error('GAN Training error:', error);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Critical Error: GAN Adversarial training failed. ${error instanceof Error ? error.message : 'Unknown error'}` 
        }]);
      } finally {
        setIsTyping(false);
      }
      return;
    }

    try {
      const response = await api.neural.generateResponse(userMessage);
      api.guardian.logNeuralActivity('AI_RESPONSE_GENERATED', { length: response?.length });
      setMessages(prev => [...prev, { role: 'assistant', content: response || 'Command processed.' }]);
    } catch (error) {
      console.error('AI Assistant error:', error);
    } finally {
      setIsTyping(false);
    }
  }, [chatInput]);

  const handleReplay = useCallback((index: number) => {
    const message = messages[index];
    if (message.role !== 'assistant') return;

    setIsSurging(true);
    setShowAssistant(true);
    setMessages(prev => {
      const next = [...prev];
      next[index] = { ...message, isReplaying: true };
      return next;
    });

    setTimeout(() => {
      setIsSurging(false);
      setMessages(prev => {
        const next = [...prev];
        next[index] = { ...message, isReplaying: false };
        return next;
      });
    }, 2000);
  }, [messages]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleTriggerAssistant = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setChatInput(val);
    if (val.startsWith('/') || val.startsWith('//')) {
      setShowAssistant(true);
    }
  }, []);

  // Persistence Logic
  useEffect(() => {
    const savedLayout = localStorage.getItem('PXS_LAYOUT_STATE');
    if (savedLayout) {
      try {
        const parsed = JSON.parse(savedLayout);
        if (parsed.currentView) setCurrentView(parsed.currentView);
        if (parsed.showAssistant !== undefined) setShowAssistant(parsed.showAssistant);
      } catch (e) {
        console.error('Failed to restore neural layout:', e);
      }
    }
    
    // Bind layout to substrate using Guardian API for "lifetime" protection
    const bindLayout = async () => {
      const current = {
        currentView,
        showAssistant,
        timestamp: new Date().toISOString(),
        substrate: 'v4.2-SIGMA'
      };
      
      // Use Guardian API to bind and protect the layout node
      await api.guardian.bind('PXS_LAYOUT_STATE', current);
      api.guardian.logNeuralActivity('LAYOUT_SYNC', { view: currentView, assistant: showAssistant });
    };

    bindLayout();
  }, [currentView, showAssistant]);

  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#1E3A8A] text-white font-mono">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <div className="text-xl tracking-[0.2em] font-bold">SYNCHRONIZING_CORE</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white font-sans">
      <Suspense fallback={null}>
        <NeuralBackground isActive={isTyping || showAssistant} isSurge={isSurging} />
      </Suspense>
      
      {/* Top HUD */}
      <div className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-start z-50 pointer-events-none">
        <div className="flex items-center gap-6 md:gap-10 pointer-events-auto">
          <div className="pxs-logo glow-text text-xl md:text-3xl">PXS</div>
          <div className="h-8 md:h-10 w-[1px] bg-white/10" />
          <div className="flex flex-col gap-1">
            <span className="text-[8px] md:text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Neural_Substrate</span>
            <span className="text-[10px] md:text-xs font-bold text-sky-400 uppercase tracking-widest">v4.2-SIGMA_ACTIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-8 pointer-events-auto">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[8px] md:text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">System_Entropy</span>
            <span className="text-[10px] md:text-xs font-bold text-emerald-400 uppercase tracking-widest">0.0042_STABLE</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative h-full w-full flex flex-col items-center justify-center p-4 md:p-12 z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentView === 'neural' && (
            <motion.div 
              key="neural"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-6xl h-auto max-h-[70vh] md:max-h-[75vh] glass-panel overflow-hidden flex flex-col shadow-2xl mx-4"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-sky-500/10">
                    <Layers size={20} className="text-sky-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Neural Substrate Visualization</span>
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Real-time node synchronization</span>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentView(undefined)} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <Suspense fallback={<div className="text-sky-400 font-mono text-xs animate-pulse">LOADING_NEURAL_NODES...</div>}>
                  <NeuralNodeView />
                </Suspense>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Suspense fallback={null}>
          <AssistantPanel 
            showAssistant={showAssistant}
            setShowAssistant={setShowAssistant}
            messages={messages}
            isTyping={isTyping}
            handleReplay={handleReplay}
            chatEndRef={chatEndRef}
          />
        </Suspense>

        {/* Documentation Modal */}
        <Suspense fallback={null}>
          <DocumentationModal showDocs={showDocs} setShowDocs={setShowDocs} />
        </Suspense>
      </main>

      {/* Bottom Left: Documentation Icon */}
      <div className="absolute bottom-10 left-10 z-50">
        <button onClick={() => setShowDocs(true)} className="doc-icon group">
          <BookOpen size={20} className="group-hover:text-sky-400 transition-colors" />
        </button>
      </div>

      {/* Assistant Trigger (Bottom Center) */}
      <div className="assistant-trigger">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/30 to-blue-500/30 rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition duration-1000" />
          <div className="relative flex items-center">
            <div className="absolute left-6 text-white/20 group-focus-within:text-sky-400 transition-colors">
              <Command size={20} />
            </div>
            <input 
              type="text"
              value={chatInput}
              onChange={handleTriggerAssistant}
              onKeyDown={handleInputKeyDown}
              placeholder="Type / to interact with Sovereign AI..."
              className="assistant-input pl-16 pr-16"
            />
            <div className="absolute right-6 flex items-center gap-2 text-white/20">
              <Terminal size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Overlay */}
      <Suspense fallback={null}>
        <NotificationsOverlay notifications={state.notifications} />
      </Suspense>

      <Suspense fallback={null}>
        <WebGLVisualization />
      </Suspense>
    </div>
  );
};

export default App;
