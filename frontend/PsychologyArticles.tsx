"use client";
import PsychologyArticles from "@/components/PsychologyArticles";

import { useEffect, useState } from "react";
import { BookOpen, TrendingUp, Brain, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  image?: string;
  url: string;
  publishedAt: string;
}

const PSYCHOLOGY_TOPICS = [
  "روانشناسی مثبت",
  "مدیریت استرس",
  "روابط سالم",
  "خودشناسی",
  "بهداشت روان",
  "رشد فردی",
  "هوش هیجانی",
  "ذهن‌آگاهی",
];

// رنگ‌های دسته‌بندی
const CATEGORY_COLORS: Record<string, string> = {
  "روانشناسی مثبت": "rgba(34,197,94,0.15)",
  "مدیریت استرس": "rgba(99,102,241,0.15)",
  "روابط سالم": "rgba(249,115,22,0.15)",
  خودشناسی: "rgba(234,179,8,0.15)",
  "بهداشت روان": "rgba(168,85,247,0.15)",
  "رشد فردی": "rgba(236,72,153,0.15)",
  "هوش هیجانی": "rgba(14,165,233,0.15)",
  ذهن‌آگاهی: "rgba(139,92,246,0.15)",
};

export default function PsychologyArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      setLoading(true);
      setError(null);

      // استفاده از API راوی برای دریافت مقالات یا استفاده از داده‌های استاتیک
      const response = await fetch("/api/articles/psychology");

      if (!response.ok) {
        throw new Error("خطا در دریافت مقالات");
      }

      const data = await response.json();
      setArticles(data.slice(0, 3)); // فقط 3 مقاله اول
    } catch (err) {
      console.error("Error fetching articles:", err);
      // در صورت خطا، مقالات پیش‌فرض را نمایش می‌دهیم
      setArticles(getDefaultArticles());
    } finally {
      setLoading(false);
    }
  }

  function getDefaultArticles(): Article[] {
    const today = new Date().toISOString().split("T")[0];

    return [
      {
        id: "1",
        title: "چگونه استرس روزانه را مدیریت کنیم؟",
        summary:
          "تکنیک‌های علمی و کاربردی برای کاهش استرس و افزایش آرامش در زندگی روزمره",
        category:
          PSYCHOLOGY_TOPICS[
            Math.floor(Math.random() * PSYCHOLOGY_TOPICS.length)
          ],
        readTime: "۵ دقیقه",
        url: "/articles/stress-management",
        publishedAt: today,
      },
      {
        id: "2",
        title: "هوش هیجانی و تأثیر آن بر روابط",
        summary: "نقش هوش هیجانی در بهبود کیفیت ارتباطات و ایجاد روابط سالم‌تر",
        category:
          PSYCHOLOGY_TOPICS[
            Math.floor(Math.random() * PSYCHOLOGY_TOPICS.length)
          ],
        readTime: "۷ دقیقه",
        url: "/articles/emotional-intelligence",
        publishedAt: today,
      },
      {
        id: "3",
        title: "راهکارهای افزایش اعتماد به نفس",
        summary:
          "گام‌های عملی برای تقویت اعتماد به نفس و ساخت تصویر ذهنی مثبت از خود",
        category:
          PSYCHOLOGY_TOPICS[
            Math.floor(Math.random() * PSYCHOLOGY_TOPICS.length)
          ],
        readTime: "۶ دقیقه",
        url: "/articles/self-confidence",
        publishedAt: today,
      },
    ];
  }

  if (loading) {
    return (
      <div
        className="rounded-3xl p-6 border border-white/8"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center animate-pulse"
            style={{ background: "rgba(99,102,241,0.15)" }}
          >
            <Brain size={20} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-white font-black text-base">
              مقالات روانشناسی
            </h2>
            <p className="text-slate-400 text-xs">در حال بارگذاری...</p>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/5 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return null; // در صورت خطا، چیزی نمایش نمی‌دهیم
  }

  return (
    <div
      className="rounded-3xl p-6 border border-white/8"
      style={{
        background:
          "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.03) 100%)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(99,102,241,0.2)",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
          >
            <Brain size={20} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-white font-black text-base">
              مقالات روانشناسی
            </h2>
            <p className="text-slate-400 text-xs">مطالب روزانه برای رشد فردی</p>
          </div>
        </div>
        <Link
          href="/articles"
          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          همه مقالات
          <ArrowLeft size={12} />
        </Link>
      </div>

      <div className="space-y-3">
        {articles.map((article, index) => (
          <Link
            key={article.id}
            href={article.url}
            className="block rounded-2xl p-4 transition-all hover:scale-[1.02] group"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    CATEGORY_COLORS[article.category] ||
                    "rgba(99,102,241,0.15)",
                  border: `1px solid ${CATEGORY_COLORS[article.category]?.replace("0.15", "0.3") || "rgba(99,102,241,0.3)"}`,
                }}
              >
                <BookOpen size={18} className="text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm mb-1 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-2">
                  {article.summary}
                </p>
                <div className="flex items-center gap-3 text-[10px]">
                  <span
                    className="px-2 py-0.5 rounded-full font-bold"
                    style={{
                      background:
                        CATEGORY_COLORS[article.category] ||
                        "rgba(99,102,241,0.15)",
                      color: "rgba(129,140,248,0.9)",
                    }}
                  >
                    {article.category}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock size={10} />
                    {article.readTime}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/8">
        <p className="text-center text-slate-500 text-[10px]">
          به‌روزرسانی روزانه • آخرین مقالات روانشناسی
        </p>
      </div>
    </div>
  );
}
