import React, { useRef, useEffect, memo, useCallback } from 'react';

interface NeuralNode {
  id: string | number;
  name: string;
  type: string;
  priority: number;
  radius: number;
  baseRadius: number;
  color: string;
  x3d: number;
  y3d: number;
  z3d: number;
  phase: number;
  pulseSpeed: number;
  screenX: number;
  screenY: number;
  screenZ: number;
  screenRadius: number;
  visible: boolean;
}

interface NeuralLink {
  source: NeuralNode;
  target: NeuralNode;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface NeuralHubNode {
  id: string | number;
  title?: string;
  name?: string;
  type: string;
  priority: number;
  status: string;
  timestamp: string;
  description: string;
  tags: string[];
}

interface NeuralGraphProps {
  nodes: NeuralHubNode[];
  links: any[];
  onNodeClick: (node: NeuralHubNode) => void;
  searchQuery: string;
  selectedNode: NeuralHubNode | null;
  onSelectNode: (node: NeuralHubNode | null) => void;
}

const SETTINGS = {
  radius: 400,
  repulsionDist: 20,
  colors: {
    project: '#00D9FF',
    task: '#5BC8C0',
    memory: '#4A90D9',
    identity: '#00D9FF',
    folder: '#00D9FF',
    file: '#5BC8C0',
    interaction: '#4A90D9'
  }
};

const NeuralGraph: React.FC<NeuralGraphProps> = ({ 
  nodes: inputNodes, 
  onNodeClick, 
  searchQuery, 
  selectedNode, 
  onSelectNode 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<NeuralNode[]>([]);
  const linksRef = useRef<NeuralLink[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const stateRef = useRef({
    width: 0, 
    height: 0,
    rotationX: 0, 
    rotationY: 0,
    targetRotationX: 0, 
    targetRotationY: 0,
    zoom: 0.79, 
    targetZoom: 0.79,
    isDragging: false,
    lastMouseX: 0, 
    lastMouseY: 0,
    hoveredId: null as string | number | null,
    mouseX: 0, 
    mouseY: 0,
    isInteracting: false,
    idleTimer: null as ReturnType<typeof setTimeout> | null
  });

  useEffect(() => {
    if (!inputNodes || inputNodes.length === 0) return;

    const newNodes: NeuralNode[] = inputNodes.map((node, i) => {
      const isCore = node.id === 'core_openclaw';
      const isProject = node.type?.toLowerCase() === 'project';
      
      const offset = isProject ? Math.random() * 2000 : 0;
      const phi = isCore ? 0 : Math.acos(1 - 2 * (i + offset + 0.5) / (inputNodes.length + 100));
      const theta = isCore ? 0 : Math.PI * (1 + Math.sqrt(5)) * (i + offset);
      
      const type = (node.type || 'MEMORY').toUpperCase();
      const priority = node.priority || 1;
      
      let radius = 3;
      if (type === 'CORE') radius = 36; 
      else if (type === 'PROJECT') radius = 14; 
      else if (type === 'TASK') radius = 7;
      else if (type === 'IDENTITY') radius = 5;
      
      const nodeTypeKey = node.type?.toLowerCase() as keyof typeof SETTINGS.colors;
      const color = SETTINGS.colors[nodeTypeKey] || SETTINGS.colors.memory;

      return {
        id: node.id,
        name: node.title || node.name || `${type}_${node.id}`,
        type,
        priority,
        radius,
        baseRadius: radius,
        color,
        x3d: isCore ? 0 : SETTINGS.radius * Math.sin(phi) * Math.cos(theta),
        y3d: isCore ? 0 : SETTINGS.radius * Math.sin(phi) * Math.sin(theta),
        z3d: isCore ? 0 : SETTINGS.radius * Math.cos(phi),
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.5 + (priority * 0.15),
        screenX: 0, screenY: 0, screenZ: 0, screenRadius: 0,
        visible: true
      };
    });

    const newLinks: NeuralLink[] = [];
    newNodes.forEach(node => {
      if (node.priority >= 3) {
        const connections = 2 + Math.floor(Math.random() * 2);
        for (let j = 0; j < connections; j++) {
          const target = newNodes[Math.floor(Math.random() * newNodes.length)];
          if (target.id !== node.id) {
            newLinks.push({ source: node, target });
          }
        }
      }
    });

    nodesRef.current = newNodes;
    linksRef.current = newLinks;
  }, [inputNodes]);

  const createParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 8; i++) {
      particlesRef.current.push({ 
        x, y, 
        vx: (Math.random() - 0.5) * 8, 
        vy: (Math.random() - 0.5) * 8 - 4, 
        life: 1, 
        color 
      });
    }
  };

  const project = useCallback((node: NeuralNode, time: number) => {
    const { rotationX, rotationY, zoom, mouseX, mouseY, width, height } = stateRef.current;
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);

    const pulse = 1 + Math.sin(time * node.pulseSpeed + node.phase) * (0.05 + node.priority * 0.03);
    const x = node.x3d * pulse;
    const y = node.y3d * pulse;
    const z = node.z3d * pulse;

    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;
    const y1 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    const sX = (width / 2) + x1 * zoom;
    const sY = (height / 2) + y1 * zoom;

    const dx = sX - mouseX;
    const dy = sY - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    let repulsionX = 0, repulsionY = 0;
    if (dist < SETTINGS.repulsionDist) {
      const force = (SETTINGS.repulsionDist - dist) / SETTINGS.repulsionDist;
      repulsionX = (dx / dist) * force * 5;
      repulsionY = (dy / dist) * force * 5;
    }

    node.screenX = sX + repulsionX;
    node.screenY = sY + repulsionY;
    node.screenZ = z2;

    let sizeMult = 1;
    if (stateRef.current.hoveredId === node.id || (selectedNode && selectedNode.id === node.id)) {
      sizeMult = 1.3;
    }
    node.screenRadius = node.radius * zoom * sizeMult;
    node.visible = !searchQuery || node.name.toUpperCase().includes(searchQuery.toUpperCase());
  }, [searchQuery, selectedNode]);

  const drawNode = useCallback((ctx: CanvasRenderingContext2D, node: NeuralNode) => {
    if (node.id === 'core_openclaw') return; 
    if (node.screenZ < -SETTINGS.radius * 0.7 && (!selectedNode || selectedNode.id !== node.id)) return;
    
    const selectedId = selectedNode?.id;
    let opacity = 0.5;
    if (selectedId !== undefined && selectedId !== null) {
      if (selectedId === node.id) {
        opacity = 1.0;
      } else if (linksRef.current.some(l => (l.source.id === selectedId && l.target.id === node.id) || (l.target.id === selectedId && l.source.id === node.id))) {
        opacity = 0.8;
      } else {
        opacity = 0.02;
      }
    } else if (stateRef.current.hoveredId !== null) {
      if (stateRef.current.hoveredId === node.id) {
        opacity = 1.0;
      } else if (linksRef.current.some(l => (l.source.id === stateRef.current.hoveredId && l.target.id === node.id) || (l.target.id === stateRef.current.hoveredId && l.source.id === node.id))) {
        opacity = 0.7;
      } else {
        opacity = 0.15;
      }
    } else {
      opacity = (node.screenZ + SETTINGS.radius) / (SETTINGS.radius * 2);
      opacity = Math.max(0.1, Math.min(1, opacity));
    }

    if (!node.visible) opacity *= 0.05;

    ctx.beginPath();
    ctx.arc(node.screenX, node.screenY, node.screenRadius, 0, Math.PI * 2);
    ctx.fillStyle = node.color;
    ctx.globalAlpha = opacity;
    
    if (stateRef.current.hoveredId === node.id || (selectedNode && selectedNode.id === node.id)) {
      ctx.shadowBlur = (selectedNode && selectedNode.id === node.id) ? 30 : 25; 
      ctx.shadowColor = '#00D9FF';
    } else {
      ctx.shadowBlur = 8;
      ctx.shadowColor = node.color;
    }
    
    ctx.fill();
    ctx.globalAlpha = 1;
  }, [selectedNode]);

  const drawLink = useCallback((ctx: CanvasRenderingContext2D, link: NeuralLink) => {
    const { source, target } = link;
    if (!source.visible || !target.visible) return;
    
    const selectedId = selectedNode?.id;
    let opacity = 0.1; let width = 0.5; let color = '#00D9FF';

    if (selectedId !== undefined && selectedId !== null) {
      if (source.id === selectedId || target.id === selectedId) {
        opacity = 1.0; width = 1.5; color = '#FFFFFF';
      } else { return; }
    } else if (stateRef.current.hoveredId !== null) {
      if (source.id === stateRef.current.hoveredId || target.id === stateRef.current.hoveredId) {
        opacity = 1.0; width = 1.0; color = '#FFFFFF';
      } else { opacity = 0.02; }
    }

    ctx.beginPath();
    ctx.moveTo(source.screenX, source.screenY);
    ctx.lineTo(target.screenX, target.screenY);
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.globalAlpha = opacity;
    ctx.stroke(); 
    ctx.globalAlpha = 1;
  }, [selectedNode]);

  const drawOrientationRing = useCallback((ctx: CanvasRenderingContext2D) => {
    const { width, height, rotationX, rotationY, zoom } = stateRef.current;
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const ringRadius = 80; 
    const segments = 32;

    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = ringRadius * Math.cos(angle);
      const y = 0;
      const z = ringRadius * Math.sin(angle);

      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const y1 = y * cosX - z1 * sinX;

      const sX = (width / 2) + x1 * zoom;
      const sY = (height / 2) + y1 * zoom;

      if (i === 0) ctx.moveTo(sX, sY);
      else ctx.lineTo(sX, sY);
    }

    ctx.save();
    ctx.strokeStyle = '#00D9FF';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.restore();
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const time = Date.now() * 0.001;
      const state = stateRef.current;

      ctx.clearRect(0, 0, state.width, state.height);
      
      if (!state.isInteracting) state.targetRotationY += 0.0025;
      
      state.rotationX += (state.targetRotationX - state.rotationX) * 0.06;
      state.rotationY += (state.targetRotationY - state.rotationY) * 0.06;
      state.zoom += (state.targetZoom - state.zoom) * 0.04;

      nodesRef.current.forEach(n => project(n, time));

      ctx.save();
      ctx.strokeStyle = '#00D9FF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.globalAlpha = 0.2;
      ctx.arc(state.width/2, state.height/2, 272 * state.zoom, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.globalAlpha = 0.12;
      ctx.setLineDash([4, 4]);
      ctx.arc(state.width/2, state.height/2, 408 * state.zoom, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      
      const sortedNodes = [...nodesRef.current].sort((a, b) => a.screenZ - b.screenZ);
      linksRef.current.forEach(l => drawLink(ctx, l));
      sortedNodes.forEach(n => drawNode(ctx, n));

      // Sister Tooltips with matching design
      if (selectedNode) {
        ctx.save();
        const sisterLinks = linksRef.current.filter(l => l.source.id === selectedNode.id || l.target.id === selectedNode.id);
        sisterLinks.forEach(link => {
          const sister = link.source.id === selectedNode.id ? link.target : link.source;
          if (sister.id === 'core_openclaw') return;

          const dx = state.mouseX - sister.screenX;
          const dy = state.mouseY - sister.screenY;
          const mouseDist = Math.sqrt(dx * dx + dy * dy);
          
          let labelOpacity = Math.max(0, Math.min(0.9, (mouseDist - 50) / 100));
          
          if (labelOpacity > 0) {
            ctx.globalAlpha = labelOpacity;
            const text = sister.name.toUpperCase();
            ctx.font = 'bold 10px "General Sans", sans-serif';
            const metrics = ctx.measureText(text);
            const paddingHorizontal = 8;
            const paddingVertical = 4;
            const bubbleWidth = metrics.width + paddingHorizontal * 2;
            const bubbleHeight = 18;
            const rx = sister.screenX + 12;
            const ry = sister.screenY - 9;

            // Glass background
            ctx.fillStyle = 'rgba(10, 20, 35, 0.9)';
            ctx.beginPath();
            ctx.roundRect(rx, ry, bubbleWidth, bubbleHeight, 4);
            ctx.fill();
            
            // Border matching the node color
            ctx.strokeStyle = sister.color + '66';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Text
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(text, rx + paddingHorizontal, ry + 13);
          }
        });
        ctx.restore();
      }

      // OpenClaw Core
      const coreNode = nodesRef.current.find(n => n.id === 'core_openclaw');
      if (coreNode) {
        const pulse = 0.9 + Math.sin(time * 4.1888) * 0.1;
        const coreRadius = coreNode.radius * pulse;
        ctx.beginPath();
        ctx.arc(coreNode.screenX, coreNode.screenY, coreRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700'; 
        ctx.shadowBlur = 50; 
        ctx.shadowColor = '#FFD700';
        ctx.globalAlpha = 1.0; 
        ctx.fill(); 
        ctx.shadowBlur = 0; 
        ctx.globalAlpha = 1;
      }
      
      drawOrientationRing(ctx);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedNode, searchQuery, project, drawLink, drawNode, drawOrientationRing]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const state = stateRef.current;
    state.isInteracting = true;
    if (state.idleTimer) clearTimeout(state.idleTimer);
    state.idleTimer = setTimeout(() => { state.isInteracting = false; }, 3000);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    state.mouseX = e.clientX - rect.left;
    state.mouseY = e.clientY - rect.top;

    if (state.isDragging) {
      const deltaX = e.clientX - state.lastMouseX;
      const deltaY = e.clientY - state.lastMouseY;
      state.targetRotationY -= deltaX * 0.005;
      state.targetRotationX -= deltaY * 0.003;
    } else {
      const offX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const offY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      state.targetRotationY += offX * 0.002;
      state.targetRotationX = -offY * 0.3;
    }
    state.lastMouseX = e.clientX;
    state.lastMouseY = e.clientY;

    let hit: NeuralNode | null = null;
    for (const node of nodesRef.current) {
      const dx = state.mouseX - node.screenX;
      const dy = state.mouseY - node.screenY;
      if (Math.sqrt(dx*dx + dy*dy) < node.screenRadius + 8) {
        hit = node; break;
      }
    }

    if (hit && !selectedNode) {
      state.hoveredId = hit.id;
      const tooltip = document.getElementById('node-tooltip');
      if (tooltip) {
        tooltip.classList.add('visible');
        tooltip.style.left = (e.clientX + 20) + 'px';
        tooltip.style.top = (e.clientY - 20) + 'px';
        const ttName = document.getElementById('tt-name');
        const ttType = document.getElementById('tt-type');
        const ttPriority = document.getElementById('tt-priority');
        if (ttName) ttName.innerText = hit.name;
        if (ttType) ttType.innerText = hit.type;
        if (ttPriority) ttPriority.innerHTML = '★'.repeat(hit.priority);
      }
    } else {
      state.hoveredId = null;
      const tooltip = document.getElementById('node-tooltip');
      if (tooltip) tooltip.classList.remove('visible');
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const state = stateRef.current;
    let hit: NeuralNode | null = null;
    for (const node of nodesRef.current) {
      const dx = state.mouseX - node.screenX;
      const dy = state.mouseY - node.screenY;
      if (Math.sqrt(dx*dx + dy*dy) < node.screenRadius + 8) {
        hit = node; break;
      }
    }

    if (hit) {
      const originalNode = inputNodes.find(n => n.id === hit!.id);
      createParticles(e.clientX, e.clientY, hit.color);
      onSelectNode(originalNode || null);
      onNodeClick(originalNode || ({} as any));
      state.targetZoom = 0.9;
      state.targetRotationY = -Math.atan2(hit.x3d, hit.z3d);
      state.targetRotationX = Math.asin(hit.y3d / SETTINGS.radius);
    } else if (selectedNode) {
      onSelectNode(null);
      state.targetZoom = 0.75;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    stateRef.current.isDragging = true;
    stateRef.current.lastMouseX = e.clientX;
    stateRef.current.lastMouseY = e.clientY;
  };

  const handleMouseUp = () => {
    stateRef.current.isDragging = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomStep = 0.1;
    const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
    stateRef.current.targetZoom = Math.max(0.3, Math.min(2.5, stateRef.current.targetZoom + delta));
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!containerRef.current || !canvasRef.current) return;
      const { offsetWidth, offsetHeight } = containerRef.current;
      stateRef.current.width = offsetWidth;
      stateRef.current.height = offsetHeight;
      canvasRef.current.width = offsetWidth * window.devicePixelRatio;
      canvasRef.current.height = offsetHeight * window.devicePixelRatio;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
    </div>
  );
};

export default memo(NeuralGraph);
