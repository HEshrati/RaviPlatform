'use client';
import { useState } from 'react';

interface Option { id: string; text: string; description?: string; }
interface Props { question: string; subtitle?: string; options: Option[]; onAnswer: (id: string) => void; }

export function MultipleChoiceQuestion({ question, subtitle, options, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const handleSelect = (id: string) => { setSelected(id); onAnswer(id); };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3 leading-relaxed">{question}</h2>
      {subtitle && <p className="text-center text-gray-500 text-sm mb-8 flex items-center justify-center gap-1"><span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-300 text-xs">i</span>{subtitle}</p>}
      {!subtitle && <div className="mb-8"/>}
      <div className="space-y-4">
        {options.map(option => {
          const sel = selected === option.id;
          return (
            <button key={option.id} onClick={() => handleSelect(option.id)}
              className={`w-full p-5 rounded-2xl border-2 text-right transition-all duration-200 group ${sel ? 'bg-[#1a2332] border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-[#1a2332] border-transparent hover:border-orange-300/50'}`}>
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mt-0.5 flex items-center justify-center transition-all ${sel ? 'bg-orange-500 border-orange-500' : 'border-gray-500 group-hover:border-orange-300'}`}>
                  {sel && <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                </div>
                <div className="flex-1">
                  <p className={`text-lg font-semibold transition-colors ${sel ? 'text-white' : 'text-gray-100'}`}>{option.text}</p>
                  {option.description && <p className={`text-sm mt-1 transition-colors ${sel ? 'text-orange-200' : 'text-gray-400'}`}>{option.description}</p>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
