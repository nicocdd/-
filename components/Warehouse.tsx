import React from 'react';
import { Crop } from '../types';

interface WarehouseProps {
  isOpen: boolean;
  onClose: () => void;
  crops: Crop[];
  gold: number;
  onSelectSeed: (id: string) => void;
}

const Warehouse: React.FC<WarehouseProps> = ({ isOpen, onClose, crops, gold, onSelectSeed }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[160] w-[500px] animate-[popIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
        <div className="bg-[#8B4513] p-2 rounded-[3rem] border-b-[12px] border-[#5D2E0E] shadow-2xl relative">
          
          {/* Parchment Background */}
          <div className="bg-[#fdf2e9] rounded-[2.5rem] border-4 border-[#3E1E09] p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-30 pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-6 relative">
              <h3 className="text-2xl font-black text-[#5D2E0E] tracking-widest flex items-center gap-3">
                <span className="text-3xl">🎒</span> 播种仓库
              </h3>
              <button onClick={onClose} className="w-10 h-10 bg-red-500 text-white rounded-full font-black border-4 border-white shadow-lg hover:bg-red-600 transition-colors">✕</button>
            </div>

            <div className="max-h-[420px] overflow-y-auto pr-2 flex flex-col gap-4 scrollbar-custom">
              {crops.map((crop) => {
                const canAfford = gold >= crop.buyPrice;
                return (
                  <button
                    key={crop.id}
                    disabled={!canAfford}
                    onClick={() => onSelectSeed(crop.id)}
                    className={`
                      group w-full rounded-2xl border-4 transition-all relative overflow-hidden flex items-center p-4
                      ${canAfford 
                        ? 'bg-white/80 border-[#FDE68A] hover:border-yellow-500 shadow-md hover:scale-[1.02]' 
                        : 'bg-gray-200 border-gray-300 opacity-60 grayscale cursor-not-allowed'}
                    `}
                  >
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border-4 border-[#5D2E0E]/10 shadow-inner mr-6">
                      <span className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform">{crop.emoji}</span>
                    </div>

                    <div className="flex-1 flex flex-col items-start gap-1">
                      <span className="font-black text-[#3E1E09] text-xl">{crop.name}</span>
                      <div className="flex gap-2">
                        <span className="bg-amber-100 px-2 py-0.5 rounded-full text-xs font-black text-amber-800 border border-amber-200">💰 {crop.buyPrice}</span>
                        <span className="bg-emerald-100 px-2 py-0.5 rounded-full text-xs font-black text-emerald-800 border border-emerald-200">⭐ {crop.xp} XP</span>
                      </div>
                    </div>

                    {canAfford && (
                      <div className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">点击播种 ></div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center">
               <button 
                 onClick={onClose}
                 className="px-12 py-3 bg-gradient-to-b from-yellow-300 to-orange-500 rounded-2xl border-b-4 border-orange-800 text-[#3E1E09] font-black text-lg shadow-xl hover:brightness-110 active:translate-y-1 transition-all"
               >
                 完成准备
               </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes popIn {
          from { transform: translate(-50%, -40%) scale(0.8); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        .scrollbar-custom::-webkit-scrollbar { width: 8px; }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: #8B4513; border-radius: 10px; border: 2px solid #fdf2e9; }
      `}</style>
    </>
  );
};

export default Warehouse;