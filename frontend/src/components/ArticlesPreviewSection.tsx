"use client";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Clock,
  ArrowLeft,
  Brain,
  Heart,
  Sparkles,
  Leaf,
  Zap,
  Star,
  Shield,
  Sun,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  url: string;
  publishedAt?: string;
}

const CATEGORY_CONFIG: Record<
  string,
  { bg: string; border: string; text: string; icon: React.ReactNode }
> = {
  "روانشناسی مثبت": {
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.25)",
    text: "#16a34a",
    icon: <Sparkles size={18} />,
  },
  "مدیریت استرس": {
    bg: "rgba(99,102,241,0.1)",
    border: "rgba(99,102,241,0.25)",
    text: "#4f46e5",
    icon: <Shield size={18} />,
  },
  "روابط سالم": {
    bg: "rgba(249,115,22,0.1)",
    border: "rgba(249,115,22,0.25)",
    text: "#ea580c",
    icon: <Heart size={18} />,
  },
  خودشناسی: {
    bg: "rgba(234,179,8,0.1)",
    border: "rgba(234,179,8,0.25)",
    text: "#ca8a04",
    icon: <Star size={18} />,
  },
  "بهداشت روان": {
    bg: "rgba(168,85,247,0.1)",
    border: "rgba(168,85,247,0.25)",
    text: "#9333ea",
    icon: <Brain size={18} />,
  },
  "رشد فردی": {
    bg: "rgba(236,72,153,0.1)",
    border: "rgba(236,72,153,0.25)",
    text: "#db2777",
    icon: <Zap size={18} />,
  },
  "هوش هیجانی": {
    bg: "rgba(14,165,233,0.1)",
    border: "rgba(14,165,233,0.25)",
    text: "#0284c7",
    icon: <Sun size={18} />,
  },
  ذهن‌آگاهی: {
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.25)",
    text: "#7c3aed",
    icon: <Leaf size={18} />,
  },
};

const DEFAULT_ARTICLES: Article[] = [
  {
    id: "1",
    title: "چگونه استرس روزانه را مدیریت کنیم؟",
    summary:
      "تکنیک‌های علمی و کاربردی برای کاهش استرس و افزایش آرامش در زندگی روزمره",
    category: "مدیریت استرس",
    readTime: "۵ دقیقه",
    url: "/articles/stress-management",
  },
  {
    id: "2",
    title: "هوش هیجانی و تأثیر آن بر روابط",
    summary:
      "نقش هوش هیجانی در بهبود کیفیت ارتباطات و ایجاد روابط عمیق‌تر و سالم‌تر",
    category: "هوش هیجانی",
    readTime: "۷ دقیقه",
    url: "/articles/emotional-intelligence",
  },
  {
    id: "3",
    title: "راهکارهای افزایش اعتماد به نفس",
    summary:
      "گام‌های عملی برای تقویت اعتماد به نفس و ساخت تصویر ذهنی مثبت از خود",
    category: "رشد فردی",
    readTime: "۶ دقیقه",
    url: "/articles/self-confidence",
  },
];

function getCfg(cat: string) {
  return (
    CATEGORY_CONFIG[cat] || {
      bg: "rgba(99,102,241,0.1)",
      border: "rgba(99,102,241,0.25)",
      text: "#4f46e5",
      icon: <BookOpen size={18} />,
    }
  );
}

function getDailyFromAll(all: Article[]): Article[] {
  if (!all.length) return [];
  const d = new Date();
  const seed =
    (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) %
    all.length;
  const step = Math.floor(all.length / 3);
  return [
    all[seed % all.length],
    all[(seed + step) % all.length],
    all[(seed + step * 2) % all.length],
  ];
}

export default function ArticlesPreviewSection() {
  const [articles, setArticles] = useState<Article[]>(DEFAULT_ARTICLES);
  const [loading, setLoading] = useState(true);
  const todayLabel = new Date().toLocaleDateString("fa-IR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    fetch("/api/content/articles?limit=9")
      .then((r) => (r.ok ? r.json() : null))
      .then((res: any) => {
        const data: Article[] = Array.isArray(res) ? res : (res?.data || res?.articles || []);
        const mapped = data.map((a: any) => ({
          id: a.id,
          title: a.title,
          summary: a.summary || a.excerpt || "",
          category: a.category || a.content_type || "روانشناسی",
          readTime: a.read_time || a.readTime || "۵ دقیقه",
          url: `/articles/${a.id}`,
          publishedAt: a.published_at || a.created_at,
        }));
        if (mapped.length) {
          const daily = getDailyFromAll(mapped);
          setArticles(daily.length >= 3 ? daily : mapped.slice(0, 3));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="articles-section"
      className="py-10 md:py-16 px-4 md:px-6 relative overflow-hidden bg-transparent scroll-mt-24"
      dir="rtl"
    >
      {/* subtle background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-orange-400 rounded-full filter blur-[140px] opacity-[0.05]" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-amber-400 rounded-full filter blur-[140px] opacity-[0.05]" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* ── Section Header ── */}
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <span className="text-orange-500 font-bold text-xs tracking-widest uppercase mb-3 flex items-center gap-2">
              <RefreshCw size={11} className="opacity-70" />
              رشد فردی و روانشناسی • به‌روزرسانی روزانه
            </span>

            {/* Title */}
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900">
                کتابخانه راوی
              </h2>
              <div
                className="w-9 h-9 md:w-11 md:h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #FF6B00, #FF9A3C)",
                  boxShadow: "0 4px 14px rgba(255,107,0,0.28)",
                }}
              >
                <BookOpen size={18} className="text-white" strokeWidth={2.5} />
              </div>
            </div>

            <p className="text-slate-500 text-sm md:text-base max-w-md">
              محتوای علمی و کاربردی برای بهبود روابط و رشد شخصی —{" "}
              <span className="text-orange-500 font-semibold">
                {todayLabel}
              </span>
            </p>
          </div>

          {/* desktop link */}
          <Link
            href="/articles"
            className="hidden md:flex items-center gap-2 font-bold text-sm transition-colors group"
            style={{ color: "#FF7A00" }}
          >
            همه مقالات
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
          {loading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-3xl overflow-hidden border animate-pulse"
                  style={{
                    background: "white",
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    className="h-44"
                    style={{ background: "rgba(255,107,0,0.05)" }}
                  />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-100 rounded-full w-1/3" />
                    <div className="h-5 bg-slate-100 rounded-full w-4/5" />
                    <div className="h-4 bg-slate-100 rounded-full w-full" />
                  </div>
                </div>
              ))
            : articles.map((article, idx) => {
                const cfg = getCfg(article.category);
                return (
                  <Link
                    key={article.id}
                    href={article.url}
                    className="group rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                    style={{
                      background: "white",
                      borderColor: "rgba(0,0,0,0.06)",
                      boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      className="h-44 flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${cfg.bg.replace("0.1", "0.18")} 0%, ${cfg.bg} 100%)`,
                      }}
                    >
                      <div
                        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
                        style={{ background: cfg.text }}
                      />
                      <div
                        className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
                        style={{ background: cfg.text }}
                      />
                      <div
                        className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl relative z-10 group-hover:scale-110 transition-transform duration-300"
                        style={{
                          background: "white",
                          boxShadow: `0 8px 30px ${cfg.border}`,
                        }}
                      >
                        <span
                          style={{ color: cfg.text, transform: "scale(1.8)" }}
                        >
                          {cfg.icon}
                        </span>
                      </div>
                      <div
                        className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold"
                        style={{
                          background: "rgba(255,255,255,0.92)",
                          color: cfg.text,
                        }}
                      >
                        <Clock size={10} />
                        {article.readTime}
                      </div>
                      <div
                        className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                        style={{
                          background: cfg.bg,
                          color: cfg.text,
                          border: `1px solid ${cfg.border}`,
                        }}
                      >
                        {idx + 1}
                      </div>
                    </div>

                    <div className="p-5">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mb-3"
                        style={{
                          background: cfg.bg,
                          color: cfg.text,
                          border: `1px solid ${cfg.border}`,
                        }}
                      >
                        <span style={{ transform: "scale(0.72)" }}>
                          {cfg.icon}
                        </span>
                        {article.category}
                      </span>
                      <h3 className="text-slate-800 font-black text-base mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                        {article.summary}
                      </p>
                      <div
                        className="flex items-center gap-1 mt-4 text-xs font-bold group-hover:gap-2 transition-all"
                        style={{ color: cfg.text }}
                      >
                        <span>ادامه مطلب</span>
                        <ArrowLeft size={12} />
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>

        {/* mobile button */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #FF6B00, #FF9A3C)",
              boxShadow: "0 6px 20px rgba(255,107,0,0.28)",
            }}
          >
            مشاهده همه مقالات
            <ArrowLeft size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
