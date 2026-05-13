"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain, Heart, Zap, Shield, Star, ArrowRight,
  Lock, Clock, CheckCircle2, Sparkles, ChevronDown, ChevronUp,
  Users, AlertTriangle, BookOpen,
} from "lucide-react";

interface Test {
  id: number;
  name: string;
  persianName: string;
  construct: string;
  dimensions?: string[];
  usage: string[];
  questions?: number;
  status: "active" | "soon" | "expert";
  phase: 1 | 2 | 3;
  href?: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  importance?: string;
}

const TESTS: Test[] = [
  // ─── فاز ۱: شخصیت و روابط ───────────────────────────────────
  {
    id: 1, phase: 1, name: "NEO-FFI", persianName: "پنج عامل بزرگ شخصیت",
    construct: "شخصیت",
    dimensions: ["برون‌گرایی", "توافق‌پذیری", "وظیفه‌شناسی", "روان‌رنجوری", "گشودگی"],
    usage: ["پیش‌بینی سازگاری رابطه", "تحلیل سبک ارتباطی", "مدل‌سازی شخصیت"],
    questions: 60, status: "soon", importance: "معتبرترین مدل شخصیت جهان",
    icon: <Brain size={22}/>, color: "#7c3aed", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.25)",
  },
  {
    id: 2, phase: 1, name: "ECR-R", persianName: "سبک دلبستگی بزرگسال",
    construct: "دلبستگی",
    dimensions: ["اضطراب دلبستگی", "اجتناب دلبستگی"],
    usage: ["تحلیل الگوی رابطه عاطفی", "پیش‌بینی ترس از طرد", "تشخیص فاصله‌گیری هیجانی"],
    questions: 36, status: "soon", importance: "اهمیت بسیار بالا در مچینگ",
    icon: <Heart size={22}/>, color: "#e11d48", bg: "rgba(225,29,72,0.1)", border: "rgba(225,29,72,0.25)",
  },
  {
    id: 3, phase: 1, name: "Gottman Scales", persianName: "مقیاس‌های ارتباطی گاتمن",
    construct: "ثبات رابطه",
    dimensions: ["انتقاد", "دفاعی بودن", "اجتناب", "تحقیر"],
    usage: ["تحلیل احتمال تعارض", "پیش‌بینی پایداری رابطه", "شناسایی الگوهای مخرب"],
    questions: 20, status: "soon",
    icon: <Users size={22}/>, color: "#0284c7", bg: "rgba(2,132,199,0.1)", border: "rgba(2,132,199,0.25)",
  },
  {
    id: 4, phase: 1, name: "MBTI", persianName: "تیپ‌شناسی مایرز-بریگز",
    construct: "تیپ شخصیتی",
    dimensions: ["درون/برون‌گرایی", "شهودی/حسی", "منطقی/احساسی", "قضاوتی/ادراکی"],
    usage: ["محبوب و قابل فهم برای کاربران", "افزایش engagement", "گزارش‌های جذاب"],
    questions: 6, status: "active", href: "/dashboard/personality-test",
    icon: <Sparkles size={22}/>, color: "#FF6B00", bg: "rgba(255,107,0,0.1)", border: "rgba(255,107,0,0.25)",
  },
  {
    id: 5, phase: 1, name: "HEXACO", persianName: "مدل شش‌عاملی شخصیت",
    construct: "شخصیت + صداقت",
    dimensions: ["صداقت-فروتنی", "هیجانی‌بودن", "برون‌گرایی", "توافق‌پذیری", "وظیفه‌شناسی", "گشودگی"],
    usage: ["تحلیل رفتار فریبکارانه", "اخلاق رابطه", "اعتمادپذیری"],
    questions: 60, status: "soon",
    icon: <Shield size={22}/>, color: "#16a34a", bg: "rgba(22,163,74,0.1)", border: "rgba(22,163,74,0.25)",
  },
  {
    id: 6, phase: 1, name: "IRI", persianName: "شاخص واکنش‌پذیری بین‌فردی",
    construct: "همدلی",
    dimensions: ["همدلی شناختی", "همدلی هیجانی"],
    usage: ["پیش‌بینی کیفیت رابطه", "تحلیل توانایی درک شریک عاطفی"],
    questions: 28, status: "soon",
    icon: <Heart size={22}/>, color: "#db2777", bg: "rgba(219,39,119,0.1)", border: "rgba(219,39,119,0.25)",
  },
  {
    id: 7, phase: 1, name: "ERQ", persianName: "پرسشنامه تنظیم هیجان",
    construct: "تنظیم هیجان",
    usage: ["تحلیل کنترل خشم", "کنترل هیجانات", "بلوغ هیجانی"],
    questions: 10, status: "soon",
    icon: <Zap size={22}/>, color: "#d97706", bg: "rgba(217,119,6,0.1)", border: "rgba(217,119,6,0.25)",
  },
  {
    id: 8, phase: 1, name: "Conflict Style", persianName: "سبک حل تعارض",
    construct: "مدیریت تعارض",
    usage: ["پیش‌بینی دعوا", "تحلیل سازگاری زوج"],
    questions: 30, status: "soon",
    icon: <AlertTriangle size={22}/>, color: "#9333ea", bg: "rgba(147,51,234,0.1)", border: "rgba(147,51,234,0.25)",
  },
  {
    id: 9, phase: 1, name: "Love Languages", persianName: "زبان‌های محبت",
    construct: "ترجیحات دریافت محبت",
    dimensions: ["کلام تأییدی", "زمان باکیفیت", "هدیه", "خدمت", "تماس فیزیکی"],
    usage: ["بهبود تجربه کاربری", "تحلیل نیازهای رابطه"],
    questions: 30, status: "soon", importance: "بسیار مفید برای UX",
    icon: <Heart size={22}/>, color: "#e11d48", bg: "rgba(225,29,72,0.1)", border: "rgba(225,29,72,0.25)",
  },
  {
    id: 10, phase: 1, name: "Sexual Compatibility", persianName: "سازگاری صمیمانه",
    construct: "سازگاری صمیمانه",
    usage: ["تحلیل نیاز صمیمانه", "مرزبندی", "تفاوت میل"],
    questions: 20, status: "expert",
    icon: <Lock size={22}/>, color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)",
  },

  // ─── فاز ۲: سلامت روان ──────────────────────────────────────
  {
    id: 11, phase: 2, name: "BDI-II", persianName: "پرسشنامه افسردگی بک",
    construct: "افسردگی",
    usage: ["غربالگری افسردگی", "تشخیص شدت"],
    questions: 21, status: "soon",
    icon: <Brain size={22}/>, color: "#1d4ed8", bg: "rgba(29,78,216,0.1)", border: "rgba(29,78,216,0.25)",
  },
  {
    id: 12, phase: 2, name: "BAI", persianName: "پرسشنامه اضطراب بک",
    construct: "اضطراب",
    usage: ["سنجش اضطراب", "شدت نشانه‌ها"],
    questions: 21, status: "soon",
    icon: <AlertTriangle size={22}/>, color: "#b45309", bg: "rgba(180,83,9,0.1)", border: "rgba(180,83,9,0.25)",
  },
  {
    id: 13, phase: 2, name: "DASS-21", persianName: "مقیاس افسردگی، اضطراب و استرس",
    construct: "افسردگی + اضطراب + استرس",
    dimensions: ["افسردگی", "اضطراب", "استرس"],
    usage: ["کوتاه و مناسب اپلیکیشن", "غربالگری سریع"],
    questions: 21, status: "soon", importance: "بهترین گزینه برای موبایل",
    icon: <Shield size={22}/>, color: "#0f766e", bg: "rgba(15,118,110,0.1)", border: "rgba(15,118,110,0.25)",
  },
  {
    id: 14, phase: 2, name: "PHQ-9", persianName: "پرسشنامه سلامت بیمار",
    construct: "افسردگی",
    usage: ["غربالگری سریع افسردگی"],
    questions: 9, status: "soon",
    icon: <BookOpen size={22}/>, color: "#4338ca", bg: "rgba(67,56,202,0.1)", border: "rgba(67,56,202,0.25)",
  },
  {
    id: 15, phase: 2, name: "GAD-7", persianName: "اختلال اضطراب فراگیر",
    construct: "اضطراب فراگیر",
    usage: ["غربالگری اضطراب"],
    questions: 7, status: "soon",
    icon: <Zap size={22}/>, color: "#c2410c", bg: "rgba(194,65,12,0.1)", border: "rgba(194,65,12,0.25)",
  },
  {
    id: 16, phase: 2, name: "Y-BOCS", persianName: "مقیاس وسواس ییل-براون",
    construct: "وسواس فکری-عملی",
    usage: ["شدت OCD"],
    questions: 10, status: "expert",
    icon: <Lock size={22}/>, color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)",
  },
  {
    id: 17, phase: 2, name: "ASRS", persianName: "مقیاس خودگزارشی ADHD بزرگسال",
    construct: "ADHD بزرگسال",
    usage: ["غربالگری نقص توجه"],
    questions: 18, status: "soon",
    icon: <Star size={22}/>, color: "#7c3aed", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.25)",
  },
  {
    id: 18, phase: 2, name: "PCL-5", persianName: "چک‌لیست PTSD",
    construct: "PTSD",
    usage: ["ترومای روانی"],
    questions: 20, status: "expert",
    icon: <Lock size={22}/>, color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)",
  },
  {
    id: 19, phase: 2, name: "MDQ", persianName: "پرسشنامه اختلال خلقی",
    construct: "اختلال دوقطبی",
    usage: ["غربالگری مانیا"],
    questions: 15, status: "expert",
    icon: <Lock size={22}/>, color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)",
  },
  {
    id: 20, phase: 2, name: "ISI", persianName: "شاخص شدت بی‌خوابی",
    construct: "اختلال خواب",
    usage: ["کیفیت خواب"],
    questions: 7, status: "soon",
    icon: <Star size={22}/>, color: "#0284c7", bg: "rgba(2,132,199,0.1)", border: "rgba(2,132,199,0.25)",
  },

  // ─── فاز ۳: بالینی تخصصی ────────────────────────────────────
  {
    id: 21, phase: 3, name: "MMPI-2", persianName: "پرسشنامه چندوجهی شخصیت مینه‌سوتا",
    construct: "آسیب‌شناسی شخصیت",
    usage: ["پروفایل بالینی عمیق"],
    questions: 567, status: "expert",
    icon: <Lock size={22}/>, color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)",
  },
  {
    id: 22, phase: 3, name: "MCMI", persianName: "پرسشنامه بالینی چندمحوری میلون",
    construct: "اختلالات شخصیت",
    usage: ["تشخیص الگوهای شخصیت ناسازگار"],
    questions: 175, status: "expert",
    icon: <Lock size={22}/>, color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)",
  },
  {
    id: 23, phase: 3, name: "SCID-5", persianName: "مصاحبه بالینی ساختاریافته DSM-5",
    construct: "تشخیص بالینی",
    usage: ["تشخیص اختلالات روانی"],
    status: "expert",
    icon: <Lock size={22}/>, color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)",
  },
  {
    id: 24, phase: 3, name: "PID-5", persianName: "موجودی ویژگی‌های شخصیتی DSM-5",
    construct: "اختلالات شخصیت",
    usage: ["الگوهای شخصیتی ناسازگار"],
    questions: 220, status: "expert",
    icon: <Lock size={22}/>, color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)",
  },
  {
    id: 25, phase: 3, name: "YSQ", persianName: "پرسشنامه طرحواره یانگ",
    construct: "طرحواره‌های ناسازگار",
    usage: ["روابط سمی", "الگوهای تکرارشونده رابطه"],
    questions: 90, status: "expert",
    icon: <Brain size={22}/>, color: "#9333ea", bg: "rgba(147,51,234,0.1)", border: "rgba(147,51,234,0.25)",
  },
];

const STATUS_CONFIG = {
  active: { label: "شروع کن",          bg: "linear-gradient(135deg,#FF6B00,#FF9A3C)", color: "white",    icon: <CheckCircle2 size={13}/> },
  soon:   { label: "به زودی",           bg: "rgba(255,107,0,0.1)",                     color: "#FF6B00",  icon: <Clock size={13}/>        },
  expert: { label: "نیاز به روانشناس", bg: "rgba(107,114,128,0.1)",                   color: "#6b7280",  icon: <Lock size={13}/>         },
};

const PHASE_INFO = {
  1: { title: "لایه ۱ — شخصیت و روابط",       subtitle: "برای همه کاربران",           color: "#FF6B00", bg: "rgba(255,107,0,0.08)",   count: 10 },
  2: { title: "لایه ۲ — غربالگری سلامت روان", subtitle: "پس از تکمیل لایه ۱",         color: "#0284c7", bg: "rgba(2,132,199,0.08)",   count: 10 },
  3: { title: "لایه ۳ — بالینی تخصصی",        subtitle: "فقط زیر نظر روانشناس",       color: "#9333ea", bg: "rgba(147,51,234,0.08)",  count: 5  },
};

function TestCard({ test }: { test: Test }) {
  const [expanded, setExpanded] = useState(false);
  const s = STATUS_CONFIG[test.status];

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: "white",
        border: `1px solid ${test.border}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* آیکون */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: test.bg, color: test.color }}
          >
            {test.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-black text-slate-900 text-sm leading-tight">{test.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{test.persianName}</p>
              </div>
              {test.questions && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0"
                  style={{ background: test.bg, color: test.color }}>
                  {test.questions} سوال
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {test.construct}
              {test.importance && <span className="text-orange-500 font-bold"> · {test.importance}</span>}
            </p>
          </div>
        </div>

        {/* بسط جزئیات */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            {test.dimensions && (
              <div className="mb-2">
                <p className="text-[10px] font-black text-slate-500 mb-1.5">ابعاد:</p>
                <div className="flex flex-wrap gap-1">
                  {test.dimensions.map((d) => (
                    <span key={d} className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                      style={{ background: test.bg, color: test.color }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-[10px] font-black text-slate-500 mb-1.5">کاربرد در راوی:</p>
              <ul className="space-y-0.5">
                {test.usage.map((u) => (
                  <li key={u} className="text-[10px] text-slate-600 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: test.color }} />
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* دکمه‌ها */}
        <div className="flex items-center gap-2 mt-3">
          {test.status === "active" && test.href ? (
            <Link
              href={test.href}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all active:scale-95 hover:opacity-90"
              style={{ background: s.bg, color: s.color, boxShadow: "0 4px 12px rgba(255,107,0,0.3)" }}
            >
              {s.icon}
              {s.label}
            </Link>
          ) : (
            <div
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold"
              style={{ background: s.bg, color: s.color }}
            >
              {s.icon}
              {s.label}
            </div>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: "rgba(0,0,0,0.04)", color: "#64748b" }}
          >
            {expanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TestsCatalogPage() {
  const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);
  const filtered = TESTS.filter((t) => t.phase === activePhase);
  const info = PHASE_INFO[activePhase];
  const activeCount = TESTS.filter((t) => t.status === "active").length;

  return (
    <div className="min-h-screen pb-32" dir="rtl" style={{ background: "#090e1c" }}>
      <div className="max-w-2xl mx-auto px-4 pt-4">

        {/* بازگشت */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors">
          <ArrowRight size={16}/> بازگشت
        </Link>

        {/* هدر */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255,107,0,0.15)", border: "1px solid rgba(255,107,0,0.25)" }}>
              <Brain size={22} className="text-orange-400"/>
            </div>
            <div>
              <h1 className="text-xl font-black text-white">تست‌های روان‌شناختی راوی</h1>
              <p className="text-xs text-slate-400">۲۵ تست علمی در ۳ لایه تخصصی</p>
            </div>
          </div>

          {/* آمار */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "تست فعال",    value: activeCount, color: "#FF6B00", bg: "rgba(255,107,0,0.1)"  },
              { label: "در حال توسعه", value: 17,         color: "#0284c7", bg: "rgba(2,132,199,0.1)"  },
              { label: "نیاز متخصص",  value: 8,           color: "#9333ea", bg: "rgba(147,51,234,0.1)" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: s.bg, border: `1px solid ${s.bg.replace("0.1","0.2")}` }}>
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* تب‌های فاز */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {([1, 2, 3] as const).map((phase) => {
            const pi = PHASE_INFO[phase];
            const isActive = activePhase === phase;
            return (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className="flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs font-black transition-all whitespace-nowrap"
                style={isActive
                  ? { background: pi.color, color: "white", boxShadow: `0 4px 14px ${pi.color}44` }
                  : { background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }
                }
              >
                لایه {phase === 1 ? "۱" : phase === 2 ? "۲" : "۳"}
                <span className="block text-[9px] mt-0.5 opacity-80">{pi.subtitle}</span>
              </button>
            );
          })}
        </div>

        {/* عنوان لایه */}
        <div
          className="rounded-2xl px-4 py-3 mb-5 flex items-center justify-between"
          style={{ background: info.bg, border: `1px solid ${info.color}33` }}
        >
          <div>
            <p className="font-black text-sm" style={{ color: info.color }}>{info.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{info.count} تست · {info.subtitle}</p>
          </div>
          {activePhase === 3 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "rgba(147,51,234,0.15)" }}>
              <Lock size={11} className="text-purple-400"/>
              <span className="text-[10px] text-purple-400 font-bold">تخصصی</span>
            </div>
          )}
        </div>

        {/* لیست تست‌ها */}
        <div className="space-y-3">
          {filtered.map((test) => (
            <TestCard key={test.id} test={test}/>
          ))}
        </div>

        {/* نکته انتهایی */}
        <div
          className="mt-6 rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs text-slate-400 leading-relaxed text-center">
            <Sparkles size={12} className="inline text-orange-400 ml-1"/>
            نتایج تست‌ها برای بهبود مچینگ و پیشنهاد محتوا استفاده می‌شود. اطلاعات شخصی شما محفوظ است.
          </p>
        </div>
      </div>
    </div>
  );
}
