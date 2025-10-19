//import React from 'react';
import { Input } from './ui/input';
import { PAOState, NumberInputs } from '../App';

interface InputBarProps {
  numberInputs: NumberInputs;
  paoState: PAOState;
  onPAONumberChange: (field: 'person' | 'action' | 'object', value: string) => void;
  defaultPAOData: Record<number, { person: string, action: string, object: string, images: { person: string, action: string, object: string } }>;
}

export function InputBar({ numberInputs, onPAONumberChange, defaultPAOData }: InputBarProps) {
  const getPreviewValue = (field: 'person' | 'action' | 'object', numStr: string) => {
    const num = parseInt(numStr);
    if (!num || !defaultPAOData[num]) return '';
    return defaultPAOData[num][field];
  };

  const inputCards = [
    {
      field: 'person' as const,
      title: 'Person',
      emoji: '🧍',
      placeholder: '0-100',
      gradient: 'from-rose-500/20 via-pink-400/10 to-rose-300/5',
      borderGradient: 'from-rose-400/30 to-pink-300/20'
    },
    {
      field: 'action' as const,
      title: 'Action',
      emoji: '🤸',
      placeholder: '0-100',
      gradient: 'from-amber-500/20 via-orange-400/10 to-yellow-300/5',
      borderGradient: 'from-amber-400/30 to-orange-300/20'
    },
    {
      field: 'object' as const,
      title: 'Object',
      emoji: '📦',
      placeholder: '0-100',
      gradient: 'from-emerald-500/20 via-green-400/10 to-teal-300/5',
      borderGradient: 'from-emerald-400/30 to-green-300/20'
    }
  ];

  return (
    <div className="mb-3 px-4 py-1 relative">
      <div className="grid grid-cols-3 gap-4 relative z-10 py-1">
        {inputCards.map((card) => (
          <div key={card.field} className="flex-1">
            <div className={`bg-gradient-to-br ${card.gradient} backdrop-blur-sm rounded-xl p-2.5 border border-white/20 shadow-soft relative overflow-visible transition-all duration-300 ease-out focus-within:scale-110 focus-within:z-50 focus-within:shadow-xl focus-within:border-white/40`}>
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-lg">{card.emoji}</span>
                <label className="text-xs font-medium text-foreground/70">{card.title}</label>
              </div>
              <Input
                  type="text"
                  placeholder={card.placeholder}
                  value={numberInputs[card.field]}
                  onFocus={(e) => e.target.select()} // auto-select all text
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, ''); // keep only digits
                    if (val.length > 2) val = val.slice(0, 2);   // limit to 2 digits
                    onPAONumberChange(card.field, val);          // save raw while typing
                  }}
                  onBlur={(e) => {
                    let val = e.target.value;
                    if (val === '') val = '00';
                    else if (val.length === 1) val = val.padStart(2, '0'); // pad 1→01
                    if (parseInt(val) > 99) val = '99';
                    onPAONumberChange(card.field, val);
                  }}
                  className="text-center bg-white/90 border-0 rounded-lg shadow-soft backdrop-blur-sm h-10 text-base font-semibold focus:bg-white focus:scale-150 focus:text-xl focus:h-16 transition-all duration-300 ease-out"
                  inputMode="numeric"
                  pattern="\d*"
                />

              {getPreviewValue(card.field, numberInputs[card.field]) && (
                <div className="mt-2 text-center">
                  <span className="glass-strong px-2 py-1 rounded-md text-xs text-foreground/90 font-medium block truncate">
                    {getPreviewValue(card.field, numberInputs[card.field])}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}