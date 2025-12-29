
import React from 'react';

interface DisplayProps {
  expression: string;
  result: string;
  isAI?: boolean;
  explanation?: string;
}

const Display: React.FC<DisplayProps> = ({ expression, result, isAI, explanation }) => {
  return (
    <div className="w-full p-6 bg-slate-900/50 backdrop-blur-md rounded-t-3xl border-b border-slate-800 flex flex-col justify-end items-end min-h-[160px] gap-2 transition-all">
      <div className="w-full text-right overflow-x-auto no-scrollbar">
        <span className="text-slate-400 text-lg font-medium whitespace-nowrap">
          {expression || '0'}
        </span>
      </div>
      <div className="w-full text-right overflow-x-auto no-scrollbar">
        <span className="text-white text-4xl font-bold font-mono tracking-wider whitespace-nowrap">
          {result || '0'}
        </span>
      </div>
      {isAI && explanation && (
        <div className="w-full mt-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <p className="text-indigo-300 text-xs leading-relaxed italic">
            AI: {explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default Display;
