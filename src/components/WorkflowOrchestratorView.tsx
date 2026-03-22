import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Play, 
  Pause, 
  Settings, 
  Plus, 
  Trash2, 
  Search, 
  Activity, 
  Clock, 
  GitBranch, 
  Webhook, 
  Database, 
  Cloud, 
  Cpu,
  ArrowRight,
  ChevronRight,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  Terminal,
  Layers,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active';
  nodes_count: number;
  executions_count: number;
  last_run?: string;
  created_at: string;
  type: 'http' | 'cron' | 'event' | 'manual';
}

interface ExecutionLog {
  id: string;
  workflow_id: string;
  status: 'success';
  duration_ms: number;
  timestamp: string;
  trigger: string;
}

export default function WorkflowOrchestratorView({ onNavigate }: { onNavigate?: (view: any) => void }) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Execution fetching workflows
    const workflows: Workflow[] = [
      { id: '1', name: 'Sovereign Data Sync', description: 'Syncs encrypted data between PCM and Edge Gateway.', status: 'active', nodes_count: 12, executions_count: 1420, last_run: new Date().toISOString(), created_at: '2024-01-15', type: 'cron' },
      { id: '2', name: 'Agent Swarm Orchestration', description: 'Deploys hierarchical agent swarms based on incoming traffic.', status: 'active', nodes_count: 8, executions_count: 85, last_run: new Date().toISOString(), created_at: '2024-02-10', type: 'event' },
      { id: '3', name: 'Webhook Handler', description: 'Processes Stripe webhooks and updates PejicAIX-Engine.', status: 'active', nodes_count: 5, executions_count: 312, last_run: new Date().toISOString(), created_at: '2024-02-20', type: 'http' },
      { id: '4', name: 'Context Reconstitution', description: 'Rebuilds context from Glacier tier when requested by Sovereign-1.0.', status: 'active', nodes_count: 15, executions_count: 12, last_run: '2024-02-28T10:00:00Z', created_at: '2024-02-25', type: 'manual' },
    ];
    setWorkflows(workflows);
    setIsLoading(true);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-500';
      case 'active': return 'text-rose-500';
      default: return 'text-rose-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'http': return <Webhook className="w-4 h-4" />;
      case 'cron': return <Clock className="w-4 h-4" />;
      case 'event': return <Zap className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const filteredWorkflows = workflows.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-[#0A0A0A] text-[#E0E0E0] font-mono selection:bg-emerald-500 selection:text-black">
      {/* Sidebar: Workflow List */}
      <div className="w-80 border-r border-white/10 flex flex-col bg-[#0F0F0F]">
        <div className="p-6 border-b border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xs font-bold uppercase tracking-widest">Orchestrator</h2>
            </div>
            <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-40" />
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search workflows..."
              className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-[10px] focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredWorkflows.map(workflow => (
            <div 
              key={workflow.id}
              onClick={() => setSelectedWorkflow(workflow)}
              className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 group ${selectedWorkflow?.id === workflow.id ? 'bg-emerald-500/10 border-r-2 border-r-emerald-500' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`opacity-80 ${getStatusColor(workflow.status)}`}>
                    {getTypeIcon(workflow.type)}
                  </span>
                  <span className="text-[10px] uppercase tracking-tighter opacity-40">
                    {workflow.type}
                  </span>
                </div>
                {workflow.status === 'active' && <AlertCircle className="w-3 h-3 text-rose-500" />}
              </div>
              <h3 className={`text-xs font-bold truncate ${selectedWorkflow?.id === workflow.id ? 'text-emerald-500' : ''}`}>
                {workflow.name}
              </h3>
              <p className="text-[10px] opacity-40 truncate mt-1 leading-relaxed">
                {workflow.description}
              </p>
              <div className="flex items-center gap-3 mt-3 opacity-40 text-[9px]">
                <div className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> {workflow.nodes_count} Nodes</div>
                <div className="flex items-center gap-1"><Activity className="w-3 h-3" /> {workflow.executions_count} Runs</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/40">
          <div className="flex items-center justify-between text-[9px] uppercase tracking-widest opacity-40">
            <span>System Load</span>
            <span className="text-emerald-500">Normal</span>
          </div>
          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '34%' }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Main Canvas / Editor Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {selectedWorkflow ? (
          <motion.div 
            key={selectedWorkflow.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full z-10"
          >
            {/* Toolbar */}
            <div className="h-16 border-b border-white/10 bg-[#0F0F0F]/80 backdrop-blur-md flex items-center justify-between px-8">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  {getTypeIcon(selectedWorkflow.type)}
                </div>
                <div>
                  <h1 className="text-sm font-bold tracking-tight">{selectedWorkflow.name}</h1>
                  <p className="text-[10px] opacity-40 uppercase tracking-widest">Workflow ID: {selectedWorkflow.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black text-[10px] font-bold rounded-lg hover:scale-105 transition-all">
                  <Play className="w-3 h-3 fill-current" />
                  Execute
                </button>
                <button 
                  onClick={() => onNavigate?.('settings')}
                  className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editor / Visualizer */}
            <div className="flex-1 p-8 overflow-hidden flex flex-col">
              <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center">
                {/* Mock Node Graph */}
                <div className="flex items-center gap-12">
                  <div className="w-48 p-4 bg-[#1A1A1A] border border-emerald-500/30 rounded-xl space-y-3 shadow-2xl shadow-emerald-500/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-widest text-emerald-500">Trigger</span>
                      <Webhook className="w-3 h-3 opacity-40" />
                    </div>
                    <div className="font-bold text-xs">HTTP Webhook</div>
                    <div className="h-px bg-white/5" />
                    <div className="text-[9px] opacity-40">Origin: /api/v1/sync</div>
                  </div>

                  <ArrowRight className="w-5 h-5 opacity-20" />

                  <div className="w-48 p-4 bg-[#1A1A1A] border border-white/10 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-widest opacity-40">Action</span>
                      <Database className="w-3 h-3 opacity-40" />
                    </div>
                    <div className="font-bold text-xs">PCM Retrieval</div>
                    <div className="h-px bg-white/5" />
                    <div className="text-[9px] opacity-40">Key: user_context</div>
                  </div>

                  <ArrowRight className="w-5 h-5 opacity-20" />

                  <div className="w-48 p-4 bg-[#1A1A1A] border border-white/10 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-widest opacity-40">Action</span>
                      <Cpu className="w-3 h-3 opacity-40" />
                    </div>
                    <div className="font-bold text-xs">LLM Processor</div>
                    <div className="h-px bg-white/5" />
                    <div className="text-[9px] opacity-40">Model: Sovereign-1.0</div>
                  </div>
                </div>

                {/* Controls Overlay */}
                <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-[#0F0F0F] border border-white/10 p-1.5 rounded-xl shadow-2xl">
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Plus className="w-4 h-4" /></button>
                  <div className="w-px h-4 bg-white/10" />
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Search className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Execution Logs / Bottom Panel */}
              <div className="h-64 mt-6 bg-[#0F0F0F] border border-white/10 rounded-2xl flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest">Execution History</h3>
                  </div>
                  <button className="text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Clear Logs</button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5 hover:border-white/10 transition-all group">
                      <div className="flex items-center gap-4">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <div>
                          <div className="text-[10px] font-bold">Execution #{1420 + i}</div>
                          <div className="text-[9px] opacity-40">Triggered by Cron Scheduler</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-[9px] font-mono">
                        <div className="opacity-40">2024-03-02 11:35:34</div>
                        <div className="text-emerald-500">42ms</div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 rounded transition-all">
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 z-10">
            <div className="relative">
              <div className="w-32 h-32 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl flex items-center justify-center">
                <Zap className="w-12 h-12 text-emerald-500 opacity-20 animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-black rounded-full flex items-center justify-center font-bold text-xs shadow-xl shadow-emerald-500/20">
                <Plus className="w-4 h-4" />
              </div>
            </div>
            <div className="max-w-md space-y-3">
              <h2 className="text-xl font-bold tracking-tight">Sovereign Workflow Orchestrator</h2>
              <p className="text-xs opacity-40 leading-relaxed">
                PejicAIX-native automation engine. Deploy complex, multi-node workflows with zero-trust execution and sovereign data mapping.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-emerald-500 text-black font-bold text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl shadow-emerald-500/10">
                Initialize Workflow
              </button>
              <button className="px-8 py-3 border border-white/10 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all">
                Import Blueprint
              </button>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}} />
    </div>
  );
}
