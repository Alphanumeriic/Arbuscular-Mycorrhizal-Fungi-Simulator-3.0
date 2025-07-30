import * as THREE from "three";

export interface SimulationParameters {
  sporeDensity: number;
  soilMoisture: number;
  nutrients: number;
  rootHealth: number;
  growthRate?: number;
  colonizationRate?: number;
  branchingFactor?: number;
  maxHyphalLength?: number;
  connectionDistance?: number;
}

export interface Spore {
  id: string;
  position: THREE.Vector3;
  viability: number;
  germinated: boolean;
  timeCreated: number;
}

export interface Hypha {
  id: string;
  segments: THREE.Vector3[];
  growthDirection: THREE.Vector3;
  active: boolean;
  maturity: number;
  connectedToRoot: boolean;
  branchPoints: THREE.Vector3[];
  parentSporeId?: string;
}

export interface Root {
  id: string;
  position: THREE.Vector3;
  length: number;
  size: number;
  health: number;
  colonized: boolean;
  branchPoints: THREE.Vector3[];
}

export interface Nutrient {
  id: string;
  type: 'phosphorus' | 'carbohydrates' | 'water';
  position: THREE.Vector3;
  source: THREE.Vector3;
  target: THREE.Vector3;
  concentration: number;
  flowRate: number;
  progress: number;
}

export interface ColonizationPoint {
  id: string;
  position: THREE.Vector3;
  rootId: string;
  hyphaId: string;
  arbusculeFormed: boolean;
  vesicleFormed: boolean;
  nutrientExchangeRate: number;
}
