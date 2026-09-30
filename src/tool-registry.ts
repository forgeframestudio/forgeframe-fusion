import type { ActionRisk } from "./permissions.js";

export interface OperatorContext {
  projectId?: string;
  accountSubject?: string;
  objective: string;
}

export interface OperatorToolResult {
  ok: boolean;
  summary: string;
  output?: unknown;
}

export interface OperatorTool {
  id: string;
  risk: ActionRisk;
  execute(input: unknown, context: OperatorContext): Promise<OperatorToolResult>;
}

export class ToolRegistry {
  private readonly tools = new Map<string, OperatorTool>();

  register(tool: OperatorTool): this {
    if (!tool.id.trim()) throw new Error("Tool id is required.");
    if (this.tools.has(tool.id)) throw new Error(`Tool already registered: ${tool.id}`);
    this.tools.set(tool.id, tool);
    return this;
  }

  get(id: string): OperatorTool | undefined {
    return this.tools.get(id);
  }

  list(): OperatorTool[] {
    return [...this.tools.values()];
  }
}
