
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import LandPlot from './components/LandPlot';
import { LandState, LandStatus, PlayerState } from './types';
import { CROPS, INITIAL_GOLD, INITIAL_LAND_COUNT } from './constants';

const STORAGE_KEY_LANDS = 'tiny_farm_lands';
const STORAGE_KEY_PLAYER = 'tiny_farm_player';

const App: React.FC = () => {
  // --- State Initialization ---
  const [lands, setLands] = useState<LandState[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANDS);
    if (saved) return JSON.parse(saved);
    return Array.from({ length: INITIAL_LAND_COUNT }, (_, i) => ({
      id: i,
      status: LandStatus.EMPTY,
      cropId: null,
      startTime: null
    }));
  });

  const [player, setPlayer] = useState<PlayerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PLAYER);
    if (saved) return JSON.parse(saved);
    return {
      gold: INITIAL_GOLD,
      seeds: {}
    };
  });

  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error' | 'info'} | null>(null);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANDS, JSON.stringify(lands));
  }, [lands]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PLAYER, JSON.stringify(player));
  }, [player]);

  // --- Helpers ---
  const notify = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Game Actions ---
  const handlePlant = (landId: number, cropId: string) => {
    const crop = CROPS.find(c => c.id === cropId);
    if (!crop) return;

    if (player.gold < crop.buyPrice) {
      notify("Not enough gold!", 'error');
      return;
    }

    setPlayer(prev => ({ ...prev, gold: prev.gold - crop.buyPrice }));
    setLands(prev => prev.map(l => 
      l.id === landId 
        ? { ...l, status: LandStatus.GROWING, cropId, startTime: Date.now() } 
        : l
    ));
    notify(`Planted ${crop.name}!`, 'success');
  };

  const handleHarvest = (landId: number) => {
    const land = lands.find(l => l.id === landId);
    if (!land || !land.cropId) return;

    const crop = CROPS.find(c => c.id === land.cropId);
    if (!crop) return;

    // Logic: Is it actually ready? Double check in parent state
    const elapsedSeconds = (Date.now() - (land.startTime || 0)) / 1000;
    if (elapsedSeconds < crop.growthTime) {
      notify("Not ready yet!", 'error');
      return;
    }

    setPlayer(prev => ({ ...prev, gold: prev.gold + crop.sellPrice }));
    setLands(prev => prev.map(l => 
      l.id === landId 
        ? { ...l, status: LandStatus.EMPTY, cropId: null, startTime: null } 
        : l
    ));
    notify(`Harvested ${crop.name}! +${crop.sellPrice} Gold`, 'success');
  };

  const resetGame = () => {
    if (confirm("Reset all progress?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // --- Real-time Check (Global Sync) ---
  // Every 5 seconds, ensure ready states are synchronized 
  // (Mostly relevant for background calculations or status refreshes)
  useEffect(() => {
    const checkInterval = setInterval(() => {
      setLands(prevLands => prevLands.map(l => {
        if (l.status === LandStatus.GROWING && l.startTime && l.cropId) {
          const crop = CROPS.find(c => c.id === l.cropId);
          if (crop) {
            const elapsed = (Date.now() - l.startTime) / 1000;
            // Note: In a larger app, we'd update status to READY here.
            // For this UI, the individual tiles handle their local display of "READY"
            // based on the same startTime check.
          }
        }
        return l;
      }));
    }, 5000);
    return () => clearInterval(checkInterval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header gold={player.gold} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {/* Game Info / HUD */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Your Farm</h2>
            <p className="text-slate-500 font-medium">Click on a plot to start planting.</p>
          </div>
          
          <button 
            onClick={resetGame}
            className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest border border-slate-300 rounded px-2 py-1 hover:border-red-200"
          >
            Reset Progress
          </button>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8">
          {lands.map(land => (
            <LandPlot 
              key={land.id}
              land={land}
              gold={player.gold}
              availableCrops={CROPS}
              onPlant={handlePlant}
              onHarvest={handleHarvest}
            />
          ))}
        </div>

        {/* Log / Instructions */}
        <div className="mt-12 bg-white/50 border border-slate-200 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
            <span>📖</span> Farmer's Handbook
          </h3>
          <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
            <li>Buy seeds with gold. Better seeds take longer but sell for more.</li>
            <li>Crops grow in <strong>real time</strong> even if you leave the page.</li>
            <li>Wait for the gold glow and "READY" badge to harvest.</li>
            <li>Harvesting returns the profit to your gold balance.</li>
          </ul>
        </div>
      </main>

      {/* Persistent Notification Toast */}
      {notification && (
        <div className={`
          fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-2xl border-2 z-50 animate-in slide-in-from-right-full
          ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : ''}
          ${notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : ''}
          ${notification.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
        `}>
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {notification.type === 'success' ? '✨' : notification.type === 'error' ? '⚠️' : 'ℹ️'}
            </span>
            <span className="font-bold">{notification.msg}</span>
          </div>
        </div>
      )}

      <footer className="py-6 text-center text-slate-400 text-xs font-medium uppercase tracking-tighter">
        &copy; {new Date().getFullYear()} Mini Farm Demo &bull; Core Loop MVP
      </footer>
    </div>
  );
};

export default App;
