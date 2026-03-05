export type NodeType = "memory" | "project" | "task" | "interaction";

export interface HubNode {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  timestamp: string;
  tags: string[];
  priority: number; // 1–5, 5 = highest
  status: "active" | "pending" | "completed" | "archived";
  isCenter?: boolean; // true only for the single hub core node
}

export interface HubLink {
  source: string;
  target: string;
  relationType: "project_member" | "shared_topic" | "chronological" | "ai_related";
}

export interface InteractionEntry {
  id: string;
  timestamp: string;
  summary: string;
  linkedNodeId: string;
}