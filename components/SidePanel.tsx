import React from 'react';

const SidePanel: React.FC = () => {
  const friends = [
    { name: '隔壁老王', lvl: 42, icon: '👴', status: 'ready' },
    { name: '农场小美', lvl: 35, icon: '👩', status: 'dry' },
    { name: '偷菜高手', lvl: 28, icon: '🥷', status: 'buggy' },
    { name: '新邻居', lvl: 12, icon: '🧒', status: 'ok' },
  ];

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[50] hidden 2xl:block">
      <div className="bg-[#8B4513] rounded-[2.5rem] border-4 border-[#5D2E0E] p-5 shadow-[0_15px_40px_rgba(0,0,0,0.4)] flex flex-col items-center gap-5 min-w-[260px] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 rounded-[2rem] pointer-events-none"></div>
        
        <h3 className="font-black text-amber-50 tracking-[0.3em] text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] border-b-4 border-[#5D2E0E] w-full text-center pb-3">我的邻居</h3>

        <div className="flex flex-col gap-3 w-full max-h-[500px] overflow-y-auto scrollbar-custom pr-2">
          {friends.map((f, i) => (
            <div key={i} className="group relative p-3 rounded-2xl bg-amber-50/5 border-2 border-white/10 hover:bg-amber-50/20 transition-all cursor-pointer shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-white shadow-md flex items-center justify-center text-3xl">
                      {f.icon}
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="text-sm font-black text-amber-50 truncate drop-shadow-sm">{f.name}</span>
                    <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-tighter">等级 {f.lvl}</span>
                  </div>
                  
                  {/* 状态动作图标 */}
                  <div className="flex gap-1 shrink-0">
                    {f.status === 'ready' && <span className="text-xl animate-bounce drop-shadow-sm" title="可以偷菜">🍎</span>}
                    {f.status === 'dry' && <span className="text-xl animate-pulse drop-shadow-sm" title="需要浇水">💧</span>}
                    {f.status === 'buggy' && <span className="text-xl drop-shadow-sm" title="需要除虫">🐛</span>}
                  </div>
                </div>
            </div>
          ))}
        </div>

        <button className="skeuo-btn w-full py-3 bg-gradient-to-b from-yellow-300 to-orange-500 rounded-2xl text-[#3E1E09] font-black text-sm shadow-xl hover:brightness-110 tracking-widest uppercase">
          查找邻居
        </button>
      </div>
    </div>
  );
};

export default SidePanel;