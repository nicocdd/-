
import React from 'react';

interface HeaderProps {
  gold: number;
}

const Header: React.FC<HeaderProps> = ({ gold }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10 py-4 px-6 border-b border-slate-200 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-2xl">
          🌱
        </div>
        <h1 className="text-xl font-bold text-slate-800">Mini Farm</h1>
      </div>
      <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-full">
        <span className="text-yellow-600 font-bold text-lg">💰</span>
        <span className="font-mono text-xl font-bold text-slate-700">{gold}</span>
      </div>
    </header>
  );
};

export default Header;
