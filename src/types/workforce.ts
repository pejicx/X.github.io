export enum AgentStatus {
  IDLE = 'idle',
  BUSY = 'busy',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance'
}

export interface Agent {
  id: string;
  name: string;
  skills: string[];
  status: AgentStatus;
  workload: number; // 0 to 1
  performanceRating: number; // 0 to 1
  lastActive: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'failed';
  assignedAgentId?: string;
  createdAt: string;
  deadline?: string;
}

export interface WorkforceMetrics {
  totalTasks: number;
  completedTasks: number;
  averageEfficiency: number;
  activeAgents: number;
  predictedWorkloadTrend: 'increasing' | 'decreasing' | 'stable';
}

export interface AllocationDecision {
  taskId: string;
  agentId: string;
  reasoning: string;
  confidence: number;
}
