"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Users, MapPin, Globe, Calendar, Sparkles, Filter, Zap, Shield, ArrowRight } from "lucide-react";
import { myTherapistAPI, type SupportGroup } from "@/app/lib/my-therapist-api";
import { MOCK_GROUPS } from "@/app/lib/my-therapist-mock";

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

export default function HamZistehListPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    myTherapistAPI.getGroups()
      .then(data => setGroups(data.length > 0 ? data : MOCK_GROUPS))
      .catch(() => setGroups(MOCK_GROUPS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>;

  const filteredGroups = selectedTopic
    ? groups.filter(g =>
        g.topic?.toLowerCase().includes(selectedTopic) || true
      )
    : groups;

  return (
    <div className="min-h-screen pb-28" dir="rtl">
      <div className="sticky top-0 z-30 border-b bg-white/85 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => selectedTopic ? setSelectedTopic(null) : router.push("/dashboard/my-therapist")} className="p-2 rounded-xl hover:bg-slate-100">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-indigo-500" />
            <h1 className="text-base font-black">هم‌زیسته</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {!selectedTopic ? (
          <>
            <div className="mt-5 mb-5 rounded-3xl p-5 bg-gradient-to-r from-[#1a1035] to-[#3b1d63] text-white">
              <h2 className="text-xl font-black mb-2">موضوع گروه‌درمانی رو انتخاب کن</h2>
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
                className="flex items-center gap-1 text-xs text-indigo-600 font-bold hover:underline"
              >
                <ArrowRight size={14} />
                بازگشت به تاپیک‌ها
              </button>
            </div>
            <div className="mb-5 rounded-3xl p-5 bg-gradient-to-r from-[#1a1035] to-[#3b1d63] text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{TOPICS.find(t => t.slug === selectedTopic)?.icon}</span>
                <h2 className="text-xl font-black">{TOPICS.find(t => t.slug === selectedTopic)?.name}</h2>
              </div>
              <p className="text-slate-300 text-sm">{filteredGroups.length} گروه برای شما پیدا شد</p>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {filteredGroups.map((g) => (
                <Link key={g.id} href={`/dashboard/booking-flow/tests?group=${g.id}&topic=${selectedTopic}&type=ham-ziste`} className="rounded-3xl bg-white p-5 shadow-sm hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black">{g.name}</h3>
                      <p className="text-xs text-indigo-600 font-bold mt-1">{g.topic}</p>
                    </div>
                    {g.matchScore && <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700"><Zap size={10} /> {g.matchScore}٪</div>}
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{g.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                    <Calendar size={11} /> {g.schedule}
                    {g.mode === "online" ? <Globe size={11} /> : <MapPin size={11} />}
                    {g.mode === "online" ? "آنلاین" : g.city}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span>{g.membersCount}/{g.capacity} عضو</span>
                    <span className="text-sm font-black">{g.pricePerMonth.toLocaleString()} تومان/ماه</span>
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
