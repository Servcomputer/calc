
import React, { useState, useEffect, useCallback } from 'react';
import * as math from 'mathjs';
import Display from './components/Display';
import Keypad from './components/Keypad';
import { CalculatorMode, HistoryItem } from './types';

const App: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('calc_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Save history to localStorage
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
      // Evaluate using mathjs
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

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calc_history');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Navigation Tabs */}
        <div className="flex justify-between items-center px-6 py-2 bg-slate-800/30 rounded-t-[2.5rem] border-b border-slate-800">
          <div className="flex gap-1">
            {(['standard', 'scientific'] as CalculatorMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  mode === m 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {m === 'standard' ? 'Padrão' : 'Científica'}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-xl transition-all ${showHistory ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          <Display 
            expression={expression} 
            result={result} 
          />

          {showHistory ? (
            <div className="p-6 animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-slate-300 font-semibold text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  Histórico
                </h3>
                <button 
                  onClick={clearHistory}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                >
                  Limpar tudo
                </button>
              </div>
              <div className="space-y-3">
                {history.length > 0 ? history.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    onClick={() => {
                      setExpression(item.expression);
                      setResult(item.result);
                      setShowHistory(false);
                    }}
                  >
                    <div className="text-slate-500 text-xs truncate mb-1 group-hover:text-slate-400">
                      {item.expression}
                    </div>
                    <div className="text-slate-200 font-mono text-sm">
                      = {item.result}
                    </div>
                  </div>
                )) : (
                  <div className="text-slate-600 text-sm italic text-center py-8">
                    Nenhum histórico disponível
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Keypad 
              mode={mode} 
              onKeyPress={handleKeyPress} 
            />
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 text-center border-t border-slate-800">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
            OmniCalc Pro &bull; Advanced Mathematics Engine
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
