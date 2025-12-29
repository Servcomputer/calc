
import React from 'react';
import { ButtonConfig } from '../types';

interface KeypadProps {
  onKeyPress: (value: string, type: string) => void;
  mode: 'standard' | 'scientific';
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, mode }) => {
  const standardButtons: ButtonConfig[] = [
    { label: 'AC', value: 'AC', type: 'action', className: 'text-amber-500' },
    { label: 'DEL', value: 'DEL', type: 'action', className: 'text-amber-500' },
    { label: '%', value: '%', type: 'operator', className: 'text-indigo-400' },
    { label: '÷', value: '/', type: 'operator', className: 'text-indigo-400' },
    
    { label: '7', value: '7', type: 'number' },
    { label: '8', value: '8', type: 'number' },
    { label: '9', value: '9', type: 'number' },
    { label: '×', value: '*', type: 'operator', className: 'text-indigo-400' },
    
    { label: '4', value: '4', type: 'number' },
    { label: '5', value: '5', type: 'number' },
    { label: '6', value: '6', type: 'number' },
    { label: '-', value: '-', type: 'operator', className: 'text-indigo-400' },
    
    { label: '1', value: '1', type: 'number' },
    { label: '2', value: '2', type: 'number' },
    { label: '3', value: '3', type: 'number' },
    { label: '+', value: '+', type: 'operator', className: 'text-indigo-400' },
    
    { label: '0', value: '0', type: 'number', className: 'col-span-2' },
    { label: '.', value: '.', type: 'number' },
    { label: '=', value: '=', type: 'action', className: 'bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 shadow-lg shadow-indigo-900/40' },
  ];

  const scientificButtons: ButtonConfig[] = [
    { label: 'sin', value: 'sin(', type: 'function' },
    { label: 'cos', value: 'cos(', type: 'function' },
    { label: 'tan', value: 'tan(', type: 'function' },
    { label: 'log', value: 'log10(', type: 'function' },
    { label: 'ln', value: 'log(', type: 'function' },
    { label: '√', value: 'sqrt(', type: 'function' },
    { label: '^', value: '^', type: 'operator' },
    { label: 'π', value: 'PI', type: 'special' },
    { label: 'e', value: 'E', type: 'special' },
    { label: '(', value: '(', type: 'operator' },
    { label: ')', value: ')', type: 'operator' },
    { label: '!', value: '!', type: 'operator' },
  ];

  const allButtons = mode === 'scientific' ? [...scientificButtons, ...standardButtons] : standardButtons;

  return (
    <div className={`grid gap-3 p-6 ${mode === 'scientific' ? 'grid-cols-4' : 'grid-cols-4'}`}>
      {allButtons.map((btn, idx) => (
        <button
          key={`${btn.value}-${idx}`}
          onClick={() => onKeyPress(btn.value, btn.type)}
          className={`
            ${btn.className || 'bg-slate-800/50 text-slate-200 hover:bg-slate-700/70'}
            ${btn.type === 'number' ? 'font-semibold text-xl' : 'font-medium'}
            h-14 sm:h-16 rounded-2xl flex items-center justify-center transition-all active:scale-95 text-lg
            ${btn.label === '0' ? 'col-span-2' : ''}
          `}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default Keypad;
