"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import {
  Brain, Heart, Shield, Zap, ArrowRight, Clock,
  ChevronLeft, Lock, CheckCircle2, Star, Sparkles,
  Activity, Eye, Users, AlertCircle,
} from "lucide-react";

// ─── تعریف ۲۵ تست ────────────────────────────────────────────────
const TESTS = [
  // ── فاز ۱: شخصیت و رابطه ────────────────────────────────────────
  {
    id: "phq9",
    name: "PHQ-9",
    fullName: "پرسشنامه سلامت بیمار — افسردگی",
    category: "mental_health",
    construct: "افسردگی",
    duration: "۳ دقیقه",
    questions: 9,
    status: "available",
    description: "غربالگری سریع و معتبر برای سنجش شدت علائم افسردگی",
    icon: "🌧️",
    color: "#6366f1",
    bgColor: "rgba(99,102,241,0.12)",
    borderColor: "rgba(99,102,241,0.25)",
  },
  {
    id: "gad7",
    name: "GAD-7",
    fullName: "مقیاس اضطراب فراگیر",
    category: "mental_health",
    construct: "اضطراب",
    duration: "۲ دقیقه",
    questions: 7,
    status: "available",
    description: "ارزیابی میزان و شدت اضطراب فراگیر در زندگی روزمره",
    icon: "⚡",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.12)",
    borderColor: "rgba(245,158,11,0.25)",
  },
  {
    id: "dass21",
    name: "DASS-21",
    fullName: "مقیاس افسردگی، اضطراب و استرس",
    category: "mental_health",
    construct: "افسردگی · اضطراب · استرس",
    duration: "۵ دقیقه",
    questions: 21,
    status: "available",
    description: "سنجش همزمان سه حوزه اصلی سلامت روان در یک ابزار کارآمد",
    icon: "🌊",
    color: "#06b6d4",
    bgColor: "rgba(6,182,212,0.12)",
    borderColor: "rgba(6,182,212,0.25)",
  },
  {
    id: "love_languages",
    name: "Love Languages",
    fullName: "زبان‌های عشق چپمن",
    category: "relationship",
    construct: "ترجیحات دریافت محبت",
    duration: "۵ دقیقه",
    questions: 30,
    status: "available",
    description: "کشف اینکه چه نوع محبتی برایت بیشترین معنا دارد",
    icon: "💛",
    color: "#f97316",
    bgColor: "rgba(249,115,22,0.12)",
    borderColor: "rgba(249,115,22,0.25)",
  },
  {
    id: "attachment",
    name: "ECR-R",
    fullName: "سبک دلبستگی بزرگسال",
    category: "relationship",
    construct: "سبک دلبستگی",
    duration: "۸ دقیقه",
    questions: 18,
    status: "available",
    description: "درک الگوی دلبستگی در روابط عاطفی بزرگسالانه",
    icon: "🔗",
    color: "#ec4899",
    bgColor: "rgba(236,72,153,0.12)",
    borderColor: "rgba(236,72,153,0.25)",
  },
  {
    id: "neo_ffi",
    name: "NEO-FFI",
    fullName: "پنج عامل بزرگ شخصیت",
    category: "personality",
    construct: "Big Five",
    duration: "۱۵ دقیقه",
    questions: 60,
    status: "coming_soon",
    description: "معتبرترین مدل شخصیتی جهان برای تحلیل دقیق الگوهای رفتاری",
    icon: "🧬",
    color: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.12)",
    borderColor: "rgba(139,92,246,0.25)",
  },
  {
    id: "hexaco",
    name: "HEXACO",
    fullName: "مدل شش عاملی شخصیت",
    category: "personality",
    construct: "شخصیت + صداقت",
    duration: "۱۵ دقیقه",
    questions: 60,
    status: "coming_soon",
    description: "شامل بُعد اضافه صداقت-فروتنی که برای ارزیابی اعتماد بسیار مهم است",
    icon: "💎",
    color: "#10b981",
    bgColor: "rgba(16,185,129,0.12)",
    borderColor: "rgba(16,185,129,0.25)",
  },
  {
    id: "iri",
    name: "IRI",
    fullName: "شاخص واکنش‌پذیری بین‌فردی",
    category: "relationship",
    construct: "همدلی",
    duration: "۱۰ دقیقه",
    questions: 28,
    status: "coming_soon",
    description: "سنجش ظرفیت همدلی شناختی و هیجانی در روابط",
    icon: "🤝",
    color: "#22c55e",
    bgColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.25)",
  },
  {
    id: "erq",
    name: "ERQ",
    fullName: "پرسشنامه تنظیم هیجان",
    category: "personality",
    construct: "تنظیم هیجان",
    duration: "۵ دقیقه",
    questions: 10,
    status: "coming_soon",
    description: "بررسی سبک‌های مدیریت احساسات و پختگی هیجانی",
    icon: "🌡️",
    color: "#f43f5e",
    bgColor: "rgba(244,63,94,0.12)",
    borderColor: "rgba(244,63,94,0.25)",
  },
  {
    id: "conflict",
    name: "CRSI",
    fullName: "سبک‌های حل تعارض",
    category: "relationship",
    construct: "تعارض",
    duration: "۷ دقیقه",
    questions: 20,
    status: "coming_soon",
    description: "شناخت الگوی مقابله با اختلاف‌نظر و تعارض در روابط",
    icon: "⚖️",
    color: "#3b82f6",
    bgColor: "rgba(59,130,246,0.12)",
    borderColor: "rgba(59,130,246,0.25)",
  },
  {
    id: "bdi2",
    name: "BDI-II",
    fullName: "پرسشنامه افسردگی بک",
    category: "mental_health",
    construct: "افسردگی (بالینی)",
    duration: "۷ دقیقه",
    questions: 21,
    status: "psychologist_only",
    description: "ابزار بالینی معتبر برای ارزیابی عمیق‌تر علائم افسردگی",
    icon: "🔬",
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.12)",
    borderColor: "rgba(100,116,139,0.25)",
  },
  {
    id: "bai",
    name: "BAI",
    fullName: "پرسشنامه اضطراب بک",
    category: "mental_health",
    construct: "اضطراب (بالینی)",
    duration: "۷ دقیقه",
    questions: 21,
    status: "psychologist_only",
    description: "سنجش دقیق‌تر علائم جسمانی و شناختی اضطراب",
    icon: "🔬",
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.12)",
    borderColor: "rgba(100,116,139,0.25)",
  },
  {
    id: "pcl5",
    name: "PCL-5",
    fullName: "چک‌لیست PTSD",
    category: "mental_health",
    construct: "تروما",
    duration: "۷ دقیقه",
    questions: 20,
    status: "psychologist_only",
    description: "غربالگری علائم اختلال استرس پس از سانحه",
    icon: "🛡️",
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.12)",
    borderColor: "rgba(100,116,139,0.25)",
  },
  {
    id: "isi",
    name: "ISI",
    fullName: "شاخص شدت بی‌خوابی",
    category: "mental_health",
    construct: "خواب",
    duration: "۳ دقیقه",
    questions: 7,
    status: "coming_soon",
    description: "ارزیابی کیفیت خواب و تأثیر آن بر عملکرد روزانه",
    icon: "🌙",
    color: "#818cf8",
    bgColor: "rgba(129,140,248,0.12)",
    borderColor: "rgba(129,140,248,0.25)",
  },
  {
    id: "asrs",
    name: "ASRS",
    fullName: "مقیاس ADHD بزرگسال",
    category: "mental_health",
    construct: "ADHD",
    duration: "۵ دقیقه",
    questions: 18,
    status: "psychologist_only",
    description: "غربالگری نقص توجه و بیش‌فعالی در بزرگسالان",
    icon: "⚡",
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.12)",
    borderColor: "rgba(100,116,139,0.25)",
  },
  {
    id: "mdq",
    name: "MDQ",
    fullName: "پرسشنامه اختلال خلقی",
    category: "mental_health",
    construct: "دوقطبی",
    duration: "۵ دقیقه",
    questions: 13,
    status: "psychologist_only",
    description: "غربالگری علائم اختلال دوقطبی و مانیا",
    icon: "🔬",
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.12)",
    borderColor: "rgba(100,116,139,0.25)",
  },
  {
    id: "ybocs",
    name: "Y-BOCS",
    fullName: "مقیاس وسواس ییل-براون",
    category: "mental_health",
    construct: "OCD",
    duration: "۸ دقیقه",
    questions: 10,
    status: "psychologist_only",
    description: "ارزیابی شدت علائم وسواس فکری-عملی",
    icon: "🔬",
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.12)",
    borderColor: "rgba(100,116,139,0.25)",
  },
  {
    id: "gottman",
    name: "Gottman",
    fullName: "مقیاس‌های ارتباطی گاتمن",
    category: "relationship",
    construct: "پایداری رابطه",
    duration: "۱۲ دقیقه",
    questions: 40,
    status: "coming_soon",
    description: "پیش‌بینی پایداری رابطه و شناسایی الگوهای مخرب",
    icon: "💑",
    color: "#f97316",
    bgColor: "rgba(249,115,22,0.12)",
    borderColor: "rgba(249,115,22,0.25)",
  },
  {
    id: "sexual_compat",
    name: "SCI",
    fullName: "سازگاری صمیمیت جسمی",
    category: "relationship",
    construct: "صمیمیت",
    duration: "۱۰ دقیقه",
    questions: 25,
    status: "psychologist_only",
    description: "تحلیل تطابق نیازها و مرزبندی در روابط صمیمانه",
    icon: "🔒",
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.12)",
    borderColor: "rgba(100,116,139,0.25)",
  },
  {
    id: "mmpi2",
    name: "MMPI-2",
    fullName: "پرسشنامه چندوجهی مینه‌سوتا",
    category: "clinical",
    construct: "آسیب‌شناسی شخصیت",
    duration: "۹۰ دقیقه",
    questions: 567,
    status: "psychologist_only",
    description: "جامع‌ترین ابزار بالینی برای تشخیص اختلالات شخصیت",
    icon: "🔬",
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.12)",
    borderColor: "rgba(100,116,139,0.25)",
  },
  {
    id: "mcmi",
    name: "MCMI",
    fullName: "پرسشنامه بالینی میلون",
    category: "clinical",
    construct: "اختلالات شخصیت",
    duration: "۴۵ دقیقه",
    questions: 175,
    status: "psychologist_only",
    description: "تشخیص افتراقی اختلالات شخصیت با رویکرد میلون",
    icon: "🔬",
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.12)",
    borderColor: "rgba(100,116,139,0.25)",
  },
  {
    id: "scid5",
    name: "SCID-5",
    fullName: "مصاحبه بالینی ساختاریافته DSM-5",
    category: "clinical",
    construct: "تشخیص DSM-5",
    duration: "۶۰ دقیقه",
    questions: 150,
    status: "psychologist_only",
    description: "استاندارد طلایی تشخیص اختلالات روانپزشکی",
    icon: "🔬",
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.12)",
    borderColor: "rgba(100,116,139,0.25)",
  },
  {
    id: "pid5",
    name: "PID-5",
    fullName: "پرسشنامه ویژگی‌های شخصیت DSM-5",
    category: "clinical",
    construct: "شخصیت (DSM-5)",
    duration: "۳۰ دقیقه",
    questions: 100,
    status: "psychologist_only",
    description: "مدل جدید شخصیت در DSM-5 برای تشخیص دقیق‌تر",
    icon: "🔬",
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.12)",
    borderColor: "rgba(100,116,139,0.25)",
  },
  {
    id: "ysq",
    name: "YSQ",
    fullName: "پرسشنامه طرحواره یانگ",
    category: "clinical",
    construct: "طرحواره‌های ناسازگار",
    duration: "۴۵ دقیقه",
    questions: 232,
    status: "psychologist_only",
    description: "شناسایی الگوهای فکری عمیق که روابط را تحت تأثیر قرار می‌دهند",
    icon: "🌿",
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.12)",
    borderColor: "rgba(100,116,139,0.25)",
  },
  {
    id: "mbti",
    name: "MBTI",
    fullName: "تیپ شخصیتی مایرز-بریگز",
    category: "personality",
    construct: "تیپ شخصیتی",
    duration: "۵ دقیقه",
    questions: 6,
    status: "completed",
    description: "بررسی شده در ثبت‌نام — مبنای اصلی مچینگ راوی",
    icon: "🧬",
    color: "#22c55e",
    bgColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.25)",
  },
];

const CATEGORIES = [
  { id: "all", label: "همه", icon: <Brain size={14} /> },
  { id: "personality", label: "شخصیت", icon: <Star size={14} /> },
  { id: "relationship", label: "رابطه", icon: <Heart size={14} /> },
  { id: "mental_health", label: "سلامت روان", icon: <Activity size={14} /> },
  { id: "clinical", label: "بالینی", icon: <Shield size={14} /> },
];

const STATUS_CONFIG = {
  available: { label: "شروع تست", color: "#FF6B00", bg: "rgba(255,107,0,0.15)", border: "rgba(255,107,0,0.4)", locked: false },
  coming_soon: { label: "به‌زودی", color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", locked: true },
  psychologist_only: { label: "نیاز به روانشناس", color: "#a855f7", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.2)", locked: true },
  completed: { label: "تکمیل شده ✓", color: "#22c55e", bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.3)", locked: false },
};

const CARD = { background: "linear-gradient(145deg, #1B2A4A, #132038)", border: "1px solid rgba(0,0,0,0.06)" };

export default function TestsCatalogPage() {
  const { state } = useApp();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = TESTS.filter((t) => {
    const matchCat = activeCategory === "all" || t.category === activeCategory;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.fullName.includes(search) || t.construct.includes(search);
    return matchCat && matchSearch;
  });

  const availableCount = TESTS.filter((t) => t.status === "available").length;
  const completedCount = TESTS.filter((t) => t.status === "completed").length;

  return (
    <div className="max-w-2xl mx-auto pb-24 space-y-5 relative z-10" dir="rtl">

      {/* هدر */}
      <div className="rounded-3xl p-6 relative overflow-hidden" style={CARD}>
        <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.3)" }}>
              <Brain size={22} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">آزمون‌های روانشناسی</h1>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                {availableCount} تست فعال · {TESTS.length} تست در کتابخانه
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-6">
            نتایج تست‌ها به روانشناس یا مشاورت نمایش داده می‌شود و برای ارائه خدمات شخصی‌سازی‌شده استفاده می‌گردد.
          </p>
        </div>

        {/* آمار */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { value: completedCount, label: "تکمیل شده", color: "#22c55e" },
            { value: availableCount, label: "قابل انجام", color: "#FF6B00" },
            { value: TESTS.length - availableCount - completedCount, label: "در راه", color: "#94a3b8" },
          ].map(({ value, label, color }) => (
            <div key={label} className="rounded-xl p-3 text-center"
              style={{ background: "rgba(0,0,0,0.03)" }}>
              <p className="text-xl font-black" style={{ color }}>{value}</p>
              <p className="text-[10px] text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* نوار اطلاعاتی */}
      <div className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)" }}>
        <AlertCircle size={16} className="text-purple-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-6">
          تست‌هایی که نیاز به روانشناس دارند پس از ارتباط با متخصص در بخش <strong className="text-purple-400">همکاران</strong> فعال می‌شوند.
        </p>
      </div>

      {/* فیلتر دسته‌بندی */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(({ id, label, icon }) => (
          <button key={id}
            onClick={() => setActiveCategory(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === id ? "bg-orange-500 text-white" : "text-slate-500"
            }`}
            style={activeCategory !== id ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(0,0,0,0.08)" } : {}}>
            {icon}{label}
          </button>
        ))}
      </div>

      {/* لیست تست‌ها */}
      <div className="space-y-3">
        {filtered.map((test) => {
          const statusCfg = STATUS_CONFIG[test.status];
          return (
            <div key={test.id}
              className="rounded-2xl p-4 transition-all hover:border-opacity-50"
              style={{ background: test.bgColor, border: `1px solid ${test.borderColor}` }}>
              <div className="flex items-start gap-3">
                {/* آیکون */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: "rgba(0,0,0,0.2)" }}>
                  {test.icon}
                </div>

                {/* اطلاعات */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-black text-slate-900 text-sm">{test.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: "rgba(0,0,0,0.3)", color: test.color }}>
                      {test.construct}
                    </span>
                  </div>
                  <p className="text-xs font-bold mb-1" style={{ color: test.color }}>{test.fullName}</p>
                  <p className="text-[11px] text-slate-500 leading-5 mb-2">{test.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={10} />{test.duration}</span>
                    <span>{test.questions} سوال</span>
                  </div>
                </div>

                {/* دکمه */}
                <div className="shrink-0 mt-1">
                  {test.status === "available" ? (
                    <Link href={`/dashboard/tests/${test.id}`}>
                      <button className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-black text-slate-900 transition-all"
                        style={{ background: "linear-gradient(135deg, #FF6B00, #FF9A3C)" }}>
                        شروع
                        <ChevronLeft size={12} />
                      </button>
                    </Link>
                  ) : test.status === "completed" ? (
                    <Link href={`/dashboard/tests/${test.id}/result`}>
                      <button className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-black transition-all"
                        style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}>
                        <CheckCircle2 size={12} />
                        نتیجه
                      </button>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold"
                      style={{ background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, color: statusCfg.color }}>
                      <Lock size={10} />
                      {test.status === "psychologist_only" ? "تخصصی" : "زود"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* اطلاعیه پایین */}
      <div className="rounded-2xl p-5 text-center" style={CARD}>
        <Sparkles size={20} className="text-orange-400 mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-900 mb-1">نتایج شخصی‌سازی‌شده</p>
        <p className="text-xs text-slate-500 leading-6">
          بر اساس نتایج تست‌ها، مقالات علمی و مشاوران متناسب با نیاز شما پیشنهاد داده می‌شود.
        </p>
      </div>
    </div>
  );
}
