"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const DEFAULT_TOPICS = [
  { slug: "depression", name: "افسردگی", icon: "😔", description: "احساس غم، بی‌انگیزگی و ناامیدی" },
  { slug: "anxiety", name: "اضطراب", icon: "😰", description: "نگرانی مداوم، استرس و تنش" },
  { slug: "relationship", name: "مشکلات رابطه", icon: "💔", description: "چالش‌های عاطفی و ارتباطی" },
  { slug: "self-esteem", name: "عزت نفس", icon: "🪞", description: "احساس بی‌ارزشی و عدم اعتماد به نفس" },
  { slug: "anger", name: "مدیریت خشم", icon: "😤", description: "کنترل خشم و عصبانیت" },
  { slug: "grief", name: "سوگ و فقدان", icon: "🕊️", description: "از دست دادن عزیزان یا تجربه‌های مهم" },
  { slug: "stress", name: "استرس شغلی", icon: "💼", description: "فشار کاری و فرسودگی شغلی" },
  { slug: "sleep", name: "اختلال خواب", icon: "🌙", description: "بی‌خوابی یا مشکلات مرتبط با خواب" },
  { slug: "family", name: "مسائل خانوادگی", icon: "👨‍👩‍👧", description: "تعارضات و چالش‌های خانوادگی" },
  { slug: "addiction", name: "وابستگی", icon: "⛓️", description: "وابستگی‌های رفتاری یا مادی" },
  { slug: "identity", name: "بحران هویت", icon: "🧩", description: "سردرگمی درباره خود و مسیر زندگی" },
  { slug: "other", name: "سایر موضوعات", icon: "💬", description: "هر موضوع دیگری که ذهنتان را درگیر کرده" },
];

export default function TopicPage() {
  const router = useRouter();
  const params = useSearchParams();
  const sid = params?.get("sid") || "";
  const type = params?.get("type") || "psychologist";
  const [topics, setTopics] = useState<any[]>(DEFAULT_TOPICS);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/consultation-flow/topics?serviceType=${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d) && d.length > 0) setTopics(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [type]);

  async function next() {
    if (!selected) return;
    setSubmitting(true);
    const token = localStorage.getItem("token");
    await fetch(`${API}/api/consultation-flow/${sid}/topic`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ topicSlug: selected }),
    });
    router.push(`/dashboard/booking-flow/providers?sid=${sid}&topic=${selected}`);
  }

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-50">
            ←
          </button>
          <div>
            <p className="text-slate-500 text-xs mb-1">مرحله ۱ از ۳</p>
            <h1 className="text-2xl font-black text-slate-900">موضوع مشاوره</h1>
          </div>
        </div>
        <p className="text-slate-500 mb-6 text-sm">چه چیزی ذهنتان را درگیر کرده؟</p>

        {loading ? (
          <div className="text-slate-500 text-center py-10">در حال بارگذاری...</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {topics.map((t) => (
              <button
                key={t.slug}
                onClick={() => setSelected(t.slug)}
                className={`p-4 rounded-2xl border text-right transition-all ${
                  selected === t.slug
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-slate-200 hover:border-orange-500/30"
                }`}
                style={{ background: selected === t.slug ? undefined : "rgba(0,0,0,0.02)" }}
              >
                <div className="text-3xl mb-2">{t.icon}</div>
                <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                {t.description && (
                  <div className="text-slate-500 text-xs mt-1 leading-relaxed">{t.description}</div>
                )}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={next}
          disabled={!selected || submitting}
          className={`w-full mt-8 py-4 rounded-2xl font-black text-base transition-all ${
            selected ? "bg-orange-500 hover:bg-orange-600 text-slate-900" : "bg-slate-50 text-slate-600 cursor-not-allowed"
          }`}
        >
          {submitting ? "در حال ثبت..." : "مرحله بعد →"}
        </button>
      </div>
    </div>
  );
}
