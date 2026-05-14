"use client";
import { useEffect, useState } from "react";
import { BookOpen, Brain, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  url: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "روانشناسی مثبت": "rgba(34,197,94,0.15)",
  "مدیریت استرس": "rgba(99,102,241,0.15)",
  "روابط سالم": "rgba(249,115,22,0.15)",
  "خودشناسی": "rgba(234,179,8,0.15)",
  "بهداشت روان": "rgba(168,85,247,0.15)",
  "رشد فردی": "rgba(236,72,153,0.15)",
  "هوش هیجانی": "rgba(14,165,233,0.15)",
  "ذهن‌آگاهی": "rgba(139,92,246,0.15)",
};

const DEFAULT_ARTICLES: Article[] = [
  { id: "1", title: "چگونه استرس روزانه را مدیریت کنیم؟", summary: "تکنیک‌های علمی و کاربردی برای کاهش استرس و افزایش آرامش در زندگی روزمره", category: "مدیریت استرس", readTime: "۵ دقیقه", url: "/articles/stress-management" },
  { id: "2", title: "هوش هیجانی و تأثیر آن بر روابط", summary: "نقش هوش هیجانی در بهبود کیفیت ارتباطات و ایجاد روابط سالم‌تر", category: "هوش هیجانی", readTime: "۷ دقیقه", url: "/articles/emotional-intelligence" },
  { id: "3", title: "راهکارهای افزایش اعتماد به نفس", summary: "گام‌های عملی برای تقویت اعتماد به نفس و ساخت تصویر ذهنی مثبت از خود", category: "رشد فردی", readTime: "۶ دقیقه", url: "/articles/self-confidence" },
];

export default function PsychologyArticles() {
  const [articles, setArticles] = useState<Article[]>(DEFAULT_ARTICLES);

  useEffect(() => {
    fetch("/api/articles/psychology")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length) setArticles(data.slice(0, 3)); })
      .catch(() => {});
  }, []);

  return (
    <div className="rounded-3xl p-6 border border-white/8" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.03) 100%)" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}>
            <Brain size={20} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-white font-black text-base">مقالات روانشناسی</h2>
            <p className="text-slate-400 text-xs">مطالب روزانه برای رشد فردی</p>
          </div>
        </div>
        <Link href="/articles" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
          همه مقالات <ArrowLeft size={12} />
        </Link>
      </div>
      <div className="space-y-3">
        {articles.map(article => (
          <Link key={article.id} href={article.url} className="block rounded-2xl p-4 transition-all hover:scale-[1.02]" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: CATEGORY_COLORS[article.category] || "rgba(99,102,241,0.15)" }}>
                <BookOpen size={16} className="text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm mb-1">{article.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-2">{article.summary}</p>
                <span className="text-slate-500 text-[10px] flex items-center gap-1"><Clock size={10} />{article.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-white/8">
        <p className="text-center text-slate-500 text-[10px]">به‌روزرسانی روزانه • آخرین مقالات روانشناسی</p>
      </div>
    </div>
  );
}
