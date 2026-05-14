"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Calendar, ArrowLeft, LogOut } from "lucide-react";
const API_URL=process.env.NEXT_PUBLIC_API_URL||"http://localhost:4000";
const C:any={background:"linear-gradient(145deg,#1B2A4A 0%,#132038 100%)",border:"1px solid rgba(255,255,255,0.08)"};
export default function CafeAttendanceLanding(){
  const router=useRouter();
  const [events,setEvents]=useState<any[]>([]); const [loading,setLoading]=useState(true); const [name,setName]=useState("");
  useEffect(()=>{
    const t=localStorage.getItem("cafe_token");
    if(!t){router.push("/cafe/login");return;}
    setName(localStorage.getItem("cafe_name")||"کافه");
    fetch(`${API_URL}/api/cafe/today-events`,{headers:{Authorization:`Bearer ${t}`}})
      .then(r=>{if(r.status===401){router.push("/cafe/login");return null;}return r.json();})
      .then(d=>{if(d)setEvents(Array.isArray(d)?d:[]);}).catch(()=>{}).finally(()=>setLoading(false));
  },[]);
  return(
    <main className="min-h-screen pb-10" dir="rtl" style={{background:"#0B1628"}}>
      <div className="sticky top-0 z-30 px-4 py-3" style={{background:"rgba(11,22,40,0.95)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Coffee size={20} className="text-orange-400"/><span className="text-white font-black text-sm">{name}</span></div>
          <button onClick={()=>{localStorage.removeItem("cafe_token");router.push("/cafe/login");}} className="flex items-center gap-1 text-xs text-slate-400"><LogOut size={14}/>خروج</button>
        </div>
      </div>
      <div className="px-4 pt-6 space-y-4">
        <div><h1 className="text-lg font-black text-white">رویدادهای امروز</h1><p className="text-xs text-slate-400 mt-1">{new Date().toLocaleDateString("fa-IR",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p></div>
        {loading&&<div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"/></div>}
        {!loading&&!events.length&&<div className="text-center py-16 text-slate-500"><Calendar size={40} className="mx-auto mb-3 opacity-30"/><p>امروز رویدادی وجود ندارد</p></div>}
        {events.map(ev=>(
          <button key={ev.id} onClick={()=>router.push(`/cafe/attendance/${ev.id}`)} className="w-full rounded-2xl p-4 flex items-center gap-4 text-right" style={C}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background:"rgba(255,107,0,0.15)"}}><Coffee size={22} className="text-orange-400"/></div>
            <div className="flex-1 min-w-0"><p className="text-white font-bold text-sm">{ev.title}</p><p className="text-slate-400 text-xs">{new Date(ev.start_date).toLocaleTimeString("fa-IR",{hour:"2-digit",minute:"2-digit"})} — {ev.capacity} نفر</p></div>
            <ArrowLeft size={16} className="text-slate-500"/>
          </button>
        ))}
      </div>
    </main>
  );
}
