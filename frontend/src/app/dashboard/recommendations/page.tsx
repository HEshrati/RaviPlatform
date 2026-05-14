"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import {
  Sparkles, Zap, Clock, MapPin, Users, Filter,
  LayoutGrid, List, ChevronLeft, Heart, Calendar, Globe
} from "lucide-react";

// ─── تایپ‌ها ────────────────────────────────────────────────────
interface RecommendedEvent {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  tags: string[];
  date: string;
  weekday: string;
  time: string;
  location?: string;
  isOnline?: boolean;
  img?: string;
  price: number;
  capacity: number;
  reserved: number;
  matchScore: number; // 0-100
}

// ─── فیلترها ────────────────────────────────────────────────────
type FilterKey = "all" | "top90" | "thisweek" | "online" | "art";
const FILTERS: { id: FilterKey; label: string }[] = [
  { id: "all",      label: "همه پیشنهادات" },
  { id: "top90",    label: "بالای ۹۰٪ تطابق" },
  { id: "thisweek", label: "این هفته" },
  { id: "online",   label: "آنلاین" },
  { id: "art",      label: "هنر و فرهنگ" },
];

// ─── داده‌های mock ──────────────────────────────────────────────
const MOCK_EVENTS: RecommendedEvent[] = [
  {
    id: "1", title: "دورهمی کتابخوانی تهران", subtitle: "کافه کتاب مرکزی",
    category: "دوست‌دار کتاب", tags: ["درون‌گرا", "دوست‌دار کتاب"],
    date: "۱۸ آبان", weekday: "جمعه", time: "۱۶:۰۰ - ۱۸:۰۰",
    location: "کافه کتاب مرکزی", price: 120000, capacity: 20, reserved: 14, matchScore: 98,
    img: "/categories/1.PNG",
  },
  {
    id: "2", title: "کارگاه نقاشی در طبیعت", subtitle: "پارک ملت",
    category: "هنر", tags: ["فضای باز", "هنر"],
    date: "۱۷ آبان", weekday: "پنج‌شنبه", time: "۱۰:۰۰ - ۱۳:۰۰",
    location: "پارک ملت", price: 250000, capacity: 12, reserved: 10, matchScore: 95,
    img: "/categories/2.PNG",
  },
  {
    id: "3", title: "یوگا و مدیتیشن صبحگاهی", subtitle: "آنلاین",
    category: "سلامتی", tags: ["صبحگاهی", "سلامتی"],
    date: "هر روز", weekday: "هر روز", time: "۰۷:۰۰ - ۰۸:۰۰",
    isOnline: true, price: 80000, capacity: 50, reserved: 35, matchScore: 88,
    img: "/categories/3.PNG",
  },
  {
    id: "4", title: "جلسه بازی‌های فکری", subtitle: "خانه بازی آزادی",
    category: "سرگرمی", tags: ["بازی", "سرگرمی"],
    date: "۲۰ آبان", weekday: "شنبه", time: "۱۸:۰۰ - ۲۱:۰۰",
    location: "خانه بازی آزادی", price: 90000, capacity: 16, reserved: 8, matchScore: 84,
    img: "/categories/4.PNG",
  },
  {
    id: "5", title: "گروه گفتگو و رشد فردی", subtitle: "آنلاین",
    category: "دوست روانشناس", tags: ["آنلاین", "رشد فردی"],
    date: "۱۶ آبان", weekday: "چهارشنبه", time: "۲۰:۰۰ - ۲۱:۳۰",
    isOnline: true, price: 60000, capacity: 10, reserved: 6, matchScore: 92,
    img: "/categories/5.PNG",
  },
  {
    id: "6", title: "کنسرت موسیقی سنتی", subtitle: "تالار وحدت",
    category: "موسیقی", tags: ["هنر و فرهنگ", "موسیقی"],
    date: "۲۱ آبان", weekday: "یک‌شنبه", time: "۱۹:۰۰ - ۲۱:۰۰",
    location: "تالار وحدت", price: 350000, capacity: 100, reserved: 78, matchScore: 79,
    img: "/categories/6.PNG",
  },
];

function getMatchColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 80) return "#f97316";
  return "#6366f1";
}

function getMatchBg(score: number): string {
  if (score >= 90) return "rgba(34,197,94,0.12)";
  if (score >= 80) return "rgba(249,115,22,0.12)";
  return "rgba(99,102,241,0.12)";
}

export default function RecommendationsPage() {
  const { state } = useApp();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [events, setEvents] = useState<RecommendedEvent[]>(MOCK_EVENTS);
  const [loading, setLoading] = useState(true);

  const userName = state.user?.name || "کاربر";
  const userCity = (state.user as any)?.city || (state.user as any)?.profile?.city || "";

  useEffect(() => {
    // دریافت پیشنهادات از API
    const token = localStorage.getItem("token");
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    fetch(`${API_BASE}/api/events/recommendations`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    setTimeout(() => setLoading(false), 0);
  }, []);

  const filtered = events.filter(ev => {
    if (activeFilter === "top90") return ev.matchScore >= 90;
    if (activeFilter === "thisweek") return true; // فرض بر این‌هفته بودن
    if (activeFilter === "online") return ev.isOnline;
    if (activeFilter === "art") return ev.tags.includes("هنر") || ev.tags.includes("هنر و فرهنگ") || ev.category === "هنر";
    return true;
  });

  const topMatch = Math.max(...events.map(e => e.matchScore));

  return (
    <div className="min-h-screen pb-28" style={{ background: "transparent" }} dir="rtl">
      {/* ── هدر صفحه ── */}
      <div className="sticky top-0 z-30 border-b border-slate-100/30 shadow-sm"
        style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,107,0,0.1)" }}>
              <Sparkles size={16} className="text-orange-500" />
            </div>
            <h1 className="text-base font-black text-slate-900">پیشنهادات راوی</h1>
          </div>
          <div className="mr-auto flex items-center gap-2">
            <button onClick={() => setViewMode(v => v === "grid" ? "list" : "grid")}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
              {viewMode === "grid" ? <List size={18} /> : <LayoutGrid size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* ── بنر شخصی‌سازی شده ── */}
        <div className="mt-5 mb-6 relative rounded-3xl overflow-hidden p-6"
          style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #0d1e35 60%, #1a1035 100%)" }}>
          {/* دکوراسیون پس‌زمینه */}
          <div className="absolute top-0 left-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #FF6B00, transparent)", transform: "translate(-30%, -30%)" }} />
          <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #6366f1, transparent)", transform: "translate(30%, 30%)" }} />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2"
                  style={{ background: "rgba(255,107,0,0.2)", border: "1px solid rgba(255,107,0,0.3)", color: "#FF6B00" }}>
                  <Zap size={11} />
                  جدید
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">
                  جهان خلاقیت
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  {filtered.length} رویداد جدید بر اساس علایق و الگوریتم تطابق برای شما پیدا شد.
                </p>
              </div>
              <div className="text-left flex flex-col items-end gap-1">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(255,107,0,0.15)", border: "1px solid rgba(255,107,0,0.25)" }}>
                  <Sparkles size={22} className="text-orange-400" />
                </div>
                <span className="text-[10px] text-slate-500">الگوریتم راوی</span>
              </div>
            </div>

            {/* آمار سریع */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" }}>
                <Zap size={11} />
                بالاترین تطابق: {topMatch}٪
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8" }}>
                <Users size={11} />
                {events.length} رویداد پیشنهادی
              </div>
              {userCity && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                  <MapPin size={11} />
                  {userCity}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── فیلترها + توگل ویو ── */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
              <Filter size={16} />
            </button>
          </div>

          {FILTERS.map(f => (
            <button key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all"
              style={activeFilter === f.id
                ? { background: "#1B2A4A", color: "white", boxShadow: "0 2px 12px rgba(27,42,76,0.3)" }
                : { background: "white", color: "#64748b", border: "1px solid #e2e8f0" }
              }>
              {f.label}
            </button>
          ))}
        </div>

        {/* ── گرید رویدادها ── */}
        {loading ? (
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-3xl overflow-hidden animate-pulse bg-white"
                style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.06)" }}>
                <div className="h-48 bg-slate-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-100 rounded-full w-1/3" />
                  <div className="h-5 bg-slate-100 rounded-full w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-600 font-bold text-base mb-1">رویداد پیشنهادی یافت نشد</p>
            <p className="text-slate-400 text-sm">فیلتر دیگری را امتحان کنید</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {filtered.map((ev) => {
              const full = ev.capacity <= ev.reserved;
              const remaining = ev.capacity - ev.reserved;
              const matchColor = getMatchColor(ev.matchScore);
              const matchBg = getMatchBg(ev.matchScore);

              return (
                <div key={ev.id}
                  className="group rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
                  {/* تصویر */}
                  <div className="relative h-48 overflow-hidden" style={{ background: "#1a3a5c" }}>
                    <img src={ev.img || "/categories/1.PNG"} alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* بادج تطابق */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-black"
                      style={{ background: matchBg, border: `1px solid ${matchColor}30`, color: matchColor, backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.92)" }}>
                      <Zap size={10} style={{ color: matchColor }} />
                      <span style={{ color: matchColor }}>{ev.matchScore}٪ تطابق</span>
                    </div>

                    {/* آنلاین بادج */}
                    {ev.isOnline && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
                        style={{ background: "rgba(99,102,241,0.9)", color: "white" }}>
                        <Globe size={9} />
                        آنلاین
                      </div>
                    )}

                    {/* تکمیل ظرفیت */}
                    {full && (
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-black bg-white/90 text-slate-700">
                        تکمیل ظرفیت
                      </div>
                    )}

                    {/* تگ‌ها */}
                    <div className="absolute bottom-3 right-3 flex gap-1">
                      {ev.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                          style={{ background: "rgba(255,107,0,0.8)", color: "white" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* محتوا */}
                  <div className="p-4">
                    <h3 className="font-black text-slate-800 text-base mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {ev.title}
                    </h3>

                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                      <Calendar size={11} />
                      <span>{ev.weekday}، {ev.date} ساعت {ev.time}</span>
                    </div>

                    {ev.location && !ev.isOnline && (
                      <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
                        <MapPin size={11} />
                        <span>{ev.location}</span>
                      </div>
                    )}

                    {ev.isOnline && (
                      <div className="flex items-center gap-2 text-indigo-500 text-xs mb-3">
                        <Globe size={11} />
                        <span>برگزاری آنلاین</span>
                      </div>
                    )}

                    {/* نوار ظرفیت */}
                    {!full && remaining <= 5 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="text-orange-600 font-bold flex items-center gap-1">
                            <Users size={9} />
                            فقط {remaining} جای خالی
                          </span>
                          <span className="text-slate-400">{Math.round((ev.reserved / ev.capacity) * 100)}٪</span>
                        </div>
                        <div className="h-1.5 bg-orange-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full transition-all"
                            style={{ width: `${Math.round((ev.reserved / ev.capacity) * 100)}%` }} />
                        </div>
                      </div>
                    )}

                    {/* دکمه‌ها */}
                    <div className="flex items-center gap-2 mt-3">
                      <Link href={`/events/${ev.id}`}
                        className="flex-1 text-center py-2.5 rounded-2xl text-sm font-bold transition-all hover:bg-slate-100"
                        style={{ background: "rgba(0,0,0,0.04)", color: "#475569" }}>
                        جزئیات بیشتر
                      </Link>
                      {!full ? (
                        <Link href={`/events/${ev.id}/booking`}
                          className="flex-1 text-center py-2.5 rounded-2xl text-sm font-black text-white transition-all hover:opacity-90"
                          style={{ background: "linear-gradient(135deg,#FF6B00,#FF9A3C)", boxShadow: "0 4px 16px rgba(255,107,0,0.3)" }}>
                          مشاهده
                        </Link>
                      ) : (
                        <div className="flex-1 text-center py-2.5 rounded-2xl text-sm font-bold text-slate-400"
                          style={{ background: "rgba(0,0,0,0.04)" }}>
                          تکمیل
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
