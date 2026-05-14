"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { isAdminPhone } from "@/lib/api";
import Link from "next/link";
import { TrendingUp, DollarSign, Users, BarChart2, ArrowRight, RefreshCw, Zap, Target, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
const API_URL=process.env.NEXT_PUBLIC_API_URL||"http://localhost:4000";
const C:any={background:"linear-gradient(145deg,#1B2A4A 0%,#132038 100%)",border:"1px solid rgba(255,255,255,0.07)",boxShadow:"0 8px 24px rgba(0,0,0,0.3)"};
const fM=(n:number)=>n>=1e6?`${(n/1e6).toFixed(1)}م`:n>=1000?`${(n/1000).toFixed(0)}ک`:n.toLocaleString("fa-IR");
function Bar({score}:{score:number}){
  const col=score>=70?"#22c55e":score>=45?"#f59e0b":"#ef4444";
  return<div className="relative h-2 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.1)"}}><div className="absolute right-0 top-0 h-full rounded-full" style={{width:`${score}%`,background:col}}/></div>;
}
export default function ROIDashboard(){
  const {state}=useApp(); const router=useRouter();
  const isAdmin=isAdminPhone(state.user?.mobileNumber);
  const [loading,setLoading]=useState(true); const [data,setData]=useState<any>(null); const [months,setMonths]=useState(3);
  useEffect(()=>{if(!state.isLoggedIn||!isAdmin)router.push("/dashboard");},[state.isLoggedIn,isAdmin]);
  useEffect(()=>{if(!isAdmin)return;load();},[months]);
  async function load(){
    setLoading(true);
    const t=localStorage.getItem("token");
    try{const r=await fetch(`${API_URL}/api/roi/dashboard?months=${months}`,{headers:{Authorization:`Bearer ${t}`}});if(r.ok)setData(await r.json());}catch{}finally{setLoading(false);}
  }
  const s=data?.summary; const monthly=data?.monthly||[];
  return(
    <main className="min-h-screen pb-28 px-4 pt-4" dir="rtl" style={{background:"#0B1628"}}>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/dashboard" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)"}}><ArrowRight size={18} className="text-white"/></Link>
        <div><h1 className="text-base font-black text-white">داشبورد بازگشت سرمایه</h1><p className="text-xs text-slate-400">ROI همنشینی‌ها</p></div>
        <button onClick={load} className="mr-auto w-9 h-9 rounded-xl flex items-center justify-center" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)"}}><RefreshCw size={16} className={`text-slate-400 ${loading?"animate-spin":""}`}/></button>
      </div>
      <div className="flex gap-2 mb-5">
        {[1,3,6].map(m=>(
          <button key={m} onClick={()=>setMonths(m)} className="flex-1 py-2 rounded-xl text-sm font-bold" style={{background:months===m?"rgba(255,107,0,0.2)":"rgba(255,255,255,0.05)",border:`1.5px solid ${months===m?"#FF6B00":"rgba(255,255,255,0.08)"}`,color:months===m?"#FF9A3C":"#94a3b8"}}>{m} ماه</button>
        ))}
      </div>
      {loading?<div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"/></div>:(
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              {l:"کل درآمد",v:fM(s?.totalRevenue||0)+" ت",I:DollarSign,col:"#FF6B00",up:true},
              {l:"سود خالص",v:fM(s?.totalProfit||0)+" ت",I:TrendingUp,col:(s?.totalProfit||0)>=0?"#22c55e":"#ef4444",up:(s?.totalProfit||0)>=0},
              {l:"میانگین موفقیت",v:(s?.avgSuccessScore||0)+"%",I:Target,col:"#3b82f6",up:(s?.avgSuccessScore||0)>=60},
              {l:"نرخ بازگشت کاربر",v:(s?.avgReturnRate||0)+"%",I:Users,col:"#a855f7",up:(s?.avgReturnRate||0)>=40},
            ].map(c=>(
              <div key={c.l} className="rounded-2xl p-4" style={C}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:`${c.col}20`}}><c.I size={16} style={{color:c.col}}/></div>
                  {c.up?<ArrowUpRight size={14} className="text-green-400"/>:<ArrowDownRight size={14} className="text-red-400"/>}
                </div>
                <p className="text-xl font-black text-white">{c.v}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{c.l}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-4" style={C}>
            <h2 className="text-sm font-black text-white mb-4 flex items-center gap-2"><Activity size={16} className="text-orange-400"/>عملکرد ماهانه</h2>
            <div className="space-y-3">
              {monthly.map((m:any,i:number)=>(
                <div key={i} className="p-3 rounded-xl" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)"}}>
                  <div className="flex items-center justify-between mb-2"><span className="text-sm font-bold text-white">{m.label}</span><span className={`text-xs font-black ${m.profit>=0?"text-green-400":"text-red-400"}`}>{m.profit>=0?"+":""}{fM(m.profit)} ت</span></div>
                  <div className="flex gap-4 text-xs text-slate-400 mb-2"><span>درآمد: {fM(m.revenue)} ت</span><span>رویداد: {m.eventCount}</span><span>حضور: {m.attendanceRate}%</span></div>
                  <div className="flex items-center gap-2"><span className="text-[10px] text-slate-500">موفقیت</span><div className="flex-1"><Bar score={m.avgSuccessScore}/></div><span className="text-[10px] font-black" style={{color:m.avgSuccessScore>=70?"#22c55e":m.avgSuccessScore>=45?"#f59e0b":"#ef4444"}}>{m.avgSuccessScore}%</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-4" style={{...C,border:"1px solid rgba(255,107,0,0.2)"}}>
            <div className="flex items-start gap-3">
              <Zap size={20} className="text-orange-400 shrink-0 mt-0.5"/>
              <div><p className="text-sm font-bold text-white mb-1">تحلیل هوشمند + بن خودکار</p><p className="text-xs text-slate-400 mb-3">بعد از هر همنشینی، تحلیل ROI کامل اجرا می‌شود و کاربران با ۲+ غیبت بن می‌شوند</p>
                <Link href="/admin/events" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white" style={{background:"linear-gradient(135deg,#FF6B00,#FF9A3C)"}}>رفتن به رویدادها</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
