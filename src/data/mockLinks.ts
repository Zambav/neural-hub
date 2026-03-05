import type { HubLink } from "../types";

// Generate ~180 links connecting nodes
export const mockLinks: HubLink[] = [
  // Hub core connects to priority 5 nodes
  { source: "hub_core", target: "mem_002", relationType: "ai_related" },
  { source: "hub_core", target: "mem_007", relationType: "ai_related" },
  { source: "hub_core", target: "mem_011", relationType: "ai_related" },
  { source: "hub_core", target: "proj_001", relationType: "project_member" },
  { source: "hub_core", target: "proj_006", relationType: "project_member" },
  { source: "hub_core", target: "proj_007", relationType: "project_member" },
  { source: "hub_core", target: "proj_008", relationType: "project_member" },
  { source: "hub_core", target: "proj_011", relationType: "project_member" },
  
  // Memory to memory connections
  { source: "mem_001", target: "mem_002", relationType: "shared_topic" },
  { source: "mem_002", target: "mem_003", relationType: "shared_topic" },
  { source: "mem_003", target: "mem_005", relationType: "shared_topic" },
  { source: "mem_005", target: "mem_010", relationType: "shared_topic" },
  { source: "mem_007", target: "mem_011", relationType: "shared_topic" },
  { source: "mem_009", target: "mem_011", relationType: "shared_topic" },
  { source: "mem_010", target: "mem_015", relationType: "shared_topic" },
  
  // Project to related nodes
  { source: "proj_001", target: "proj_002", relationType: "project_member" },
  { source: "proj_001", target: "mem_003", relationType: "shared_topic" },
  { source: "proj_001", target: "mem_015", relationType: "shared_topic" },
  { source: "proj_002", target: "proj_005", relationType: "project_member" },
  { source: "proj_006", target: "proj_007", relationType: "project_member" },
  { source: "proj_006", target: "mem_001", relationType: "shared_topic" },
  { source: "proj_007", target: "mem_002", relationType: "shared_topic" },
  { source: "proj_008", target: "proj_009", relationType: "project_member" },
  { source: "proj_009", target: "mem_009", relationType: "shared_topic" },
  { source: "proj_011", target: "mem_004", relationType: "shared_topic" },
  
  // Task connections
  { source: "task_001", target: "proj_001", relationType: "project_member" },
  { source: "task_001", target: "task_002", relationType: "chronological" },
  { source: "task_002", target: "proj_002", relationType: "project_member" },
  { source: "task_003", target: "proj_003", relationType: "project_member" },
  { source: "task_004", target: "proj_001", relationType: "project_member" },
  { source: "task_005", target: "mem_002", relationType: "shared_topic" },
  { source: "task_006", target: "proj_009", relationType: "project_member" },
  { source: "task_007", target: "proj_006", relationType: "project_member" },
  { source: "task_008", target: "proj_001", relationType: "project_member" },
  { source: "task_009", target: "proj_002", relationType: "project_member" },
  
  // Interaction connections
  { source: "inter_001", target: "mem_009", relationType: "chronological" },
  { source: "inter_002", target: "mem_011", relationType: "chronological" },
  { source: "inter_003", target: "proj_001", relationType: "chronological" },
  { source: "inter_004", target: "mem_004", relationType: "chronological" },
  { source: "inter_005", target: "mem_017", relationType: "chronological" },
  { source: "inter_006", target: "task_001", relationType: "chronological" },
  { source: "inter_007", target: "proj_003", relationType: "chronological" },
  { source: "inter_008", target: "mem_012", relationType: "chronological" },
  { source: "inter_009", target: "mem_010", relationType: "chronological" },
  { source: "inter_010", target: "mem_002", relationType: "chronological" },
  
  // Cross-type relationships
  { source: "mem_003", target: "task_004", relationType: "shared_topic" },
  { source: "mem_010", target: "task_009", relationType: "shared_topic" },
  { source: "mem_015", target: "proj_011", relationType: "shared_topic" },
  { source: "proj_004", target: "mem_012", relationType: "shared_topic" },
  { source: "proj_005", target: "mem_006", relationType: "shared_topic" },
];

// Generate additional random links to reach ~180 total
const nodeIds = [
  "mem_001", "mem_002", "mem_003", "mem_004", "mem_005", "mem_006", "mem_007", "mem_008",
  "mem_009", "mem_010", "mem_011", "mem_012", "mem_013", "mem_014", "mem_015", "mem_016",
  "mem_017", "mem_018", "mem_019", "mem_020", "mem_021", "mem_022", "mem_023", "mem_024",
  "mem_025", "mem_026", "mem_027", "mem_028", "mem_029", "mem_030",
  "proj_001", "proj_002", "proj_003", "proj_004", "proj_005", "proj_006", "proj_007", "proj_008",
  "proj_009", "proj_010", "proj_011", "proj_012", "proj_013", "proj_014", "proj_015", "proj_016",
  "proj_017", "proj_018", "proj_019", "proj_020", "proj_021", "proj_022", "proj_023", "proj_024",
  "proj_025", "proj_026", "proj_027", "proj_028", "proj_029", "proj_030",
  "task_001", "task_002", "task_003", "task_004", "task_005", "task_006", "task_007", "task_008",
  "task_009", "task_010", "task_011", "task_012", "task_013", "task_014", "task_015", "task_016",
  "task_017", "task_018", "task_019", "task_020", "task_021", "task_022", "task_023", "task_024",
  "task_025", "task_026", "task_027", "task_028", "task_029", "task_030",
  "inter_001", "inter_002", "inter_003", "inter_004", "inter_005", "inter_006", "inter_007", "inter_008",
  "inter_009", "inter_010", "inter_011", "inter_012", "inter_013", "inter_014", "inter_015", "inter_016",
  "inter_017", "inter_018", "inter_019", "inter_020"
];

const relationTypes: HubLink["relationType"][] = ["project_member", "shared_topic", "chronological", "ai_related"];

// Add more random links to reach ~180
for (let i = 0; i < 130; i++) {
  const sourceIdx = Math.floor(Math.random() * nodeIds.length);
  let targetIdx = Math.floor(Math.random() * nodeIds.length);
  while (targetIdx === sourceIdx) {
    targetIdx = Math.floor(Math.random() * nodeIds.length);
  }
  
  mockLinks.push({
    source: nodeIds[sourceIdx],
    target: nodeIds[targetIdx],
    relationType: relationTypes[Math.floor(Math.random() * relationTypes.length)]
  });
}

export default mockLinks;