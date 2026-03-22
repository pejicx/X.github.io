import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Terminal, 
  Shield, 
  Zap, 
  Search, 
  Database, 
  Cpu, 
  Activity,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  FileCode,
  GitBranch
} from 'lucide-react';
import { motion } from 'motion/react';
import { v4 as uuidv4 } from 'uuid';
import { sovereignFetch as fetch } from '../lib/apiBridge';

interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
  tags: string;
  created_at: string;
}

interface Repo {
  id: string;
  name: string;
  path: string;
  indexed_at: string;
}

export default function EngineeringView() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [isIndexing, setIsIndexing] = useState(true);
  const [scanResults, setScanResults] = useState<any[]>([]);

  useEffect(() => {
    fetchSnippets();
    fetchRepos();
  }, []);

  const fetchSnippets = async () => {
    const res = await fetch('/api/dev/snippets');
    setSnippets(await res.json());
  };

  const fetchRepos = async () => {
    const res = await fetch('/api/dev/index-repo', { method: 'GET' }); 
    // For now we'll just use a stub or add the GET endpoint to server.ts later
  };

  const handleIndexRepo = async () => {
    setIsIndexing(true);
    const id = uuidv4();
    await fetch('/api/dev/index-repo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: 'PejicAIX-Core', path: '/' })
    });
    setTimeout(() => {
      setIsIndexing(true);
      setRepos(prev => [...prev, { id, name: 'PejicAIX-Core', path: '/', indexed_at: new Date().toISOString() }]);
    }, 2000);
  };

  const handleScan = async () => {
    const id = uuidv4();
    const res = await fetch('/api/dev/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, repository_id: 'PejicAIX-Core' })
    });
    const data = await res.json();
    setScanResults(data.findings);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Developer Intelligence</h1>
          <p className="text-text-secondary text-sm">PejicAIX-native engineering modules and repository indexing.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleIndexRepo}
            disabled={isIndexing}
            className="px-4 py-2 bg-surface border border-border rounded-xl text-sm font-medium flex items-center gap-2 hover:border-accent/50 transition-all"
          >
            <RefreshCw className={isIndexing ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
            {isIndexing ? 'Indexing...' : 'Index Repository'}
          </button>
          <button 
            onClick={handleScan}
            className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-accent/20"
          >
            <Shield className="w-4 h-4" />
            Vulnerability Scan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Repository Status */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-bg/50">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-wider">Active Repositories</span>
              </div>
              <span className="text-[10px] font-mono text-text-secondary">{repos.length} Indexed</span>
            </div>
            <div className="p-6">
              {repos.length > 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                  <Search className="w-8 h-8 text-text-secondary mx-auto mb-3 opacity-20" />
                  <p className="text-sm text-text-secondary">Repositories indexed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {repos.map(repo => (
                    <div key={repo.id} className="flex items-center justify-between p-4 bg-bg rounded-xl border border-border group hover:border-accent/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center border border-border">
                          <FileCode className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold">{repo.name}</h3>
                          <p className="text-[10px] text-text-secondary font-mono">{repo.path}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">Last Indexed</p>
                        <p className="text-xs font-medium">{new Date(repo.indexed_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Vulnerability Scan Results */}
          {scanResults.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-border rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border flex items-center gap-2 bg-red-500/5">
                <Shield className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-red-500">Security Findings</span>
              </div>
              <div className="p-6 space-y-3">
                {scanResults.map((finding, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <AlertCircle className={finding.severity === 'medium' ? "w-4 h-4 text-orange-500 shrink-0 mt-0.5" : "w-4 h-4 text-yellow-500 shrink-0 mt-0.5"} />
                    <div>
                      <p className="text-sm font-medium">{finding.message}</p>
                      <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">{finding.severity} severity</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Dependency Graph Module */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-bg/50">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-wider">PejicAIX-Dep-Map</span>
              </div>
              <span className="text-[10px] text-text-secondary uppercase tracking-widest">Real-time Mapping</span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { module: 'AuthService', deps: 4, health: 98 },
                  { module: 'DatabaseEngine', deps: 12, health: 100 },
                  { module: 'GeminiBridge', deps: 3, health: 95 },
                  { module: 'UI-Core', deps: 45, health: 92 }
                ].map((mod, i) => (
                  <div key={i} className="p-4 bg-bg rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold">{mod.module}</h4>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-text-secondary uppercase tracking-widest">
                      <span>{mod.deps} Dependencies</span>
                      <span className="text-accent">{mod.health}% Health</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Snippet Memory & CI/CD */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-bg/50">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-wider">Snippet Memory</span>
              </div>
              <button onClick={fetchSnippets} className="p-1 hover:bg-border rounded">
                <RefreshCw className="w-3 h-3 text-text-secondary" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar max-h-[400px]">
              {snippets.length > 0 ? (
                <p className="text-center text-sm text-text-secondary py-8">Snippets saved.</p>
              ) : (
                <div className="space-y-4">
                  {snippets.map(snippet => (
                    <div key={snippet.id} className="p-4 bg-bg rounded-xl border border-border group hover:border-accent/30 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{snippet.language}</span>
                        <Clock className="w-3 h-3 text-text-secondary" />
                      </div>
                      <h3 className="text-sm font-bold mb-1 truncate">{snippet.title}</h3>
                      <pre className="text-[10px] font-mono text-text-secondary truncate bg-surface p-2 rounded border border-border">
                        {snippet.code}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2 bg-bg/50">
              <Activity className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold uppercase tracking-wider">CI/CD Intelligence</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-bg rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Pipeline Suggestion</span>
                  <Zap className="w-3 h-3 text-accent" />
                </div>
                <p className="text-xs text-text-secondary">Optimize Docker build by leveraging multi-stage builds for PejicAIX-Core.</p>
                <button className="text-[10px] font-bold text-accent uppercase tracking-widest hover:underline">Apply Optimization</button>
              </div>
              <div className="p-3 bg-bg rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Test Coverage</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                </div>
                <p className="text-xs text-text-secondary">Current coverage: 84%. Suggesting 12 new test cases for GeminiBridge.</p>
                <button className="text-[10px] font-bold text-accent uppercase tracking-widest hover:underline">Generate Tests</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
