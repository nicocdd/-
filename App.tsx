import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import BottomDock from './components/BottomDock';
import SidePanel from './components/SidePanel';
import LandPlot from './components/LandPlot';
import Farmhouse from './components/Farmhouse';
import WeatherEffects from './components/WeatherEffects';
import Warehouse from './components/Warehouse';
import FarmhouseModal from './components/FarmhouseModal';
import { Tree, Decoration, Fence } from './components/Environment';
import { LandState, LandStatus, PlayerState, WeatherType } from './types';
import { CROPS, INITIAL_GOLD, INITIAL_LAND_COUNT, XP_PER_LEVEL, FARMHOUSE_UPGRADES, DECORATIONS } from './constants';

const STORAGE_KEY_PLAYER = 'dream_manor_v1';
const STORAGE_KEY_LANDS = 'dream_lands_v1';

const App: React.FC = () => {
  const [player, setPlayer] = useState<PlayerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PLAYER);
    if (saved) return JSON.parse(saved);
    return {
      gold: INITIAL_GOLD,
      silver: 329994,
      gems: 500,
      energy: 145,
      maxEnergy: 200,
      vip: 1,
      level: 1,
      xp: 0,
      maxXp: XP_PER_LEVEL,
      name: '菲利克斯',
      farmhouseLevel: 1,
      unlockedDecorations: []
    };
  });

  const [lands, setLands] = useState<LandState[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANDS);
    if (saved) return JSON.parse(saved);
    return Array.from({ length: INITIAL_LAND_COUNT }, (_, i) => ({
      id: i,
      status: LandStatus.EMPTY,
      cropId: null,
      startTime: null,
      isBuggy: false,
      isWeedy: false,
      isDry: false,
    }));
  });

  const [activeSeedId, setActiveSeedId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isWarehouseOpen, setIsWarehouseOpen] = useState(false);
  const [isFarmhouseOpen, setIsFarmhouseOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherType>(WeatherType.SUNNY);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PLAYER, JSON.stringify(player));
    localStorage.setItem(STORAGE_KEY_LANDS, JSON.stringify(lands));
  }, [player, lands]);

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePlant = (landId: number) => {
    if (!activeSeedId) {
      notify("请先打开背包选择种子 🎒", 'error');
      setIsWarehouseOpen(true);
      return;
    }
    const crop = CROPS.find(c => c.id === activeSeedId);
    if (!crop || player.gold < crop.buyPrice) {
      notify("金币不足！", 'error');
      return;
    }
    if (player.energy < 5) {
      notify("体力不足！", 'error');
      return;
    }
    setPlayer(prev => ({ 
      ...prev, 
      gold: prev.gold - crop.buyPrice, 
      energy: Math.max(0, prev.energy - 5) 
    }));
    setLands(prev => prev.map(l => l.id === landId ? { 
      ...l, 
      status: LandStatus.GROWING, 
      cropId: activeSeedId, 
      startTime: Date.now()
    } : l));
    notify(`播种 ${crop.name} 🌱`);
  };

  const handleHarvest = (landId: number) => {
    const land = lands.find(l => l.id === landId);
    if (!land?.cropId) return;
    const crop = CROPS.find(c => c.id === land.cropId);
    if (!crop) return;
    setPlayer(prev => {
        let newXp = prev.xp + crop.xp;
        let newLevel = prev.level;
        let newMaxXp = prev.maxXp;
        if (newXp >= newMaxXp) {
            newXp -= newMaxXp;
            newLevel += 1;
            newMaxXp += 50;
        }
        return { 
          ...prev, 
          gold: prev.gold + crop.sellPrice,
          xp: newXp,
          level: newLevel,
          maxXp: newMaxXp
        };
    });
    setLands(prev => prev.map(l => l.id === landId ? { 
      ...l, 
      status: LandStatus.EMPTY, 
      cropId: null, 
      startTime: null,
      isBuggy: false,
      isWeedy: false,
      isDry: false
    } : l));
    notify(`收获 ${crop.name}！✨`);
  };

  const handleAction = (landId: number, action: 'water' | 'weed' | 'pest' | 'shovel') => {
    if (player.energy < 2) {
        notify("体力不足！", 'error');
        return;
    }

    setLands(prev => prev.map(l => {
      if (l.id === landId) {
        if (action === 'water') return { ...l, isDry: false };
        if (action === 'weed') return { ...l, isWeedy: false };
        if (action === 'pest') return { ...l, isBuggy: false };
        if (action === 'shovel') return { ...l, status: LandStatus.EMPTY, cropId: null, startTime: null };
      }
      return l;
    }));
    setPlayer(prev => ({ ...prev, energy: Math.max(0, prev.energy - 2) }));
    notify("动作执行成功！");
  };

  const handleUpgradeFarmhouse = () => {
    const nextLevel = player.farmhouseLevel + 1;
    const upgradeInfo = FARMHOUSE_UPGRADES.find(u => u.level === nextLevel);
    if (!upgradeInfo) return;

    if (player.gold >= upgradeInfo.cost) {
      setPlayer(prev => ({
        ...prev,
        gold: prev.gold - upgradeInfo.cost,
        farmhouseLevel: nextLevel,
        maxEnergy: prev.maxEnergy + upgradeInfo.energyBonus
      }));
      notify(`庄园升级：${upgradeInfo.label}！🎉`);
    } else {
      notify("金币不足，无法升级！", 'error');
    }
  };

  const handleBuyDecoration = (id: string) => {
    const item = DECORATIONS.find(d => d.id === id);
    if (!item) return;

    if (player.gold >= item.price) {
      setPlayer(prev => ({
        ...prev,
        gold: prev.gold - item.price,
        unlockedDecorations: [...prev.unlockedDecorations, id]
      }));
      notify(`购买装饰：${item.name}！🎈`);
    } else {
      notify("金币不足！", 'error');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#87CEEB]">
      {/* 经典背景分层 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#B0E0E6] to-[#98FB98]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-[#228B22]/20 rounded-t-[100%] blur-[80px]"></div>
        
        {/* 云朵 */}
        <div className="absolute top-[10%] left-[10%] text-6xl opacity-30 animate-float">☁️</div>
        <div className="absolute top-[15%] right-[20%] text-8xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>☁️</div>
      </div>
      
      <WeatherEffects weather={weather} />
      <TopBar player={player} weather={weather} />
      <SidePanel />
      
      <BottomDock 
        onOpenWarehouse={() => setIsWarehouseOpen(true)} 
        onOpenFarmhouse={() => setIsFarmhouseOpen(true)}
        onSelectTool={(tool) => {
            setActiveTool(tool);
            setActiveSeedId(null);
            notify(`选中工具：${tool} 🛠️`);
        }}
      />

      {/* 种子/工具选中提示 */}
      {(activeSeedId || activeTool) && (
        <div className="fixed bottom-40 left-1/2 -translate-x-1/2 z-[90] animate-bounce pointer-events-none">
           <div className="bg-white/95 px-8 py-3 rounded-full border-4 border-amber-600 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center gap-4">
              <span className="text-4xl drop-shadow-md">
                {activeSeedId ? CROPS.find(c => c.id === activeSeedId)?.emoji : '🛠️'}
              </span>
              <span className="text-xl font-black text-amber-950">
                {activeSeedId ? `正在播种：${CROPS.find(c => c.id === activeSeedId)?.name}` : `使用工具：${activeTool}`}
              </span>
              <button onClick={(e) => { e.stopPropagation(); setActiveSeedId(null); setActiveTool(null); }} className="pointer-events-auto ml-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">✕</button>
           </div>
        </div>
      )}

      <main className="relative z-10 pt-44 pb-48 flex flex-col items-center">
        <div className="relative">
          {/* 环境建筑 */}
          <Farmhouse 
            level={player.farmhouseLevel} 
            onClick={() => setIsFarmhouseOpen(true)} 
          />
          
          <Tree style={{ top: '-180px', left: '-550px' }} />
          <Tree style={{ top: '-100px', left: '-450px', transform: 'scale(0.85)' }} />
          
          {/* 解锁的装饰 */}
          {player.unlockedDecorations.includes('scarecrow') && <Decoration emoji="🧑‍🌾" style={{ bottom: '150px', left: '-450px' }} />}
          {player.unlockedDecorations.includes('doghouse') && <Decoration emoji="🏠" style={{ top: '200px', left: '-500px' }} />}
          {player.unlockedDecorations.includes('well') && <Decoration emoji="🪣" style={{ top: '100px', right: '-550px' }} />}
          {player.unlockedDecorations.includes('flowerpot') && <Decoration emoji="🪴" style={{ bottom: '100px', right: '-400px' }} />}
          {player.unlockedDecorations.includes('swing') && <Decoration emoji="🎠" style={{ top: '450px', left: '-580px' }} />}

          <Decoration emoji="🧺" style={{ bottom: '250px', left: '-350px' }} />
          <Decoration emoji="🚜" style={{ top: '400px', right: '-450px' }} />
          
          <Fence orientation="h" style={{ top: '350px', left: '-400px' }} />
          <Fence orientation="v" style={{ top: '350px', left: '-400px' }} />

          {/* 土地网格 - 2.5D Isometric */}
          <div className="perspective-container flex items-center justify-center p-24">
            <div className="isometric-grid grid grid-cols-4 gap-4 p-12 rounded-[4rem] bg-[#5D2E0E]/40 border-b-[35px] border-[#3E1E09]/70 shadow-[0_60px_120px_rgba(0,0,0,0.6)] relative">
              <div className="absolute inset-0 bg-[#3E1E09]/80 rounded-[4rem] -z-10 shadow-inner"></div>
              {lands.map(land => (
                <div key={land.id} style={{ transform: 'translateZ(20px)' }}>
                  <LandPlot 
                    land={land}
                    gold={player.gold}
                    availableCrops={CROPS}
                    onPlant={() => handlePlant(land.id)}
                    onHarvest={handleHarvest}
                    onAction={handleAction} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Warehouse 
        isOpen={isWarehouseOpen} 
        onClose={() => setIsWarehouseOpen(false)}
        crops={CROPS}
        gold={player.gold}
        onSelectSeed={(id) => {
          setActiveSeedId(id);
          setActiveTool(null);
          setIsWarehouseOpen(false);
          notify(`准备播种 ✨`);
        }}
      />

      <FarmhouseModal 
        isOpen={isFarmhouseOpen}
        onClose={() => setIsFarmhouseOpen(false)}
        player={player}
        onUpgrade={handleUpgradeFarmhouse}
        onBuyDecoration={handleBuyDecoration}
      />

      {notification && (
        <div className="fixed top-40 left-1/2 -translate-x-1/2 z-[200] animate-[popIn_0.3s_ease-out]">
           <div className="px-12 py-4 bg-white/95 border-4 border-[#8B4513] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] text-[#3E1E09] font-black text-2xl tracking-widest uppercase">
             {notification.msg}
           </div>
        </div>
      )}
    </div>
  );
};

export default App;