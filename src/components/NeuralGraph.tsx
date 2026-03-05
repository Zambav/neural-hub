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
    return searchQuery 
      ? mockNodes.filter((n: any) => !n.isCenter && n.title?.toUpperCase().includes(searchQuery.toUpperCase()))
      : mockNodes.filter((n: any) => !n.isCenter);
  }, [searchQuery]);

  // Generate node positions using Fibonacci sphere distribution
  const nodePositions = useMemo(() => {
    const pos = new Map<string, THREE.Vector3>();
    const centerNode = mockNodes.find((n: any) => n.isCenter);
    
    if (centerNode) {
      pos.set(centerNode.id, new THREE.Vector3(0, 0, 0));
    }

    filteredNodes.forEach((node: any, i: number) => {
      const phi = Math.acos(-1 + (2 * i) / filteredNodes.length);
      const theta = Math.sqrt(filteredNodes.length * Math.PI) * phi;
      const radius = 150 + (5 - node.priority) * 30;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      pos.set(node.id, new THREE.Vector3(x, y, z));
    });

    return pos;
  }, [filteredNodes]);

  // Animate nodes with breathing effect (optimized - avoid per-frame allocation)
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    const children = groupRef.current.children;
    
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const node = filteredNodes[i];
      if (!node || node.isCenter) continue;
      
      // Breathing animation
      const breathe = Math.sin(time * node.priority * 0.5 + i * 0.5) * 0.1;
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

  // Pre-create geometry and material to avoid recreation
  const centerGeometry = useMemo(() => new THREE.IcosahedronGeometry(10, 1), []);
  // Create sphere geometry with proper radius
  const createSphereGeometry = useCallback((radius: number) => {
    return new THREE.SphereGeometry(radius, 16, 16);
  }, []);

  return (
    <group ref={groupRef}>
      {filteredNodes.slice(0, 80).map((node: any) => {
        const pos = nodePositions.get(node.id);
        if (!pos) return null;
        
        const isCenter = node.isCenter;
        const isHighlighted = isNodeHighlighted(node.id);
        const isHovered = hoveredNode === node.id;
        
        const color = isCenter ? '#00CFFF' : nodeColors[node.type] || '#00D9FF';
        const radius = isCenter ? 10 : (node.priority > 3 ? 3 : 2);
        
        // Highlighted nodes are bigger
        const finalRadius = isHighlighted ? radius * 1.5 : radius;
        
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
              {isCenter ? (
                <primitive object={centerGeometry} attach="geometry" />
              ) : (
                <sphereGeometry args={[finalRadius / 4, 16, 16]} />
              )}
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
                position={[0, finalRadius + 3, 0]}
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
  );
}

// Memoize for preventing unnecessary re-renders
export default memo(NeuralGraph);
