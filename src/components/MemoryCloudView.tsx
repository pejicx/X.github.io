import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Shield, 
  History, 
  Activity, 
  Trash2, 
  RefreshCw, 
  Plus, 
  Search, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Upload,
  Cloud,
  HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { memoryCloud, MemorySecret, MemoryLog, MemorySnapshot } from '../lib/memoryCloud';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function MemoryCloudView() {
  const [activeTab, setActiveTab] = useState<'secrets' | 'logs' | 'snapshots' | 'session'>('secrets');
  const [secrets, setSecrets] = useState<MemorySecret[]>([]);
  const [logs, setLogs] = useState<MemoryLog[]>([]);
  const [snapshots, setSnapshots] = useState<MemorySnapshot[]>([]);
  const [showSecretValues, setShowSecretValues] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [newSecret, setNewSecret] = useState({ key: '', value: '' });
  const [isAddingSecret, setIsAddingSecret] = useState(false);

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await memoryCloud.init();
      if (activeTab === 'secrets') {
        const data = await memoryCloud.getAllSecrets();
        setSecrets(data);
      } else if (activeTab === 'logs') {
        const data = await memoryCloud.getLogs(100);
        setLogs(data.sort((a, b) => b.timestamp - a.timestamp));
      } else if (activeTab === 'snapshots') {
        const db = await (memoryCloud as any).ensureDb();
        const tx = db.transaction("snapshots", "readonly");
        const store = tx.objectStore("snapshots");
        const request = store.getAll();
        request.onsuccess = () => {
          setSnapshots(request.result.sort((a: any, b: any) => b.timestamp - a.timestamp));
        };
      }
    } catch (error) {
      console.error("Failed to refresh memory cloud data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddSecret = async () => {
    if (!newSecret.key || !newSecret.value) return;
    await memoryCloud.saveSecret(newSecret.key, newSecret.value);
    setNewSecret({ key: '', value: '' });
    setIsAddingSecret(false);
    refreshData();
    memoryCloud.addLog(`Secret "${newSecret.key}" saved to local memory cloud.`, 'info');
  };

  const toggleSecretVisibility = (key: string) => {
    setShowSecretValues(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredSecrets = secrets.filter(s => 
    s.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLogs = logs.filter(l => 
    l.event.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-bg text-text-primary font-sans">
      {/* Header */}
      <div className="p-8 border-b border-border bg-surface/30 backdrop-blur-md">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-2xl text-accent border border-accent/20">
              <Cloud size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight uppercase">Sovereign Memory Cloud</h1>
              <p className="text-sm text-text-secondary font-medium">Local-first, hostless persistence via IndexedDB</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={refreshData}
              className={cn(
                "p-2 rounded-xl border border-border bg-surface hover:bg-white/5 transition-all text-text-secondary",
                isRefreshing && "animate-spin"
              )}
            >
              <RefreshCw size={18} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent/90 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-accent/20">
              <Download size={14} />
              Export Cloud
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 bg-surface/50 border border-border rounded-2xl w-fit">
          <TabButton 
            active={activeTab === 'secrets'} 
            onClick={() => setActiveTab('secrets')} 
            icon={<Shield size={14} />} 
            label="Secrets" 
          />
          <TabButton 
            active={activeTab === 'logs'} 
            onClick={() => setActiveTab('logs')} 
            icon={<Activity size={14} />} 
            label="Logs" 
          />
          <TabButton 
            active={activeTab === 'snapshots'} 
            onClick={() => setActiveTab('snapshots')} 
            icon={<History size={14} />} 
            label="Snapshots" 
          />
          <TabButton 
            active={activeTab === 'session'} 
            onClick={() => setActiveTab('session')} 
            icon={<HardDrive size={14} />} 
            label="Session" 
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Search & Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-accent transition-all text-sm"
              />
            </div>
            {activeTab === 'secrets' && (
              <button 
                onClick={() => setIsAddingSecret(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest"
              >
                <Plus size={16} />
                Add Secret
              </button>
            )}
          </div>

          {/* Add Secret Modal */}
          <AnimatePresence>
            {isAddingSecret && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-6 bg-surface border border-accent/20 rounded-2xl space-y-4 shadow-2xl shadow-accent/5"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Secret Key</label>
                    <input 
                      type="text"
                      value={newSecret.key}
                      onChange={(e) => setNewSecret({ ...newSecret, key: e.target.value })}
                      placeholder="e.g. GEMINI_API_KEY"
                      className="w-full bg-bg border border-border rounded-xl p-3 focus:outline-none focus:border-accent text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Secret Value</label>
                    <input 
                      type="password"
                      value={newSecret.value}
                      onChange={(e) => setNewSecret({ ...newSecret, value: e.target.value })}
                      placeholder="••••••••••••••••"
                      className="w-full bg-bg border border-border rounded-xl p-3 focus:outline-none focus:border-accent text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setIsAddingSecret(false)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddSecret}
                    className="px-6 py-2 bg-accent text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-accent/90 transition-all"
                  >
                    Save to Cloud
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Data Display */}
          <div className="space-y-4">
            {activeTab === 'secrets' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSecrets.map((secret) => (
                  <div key={secret.key} className="p-5 bg-surface border border-border rounded-2xl flex items-center justify-between group hover:border-accent/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-xl text-text-secondary">
                        <Lock size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm uppercase tracking-tight">{secret.key}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono text-text-secondary">
                            {showSecretValues[secret.key] ? secret.value : '••••••••••••••••'}
                          </span>
                          <button 
                            onClick={() => toggleSecretVisibility(secret.key)}
                            className="p-1 text-text-secondary hover:text-text-primary transition-all"
                          >
                            {showSecretValues[secret.key] ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {filteredSecrets.length === 0 && (
                  <div className="col-span-full py-20 text-center space-y-4 opacity-40">
                    <Shield size={48} className="mx-auto" />
                    <p className="text-sm font-medium">No secrets found in local memory cloud.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-border">
                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-text-secondary">Timestamp</th>
                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-text-secondary">Type</th>
                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-text-secondary">Event</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map((log, idx) => (
                        <tr key={idx} className="border-b border-border/50 hover:bg-white/5 transition-all">
                          <td className="p-4 text-xs font-mono text-text-secondary">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="p-4">
                            <span className={cn(
                              "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest",
                              log.type === 'info' && "bg-blue-500/10 text-blue-400",
                              log.type === 'ai' && "bg-accent/10 text-accent",
                              log.type === 'warn' && "bg-amber-500/10 text-amber-400",
                              log.type === 'error' && "bg-red-500/10 text-red-400"
                            )}>
                              {log.type}
                            </span>
                          </td>
                          <td className="p-4 text-sm font-medium text-text-primary">
                            {log.event}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredLogs.length === 0 && (
                    <div className="py-20 text-center space-y-4 opacity-40">
                      <Activity size={48} className="mx-auto" />
                      <p className="text-sm font-medium">No system logs recorded yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'snapshots' && (
              <div className="space-y-4">
                {snapshots.map((snap) => (
                  <div key={snap.id} className="p-6 bg-surface border border-border rounded-2xl flex items-center justify-between group hover:border-accent/30 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-white/5 rounded-2xl text-text-secondary">
                        <History size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg tracking-tight uppercase">{snap.id}</h3>
                          <span className="px-2 py-1 bg-accent/10 text-accent text-[10px] font-bold rounded-md uppercase tracking-widest">
                            {Math.round(JSON.stringify(snap.data).length / 1024)} KB
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">
                          Captured on {new Date(snap.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest">
                        <RefreshCw size={14} />
                        Restore
                      </button>
                      <button className="p-2 text-text-secondary hover:text-red-400 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {snapshots.length === 0 && (
                  <div className="py-20 text-center space-y-4 opacity-40">
                    <History size={48} className="mx-auto" />
                    <p className="text-sm font-medium">No memory snapshots captured yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'session' && (
              <div className="p-12 bg-surface border border-border rounded-2xl text-center space-y-6 opacity-40">
                <HardDrive size={64} className="mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold uppercase tracking-tight">Runtime Session Memory</h3>
                  <p className="text-sm max-w-md mx-auto">
                    This substrate stores the current application state, active AI context, and ephemeral runtime variables.
                  </p>
                </div>
                <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                  Initialize Session Sync
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest",
        active ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-text-secondary hover:bg-white/5"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
