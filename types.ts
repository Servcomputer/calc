
export type CalculatorMode = 'standard' | 'scientific' | 'ai';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface ButtonConfig {
  label: string;
  value: string;
  type: 'number' | 'operator' | 'function' | 'action' | 'special';
  className?: string;
}
