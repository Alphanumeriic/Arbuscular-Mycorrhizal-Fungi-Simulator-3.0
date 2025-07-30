
import React, { useEffect, useState } from 'react';
import { Progress } from './ui/progress';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentCredit, setCurrentCredit] = useState(0);

  const credits = [
    "AMF Simulation - Mycorrhizal Network Visualization",
    "Developed with React Three Fiber",
    "Educational Biology Simulation",
    "Interactive 3D Environment",
    "Real-time Fungal Growth Modeling"
  ];

  useEffect(() => {
    const duration = 5000; // 5 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const progressStep = 100 / steps;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + progressStep;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(onLoadingComplete, 200); // Small delay before transitioning
          return 100;
        }
        return newProgress;
      });
    }, interval);

    // Cycle through credits
    const creditTimer = setInterval(() => {
      setCurrentCredit(prev => (prev + 1) % credits.length);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(creditTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-900 via-amber-900 to-brown-900 flex flex-col items-center justify-center z-50">
      {/* Credits at top center */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <p className="text-white text-lg font-medium">
          By Yousif Aladawi and Jayden Huang
        </p>
      </div>
      
      <div className="text-center space-y-8 max-w-md px-6">
        {/* Logo/Title */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            🍄 AMF Simulation
          </h1>
          <p className="text-lg text-green-200">
            Arbuscular Mycorrhizal Fungi Network
          </p>
        </div>

        {/* Credits */}
        <div className="h-16 flex items-center justify-center">
          <p className="text-amber-200 text-sm animate-pulse transition-all duration-500">
            {credits[currentCredit]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-white text-sm">
            Loading... {Math.round(progress)}%
          </p>
        </div>

        {/* Animated Elements */}
        <div className="flex justify-center space-x-4 text-2xl animate-bounce">
          <span className="animate-pulse delay-0">🌱</span>
          <span className="animate-pulse delay-150">🍄</span>
          <span className="animate-pulse delay-300">🌿</span>
        </div>
      </div>
    </div>
  );
};
