"use client";

import { useEffect, useState, useMemo } from "react";
import { BookOpen, Clock, ArrowLeft, Brain, Heart, Sparkles, Leaf, Zap, Star, Shield, Sun, Search, RefreshCw } from "lucide-react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";

interface Article {
  id: string; title: string; summary: string; category: string;
  readTime: string; url: string; publishedAt?: string;
}

const CATEGORY_CONFIG: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  "روانشناسی مثبت": { bg:"rgba(34,197,94,0.1)",  border:"rgba(34,197,94,0.25)",  text:"#16a34a", icon:<Sparkles size={18}/> },
  "مدیریت استرس":   { bg:"rgba(99,102,241,0.1)",  border:"rgba(99,102,241,0.25)", text:"#4f46e5", icon:<Shield size={18}/>   },
  "روابط سالم":     { bg:"rgba(249,115,22,0.1)",  border:"rgba(249,115,22,0.25)", text:"#ea580c", icon:<Heart size={18}/>    },
  "خودشناسی":       { bg:"rgba(234,179,8,0.1)",   border:"rgba(234,179,8,0.25)",  text:"#ca8a04", icon:<Star size={18}/>     },
  "بهداشت روان":    { bg:"rgba(168,85,247,0.1)",  border:"rgba(168,85,247,0.25)", text:"#9333ea", icon:<Brain size={18}/>    },
  "رشد فردی":       { bg:"rgba(236,72,153,0.1)",  border:"rgba(236,72,153,0.25)", text:"#db2777", icon:<Zap size={18}/>      },
  "هوش هیجانی":     { bg:"rgba(14,165,233,0.1)",  border:"rgba(14,165,233,0.25)", text:"#0284c7", icon:<Sun size={18}/>      },
  "ذهن‌آگاهی":      { bg:"rgba(139,92,246,0.1)",  border:"rgba(139,92,246,0.25)", text:"#7c3aed", icon:<Leaf size={18}/>     },
};

const CATEGORIES = ["همه", ...Object.keys(CATEGORY_CONFIG)];
const getCfg = (cat: string) => CATEGORY_CONFIG[cat] || { bg:"rgba(99,102,241,0.1)", border:"rgba(99,102,241,0.25)", text:"#4f46e5", icon:<BookOpen size={18}/> };

export default function ArticlesPage() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("همه");
  const [search, setSearch] = useState("");
  const todayLabel = new Date().toLocaleDateString("fa-IR", { day:"numeric", month:"long", year:"numeric" });

  useEffect(() => {
    fetch("/api/content/articles")
      .then(r => r.ok ? r.json() : null)
      .then((res: any) => {
        const data: Article[] = Array.isArray(res) ? res : (res?.data || res?.articles || []);
        if (data?.length) setAllArticles(data);
      })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let r = allArticles;
    if (activeCategory !== "همه") r = r.filter(a => a.category === activeCategory);
    if (search.trim()) r = r.filter(a => a.title.includes(search.trim()) || a.summary.includes(search.trim()));
    return r;
  }, [allArticles, activeCategory, search]);

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <PublicNavbar/>
      <div className="bg-slate-900 pt-20 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-600 rounded-full filter blur-[120px] opacity-15"/>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-600 rounded-full filter blur-[100px] opacity-10"/>
        </div>
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold text-indigo-300"
            style={{background:"rgba(99,102,241,0.15)",border:"1px solid rgba(99,102,241,0.25)"}}>
            <Brain size={14}/> مقالات روانشناسی و رشد فردی
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">کتابخانه دانش راوی</h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-3">محتوای علمی و کاربردی برای بهبود روابط، شناخت خود و رشد شخصی</p>
          <div className="flex items-center justify-center gap-2 text-slate-500 text-xs mb-8">
            <RefreshCw size={11}/><span>به‌روزرسانی روزانه — {todayLabel}</span>
          </div>
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input type="text" placeholder="جستجوی مقاله..." value={search} onChange={e=>setSearch(e.target.value)}
              className="w-full pr-11 pl-4 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500 outline-none"
              style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)"}}/>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat=>{
              const cfg = cat==="همه" ? null : getCfg(cat);
              const active = activeCategory===cat;
              return (
                <button key={cat} onClick={()=>setActiveCategory(cat)}
                  className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  style={active
                    ? {background:cfg?cfg.bg:"rgba(99,102,241,0.1)",color:cfg?cfg.text:"#4f46e5",border:`1px solid ${cfg?cfg.border:"rgba(99,102,241,0.25)"}`}
                    : {background:"transparent",color:"#64748b",border:"1px solid #e2e8f0"}}>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({length:6}).map((_,i)=>(
              <div key={i} className="rounded-3xl overflow-hidden border bg-white animate-pulse" style={{borderColor:"rgba(0,0,0,0.06)"}}>
                <div className="h-44" style={{background:"rgba(99,102,241,0.06)"}}/>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-100 rounded-full w-1/3"/>
                  <div className="h-5 bg-slate-100 rounded-full w-4/5"/>
                  <div className="h-4 bg-slate-100 rounded-full w-full"/>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length===0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={24} className="text-slate-300"/>
            </div>
            <p className="text-slate-400 font-bold">مقاله‌ای یافت نشد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(article=>{
              const cfg = getCfg(article.category);
              return (
                <Link key={article.id} href={article.url}
                  className="group rounded-3xl overflow-hidden border bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                  style={{borderColor:"rgba(0,0,0,0.06)",boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
                  <div className="h-44 flex items-center justify-center relative overflow-hidden"
                    style={{background:`linear-gradient(135deg, ${cfg.bg.replace("0.1","0.18")} 0%, ${cfg.bg} 100%)`}}>
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20" style={{background:cfg.text}}/>
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10" style={{background:cfg.text}}/>
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl relative z-10 group-hover:scale-110 transition-transform duration-300 bg-white"
                      style={{boxShadow:`0 8px 30px ${cfg.border}`}}>
                      <span style={{color:cfg.text,transform:"scale(1.8)"}}>{cfg.icon}</span>
                    </div>
                    <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-white/90" style={{color:cfg.text}}>
                      <Clock size={10}/>{article.readTime}
                    </div>
                    {article.publishedAt && (
                      <div className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/90 text-slate-500">{article.publishedAt}</div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mb-3"
                      style={{background:cfg.bg,color:cfg.text,border:`1px solid ${cfg.border}`}}>
                      <span style={{transform:"scale(0.72)"}}>{cfg.icon}</span>{article.category}
                    </span>
                    <h3 className="text-slate-800 font-black text-base mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-relaxed">{article.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{article.summary}</p>
                    <div className="flex items-center gap-1 mt-4 font-bold text-xs group-hover:gap-2 transition-all" style={{color:cfg.text}}>
                      <span>ادامه مطلب</span><ArrowLeft size={12}/>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        {!loading && filtered.length>0 && (
          <p className="text-center text-slate-400 text-xs mt-10">نمایش {filtered.length} مقاله از {allArticles.length} مقاله</p>
        )}
      </div>
      <div className="h-12"/>
    </div>
  );
}
