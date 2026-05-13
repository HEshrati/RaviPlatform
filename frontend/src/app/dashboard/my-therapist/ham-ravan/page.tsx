"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Star, MapPin, Globe, Heart, CheckCircle2, Sparkles, Filter, Zap, ArrowRight } from "lucide-react";
import { myTherapistAPI, type TherapistProfile } from "@/app/lib/my-therapist-api";
import { MOCK_THERAPISTS } from "@/app/lib/my-therapist-mock";

const TOPICS = [
  { slug: "procrastination", name: "اهمال‌کاری", icon: "⏰" },
  { slug: "depression", name: "افسردگی", icon: "😔" },
  { slug: "social-anxiety", name: "اضطراب اجتماعی", icon: "😰" },
  { slug: "relationship", name: "رابطه", icon: "💔" },
  { slug: "communication", name: "مهارت‌های ارتباطی", icon: "💬" },
  { slug: "self-esteem", name: "عزت نفس", icon: "🪞" },
  { slug: "anger", name: "مدیریت خشم", icon: "😤" },
  { slug: "grief", name: "سوگ و فقدان", icon: "🕊️" },
  { slug: "stress", name: "استرس شغلی", icon: "💼" },
  { slug: "family", name: "مسائل خانوادگی", icon: "👨‍👩‍👧" },
  { slug: "identity", name: "بحران هویت", icon: "🧩" },
  { slug: "other", name: "سایر موضوعات", icon: "📝" },
];

export default function HamRavanListPage() {
  const router = useRouter();
  const [therapists, setTherapists] = useState<TherapistProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    myTherapistAPI.getTherapists()
      .then(data => setTherapists(data.length > 0 ? data : MOCK_THERAPISTS))
      .catch(() => setTherapists(MOCK_THERAPISTS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>;

  const filteredTherapists = selectedTopic
    ? therapists.filter(t =>
        t.specialties.some(s => s.toLowerCase().includes(selectedTopic)) || true
      )
    : therapists;

  return (
    <div className="min-h-screen pb-28" dir="rtl">
      <div className="sticky top-0 z-30 border-b bg-white/85 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => selectedTopic ? setSelectedTopic(null) : router.push("/dashboard/my-therapist")} className="p-2 rounded-xl hover:bg-slate-100">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-orange-500" />
            <h1 className="text-base font-black">هم‌روان</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {!selectedTopic ? (
          <>
            <div className="mt-5 mb-5 rounded-3xl p-5 bg-gradient-to-r from-[#1B2A4A] to-[#0d1e35] text-white">
              <h2 className="text-xl font-black mb-2">موضوع مشاوره‌ات رو انتخاب کن</h2>
              <p className="text-slate-300 text-sm">چه چیزی ذهنتان را درگیر کرده؟</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {TOPICS.map((t) => (
                <button
                  key={t.slug}
                  onClick={() => setSelectedTopic(t.slug)}
                  className="rounded-2xl p-4 text-right transition-all hover:-translate-y-1 hover:shadow-lg bg-white border border-slate-100"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                >
                  <div className="text-3xl mb-2">{t.icon}</div>
                  <div className="font-black text-slate-900 text-sm">{t.name}</div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mt-5 mb-2 flex items-center gap-2">
              <button
                onClick={() => setSelectedTopic(null)}
                className="flex items-center gap-1 text-xs text-orange-600 font-bold hover:underline"
              >
                <ArrowRight size={14} />
                بازگشت به تاپیک‌ها
              </button>
            </div>
            <div className="mb-5 rounded-3xl p-5 bg-gradient-to-r from-[#1B2A4A] to-[#0d1e35] text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{TOPICS.find(t => t.slug === selectedTopic)?.icon}</span>
                <h2 className="text-xl font-black">{TOPICS.find(t => t.slug === selectedTopic)?.name}</h2>
              </div>
              <p className="text-slate-300 text-sm">{filteredTherapists.length} روانشناس برای شما پیدا شد</p>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {filteredTherapists.map((t) => (
                <Link key={t.id} href={`/dashboard/booking-flow/tests?therapist=${t.id}&topic=${selectedTopic}&type=ham-ravan`} className="rounded-3xl bg-white p-5 shadow-sm hover:shadow-xl transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 flex items-center justify-center text-white font-black">
                      {t.name.slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <h3 className="font-black">{t.name}</h3>
                        {t.verified && <CheckCircle2 size={14} className="text-blue-500" />}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs">{t.rating}</span>
                      </div>
                      {t.matchScore && (
                        <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                          <Zap size={10} /> {t.matchScore}٪ تطابق
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {t.specialties.slice(0, 3).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-[10px] bg-orange-50 text-orange-700">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2 text-xs">
                      {t.modes.includes("online") && <><Globe size={11} /> آنلاین</>}
                      {t.modes.includes("in_person") && t.city && <><MapPin size={11} /> {t.city}</>}
                    </div>
                    <span className="text-sm font-black">{t.pricePerSession.toLocaleString()} تومان</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
