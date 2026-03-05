import { useMemo, useRef, useState, memo, useCallback } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { mockNodes } from '../data/mockNodes';

interface NeuralGraphProps {
  onNodeClick: (node: any) => void;
  searchQuery: string;
}

const nodeColors: Record<string, string> = {
  memory: '#4A90D9',
  project: '#00D9FF',
  task: '#5BC8C0',
  interaction: '#9B59B6',
};

function NeuralGraph({ onNodeClick, searchQuery }: NeuralGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.Group>(null);
  
  // Use useCallback for stable reference
  const handleNodeClick = useCallback((node: any) => {
    onNodeClick(node);
  }, [onNodeClick]);

  // Use useCallback for hover handlers
  const handlePointerOver = useCallback((e: ThreeEvent<MouseEvent>, node: any) => {
    e.stopPropagation();
    setHoveredNode(node.id);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHoveredNode(null);
    document.body.style.cursor = 'crosshair';
  }, []);

  // Pre-compute filtered nodes to avoid recalculation in map
  const filteredNodes = useMemo(() => {
    const nodes = searchQuery 
      ? mockNodes.filter((n: any) => !n.isCenter && n.title?.toUpperCase().includes(searchQuery.toUpperCase()))
      : mockNodes.filter((n: any) => !n.isCenter);
    return nodes.slice(0, 80); // Limit to 80 nodes
  }, [searchQuery]);

  // Generate node positions using proper Fibonacci sphere distribution
  const nodePositions = useMemo(() => {
    const pos = new Map<string, THREE.Vector3>();
    const centerNode = mockNodes.find((n: any) => n.isCenter);
    
    if (centerNode) {
      pos.set(centerNode.id, new THREE.Vector3(0, 0, 0));
    }

    const count = filteredNodes.length;
    const radius = 280; // Larger radius for more spread out sphere

    filteredNodes.forEach((node: any, i: number) => {
      // Proper Fibonacci sphere distribution
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      
      // Larger radius for higher priority nodes
      const nodeRadius = radius + (node.priority > 3 ? 30 : node.priority > 1 ? 15 : 0);
      
      const x = nodeRadius * Math.sin(phi) * Math.cos(theta);
      const y = nodeRadius * Math.sin(phi) * Math.sin(theta);
      const z = nodeRadius * Math.cos(phi);
      
      pos.set(node.id, new THREE.Vector3(x, y, z));
    });

    return pos;
  }, [filteredNodes]);

  // Generate connection lines between nodes
  const connections = useMemo(() => {
    const links: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    const pos = nodePositions;
    
    // Create connections between nearby nodes and high-priority nodes
    filteredNodes.forEach((nodeA: any) => {
      const posA = pos.get(nodeA.id);
      if (!posA) return;
      
      // Connect high-priority nodes to 3-4 nearby nodes
      if (nodeA.priority > 3) {
        const connectionsToMake = 3 + Math.floor(Math.random() * 3);
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
            links.push({ start: posA.clone(), end: posB.clone() });
            made++;
          }
        }
      }
    });
    
    return links;
  }, [filteredNodes, nodePositions]);

  // Create line geometry for connections
  const lineGeometry = useMemo(() => {
    if (connections.length === 0) return null;
    
    const positions = new Float32Array(connections.length * 6);
    connections.forEach((conn, i) => {
      positions[i * 6] = conn.start.x;
      positions[i * 6 + 1] = conn.start.y;
      positions[i * 6 + 2] = conn.start.z;
      positions[i * 6 + 3] = conn.end.x;
      positions[i * 6 + 4] = conn.end.y;
      positions[i * 6 + 5] = conn.end.z;
    });
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [connections]);

  // Animate nodes with breathing effect
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    const children = groupRef.current.children;
    
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const node = filteredNodes[i];
      if (!node || node.isCenter) continue;
      
      // Breathing animation
      const breathe = Math.sin(time * node.priority * 0.5 + i * 0.5) * 0.08;
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

  return (
    <group>
      {/* Connection Lines */}
      {lineGeometry && (
        <lineSegments ref={linesRef} geometry={lineGeometry}>
          <lineBasicMaterial color="#00D9FF" transparent opacity={0.15} />
        </lineSegments>
      )}
      
      {/* Nodes */}
      <group ref={groupRef}>
        {filteredNodes.map((node: any) => {
          const pos = nodePositions.get(node.id);
          if (!pos) return null;
          
          const isCenter = node.isCenter;
          const isHighlighted = isNodeHighlighted(node.id);
          const isHovered = hoveredNode === node.id;
          
          const color = isCenter ? '#00CFFF' : nodeColors[node.type] || '#00D9FF';
          
          // Larger node sizes - priority based
          let radius = 3;
          if (node.priority >= 5) radius = 12;      // Projects - biggest
          else if (node.priority >= 3) radius = 7; // Tasks - medium
          else radius = 3;                          // Memory - smallest
          
          // Highlighted nodes are bigger
          const finalRadius = isHighlighted ? radius * 1.8 : radius;
          
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
                scale={isHovered ? 1.3 : 1}
              >
                <sphereGeometry args={[finalRadius, 16, 16]} />
                <meshStandardMaterial
                  color={isHighlighted ? '#FFFFFF' : color}
                  emissive={isHighlighted ? '#FFFFFF' : color}
                  emissiveIntensity={isCenter ? 3 : isHighlighted ? 2 : 1}
                  transparent
                  opacity={isHighlighted ? 1 : 0.9}
                />
              </mesh>
              
              {/* Node label on hover or search highlight */}
              {(isHovered || isHighlighted) && !isCenter && (
                <Html
                  position={[0, finalRadius + 4, 0]}
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
                    padding: '3px 6px',
                    borderRadius: '4px',
                    fontFamily: "'JetBrains Mono', monospace",
                    whiteSpace: 'nowrap',
                    border: `1px solid ${isHighlighted ? '#00D9FF' : 'rgba(0,217,255,0.3)'}`,
                    boxShadow: isHighlighted ? '0 0 10px rgba(0,217,255,0.5)' : 'none',
                  }}>
                    {node.title?.substring(0, 20).toUpperCase()}
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