#!/bin/bash
# =============================================================
# راوی — اسکریپت اعمال سکشن مقالات
# اجرا از ریشه پروژه: bash apply-articles.sh
# =============================================================

set -e
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✔ $1${NC}"; }
info() { echo -e "${YELLOW}→ $1${NC}"; }
fail() { echo -e "${RED}✘ $1${NC}"; exit 1; }

# بررسی اینکه داخل پروژه Next.js هستیم
[ -f "next.config.js" ] || [ -f "next.config.ts" ] || [ -f "next.config.mjs" ] || [ -f "package.json" ] || [ -d "app" ] \
  || fail "این اسکریپت باید از ریشه پروژه Next.js اجرا بشه"

info "ساخت پوشه‌های لازم..."
mkdir -p app/api/articles/psychology
mkdir -p app/articles
mkdir -p components
ok "پوشه‌ها آماده‌ان"

# ─────────────────────────────────────────────
# 1. API Route
# ─────────────────────────────────────────────
info "نوشتن API Route..."
cat > app/api/articles/psychology/route.ts << 'ROUTE_EOF'
import { NextResponse } from "next/server";

export const revalidate = 86400;

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  url: string;
  publishedAt: string;
}

const ARTICLES_POOL: Article[] = [
  { id: "1",  title: "چگونه استرس روزانه را مدیریت کنیم؟",       summary: "تکنیک‌های علمی و کاربردی برای کاهش استرس و افزایش آرامش در زندگی روزمره. از تنفس عمیق تا مدیریت زمان، همه چیز را بیاموزید.",   category: "مدیریت استرس",    readTime: "۵ دقیقه", url: "/articles/stress-management",      publishedAt: "۱۴۰۴/۲/۱"  },
  { id: "2",  title: "هوش هیجانی و تأثیر آن بر روابط",           summary: "نقش هوش هیجانی در بهبود کیفیت ارتباطات و ایجاد روابط عمیق‌تر. چگونه احساسات خود و دیگران را بهتر بشناسیم؟",                   category: "هوش هیجانی",      readTime: "۷ دقیقه", url: "/articles/emotional-intelligence", publishedAt: "۱۴۰۴/۲/۲"  },
  { id: "3",  title: "راهکارهای افزایش اعتماد به نفس",           summary: "گام‌های عملی برای تقویت اعتماد به نفس و ساخت تصویر ذهنی مثبت از خود. از تغییر الگوهای فکری تا اقدام عملی.",                    category: "رشد فردی",        readTime: "۶ دقیقه", url: "/articles/self-confidence",        publishedAt: "۱۴۰۴/۲/۳"  },
  { id: "4",  title: "ذهن‌آگاهی: کلید آرامش در دنیای پرشتاب",   summary: "مدیتیشن و تکنیک‌های ذهن‌آگاهی برای کاهش اضطراب و بهبود تمرکز. چگونه در لحظه حال زندگی کنیم؟",                               category: "ذهن‌آگاهی",      readTime: "۸ دقیقه", url: "/articles/mindfulness",            publishedAt: "۱۴۰۴/۲/۴"  },
  { id: "5",  title: "چگونه روابط سالم‌تری بسازیم؟",             summary: "اصول ارتباط مؤثر و راهکارهای ایجاد پیوندهای عمیق و معنادار. مرزهای سالم، ارتباط صادقانه و احترام متقابل.",                     category: "روابط سالم",      readTime: "۶ دقیقه", url: "/articles/healthy-relationships",  publishedAt: "۱۴۰۴/۲/۵"  },
  { id: "6",  title: "قدرت روانشناسی مثبت در زندگی روزمره",      summary: "چگونه تمرکز بر نقاط قوت و احساسات مثبت می‌تواند کیفیت زندگی را متحول کند. علم پشت خوش‌بینی و شادی.",                         category: "روانشناسی مثبت", readTime: "۵ دقیقه", url: "/articles/positive-psychology",    publishedAt: "۱۴۰۴/۲/۶"  },
  { id: "7",  title: "خودشناسی: سفری به درون",                    summary: "ابزارها و روش‌های شناخت بهتر خود، ارزش‌ها، باورها و الگوهای رفتاری. آیا واقعاً خودت را می‌شناسی؟",                              category: "خودشناسی",        readTime: "۹ دقیقه", url: "/articles/self-awareness",         publishedAt: "۱۴۰۴/۲/۷"  },
  { id: "8",  title: "بهداشت روان در عصر دیجیتال",                summary: "تأثیر شبکه‌های اجتماعی بر سلامت روان و راهکارهای حفظ تعادل در دنیای آنلاین. فاصله‌گیری سالم از فضای مجازی.",               category: "بهداشت روان",     readTime: "۷ دقیقه", url: "/articles/digital-mental-health",  publishedAt: "۱۴۰۴/۲/۸"  },
  { id: "9",  title: "مرزگذاری سالم در روابط",                    summary: "چرا مرزها مهم هستند و چگونه بدون احساس گناه مرزهای سالم تعیین کنیم. احترام به خود از طریق نه گفتن.",                            category: "روابط سالم",      readTime: "۶ دقیقه", url: "/articles/healthy-boundaries",     publishedAt: "۱۴۰۴/۲/۹"  },
  { id: "10", title: "اضطراب و راه‌های غلبه بر آن",               summary: "درک ریشه‌های اضطراب و تکنیک‌های CBT برای مدیریت نگرانی‌های روزانه. وقتی ذهن نمی‌تواند آرام بگیرد.",                           category: "بهداشت روان",     readTime: "۸ دقیقه", url: "/articles/anxiety-management",     publishedAt: "۱۴۰۴/۲/۱۰" },
  { id: "11", title: "عادت‌های افراد موفق و شاد",                 summary: "الگوهای رفتاری مشترک در افراد شاد و موفق. از روتین صبحگاهی تا نحوه تعامل با شکست‌ها.",                                         category: "رشد فردی",        readTime: "۷ دقیقه", url: "/articles/habits-of-happy-people", publishedAt: "۱۴۰۴/۲/۱۱" },
  { id: "12", title: "هنر گوش دادن فعال",                         summary: "مهارتی که روابط را متحول می‌کند. چگونه واقعاً بشنویم، نه فقط منتظر صحبت کردن باشیم. تمرین‌های عملی.",                         category: "روابط سالم",      readTime: "۵ دقیقه", url: "/articles/active-listening",       publishedAt: "۱۴۰۴/۲/۱۲" },
  { id: "13", title: "رشد پس از شکست: هنر رزیلیانس",             summary: "چگونه از شکست‌ها یاد بگیریم و قوی‌تر بازگردیم. علم رزیلیانس و روش‌های تقویت آن.",                                             category: "رشد فردی",        readTime: "۶ دقیقه", url: "/articles/resilience",             publishedAt: "۱۴۰۴/۲/۱۳" },
  { id: "14", title: "ارتباط مؤثر در دنیای مدرن",                 summary: "مهارت‌های ارتباطی در عصر دیجیتال. چگونه در دنیای پر از نوتیفیکیشن، واقعاً ارتباط برقرار کنیم؟",                                category: "روابط سالم",      readTime: "۷ دقیقه", url: "/articles/effective-communication",publishedAt: "۱۴۰۴/۲/۱۴" },
  { id: "15", title: "ترس از تنها ماندن و راهکارهای آن",          summary: "اتوفوبیا یا ترس از تنهایی چیست و چگونه می‌توان با آن کنار آمد. تمایز بین تنهایی و انزوا.",                                    category: "بهداشت روان",     readTime: "۸ دقیقه", url: "/articles/fear-of-loneliness",     publishedAt: "۱۴۰۴/۲/۱۵" },
  { id: "16", title: "خودمراقبتی: اولویت دادن به خود",            summary: "چرا خودمراقبتی خودخواهی نیست. روش‌های عملی برای حفظ سلامت روحی و جسمی در دنیای پرمشغله.",                                    category: "بهداشت روان",     readTime: "۵ دقیقه", url: "/articles/self-care",              publishedAt: "۱۴۰۴/۲/۱۶" },
  { id: "17", title: "شکرگزاری و تأثیر آن بر مغز",               summary: "علم پشت شکرگزاری. چگونه تمرین روزانه قدردانی می‌تواند ساختار مغز و کیفیت زندگی را تغییر دهد.",                                 category: "روانشناسی مثبت", readTime: "۶ دقیقه", url: "/articles/gratitude",              publishedAt: "۱۴۰۴/۲/۱۷" },
  { id: "18", title: "قدرت گفت‌وگوی درونی مثبت",                  summary: "صدایی که درون سرمان است بیشترین تأثیر را بر زندگی ما دارد. چگونه منتقد درونی را به حامی تبدیل کنیم.",                          category: "خودشناسی",        readTime: "۷ دقیقه", url: "/articles/positive-self-talk",     publishedAt: "۱۴۰۴/۲/۱۸" },
  { id: "19", title: "مدیریت خشم: بیان، نه سرکوب",               summary: "خشم یک احساس طبیعی است. تفاوت بین ابراز سالم خشم و رفتار پرخاشگرانه. تکنیک‌های مدیریت خشم.",                                  category: "هوش هیجانی",      readTime: "۶ دقیقه", url: "/articles/anger-management",       publishedAt: "۱۴۰۴/۲/۱۹" },
  { id: "20", title: "اهمال‌کاری: دشمن پنهان موفقیت",            summary: "ریشه‌های روانشناختی اهمال‌کاری و راه‌های عملی برای غلبه بر آن. چرا می‌دانیم باید انجام دهیم اما نمی‌دهیم؟",                 category: "رشد فردی",        readTime: "۸ دقیقه", url: "/articles/procrastination",        publishedAt: "۱۴۰۴/۲/۲۰" },
];

function getDailyArticles(): Article[] {
  const now = new Date();
  const dayIndex = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const seed = dayIndex % ARTICLES_POOL.length;
  const step = Math.floor(ARTICLES_POOL.length / 3);
  return [
    ARTICLES_POOL[seed % ARTICLES_POOL.length],
    ARTICLES_POOL[(seed + step) % ARTICLES_POOL.length],
    ARTICLES_POOL[(seed + step * 2) % ARTICLES_POOL.length],
  ];
}

export async function GET() {
  const allArticles = [...ARTICLES_POOL].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return NextResponse.json(allArticles, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      "X-Daily-Featured": getDailyArticles().map((a) => a.id).join(","),
    },
  });
}

export async function POST() {
  return NextResponse.json(getDailyArticles());
}
ROUTE_EOF
ok "API Route نوشته شد → app/api/articles/psychology/route.ts"

# ─────────────────────────────────────────────
# 2. ArticlesPreviewSection Component
# ─────────────────────────────────────────────
info "نوشتن ArticlesPreviewSection..."
cat > components/ArticlesPreviewSection.tsx << 'PREVIEW_EOF'
"use client";
import { useEffect, useState } from "react";
import { BookOpen, Clock, ArrowLeft, Brain, Heart, Sparkles, Leaf, Zap, Star, Shield, Sun, RefreshCw } from "lucide-react";
import Link from "next/link";

interface Article {
  id: string; title: string; summary: string; category: string;
  readTime: string; url: string; publishedAt?: string;
}

const CATEGORY_CONFIG: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  "روانشناسی مثبت": { bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.25)",  text: "#16a34a", icon: <Sparkles size={18}/> },
  "مدیریت استرس":   { bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.25)", text: "#4f46e5", icon: <Shield size={18}/>   },
  "روابط سالم":     { bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.25)", text: "#ea580c", icon: <Heart size={18}/>    },
  "خودشناسی":       { bg: "rgba(234,179,8,0.1)",   border: "rgba(234,179,8,0.25)",  text: "#ca8a04", icon: <Star size={18}/>     },
  "بهداشت روان":    { bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.25)", text: "#9333ea", icon: <Brain size={18}/>    },
  "رشد فردی":       { bg: "rgba(236,72,153,0.1)",  border: "rgba(236,72,153,0.25)", text: "#db2777", icon: <Zap size={18}/>      },
  "هوش هیجانی":     { bg: "rgba(14,165,233,0.1)",  border: "rgba(14,165,233,0.25)", text: "#0284c7", icon: <Sun size={18}/>      },
  "ذهن‌آگاهی":      { bg: "rgba(139,92,246,0.1)",  border: "rgba(139,92,246,0.25)", text: "#7c3aed", icon: <Leaf size={18}/>     },
};

const DEFAULT_ARTICLES: Article[] = [
  { id:"1", title:"چگونه استرس روزانه را مدیریت کنیم؟", summary:"تکنیک‌های علمی و کاربردی برای کاهش استرس و افزایش آرامش در زندگی روزمره", category:"مدیریت استرس", readTime:"۵ دقیقه", url:"/articles/stress-management" },
  { id:"2", title:"هوش هیجانی و تأثیر آن بر روابط",    summary:"نقش هوش هیجانی در بهبود کیفیت ارتباطات و ایجاد روابط عمیق‌تر و سالم‌تر", category:"هوش هیجانی",  readTime:"۷ دقیقه", url:"/articles/emotional-intelligence" },
  { id:"3", title:"راهکارهای افزایش اعتماد به نفس",    summary:"گام‌های عملی برای تقویت اعتماد به نفس و ساخت تصویر ذهنی مثبت از خود",      category:"رشد فردی",    readTime:"۶ دقیقه", url:"/articles/self-confidence" },
];

function getCfg(cat: string) {
  return CATEGORY_CONFIG[cat] || { bg:"rgba(99,102,241,0.1)", border:"rgba(99,102,241,0.25)", text:"#4f46e5", icon:<BookOpen size={18}/> };
}

function getDailyFromAll(all: Article[]): Article[] {
  if (!all.length) return [];
  const d = new Date();
  const seed = (d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate()) % all.length;
  const step = Math.floor(all.length/3);
  return [all[seed%all.length], all[(seed+step)%all.length], all[(seed+step*2)%all.length]];
}

export default function ArticlesPreviewSection() {
  const [articles, setArticles] = useState<Article[]>(DEFAULT_ARTICLES);
  const [loading, setLoading] = useState(true);
  const todayLabel = new Date().toLocaleDateString("fa-IR", { day:"numeric", month:"long", year:"numeric" });

  useEffect(() => {
    fetch("/api/articles/psychology")
      .then(r => r.ok ? r.json() : null)
      .then((data: Article[]|null) => {
        if (data?.length) {
          const daily = getDailyFromAll(data);
          setArticles(daily.length >= 3 ? daily : data.slice(0,3));
        }
      })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden bg-transparent" dir="rtl">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-indigo-600 rounded-full filter blur-[130px] opacity-[0.07]"/>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-600 rounded-full filter blur-[130px] opacity-[0.07]"/>
      </div>
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <span className="text-indigo-500 font-bold text-xs tracking-widest uppercase mb-3 flex items-center gap-2">
              <RefreshCw size={11} className="opacity-70"/>
              رشد فردی و روانشناسی • به‌روزرسانی روزانه
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-3">مقالات تخصصی راوی</h2>
            <p className="text-slate-500 text-sm md:text-base max-w-md">
              محتوای علمی و کاربردی برای بهبود روابط و رشد شخصی —{" "}
              <span className="text-indigo-400 font-semibold">{todayLabel}</span>
            </p>
          </div>
          <Link href="/articles" className="hidden md:flex items-center gap-2 text-indigo-600 font-bold text-sm hover:text-indigo-500 transition-colors group">
            همه مقالات
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {loading ? [1,2,3].map(i=>(
            <div key={i} className="rounded-3xl overflow-hidden border animate-pulse" style={{background:"white",borderColor:"rgba(0,0,0,0.06)"}}>
              <div className="h-44" style={{background:"rgba(99,102,241,0.06)"}}/>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-100 rounded-full w-1/3"/>
                <div className="h-5 bg-slate-100 rounded-full w-4/5"/>
                <div className="h-4 bg-slate-100 rounded-full w-full"/>
              </div>
            </div>
          )) : articles.map((article,idx)=>{
            const cfg = getCfg(article.category);
            return (
              <Link key={article.id} href={article.url}
                className="group rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                style={{background:"white",borderColor:"rgba(0,0,0,0.06)",boxShadow:"0 2px 20px rgba(0,0,0,0.06)"}}>
                <div className="h-44 flex items-center justify-center relative overflow-hidden"
                  style={{background:`linear-gradient(135deg, ${cfg.bg.replace("0.1","0.18")} 0%, ${cfg.bg} 100%)`}}>
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20" style={{background:cfg.text}}/>
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10" style={{background:cfg.text}}/>
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl relative z-10 group-hover:scale-110 transition-transform duration-300"
                    style={{background:"white",boxShadow:`0 8px 30px ${cfg.border}`}}>
                    <span style={{color:cfg.text,transform:"scale(1.8)"}}>{cfg.icon}</span>
                  </div>
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold"
                    style={{background:"rgba(255,255,255,0.92)",color:cfg.text}}>
                    <Clock size={10}/>{article.readTime}
                  </div>
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                    style={{background:cfg.bg,color:cfg.text,border:`1px solid ${cfg.border}`}}>{idx+1}</div>
                </div>
                <div className="p-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mb-3"
                    style={{background:cfg.bg,color:cfg.text,border:`1px solid ${cfg.border}`}}>
                    <span style={{transform:"scale(0.72)"}}>{cfg.icon}</span>{article.category}
                  </span>
                  <h3 className="text-slate-800 font-black text-base mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{article.summary}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs font-bold group-hover:gap-2 transition-all" style={{color:cfg.text}}>
                    <span>ادامه مطلب</span><ArrowLeft size={12}/>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/articles" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{background:"linear-gradient(135deg, #6366f1, #8b5cf6)"}}>
            مشاهده همه مقالات<ArrowLeft size={14}/>
          </Link>
        </div>
      </div>
    </section>
  );
}
PREVIEW_EOF
ok "ArticlesPreviewSection نوشته شد → components/ArticlesPreviewSection.tsx"

# ─────────────────────────────────────────────
# 3. Articles Page
# ─────────────────────────────────────────────
info "نوشتن صفحه مقالات..."
cat > app/articles/page.tsx << 'ARTICLES_EOF'
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
    fetch("/api/articles/psychology")
      .then(r => r.ok ? r.json() : null)
      .then((data: Article[]|null) => { if (data?.length) setAllArticles(data); })
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
ARTICLES_EOF
ok "صفحه مقالات نوشته شد → app/articles/page.tsx"

# ─────────────────────────────────────────────
# 4. Patch app/page.tsx  (اضافه کردن ArticlesPreviewSection قبل از Footer)
# ─────────────────────────────────────────────
info "اعمال تغییرات روی app/page.tsx..."
PAGE="app/page.tsx"

# بررسی اینکه import قبلاً هست یا نه
if grep -q "ArticlesPreviewSection" "$PAGE"; then
  ok "import ArticlesPreviewSection قبلاً در $PAGE موجوده — رد شد"
else
  # اضافه کردن import بعد از آخرین import
  sed -i "s|import Reveal from \"@/components/Reveal\";|import Reveal from \"@/components/Reveal\";\nimport ArticlesPreviewSection from \"@/components/ArticlesPreviewSection\";|" "$PAGE"

  # اضافه کردن سکشن قبل از Footer
  sed -i 's|      {/\* Footer \*/}|      {/* Articles Preview Section */}\n      <Reveal as="div" direction="up">\n        <ArticlesPreviewSection />\n      <\/Reveal>\n\n      {/* Footer */}|' "$PAGE"

  ok "app/page.tsx آپدیت شد"
fi

# ─────────────────────────────────────────────
# خلاصه
# ─────────────────────────────────────────────
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✔ همه فایل‌ها با موفقیت اعمال شدند!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  📁 فایل‌های ایجاد/تغییر یافته:"
echo "     app/api/articles/psychology/route.ts"
echo "     components/ArticlesPreviewSection.tsx"
echo "     app/articles/page.tsx"
echo "     app/page.tsx"
echo ""
echo "  🚀 برای اجرا:"
echo "     npm run dev    یا    npm run build && npm start"
echo ""
