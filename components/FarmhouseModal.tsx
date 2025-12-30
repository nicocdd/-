
import React, { useState } from 'react';
import { PlayerState } from '../types';
import { FARMHOUSE_UPGRADES, DECORATIONS } from '../constants';

interface FarmhouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerState;
  onUpgrade: () => void;
  onBuyDecoration: (id: string) => void;
}

const FarmhouseModal: React.FC<FarmhouseModalProps> = ({ isOpen, onClose, player, onUpgrade, onBuyDecoration }) => {
  const [activeTab, setActiveTab] = useState<'upgrade' | 'decoration'>('upgrade');

  if (!isOpen) return null;

  const currentLevelInfo = FARMHOUSE_UPGRADES.find(u => u.level === player.farmhouseLevel);
  const nextLevelInfo = FARMHOUSE_UPGRADES.find(u => u.level === player.farmhouseLevel + 1);

  return (
    <>
      <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[160] w-[500px] animate-[popIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
        <div className="bg-[#5D2E0E] rounded-[2.5rem] border-[10px] border-[#3E1E09] shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="bg-gradient-to-b from-[#78350F] to-[#5D2E0E] p-6 border-b-4 border-[#3E1E09] relative">
            <h2 className="text-2xl font-black text-amber-50 text-center tracking-widest drop-shadow-md">
              庄园管理中心
            </h2>
            <button onClick={onClose} className="absolute top-6 right-6 text-amber-100/50 hover:text-white text-2xl transition-colors">✕</button>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#3E1E09] p-2 gap-2">
            <button 
              onClick={() => setActiveTab('upgrade')}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'upgrade' ? 'bg-[#78350F] text-amber-50 shadow-inner' : 'bg-transparent text-amber-100/40 hover:text-amber-100'}`}
            >
              升级房屋
            </button>
            <button 
              onClick={() => setActiveTab('decoration')}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'decoration' ? 'bg-[#78350F] text-amber-50 shadow-inner' : 'bg-transparent text-amber-100/40 hover:text-amber-100'}`}
            >
              装扮家园
            </button>
          </div>

          {/* Content */}
          <div className="p-6 bg-[#4a2b16] h-[400px] overflow-y-auto custom-scrollbar">
            {activeTab === 'upgrade' ? (
              <div className="flex flex-col items-center gap-6">
                <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center border-4 border-[#3E1E09] shadow-2xl animate-bounce">
                  <span className="text-6xl">🏡</span>
                </div>
                
                <div className="text-center">
                  <h3 className="text-amber-100 text-xl font-black">{currentLevelInfo?.label}</h3>
                  <p className="text-amber-200/60 text-xs mt-1">当前房屋等级: Lv.{player.farmhouseLevel}</p>
                </div>

                {nextLevelInfo ? (
                  <div className="w-full bg-[#3E1E09]/50 rounded-2xl p-4 border border-[#3E1E09] flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-200 text-sm font-bold">下一级：{nextLevelInfo.label}</span>
                      <span className="text-emerald-400 font-black text-sm">+{nextLevelInfo.energyBonus} 体力上限</span>
                    </div>
                    <div className="h-[1px] bg-amber-900/50 w-full"></div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💰</span>
                        <span className="text-amber-50 font-black">{nextLevelInfo.cost}</span>
                      </div>
                      <button 
                        onClick={onUpgrade}
                        disabled={player.gold < nextLevelInfo.cost}
                        className={`px-8 py-3 rounded-xl font-black text-sm shadow-lg transition-all active:scale-95 ${player.gold >= nextLevelInfo.cost ? 'bg-gradient-to-b from-yellow-400 to-orange-600 text-white border-b-4 border-orange-800' : 'bg-stone-500 text-stone-300 border-b-4 border-stone-700 opacity-50 cursor-not-allowed'}`}
                      >
                        立即升级
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-emerald-400 font-black text-center mt-4">
                    恭喜！你的房屋已达到最高等级 ✨
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {DECORATIONS.map(item => {
                  const isOwned = player.unlockedDecorations.includes(item.id);
                  return (
                    <div key={item.id} className="bg-[#3E1E09]/50 rounded-2xl p-4 border border-[#3E1E09] flex items-center gap-4 transition-transform hover:scale-[1.02]">
                      <div className="w-16 h-16 bg-amber-50 rounded-xl flex items-center justify-center text-3xl border-2 border-[#3E1E09] shadow-lg shrink-0">
                        {item.emoji}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-amber-50 font-black text-sm">{item.name}</h4>
                        <p className="text-amber-200/40 text-[10px]">{item.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {isOwned ? (
                          <span className="text-emerald-400 font-black text-[10px] bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-900/50">已拥有</span>
                        ) : (
                          <>
                            <div className="flex items-center gap-1">
                              <span className="text-sm">💰</span>
                              <span className="text-amber-50 font-black text-sm">{item.price}</span>
                            </div>
                            <button 
                              onClick={() => onBuyDecoration(item.id)}
                              disabled={player.gold < item.price}
                              className={`px-4 py-1.5 rounded-lg font-black text-[10px] transition-all active:scale-95 ${player.gold >= item.price ? 'bg-amber-100 text-[#5D2E0E] hover:bg-white' : 'bg-stone-600 text-stone-400 cursor-not-allowed opacity-50'}`}
                            >
                              购买
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Deco */}
          <div className="h-6 bg-[#3E1E09] w-full"></div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3E1E09; border-radius: 10px; }
      `}</style>
    </>
  );
};

export default FarmhouseModal;
