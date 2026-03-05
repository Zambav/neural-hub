/**
 * Neural Hub Data Generator v3
 * 
 * Hierarchy: Core → Identity nodes (system files only)
 * Projects → File children (all files in project folders)
 * Memories as outer sphere (darker cyan-green)
 * Include ALL files and folders from workspace
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKSPACE_ROOT = 'C:\\Users\\zam-top\\.openclaw\\workspace';

type NodeType = 'core' | 'identity' | 'project' | 'folder' | 'file' | 'memory';
type RelationType = 'core_to_identity' | 'core_to_project' | 'project_to_child' | 'folder_to_child' | 'memory_to_project';

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

function getAllFiles(dir: string, excludeDirs: string[] = ['node_modules', 'dist', '.git']): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (!excludeDirs.includes(item) && !item.startsWith('.')) {
            files.push(...getAllFiles(fullPath, excludeDirs));
          }
        } else {
          files.push(fullPath);
        }
      } catch {}
    }
  } catch {}
  return files;
}

function countWords(filePath: string): number {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.split(/\s+/).filter(w => w.length > 0).length;
  } catch { return 0; }
}

function sanitizeId(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

function generateNeuralData(): NeuralData {
  const nodes: HubNode[] = [];
  const links: HubLink[] = [];
  
  // 1. CORE NODE - OpenClaw (center, white/yellow, pulsing)
  const coreNode: HubNode = {
    id: 'core_openclaw',
    type: 'core',
    title: 'OpenClaw',
    description: 'AI Personal Assistant - The central neural hub',
    fileCount: 1,
    totalBytes: 0,
    status: 'system',
    priority: 5,
    tags: ['core', 'system', 'ai'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };
  nodes.push(coreNode);
  
  // 2. IDENTITY NODES - ALL key files in root connected to core
  const identityFiles = [
    { id: 'identity_agents', name: 'AGENTS.md', title: 'Agent Workspace Rules' },
    { id: 'identity_soul', name: 'SOUL.md', title: 'Core Persona & Values' },
    { id: 'identity_user', name: 'USER.md', title: 'User Profile & Preferences' },
    { id: 'identity_tools', name: 'TOOLS.md', title: 'Tool Capabilities' },
    { id: 'identity_memory', name: 'MEMORY.md', title: 'Long-term Memory' },
    { id: 'identity_heartbeat', name: 'HEARTBEAT.md', title: 'Heartbeat Config' },
    { id: 'identity_identity', name: 'IDENTITY.md', title: 'Identity & Name' },
    { id: 'identity_keywords', name: 'job-search-keywords.md', title: 'Job Search Keywords' },
  ];
  
  for (const ident of identityFiles) {
    const filePath = path.join(WORKSPACE_ROOT, ident.name);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      nodes.push({
        id: ident.id,
        type: 'identity',
        title: ident.title,
        description: `System config: ${ident.name}`,
        fileCount: 1,
        totalBytes: stats.size,
        wordCount: countWords(filePath),
        status: 'system',
        priority: 4,
        tags: ['identity', 'system'],
        createdAt: stats.birthtime.toISOString(),
        updatedAt: stats.mtime.toISOString(),
        lastActive: stats.mtime.toISOString()
      });
      // Only identity nodes connect to core
      links.push({ source: 'core_openclaw', target: ident.id, relationType: 'core_to_identity', strength: 1 });
    }
  }
  
  // 3. PROJECT NODES - Major folders with all their contents as children
  const projectFolders = [
    { 
      id: 'proj_job_hunt', 
      path: path.join(WORKSPACE_ROOT, 'job-hunt'),
      title: 'Job Search Tracker',
      description: 'Active job search - applications, keywords, resume'
    },
    { 
      id: 'proj_memory', 
      path: path.join(WORKSPACE_ROOT, 'memory'),
      title: 'Activity Memory Log',
      description: 'Daily session logs and learning records'
    },
    { 
      id: 'proj_client_outreach', 
      path: path.join(WORKSPACE_ROOT, 'CLIENT_OUTREACH'),
      title: 'Client Outreach',
      description: 'Prospect research, outreach, lead tracking'
    },
    { 
      id: 'proj_neural_hub', 
      path: path.join(WORKSPACE_ROOT, 'projects', 'neural-hub'),
      title: 'Neural Hub Visualization',
      description: '3D brain-like visualization of OpenClaw'
    },
    { 
      id: 'proj_skills', 
      path: path.join(WORKSPACE_ROOT, 'skills'),
      title: 'OpenClaw Skills',
      description: 'Installed skills and capabilities'
    },
    { 
      id: 'proj_learnings', 
      path: path.join(WORKSPACE_ROOT, '.learnings'),
      title: 'Learning & Improvements',
      description: 'Errors, learnings, feature requests'
    },
  ];
  
  for (const proj of projectFolders) {
    if (!fs.existsSync(proj.path)) continue;
    
    const allFiles = getAllFiles(proj.path, ['node_modules', 'dist', '.git']);
    let totalBytes = 0;
    let latestDate = new Date().toISOString();
    
    // Count immediate children (files and folders)
    let immediateChildren: string[] = [];
    try {
      const topLevel = fs.readdirSync(proj.path);
      for (const item of topLevel) {
        if (item.startsWith('.')) continue;
        const fullPath = path.join(proj.path, item);
        try {
          const stat = fs.statSync(fullPath);
          immediateChildren.push(fullPath);
          totalBytes += stat.size;
          if (stat.mtime.toISOString() > latestDate) latestDate = stat.mtime.toISOString();
        } catch {}
      }
    } catch {}
    
    // Priority based on number of children
    const priority = Math.min(5, Math.max(3, Math.ceil(immediateChildren.length / 3) + 1));
    
    // Add project node
    nodes.push({
      id: proj.id,
      type: 'project',
      title: proj.title,
      description: proj.description,
      fileCount: immediateChildren.length,
      totalBytes,
      status: 'active',
      priority,
      tags: ['project'],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: latestDate,
      lastActive: latestDate
    });
    
    // Add all files AND subdirectories as child nodes
    for (const childPath of immediateChildren) {
      const childName = path.basename(childPath);
      const childStat = fs.statSync(childPath);
      const childId = sanitizeId(`${proj.id}_child_${childName}`);
      const isDir = childStat.isDirectory();
      
      nodes.push({
        id: childId,
        type: isDir ? 'folder' : 'file',
        title: childName,
        description: `Child of ${proj.title}`,
        fileCount: isDir ? 1 : 1,
        totalBytes: childStat.size,
        wordCount: isDir ? 0 : countWords(childPath),
        status: 'system',
        priority: 1,
        parentId: proj.id,
        tags: [isDir ? 'folder' : 'file', 'child'],
        createdAt: childStat.birthtime.toISOString(),
        updatedAt: childStat.mtime.toISOString(),
        lastActive: childStat.mtime.toISOString()
      });
      
      links.push({ source: proj.id, target: childId, relationType: 'project_to_child', strength: 0.6 });
      
      // If it's a directory, also add its files as grandchildren
      if (isDir) {
        try {
          const subFiles = fs.readdirSync(childPath);
          for (const subFile of subFiles.slice(0, 10)) { // Limit to 10 per folder
            if (subFile.startsWith('.')) continue;
            const subPath = path.join(childPath, subFile);
            try {
              const subStat = fs.statSync(subPath);
              if (subStat.isFile()) {
                const subId = sanitizeId(`${proj.id}_${childName}_${subFile}`);
                nodes.push({
                  id: subId,
                  type: 'file',
                  title: subFile,
                  description: `File in ${childName}`,
                  fileCount: 1,
                  totalBytes: subStat.size,
                  wordCount: countWords(subPath),
                  status: 'system',
                  priority: 1,
                  parentId: childId,
                  tags: ['file', 'grandchild'],
                  createdAt: subStat.birthtime.toISOString(),
                  updatedAt: subStat.mtime.toISOString(),
                  lastActive: subStat.mtime.toISOString()
                });
                links.push({ source: childId, target: subId, relationType: 'folder_to_child', strength: 0.4 });
              }
            } catch {}
          }
        } catch {}
      }
    }
  }
  
  // 4. MEMORY NODES - Daily logs (darker cyan-green, outer sphere)
  const memoryDir = path.join(WORKSPACE_ROOT, 'memory');
  if (fs.existsSync(memoryDir)) {
    const memoryFiles = fs.readdirSync(memoryDir).filter(f => f.endsWith('.md'));
    
    for (const memFile of memoryFiles) {
      const filePath = path.join(memoryDir, memFile);
      const stats = fs.statSync(filePath);
      const wordCount = countWords(filePath);
      
      let relatedProject = 'proj_memory';
      const content = fs.readFileSync(filePath, 'utf-8').toLowerCase();
      if (content.includes('job') || content.includes('application')) relatedProject = 'proj_job_hunt';
      else if (content.includes('client') || content.includes('outreach')) relatedProject = 'proj_client_outreach';
      else if (content.includes('neural') || content.includes('visualization')) relatedProject = 'proj_neural_hub';
      
      const nodeId = sanitizeId(`mem_${memFile.replace('.md', '')}`);
      
      nodes.push({
        id: nodeId,
        type: 'memory',
        title: memFile.replace('.md', '').replace(/-/g, ' '),
        description: 'Daily activity log',
        fileCount: 1,
        totalBytes: stats.size,
        wordCount,
        status: 'system',
        priority: Math.max(1, Math.min(2, Math.ceil(wordCount / 1000))),
        parentId: relatedProject,
        tags: ['memory', 'log'],
        createdAt: stats.birthtime.toISOString(),
        updatedAt: stats.mtime.toISOString(),
        lastActive: stats.mtime.toISOString()
      });
    }
  }
  
  return { generatedAt: new Date().toISOString(), nodes, links };
}

const data = generateNeuralData();
const outputPath = path.join(__dirname, 'neural-data.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log(`✓ Generated ${data.nodes.length} nodes and ${data.links.length} links`);

const byType = data.nodes.reduce((acc, n) => { acc[n.type] = (acc[n.type] || 0) + 1; return acc; }, {} as Record<string, number>);
console.log('\n📊 Node Summary:');
for (const [type, count] of Object.entries(byType)) console.log(`  ${type}: ${count}`);

console.log('\n🎯 Projects:');
data.nodes.filter(n => n.type === 'project').forEach(p => {
  const children = data.links.filter(l => l.source === p.id).length;
  console.log(`  ${p.title}: ${children} children (priority ${p.priority})`);
});