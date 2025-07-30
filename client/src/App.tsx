import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Eye, EyeOff, HelpCircle } from "lucide-react";
import "@fontsource/inter";
import { AMFSimulation } from "./components/AMFSimulation";
import { SimulationControls } from "./components/SimulationControls";
import { EducationalPanel } from "./components/EducationalPanel";
import { Legend } from "./components/Legend";
import { LoadingScreen } from "./components/LoadingScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient();

// Define control keys for the simulation
const controls = [
  { name: "rotateLeft", keys: ["KeyA", "ArrowLeft"] },
  { name: "rotateRight", keys: ["KeyD", "ArrowRight"] },
  { name: "zoomIn", keys: ["KeyW", "ArrowUp"] },
  { name: "zoomOut", keys: ["KeyS", "ArrowDown"] },
  { name: "pause", keys: ["Space"] },
  { name: "reset", keys: ["KeyR"] },
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showUnderground, setShowUnderground] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <QueryClientProvider client={queryClient}>
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      </QueryClientProvider>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        background: '#1a1a1a',
        position: 'relative'
      }}>
        {/* Credits at top center */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <p className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">
            By Yousif Aladawi and Jayden Huang
          </p>
        </div>
        
        <KeyboardControls map={controls}>
          {/* Surface View */}
          <div style={{ 
            position: 'relative', 
            height: showUnderground ? '50vh' : '100vh',
            overflow: 'hidden',
            transition: 'height 0.3s ease'
          }}>
            <Canvas
              shadows
              camera={{
                position: [0, 12, 15],
                fov: 45,
                near: 0.1,
                far: 1000
              }}
              gl={{
                antialias: true,
                powerPreference: "default"
              }}
            >
              <color attach="background" args={["#87CEEB"]} />
              
              {/* Lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[10, 20, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={50}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
              />
              
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={50}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
                target={[0, 0, 0]}
              />
              
              <Suspense fallback={null}>
                <AMFSimulation viewMode="surface" />
              </Suspense>
            </Canvas>
            
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
              Surface View - Drag to rotate, scroll to zoom
            </div>
            
            {/* Control Buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                onClick={() => setShowLegend(!showLegend)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                size="sm"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Legend
              </Button>
              <Button
                onClick={() => setShowUnderground(!showUnderground)}
                className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
                size="sm"
              >
                {showUnderground ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showUnderground ? 'Hide' : 'Show'} Underground
              </Button>
            </div>
          </div>

          {/* Underground Cross-Section View */}
          {showUnderground && (
            <div style={{ 
              position: 'relative', 
              height: '50vh',
              overflow: 'hidden',
              borderTop: '2px solid #654321'
            }}>
              <Canvas
                shadows
                camera={{
                  position: [0, 0, 15],
                  fov: 45,
                  near: 0.1,
                  far: 1000
                }}
                gl={{
                  antialias: true,
                  powerPreference: "default"
                }}
              >
                <color attach="background" args={["#654321"]} />
                
                {/* Lighting optimized for underground view */}
                <ambientLight intensity={0.6} />
                <directionalLight
                  position={[5, 5, 10]}
                  intensity={0.8}
                  castShadow
                />
                
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={5}
                  maxDistance={30}
                  minPolarAngle={0}
                  maxPolarAngle={Math.PI}
                  target={[0, -2, 0]}
                />
                
                <Suspense fallback={null}>
                  <AMFSimulation viewMode="underground" />
                </Suspense>
              </Canvas>
              
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                Underground Cross-Section - Drag to rotate, scroll to zoom
              </div>
            </div>
          )}
          
          {/* Compact UI Overlays */}
          <SimulationControls />
          <EducationalPanel />
          <Legend isOpen={showLegend} onClose={() => setShowLegend(false)} />
        </KeyboardControls>
      </div>
    </QueryClientProvider>
  );
}

export default App;
