"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles, Heart, ChevronLeft, Search,
  MapPin, Clock, Lock, PartyPopper, Calendar,
} from "lucide-react";
import type { ApiEvent } from "@/lib/api";

const FUN_CATEGORIES = [
  { id: "hamneshin",  title: "همنشین",   emoji: "🤝", desc: "دورهمی امن و گرم با آدم‌های هم‌فرکانس" },
  { id: "hamsohbat",  title: "هم‌صحبت",  emoji: "💬", desc: "گفتگوهای عمیق و صمیمی" },
  { id: "hambazi",    title: "هم‌بازی",   emoji: "🎲", desc: "بردگیم و بازی‌های گروهی" },
  { id: "hampa",      title: "هم‌پا",     emoji: "🚶", desc: "پیاده‌روی و گردش در طبیعت" },
  { id: "hamamooz",   title: "هم‌آموز",  emoji: "📚", desc: "یادگیری مهارت‌های جدید" },
  { id: "hamkar",     title: "همکار",    emoji: "💼", desc: "همکاری در پروژه‌های مشترک" },
  { id: "hamfekr",    title: "هم‌فکر",   emoji: "💡", desc: "تبادل ایده با ذهن‌های خلاق" },
  { id: "hamteymi",   title: "هم‌تیمی",  emoji: "⚽", desc: "فعالیت‌های ورزشی و تیمی" },
  { id: "hamghesse",  title: "هم‌قصه",   emoji: "📖", desc: "خواندن و نوشتن داستان" },
];

const THERAPY_OPTIONS = [
  {
    id: "ham-ravan", title: "هم‌روان", subtitle: "یک به یک", emoji: "💜",
    desc: "ارتباط با نوروان‌شناس برای ارزیابی، تشخیص اولیه و مشاوره فردی در فضایی کاملاً محرمانه.",
    href: "/dashboard/my-therapist/ham-ravan",
    gradient: "linear-gradient(135deg,#1B2A4A 0%,#2d4263 60%,#FF6B00 100%)",
    badgeColor: "#FF6B00",
    features: ["گفت‌وگو محرمانه", "تبیین مسئله توسط متخصص", "راهنمایی تخصصی"],
  },
  {
    id: "ham-ziste", title: "هم‌زیسته", subtitle: "گروه‌درمانی", emoji: "🌿",
    desc: "گروه‌های حمایتی پیوسته با تجربه مشترک، هدایت‌شده توسط روان‌درمانگر متخصص.",
    href: "/dashboard/my-therapist/ham-ziste",
    gradient: "linear-gradient(135deg,#1a1035 0%,#3b1d63 60%,#6366f1 100%)",
    badgeColor: "#6366f1",
    features: ["تجربه مشترک با همدلان", "هدایت توسط متخصص", "تمرین مهارت گروهی"],
  },
];

type HubKey = "fun" | "therapy";

interface Props {
  initialEvents: ApiEvent[];
  userName?: string;
}

export default function EventsClient({ initialEvents, userName = "دوست راوی" }: Props) {
  const router = useRouter();
  const [activeHub, setActiveHub] = useState<HubKey>("fun");
  const [search, setSearch] = useState("");

  const eventCountByCategory = useMemo(
    () => initialEvents.reduce<Record<string, number>>((acc, ev) => {
      const c = (ev as any).category || ev.event_type;
      if (c) acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {}),
    [initialEvents]
  );

  const filteredEvents = useMemo(
    () => search
      ? initialEvents.filter((e) => e.title?.toLowerCase().includes(search.toLowerCase()))
      : initialEvents,
    [initialEvents, search]
  );

  return (
    <div className="min-h-screen pb-28" dir="rtl">
      <div className="sticky top-0 z-30 border-b border-slate-100/30 shadow-sm"
        style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push("/")} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,107,0,0.1)" }}>
              <Sparkles size={16} className="text-orange-500" />
            </div>
            <h1 className="text-base font-black text-slate-900">همنشینی‌ها</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="mt-5 mb-6 relative rounded-3xl overflow-hidden p-6 lg:p-8"
          style={{ background: "linear-gradient(135deg,#1B2A4A 0%,#0d1e35 60%,#1a1035 100%)" }}>
          <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle,#FF6B00,transparent)", transform: "translate(30%,-30%)" }} />
          <div className="relative z-10">
            <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight mb-2">
              سلام {userName}، چه نوع تجربه‌ای می‌خوای؟
            </h2>
            <p className="text-slate-300 text-sm lg:text-base leading-relaxed max-w-2xl">
              راوی دو دنیا برایت ساخته: یکی برای دوستی و سرگرمی، و یکی برای آرامش و رشد با کمک متخصص.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-7">
          {[
            { key: "fun" as HubKey, emoji: "🎉", title: "سرگرمی و دورهمی", sub: "۹ نوع همنشینی برای دوستی و تفریح", label: "گزینه اول", activeColor: "linear-gradient(135deg,#FF6B00 0%,#FF9A3C 100%)", shadow: "rgba(255,107,0,0.35)", border: "#FF6B00" },
            { key: "therapy" as HubKey, emoji: "💜", title: "دوست روانشناس من", sub: "جلسات تخصصی فردی و گروهی", label: "گزینه دوم", activeColor: "linear-gradient(135deg,#4f46e5 0%,#818cf8 100%)", shadow: "rgba(99,102,241,0.35)", border: "#4f46e5" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveHub(tab.key)}
              className="group relative rounded-3xl overflow-hidden transition-all duration-300 text-right"
              style={activeHub === tab.key
                ? { background: tab.activeColor, boxShadow: `0 12px 32px ${tab.shadow}`, transform: "translateY(-2px)", border: `2px solid ${tab.border}` }
                : { background: "white", border: "2px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
              <div className="p-5 lg:p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: activeHub === tab.key ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.04)" }}>
                  {tab.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold mb-0.5" style={{ color: activeHub === tab.key ? "rgba(255,255,255,0.8)" : "#94a3b8" }}>{tab.label}</div>
                  <h3 className="text-lg lg:text-xl font-black mb-0.5" style={{ color: activeHub === tab.key ? "white" : "#0f172a" }}>{tab.title}</h3>
                  <p className="text-xs lg:text-sm" style={{ color: activeHub === tab.key ? "rgba(255,255,255,0.85)" : "#64748b" }}>{tab.sub}</p>
                </div>
                {activeHub === tab.key && <ChevronLeft size={20} className="text-white flex-shrink-0" />}
              </div>
            </button>
          ))}
        </div>

        {activeHub === "fun" && <FunHub categories={FUN_CATEGORIES} events={filteredEvents} search={search} setSearch={setSearch} countByCat={eventCountByCategory} />}
        {activeHub === "therapy" && <TherapyHub />}
      </div>
    </div>
  );
}

function FunHub({ categories, events, search, setSearch, countByCat }: {
  categories: typeof FUN_CATEGORIES; events: ApiEvent[];
  search: string; setSearch: (v: string) => void; countByCat: Record<string, number>;
}) {
  return (
    <div>
      <div className="mb-5">
        <div className="relative">
          <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در همنشینی‌ها..."
            className="w-full pr-11 pl-4 py-3 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            style={{ background: "white", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }} />
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <PartyPopper size={18} className="text-orange-500" />
        <h3 className="text-base font-black text-slate-900">نوع همنشینی رو انتخاب کن</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-7">
        {categories.map((cat) => {
          const count = countByCat[cat.id] || 0;
          return (
            <Link key={cat.id} href={`/events/category/${cat.id}`}
              className="group rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "rgba(255,107,0,0.08)" }}>{cat.emoji}</div>
                {count > 0 && <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}>{count} فعال</span>}
              </div>
              <h4 className="font-black text-slate-900 text-sm mb-0.5 group-hover:text-orange-600 transition-colors">{cat.title}</h4>
              <p className="text-[11px] text-slate-500 leading-tight line-clamp-2">{cat.desc}</p>
            </Link>
          );
        })}
      </div>
      {events.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-orange-500" />
            <h3 className="text-base font-black text-slate-900">همنشینی‌های فعال</h3>
            <span className="text-xs text-slate-500 mr-auto">{events.length} مورد</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {events.slice(0, 6).map((ev) => <EventCard key={ev.id} ev={ev} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({ ev }: { ev: ApiEvent }) {
  const reserved = ev.current_bookings || ev.reservedCount || 0;
  const remaining = ev.capacity - reserved;
  const full = remaining <= 0;
  return (
    <Link href={`/events/${ev.id}`}
      className="group rounded-2xl p-4 transition-all hover:-translate-y-1 hover:shadow-xl block"
      style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
      <h4 className="font-black text-slate-900 text-sm mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">{ev.title}</h4>
      <div className="space-y-1 mb-3">
        {ev.city && <div className="flex items-center gap-1.5 text-[11px] text-slate-500"><MapPin size={11} />{ev.city}</div>}
        {(ev.start_date || ev.startDate) && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Clock size={11} />
            {new Date(ev.start_date || ev.startDate).toLocaleDateString("fa-IR")}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-700">{ev.price?.toLocaleString()} تومان</span>
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
          style={{ background: full ? "rgba(148,163,184,0.15)" : "rgba(34,197,94,0.1)", color: full ? "#64748b" : "#16a34a" }}>
          {full ? "تکمیل" : `${remaining} جای خالی`}
        </span>
      </div>
    </Link>
  );
}

function TherapyHub() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Heart size={18} className="text-indigo-500" />
        <h3 className="text-base font-black text-slate-900">نوع جلسه‌ای که می‌خوای رو انتخاب کن</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {THERAPY_OPTIONS.map((opt) => (
          <Link key={opt.id} href={opt.href}
            className="group rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl block"
            style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
            <div className="relative h-40 overflow-hidden" style={{ background: opt.gradient }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl backdrop-blur-md"
                  style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  {opt.emoji}
                </div>
              </div>
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black"
                style={{ background: "rgba(255,255,255,0.95)", color: opt.badgeColor }}>{opt.subtitle}</div>
            </div>
            <div className="p-5">
              <h4 className="font-black text-slate-900 text-lg mb-1">{opt.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">{opt.desc}</p>
              <ul className="space-y-1.5 mb-4">
                {opt.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: opt.badgeColor }} />{f}
                  </li>
                ))}
              </ul>
              <div className="w-full text-center py-2.5 rounded-2xl text-sm font-black text-white"
                style={{ background: opt.gradient, boxShadow: `0 4px 16px ${opt.badgeColor}40` }}>
                مشاهده {opt.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,197,94,0.15)" }}>
          <Lock size={16} className="text-green-600" />
        </div>
        <div>
          <p className="font-black text-slate-800 text-sm mb-0.5">محرمانگی کامل تضمین می‌شود</p>
          <p className="text-xs text-slate-600 leading-relaxed">تمام جلسات تحت اصول اخلاق حرفه‌ای روانشناسی برگزار می‌شود.</p>
        </div>
      </div>
    </div>
  );
}
