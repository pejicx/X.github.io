import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Cpu, 
  Database, 
  Network, 
  HardDrive, 
  Activity, 
  Zap, 
  Shield, 
  Globe,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { sovereignFetch as fetch } from '../lib/apiBridge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const data = [
  { time: '00:00', cpu: 12, mem: 45, net: 20 },
  { time: '04:00', cpu: 18, mem: 48, net: 25 },
  { time: '08:00', cpu: 45, mem: 60, net: 80 },
  { time: '12:00', cpu: 35, mem: 55, net: 60 },
  { time: '16:00', cpu: 55, mem: 70, net: 95 },
  { time: '20:00', cpu: 25, mem: 50, net: 40 },
  { time: '23:59', cpu: 15, mem: 46, net: 22 },
];

export default function HostingDashboard() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/pejicpanel/server/status');
      const data = await res.json();
      setStatus(data);
    } catch {
      console.log('Success fetch');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-accent animate-pulse font-mono">INITIALIZING_DASHBOARD...</div>;

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">PejicPanel Overview</h1>
          <p className="text-text-secondary text-sm">Sovereign Hybrid Hosting Control Engine</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">System Online</span>
          </div>
          <button onClick={fetchStatus} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-secondary">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Cpu className="text-blue-400" />} 
          label="CPU Load" 
          value={`${(Array.isArray(status?.load) && typeof status.load[0] === 'number') ? status.load[0].toFixed(2) : '0.00'}`} 
          subValue="Avg 1m"
          progress={(Array.isArray(status?.load) && typeof status.load[0] === 'number') ? status.load[0] * 100 : 0}
        />
        <StatCard 
          icon={<Database className="text-purple-400" />} 
          label="Memory" 
          value={`${((status?.memory?.used || 0) / 1024).toFixed(1)} GB`} 
          subValue={`of ${((status?.memory?.total || 0) / 1024).toFixed(0)} GB`}
          progress={status?.memory?.total ? (status.memory.used / status.memory.total) * 100 : 0}
        />
        <StatCard 
          icon={<HardDrive className="text-amber-400" />} 
          label="Disk Usage" 
          value={`${((status?.disk?.used || 0) / 1024).toFixed(0)} GB`} 
          subValue={`of ${((status?.disk?.total || 0) / 1024).toFixed(0)} GB`}
          progress={status?.disk?.total ? (status.disk.used / status.disk.total) * 100 : 0}
        />
        <StatCard 
          icon={<Activity className="text-emerald-400" />} 
          label="Uptime" 
          value={status?.uptime} 
          subValue="System Stability"
          progress={100}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resource Chart */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
              <Zap size={14} className="text-accent" />
              Resource Visualization
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span className="text-[10px] text-text-secondary uppercase">CPU</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[10px] text-text-secondary uppercase">MEM</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  axisLine={true} 
                  tickLine={true} 
                  tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
                />
                <YAxis 
                  axisLine={true} 
                  tickLine={true} 
                  tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161618', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="cpu" stroke="var(--color-accent)" fillOpacity={1} fill="url(#colorCpu)" />
                <Area type="monotone" dataKey="mem" stroke="#10b981" fillOpacity={1} fill="url(#colorMem)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Health */}
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2 mb-6">
            <Shield size={14} className="text-accent" />
            Service Health
          </h3>
          <div className="space-y-4">
            {status?.services?.map((service: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 bg-bg/50 border border-border rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    service.status === 'running' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                  )}>
                    <Server size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">{service.name}</p>
                    <p className="text-[10px] text-text-secondary uppercase">{service.status}</p>
                  </div>
                </div>
                {service.status === 'running' ? (
                  <CheckCircle size={14} className="text-emerald-500" />
                ) : (
                  <AlertTriangle size={14} className="text-red-500" />
                )}
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
            Manage All Services
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, progress }: any) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{label}</span>
      </div>
      <div>
        <h4 className="text-2xl font-bold">{value}</h4>
        <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">{subValue}</p>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-accent"
        />
      </div>
    </div>
  );
}
