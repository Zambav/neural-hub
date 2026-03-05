/**
 * Fake Data Generator - 555 Nodes
 * Creates a large fake dataset to test visualization at scale
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type NodeType = 'core' | 'identity' | 'project' | 'folder' | 'file' | 'memory' | 'task';
type RelationType = 'core_to_identity' | 'core_to_project' | 'project_to_child' | 'folder_to_child' | 'task_link';

interface HubNode {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  fileCount?: number;
  totalBytes?: number;
  wordCount?: number;
  status: string;
  priority: number;
  parentId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastActive: string;
}

interface HubLink {
  source: string;
  target: string;
  relationType: RelationType;
  strength: number;
}

interface NeuralData {
  generatedAt: string;
  nodes: HubNode[];
  links: HubLink[];
}

const fakeProjectNames = [
  // Real projects
  'Job Search Tracker', 'Client Outreach', 'Neural Hub Visualization', 'Activity Memory Log',
  'OpenClaw Skills', 'Learning & Improvements',
  // Many more fake projects to simulate busy account
  'Portfolio Website Redesign', 'Blender Pipeline Tool', 'AI Art Generator', 'Memory Visualization Demo', 
  'OpenClaw Core System', '3D Asset Library', 'Technical Art Showreel', 'Workflow Automation Scripts', 
  'Shader Collection', 'UI Component Library', 'Documentation Site', 'Blog Platform Setup', 
  'Demo Reel 2025', 'Code Snippet Manager', 'Design System Documentation', 'Tutorial Series Planning',
  'Client Project Alpha', 'Freelance Contract Template', 'Invoice Generator Tool', 'Time Tracking App', 
  'Project Management Dashboard', 'Creative Brief Template', 'Asset Organization System', 
  'Version Control Workflow', 'CI/CD Pipeline Setup', 'Testing Framework Research', 'API Design Patterns', 
  'Database Schema Design', 'Real-time Chat Application', 'E-commerce Platform', 'Social Media Dashboard',
  'Analytics Dashboard', 'Customer CRM System', 'Inventory Management', 'Booking System', 
  'Video Streaming Service', 'Music Player App', 'Weather Application', 'Fitness Tracker',
  'Recipe Manager', 'Travel Planner', 'Budget Calculator', 'Expense Tracker', 'Password Manager',
  'Note Taking App', 'Calendar Sync', 'File Storage System', 'Image Editor', 'Video Converter',
  'Email Client', 'Task Manager', 'Habit Tracker', 'Goal Setting App', 'Meditation App',
  'Language Learning', 'Coding Practice', 'Book Tracker', 'Movie Database', 'Podcast Player',
  'News Aggregator', 'RSS Reader', 'Bookmark Manager', 'Password Generator', 'QR Code Scanner',
  'Barcode Scanner', 'Document Scanner', 'Voice Recorder', 'Audio Converter', 'Video Editor',
  'Photo Gallery', 'Wallpaper App', 'Icon Set', 'Font Manager', 'Color Palette Generator',
  'Mockup Tool', 'Wireframe Tool', 'Prototyping Tool', 'Design Token Manager', 'Component Library',
  'Animation Library', 'Particle System', 'Physics Engine', 'Game Engine', '3D Model Viewer',
  'AR App', 'VR Experience', 'Motion Capture', 'Facial Animation', 'Rigging Tools',
  'Texturing Pipeline', 'Shader Library', 'Material Pack', 'HDRi Collection', '3D Scans',
  'Photogrammetry', 'Sculpting Tools', 'Modeling Helpers', 'UV Tools', 'Baking Tools',
  'Render Pipeline', 'Compositing Tools', 'Color Grading', 'VFX Library', 'SFX Collection',
  'Music Production', 'Audio Editing', 'Sound Design', 'Foley Artist', 'Voice Over Studio'
];

const fakeFileNames = [
  'README.md', 'config.json', 'index.ts', 'app.js', 'styles.css', 'utils.ts',
  'data.json', 'api.ts', 'models.py', 'main.ts', 'helpers.ts', 'types.ts',
  'schema.sql', 'docker.yml', 'nginx.conf', 'package.json', 'requirements.txt',
  'Makefile', 'docker-compose.yml', 'pytest.ini', 'tsconfig.json', 'eslintrc.js',
  'gitignore', 'env.example', 'LICENSE', 'CHANGELOG.md', 'CONTRIBUTING.md'
];

const fakeMemoryTitles = [
  'Startup concept discussion', 'OpenClaw architecture notes', 'Neural hub UI brainstorm',
  'Client email thread', '3D pipeline review', 'Memory indexing experiment',
  'Agent workflow design', 'Blender scripting notes', 'Tech art portfolio review',
  'React Three Fiber learning', 'Job search strategy meeting', 'AI art generation experiments',
  'Procedural geometry notes', 'Voice assistant research', 'Glass morphism UI design',
  'Performance optimization study', 'LinkedIn profile optimization', 'Shader techniques workshop',
  'Node graph automation ideas', 'Glow effects tutorial', 'Force-directed graph study'
];

const fakeTaskTitles = [
  'Update portfolio site', 'Fix navigation bug', 'Add new project case study',
  'Optimize 3D performance', 'Write documentation', 'Create tutorial video',
  'Review pull request', 'Deploy to production', 'Write unit tests',
  'Refactor component code', 'Update dependencies', 'Create design assets',
  'Record demo video', 'Write blog post', 'Prepare interview presentation',
  'Build example projects', 'Review code quality', 'Implement new feature'
];

function randomDate(): string {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 365);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString();
}

function generateFakeData(): NeuralData {
  const nodes: HubNode[] = [];
  const links: HubLink[] = [];
  
  // 1. CORE NODE
  nodes.push({
    id: 'core_openclaw',
    type: 'core',
    title: 'OpenClaw',
    description: 'AI Personal Assistant - The central neural hub',
    fileCount: 1, totalBytes: 0, status: 'system', priority: 5,
    tags: ['core', 'system', 'ai'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  });
  
  // 2. IDENTITY NODES (8)
  const identityNames = ['AGENTS.md', 'SOUL.md', 'USER.md', 'TOOLS.md', 'MEMORY.md', 'HEARTBEAT.md', 'IDENTITY.md', 'job-search-keywords.md'];
  identityNames.forEach((name, i) => {
    const id = `identity_${i}`;
    nodes.push({
      id,
      type: 'identity',
      title: name.replace('.md', '').replace(/-/g, ' '),
      description: `System config: ${name}`,
      fileCount: 1, totalBytes: Math.floor(Math.random() * 10000), 
      wordCount: Math.floor(Math.random() * 2000),
      status: 'system', priority: 4,
      tags: ['identity', 'system'],
      createdAt: randomDate(), updatedAt: randomDate(), lastActive: randomDate()
    });
    links.push({ source: 'core_openclaw', target: id, relationType: 'core_to_identity', strength: 1 });
  });
  
  // 3. PROJECT NODES (100 projects to simulate busy account)
  const projectCount = 100;
  for (let p = 0; p < projectCount; p++) {
    const projId = `proj_${p}`;
    const projName = fakeProjectNames[p] || `Project ${p}`;
    const fileCount = Math.floor(Math.random() * 20) + 3;
    const priority = p < 6 ? 5 : (p < 12 ? 4 : 3);
    
    nodes.push({
      id: projId,
      type: 'project',
      title: projName,
      description: `Project ${p} - Active development`,
      fileCount, totalBytes: Math.floor(Math.random() * 500000), status: 'active',
      priority, tags: ['project'],
      createdAt: randomDate(), updatedAt: randomDate(), lastActive: randomDate()
    });
    
    // Add children (files and folders) - MORE per project
    const childCount = Math.floor(Math.random() * 8) + 4; // 4-12 children per project
    for (let f = 0; f < childCount; f++) {
      const isFolder = Math.random() > 0.6;
      const childId = `${projId}_child_${f}`;
      const fileName = fakeFileNames[f % fakeFileNames.length];
      
      nodes.push({
        id: childId,
        type: isFolder ? 'folder' : 'file',
        title: fileName,
        description: `Child of ${projName}`,
        fileCount: 1,
        totalBytes: Math.floor(Math.random() * 50000),
        wordCount: isFolder ? 0 : Math.floor(Math.random() * 1000),
        status: 'system',
        priority: 1,
        parentId: projId,
        tags: [isFolder ? 'folder' : 'file', 'child'],
        createdAt: randomDate(),
        updatedAt: randomDate(),
        lastActive: randomDate()
      });
      
      links.push({ source: projId, target: childId, relationType: 'project_to_child', strength: 0.6 });
      
      // Add some grandchildren for folders
      if (isFolder) {
        for (let g = 0; g < Math.floor(Math.random() * 5) + 1; g++) {
          const grandId = `${projId}_child_${f}_${g}`;
          nodes.push({
            id: grandId,
            type: 'file',
            title: fakeFileNames[g % fakeFileNames.length],
            description: `File in ${fileName}`,
            fileCount: 1,
            totalBytes: Math.floor(Math.random() * 10000),
            wordCount: Math.floor(Math.random() * 500),
            status: 'system',
            priority: 1,
            parentId: childId,
            tags: ['file', 'grandchild'],
            createdAt: randomDate(),
            updatedAt: randomDate(),
            lastActive: randomDate()
          });
          links.push({ source: childId, target: grandId, relationType: 'folder_to_child', strength: 0.4 });
        }
      }
    }
  }
  
  // 4. MEMORY NODES (lots of them)
  const memoryCount = 80;
  for (let m = 0; m < memoryCount; m++) {
    const memId = `mem_${m}`;
    const memTitle = fakeMemoryTitles[m % fakeMemoryTitles.length] || `Memory ${m}`;
    
    nodes.push({
      id: memId,
      type: 'memory',
      title: memTitle,
      description: 'Daily activity log entry',
      fileCount: 1,
      totalBytes: Math.floor(Math.random() * 20000),
      wordCount: Math.floor(Math.random() * 2000),
      status: 'system',
      priority: Math.floor(Math.random() * 2) + 1,
      tags: ['memory', 'log'],
      createdAt: randomDate(),
      updatedAt: randomDate(),
      lastActive: randomDate()
    });
  }
  
  // 5. TASK NODES (lots for extra nodes)
  const taskCount = 150;
  for (let t = 0; t < taskCount; t++) {
    const taskId = `task_${t}`;
    const taskTitle = fakeTaskTitles[t % fakeTaskTitles.length] || `Task ${t}`;
    
    nodes.push({
      id: taskId,
      type: 'task',
      title: taskTitle,
      description: `Task ${t} - todo item`,
      fileCount: 1,
      totalBytes: Math.floor(Math.random() * 5000),
      status: ['active', 'pending', 'completed'][Math.floor(Math.random() * 3)],
      priority: Math.floor(Math.random() * 5) + 1,
      tags: ['task', 'todo'],
      createdAt: randomDate(),
      updatedAt: randomDate(),
      lastActive: randomDate()
    });
  }
  
  // 6. More FILE nodes for extra density
  const extraFiles = 200;
  for (let e = 0; e < extraFiles; e++) {
    const fileId = `extra_file_${e}`;
    nodes.push({
      id: fileId,
      type: 'file',
      title: fakeFileNames[e % fakeFileNames.length],
      description: 'Extra file node for density',
      fileCount: 1,
      totalBytes: Math.floor(Math.random() * 5000),
      status: 'system',
      priority: 1,
      tags: ['file', 'extra'],
      createdAt: randomDate(),
      updatedAt: randomDate(),
      lastActive: randomDate()
    });
  }
  
  return { generatedAt: new Date().toISOString(), nodes, links };
}

const data = generateFakeData();
const outputPath = path.join(__dirname, 'neural-data.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log(`✓ Generated ${data.nodes.length} FAKE nodes`);
console.log(`\n📊 Node Summary:`);
const byType = data.nodes.reduce((acc, n) => { acc[n.type] = (acc[n.type] || 0) + 1; return acc; }, {} as Record<string, number>);
for (const [type, count] of Object.entries(byType)) console.log(`  ${type}: ${count}`);

console.log(`\n🎯 Projects: ${data.nodes.filter(n => n.type === 'project').length}`);
console.log(`\n✅ Saved to: ${outputPath}`);