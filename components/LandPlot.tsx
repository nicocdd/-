
import React, { useState, useEffect, useCallback } from 'react';
import { LandState, LandStatus, Crop } from '../types';
import { CROPS } from '../constants';

interface LandPlotProps {
  land: LandState;
  onPlant: (landId: number, cropId: string) => void;
  onHarvest: (landId: number) => void;
  availableCrops: Crop[];
  gold: number;
}

const LandPlot: React.FC<LandPlotProps> = ({ land, onPlant, onHarvest, availableCrops, gold }) => {
  const [progress, setProgress] = useState(0);
  const [showSeedMenu, setShowSeedMenu] = useState(false);
  const currentCrop = land.cropId ? CROPS.find(c => c.id === land.cropId) : null;

  const calculateStatus = useCallback(() => {
    if (land.status === LandStatus.GROWING && land.startTime && currentCrop) {
      const elapsedSeconds = (Date.now() - land.startTime) / 1000;
      const pct = Math.min(100, (elapsedSeconds / currentCrop.growthTime) * 100);
      setProgress(pct);

      if (pct >= 100) {
        // Technically this should be handled by the parent or an effect, 
        // but for a demo we can let the UI detect completion.
      }
    }
  }, [land.status, land.startTime, currentCrop]);

  useEffect(() => {
    let interval: number | undefined;
    if (land.status === LandStatus.GROWING) {
      interval = window.setInterval(calculateStatus, 1000);
      calculateStatus(); // initial check
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [land.status, calculateStatus]);

  // Derived status for UI
  const isReady = progress >= 100 && land.status === LandStatus.GROWING;

  const handlePlotClick = () => {
    if (land.status === LandStatus.EMPTY) {
      setShowSeedMenu(!showSeedMenu);
    } else if (isReady) {
      onHarvest(land.id);
    }
  };

  const handlePlantSeed = (cropId: string) => {
    onPlant(land.id, cropId);
    setShowSeedMenu(false);
  };

  return (
    <div className="relative group">
      {/* Land Tile */}
      <div 
        onClick={handlePlotClick}
        className={`
          relative w-full aspect-square rounded-2xl border-4 cursor-pointer transition-all duration-300 transform active:scale-95
          ${land.status === LandStatus.EMPTY ? 'bg-amber-800/20 border-amber-900/10 hover:bg-amber-800/30' : ''}
          ${land.status === LandStatus.GROWING && !isReady ? 'bg-amber-900/40 border-amber-900/20' : ''}
          ${isReady ? 'bg-amber-900/60 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : ''}
        `}
      >
        {/* Soil Texture Simulation */}
        <div className="absolute inset-2 border border-dashed border-white/5 rounded-xl pointer-events-none"></div>

        {/* Content */}
        <div className="h-full flex flex-col items-center justify-center p-2 relative overflow-hidden">
          {land.status === LandStatus.EMPTY && (
            <div className="flex flex-col items-center opacity-40 group-hover:opacity-100 transition-opacity">
              <span className="text-4xl">🕳️</span>
              <span className="text-xs font-bold text-amber-900 mt-2">EMPTY</span>
            </div>
          )}

          {currentCrop && land.status !== LandStatus.EMPTY && (
            <>
              <div className={`text-5xl transition-all duration-1000 ${isReady ? 'scale-125' : 'scale-75 animate-pulse'}`}>
                {currentCrop.emoji}
              </div>
              
              {!isReady && (
                <div className="absolute bottom-4 left-4 right-4 h-2 bg-black/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-400 transition-all duration-1000" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {isReady && (
                <div className="absolute top-2 right-2 animate-bounce">
                  <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    READY!
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Seed Selection Popover */}
      {showSeedMenu && (
        <div className="absolute z-20 top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-3 grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Select Seed</span>
            <button onClick={() => setShowSeedMenu(false)} className="text-slate-400 hover:text-slate-600">×</button>
          </div>
          {availableCrops.map(crop => (
            <button
              key={crop.id}
              disabled={gold < crop.buyPrice}
              onClick={(e) => {
                e.stopPropagation();
                handlePlantSeed(crop.id);
              }}
              className={`
                flex items-center justify-between p-2 rounded-lg border text-sm transition-colors
                ${gold >= crop.buyPrice 
                  ? 'hover:bg-green-50 border-slate-100 hover:border-green-200 cursor-pointer' 
                  : 'opacity-50 grayscale cursor-not-allowed border-transparent bg-slate-50'}
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{crop.emoji}</span>
                <div className="text-left">
                  <div className="font-bold text-slate-700">{crop.name}</div>
                  <div className="text-[10px] text-slate-500">{crop.growthTime}s growth</div>
                </div>
              </div>
              <div className="flex items-center gap-1 font-bold text-yellow-600">
                <span>{crop.buyPrice}</span>
                <span className="text-[10px]">💰</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LandPlot;
