import type { HubNode } from "../types";

const generateNodes = (): HubNode[] => {
  const nodes: HubNode[] = [
    // Hub Core Node
    {
      id: "hub_core",
      type: "project",
      title: "OpenClaw Neural Hub",
      description: "Central hub for the OpenClaw AI assistant neural memory visualization system.",
      timestamp: "2025-01-01T00:00:00Z",
      tags: ["core", "system", "hub"],
      priority: 5,
      status: "active",
      isCenter: true
    },
  ];

  const memoryTitles = [
    "Startup concept discussion", "OpenClaw architecture notes", "Neural hub UI brainstorm",
    "Client email thread — March 2025", "3D pipeline review", "Memory indexing experiment",
    "Agent workflow design", "Blender scripting notes", "Tech art portfolio review",
    "React Three Fiber learning", "Job search strategy meeting", "AI art generation experiments",
    "Procedural geometry notes", "Voice assistant research", "Glass morphism UI design",
    "Performance optimization study", "LinkedIn profile optimization", "Shader techniques workshop",
    "Node graph automation ideas", "Glow effects tutorial", "Force-directed graph study",
    "Camera animation techniques", "TypeScript best practices", "State management patterns",
    "Component architecture design", "Data visualization concepts", "Motion design principles",
    "Particle system experiments", "Color theory for UI", "Responsive design patterns"
  ];

  const projectTitles = [
    "Neural Hub MVP", "Portfolio Website Redesign", "Blender Pipeline Tool",
    "AI Art Generator", "Memory Visualization Demo", "OpenClaw Core System",
    "Job Search Tracker", "3D Asset Library", "Technical Art Showreel",
    "Workflow Automation Scripts", "Shader Collection", "UI Component Library",
    "Documentation Site", "Blog Platform Setup", "Demo Reel 2025",
    "Code Snippet Manager", "Design System Documentation", "Tutorial Series Planning",
    "Client Project Alpha", "Freelance Contract Template", "Invoice Generator Tool",
    "Time Tracking App", "Project Management Dashboard", "Creative Brief Template",
    "Asset Organization System", "Version Control Workflow", "CI/CD Pipeline Setup",
    "Testing Framework Research", "API Design Patterns", "Database Schema Design"
  ];

  const taskTitles = [
    "Update portfolio site", "Fix navigation bug", "Add new project case study",
    "Optimize 3D performance", "Write documentation", "Create tutorial video",
    "Review pull request", "Deploy to production", "Write unit tests",
    "Refactor component code", "Update dependencies", "Create design assets",
    "Record demo video", "Write blog post", "Prepare interview presentation",
    "Build example projects", "Review code quality", "Implement new feature",
    "Fix responsive layout", "Add accessibility features", "Create API endpoint",
    "Write technical spec", "Design database schema", "Set up monitoring",
    "Optimize build process", "Add analytics tracking", "Create backup system",
    "Document API", "Write user guide", "Prepare release notes"
  ];

  const interactionTitles = [
    "Viewed portfolio", "Searched for tech artist jobs", "Opened neural hub demo",
    "Checked email notifications", "Updated LinkedIn profile", "Browsed job listings",
    "Started Blender project", "Ran AI art generator", "Viewed tutorial",
    "Opened documentation", "Checked calendar", "Reviewed code changes",
    "Started new task", "Completed code review", "Sent client email",
    "Recorded demo video", "Published blog post", "Updated resume",
    "Scheduled meeting", "Created new branch"
  ];

  const tagPool = [
    "urgent", "review", "bug", "feature", "design", "dev", "ui", "3d",
    "automation", "research", "learning", "career", "portfolio", "project"
  ];

  const statuses: Array<"active" | "pending" | "completed" | "archived"> = 
    ["active", "pending", "completed", "archived"];
  const now = new Date();

  // Generate memory nodes (30)
  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const priority = Math.floor(Math.random() * 5) + 1;
    nodes.push({
      id: `mem_${String(i + 1).padStart(3, '0')}`,
      type: "memory",
      title: memoryTitles[i] || `Memory ${i + 1}`,
      description: `Detailed memory entry #${i + 1} with relevant information.`,
      timestamp: date.toISOString(),
      tags: [tagPool[i % tagPool.length], tagPool[(i + 3) % tagPool.length]].filter((v, idx, arr) => arr.indexOf(v) === idx),
      priority,
      status: priority >= 4 ? "active" : statuses[Math.floor(Math.random() * statuses.length)]
    });
  }

  // Generate project nodes (30)
  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 120);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const priority = Math.floor(Math.random() * 5) + 1;
    nodes.push({
      id: `proj_${String(i + 1).padStart(3, '0')}`,
      type: "project",
      title: projectTitles[i] || `Project ${i + 1}`,
      description: `Project description for ${projectTitles[i] || `project ${i + 1}`}.`,
      timestamp: date.toISOString(),
      tags: [tagPool[i % tagPool.length], "project"].filter((v, idx, arr) => arr.indexOf(v) === idx),
      priority,
      status: priority >= 4 ? "active" : statuses[Math.floor(Math.random() * statuses.length)]
    });
  }

  // Generate task nodes (30)
  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const priority = Math.floor(Math.random() * 5) + 1;
    nodes.push({
      id: `task_${String(i + 1).padStart(3, '0')}`,
      type: "task",
      title: taskTitles[i] || `Task ${i + 1}`,
      description: `Task description for ${taskTitles[i] || `task ${i + 1}`}.`,
      timestamp: date.toISOString(),
      tags: [tagPool[i % tagPool.length], "task"].filter((v, idx, arr) => arr.indexOf(v) === idx),
      priority,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }

  // Generate interaction nodes (30)
  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const priority = Math.floor(Math.random() * 3) + 1;
    nodes.push({
      id: `inter_${String(i + 1).padStart(3, '0')}`,
      type: "interaction",
      title: interactionTitles[i] || `Interaction ${i + 1}`,
      description: `User interaction event: ${interactionTitles[i] || `interaction ${i + 1}`}.`,
      timestamp: date.toISOString(),
      tags: ["interaction", tagPool[i % tagPool.length]],
      priority,
      status: "completed"
    });
  }

  return nodes;
};

export const mockNodes = generateNodes();