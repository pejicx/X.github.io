import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, RefreshCw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isReplaying?: boolean;
}

interface AssistantPanelProps {
  showAssistant: boolean;
  setShowAssistant: (show: boolean) => void;
  messages: Message[];
  isTyping: boolean;
  handleReplay: (index: number) => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

const AssistantPanel: React.FC<AssistantPanelProps> = ({
  showAssistant,
  setShowAssistant,
  messages,
  isTyping,
  handleReplay,
  chatEndRef
}) => {
  return (
    <AnimatePresence mode="wait">
      {showAssistant && (
        <motion.div 
          key="assistant"
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          className="fixed bottom-24 md:bottom-32 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-full max-w-4xl h-auto max-h-[50vh] md:max-h-[60vh] glass-panel flex flex-col overflow-hidden z-[60] shadow-2xl"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <Bot size={20} className="text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-widest">Sovereign Assistant</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Session_Active</div>
              <button onClick={() => setShowAssistant(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center justify-between w-full mb-1 px-2">
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">
                    {msg.role === 'user' ? 'Operator' : 'Sovereign_AI'}
                  </span>
                  {msg.role === 'assistant' && (
                    <button 
                      onClick={() => handleReplay(idx)}
                      className="text-[8px] font-mono text-sky-400/50 hover:text-sky-400 uppercase tracking-widest flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw size={10} className={msg.isReplaying ? 'animate-spin' : ''} />
                      Instant_Replay
                    </button>
                  )}
                </div>
                <div className={`relative max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed overflow-hidden ${
                  msg.role === 'user' 
                    ? 'bg-sky-500/20 border border-sky-500/30 text-white shadow-[0_0_20px_rgba(56,189,248,0.1)]' 
                    : 'bg-white/5 border border-white/10 text-white/90'
                }`}>
                  {msg.isReplaying && (
                    <motion.div 
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/10 to-transparent skew-x-12"
                    />
                  )}
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-2 p-4 bg-white/5 rounded-2xl w-fit">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(AssistantPanel);
