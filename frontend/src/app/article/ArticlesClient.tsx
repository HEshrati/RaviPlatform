"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Eye, ChevronLeft, Sparkles } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  attachment: "سبک دلبستگی", communication: "ارتباط مؤثر",
  emotion: "هوش هیجانی", social: "مهارت اجتماعی",
  psychology: "روان‌شناسی", relationship: "روابط انسانی",
};
const CATEGORY_BADGE: Record<string, { bg: string; text: string }> = {
  attachment: { bg: "#e9d5ff", text: "#6b21a8" }, communication: { bg: "#bfdbfe", text: "#1e40af" },
  emotion: { bg: "#fecaca", text: "#991b1b" }, social: { bg: "#bbf7d0", text: "#14532d" },
  psychology: { bg: "#fed7aa", text: "#9a3412" }, relationship: { bg: "#fce7f3", text: "#9d174d" },
};

function formatDate(dateStr: string) {
  try { return new Date(dateStr).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" }); }
  catch { return ""; }
}

export default function ArticlesClient({ articles }: { articles: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = ["all", ...Array.from(new Set(articles.map((a) => a.category)))];
  const filtered = selectedCategory === "all" ? articles : articles.filter((a) => a.category === selectedCategory);

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {categories.map((cat) => {
          const badge = CATEGORY_BADGE[cat];
          const isActive = selectedCategory === cat;
          return (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: isActive ? (cat === "all" ? "#FF6B00" : badge?.bg || "#FF6B00") : "rgba(255,255,255,0.08)", color: isActive ? (cat === "all" ? "white" : badge?.text || "white") : "rgba(255,255,255,0.65)", border: "1px solid", borderColor: isActive ? "transparent" : "rgba(255,255,255,0.12)" }}>
              {cat === "all" ? "همه" : CATEGORY_LABELS[cat] || cat}
            </button>
          );
        })}
      </div>
      <div className="space-y-5">
        {filtered.map((article, index) => {
          const badge = CATEGORY_BADGE[article.category] || { bg: "#e2e8f0", text: "#1e293b" };
          return (
            <Link key={article.id} href={`/articles/${article.id}`}>
              <div className="rounded-3xl overflow-hidden hover:scale-[1.015] transition-all duration-300 cursor-pointer group"
                style={{ background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}>
                <div className="relative w-full overflow-hidden" style={{ height: 200 }}>
                  <img src={article.image_url || `/images/articles/default.jpg`} alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(30,41,59,0.35) 0%, rgba(11,16,40,0.92) 100%)" }} />
                  <div className="absolute top-3 right-3">
                    <span className="text-[11px] font-black px-3 py-1 rounded-full shadow-sm" style={{ background: badge.bg, color: badge.text }}>
                      {CATEGORY_LABELS[article.category] || article.category}
                    </span>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] text-white font-bold flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: "rgba(255,107,0,0.85)" }}>
                        <Sparkles size={10} /> جدیدترین
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-sm font-black text-white mb-2 leading-snug group-hover:text-orange-300 transition-colors line-clamp-2">{article.title}</h2>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">{article.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1"><Eye size={11} />{article.view_count?.toLocaleString("fa-IR")}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{formatDate(article.published_at)}</span>
                    </div>
                    <ChevronLeft size={16} className="text-orange-400 group-hover:translate-x-[-4px] transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
