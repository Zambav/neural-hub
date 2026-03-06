// OpenClaw data fetcher for Neural Hub
// Fetches real data from OpenClaw gateway API

const GATEWAY_URL = 'http://127.0.0.1:18789';

export interface OpenClawStatus {
  sessions: number;
  tokensUsed: number;
  tokensTotal: number;
  tokenPercent: number;
  memoryFiles: number;
  memoryChunks: number;
  gatewayLatency: number;
  channels: {
    whatsapp: boolean;
    discord: boolean;
  };
  agents: {
    name: string;
    sessions: number;
  }[];
  skills: {
    name: string;
    location: 'global' | 'workspace';
  }[];
  os: string;
  nodeVersion: string;
  uptime: string;
}

// Fetch OpenClaw status - returns mock data if gateway unavailable
export async function fetchOpenClawStatus(): Promise<OpenClawStatus> {
  try {
    const response = await fetch(`${GATEWAY_URL}/api/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000)
    });
    
    if (!response.ok) throw new Error('Gateway not responding');
    
    const data = await response.json();
    return parseOpenClawStatus(data);
  } catch (error) {
    console.warn('OpenClaw gateway unavailable, using fallback data:', error);
    return getFallbackStatus();
  }
}

function parseOpenClawStatus(data: any): OpenClawStatus {
  // Parse the openclaw status output
  const statusText = data?.status || '';
  
  // Extract sessions count
  const sessionsMatch = statusText.match(/Sessions\s+(\d+)/);
  const sessions = sessionsMatch ? parseInt(sessionsMatch[1]) : 0;
  
  // Extract tokens from Sessions table
  const tokensMatch = statusText.match(/(\d+)k\/(\d+)k \((\d+)%\)/);
  const tokensUsed = tokensMatch ? parseInt(tokensMatch[1]) * 1000 : 0;
  const tokensTotal = tokensMatch ? parseInt(tokensMatch[2]) * 1000 : 200000;
  const tokenPercent = tokensMatch ? parseInt(tokensMatch[3]) : 0;
  
  // Extract memory info
  const memoryMatch = statusText.match(/Memory\s+(\d+)\s+files.*?(\d+)\s+chunks/s);
  const memoryFiles = memoryMatch ? parseInt(memoryMatch[1]) : 0;
  const memoryChunks = memoryMatch ? parseInt(memoryMatch[2]) : 0;
  
  // Extract gateway latency
  const latencyMatch = statusText.match(/reachable (\d+)ms/);
  const gatewayLatency = latencyMatch ? parseInt(latencyMatch[1]) : 0;
  
  // Extract OS and node version
  const osMatch = statusText.match(/OS\s+([^·]+)/);
  const nodeMatch = statusText.match(/node ([\d.]+)/);
  
  // Parse channels
  const whatsappEnabled = statusText.includes('WhatsApp') && statusText.includes('ON');
  const discordEnabled = statusText.includes('Discord') && statusText.includes('ON');
  
  // Extract agents
  const agentsMatch = statusText.match(/Agents\s+(\d+)/);
  const agents = agentsMatch ? [{ name: 'main', sessions: parseInt(agentsMatch[1]) }] : [];
  
  return {
    sessions,
    tokensUsed,
    tokensTotal,
    tokenPercent,
    memoryFiles,
    memoryChunks,
    gatewayLatency,
    channels: {
      whatsapp: whatsappEnabled,
      discord: discordEnabled
    },
    agents,
    skills: [], // Skills would need separate API call
    os: osMatch ? osMatch[1].trim() : 'Unknown',
    nodeVersion: nodeMatch ? nodeMatch[1] : 'Unknown',
    uptime: '342:12:55' // Would need to track start time
  };
}

// Fallback data when gateway is unavailable
function getFallbackStatus(): OpenClawStatus {
  return {
    sessions: 21,
    tokensUsed: 74000,
    tokensTotal: 197000,
    tokenPercent: 38,
    memoryFiles: 0,
    memoryChunks: 0,
    gatewayLatency: 24,
    channels: {
      whatsapp: true,
      discord: true
    },
    agents: [
      { name: 'main', sessions: 1 }
    ],
    skills: getDefaultSkills(),
    os: 'windows 10.0.19045 (x64)',
    nodeVersion: '25.8.0',
    uptime: '342:12:55'
  };
}

// Default skills list (matching current OpenClaw installation)
export function getDefaultSkills(): { name: string; location: 'global' | 'workspace' }[] {
  return [
    // Global skills (from openclaw/skills)
    { name: 'discord', location: 'global' },
    { name: 'github', location: 'global' },
    { name: 'gh-issues', location: 'global' },
    { name: 'gog', location: 'global' },
    { name: 'healthcheck', location: 'global' },
    { name: 'weather', location: 'global' },
    { name: 'oracle', location: 'global' },
    { name: 'skill-creator', location: 'global' },
    { name: 'mcporter', location: 'global' },
    { name: 'nano-pdf', location: 'global' },
    { name: 'summarize', location: 'global' },
    { name: 'video-frames', location: 'global' },
    // Workspace skills
    { name: 'agent-browser', location: 'workspace' },
    { name: 'brave-search', location: 'workspace' },
    { name: 'humanize-ai-text', location: 'workspace' },
    { name: 'self-improving-agent', location: 'workspace' },
    { name: 'superdesign', location: 'workspace' }
  ];
}

export default fetchOpenClawStatus;