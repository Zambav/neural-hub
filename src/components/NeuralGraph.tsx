import { useMemo, useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
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
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate node positions using Fibonacci sphere distribution
  const nodePositions = useMemo(() => {
    const pos = new Map();
    const centerNode = mockNodes.find((n: any) => n.isCenter);
    
    if (centerNode) {
      pos.set(centerNode.id, new THREE.Vector3(0, 0, 0));
    }

    // Filter nodes based on search query
    const filteredNodes = searchQuery 
      ? mockNodes.filter((n: any) => !n.isCenter && n.title?.toUpperCase().includes(searchQuery.toUpperCase()))
      : mockNodes.filter((n: any) => !n.isCenter);
    
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
  }, [searchQuery]);

  // Animate nodes with breathing effect
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    groupRef.current.children.forEach((child, index) => {
      const node = mockNodes[index];
      if (!node || node.isCenter) return;
      
      // Breathing animation
      const breathe = Math.sin(time * node.priority * 0.5 + index * 0.5) * 0.1;
      const scale = 1 + breathe;
      child.scale.setScalar(scale);
    });
  });

  const isNodeHighlighted = (node: any) => {
    if (!searchQuery) return false;
    return node.title?.toUpperCase().includes(searchQuery.toUpperCase());
  };

  return (
    <group ref={groupRef}>
      {mockNodes.slice(0, 80).map((node: any) => {
        const pos = nodePositions.get(node.id);
        if (!pos) return null;
        
        const isCenter = node.isCenter;
        const isHighlighted = isNodeHighlighted(node);
        const isHovered = hoveredNode?.id === node.id;
        
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
                onNodeClick(node);
              }}
              onPointerOver={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                setHoveredNode(node);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setHoveredNode(null);
                document.body.style.cursor = 'crosshair';
              }}
              scale={isHovered ? 1.3 : 1}
            >
              {isCenter ? (
                <icosahedronGeometry args={[radius, 1]} />
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

export default NeuralGraph;
