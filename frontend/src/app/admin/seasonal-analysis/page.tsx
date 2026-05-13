"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const S_COLOR: Record<string,string> = {
  spring:"from-green-500/30 to-emerald-500/20 border-green-500/20",
  summer:"from-yellow-500/30 to-orange-500/20 border-yellow-500/20",
  fall  :"from-orange-500/30 to-red-500/20 border-orange-500/20",
  winter:"from-blue-500/30 to-indigo-500/20 border-blue-500/20",
};
const S_ICON: Record<string,string> = { spring:"í¼¸", summer:"â˜€ï¸", fall:"í½‚", winter:"â„ï¸" };

export default function SeasonalAnalysisPage() {
  const [current, setCurrent] = useState<any>(null);
  const [all,     setAll]     = useState<any[]>([]);
  const [view,    setView]    = useState<"current"|"compare">("current");
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear();

  useEffect(() => {
    const h = { Authorization:`Bearer ${localStorage.getItem("ravi_token")||""}` };
    Promise.all([
      fetch(`${API}/api/intelligence/seasonal-analysis`,      { headers:h }).then(r=>r.json()),
      fetch(`${API}/api/intelligence/seasonal-compare?year=${year}`, { headers:h }).then(r=>r.json()),
    ]).then(([c,a])=>{ setCurrent(c); setAll(Array.isArray(a)?a:[]); }).finally(()=>setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"/></div>;

  return (
    <div className="p-4 space-y-5" dir="rtl">
      <div className="flex items-center gap-3"><Calendar size={22} className="text-orange-400"/><h1 className="text-xl font-black text-white">ØªØ­Ù„ÛŒÙ„ ÙØµÙ„ÛŒ</h1></div>
      <div className="flex gap-2 bg-slate-800/50 p-1 rounded-2xl">
        {[{k:"current",l:"ÙØµÙ„ Ø¬Ø§Ø±ÛŒ"},{k:"compare",l:"Ù…Ù‚Ø§ÛŒØ³Ù‡ ÙØµÙˆÙ„"}].map(t=>(
          <button key={t.k} onClick={()=>setView(t.k as any)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${view===t.k?"bg-orange-500 text-white":"text-slate-400"}`}>{t.l}</button>
        ))}
      </div>
      {view==="current" && current && (
        <div className="space-y-4">
          <div className={`rounded-2xl p-4 bg-gradient-to-br border ${S_COLOR[current.season]||"from-slate-800 to-slate-700 border-white/5"}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{S_ICON[current.season]||"í·“ï¸"}</span>
              <div><h2 className="text-white font-black">{current.seasonLabel} {current.year}</h2>
                <p className="text-slate-300 text-sm">{current.totalEvents} Ø§ÛŒÙˆÙ†Øª</p></div>
            </div>
            {current.insights?.map((ins:string,i:number)=>(
              <p key={i} className="text-white/80 text-xs flex items-start gap-2"><span className="text-orange-400">í²¡</span>{ins}</p>
            ))}
          </div>
          {current.bestTimeSlots?.length > 0 && (
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-4"><Clock size={16} className="text-orange-400"/><h3 className="text-white font-bold text-sm">Ø¨Ù‡ØªØ±ÛŒÙ† Ø³Ø§Ø¹Øªâ€ŒÙ‡Ø§</h3></div>
              {current.bestTimeSlots.map((s:any)=>(
                <div key={s.hour} className="flex items-center gap-3 mb-2">
                  <span className="text-slate-400 text-xs font-mono w-16">{s.label}</span>
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{width:`${s.successRate}%`}}/>
                  </div>
                  <span className="text-xs text-slate-300 w-8">{s.successRate}%</span>
                </div>
              ))}
            </div>
          )}
          {current.totalEvents === 0 && (
            <div className="text-center py-10 text-slate-500"><Calendar size={36} className="mx-auto mb-3 opacity-20"/><p>Ø¯Ø§Ø¯Ù‡â€ŒØ§ÛŒ ÙˆØ¬ÙˆØ¯ Ù†Ø¯Ø§Ø±Ø¯</p></div>
          )}
        </div>
      )}
      {view==="compare" && (
        <div className="space-y-4">
          {all.map((s:any)=>(
            <div key={s.season} className={`rounded-2xl p-4 bg-gradient-to-br border ${S_COLOR[s.season]||"from-slate-800 to-slate-700 border-white/5"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><span className="text-2xl">{S_ICON[s.season]}</span><h3 className="text-white font-bold">{s.seasonLabel}</h3></div>
                <span className="text-slate-300 text-sm font-bold">{s.totalEvents} Ø§ÛŒÙˆÙ†Øª</span>
              </div>
              {s.bestTimeSlots?.[0] && <p className="text-slate-300 text-xs">â° Ø¨Ù‡ØªØ±ÛŒÙ† Ø³Ø§Ø¹Øª: {s.bestTimeSlots[0].label} ({s.bestTimeSlots[0].successRate}%)</p>}
              {s.insights?.[0] && <p className="text-white/70 text-xs mt-1">í²¡ {s.insights[0]}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
