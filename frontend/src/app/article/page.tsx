import Link from "next/link";
import { BookOpen, Clock, Eye, ChevronLeft, Sparkles, ArrowRight } from "lucide-react";
import ArticlesClient from "./ArticlesClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const SAMPLE_ARTICLES = [
  { id: "sample-1", title: "سبک‌های دلبستگی و تأثیر آن بر روابط بزرگسالی", summary: "تحقیقات نشان می‌دهد که الگوهای دلبستگی در دوران کودکی، تأثیر عمیقی بر کیفیت روابط ما در بزرگسالی دارند.", category: "attachment", tags: ["دلبستگی", "روابط"], view_count: 342, published_at: new Date().toISOString() },
  { id: "sample-2", title: "گوش دادن فعال: هنر شنیدن که رابطه می‌سازد", summary: "در دنیایی پر از حواس‌پرتی، توانایی گوش دادن واقعی به دیگران تبدیل به یک مهارت نادر شده است.", category: "communication", tags: ["ارتباط", "مهارت"], view_count: 218, published_at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "sample-3", title: "هوش هیجانی در روابط بین‌فردی", summary: "هوش هیجانی یکی از مهم‌ترین عوامل موفقیت در روابط اجتماعی است.", category: "emotion", tags: ["هوش هیجانی", "روابط"], view_count: 289, published_at: new Date(Date.now() - 86400000 * 7).toISOString() },
];

export const revalidate = 60; // هر ۶۰ ثانیه cache رفرش میشه

export default async function ArticlesPage() {
  let articles = SAMPLE_ARTICLES;
  try {
    const res = await fetch(`${API_URL}/api/ai-content/articles?limit=20`, { next: { revalidate: 60 } });
    const data = await res.json();
    if (data?.items?.length > 0) articles = data.items;
  } catch {}

  return (
    <div className="min-h-screen pb-28 relative" dir="rtl" style={{ background: "#090e1c" }}>
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-4">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors">
          <ArrowRight size={16} /> بازگشت
        </Link>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,107,0,0.2)" }}>
              <BookOpen size={20} className="text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">مجله راوی</h1>
              <p className="text-xs text-slate-400">محتوای علمی روان‌شناختی</p>
            </div>
          </div>
          <div className="rounded-2xl px-4 py-3 mt-3" style={{ background: "rgba(255,107,0,0.06)", border: "1px solid rgba(255,107,0,0.12)" }}>
            <p className="text-xs text-slate-300 leading-relaxed">
              <Sparkles size={12} className="inline text-orange-400 ml-1" />
              مقالات این بخش با هوش مصنوعی از منابع علمی معتبر تولید و توسط تیم راوی بررسی می‌شود
            </p>
          </div>
        </div>
        <ArticlesClient articles={articles} />
      </div>
    </div>
  );
}
