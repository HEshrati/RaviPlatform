"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  BookOpen,
  Clock,
  Eye,
  ChevronLeft,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  view_count: number;
  published_at: string;
  image_url?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  attachment: "سبک دلبستگی",
  communication: "ارتباط مؤثر",
  emotion: "هوش هیجانی",
  social: "مهارت اجتماعی",
  psychology: "روان‌شناسی",
  relationship: "روابط انسانی",
};

// رنگ badge هر دسته‌بندی — متن تیره روی پس‌زمینه روشن
const CATEGORY_BADGE: Record<string, { bg: string; text: string }> = {
  attachment: { bg: "#e9d5ff", text: "#6b21a8" },
  communication: { bg: "#bfdbfe", text: "#1e40af" },
  emotion: { bg: "#fecaca", text: "#991b1b" },
  social: { bg: "#bbf7d0", text: "#14532d" },
  psychology: { bg: "#fed7aa", text: "#9a3412" },
  relationship: { bg: "#fce7f3", text: "#9d174d" },
};

// تصاویر ثابت Unsplash براساس موضوع مقاله
const CATEGORY_IMAGES: Record<string, string> = {
  attachment:
    "/images/raavi-placeholder-1.svg",
  communication:
    "/images/raavi-placeholder-2.svg",
  emotion:
    "/images/raavi-placeholder-3.svg",
  social:
    "/images/raavi-placeholder-4.svg",
  psychology:
    "/images/raavi-placeholder-5.svg",
  relationship:
    "/images/raavi-placeholder-6.svg",
  // fallback
  default:
    "/images/raavi-placeholder-1.svg",
};

// رنگ گرادیانت overlay روی تصویر، متناسب با دسته‌بندی
const CATEGORY_GRADIENT: Record<string, string> = {
  attachment:
    "linear-gradient(180deg, rgba(107,33,168,0.35) 0%, rgba(11,16,40,0.92) 100%)",
  communication:
    "linear-gradient(180deg, rgba(30,64,175,0.35) 0%, rgba(11,16,40,0.92) 100%)",
  emotion:
    "linear-gradient(180deg, rgba(153,27,27,0.35) 0%, rgba(11,16,40,0.92) 100%)",
  social:
    "linear-gradient(180deg, rgba(20,83,45,0.35)  0%, rgba(11,16,40,0.92) 100%)",
  psychology:
    "linear-gradient(180deg, rgba(154,52,18,0.35) 0%, rgba(11,16,40,0.92) 100%)",
  relationship:
    "linear-gradient(180deg, rgba(157,23,77,0.35) 0%, rgba(11,16,40,0.92) 100%)",
  default:
    "linear-gradient(180deg, rgba(30,41,59,0.35)  0%, rgba(11,16,40,0.92) 100%)",
};

const SAMPLE_ARTICLES: Article[] = [
  {
    id: "sample-1",
    title: "سبک‌های دلبستگی و تأثیر آن بر روابط بزرگسالی",
    summary:
      "تحقیقات نشان می‌دهد که الگوهای دلبستگی در دوران کودکی، تأثیر عمیقی بر کیفیت روابط ما در بزرگسالی دارند. درک این الگوها می‌تواند اولین قدم برای بهبود روابط باشد...",
    category: "attachment",
    tags: ["دلبستگی", "روابط", "روان‌شناسی"],
    view_count: 342,
    published_at: new Date().toISOString(),
  },
  {
    id: "sample-2",
    title: "گوش دادن فعال: هنر شنیدن که رابطه می‌سازد",
    summary:
      "در دنیایی پر از حواس‌پرتی، توانایی گوش دادن واقعی به دیگران تبدیل به یک مهارت نادر و ارزشمند شده است. مطالعات روان‌شناسی نشان می‌دهد که احساس شنیده‌شدن...",
    category: "communication",
    tags: ["ارتباط", "مهارت", "گوش دادن"],
    view_count: 218,
    published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "sample-3",
    title: "درون‌گراها و برون‌گراها: همکاری یا تضاد؟",
    summary:
      "برخلاف باور رایج، درون‌گرایی و برون‌گرایی دو قطب مجزا نیستند بلکه یک طیف پیوسته هستند. تحقیقات جدید نشان می‌دهد که بهترین گروه‌های اجتماعی...",
    category: "psychology",
    tags: ["شخصیت", "گروه", "تعامل"],
    view_count: 156,
    published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "sample-4",
    title: "هوش هیجانی در روابط بین‌فردی",
    summary:
      "هوش هیجانی (EQ) یکی از مهم‌ترین عوامل موفقیت در روابط اجتماعی است. مجله Nature Human Behaviour در تحقیق اخیر خود نشان داد که افراد با EQ بالا...",
    category: "emotion",
    tags: ["هوش هیجانی", "روابط", "خودآگاهی"],
    view_count: 289,
    published_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "sample-5",
    title: "چرا دوستی‌های عمیق نادر و ارزشمندند؟",
    summary:
      "تحقیقات علوم اجتماعی نشان می‌دهد که اکثر افراد در طول زندگی تنها ۳ تا ۵ دوست واقعی دارند. این محدودیت ریشه در ظرفیت شناختی مغز انسان دارد...",
    category: "social",
    tags: ["دوستی", "اجتماعی", "روابط"],
    view_count: 195,
    published_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: "sample-6",
    title: "زبان عشق: پنج روش که با آن‌ها محبت ابراز می‌کنیم",
    summary:
      "گری چپمن در کتاب معروف خود نشان داد که افراد محبت را به پنج شکل متفاوت بیان و دریافت می‌کنند. درک زبان عشق خود و دیگران می‌تواند تحول‌آفرین باشد...",
    category: "relationship",
    tags: ["زبان عشق", "صمیمیت", "ارتباط"],
    view_count: 412,
    published_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
];

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function getArticleImage(article: Article): string {
  if (article.image_url) return article.image_url;
  return CATEGORY_IMAGES[article.category] || CATEGORY_IMAGES.default;
}

function getOverlayGradient(category: string): string {
  return CATEGORY_GRADIENT[category] || CATEGORY_GRADIENT.default;
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const badge = CATEGORY_BADGE[article.category] || {
    bg: "#e2e8f0",
    text: "#1e293b",
  };
  const imgSrc = getArticleImage(article);
  const overlay = getOverlayGradient(article.category);

  return (
    <Link href={`/articles/${article.id}`}>
      <div
        className="rounded-3xl overflow-hidden hover:scale-[1.015] transition-all duration-300 cursor-pointer group"
        style={{
          background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
        }}
      >
        {/* ── تصویر مقاله ── */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: 200 }}
        >
          <img
            src={imgSrc}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* گرادیانت overlay */}
          <div className="absolute inset-0" style={{ background: overlay }} />

          {/* badge دسته‌بندی روی تصویر */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span
              className="text-[11px] font-black px-3 py-1 rounded-full shadow-sm"
              style={{ background: badge.bg, color: badge.text }}
            >
              {CATEGORY_LABELS[article.category] || article.category}
            </span>
          </div>

          {/* نشان جدیدترین */}
          {index === 0 && (
            <div className="absolute top-3 left-3">
              <span
                className="text-[10px] text-white font-bold flex items-center gap-1 px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(255,107,0,0.85)",
                  border: "1px solid rgba(255,107,0,0.5)",
                }}
              >
                <Sparkles size={10} />
                جدیدترین
              </span>
            </div>
          )}
        </div>

        {/* ── متن مقاله ── */}
        <div className="p-5">
          <h2 className="text-sm font-black text-white mb-2 leading-snug group-hover:text-orange-300 transition-colors line-clamp-2">
            {article.title}
          </h2>

          <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
            {article.summary}
          </p>

          {/* footer کارت */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Eye size={11} />
                {article.view_count.toLocaleString("fa-IR")}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {formatDate(article.published_at)}
              </span>
            </div>
            <ChevronLeft
              size={16}
              className="text-orange-400 group-hover:translate-x-[-4px] transition-transform"
            />
          </div>

          {/* تگ‌ها */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {article.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.45)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetch(`${API_URL}/api/articles?limit=20`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.items?.length > 0) setArticles(data.items);
        else setArticles(SAMPLE_ARTICLES);
      })
      .catch(() => setArticles(SAMPLE_ARTICLES))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    selectedCategory === "all"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const categories = [
    "all",
    ...Array.from(new Set(articles.map((a) => a.category))),
  ];

  return (
    <div
      className="min-h-screen pb-28 relative"
      dir="rtl"
      style={{ background: "#090e1c" }}
    >
      <AnimatedBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-4">
        {/* بازگشت */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors"
        >
          <ArrowRight size={16} /> بازگشت
        </Link>

        {/* هدر */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255,107,0,0.2)" }}
            >
              <BookOpen size={20} className="text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">مجله راوی</h1>
              <p className="text-xs text-slate-400">محتوای علمی روان‌شناختی</p>
            </div>
          </div>

          <div
            className="rounded-2xl px-4 py-3 mt-3"
            style={{
              background: "rgba(255,107,0,0.06)",
              border: "1px solid rgba(255,107,0,0.12)",
            }}
          >
            <p className="text-xs text-slate-300 leading-relaxed">
              <Sparkles size={12} className="inline text-orange-400 ml-1" />
              مقالات این بخش با هوش مصنوعی از منابع علمی معتبر (Nature, PubMed)
              تولید و توسط تیم راوی بررسی می‌شود
            </p>
          </div>
        </div>

        {/* فیلتر دسته‌بندی */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {categories.map((cat) => {
            const badge = CATEGORY_BADGE[cat];
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: isActive
                    ? cat === "all"
                      ? "#FF6B00"
                      : badge?.bg || "#FF6B00"
                    : "rgba(255,255,255,0.08)",
                  color: isActive
                    ? cat === "all"
                      ? "white"
                      : badge?.text || "white"
                    : "rgba(255,255,255,0.65)",
                  border: "1px solid",
                  borderColor: isActive
                    ? "transparent"
                    : "rgba(255,255,255,0.12)",
                  boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.25)" : "none",
                }}
              >
                {cat === "all" ? "همه" : CATEGORY_LABELS[cat] || cat}
              </button>
            );
          })}
        </div>

        {/* مقالات */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden animate-pulse"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <div className="h-48 bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/06 rounded w-full" />
                  <div className="h-3 bg-white/06 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">مقاله‌ای در این دسته‌بندی یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
}
