import { useState } from "react";
import { useSimulation } from "../lib/stores/useSimulation";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Settings2, 
  Plus, 
  Minus, 
  ChevronDown, 
  ChevronUp,
  Zap,
  Droplets,
  Leaf,
  Activity
} from "lucide-react";
import { useAudio } from "../lib/stores/useAudio";

export function SimulationControls() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { 
    isPlaying, 
    speed, 
    parameters,
    roots,
    spores,
    hyphae,
    nutrients,
    togglePlay, 
    setSpeed, 
    updateParameters,
    reset,
    exportData,
    addPlant,
    removePlant
  } = useSimulation();
  
  const { playHit, playSuccess } = useAudio();

  const handlePlay = () => {
    togglePlay();
    playHit();
  };

  const handleReset = () => {
    reset();
    playSuccess();
  };

  const handleExport = () => {
    exportData();
    playSuccess();
  };

  const handleAddPlant = () => {
    addPlant();
    playHit();
  };

  const handleRemovePlant = () => {
    if (roots.length > 1) {
      const lastRoot = roots[roots.length - 1];
      removePlant(lastRoot.id);
      playHit();
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 left-6 z-20">
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-xl border-0"
          size="lg"
        >
          <Settings2 className="w-5 h-5 mr-2" />
          Simulation Controls
          <ChevronUp className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-20">
      <Card className="w-96 bg-gradient-to-br from-white via-green-50 to-emerald-50 backdrop-blur-sm border-2 border-emerald-200 shadow-2xl">
        <CardHeader className="pb-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              MycoColonize Controls
            </CardTitle>
            <Button
              onClick={() => setIsExpanded(false)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Status Bar */}
          <div className="flex gap-2 mt-2 text-xs">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              <Activity className="w-3 h-3 mr-1" />
              {isPlaying ? "Running" : "Paused"}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              Plants: {roots.length}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              Hyphae: {hyphae.length}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              Spores: {spores.length}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 p-4">
          {/* Main Controls */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={handlePlay} 
              variant={isPlaying ? "default" : "outline"} 
              size="sm" 
              className={`flex items-center gap-2 text-sm ${
                isPlaying 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "border-green-600 text-green-600 hover:bg-green-50"
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            
            <Button 
              onClick={handleReset} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 text-sm border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            
            <Button 
              onClick={handleAddPlant} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 text-sm border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <Plus className="w-4 h-4" />
              Add Plant
            </Button>
            
            <Button 
              onClick={handleRemovePlant} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 text-sm border-red-600 text-red-600 hover:bg-red-50"
              disabled={roots.length <= 1}
            >
              <Minus className="w-4 h-4" />
              Remove
            </Button>
          </div>

          <Separator />

          {/* Speed Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                Simulation Speed
              </Label>
              <Badge variant="outline" className="text-xs font-mono">
                {speed.toFixed(1)}x
              </Badge>
            </div>
            <Slider
              value={[speed]}
              onValueChange={(value) => setSpeed(value[0])}
              min={0.1}
              max={5}
              step={0.1}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Environmental Parameters */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Environmental Conditions</Label>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Spore Density */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Spore Density
                  </Label>
                  <span className="text-xs font-mono text-gray-800">
                    {parameters.sporeDensity.toFixed(1)}
                  </span>
                </div>
                <Slider
                  value={[parameters.sporeDensity]}
                  onValueChange={(value) => updateParameters({ sporeDensity: value[0] })}
                  min={0.1}
                  max={3}
                  step={0.1}
                  className="w-full h-2"
                />
              </div>
              
              {/* Soil Moisture */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    Moisture
                  </Label>
                  <span className="text-xs font-mono text-gray-800">
                    {(parameters.soilMoisture * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  value={[parameters.soilMoisture]}
                  onValueChange={(value) => updateParameters({ soilMoisture: value[0] })}
                  min={0.1}
                  max={1}
                  step={0.05}
                  className="w-full h-2"
                />
              </div>
              
              {/* Nutrients */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Nutrients
                  </Label>
                  <span className="text-xs font-mono text-gray-800">
                    {(parameters.nutrients * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  value={[parameters.nutrients]}
                  onValueChange={(value) => updateParameters({ nutrients: value[0] })}
                  min={0.1}
                  max={1}
                  step={0.05}
                  className="w-full h-2"
                />
              </div>
              
              {/* Root Health */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600 flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-green-500" />
                    Root Health
                  </Label>
                  <span className="text-xs font-mono text-gray-800">
                    {(parameters.rootHealth * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  value={[parameters.rootHealth]}
                  onValueChange={(value) => updateParameters({ rootHealth: value[0] })}
                  min={0.1}
                  max={1}
                  step={0.05}
                  className="w-full h-2"
                />
              </div>
            </div>
          </div>

          {/* Export Data Button */}
          <div className="flex justify-center pt-2">
            <Button 
              onClick={handleExport} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 text-xs px-4 py-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Download className="w-3 h-3" />
              Export Simulation Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}