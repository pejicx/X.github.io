import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Activity, Shield, Layers } from 'lucide-react';

const NeuralNodeView: React.FC = React.memo(() => {
  const nodes = [
    { id: 'CORE_ALPHA', type: 'processor', status: 'active', load: 42, icon: Cpu },
    { id: 'MEM_STRATA', type: 'memory', status: 'syncing', load: 18, icon: Layers },
    { id: 'SEC_POSTURE', type: 'security', status: 'secure', load: 5, icon: Shield },
    { id: 'NEURAL_LINK', type: 'network', status: 'active', load: 67, icon: Activity },
    { id: 'SURGE_BUFFER', type: 'power', status: 'charging', load: 89, icon: Zap },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nodes.map((node, idx) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/30 transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
              <node.icon size={24} />
            </div>
            <div className={`text-[10px] font-mono px-2 py-1 rounded-full uppercase tracking-widest ${
              node.status === 'active' || node.status === 'secure' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-sky-500/10 text-sky-400'
            }`}>
              {node.status}
            </div>
          </div>
          
          <h3 className="text-sm font-bold mb-1 tracking-wider">{node.id}</h3>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4">{node.type}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-white/30">LOAD_INDEX</span>
              <span className="text-sky-400">{node.load}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${node.load}%` }}
                className="h-full bg-sky-500/50"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

export default NeuralNodeView;
