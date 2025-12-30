
import React from 'react';

interface FarmhouseProps {
  level: number;
  onClick: () => void;
}

const Farmhouse: React.FC<FarmhouseProps> = ({ level, onClick }) => {
  // Visual variations based on level
  const houseColor = level >= 4 ? 'bg-gradient-to-br from-indigo-100 to-purple-200' : 
                    level >= 3 ? 'bg-gradient-to-br from-amber-50 to-amber-100' : 
                    'bg-[#fdf2f2]';
  const roofColor = level >= 4 ? 'bg-gradient-to-b from-purple-800 to-indigo-950' : 
                   level >= 3 ? 'bg-gradient-to-b from-red-800 to-red-950' : 
                   'bg-[#8B4513]';
  const borderColor = level >= 4 ? 'border-indigo-900' : 'border-[#5D2E0E]';

  return (
    <div 
      onClick={onClick}
      className="absolute top-[-320px] right-[-180px] z-0 cursor-pointer group select-none scale-110 active:scale-105 transition-transform"
    >
      <div className="relative">
        {/* Level Banner */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full border-2 border-amber-800 text-[10px] font-black text-amber-900 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
          管理中心 (点击进入)
        </div>

        {/* The House Body */}
        <div className={`w-56 h-48 ${houseColor} border-[10px] ${borderColor} rounded-[3rem] shadow-2xl relative transition-colors duration-1000`}>
          {/* Roof */}
          <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-[120%] h-32 ${roofColor} rounded-[4rem] border-[8px] border-[#3E1E09] shadow-lg transition-colors duration-1000`}>
            {/* Chimney - level 2+ */}
            {level >= 2 && (
              <div className="absolute top-0 right-10 w-8 h-12 bg-amber-900 border-x-4 border-t-4 border-[#3E1E09] -translate-y-full">
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-400/40 rounded-full animate-pulse blur-sm"></div>
              </div>
            )}
          </div>

          {/* Windows */}
          <div className="absolute top-12 left-8 w-12 h-12 bg-sky-100 border-4 border-[#3E1E09] rounded-xl shadow-inner flex items-center justify-center overflow-hidden">
             <div className="w-full h-[2px] bg-[#3E1E09]/20"></div>
             <div className="h-full w-[2px] bg-[#3E1E09]/20 absolute"></div>
          </div>
          {level >= 3 && (
            <div className="absolute top-12 right-8 w-12 h-12 bg-sky-100 border-4 border-[#3E1E09] rounded-xl shadow-inner flex items-center justify-center overflow-hidden">
               <div className="w-full h-[2px] bg-[#3E1E09]/20"></div>
               <div className="h-full w-[2px] bg-[#3E1E09]/20 absolute"></div>
            </div>
          )}

          {/* Door */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-20 bg-amber-700 border-x-4 border-t-4 border-[#3E1E09] rounded-t-xl group-hover:brightness-110 transition-all">
             {/* Handle */}
             <div className="absolute top-1/2 right-2 w-2 h-2 bg-yellow-400 rounded-full border border-black/20 shadow-sm"></div>
          </div>
        </div>

        {/* Ground Glow */}
        <div className="absolute -left-12 bottom-4 w-24 h-24 bg-emerald-500/20 blur-2xl rounded-full pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Farmhouse;
