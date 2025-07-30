import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Root } from "../lib/simulation/types";

interface RootSystemProps {
  roots: Root[];
  viewMode?: 'surface' | 'underground';
}

export function RootSystem({ roots, viewMode = 'surface' }: RootSystemProps) {
  const groupRef = useRef<THREE.Group>(null);

  const rootGeometries = useMemo(() => {
    return roots.map((root) => {
      const points = [];
      const segments = 20;

      // Create branching root structure
      // UH IDK why u need the <=, should just be < since it starts at 0
      // for (let i = 0; i <= segments; i++) {
      //   const t = i / segments;
      //   const x = root.position.x + Math.sin(t * Math.PI * 2) * root.size * 0.5;
      //   const y = root.position.y - t * root.length;
      //   const z = root.position.z + Math.cos(t * Math.PI * 3) * root.size * 0.3;
      //   points.push(new THREE.Vector3(x, y, z));
      // }

      for (let i = 0; i < segments; i++) {
        const t = i / segments;
        const x = root.position.x + Math.sin(t * Math.PI * 2) * root.size * 0.5;
        const y = root.position.y - t * root.length;
        const z = root.position.z + Math.cos(t * Math.PI * 3) * root.size * 0.3;
        points.push(new THREE.Vector3(x, y, z));
      }

      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, [roots]);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle animation for living roots
      groupRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.material.emissive.setHSL(
            0.3,
            0.2,
            0.1 + Math.sin(state.clock.elapsedTime + index) * 0.05,
          );
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {roots.map((root, index) => (
        <group key={root.id}>
          {/* Surface plant indicator (only in surface view) */}
          {viewMode === 'surface' && (
            <mesh position={[root.position.x, 0.5, root.position.z]}>
              <coneGeometry args={[0.3, 1, 8]} />
              <meshPhongMaterial 
                color="#228B22" 
                emissive="#002200"
                transparent
                opacity={0.8}
              />
            </mesh>
          )}
          
          {/* Plant stem/trunk (surface view only) */}
          {viewMode === 'surface' && (
            <mesh position={[root.position.x, 0, root.position.z]}>
              <cylinderGeometry args={[0.05, 0.08, 1, 6]} />
              <meshPhongMaterial color="#8B4513" />
            </mesh>
          )}
          
          {/* Main root cylinder */}
          <mesh
            position={[
              root.position.x,
              root.position.y - root.length / 2,
              root.position.z,
            ]}
          >
            <cylinderGeometry
              args={[root.size, root.size * 0.5, root.length, 8]}
            />
            <meshPhongMaterial
              color={
                root.health > 0.7
                  ? "#228B22"
                  : root.health > 0.4
                    ? "#9ACD32"
                    : "#DAA520"
              }
              emissive="#004400"
              shininess={30}
            />
          </mesh>

          {/* Root branches */}
          {rootGeometries[index] && (
            <line>
              <primitive object={rootGeometries[index]} attach="geometry" />
              <lineBasicMaterial color="#32CD32" linewidth={2} />
            </line>
          )}

          {/* Root tips (growing points) */}
          <mesh
            position={[
              root.position.x,
              root.position.y - root.length,
              root.position.z,
            ]}
          >
            <sphereGeometry args={[root.size * 0.8, 8, 8]} />
            <meshPhongMaterial
              color="#90EE90"
              emissive="#002200"
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Colonization points (arbuscules) */}
          {root.colonized && (
            <mesh
              position={[
                root.position.x,
                root.position.y - root.length * 0.7,
                root.position.z,
              ]}
            >
              <octahedronGeometry args={[root.size * 0.6, 1]} />
              <meshPhongMaterial
                color="#FF6347"
                emissive="#330000"
                transparent
                opacity={0.9}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
