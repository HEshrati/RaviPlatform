'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

interface Props { question: string; minLabel?: string; maxLabel?: string; min?: number; max?: number; onAnswer: (value: number) => void; }

export function ScaleQuestion({ question, minLabel='موافقم', maxLabel='مخالفم', min=-5, max=5, onAnswer }: Props) {
  const [value, setValue] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const steps = Array.from({ length: max - min + 1 }, (_, i) => max - i);

  const getVal = useCallback((clientY: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    return Math.round(Math.max(min, Math.min(max, max - pct * (max - min))));
  }, [max, min]);

  const handleMouseDown = (e: React.MouseEvent) => { e.preventDefault(); setIsDragging(true); const v=getVal(e.clientY); setValue(v); onAnswer(v); };
  const handleTouchStart = (e: React.TouchEvent) => { setIsDragging(true); const v=getVal(e.touches[0].clientY); setValue(v); onAnswer(v); };

  useEffect(() => {
    const mm = (e: MouseEvent) => { if (!isDragging) return; const v=getVal(e.clientY); setValue(v); onAnswer(v); };
    const tm = (e: TouchEvent) => { if (!isDragging||!e.touches[0]) return; const v=getVal(e.touches[0].clientY); setValue(v); onAnswer(v); };
    const stop = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove',mm); window.addEventListener('mouseup',stop);
      window.addEventListener('touchmove',tm,{passive:true}); window.addEventListener('touchend',stop);
    }
    return () => { window.removeEventListener('mousemove',mm); window.removeEventListener('mouseup',stop); window.removeEventListener('touchmove',tm); window.removeEventListener('touchend',stop); };
  }, [isDragging, getVal, onAnswer]);

  const thumbPct = ((max - value) / (max - min)) * 100;

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">{question}</h2>
        <button className="text-gray-400 hover:text-gray-600 text-sm">→</button>
      </div>
      <div className="flex gap-6 items-stretch justify-center" style={{minHeight:'420px'}}>
        <div className="relative flex justify-center" style={{width:80}}>
          <div ref={trackRef} className="absolute inset-0 cursor-pointer" onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} style={{zIndex:2}}/>
          <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none" style={{zIndex:1}}>
            {steps.map(step => {
              const dist = Math.abs(step);
              const w = dist>=4?40:dist>=2?34:28;
              const h = dist>=4?'h-5':dist>=2?'h-4':'h-3';
              const color = step===value?'bg-orange-500':(step>0&&value>0&&step<=value?'bg-orange-400':(step<0&&value<0&&step>=value?'bg-orange-300':'bg-gray-600'));
              return <div key={step} className="flex items-center justify-center"><div className={`rounded-full transition-all duration-150 ${color} ${h}`} style={{width:w}}/></div>;
            })}
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none" style={{top:`calc(${thumbPct}% - 20px)`,zIndex:3}}>
            <div className={`w-10 h-10 rounded-full bg-white shadow-xl border-4 border-orange-500 flex items-center justify-center transition-all duration-100 ${isDragging?'scale-110':''}`}>
              <span className="text-xs font-bold text-orange-500">{value>0?`+${value}`:value}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between py-1 text-sm">
          <span className="text-gray-700 font-medium">کاملاً {minLabel}</span>
          {steps.map(step => <span key={step} className={`text-center font-medium cursor-pointer select-none ${step===value?'text-orange-500 font-bold':'text-gray-400'}`} onMouseDown={()=>{setValue(step);onAnswer(step);}}>{step!==0?Math.abs(step):''}</span>)}
          <span className="text-gray-700 font-medium">کاملاً {maxLabel}</span>
        </div>
      </div>
      <div className="mt-4 text-center"><span className="text-sm text-gray-500">مقدار: <strong className="text-orange-500">{value>0?`+${value}`:value}</strong></span></div>
    </div>
  );
}
