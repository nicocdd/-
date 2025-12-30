import React from 'react';
import { PlayerState, WeatherType } from '../types';

interface TopBarProps {
  player: PlayerState;
  weather: WeatherType;
}

const TopBar: React.FC<TopBarProps> = ({ player, weather }) => {
  const xpPercent = (player.xp / player.maxXp) * 100;

  const rightIcons = [
    { label: '商店', icon: '🏪' },
    { label: '任务', icon: '📜' },
    { label: '天气', icon: '🌦️' },
    { label: '设置', icon: '⚙️' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] p-4 pointer-events-none">
      <div className="flex justify-between items-start max-w-[1500px] mx-auto pointer-events-auto">
        
        {/* 左侧角色状态栏 (木质边框，金边装饰) */}
        <div className="relative group">
          <div className="bg-[#8B4513] p-2 rounded-[2.5rem] shadow-[0_8px_0_#5D2E0E] border-4 border-[#FFD700] flex items-center gap-4 min-w-[420px] relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 rounded-[2rem]"></div>
            
            {/* 头像 */}
            <div className="relative shrink-0">
               <div className="w-20 h-20 bg-amber-100 rounded-full border-4 border-[#FFD700] overflow-hidden shadow-inner">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`} alt="avatar" />
               </div>
               <div className="absolute -bottom-1 -right-1 bg-gradient-to-b from-yellow-300 to-orange-500 text-white text-[12px] font-black px-3 py-0.5 rounded-full border-2 border-white shadow-lg">VIP {player.vip}</div>
               <div className="absolute -top-2 -left-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border-2 border-white text-white font-black text-xs shadow-md">{player.level}</div>
            </div>

            <div className="flex-1 flex flex-col gap-1.5 pr-2">
              <div className="flex justify-between items-center">
                <span className="text-amber-50 font-black text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{player.name}</span>
                <span className="text-yellow-400 font-bold text-xs tracking-widest">LV. {player.level}</span>
              </div>
              
              {/* 经验条 */}
              <div className="relative h-3 bg-[#3E1E09] rounded-full border border-amber-900/50 shadow-inner overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-green-400 to-emerald-600 transition-all duration-500" style={{ width: `${xpPercent}%` }}></div>
              </div>

              {/* 资源显示 */}
              <div className="grid grid-cols-3 gap-1 mt-0.5">
                 <div className="bg-[#5D2E0E]/80 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-white/20">
                    <span className="text-sm">💰</span>
                    <span className="text-[11px] font-black text-yellow-400 truncate">{player.gold}</span>
                 </div>
                 <div className="bg-[#5D2E0E]/80 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-white/20">
                    <span className="text-sm">💎</span>
                    <span className="text-[11px] font-black text-blue-300 truncate">{player.gems}</span>
                 </div>
                 <div className="bg-[#5D2E0E]/80 px-2 py-0.5 rounded-lg flex items-center gap-1 border border-white/20">
                    <span className="text-sm">⚡</span>
                    <span className="text-[11px] font-black text-emerald-400 truncate">{player.energy}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧功能按钮 (圆形，带拟物化效果) */}
        <div className="flex gap-4">
           {rightIcons.map((item, idx) => (
             <button key={idx} className="skeuo-btn flex flex-col items-center gap-1 group">
                <div className="w-14 h-14 bg-gradient-to-b from-[#f9d976] to-[#f39c12] rounded-full border-4 border-[#d35400] flex items-center justify-center text-3xl shadow-lg group-hover:brightness-110">
                  {item.icon}
                </div>
                <span className="text-xs font-black text-[#3E1E09] bg-white/90 px-3 rounded-full shadow-md border border-amber-200">{item.label}</span>
             </button>
           ))}
        </div>

      </div>
    </div>
  );
};

export default TopBar;