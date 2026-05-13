"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  ArrowRight, Clock, Eye, BookOpen, Share2,
  Sparkles, ExternalLink,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const CATEGORY_LABELS: Record<string, string> = {
  attachment: "سبک دلبستگی",
  communication: "ارتباط مؤثر",
  emotion: "هوش هیجانی",
  social: "مهارت اجتماعی",
  psychology: "روان‌شناسی",
  relationship: "روابط انسانی",
};

const CARD_STYLE = {
  background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)",
  border: "1px solid rgba(255,255,255,0.07)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
};

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch { return ""; }
}

// Article sample for fallback
const SAMPLE_CONTENT = {
  "sample-1": {
    id: "sample-1",
    title: "سبک‌های دلبستگی و تأثیر آن بر روابط بزرگسالی",
    content: `## مقدمه

سبک‌های دلبستگی، الگوهایی هستند که در دوران کودکی شکل می‌گیرند و تا سال‌ها بر نحوه ارتباط ما با دیگران تأثیر می‌گذارند. تحقیقات اولیه جان بالبی و مری اینزورث نشان داد که کیفیت رابطه کودک با مراقب اصلی، پایه‌ای برای روابط آینده او می‌شود.

## سه سبک اصلی دلبستگی

**دلبستگی ایمن:** افراد با این سبک احساس امنیت در روابط دارند. آن‌ها به راحتی به دیگران اعتماد می‌کنند و در عین حال استقلال خود را حفظ می‌کنند.

**دلبستگی اضطرابی:** این افراد نگران طرد شدن هستند و نیاز مداوم به تأیید دارند. روابط را با شدت بیشتری تجربه می‌کنند.

**دلبستگی اجتنابی:** این افراد تمایل به فاصله عاطفی دارند و از صمیمیت عمیق اجتناب می‌کنند.

## کاربرد در دورهمی‌های اجتماعی

درک سبک دلبستگی خود می‌تواند در محیط‌های اجتماعی مثل دورهمی‌های راوی بسیار مفید باشد. افرادی که سبک اضطرابی دارند ممکن است در اولین جلسه آرام‌تر باشند، در حالی که افراد با سبک ایمن معمولاً راحت‌تر ارتباط برقرار می‌کنند.

## نتیجه‌گیری

هیچ سبک دلبستگی‌ای ثابت و تغییرناپذیر نیست. با آگاهی و کمک از روابط سالم، می‌توان الگوهای ناسالم را تغییر داد.`,
    category: "attachment",
    tags: ["دلبستگی", "روابط", "روان‌شناسی"],
    view_count: 342,
    published_at: new Date().toISOString(),
    source_reference: "منابع: Bowlby (1969), Ainsworth (1978), Hazan & Shaver (1987)",
  },
};

export default function ArticleDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // اگر نمونه داریم
    if (SAMPLE_CONTENT[id as keyof typeof SAMPLE_CONTENT]) {
      setArticle(SAMPLE_CONTENT[id as keyof typeof SAMPLE_CONTENT]);
      setLoading(false);
      return;
    }
    
    fetch(`${API_URL}/api/articles/${id}`)
      .then((r) => r.json())
      .then((data) => setArticle(data))
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    if (navigator.share && article) {
      await navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <BookOpen size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">مقاله یافت نشد</p>
          <Link href="/articles" className="text-orange-400 hover:text-orange-300">
            بازگشت به مجله
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 relative" dir="rtl">
      <AnimatedBackground />
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-4">
        {/* Navigation */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors"
        >
          <ArrowRight size={16} /> مجله راوی
        </Link>

        {/* Article header */}
        <div className="rounded-3xl p-5 mb-4" style={CARD_STYLE}>
          {/* Category + AI badge */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(255,107,0,0.15)",
                color: "rgba(255,107,0,0.9)",
                border: "1px solid rgba(255,107,0,0.2)",
              }}
            >
              {CATEGORY_LABELS[article.category] || article.category}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <Sparkles size={10} className="text-orange-400" />
              تولید شده با AI
            </span>
          </div>

          <h1 className="text-lg font-black text-white leading-snug mb-3">
            {article.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Eye size={10} />
                {(article.view_count || 0).toLocaleString("fa-IR")}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {formatDate(article.published_at)}
              </span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors"
            >
              <Share2 size={12} />
              اشتراک
            </button>
          </div>
        </div>

        {/* Article content */}
        <div className="rounded-3xl p-5 mb-4" style={CARD_STYLE}>
          <div
            className="prose prose-invert max-w-none text-sm leading-loose text-slate-200"
            style={{
              lineHeight: "2",
            }}
          >
            {article.content?.split("\n").map((line: string, i: number) => {
              if (line.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-base font-black text-white mt-5 mb-2"
                  >
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={i} className="font-bold text-orange-300 mb-1">
                    {line.replace(/\*\*/g, "")}
                  </p>
                );
              }
              if (!line.trim()) return <br key={i} />;
              return (
                <p key={i} className="mb-2">
                  {line}
                </p>
              );
            })}
          </div>
        </div>

        {/* منبع */}
        {article.source_reference && (
          <div
            className="rounded-2xl px-4 py-3 mb-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-2">
              <ExternalLink size={12} className="text-slate-500" />
              <p className="text-[11px] text-slate-500">{article.source_reference}</p>
            </div>
          </div>
        )}

        {/* تگ‌ها */}
        {article.tags && (
          <div className="flex gap-2 flex-wrap mb-5">
            {article.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* لینک به رویدادها */}
        <Link
          href="/events"
          className="block rounded-3xl p-4 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(255,107,0,0.2), rgba(255,107,0,0.05))",
            border: "1px solid rgba(255,107,0,0.2)",
          }}
        >
          <p className="text-sm font-bold text-orange-300 mb-1">
            آماده تجربه ارتباط واقعی هستی؟
          </p>
          <p className="text-xs text-slate-400">همین حالا در یک دورهمی شرکت کن ←</p>
        </Link>
      </div>
    </div>
  );
}
