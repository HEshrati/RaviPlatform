"use client";
import { useState, useEffect } from "react";
import { Merge, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function EventMergePage() {
  const [events,   setEvents]   = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [merging,  setMerging]  = useState(false);
  const [result,   setResult]   = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("ravi_token");
    fetch(`${API}/api/events`, { headers:{ Authorization:`Bearer ${token||""}` } })
      .then(r=>r.json())
      .then(d=>setEvents(Array.isArray(d.events)?d.events.filter((e:any)=>!e.merged_into):Array.isArray(d)?d:[]))
      .finally(()=>setLoading(false));
  }, []);

  const handleMerge = async () => {
    if (!sourceId || !targetId || sourceId===targetId) { setResult({success:false,message:"Ø¯Ùˆ Ø§ÛŒÙˆÙ†Øª Ù…Ø®ØªÙ„Ù Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯"}); return; }
    setMerging(true); setResult(null);
    try {
      const token = localStorage.getItem("ravi_token");
      const res = await fetch(`${API}/api/events/merge`, {
        method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
        body: JSON.stringify({ sourceEventId:sourceId, targetEventId:targetId }),
      });
      const data = await res.json();
      if (res.ok) { setResult({success:true,message:`âœ… ${data.movedUsers||0} Ù†ÙØ± Ù…Ù†ØªÙ‚Ù„ Ø´Ø¯Ù†Ø¯`}); setEvents(p=>p.filter(e=>e.id!==sourceId)); setSourceId(""); setTargetId(""); }
      else setResult({success:false,message:data.message||"Ø®Ø·Ø§"});
    } catch { setResult({success:false,message:"Ø®Ø·Ø§ÛŒ Ø´Ø¨Ú©Ù‡"}); }
    setMerging(false);
  };

  const src = events.find(e=>e.id===sourceId);
  const tgt = events.find(e=>e.id===targetId);
  const canMerge = src && tgt && src.current_bookings + tgt.current_bookings <= tgt.capacity;

  return (
    <div className="p-4 space-y-5" dir="rtl">
      <div className="flex items-center gap-3"><Merge size={22} className="text-orange-400"/><h1 className="text-xl font-black text-white">Ø§Ø¯ØºØ§Ù… Ø§ÛŒÙˆÙ†Øªâ€ŒÙ‡Ø§</h1></div>
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
        <p className="text-blue-300 text-sm font-bold mb-1">í´– Ø§Ø¯ØºØ§Ù… Ø®ÙˆØ¯Ú©Ø§Ø±</p>
        <p className="text-slate-400 text-xs">Ø³ÛŒØ³ØªÙ… Ù‡Ø± Û³Û° Ø¯Ù‚ÛŒÙ‚Ù‡ Ø§ÛŒÙˆÙ†Øªâ€ŒÙ‡Ø§ÛŒ Û±Û² Ø³Ø§Ø¹Øª Ø¢ÛŒÙ†Ø¯Ù‡ Ø±Ø§ Ø¨Ø±Ø±Ø³ÛŒ Ùˆ Ø§Ø¯ØºØ§Ù… Ù…ÛŒâ€ŒÚ©Ù†Ø¯. Ø§ÛŒÙ† ØµÙØ­Ù‡ Ø¨Ø±Ø§ÛŒ Ø§Ø¯ØºØ§Ù… Ø¯Ø³ØªÛŒ Ø§Ø³Øª.</p>
      </div>
      {loading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"/></div> : (
        <>
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
            <h3 className="text-white font-bold text-sm mb-3">Ø§ÛŒÙˆÙ†Øª Ù…Ø¨Ø¯Ø§ (Ú©Ù‡ Ø§Ø¯ØºØ§Ù… Ù…ÛŒâ€ŒØ´ÙˆØ¯)</h3>
            <select value={sourceId} onChange={e=>setSourceId(e.target.value)} className="w-full bg-slate-700 text-white rounded-xl p-3 text-sm outline-none border border-white/10">
              <option value="">Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯...</option>
              {events.filter(e=>e.id!==targetId).map(e=>(
                <option key={e.id} value={e.id}>{e.title} â€” {e.current_bookings}/{e.capacity} Ù†ÙØ± â€” {e.city}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-center"><div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center"><ArrowRight size={18} className="text-orange-400 rotate-90"/></div></div>
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
            <h3 className="text-white font-bold text-sm mb-3">Ø§ÛŒÙˆÙ†Øª Ù…Ù‚ØµØ¯ (Ú©Ù‡ Ø¯Ø±ÛŒØ§ÙØª Ù…ÛŒâ€ŒÚ©Ù†Ø¯)</h3>
            <select value={targetId} onChange={e=>setTargetId(e.target.value)} className="w-full bg-slate-700 text-white rounded-xl p-3 text-sm outline-none border border-white/10">
              <option value="">Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯...</option>
              {events.filter(e=>e.id!==sourceId).map(e=>(
                <option key={e.id} value={e.id}>{e.title} â€” {e.current_bookings}/{e.capacity} Ù†ÙØ± â€” {e.city}</option>
              ))}
            </select>
          </div>
          {src && tgt && (
            <div className={`rounded-2xl p-4 border ${canMerge?"bg-green-500/5 border-green-500/20":"bg-red-500/5 border-red-500/20"}`}>
              <p className="text-sm font-bold mb-2 text-white">Ù¾ÛŒØ´â€ŒÙ†Ù…Ø§ÛŒØ´:</p>
              <p className="text-xs text-slate-400">Ø§Ø²: <span className="text-white">{src.title}</span> ({src.current_bookings} Ù†ÙØ±)</p>
              <p className="text-xs text-slate-400">Ø¨Ù‡: <span className="text-white">{tgt.title}</span> ({tgt.current_bookings} Ù†ÙØ±)</p>
              <p className="text-xs mt-1"><span className={canMerge?"text-green-400":"text-red-400"}>{src.current_bookings+tgt.current_bookings}/{tgt.capacity} Ù†ÙØ± {!canMerge&&"â€” âš ï¸ Ø¸Ø±ÙÛŒØª Ú©Ø§ÙÛŒ Ù†ÛŒØ³Øª"}</span></p>
            </div>
          )}
          {result && (
            <div className={`rounded-2xl p-4 flex items-center gap-3 ${result.success?"bg-green-500/10 border border-green-500/20":"bg-red-500/10 border border-red-500/20"}`}>
              {result.success?<CheckCircle size={16} className="text-green-400"/>:<AlertCircle size={16} className="text-red-400"/>}
              <p className={`text-sm ${result.success?"text-green-300":"text-red-300"}`}>{result.message}</p>
            </div>
          )}
          <button onClick={handleMerge} disabled={!canMerge||merging}
            className="w-full py-3 rounded-2xl font-black text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {merging?"Ø¯Ø± Ø­Ø§Ù„ Ø§Ø¯ØºØ§Ù…...":"Ø§Ø¯ØºØ§Ù… Ø§ÛŒÙˆÙ†Øªâ€ŒÙ‡Ø§"}
          </button>
        </>
      )}
    </div>
  );
}
