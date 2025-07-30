import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Nutrient } from "../lib/simulation/types";

interface NutrientFlowProps {
  nutrients: Nutrient[];
  viewMode?: 'surface' | 'underground';
}

export function NutrientFlow({ nutrients, viewMode = 'surface' }: NutrientFlowProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particleSystemRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const particleCount = nutrients.length;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    nutrients.forEach((nutrient, index) => {
      positions[index * 3] = nutrient.position.x;
      positions[index * 3 + 1] = nutrient.position.y;
      positions[index * 3 + 2] = nutrient.position.z;
      
      // Color based on nutrient type
      const color = nutrient.type === 'phosphorus' 
        ? new THREE.Color(0x00BFFF)  // Deep sky blue for phosphorus
        : new THREE.Color(0xFF69B4); // Hot pink for carbon/sugars
      
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
      
      sizes[index] = nutrient.concentration * 2;
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Add some floating animation
          mvPosition.x += sin(time + position.x * 10.0) * 0.01;
          mvPosition.y += cos(time + position.y * 10.0) * 0.01;
          
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;
          
          float alpha = 1.0 - (r * 2.0);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    return { geometry, material };
  }, [nutrients]);

  useFrame((state) => {
    if (material.uniforms) {
      material.uniforms.time.value = state.clock.elapsedTime;
    }

    // Update particle positions based on flow direction
    if (particleSystemRef.current && geometry.attributes.position) {
      const positions = geometry.attributes.position.array as Float32Array;
      
      nutrients.forEach((nutrient, index) => {
        // Animate along flow direction
        const progress = (state.clock.elapsedTime * nutrient.flowRate) % 1;
        const startPos = nutrient.source;
        const endPos = nutrient.target;
        
        positions[index * 3] = THREE.MathUtils.lerp(startPos.x, endPos.x, progress);
        positions[index * 3 + 1] = THREE.MathUtils.lerp(startPos.y, endPos.y, progress);
        positions[index * 3 + 2] = THREE.MathUtils.lerp(startPos.z, endPos.z, progress);
      });
      
      geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Particle system for nutrient flow */}
      <points ref={particleSystemRef} geometry={geometry} material={material} />
      
      {/* Flow path indicators */}
      {nutrients.map(nutrient => (
        <group key={nutrient.id}>
          {/* Flow direction arrow */}
          <mesh 
            position={nutrient.target}
          >
            <coneGeometry args={[0.02, 0.08, 4]} />
            <meshBasicMaterial 
              color={nutrient.type === 'phosphorus' ? "#00BFFF" : "#FF69B4"}
              transparent
              opacity={0.5}
            />
          </mesh>
          
          {/* Connection line */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={new Float32Array([
                  nutrient.source.x, nutrient.source.y, nutrient.source.z,
                  nutrient.target.x, nutrient.target.y, nutrient.target.z
                ])}
                count={2}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color={nutrient.type === 'phosphorus' ? "#00BFFF" : "#FF69B4"}
              transparent
              opacity={0.3}
              linewidth={1}
            />
          </line>
        </group>
      ))}
    </group>
  );
}
