import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { sovereignState } from '../core';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationsOverlayProps {
  notifications: Notification[];
}

const NotificationsOverlay: React.FC<NotificationsOverlayProps> = ({ notifications }) => {
  return (
    <div className="fixed top-24 right-8 flex flex-col gap-4 z-[100]">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`p-4 rounded-xl border backdrop-blur-xl flex items-center gap-4 min-w-[300px] shadow-2xl ${
              n.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              n.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
              'bg-white/10 border-white/20 text-white'
            }`}
          >
            <div className="flex-1 text-xs font-medium tracking-wide">{n.message}</div>
            <button 
              onClick={() => sovereignState.removeNotification(n.id)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(NotificationsOverlay);
