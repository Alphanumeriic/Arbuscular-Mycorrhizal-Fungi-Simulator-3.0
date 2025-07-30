import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Hypha } from "../lib/simulation/types";

interface FungalNetworkProps {
  hyphae: Hypha[];
  viewMode?: 'surface' | 'underground';
}

export function FungalNetwork({ hyphae, viewMode = 'surface' }: FungalNetworkProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  const { geometry, colors } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const colorArray: number[] = [];
    
    hyphae.forEach(hypha => {
      hypha.segments.forEach((segment, index) => {
        if (index < hypha.segments.length - 1) {
          points.push(segment);
          points.push(hypha.segments[index + 1]);
          
          // Color based on hypha maturity and activity
          const maturity = hypha.maturity;
          const activity = hypha.active ? 1 : 0.5;
          
          // Yellow to orange gradient for growing hyphae
          const color = new THREE.Color().setHSL(0.1 + maturity * 0.05, 0.8, 0.4 + activity * 0.3);
          
          colorArray.push(color.r, color.g, color.b);
          colorArray.push(color.r, color.g, color.b);
        }
      });
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorArray, 3));
    
    return { geometry, colors: colorArray };
  }, [hyphae]);

  useFrame((state) => {
    if (lineRef.current) {
      // Animate hyphal network with subtle pulsing
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main hyphal network lines */}
      <lineSegments ref={lineRef} geometry={geometry}>
        <lineBasicMaterial 
          vertexColors 
          transparent 
          opacity={0.8}
          linewidth={2}
        />
      </lineSegments>
      
      {/* Hyphal tips and branching points */}
      {hyphae.map(hypha => (
        <group key={hypha.id}>
          {/* Growing tip */}
          {hypha.active && hypha.segments.length > 0 && (
            <mesh position={hypha.segments[hypha.segments.length - 1]}>
              <sphereGeometry args={[0.05, 6, 6]} />
              <meshPhongMaterial 
                color="#FFD700" 
                emissive="#332200"
                transparent
                opacity={0.9}
              />
            </mesh>
          )}
          
          {/* Branching points */}
          {hypha.branchPoints.map((point, index) => (
            <mesh key={index} position={point}>
              <sphereGeometry args={[0.03, 4, 4]} />
              <meshPhongMaterial 
                color="#FFA500" 
                emissive="#221100"
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
          
          {/* Connection nodes (when connected to roots) */}
          {hypha.connectedToRoot && (
            <mesh position={hypha.segments[0]}>
              <octahedronGeometry args={[0.08, 1]} />
              <meshPhongMaterial 
                color="#8A2BE2" 
                emissive="#220033"
                transparent
                opacity={0.8}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
