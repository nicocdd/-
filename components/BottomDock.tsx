import React from 'react';

interface BottomDockProps {
  onOpenWarehouse: () => void;
  onOpenFarmhouse: () => void;
  onSelectTool: (tool: string) => void;
}

const BottomDock: React.FC<BottomDockProps> = ({ onOpenWarehouse, onOpenFarmhouse, onSelectTool }) => {
  const tools = [
    { id: 'home', icon: '🏠', label: '家园', color: 'from-blue-400 to-blue-600', action: onOpenFarmhouse },
    { id: 'shovel', icon: '⛏️', label: '铲地', color: 'from-gray-400 to-gray-600', action: () => onSelectTool('shovel') },
    { id: 'bag', icon: '🎒', label: '背包', color: 'from-amber-600 to-amber-800', action: onOpenWarehouse },
    { id: 'water', icon: '💧', label: '洒水', color: 'from-sky-400 to-sky-600', action: () => onSelectTool('water') },
    { id: 'pest', icon: '🧪', label: '杀虫', color: 'from-red-400 to-red-600', action: () => onSelectTool('pest') },
    { id: 'weed', icon: '🖐️', label: '除草', color: 'from-green-500 to-green-700', action: () => onSelectTool('weed') },
    { id: 'harvest', icon: '🧺', label: '收获', color: 'from-yellow-400 to-yellow-600', action: () => onSelectTool('harvest') },
    { id: 'warehouse', icon: '🛖', label: '仓库', color: 'from-amber-800 to-amber-950', action: onOpenWarehouse },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-6 pointer-events-none">
      <div className="flex justify-center items-end max-w-[1300px] mx-auto">
        <div className="pointer-events-auto flex items-end gap-1.5 bg-[#8B4513] p-4 rounded-t-[3.5rem] border-x-[12px] border-t-[12px] border-[#5D2E0E] shadow-[0_-25px_60px_rgba(0,0,0,0.4)] relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 pointer-events-none rounded-t-[2.5rem]"></div>
          
          {tools.map((tool, i) => (
            <button 
              key={tool.id} 
              onClick={tool.action}
              className="group skeuo-btn flex flex-col items-center gap-1 hover:-translate-y-5 transition-all"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-4xl group-hover:brightness-125`}>
                {tool.icon}
              </div>
              <span className="text-[12px] font-black text-amber-50 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-widest px-1 uppercase">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomDock;