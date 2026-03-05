import { useMemo, useRef, useState, memo, useCallback, useEffect } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { mockNodes } from '../data/mockNodes';

interface HubLink {
  source: string;
  target: string;
  relationType: string;
  strength: number;
}

interface NeuralGraphProps {
  onNodeClick: (node: any) => void;
  searchQuery: string;
  selectedNode: any;
  onSelectNode: (node: any | null) => void;
  nodes?: any[];
  links?: HubLink[];
}

// Cyan/Teal color palette - projects brightest, memory darker
const nodeColors: Record<string, string> = {
  core: '#FFFFFF',
  identity: '#00FFFF',
  project: '#00FFFF', // Brightest cyan for projects
  folder: '#00CED1',  // Slightly darker
  file: '#008B8B',    // Dark teal
  memory: '#2E8B57',  // Dark cyan-green (seagreen)
};

// Teal variations for visual depth
const colorVariations = [
  '#00FFFF', '#00CED1', '#20B2AA', '#008B8B', '#40E0D0', '#2E8B57',  // Darker greens for variety
  '#3CB371', '#66CDAA', '#5F9EA0', '#48D1CC', '#00FA9A', '#8DEEEE'
];

// Simple line component using drei Line
function DynamicLine({ sourceId, targetId, nodePositions, selectedNode }: {
  sourceId: string;
  targetId: string;
  nodePositions: Map<string, THREE.Vector3>;
  selectedNode: any;
}) {
  const sourcePos = nodePositions.get(sourceId);
  const targetPos = nodePositions.get(targetId);
  
  if (!sourcePos || !targetPos) return null;
  
  const isConnected = selectedNode && (
    sourceId === selectedNode.id || targetId === selectedNode.id
  );
  
  const opacity = selectedNode ? (isConnected ? 0.9 : 0.02) : 0.15;
  const lineWidth = isConnected ? 1.5 : 0.5;
  
  return (
    <Line
      points={[sourcePos, targetPos]}
      color="#00D9FF"
      lineWidth={lineWidth}
      transparent
      opacity={opacity}
    />
  );
}

function NeuralGraph({ onNodeClick, searchQuery, selectedNode, onSelectNode, nodes: propNodes, links: propLinks }: NeuralGraphProps) {
  // Use prop nodes or fallback to mockNodes
  const allNodes = propNodes || mockNodes;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _allLinks = propLinks || []; // Reserved for future real link rendering
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _linesRef = useRef<THREE.Group>(null); // Reserved for line group ref
  
  // Store node offset positions for floating animation
  const nodeOffsets = useRef<Map<string, { offset: THREE.Vector3; phase: number }>>(new Map());
  
  // Use useCallback for stable reference
  const handleNodeClick = useCallback((node: any) => {
    // First select the node (highlight connections)
    if (selectedNode?.id === node.id) {
      // If already selected, open detail panel
      onNodeClick(node);
    } else {
      // Otherwise just select/highlight
      onSelectNode(node);
    }
  }, [onNodeClick, onSelectNode, selectedNode]);

  const handleInfoClick = useCallback((node: any) => {
    onNodeClick(node);
  }, [onNodeClick]);

  // Use useCallback for hover handlers
  const handlePointerOver = useCallback((e: ThreeEvent<MouseEvent>, node: any) => {
    e.stopPropagation();
    setHoveredNode(node.id);
    document.body.style.cursor = 'pointer';
    
    // Show tooltip
    const tooltip = document.getElementById('node-tooltip');
    if (tooltip && !selectedNode) {
      tooltip.classList.add('visible');
      const ttName = document.getElementById('tt-name');
      const ttType = document.getElementById('tt-type');
      const ttPriority = document.getElementById('tt-priority');
      const ttStatus = document.getElementById('tt-status');
      if (ttName) ttName.textContent = node.title?.substring(0, 20).toUpperCase() || node.id;
      if (ttType) ttType.textContent = node.type?.toUpperCase() || 'NODE';
      if (ttPriority) ttPriority.textContent = '★'.repeat(node.priority || 1);
      if (ttStatus) ttStatus.textContent = node.status?.toUpperCase() || 'ACTIVE';
    }
  }, [selectedNode]);

  const handlePointerOut = useCallback(() => {
    setHoveredNode(null);
    document.body.style.cursor = 'crosshair';
    
    // Hide tooltip
    if (!selectedNode) {
      const tooltip = document.getElementById('node-tooltip');
      if (tooltip) {
        tooltip.classList.remove('visible');
      }
    }
  }, [selectedNode]);

  // Tooltip follows mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const tooltip = document.getElementById('node-tooltip');
      if (tooltip && (hoveredNode || selectedNode)) {
        tooltip.style.left = (e.clientX + 20) + 'px';
        tooltip.style.top = (e.clientY - 20) + 'px';
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hoveredNode, selectedNode]);

  // Pre-compute filtered nodes to avoid recalculation in map
  const filteredNodes = useMemo(() => {
    const nodes = searchQuery 
      ? allNodes.filter((n: any) => !n.isCenter && n.title?.toUpperCase().includes(searchQuery.toUpperCase()))
      : allNodes.filter((n: any) => !n.isCenter);
    return nodes.slice(0, 100); // Limit to 100 nodes for performance
  }, [searchQuery, allNodes]);

  // Assign colors to nodes for variety
  const nodeColorMap = useMemo(() => {
    const map = new Map<string, string>();
    filteredNodes.forEach((node: any, i: number) => {
      // Use type color base + variation based on priority and index
      const baseColor = nodeColors[node.type] || '#00D9FF';
      if (node.priority >= 4) {
        // High priority = use type color
        map.set(node.id, baseColor);
      } else {
        // Lower priority = use variation
        const variationIndex = (node.priority + i) % colorVariations.length;
        map.set(node.id, colorVariations[variationIndex]);
      }
    });
    return map;
  }, [filteredNodes]);

  // Generate node positions using proper Fibonacci sphere distribution
  const nodePositions = useMemo(() => {
    const pos = new Map<string, THREE.Vector3>();
    // Find core by type === 'core' or isCenter flag
    const centerNode = allNodes.find((n: any) => n.type === 'core' || n.isCenter);
    
    // Place core at absolute center (0,0,0)
    if (centerNode) {
      pos.set(centerNode.id, new THREE.Vector3(0, 0, 0));
    }

    // All non-core nodes distributed evenly on Fibonacci sphere
    const nonCoreNodes = filteredNodes.filter((n: any) => n.type !== 'core' && !n.isCenter);
    const sphereRadius = 350;
    
    nonCoreNodes.forEach((node: any, i: number) => {
      // Fibonacci sphere distribution with MORE randomness
      const phi = Math.acos(1 - 2 * (i + 0.5) / nonCoreNodes.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i + (Math.random() - 0.5) * 0.8; // Add angle jitter
      
      // Add MORE variation for depth - projects closer, others spread out
      let depthFactor = 1;
      if (node.type === 'project') depthFactor = 0.6 + Math.random() * 0.2; // Projects closer to core
      else if (node.type === 'identity') depthFactor = 0.7 + Math.random() * 0.2;
      else if (node.type === 'folder') depthFactor = 0.8 + Math.random() * 0.3;
      else depthFactor = 0.7 + Math.random() * 0.5; // Files/memory scattered
      
      const r = sphereRadius * depthFactor;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      pos.set(node.id, new THREE.Vector3(x, y, z));
      
      // Floating animation offset
      const floatAmt = node.type === 'project' ? 12 : (node.type === 'identity' ? 8 : 5);
      nodeOffsets.current.set(node.id, { 
        offset: new THREE.Vector3(
          (Math.random() - 0.5) * floatAmt,
          (Math.random() - 0.5) * floatAmt,
          (Math.random() - 0.5) * floatAmt
        ), 
        phase: Math.random() * Math.PI * 2 
      });
    });

    return pos;
  }, [filteredNodes]);

  // Generate connection lines - core ONLY connects to identity nodes
  const connections = useMemo(() => {
    const links: { start: THREE.Vector3; end: THREE.Vector3; sourceId: string; targetId: string }[] = [];
    const pos = nodePositions;
    
    // Core ONLY connects to identity nodes (system files)
    const corePos = pos.get('core_openclaw');
    if (corePos) {
      filteredNodes.forEach((node: any) => {
        if (node.type === 'identity') {
          const nodePos = pos.get(node.id);
          if (nodePos) {
            links.push({ 
              start: corePos.clone(), 
              end: nodePos.clone(), 
              sourceId: 'core_openclaw', 
              targetId: node.id 
            });
          }
        }
      });
    }
    
    // Create mesh network between other nodes - connect to nearby nodes
    filteredNodes.forEach((nodeA: any) => {
      if (nodeA.id === 'core_openclaw' || nodeA.type === 'core') return;
      
      const posA = pos.get(nodeA.id);
      if (!posA) return;
      
      // Projects connect to MORE nodes
      const connectionsToMake = nodeA.type === 'project' ? 8 : (nodeA.type === 'identity' ? 4 : (nodeA.type === 'folder' ? 4 : 3));
      let made = 0;
      
      // Find nearby nodes
      const distances = filteredNodes
        .filter((n: any) => n.id !== nodeA.id && n.id !== 'core_openclaw')
        .map((n: any) => {
          const posB = pos.get(n.id);
          if (!posB) return { id: n.id, dist: Infinity };
          return { id: n.id, dist: posA.distanceTo(posB), node: n };
        })
        .sort((a, b) => a.dist - b.dist);
      
      for (const d of distances) {
        if (made >= connectionsToMake) break;
        const posB = pos.get(d.id);
        if (posB) {
          links.push({ start: posA.clone(), end: posB.clone(), sourceId: nodeA.id, targetId: d.id });
          made++;
        }
      }
    });
    
    return links;
  }, [filteredNodes, nodePositions]);

  // Build connected node IDs set for selected node
  const connectedNodeIds = useMemo(() => {
    const connected = new Set<string>();
    if (selectedNode) {
      connections.forEach(link => {
        if (link.sourceId === selectedNode.id || link.targetId === selectedNode.id) {
          connected.add(link.sourceId);
          connected.add(link.targetId);
        }
      });
    }
    return connected;
  }, [selectedNode, connections]);

  // Animated node positions with floating effect (placeholder for future animation)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _animatedPositions = useMemo(() => {
    const animPos = new Map<string, THREE.Vector3>();
    const basePos = nodePositions;
    
    filteredNodes.forEach((node: any) => {
      const base = basePos.get(node.id);
      if (base) {
        animPos.set(node.id, base.clone());
      }
    });
    
    return animPos;
  }, [filteredNodes, nodePositions]);

  // Store original positions (placeholder for animation bounds)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _originalPositions = useRef<Map<string, THREE.Vector3>>(new Map());
  
  // Animate nodes with breathing effect only (no positional movement to keep lines connected)
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    const children = groupRef.current.children;
    
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const node = filteredNodes[i];
      if (!node) continue;
      
      // Breathing animation - subtle scale only (no position change keeps lines connected)
      const breathe = Math.sin(time * node.priority * 0.5 + i * 0.5) * 0.04;
      const scale = 1 + breathe;
      child.scale.setScalar(scale);
    }
  });

  // Pre-compute highlighted set for O(1) lookup
  const highlightedIds = useMemo(() => {
    if (!searchQuery) return new Set<string>();
    const highlighted = new Set<string>();
    filteredNodes.forEach((n: any) => {
      if (n.title?.toUpperCase().includes(searchQuery.toUpperCase())) {
        highlighted.add(n.id);
      }
    });
    return highlighted;
  }, [searchQuery, filteredNodes]);

  const isNodeHighlighted = useCallback((nodeId: string) => {
    return highlightedIds.has(nodeId);
  }, [highlightedIds]);

  // Get color for node
  const getNodeColor = useCallback((node: any) => {
    return nodeColorMap.get(node.id) || nodeColors[node.type] || '#00D9FF';
  }, [nodeColorMap]);

  // Dynamic line components that follow nodes
  const ConnectionLines = useMemo(() => {
    return connections.map((link, i) => (
      <DynamicLine 
        key={`link-${i}`}
        sourceId={link.sourceId}
        targetId={link.targetId}
        nodePositions={nodePositions}
        selectedNode={selectedNode}
      />
    ));
  }, [connections, selectedNode, nodePositions]);

  return (
    <group>
      {/* Connection Lines - Dynamic */}
      {ConnectionLines}
      
      {/* Nodes */}
      <group ref={groupRef}>
        {filteredNodes.map((node: any) => {
          const pos = nodePositions.get(node.id);
          if (!pos) return null;
          
          const isCenter = node.isCenter;
          const isSearchHighlighted = isNodeHighlighted(node.id);
          const isHovered = hoveredNode === node.id;
          const isSelected = selectedNode?.id === node.id;
          const isConnected = selectedNode && connectedNodeIds.has(node.id);
          
          // Dim unconnected nodes when something is selected
          const isDimmed = selectedNode && !isSelected && !isConnected;
          
          const baseColor = getNodeColor(node);
          // Core is white/yellow, others use teal palette
          const color = node.type === 'core' ? '#FFFFFF' : baseColor;
          
          // Node sizes by type - projects biggest after core, MORE DRAMATIC
          let radius = 1.0;
          if (node.type === 'core') {
            radius = 16; // Core largest
          } else if (node.type === 'project') {
            // Projects much bigger: priority 5 = 12, priority 4 = 9, priority 3 = 7
            radius = node.priority >= 5 ? 12 : (node.priority >= 4 ? 9 : 7);
          } else if (node.type === 'identity') {
            radius = 4;
          } else if (node.type === 'folder') {
            radius = 2.5;
          } else if (node.type === 'file') {
            radius = 1.0;
          } else if (node.type === 'memory') {
            radius = 1.8;
          }
          
          // Highlighted nodes are bigger
          const isHighlighted = isSearchHighlighted || isSelected || isConnected;
          const finalRadius = isHighlighted ? radius * 1.8 : radius;
          
          // Opacity based on state
          const opacity = isDimmed ? 0.15 : (isHighlighted ? 1 : 0.75);
          const isCore = node.type === 'core';
          const isProject = node.type === 'project';
          
          // Core gets pulsing emissive, projects get bright glow
          const coreRef = useRef<THREE.Mesh>(null);
          
          // Animate core and projects with pulsing glow
          useFrame(({ clock }) => {
            if ((isCore || isProject) && coreRef.current) {
              const t = clock.getElapsedTime();
              let pulse = 2;
              if (isCore) {
                pulse = 2 + Math.sin(t * 2) * 0.8; // Core pulses 1.2-2.8
              } else if (isProject) {
                pulse = 1.8 + Math.sin(t * 3 + node.priority) * 0.5; // Projects pulse faster
              }
              const mat = coreRef.current.material as THREE.MeshStandardMaterial;
              mat.emissiveIntensity = pulse;
            }
          });
          
          const baseEmissive = isCore ? 2.5 : (isProject ? 1.8 : (isHighlighted ? 1.5 : (isDimmed ? 0.05 : 0.4)));
          
          return (
            <group 
              key={node.id} 
              position={[pos.x, pos.y, pos.z]}
            >
              <mesh
                ref={isCore ? coreRef : undefined}
                onClick={(e: ThreeEvent<MouseEvent>) => {
                  e.stopPropagation();
                  handleNodeClick(node);
                }}
                onPointerOver={(e: ThreeEvent<MouseEvent>) => handlePointerOver(e, node)}
                onPointerOut={handlePointerOut}
                scale={isHovered ? 1.3 : (isSelected ? 1.4 : 1)}
              >
                <sphereGeometry args={[finalRadius, 24, 24]} />
                <meshStandardMaterial
                  color={isCore ? '#FFFFEE' : (isHighlighted ? '#FFFFFF' : color)}
                  emissive={isCore ? '#FFD700' : (isHighlighted ? '#FFFFFF' : color)}
                  emissiveIntensity={isCore ? 2.5 : baseEmissive}
                  transparent
                  opacity={opacity}
                />
              </mesh>
              
              {/* Node label on hover or search/selection highlight */}
              {(isHovered || isHighlighted) && !isCenter && (
                <Html
                  position={[0, finalRadius + 5, 0]}
                  center
                  distanceFactor={150}
                  style={{
                    pointerEvents: 'none',
                    transition: 'opacity 0.2s',
                  }}
                >
                  <div style={{
                    background: 'rgba(0,15,25,0.95)',
                    color: isHighlighted ? '#00D9FF' : '#fff',
                    fontSize: '9px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontFamily: "'JetBrains Mono', monospace",
                    whiteSpace: 'nowrap',
                    border: `1px solid ${isHighlighted ? '#00D9FF' : 'rgba(0,217,255,0.3)'}`,
                    boxShadow: isHighlighted ? '0 0 15px rgba(0,217,255,0.6)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    minWidth: '120px'
                  }}>
                    <div style={{ fontWeight: 700 }}>{node.title?.substring(0, 22).toUpperCase()}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#F5A623', fontSize: '8px' }}>{'★'.repeat(node.priority || 1)}</span>
                      {isSelected && !isSearchHighlighted && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInfoClick(node);
                          }}
                          style={{
                            background: 'rgba(0,217,255,0.3)',
                            border: '1px solid #00D9FF',
                            color: '#00D9FF',
                            fontSize: '8px',
                            padding: '2px 8px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                            textTransform: 'uppercase',
                            fontWeight: 600
                          }}
                        >
                          Info
                        </button>
                      )}
                    </div>
                  </div>
                </Html>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}

// Memoize for preventing unnecessary re-renders
export default memo(NeuralGraph);