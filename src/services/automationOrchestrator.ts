/**
 * Sovereign Automation Orchestrator
 * Offers great flexibility for technical teams to build complex systems that make their own decisions based on data.
 * Unlike simpler tools, this orchestrator handles data-driven decision-making.
 */
import { modelConnectorEngine } from './modelConnectorEngine';

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'ai_brain';
  label: string;
  config: any;
  next: string[];
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  isActive: boolean;
}

class AutomationOrchestrator {
  private workflows: Workflow[] = [];

  /**
   * Builds a new complex automation workflow locally.
   */
  public buildWorkflow(workflow: Workflow) {
    this.workflows.push(workflow);
    console.log(`[AUTOMATION_ORCHESTRATOR] Built workflow: ${workflow.name}`);
  }

  /**
   * Executes a workflow locally, making decisions based on data.
   */
  public async executeWorkflow(workflowId: string, initialData: any): Promise<any> {
    const workflow = this.workflows.find(w => w.id === workflowId);
    if (!workflow) throw new Error('Workflow not found');

    console.log(`[AUTOMATION_ORCHESTRATOR] Executing workflow: ${workflow.name}`);
    let currentData = initialData;
    let currentNode = workflow.nodes.find(n => n.type === 'trigger');

    while (currentNode) {
      console.log(`[AUTOMATION_ORCHESTRATOR] Processing node: ${currentNode.label}`);
      
      if (currentNode.type === 'ai_brain') {
        const prompt = `Workflow context: ${JSON.stringify(currentData)}. Task: ${currentNode.config.prompt}`;
        currentData = await modelConnectorEngine.generateResponse(prompt);
      } else if (currentNode.type === 'condition') {
        const decision = currentData.includes(currentNode.config.match) ? 0 : 1;
        currentNode = workflow.nodes.find(n => n.id === currentNode?.next[decision]);
        continue;
      } else if (currentNode.type === 'action') {
        // Simulate action execution
        console.log(`[AUTOMATION_ORCHESTRATOR] Executing action: ${currentNode.config.action}`);
      }

      currentNode = workflow.nodes.find(n => n.id === currentNode?.next[0]);
    }

    return currentData;
  }

  public getWorkflows(): Workflow[] {
    return this.workflows;
  }
}

export const automationOrchestrator = new AutomationOrchestrator();
