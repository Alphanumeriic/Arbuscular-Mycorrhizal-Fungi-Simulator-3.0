import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { 
  SimulationParameters, 
  Spore, 
  Hypha, 
  Root, 
  Nutrient 
} from "../simulation/types";
import * as THREE from "three";

interface SimulationState {
  isPlaying: boolean;
  speed: number;
  time: number;

  // Simulation entities
  spores: Spore[];
  hyphae: Hypha[];
  roots: Root[];
  nutrients: Nutrient[];

  // Parameters
  parameters: SimulationParameters;

  // Actions
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  incrementTime: (delta: number) => void;

  // Entity updates
  updateSpores: (spores: Spore[]) => void;
  updateHyphae: (hyphae: Hypha[]) => void;
  updateNutrients: (nutrients: Nutrient[]) => void;

  // Parameter updates
  updateParameters: (updates: Partial<SimulationParameters>) => void;

  // Control actions
  reset: () => void;
  exportData: () => void;
  addPlant: (position?: { x: number; z: number }) => void;
  removePlant: (rootId: string) => void;
}

// Initialize simulation with default state
const createInitialSpores = (count: number): Spore[] => {
  const spores: Spore[] = [];
  for (let i = 0; i < count; i++) {
    spores.push({
      id: `spore-${i}`,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        -1 + Math.random() * 0.5,
        (Math.random() - 0.5) * 10
      ),
      viability: 0.8 + Math.random() * 0.2,
      germinated: false,
      timeCreated: 0
    });
  }
  return spores;
};

const createInitialRoots = (): Root[] => {
  return [
    {
      id: 'root-1',
      position: new THREE.Vector3(-2, 0, -1),
      length: 3,
      size: 0.1,
      health: 0.9,
      colonized: false,
      branchPoints: []
    },
    {
      id: 'root-2',
      position: new THREE.Vector3(1, 0, 2),
      length: 2.5,
      size: 0.08,
      health: 0.8,
      colonized: false,
      branchPoints: []
    },
    {
      id: 'root-3',
      position: new THREE.Vector3(-1, 0, 3),
      length: 2,
      size: 0.06,
      health: 0.7,
      colonized: false,
      branchPoints: []
    }
  ];
};

export const useSimulation = create<SimulationState>()(
  subscribeWithSelector((set, get) => ({
    isPlaying: false,
    speed: 1.0,
    time: 0,

    spores: createInitialSpores(12),
    hyphae: [],
    roots: createInitialRoots(),
    nutrients: [],

    parameters: {
      sporeDensity: 1.2,
      soilMoisture: 0.6,
      nutrients: 0.7,
      rootHealth: 0.8,
      growthRate: 1.0,
      colonizationRate: 0.5,
      branchingFactor: 1.5,
      maxHyphalLength: 5.0,
      connectionDistance: 0.5
    },

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    setSpeed: (speed) => set({ speed }),

    incrementTime: (delta) => set((state) => ({ time: state.time + delta })),

    updateSpores: (spores) => set({ spores }),

    updateHyphae: (hyphae) => set({ hyphae }),

    updateNutrients: (nutrients) => set({ nutrients }),

    updateParameters: (updates) => set((state) => {
      const newParameters = { ...state.parameters, ...updates };

      // If spore density changed, update spore count immediately
      let newSpores = state.spores;
      if (updates.sporeDensity !== undefined) {
        const currentCount = state.spores.length;
        // Start at 12 spores for density 1.0, then add 1 spore for each 0.1 increase
        const targetSporeCount = Math.round(12 + (newParameters.sporeDensity - 1.0) * 10);

        if (targetSporeCount > currentCount) {
          // Add more spores
          const newSporeArray = [...state.spores];
          for (let i = currentCount; i < targetSporeCount; i++) {
            newSporeArray.push({
              id: `spore-${Date.now()}-${i}`,
              position: new THREE.Vector3(
                (Math.random() - 0.5) * 12,
                -1 + Math.random() * 0.5,
                (Math.random() - 0.5) * 12
              ),
              viability: 0.7 + Math.random() * 0.3,
              germinated: false,
              timeCreated: state.time
            });
          }
          newSpores = newSporeArray;
        } else if (targetSporeCount < currentCount) {
          // Remove excess spores (keep the earliest ones)
          newSpores = state.spores.slice(0, targetSporeCount);
        }
      }

      return {
        parameters: newParameters,
        spores: newSpores
      };
    }),

    reset: () => {
      const { parameters } = get();
      set({
        isPlaying: false,
        time: 0,
        spores: createInitialSpores(Math.round(12 + (parameters.sporeDensity - 1.0) * 10)),
        hyphae: [],
        roots: createInitialRoots(),
        nutrients: []
      });
    },

    exportData: () => {
      const state = get();
      const data = {
        timestamp: new Date().toISOString(),
        simulationTime: state.time,
        parameters: state.parameters,
        stats: {
          sporeCount: state.spores.length,
          hyphalCount: state.hyphae.length,
          rootCount: state.roots.length,
          nutrientCount: state.nutrients.length,
          colonizedRoots: state.roots.filter(r => r.colonized).length
        }
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `amf-simulation-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },

    addPlant: (position) => {
      const state = get();
      const newPosition = position || {
        x: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 8
      };

      const newRoot: Root = {
        id: `root-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        position: new THREE.Vector3(newPosition.x, 0, newPosition.z),
        length: 2 + Math.random() * 2,
        size: 0.06 + Math.random() * 0.04,
        health: 0.7 + Math.random() * 0.3,
        colonized: false,
        branchPoints: []
      };

      set({ roots: [...state.roots, newRoot] });
    },

    removePlant: (rootId) => {
      const state = get();
      set({
        roots: state.roots.filter(root => root.id !== rootId),
        // Also remove any hyphae connected to this root
        hyphae: state.hyphae.filter(hypha => !hypha.connectedToRoot || 
          state.roots.some(root => root.id !== rootId && root.colonized)),
        // Remove nutrients flowing to/from this root
        nutrients: state.nutrients.filter(nutrient => {
          const removedRoot = state.roots.find(root => root.id === rootId);
          if (!removedRoot) return true;

          const rootCenter = removedRoot.position.clone();
          rootCenter.y -= removedRoot.length * 0.5;

          return nutrient.source.distanceTo(rootCenter) > 0.5 && 
                 nutrient.target.distanceTo(rootCenter) > 0.5;
        })
      });
    }
  }))
);

// Subscribe to parameter changes to regenerate spores
useSimulation.subscribe(
  (state) => state.parameters.sporeDensity,
  (sporeDensity, previousSporeDensity) => {
    if (sporeDensity !== previousSporeDensity) {
      const state = useSimulation.getState();
      if (!state.isPlaying) {
        state.updateSpores(createInitialSpores(Math.round(12 + (sporeDensity - 1.0) * 10)));
      }
    }
  }
);