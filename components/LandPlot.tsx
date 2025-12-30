import React, { useState, useEffect, useCallback } from 'react';
import { LandState, LandStatus, Crop } from '../types';
import { CROPS } from '../constants';

interface LandPlotProps {
  land: LandState;
  onPlant: () => void;
  onHarvest: (landId: number) => void;
  onAction: (landId: number, action: 'water' | 'weed' | 'pest' | 'shovel') => void;
  availableCrops: Crop[];
  gold: number;
}

const LandPlot: React.FC<LandPlotProps> = ({ land, onPlant, onHarvest, onAction, availableCrops, gold }) => {
  const [progress, setProgress] = useState(0);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const currentCrop = land.cropId ? CROPS.find(c => c.id === land.cropId) : null;

  const calculateStatus = useCallback(() => {
    if (land.status === LandStatus.GROWING && land.startTime && currentCrop) {
      const elapsedSeconds = (Date.now() - land.startTime) / 1000;
      const pct = Math.min(100, (elapsedSeconds / currentCrop.growthTime) * 100);
      setProgress(pct);
    }
  }, [land.status, land.startTime, currentCrop]);

  useEffect(() => {
    let interval: number | undefined;
    if (land.status === LandStatus.GROWING) {
      interval = window.setInterval(calculateStatus, 500);
      calculateStatus();
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [land.status, calculateStatus]);

  const isReady = progress >= 100 && land.status === LandStatus.GROWING;

  const handlePlotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (land.status === LandStatus.EMPTY) {
      onPlant();
    } else {
      setShowActionMenu(true);
    }
  };

  return (
    <div className="relative group select-none">
      {/* 土壤地块 (等轴侧拟物化) */}
      <div 
        onClick={handlePlotClick}
        className={`
          relative w-36 h-36 rounded-3xl transition-all duration-300 transform-gpu
          hover:scale-105 active:scale-95 cursor-pointer shadow-[0_15px_40px_rgba(0,0,0,0.6)] overflow-hidden
          border-x-[4px] border-[#3E1E09]
          ${land.status === LandStatus.EMPTY 
            ? 'bg-[#5D2E0E] border-b-[20px] border-[#1a0f08]' 
            : 'bg-[#78350F] border-b-[20px] border-[#2D1102]'}
          ${isReady ? 'ring-8 ring-yellow-400/50 shadow-[0_0_60px_rgba(234,179,8,0.8)] brightness-110' : ''}
        `}
      >
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

        <div className="h-full flex flex-col items-center justify-center relative">
          {/* 异常状态标识 */}
          <div className="absolute top-4 flex gap-2 z-10">
            {land.isBuggy && <span className="text-3xl drop-shadow-md animate-bounce">🐛</span>}
            {land.isWeedy && <span className="text-3xl drop-shadow-md animate-pulse">🌿</span>}
            {land.isDry && <span className="text-3xl drop-shadow-md opacity-80">🏜️</span>}
          </div>

          {currentCrop && (
            <div className="relative flex flex-col items-center">
              <div className={`
                text-8xl transition-all duration-700 filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)]
                ${isReady ? 'scale-110 animate-[landBounce_1s_infinite]' : 'scale-50 opacity-90 animate-pulse'}
              `}
              style={{ transform: 'translateY(-20px)' }}>
                {currentCrop.emoji}
              </div>
              
              {/* 进度条 */}
              {!isReady && land.status === LandStatus.GROWING && (
                <div className="absolute -bottom-4 w-24 h-4 bg-[#3E1E09] rounded-full border-2 border-amber-900 shadow-inner overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-green-500 shadow-[0_0_10px_rgba(52,211,153,0.8)] transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 快捷操作菜单 */}
      {showActionMenu && (
        <>
          <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm" onClick={() => setShowActionMenu(false)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[160] animate-[popIn_0.3s_ease-out]">
            <div className="bg-[#8B4513] p-2 rounded-[3rem] border-b-[10px] border-[#5D2E0E] shadow-2xl">
              <div className="bg-[#fdf2e9] rounded-[2.5rem] p-6 border-4 border-[#3E1E09] flex gap-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10 pointer-events-none"></div>
                
                {isReady ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onHarvest(land.id); setShowActionMenu(false); }}
                    className="skeuo-btn w-28 h-28 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 shadow-xl flex flex-col items-center justify-center border-4 border-white hover:scale-110 transition-all active:translate-y-1"
                  >
                    <span className="text-5xl">🧺</span>
                    <span className="text-sm font-black text-[#5D2E0E] mt-1 tracking-widest">收获</span>
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button onClick={() => { onAction(land.id, 'water'); setShowActionMenu(false); }} className="skeuo-btn w-20 h-20 rounded-2xl bg-sky-100 border-4 border-sky-400 shadow-md text-4xl flex items-center justify-center hover:bg-sky-200 transition-all">💧</button>
                    <button onClick={() => { onAction(land.id, 'weed'); setShowActionMenu(false); }} className="skeuo-btn w-20 h-20 rounded-2xl bg-green-100 border-4 border-green-400 shadow-md text-4xl flex items-center justify-center hover:bg-green-200 transition-all">🌿</button>
                    <button onClick={() => { onAction(land.id, 'pest'); setShowActionMenu(false); }} className="skeuo-btn w-20 h-20 rounded-2xl bg-red-100 border-4 border-red-400 shadow-md text-4xl flex items-center justify-center hover:bg-red-200 transition-all">🧪</button>
                    <button onClick={() => { onAction(land.id, 'shovel'); setShowActionMenu(false); }} className="skeuo-btn w-20 h-20 rounded-2xl bg-gray-100 border-4 border-gray-400 shadow-md text-4xl flex items-center justify-center hover:bg-gray-200 transition-all">⛏️</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes landBounce {
          0%, 100% { transform: translateY(-20px) scale(1.1); }
          50% { transform: translateY(-30px) scale(1.15); }
        }
        @keyframes popIn {
          from { transform: translate(-50%, -40%) scale(0.8); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default LandPlot;