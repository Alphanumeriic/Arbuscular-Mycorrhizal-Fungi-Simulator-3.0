import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface Scene3DProps {
  viewMode?: 'surface' | 'underground';
}

export function Scene3D({ viewMode = 'surface' }: Scene3DProps) {
  const grassTexture = useTexture("/textures/grass.png");
  const sandTexture = useTexture("/textures/sand.jpg");
  
  // Configure texture repeat for better visual appearance
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(4, 4);
  
  sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;
  sandTexture.repeat.set(8, 8);

  if (viewMode === 'underground') {
    return (
      <>
        {/* Underground soil layers */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[25, 25]} />
          <meshLambertMaterial map={sandTexture} color="#8B4513" />
        </mesh>
        
        {/* Soil cross-section walls */}
        <mesh position={[0, -2, -10]}>
          <boxGeometry args={[25, 4, 0.2]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
        
        <mesh position={[-10, -2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[25, 4, 0.2]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
        
        <mesh position={[10, -2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[25, 4, 0.2]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
        
        {/* Underground grid */}
        <gridHelper args={[20, 20, 0x333333, 0x333333]} position={[0, -4, 0]} />
      </>
    );
  }

  return (
    <>
      {/* Surface view - Soil/Ground Plane */}
      <mesh 
        position={[0, -2, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[40, 40]} />
        <meshLambertMaterial map={sandTexture} color="#8B4513" />
      </mesh>

      {/* Surface Layer */}
      <mesh 
        position={[0, -1.8, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[35, 35]} />
        <meshLambertMaterial 
          map={grassTexture} 
          color="#90EE90" 
          transparent 
          opacity={0.8} 
        />
      </mesh>

      {/* Grid helper for better depth perception */}
      <gridHelper args={[20, 20, 0x444444, 0x444444]} position={[0, -1.9, 0]} />
    </>
  );
}
