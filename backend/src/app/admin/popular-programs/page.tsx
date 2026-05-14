"use client";
import { useState, useEffect } from "react";
import { Star, TrendingUp, MapPin, Trophy } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function Stars({ r }: { r: number }) {
  return <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i=><Star key={i} size={11} className={i<=Math.round(r)?"text-yellow-400 fill-yellow-400":"text-slate-600"}/>)}
    <span className="text-xs text-slate-400 mr-1">{r.toFixed(1)}</span>
  </div>;
}

export default function PopularProgramsPage() {
  const [data, setData] = useState<any>(null);
  const [tab,  setTab]  = useState<"events"|"types"|"cities">("events");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ravi_token");
    fetch(`${API}/api/intelligence/popular-programs?limit=20`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r=>r.json()).then(setData).finally(()=>setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"/></div>;
  if (!data)   return <div className="p-6 text-center text-slate-400">Ø®Ø·Ø§ Ø¯Ø± Ø¨Ø§Ø±Ú¯Ø°Ø§Ø±ÛŒ</div>;

  return (
    <div className="p-4 space-y-5" dir="rtl">
      <div className="flex items-center gap-3"><Trophy size={22} className="text-yellow-400"/><h1 className="text-xl font-black text-white">Ù…Ø­Ø¨ÙˆØ¨â€ŒØªØ±ÛŒÙ† Ø¨Ø±Ù†Ø§Ù…Ù‡â€ŒÙ‡Ø§</h1></div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { l:"Ø§ÛŒÙˆÙ†Øªâ€ŒÙ‡Ø§ÛŒ Ø§Ø±Ø²ÛŒØ§Ø¨ÛŒâ€ŒØ´Ø¯Ù‡", v:data.summary.totalEventsRated, i:"í³Š" },
          { l:"Ù…ÛŒØ§Ù†Ú¯ÛŒÙ† Ø§Ù…ØªÛŒØ§Ø²",          v:`${data.summary.overallAvgRating} â­`, i:"â­" },
          { l:"Ù…Ø­Ø¨ÙˆØ¨â€ŒØªØ±ÛŒÙ† Ù†ÙˆØ¹",          v:data.summary.mostPopularType,   i:"í¿†" },
          { l:"Ù…Ø­Ø¨ÙˆØ¨â€ŒØªØ±ÛŒÙ† Ø´Ù‡Ø±",          v:data.summary.mostPopularCity,   i:"í³" },
        ].map(s=>(
          <div key={s.l} className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
            <div className="text-2xl mb-1">{s.i}</div>
            <div className="text-white font-black text-sm">{s.v}</div>
            <div className="text-slate-400 text-xs mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 bg-slate-800/50 p-1 rounded-2xl">
        {[{k:"events",l:"Ø¨Ø±Ù†Ø§Ù…Ù‡â€ŒÙ‡Ø§"},{k:"types",l:"Ø§Ù†ÙˆØ§Ø¹"},{k:"cities",l:"Ø´Ù‡Ø±Ù‡Ø§"}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k as any)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${tab===t.k?"bg-orange-500 text-white":"text-slate-400"}`}>{t.l}</button>
        ))}
      </div>
      <div className="space-y-3">
        {tab==="events" && data.topEvents.map((e:any,i:number)=>(
          <div key={e.eventId} className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 flex items-start gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm ${i===0?"bg-yellow-500/20 text-yellow-400":i===1?"bg-slate-400/20 text-slate-300":"bg-slate-700/20 text-slate-500"}`}>{i+1}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm line-clamp-1">{e.title}</p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <Stars r={e.avgRating}/>
                <span className="flex items-center gap-1 text-xs text-slate-400"><MapPin size={10}/>{e.city}</span>
                <span className="flex items-center gap-1 text-xs text-slate-400"><TrendingUp size={10}/>{e.attendanceRate}%</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500" style={{width:`${e.popularityScore}%`}}/>
                <span className="text-xs text-slate-500">{e.popularityScore}%</span>
              </div>
            </div>
          </div>
        ))}
        {tab==="types" && data.topEventTypes.map((t:any,i:number)=>(
          <div key={t.type} className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 flex items-center gap-4">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-sm flex-shrink-0">{i+1}</div>
            <div className="flex-1"><p className="text-white font-bold text-sm">{t.label}</p>
              <div className="flex items-center gap-3 mt-1"><Stars r={t.avgRating}/><span className="text-xs text-slate-400">{t.count} Ø§ÛŒÙˆÙ†Øª</span></div>
            </div>
          </div>
        ))}
        {tab==="cities" && data.topCities.map((c:any,i:number)=>(
          <div key={c.city} className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 flex items-center gap-4">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${i===0?"bg-yellow-500/20 text-yellow-400":"bg-slate-700/20 text-slate-400"}`}>{i+1}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-orange-400"/><p className="text-white font-bold text-sm">{c.city}</p></div>
              <div className="flex items-center gap-3 mt-1"><Stars r={c.avgRating}/><span className="text-xs text-slate-400">{c.count} Ø§ÛŒÙˆÙ†Øª</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
