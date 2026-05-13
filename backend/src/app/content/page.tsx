"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Eye, BookOpen, Sparkles, Tag } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Article {
  id: string;
  title: string;
  summary: string;
  body: string;
  topic: string;
  tags: string[];
  reading_time_minutes: number;
  view_count: number;
  published_at: string;
}

const CARD_STYLE = {
  background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
};

export default function ContentPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Article | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchArticles();
  }, [page]);

  async function fetchArticles() {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/content/articles?page=${page}&limit=9`
      );
      const data = await res.json();
      setArticles(data.data || []);
      setTotal(data.total || 0);
    } catch {
      // fallback mock data
      setArticles(MOCK_ARTICLES);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(d: string) {
    try {
      return new Date(d).toLocaleDateString("fa-IR", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }

  if (selected) {
    return <ArticleDetail article={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #0D1B2A 0%, #0A1628 100%)" }}
      dir="rtl"
    >
      {/* هدر */}
      <div className="px-4 pt-8 pb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-4">
          <Sparkles size={16} className="text-orange-400" />
          <span className="text-orange-400 text-sm font-medium">محتوای هوشمند</span>
        </div>
        <h1 className="text-2xl font-black text-white mb-2">
          دانش روانشناسی روابط
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          مقالات علمی و کاربردی درباره ارتباط موثر، هوش هیجانی و رشد اجتماعی
        </p>
      </div>

      {/* مقالات */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-5 animate-pulse"
                style={CARD_STYLE}
              >
                <div className="h-4 bg-white/10 rounded mb-3 w-3/4" />
                <div className="h-3 bg-white/10 rounded mb-2" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500">هنوز مقاله‌ای منتشر نشده</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelected(article)}
                className="text-right rounded-2xl p-5 transition-all hover:scale-[1.02] hover:border-orange-500/30"
                style={{
                  ...CARD_STYLE,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
              >
                {/* تگ موضوع */}
                {article.topic && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full mb-3">
                    <Tag size={10} />
                    {article.topic}
                  </span>
                )}

                <h3 className="text-white font-bold text-sm leading-relaxed mb-2 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3">
                  {article.summary}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {article.reading_time_minutes} دقیقه
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={11} />
                      {article.view_count}
                    </span>
                  </div>
                  <span>{formatDate(article.published_at)}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* صفحه‌بندی */}
        {total > 9 && (
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl text-sm text-white bg-white/10 hover:bg-white/20 disabled:opacity-40 transition"
            >
              قبلی
            </button>
            <span className="px-4 py-2 text-slate-400 text-sm">
              صفحه {page} از {Math.ceil(total / 9)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / 9)}
              className="px-4 py-2 rounded-xl text-sm text-white bg-white/10 hover:bg-white/20 disabled:opacity-40 transition"
            >
              بعدی
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleDetail({
  article,
  onBack,
}: {
  article: Article;
  onBack: () => void;
}) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #0D1B2A 0%, #0A1628 100%)" }}
      dir="rtl"
    >
      <div className="max-w-2xl mx-auto px-4 py-8 pb-20">
        {/* برگشت */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowRight size={18} />
          <span className="text-sm">بازگشت به مقالات</span>
        </button>

        {/* سرمقاله */}
        {article.topic && (
          <span className="inline-flex items-center gap-1 text-[11px] text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-full mb-4">
            <Tag size={10} />
            {article.topic}
          </span>
        )}

        <h1 className="text-xl font-black text-white leading-relaxed mb-3">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {article.reading_time_minutes} دقیقه مطالعه
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {article.view_count} بازدید
          </span>
        </div>

        {/* خلاصه */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{
            background: "rgba(255,107,0,0.08)",
            border: "1px solid rgba(255,107,0,0.2)",
          }}
        >
          <p className="text-orange-200 text-sm leading-relaxed">{article.summary}</p>
        </div>

        {/* متن مقاله */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="text-slate-300 text-sm leading-8 whitespace-pre-line">
            {article.body}
          </div>
        </div>

        {/* تگ‌ها */}
        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// داده نمونه برای fallback
const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "هنر گوش دادن فعال: چطور واقعاً بشنویم",
    summary: "گوش دادن فعال یکی از مهم‌ترین مهارت‌های ارتباطی است که می‌تواند روابط ما را متحول کند.",
    body: "در دنیای پرهیاهوی امروز، بسیاری از ما فقط منتظریم که نوبت صحبتمان برسد، نه اینکه واقعاً بشنویم...\n\nگوش دادن فعال یعنی توجه کامل به گوینده، نه فقط با گوش‌هایمان، بلکه با تمام وجود. این مهارت شامل تماس چشمی مناسب، زبان بدن باز، و پرسیدن سوال‌های روشنگر است.\n\nپژوهش‌ها نشان می‌دهند افرادی که به خوبی گوش می‌دهند، روابط عمیق‌تر و رضایت‌بخش‌تری دارند.",
    topic: "ارتباط موثر",
    tags: ["ارتباط", "روانشناسی", "مهارت اجتماعی"],
    reading_time_minutes: 4,
    view_count: 234,
    published_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "سبک‌های دلبستگی و تأثیر آن بر روابط بزرگسالی",
    summary: "سبک دلبستگی که در کودکی شکل می‌گیرد، نقش مهمی در چگونگی روابط بزرگسالانه ما دارد.",
    body: "سبک‌های دلبستگی توسط روانپزشک بریتانیایی جان بولبی مطرح شدند و بعدها توسط مری آینزورث گسترش یافت...\n\nچهار سبک اصلی وجود دارد: ایمن، اضطرابی، اجتنابی، و سازمان‌نیافته. هر کدام از این سبک‌ها الگوهای خاصی در روابط ایجاد می‌کنند.",
    topic: "سبک‌های دلبستگی",
    tags: ["دلبستگی", "روانشناسی رشد", "روابط"],
    reading_time_minutes: 6,
    view_count: 456,
    published_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "هوش هیجانی: کلید موفقیت در روابط اجتماعی",
    summary: "هوش هیجانی توانایی تشخیص، درک و مدیریت احساسات خود و دیگران است.",
    body: "دانیل گلمن، روانپزشک و نویسنده مشهور، معتقد است هوش هیجانی بیشتر از IQ در موفقیت زندگی تأثیر دارد...\n\nهوش هیجانی شامل پنج مؤلفه اصلی است: خودآگاهی، خودمدیریتی، انگیزش، همدلی، و مهارت‌های اجتماعی.",
    topic: "هوش هیجانی",
    tags: ["هوش هیجانی", "EQ", "مهارت اجتماعی"],
    reading_time_minutes: 5,
    view_count: 312,
    published_at: new Date(Date.now() - 172800000).toISOString(),
  },
];
