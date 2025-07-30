import * as THREE from "three";
import { Spore, Hypha, Root, SimulationParameters } from "./types";

export function updateGrowth(
  spores: Spore[],
  hyphae: Hypha[],
  roots: Root[],
  parameters: SimulationParameters,
  deltaTime: number
): Hypha[] {
  const newHyphae = [...hyphae];
  
  // Process spore germination
  spores.forEach(spore => {
    if (!spore.germinated && shouldGerminate(spore, parameters)) {
      spore.germinated = true;
      
      // Create new hypha from germinated spore
      const newHypha: Hypha = {
        id: `hypha-${Date.now()}-${Math.random()}`,
        segments: [spore.position.clone()],
        growthDirection: getInitialGrowthDirection(spore, roots),
        active: true,
        maturity: 0,
        connectedToRoot: false,
        branchPoints: [],
        parentSporeId: spore.id
      };
      
      newHyphae.push(newHypha);
    }
  });
  
  // Update existing hyphae growth
  const branches: Hypha[] = [];
  newHyphae.forEach(hypha => {
    if (hypha.active) {
      updateHyphalGrowth(hypha, roots, parameters, deltaTime);
      checkRootConnection(hypha, roots, parameters);
      
      // Check for new branches
      if (shouldBranch(hypha, parameters)) {
        const newBranch = createBranch(hypha, parameters);
        if (newBranch) {
          branches.push(newBranch);
        }
      }
    }
  });
  
  // Add new branches to the collection
  newHyphae.push(...branches);
  
  return newHyphae;
}

function shouldGerminate(spore: Spore, parameters: SimulationParameters): boolean {
  const moistureThreshold = 0.2;
  const viabilityThreshold = 0.3;
  const randomFactor = Math.random();
  
  // Enhanced germination based on environmental conditions
  const moistureFactor = Math.max(0, (parameters.soilMoisture - moistureThreshold) / (1 - moistureThreshold));
  const nutrientFactor = Math.max(0, (parameters.nutrients - 0.2) / 0.8);
  const colonizationBonus = (parameters.colonizationRate ?? 0.5) * 2;
  
  const germinationChance = (0.008 + colonizationBonus * 0.005) * moistureFactor * nutrientFactor;
  
  return (
    parameters.soilMoisture > moistureThreshold &&
    spore.viability > viabilityThreshold &&
    randomFactor < germinationChance
  );
}

function getInitialGrowthDirection(spore: Spore, roots: Root[]): THREE.Vector3 {
  // Find nearest root and grow towards it
  let nearestRoot: Root | null = null;
  let minDistance = Infinity;
  
  roots.forEach(root => {
    const distance = spore.position.distanceTo(root.position);
    if (distance < minDistance) {
      minDistance = distance;
      nearestRoot = root;
    }
  });
  
  if (nearestRoot) {
    const direction = new THREE.Vector3()
      .subVectors(nearestRoot.position, spore.position)
      .normalize();
    
    // Add some randomness to prevent perfectly straight lines
    direction.add(new THREE.Vector3(
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.3
    )).normalize();
    
    return direction;
  }
  
  // Default random direction if no roots found
  return new THREE.Vector3(
    Math.random() - 0.5,
    -Math.random() * 0.5, // Slight downward bias
    Math.random() - 0.5
  ).normalize();
}

function updateHyphalGrowth(
  hypha: Hypha,
  roots: Root[],
  parameters: SimulationParameters,
  deltaTime: number
): void {
  const baseGrowthSpeed = (parameters.growthRate ?? 1.0) * deltaTime * 0.8; // Slower for cleaner growth
  const currentTip = hypha.segments[hypha.segments.length - 1];
  
  // Controlled growth speed
  const moistureFactor = Math.max(0.4, parameters.soilMoisture);
  const nutrientFactor = Math.max(0.4, parameters.nutrients);
  const maturityBonus = 1 + hypha.maturity * 0.3;
  
  const adjustedGrowthSpeed = baseGrowthSpeed * moistureFactor * nutrientFactor * maturityBonus;
  
  // Update growth direction based on nearby roots
  updateGrowthDirection(hypha, roots, parameters);
  
  // Calculate new segment position with smoother movement
  const newPosition = currentTip.clone().add(
    hypha.growthDirection.clone().multiplyScalar(adjustedGrowthSpeed)
  );
  
  // Minimal environmental variation for cleaner paths
  applyEnvironmentalFactors(newPosition, hypha, parameters);
  
  // Add new segment every few frames for smoother lines
  const shouldAddSegment = hypha.segments.length < 3 || 
    currentTip.distanceTo(newPosition) > 0.08;
  
  if (shouldAddSegment) {
    hypha.segments.push(newPosition);
  } else {
    // Update the tip position for smoother growth
    hypha.segments[hypha.segments.length - 1].copy(newPosition);
  }
  
  hypha.maturity = Math.min(1, hypha.maturity + deltaTime * 0.03);
  
  // Branching is now handled in the main update loop
  
  // Reasonable length limit
  const maxLength = (parameters.maxHyphalLength ?? 5.0) * (1 + parameters.nutrients * 0.3);
  if (calculateHyphalLength(hypha) > maxLength) {
    hypha.active = false;
  }
}

function updateGrowthDirection(
  hypha: Hypha,
  roots: Root[],
  parameters: SimulationParameters
): void {
  const currentTip = hypha.segments[hypha.segments.length - 1];
  let attractionForce = new THREE.Vector3();
  
  // Stronger, more focused attraction to nearby roots
  roots.forEach(root => {
    const distance = currentTip.distanceTo(root.position);
    if (distance < 4 && !hypha.connectedToRoot) { // Increased range but only for unconnected hyphae
      const direction = new THREE.Vector3()
        .subVectors(root.position, currentTip)
        .normalize();
      
      const strength = Math.pow(1 / (distance + 0.1), 1.5) * root.health;
      attractionForce.add(direction.multiplyScalar(strength));
    }
  });
  
  // Stronger directional control
  if (attractionForce.length() > 0) {
    attractionForce.normalize();
    hypha.growthDirection.lerp(attractionForce, 0.2); // Increased blending for more direct paths
    hypha.growthDirection.normalize();
  }
  
  // Minimal randomness for cleaner paths
  hypha.growthDirection.add(new THREE.Vector3(
    (Math.random() - 0.5) * 0.03,
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.03
  ));
  hypha.growthDirection.normalize();
}

function applyEnvironmentalFactors(
  position: THREE.Vector3,
  hypha: Hypha,
  parameters: SimulationParameters
): void {
  // Minimal environmental effects for cleaner growth patterns
  const moistureFactor = parameters.soilMoisture;
  if (moistureFactor < 0.3) {
    // Slight downward bias in very dry conditions
    position.y -= (0.3 - moistureFactor) * 0.02;
  }
  
  // Very subtle nutrient effects
  const nutrientFactor = parameters.nutrients;
  if (nutrientFactor > 0.8) {
    // Minimal enhancement to avoid messy patterns
    const enhancement = new THREE.Vector3(
      (Math.random() - 0.5) * 0.01,
      Math.random() * 0.005,
      (Math.random() - 0.5) * 0.01
    );
    position.add(enhancement);
  }
}

function shouldBranch(hypha: Hypha, parameters: SimulationParameters): boolean {
  const segmentCount = hypha.segments.length;
  const branchingFactor = parameters.branchingFactor ?? 1.5;
  const colonizationRate = parameters.colonizationRate ?? 0.5;
  
  // Controlled branching for cleaner networks
  const branchProbability = branchingFactor * colonizationRate * 0.001;
  const maturityBonus = hypha.maturity * 0.3;
  const nutrientBonus = parameters.nutrients * 0.2;
  
  const finalProbability = branchProbability * (1 + maturityBonus + nutrientBonus);
  
  return (
    segmentCount > 12 && // Longer segments before branching
    segmentCount % 15 === 0 && // Less frequent checks
    hypha.maturity > 0.6 && // Only mature hyphae branch
    Math.random() < finalProbability
  );
}

function createBranch(hypha: Hypha, parameters: SimulationParameters): Hypha | null {
  const branchPoint = hypha.segments[hypha.segments.length - 1].clone();
  hypha.branchPoints.push(branchPoint);
  
  // Create new hypha branch
  const branchDirection = hypha.growthDirection.clone();
  branchDirection.applyAxisAngle(
    new THREE.Vector3(0, 1, 0),
    (Math.random() - 0.5) * Math.PI * 0.6
  );
  
  const newBranch: Hypha = {
    id: `branch-${Date.now()}-${Math.random()}`,
    segments: [branchPoint.clone()],
    growthDirection: branchDirection,
    active: true,
    maturity: hypha.maturity * 0.7, // Inherit some maturity
    connectedToRoot: false,
    branchPoints: [],
    parentSporeId: hypha.parentSporeId
  };
  
  console.log(`🌱 Hypha ${hypha.id} created branch at position ${branchPoint.x.toFixed(2)}, ${branchPoint.y.toFixed(2)}, ${branchPoint.z.toFixed(2)}`);
  
  return newBranch;
}

function checkRootConnection(
  hypha: Hypha,
  roots: Root[],
  parameters: SimulationParameters
): void {
  if (hypha.connectedToRoot) return;
  
  const currentTip = hypha.segments[hypha.segments.length - 1];
  const connectionDistance = (parameters.connectionDistance ?? 0.5) * 1.5; // Increased connection range
  
  roots.forEach(root => {
    const distance = currentTip.distanceTo(root.position);
    if (distance < connectionDistance) {
      hypha.connectedToRoot = true;
      root.colonized = true;
      
      console.log(`🍄 Hypha ${hypha.id} successfully colonized root ${root.id}! Distance: ${distance.toFixed(2)}`);
    }
  });
}

function calculateHyphalLength(hypha: Hypha): number {
  let length = 0;
  for (let i = 1; i < hypha.segments.length; i++) {
    length += hypha.segments[i - 1].distanceTo(hypha.segments[i]);
  }
  return length;
}
