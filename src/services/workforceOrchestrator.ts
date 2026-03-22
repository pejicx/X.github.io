/**
 * Sovereign Workforce Orchestrator
 * Provides a strictly frontend-only engine for neural workforce management.
 * All orchestration, task allocation, and agent state management occur locally within the client-side substrate.
 */
import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentStatus, Task, AllocationDecision } from '../types/workforce';
import { neurosymbolicBridge } from './neurosymbolicBridge';
import { sovereignState } from '../core/state';

/**
 * Frontend-only orchestrator for neural workforce management.
 * No backend dependencies are required for these operations.
 */
class WorkforceOrchestrator {
  private agents: Agent[] = [];
  private tasks: Task[] = [];

  constructor() {
    this.initializeDefaultAgents();
  }

  /**
   * Initializes the default set of neural agents within the frontend environment.
   */
  private initializeDefaultAgents() {
    this.agents = [
      {
        id: 'agent-alpha',
        name: 'Alpha-Neural',
        skills: ['code', 'logic', 'optimization'],
        status: AgentStatus.IDLE,
        workload: 0,
        performanceRating: 0.98,
        lastActive: new Date().toISOString()
      },
      {
        id: 'agent-beta',
        name: 'Beta-Creative',
        skills: ['image', 'text', 'design'],
        status: AgentStatus.IDLE,
        workload: 0,
        performanceRating: 0.92,
        lastActive: new Date().toISOString()
      },
      {
        id: 'agent-gamma',
        name: 'Gamma-Security',
        skills: ['security', 'encryption', 'audit'],
        status: AgentStatus.IDLE,
        workload: 0,
        performanceRating: 0.99,
        lastActive: new Date().toISOString()
      },
      {
        id: 'agent-runner-h',
        name: 'Runner H',
        skills: ['automation', 'navigation', 'business_processes', 'autonomous_tasks'],
        status: AgentStatus.IDLE,
        workload: 0,
        performanceRating: 0.97,
        lastActive: new Date().toISOString()
      },
      {
        id: 'agent-surfer-h',
        name: 'Surfer H',
        skills: ['web_navigation', 'data_extraction', 'autonomous_browsing'],
        status: AgentStatus.IDLE,
        workload: 0,
        performanceRating: 0.96,
        lastActive: new Date().toISOString()
      }
    ];
  }

  /**
   * Retrieves the current set of neural agents from the local substrate.
   */
  public getAgents(): Agent[] {
    return [...this.agents];
  }

  /**
   * Retrieves the current set of tasks from the local substrate.
   */
  public getTasks(): Task[] {
    return [...this.tasks];
  }

  /**
   * Creates a new task within the frontend workforce environment.
   */
  public async createTask(title: string, description: string, requiredSkills: string[], priority: Task['priority']): Promise<Task> {
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      requiredSkills,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.tasks.push(task);
    
    // Trigger intelligent orchestration within the client-side substrate
    await this.orchestrate();
    
    return task;
  }

  /**
   * Orchestrates task allocation using local neural pathways.
   */
  private async orchestrate() {
    const pendingTasks = this.tasks.filter(t => t.status === 'pending');
    
    for (const task of pendingTasks) {
      const decision = await this.findBestAgent(task);
      if (decision) {
        this.assignTask(decision.taskId, decision.agentId);
        sovereignState.addNotification(`Task "${task.title}" orchestrated to ${decision.agentId}.`, 'success');
      }
    }
  }

  /**
   * Finds the best agent for a task using the local neurosymbolic bridge.
   */
  private async findBestAgent(task: Task): Promise<AllocationDecision | null> {
    const availableAgents = this.agents.filter(a => a.status === AgentStatus.IDLE);
    
    if (availableAgents.length === 0) return null;

    // Use Neurosymbolic Bridge for explainable allocation logic within the frontend
    const prompt = `Allocate task "${task.title}" (Requires: ${task.requiredSkills.join(', ')}) to one of these agents: ${availableAgents.map(a => `${a.id} (Skills: ${a.skills.join(', ')})`).join('; ')}`;
    
    const nsResponse = await neurosymbolicBridge.generateWithExplanation(prompt, { 
      context: 'workforce_allocation',
      task,
      availableAgents 
    });

    // Extract agent ID from neural response locally
    const selectedAgent = availableAgents.find(a => nsResponse.content.includes(a.id)) || availableAgents[0];

    return {
      taskId: task.id,
      agentId: selectedAgent.id,
      reasoning: nsResponse.explanations.join(' '),
      confidence: nsResponse.confidence
    };
  }

  /**
   * Assigns a task to an agent within the local substrate.
   */
  private assignTask(taskId: string, agentId: string) {
    const task = this.tasks.find(t => t.id === taskId);
    const agent = this.agents.find(a => a.id === agentId);

    if (task && agent) {
      task.status = 'assigned';
      task.assignedAgentId = agentId;
      agent.status = AgentStatus.BUSY;
      agent.workload = 0.5; // Simulated workload
      agent.lastActive = new Date().toISOString();
    }
  }

  /**
   * Marks a task as completed within the local substrate.
   */
  public async completeTask(taskId: string) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task && task.assignedAgentId) {
      const agent = this.agents.find(a => a.id === task.assignedAgentId);
      task.status = 'completed';
      if (agent) {
        agent.status = AgentStatus.IDLE;
        agent.workload = 0;
      }
      sovereignState.addNotification(`Task "${task.title}" completed successfully.`, 'success');
    }
  }
}

export const workforceOrchestrator = new WorkforceOrchestrator();
