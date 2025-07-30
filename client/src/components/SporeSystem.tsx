import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Spore } from "../lib/simulation/types";

interface SporeSystemProps {
  spores: Spore[];
  viewMode?: 'surface' | 'underground';
}

export function SporeSystem({ spores, viewMode = 'surface' }: SporeSystemProps) {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!instancedMeshRef.current || spores.length === 0) return;

    spores.forEach((spore, index) => {
      dummy.position.copy(spore.position);
      
      // Animate spores with gentle floating motion
      dummy.position.y += Math.sin(state.clock.elapsedTime * 2 + index) * 0.02;
      dummy.rotation.x = state.clock.elapsedTime + index;
      dummy.rotation.y = state.clock.elapsedTime * 0.5 + index;
      
      // Scale based on spore state
      const scale = spore.germinated ? 0.5 : 1;
      dummy.scale.setScalar(scale * spore.viability);
      
      dummy.updateMatrix();
      instancedMeshRef.current.setMatrixAt(index, dummy.matrix);
    });
    
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  const sporeGeometry = useMemo(() => new THREE.SphereGeometry(0.04, 8, 8), []);
  const sporeMaterial = useMemo(() => new THREE.MeshPhongMaterial({
    color: "#FF8C00",
    emissive: "#331100",
    transparent: true,
    opacity: 0.8,
    shininess: 30
  }), []);

  return (
    <group>
      {/* Instanced spores for performance */}
      <instancedMesh
        ref={instancedMeshRef}
        args={[sporeGeometry, sporeMaterial, spores.length]}
        castShadow
      />
      
      {/* Individual spore effects for special states */}
      {spores.map(spore => (
        <group key={spore.id}>
          {/* Germination effect */}
          {spore.germinated && (
            <mesh position={spore.position}>
              <ringGeometry args={[0.05, 0.15, 8]} />
              <meshBasicMaterial 
                color="#90EE90" 
                transparent 
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
          
          {/* Environmental stress indicator */}
          {spore.viability < 0.5 && (
            <mesh position={[spore.position.x, spore.position.y + 0.1, spore.position.z]}>
              <sphereGeometry args={[0.02, 4, 4]} />
              <meshBasicMaterial color="#FF0000" transparent opacity={0.6} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
