import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BookOpen, X, Info, Lightbulb, Microscope } from "lucide-react";

export function EducationalPanel() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="absolute top-2 right-2 z-10"
        variant="default"
        size="sm"
      >
        <BookOpen className="w-3 h-3 mr-1" />
        Learn
      </Button>
    );
  }

  return (
    <div className="absolute top-2 right-2 z-10 w-80 max-h-[90vh] overflow-hidden">
      <Card className="bg-white/95 backdrop-blur-sm border border-gray-200">
        <CardHeader className="pb-2 py-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-800">
            AMF Education Center
          </CardTitle>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[75vh] py-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-2">
              <TabsTrigger value="overview" className="text-xs px-2 py-1">
                <Info className="w-3 h-3 mr-1" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="process" className="text-xs px-2 py-1">
                <Microscope className="w-3 h-3 mr-1" />
                Process
              </TabsTrigger>
              <TabsTrigger value="benefits" className="text-xs px-2 py-1">
                <Lightbulb className="w-3 h-3 mr-1" />
                Benefits
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">What are AMF?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Arbuscular Mycorrhizal Fungi (AMF) are beneficial soil fungi that form 
                  symbiotic relationships with over 90% of land plants. These microscopic 
                  partners create extensive underground networks that dramatically improve 
                  plant health and ecosystem resilience.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Visual Legend</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-600">Plant Roots</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-sm text-gray-600">Fungal Spores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-sm text-gray-600">Hyphal Network</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm text-gray-600">Nutrient Flow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span className="text-sm text-gray-600">Symbiotic Connection</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="process" className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Colonization Process</h3>
                <div className="space-y-3">
                  <div className="border-l-2 border-orange-500 pl-3">
                    <Badge variant="outline" className="mb-1">Step 1</Badge>
                    <p className="text-sm text-gray-600">
                      <strong>Spore Germination:</strong> Fungal spores in soil detect root exudates 
                      and begin to germinate, sending out hyphal threads.
                    </p>
                  </div>
                  
                  <div className="border-l-2 border-yellow-500 pl-3">
                    <Badge variant="outline" className="mb-1">Step 2</Badge>
                    <p className="text-sm text-gray-600">
                      <strong>Root Contact:</strong> Hyphae grow through soil toward plant roots, 
                      guided by chemical signals and nutrients.
                    </p>
                  </div>
                  
                  <div className="border-l-2 border-purple-500 pl-3">
                    <Badge variant="outline" className="mb-1">Step 3</Badge>
                    <p className="text-sm text-gray-600">
                      <strong>Colonization:</strong> Fungi penetrate root cells and form arbuscules 
                      (tree-like structures) for nutrient exchange.
                    </p>
                  </div>
                  
                  <div className="border-l-2 border-blue-500 pl-3">
                    <Badge variant="outline" className="mb-1">Step 4</Badge>
                    <p className="text-sm text-gray-600">
                      <strong>Network Formation:</strong> Extensive hyphal networks connect multiple 
                      plants, creating underground communication systems.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Ecosystem Benefits</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-green-50 rounded border-l-2 border-green-500">
                    <p className="text-sm font-medium text-green-800">Enhanced Nutrition</p>
                    <p className="text-xs text-green-600">
                      Increases phosphorus, nitrogen, and water uptake by up to 300%
                    </p>
                  </div>
                  
                  <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-500">
                    <p className="text-sm font-medium text-blue-800">Soil Structure</p>
                    <p className="text-xs text-blue-600">
                      Improves soil aggregation, porosity, and erosion resistance
                    </p>
                  </div>
                  
                  <div className="p-2 bg-purple-50 rounded border-l-2 border-purple-500">
                    <p className="text-sm font-medium text-purple-800">Stress Tolerance</p>
                    <p className="text-xs text-purple-600">
                      Helps plants survive drought, salt stress, and heavy metals
                    </p>
                  </div>
                  
                  <div className="p-2 bg-orange-50 rounded border-l-2 border-orange-500">
                    <p className="text-sm font-medium text-orange-800">Multi-Plant Networks</p>
                    <p className="text-xs text-orange-600">
                      Connect multiple plants for nutrient sharing and chemical communication
                    </p>
                  </div>
                  
                  <div className="p-2 bg-indigo-50 rounded border-l-2 border-indigo-500">
                    <p className="text-sm font-medium text-indigo-800">Ecosystem Resilience</p>
                    <p className="text-xs text-indigo-600">
                      Creates robust underground networks that support plant communities
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Environmental Impact</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  AMF networks can sequester significant amounts of carbon in soil, 
                  reduce the need for chemical fertilizers, and support biodiversity. 
                  Understanding and protecting these relationships is crucial for 
                  sustainable agriculture and ecosystem health.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
