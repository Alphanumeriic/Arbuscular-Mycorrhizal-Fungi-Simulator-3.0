import * as THREE from "three";
import { Hypha, Root, Nutrient, SimulationParameters } from "./types";

export function updateNutrientFlow(
  hyphae: Hypha[],
  roots: Root[],
  nutrients: Nutrient[],
  parameters: SimulationParameters,
  deltaTime: number
): Nutrient[] {
  const newNutrients = [...nutrients];
  
  // Remove completed nutrients
  for (let i = newNutrients.length - 1; i >= 0; i--) {
    const nutrient = newNutrients[i];
    if (nutrient.progress >= 1.0) {
      newNutrients.splice(i, 1);
    }
  }
  
  // Create new nutrient flows from active symbiotic connections (one type at a time for clarity)
  hyphae.forEach(hypha => {
    if (hypha.connectedToRoot && hypha.maturity > 0.5) {
      roots.forEach(root => {
        if (root.colonized && shouldCreateNutrientFlow(hypha, root, parameters)) {
          const flowType = Math.random();
          
          if (flowType < 0.4) {
            // Phosphorus flow (most common)
            const phosphorusNutrient = createPhosphorusFlow(hypha, root);
            newNutrients.push(phosphorusNutrient);
          } else if (flowType < 0.7) {
            // Carbohydrate flow
            const carbohydrateNutrient = createCarbohydrateFlow(root, hypha);
            newNutrients.push(carbohydrateNutrient);
          } else {
            // Water flow (less frequent for clarity)
            const waterNutrient = createWaterFlow(hypha, root);
            newNutrients.push(waterNutrient);
          }
        }
      });
    }
  });
  
  // Update existing nutrient positions
  newNutrients.forEach(nutrient => {
    updateNutrientPosition(nutrient, deltaTime);
  });
  
  return newNutrients;
}

function shouldCreateNutrientFlow(
  hypha: Hypha,
  root: Root,
  parameters: SimulationParameters
): boolean {
  const nutrientFactor = parameters.nutrients;
  const moistureFactor = parameters.soilMoisture;
  const exchangeRate = 0.008 * nutrientFactor * moistureFactor; // Reduced rate for cleaner visualization
  
  return Math.random() < exchangeRate;
}

function createPhosphorusFlow(hypha: Hypha, root: Root): Nutrient {
  const hyphalTip = hypha.segments[hypha.segments.length - 1];
  const rootCenter = root.position.clone();
  rootCenter.y -= root.length * 0.5;
  
  return {
    id: `phosphorus-${Date.now()}-${Math.random()}`,
    type: 'phosphorus',
    position: hyphalTip.clone(),
    source: hyphalTip.clone(),
    target: rootCenter,
    concentration: 0.7 + Math.random() * 0.3,
    flowRate: 0.5 + Math.random() * 0.5,
    progress: 0
  };
}

function createCarbohydrateFlow(root: Root, hypha: Hypha): Nutrient {
  const rootCenter = root.position.clone();
  rootCenter.y -= root.length * 0.3;
  const hyphalConnection = hypha.segments[hypha.segments.length - 1];
  
  return {
    id: `carbohydrates-${Date.now()}-${Math.random()}`,
    type: 'carbohydrates',
    position: rootCenter.clone(),
    source: rootCenter.clone(),
    target: hyphalConnection,
    concentration: 0.5 + Math.random() * 0.5,
    flowRate: 0.3 + Math.random() * 0.4,
    progress: 0
  };
}

function createWaterFlow(hypha: Hypha, root: Root): Nutrient {
  const hyphalBase = hypha.segments[0];
  const rootCenter = root.position.clone();
  rootCenter.y += root.length * 0.2; // Flow to upper part of root
  
  return {
    id: `water-${Date.now()}-${Math.random()}`,
    type: 'water',
    position: hyphalBase.clone(),
    source: hyphalBase.clone(),
    target: rootCenter,
    concentration: 0.8 + Math.random() * 0.2,
    flowRate: 0.6 + Math.random() * 0.4,
    progress: 0
  };
}

function updateNutrientPosition(nutrient: Nutrient, deltaTime: number): void {
  // Update progress along the path with cleaner movement
  const progressSpeed = nutrient.flowRate * deltaTime * 1.2;
  nutrient.progress = Math.min(1.0, nutrient.progress + progressSpeed);
  
  // Smooth interpolation along the path
  const direction = new THREE.Vector3().subVectors(nutrient.target, nutrient.source);
  nutrient.position.copy(nutrient.source).add(direction.multiplyScalar(nutrient.progress));
  
  // Minimal wobble for natural look without messiness
  const wobble = new THREE.Vector3(
    (Math.random() - 0.5) * 0.005,
    (Math.random() - 0.5) * 0.002,
    (Math.random() - 0.5) * 0.005
  );
  nutrient.position.add(wobble);
}

export function calculateNutrientExchangeRate(
  hypha: Hypha,
  root: Root,
  parameters: SimulationParameters
): number {
  const baseRate = 0.1;
  const moistureFactor = Math.min(1, parameters.soilMoisture / 0.8);
  const healthFactor = root.health;
  const maturityFactor = hypha.maturity;
  const nutrientFactor = parameters.nutrients;
  
  return baseRate * moistureFactor * healthFactor * maturityFactor * nutrientFactor;
}

export function getNutrientStats(nutrients: Nutrient[]): {
  phosphorusCount: number;
  carbohydrateCount: number;
  waterCount: number;
  totalFlow: number;
  averageConcentration: number;
} {
  const phosphorusNutrients = nutrients.filter(n => n.type === 'phosphorus');
  const carbohydrateNutrients = nutrients.filter(n => n.type === 'carbohydrates');
  const waterNutrients = nutrients.filter(n => n.type === 'water');
  
  const totalFlow = nutrients.reduce((sum, n) => sum + n.flowRate, 0);
  const averageConcentration = nutrients.length > 0 
    ? nutrients.reduce((sum, n) => sum + n.concentration, 0) / nutrients.length
    : 0;
  
  return {
    phosphorusCount: phosphorusNutrients.length,
    carbohydrateCount: carbohydrateNutrients.length,
    waterCount: waterNutrients.length,
    totalFlow,
    averageConcentration
  };
}