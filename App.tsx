
import React, { useState, useEffect, useCallback } from 'react';
import * as math from 'mathjs';
import Display from './components/Display';
import Keypad from './components/Keypad';
import { solveWithAI } from './services/geminiService';
import { CalculatorMode, HistoryItem } from './types';

const App: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiQuery, setAiQuery] = useState('');

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
      setAiExplanation('');
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

  const handleAISolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    setAiExplanation('');
    const res = await solveWithAI(aiQuery);
    setResult(res.result);
    setAiExplanation(res.explanation);
    setExpression(aiQuery);
    addToHistory(`AI: ${aiQuery}`, res.result);
    setIsAiLoading(false);
    setAiQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center gap-1 p-2 bg-slate-800/30 rounded-t-[2.5rem] border-b border-slate-800">
          {(['standard', 'scientific', 'ai'] as CalculatorMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                mode === m 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        {/* Display Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <Display 
            expression={expression} 
            result={result} 
            isAI={mode === 'ai'} 
            explanation={aiExplanation}
          />

          {mode === 'ai' ? (
            <div className="p-6">
              <form onSubmit={handleAISolve} className="space-y-4">
                <label className="block text-slate-400 text-sm mb-1">Pergunte qualquer problema matemático:</label>
                <div className="relative">
                  <textarea
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Ex: Qual a área de um círculo com raio 5?"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[100px] resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading}
                    className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white p-2 px-4 rounded-xl shadow-lg transition-all"
                  >
                    {isAiLoading ? 'Processando...' : 'Resolver'}
                  </button>
                </div>
              </form>
              
              <div className="mt-8">
                <h3 className="text-slate-300 font-semibold mb-4 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  Histórico Recente
                </h3>
                <div className="space-y-3">
                  {history.slice(0, 5).map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-colors cursor-pointer group"
                      onClick={() => {
                        setExpression(item.expression);
                        setResult(item.result);
                      }}
                    >
                      <div className="text-slate-500 text-xs truncate mb-1 group-hover:text-slate-400">
                        {item.expression}
                      </div>
                      <div className="text-slate-200 font-mono text-sm">
                        = {item.result}
                      </div>
                    </div>
                  ))}
                  {history.length === 0 && (
                    <div className="text-slate-600 text-sm italic text-center py-4">
                      Nenhum histórico disponível
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Keypad 
              mode={mode === 'scientific' ? 'scientific' : 'standard'} 
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
