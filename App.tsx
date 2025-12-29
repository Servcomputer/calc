
import React, { useState, useEffect, useCallback } from 'react';
import * as math from 'mathjs';
import { CalculatorMode, HistoryItem, ButtonConfig } from './types';

// --- Sub-componente: Display ---
const Display: React.FC<{ expression: string; result: string }> = ({ expression, result }) => (
  <div className="w-full p-6 bg-slate-900/50 backdrop-blur-md rounded-t-[2rem] border-b border-slate-800 flex flex-col justify-end items-end min-h-[140px] gap-2">
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
  </div>
);

// --- Sub-componente: Keypad ---
const Keypad: React.FC<{ onKeyPress: (value: string, type: string) => void; mode: CalculatorMode }> = ({ onKeyPress, mode }) => {
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

  const buttons = mode === 'scientific' ? [...scientificButtons, ...standardButtons] : standardButtons;

  return (
    <div className="grid grid-cols-4 gap-3 p-6">
      {buttons.map((btn, idx) => (
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

// --- Componente Principal App ---
const App: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('calc_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (exp: string, res: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(7),
      expression: exp,
      result: res,
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  };

  const calculate = useCallback(() => {
    if (!expression) return;
    try {
      const evalResult = math.evaluate(expression);
      const formattedResult = math.format(evalResult, { precision: 10 });
      setResult(formattedResult.toString());
      addToHistory(expression, formattedResult.toString());
    } catch (err) {
      setResult('Erro');
    }
  }, [expression]);

  const handleKeyPress = (value: string, type: string) => {
    if (value === 'AC') {
      setExpression('');
      setResult('');
      return;
    }
    if (value === 'DEL') {
      setExpression(prev => prev.slice(0, -1));
      return;
    }
    if (value === '=') {
      calculate();
      return;
    }
    setExpression(prev => prev + value);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 shadow-2xl rounded-[2.5rem] flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center px-6 py-4 bg-slate-800/20 border-b border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('standard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'standard' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              PADRÃO
            </button>
            <button
              onClick={() => setMode('scientific')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'scientific' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              CIENTÍFICA
            </button>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-lg transition-all ${showHistory ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 flex flex-col">
          <Display expression={expression} result={result} />
          
          <div className="flex-1 overflow-y-auto no-scrollbar min-h-[400px]">
            {showHistory ? (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider">Histórico</h3>
                  <button onClick={() => setHistory([])} className="text-[10px] text-slate-600 hover:text-red-400 uppercase font-bold">Limpar</button>
                </div>
                <div className="space-y-3">
                  {history.map(item => (
                    <div key={item.id} className="p-3 bg-slate-800/30 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-800/50" onClick={() => { setExpression(item.expression); setResult(item.result); setShowHistory(false); }}>
                      <div className="text-slate-500 text-xs truncate mb-1">{item.expression}</div>
                      <div className="text-indigo-400 font-mono text-sm">= {item.result}</div>
                    </div>
                  ))}
                  {history.length === 0 && <div className="text-slate-600 text-center text-sm italic py-10">Vazio</div>}
                </div>
              </div>
            ) : (
              <Keypad mode={mode} onKeyPress={handleKeyPress} />
            )}
          </div>
        </div>

        <div className="p-3 text-center border-t border-slate-800 bg-slate-900/50">
          <p className="text-[9px] text-slate-600 uppercase tracking-[0.2em] font-bold">OmniCalc Pro Engine</p>
        </div>
      </div>
    </div>
  );
};

export default App;
