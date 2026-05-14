"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Coffee, Check, X, Users, Clock, Send, LogOut, CheckCircle2, RefreshCw, AlertCircle } from "lucide-react";
const API_URL=process.env.NEXT_PUBLIC_API_URL||"http://localhost:4000";
const C:any={background:"linear-gradient(145deg,#1B2A4A 0%,#132038 100%)",border:"1px solid rgba(255,255,255,0.08)"};
interface A{bookingId:string;userId:string;name:string;phone?:string;attended:boolean|null;}
export default function CafeAttendance(){
  const{eventId}=useParams<{eventId:string}>(); const router=useRouter();
  const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [saved,setSaved]=useState(false);
  const [err,setErr]=useState(""); const [event,setEvent]=useState<any>(null); const [cafeName,setCafeName]=useState("");
  const [list,setList]=useState<A[]>([]);
  useEffect(()=>{
    const t=localStorage.getItem("cafe_token");
    if(!t){router.push("/cafe/login");return;}
    setCafeName(localStorage.getItem("cafe_name")||"کافه");
    fetch(`${API_URL}/api/cafe/attendance/${eventId}`,{headers:{Authorization:`Bearer ${t}`}})
      .then(r=>{if(r.status===401){router.push("/cafe/login");return null;}return r.json();})
      .then(d=>{if(d){setEvent(d.event);setList(d.attendees.map((a:any)=>({...a,attended:a.attended??null})));} })
      .catch(()=>setErr("خطا در دریافت لیست")).finally(()=>setLoading(false));
  },[]);
  const toggle=(uid:string,v:boolean)=>{setList(p=>p.map(a=>a.userId===uid?{...a,attended:v}:a));setSaved(false);};
  async function submit(){
    const t=localStorage.getItem("cafe_token");if(!t){router.push("/cafe/login");return;}
    const m=list.filter(a=>a.attended!==null);if(!m.length){setErr("حداقل یک نفر را ثبت کنید");return;}
    setSaving(true);setErr("");
    try{
      const res=await fetch(`${API_URL}/api/cafe/attendance/${eventId}/mark`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({attendances:m.map(a=>({userId:a.userId,attended:a.attended}))})});
      if(!res.ok)throw new Error("خطا در ثبت");setSaved(true);
    }catch(e:any){setErr(e.message);}finally{setSaving(false);}
  }
  const present=list.filter(a=>a.attended===true).length;
  const absent=list.filter(a=>a.attended===false).length;
  const unmarked=list.filter(a=>a.attended===null).length;
  if(loading)return<div className="min-h-screen flex items-center justify-center" style={{background:"#0B1628"}}><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"/></div>;
  return(
    <main className="min-h-screen pb-28" dir="rtl" style={{background:"#0B1628"}}>
      <div className="sticky top-0 z-30 px-4 py-3" style={{background:"rgba(11,22,40,0.95)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Coffee size={20} className="text-orange-400"/><span className="text-white font-black text-sm">{cafeName}</span></div><button onClick={()=>{localStorage.removeItem("cafe_token");router.push("/cafe/login");}} className="flex items-center gap-1 text-xs text-slate-400"><LogOut size={14}/>خروج</button></div>
      </div>
      <div className="px-4 pt-4 space-y-4">
        {event&&<div className="rounded-2xl p-4" style={C}><h1 className="text-base font-black text-white mb-2">{event.title}</h1><p className="flex items-center gap-2 text-xs text-slate-400"><Clock size={12}/>{new Date(event.start_date).toLocaleDateString("fa-IR",{weekday:"short",day:"numeric",month:"short"})}</p></div>}
        <div className="grid grid-cols-3 gap-3">
          {[{l:"حاضر",c:present,col:"#22c55e"},{l:"غایب",c:absent,col:"#ef4444"},{l:"ثبت نشده",c:unmarked,col:"#94a3b8"}].map(s=>(
            <div key={s.l} className="rounded-xl p-3 text-center" style={C}><p className="text-2xl font-black" style={{color:s.col}}>{s.c}</p><p className="text-xs text-slate-400 mt-0.5">{s.l}</p></div>
          ))}
        </div>
        {err&&<div className="flex items-center gap-2 p-3 rounded-xl text-red-400 text-sm" style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)"}}><AlertCircle size={15}/>{err}</div>}
        {saved&&<div className="flex items-center gap-2 p-3 rounded-xl text-green-400 text-sm" style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)"}}><CheckCircle2 size={15}/>با موفقیت ثبت شد!</div>}
        <p className="text-sm font-black text-white">لیست شرکت‌کنندگان ({list.length} نفر)</p>
        <div className="space-y-2">
          {list.map(a=>(
            <div key={a.userId} className="rounded-xl p-4 flex items-center gap-3" style={C}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0" style={{background:"rgba(255,107,0,0.2)",color:"#FF9A3C"}}>{a.name.charAt(0)}</div>
              <div className="flex-1 min-w-0"><p className="text-white font-bold text-sm truncate">{a.name}</p>{a.phone&&<p className="text-slate-500 text-xs" dir="ltr">{a.phone}</p>}</div>
              <div className="flex gap-2 shrink-0">
                <button onClick={()=>toggle(a.userId,true)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:a.attended===true?"rgba(34,197,94,0.2)":"rgba(255,255,255,0.04)",border:`1.5px solid ${a.attended===true?"#22c55e":"rgba(255,255,255,0.1)"}`}}><Check size={16} className={a.attended===true?"text-green-400":"text-slate-500"}/></button>
                <button onClick={()=>toggle(a.userId,false)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:a.attended===false?"rgba(239,68,68,0.2)":"rgba(255,255,255,0.04)",border:`1.5px solid ${a.attended===false?"#ef4444":"rgba(255,255,255,0.1)"}`}}><X size={16} className={a.attended===false?"text-red-400":"text-slate-500"}/></button>
              </div>
            </div>
          ))}
          {!list.length&&<div className="text-center py-12 text-slate-500"><Users size={32} className="mx-auto mb-2 opacity-30"/><p className="text-sm">هنوز کسی رزرو نکرده</p></div>}
        </div>
      </div>
      <div className="fixed bottom-4 left-4 right-4 z-30">
        <button onClick={submit} disabled={saving||!list.length} className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2" style={{background:"linear-gradient(135deg,#FF6B00,#FF9A3C)",opacity:(saving||!list.length)?.6:1}}>
          {saving?<RefreshCw size={18} className="animate-spin"/>:<Send size={18}/>}{saving?"در حال ثبت...":"ثبت حضور و غیاب"}
        </button>
      </div>
    </main>
  );
}
