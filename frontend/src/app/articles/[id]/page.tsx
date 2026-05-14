"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Clock, Eye, BookOpen, Share2, Sparkles, ExternalLink } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  "مدیریت استرس":"مدیریت استرس","هوش هیجانی":"هوش هیجانی","رشد فردی":"رشد فردی",
  "ذهن‌آگاهی":"ذهن‌آگاهی","روابط سالم":"روابط سالم","روانشناسی مثبت":"روانشناسی مثبت",
  "خودشناسی":"خودشناسی","بهداشت روان":"بهداشت روان",
};

const CARD = {
  background:"linear-gradient(145deg,#1B2A4A 0%,#132038 100%)",
  border:"1px solid rgba(255,255,255,0.07)",
  boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
};

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/content/articles/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setArticle(data))
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#0f172a"}}>
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  if (!article) return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl" style={{background:"#0f172a"}}>
      <div className="text-center">
        <BookOpen size={48} className="text-slate-600 mx-auto mb-4"/>
        <p className="text-slate-400 mb-4">مقاله یافت نشد</p>
        <Link href="/articles" className="text-orange-400 hover:text-orange-300">بازگشت به کتابخانه</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-28 relative" dir="rtl" style={{background:"linear-gradient(160deg,#0b1526,#0f172a)"}}>
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <Link href="/articles" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors">
          <ArrowRight size={16}/> کتابخانه راوی
        </Link>
        <div className="rounded-3xl p-5 mb-4" style={CARD}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{background:"rgba(255,107,0,0.15)",color:"rgba(255,107,0,0.9)",border:"1px solid rgba(255,107,0,0.2)"}}>
              {CATEGORY_LABELS[article.category] || article.category}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <Sparkles size={10} className="text-orange-400"/> محتوای تخصصی
            </span>
          </div>
          <h1 className="text-lg font-black text-white leading-snug mb-3">{article.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1"><Eye size={10}/>{(article.view_count||0).toLocaleString("fa-IR")}</span>
              <span className="flex items-center gap-1"><Clock size={10}/>{article.readTime}</span>
              {article.publishedAt && <span>{article.publishedAt}</span>}
            </div>
            <button onClick={()=>navigator.clipboard?.writeText(window.location.href)} className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors">
              <Share2 size={12}/> اشتراک
            </button>
          </div>
        </div>

        <div className="rounded-3xl p-5 mb-4" style={CARD}>
          <div className="text-sm leading-loose text-slate-200" style={{lineHeight:"2"}}>
            {article.content?.split("\n").map((line: string, i: number) => {
              if (line.startsWith("## ")) return <h2 key={i} className="text-base font-black text-white mt-5 mb-2">{line.replace("## ","")}</h2>;
              if (/^\*\*.+\*\*$/.test(line)) return <p key={i} className="font-bold text-orange-300 mb-1">{line.replace(/\*\*/g,"")}</p>;
              if (line.match(/^\d+\./)) return <p key={i} className="mb-1 text-slate-300">{line}</p>;
              if (!line.trim()) return <br key={i}/>;
              return <p key={i} className="mb-2">{line}</p>;
            })}
          </div>
        </div>

        {article.source_reference && (
          <div className="rounded-2xl px-4 py-3 mb-4" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div className="flex items-center gap-2">
              <ExternalLink size={12} className="text-slate-500"/>
              <p className="text-[11px] text-slate-500">{article.source_reference}</p>
            </div>
          </div>
        )}

        {article.tags && (
          <div className="flex gap-2 flex-wrap mb-5">
            {article.tags.map((tag: string) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full" style={{background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",border:"1px solid rgba(255,255,255,0.08)"}}>#{tag}</span>
            ))}
          </div>
        )}

        <Link href="/events" className="block rounded-3xl p-4 text-center" style={{background:"linear-gradient(135deg,rgba(255,107,0,0.2),rgba(255,107,0,0.05))",border:"1px solid rgba(255,107,0,0.2)"}}>
          <p className="text-sm font-bold text-orange-300 mb-1">آماده تجربه ارتباط واقعی هستی؟</p>
          <p className="text-xs text-slate-400">همین حالا در یک دورهمی شرکت کن ←</p>
        </Link>
      </div>
    </div>
  );
}
