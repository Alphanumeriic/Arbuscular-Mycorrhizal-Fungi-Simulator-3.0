import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, Info } from "lucide-react";

interface LegendProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Legend({ isOpen, onClose }: LegendProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-20">
      <Card className="w-64 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
        <CardHeader className="pb-2 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Visual Legend
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 py-2 text-xs">
          {/* Plants */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Plants & Roots</h4>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span>Plant markers (surface view)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-700 rounded"></div>
              <span>Root systems</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-600 rounded"></div>
              <span>Colonized roots</span>
            </div>
          </div>

          {/* Fungi */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Fungal Network</h4>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Spores</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-orange-400 rounded"></div>
              <span>Hyphal threads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-red-500 rounded"></div>
              <span>Active connections</span>
            </div>
          </div>

          {/* Nutrients */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Nutrient Exchange</h4>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Carbon flow (to fungi)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Phosphorus flow (to plants)</span>
            </div>
          </div>

          {/* Environment */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Environment</h4>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-200 rounded"></div>
              <span>Surface soil</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-700 rounded"></div>
              <span>Underground layers</span>
            </div>
          </div>

          <div className="mt-3 p-2 bg-blue-50 rounded border-l-2 border-blue-400">
            <p className="text-xs text-blue-700">
              Use controls to add plants and adjust environmental conditions to see how AMF networks adapt and grow.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}