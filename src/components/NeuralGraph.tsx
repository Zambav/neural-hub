import { useMemo, useRef, useState, memo, useCallback, useEffect } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { mockNodes } from '../data/mockNodes';

interface NeuralGraphProps {
  onNodeClick: (node: any) => void;
  searchQuery: string;
  selectedNode: any;
  onSelectNode: (node: any | null) => void;
}

// Dynamic color palettes for variety
const nodeColors: Record<string, string> = {
  memory: '#4A90D9',
  project: '#00D9FF',
  task: '#5BC8C0',
  interaction: '#9B59B6',
};

// Extended palette for color variation
const colorVariations = [
  '#00D9FF', '#4A90D9', '#5BC8C0', '#9B59B6', '#F5A623', '#E74C3C',
  '#2ECC71', '#E91E63', '#9C27B0', '#00BCD4', '#FF9800', '#8BC34A'
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

function NeuralGraph({ onNodeClick, searchQuery, selectedNode, onSelectNode }: NeuralGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.Group>(null);
  
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
      ? mockNodes.filter((n: any) => !n.isCenter && n.title?.toUpperCase().includes(searchQuery.toUpperCase()))
      : mockNodes.filter((n: any) => !n.isCenter);
    return nodes.slice(0, 100); // Limit to 100 nodes for performance
  }, [searchQuery]);

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
    const centerNode = mockNodes.find((n: any) => n.isCenter);
    
    if (centerNode) {
      pos.set(centerNode.id, new THREE.Vector3(0, 0, 0));
    }

    const count = filteredNodes.length;
    const radius = 380; // Larger radius for more spread out sphere

    filteredNodes.forEach((node: any, i: number) => {
      // Proper Fibonacci sphere distribution
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      
      // Varying radius to create 3D depth within sphere
      const depthVariation = node.priority > 3 ? 0.7 : (node.priority > 1 ? 0.85 : 1);
      const nodeRadius = radius * depthVariation * (0.8 + Math.random() * 0.4);
      
      const x = nodeRadius * Math.sin(phi) * Math.cos(theta);
      const y = nodeRadius * Math.sin(phi) * Math.sin(theta);
      const z = nodeRadius * Math.cos(phi);
      
      pos.set(node.id, new THREE.Vector3(x, y, z));
      
      // Initialize floating offset for this node
      nodeOffsets.current.set(node.id, {
        offset: new THREE.Vector3(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        ),
        phase: Math.random() * Math.PI * 2
      });
    });

    return pos;
  }, [filteredNodes]);

  // Generate connection lines between nodes
  const connections = useMemo(() => {
    const links: { start: THREE.Vector3; end: THREE.Vector3; sourceId: string; targetId: string }[] = [];
    const pos = nodePositions;
    
    // Create connections between nearby nodes and high-priority nodes
    filteredNodes.forEach((nodeA: any) => {
      const posA = pos.get(nodeA.id);
      if (!posA) return;
      
      // Connect high-priority nodes to nearby nodes
      if (nodeA.priority > 3) {
        const connectionsToMake = 2 + Math.floor(Math.random() * 4);
        let made = 0;
        
        // Find nearby nodes
        const distances = filteredNodes
          .filter((n: any) => n.id !== nodeA.id)
          .map((n: any) => {
            const posB = pos.get(n.id);
            if (!posB) return { id: n.id, dist: Infinity };
            return { id: n.id, dist: posA.distanceTo(posB) };
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

  // Animated node positions with floating effect
  const animatedPositions = useMemo(() => {
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

  // Store original positions and animate within bounds
  const originalPositions = useRef<Map<string, THREE.Vector3>>(new Map());
  
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
        {filteredNodes.map((node: any, idx: number) => {
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
          const color = isCenter ? '#00CFFF' : baseColor;
          
          // Larger node sizes - priority based
          let radius = 2.5;
          if (node.priority >= 5) radius = 10;      // Projects - biggest
          else if (node.priority >= 3) radius = 6; // Tasks - medium
          else radius = 2.5;                        // Memory - smallest
          
          // Highlighted nodes are bigger
          const isHighlighted = isSearchHighlighted || isSelected || isConnected;
          const finalRadius = isHighlighted ? radius * 1.8 : radius;
          
          // Opacity based on state
          const opacity = isDimmed ? 0.15 : (isHighlighted ? 1 : 0.65);
          const emissiveIntensity = isCenter ? 3 : (isHighlighted ? 2 : (isDimmed ? 0.1 : 0.6));
          
          return (
            <group 
              key={node.id} 
              position={[pos.x, pos.y, pos.z]}
            >
              <mesh
                onClick={(e: ThreeEvent<MouseEvent>) => {
                  e.stopPropagation();
                  handleNodeClick(node);
                }}
                onPointerOver={(e: ThreeEvent<MouseEvent>) => handlePointerOver(e, node)}
                onPointerOut={handlePointerOut}
                scale={isHovered ? 1.3 : (isSelected ? 1.4 : 1)}
              >
                <sphereGeometry args={[finalRadius, 16, 16]} />
                <meshStandardMaterial
                  color={isHighlighted ? '#FFFFFF' : color}
                  emissive={isHighlighted ? '#FFFFFF' : color}
                  emissiveIntensity={emissiveIntensity}
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