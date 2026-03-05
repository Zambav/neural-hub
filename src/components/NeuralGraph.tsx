import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { mockNodes } from '../data/mockNodes';

// Simple version without TypeScript complexity
function NeuralGraph({ onNodeClick }: { onNodeClick: (node: any) => void }) {
  const nodePositions = useMemo(() => {
    const pos = new Map();
    const centerNode = mockNodes.find((n: any) => n.isCenter);
    
    if (centerNode) {
      pos.set(centerNode.id, new THREE.Vector3(0, 0, 0));
    }

    const otherNodes = mockNodes.filter((n: any) => !n.isCenter);
    otherNodes.forEach((node: any, i: number) => {
      const phi = Math.acos(-1 + (2 * i) / otherNodes.length);
      const theta = Math.sqrt(otherNodes.length * Math.PI) * phi;
      const radius = 150 + (5 - node.priority) * 30;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      pos.set(node.id, new THREE.Vector3(x, y, z));
    });

    return pos;
  }, []);

  // Simple pulsing animation
  useFrame(({ clock }) => {
    // Just a simple animation hook - we could add node pulsing here
  });

  const nodeColors: Record<string, string> = {
    memory: '#4A90D9',
    project: '#5BC8C0',
    task: '#F5A623',
    interaction: '#9B59B6',
  };

  return (
    <group>
      {mockNodes.slice(0, 50).map((node: any) => {
        const pos = nodePositions.get(node.id);
        if (!pos) return null;
        
        const isCenter = node.isCenter;
        const color = isCenter ? '#00CFFF' : nodeColors[node.type] || '#00D9FF';
        const radius = isCenter ? 10 : (node.priority > 3 ? 3 : 2);

        return (
          <group key={node.id} position={[pos.x, pos.y, pos.z]}>
            <mesh
              onClick={() => onNodeClick(node)}
            >
              {isCenter ? (
                <icosahedronGeometry args={[radius, 0]} />
              ) : (
                <sphereGeometry args={[radius / 4, 16, 16]} />
              )}
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isCenter ? 3 : 1}
              />
            </mesh>
            
            {!isCenter && (
              <Html
                position={[0, radius + 2, 0]}
                center
                distanceFactor={200}
              >
                <div style={{
                  background: 'rgba(0,15,25,0.8)',
                  color: '#fff',
                  fontSize: '8px',
                  padding: '2px 4px',
                  borderRadius: '2px',
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap',
                }}>
                  {node.title?.substring(0, 15).toUpperCase()}
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