import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Scene3D } from "./Scene3D";
import { RootSystem } from "./RootSystem";
import { FungalNetwork } from "./FungalNetwork";
import { SporeSystem } from "./SporeSystem";
import { NutrientFlow } from "./NutrientFlow";
import { useSimulation } from "../lib/stores/useSimulation";
import { updateGrowth } from "../lib/simulation/growthAlgorithm";
import { updateNutrientFlow } from "../lib/simulation/nutrientExchange";
import * as THREE from "three";

interface AMFSimulationProps {
  viewMode?: 'surface' | 'underground';
}

export function AMFSimulation({ viewMode = 'surface' }: AMFSimulationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const {
    isPlaying,
    speed,
    spores,
    hyphae,
    roots,
    nutrients,
    parameters,
    time,
    incrementTime,
    updateSpores,
    updateHyphae,
    updateNutrients
  } = useSimulation();

  useFrame((state, delta) => {
    if (!isPlaying) return;

    const adjustedDelta = delta * speed;
    
    // Update simulation time
    incrementTime(adjustedDelta);

    // Update growth algorithms
    const newHyphae = updateGrowth(spores, hyphae, roots, parameters, adjustedDelta);
    updateHyphae(newHyphae);

    // Update nutrient exchange
    const newNutrients = updateNutrientFlow(hyphae, roots, nutrients, parameters, adjustedDelta);
    updateNutrients(newNutrients);

    // Scene rotation is now controlled by OrbitControls
    // Removed automatic rotation to allow user interaction

    console.log(`Simulation time: ${time.toFixed(2)}s, Hyphae count: ${hyphae.length}, Active nutrients: ${nutrients.length}`);
  });

  return (
    <group ref={groupRef}>
      <Scene3D viewMode={viewMode} />
      <RootSystem roots={roots} viewMode={viewMode} />
      <FungalNetwork hyphae={hyphae} viewMode={viewMode} />
      <SporeSystem spores={spores} viewMode={viewMode} />
      <NutrientFlow nutrients={nutrients} viewMode={viewMode} />
    </group>
  );
}
