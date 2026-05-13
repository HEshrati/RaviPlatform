"use client";


import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  myTherapistAPI,
  type IntakeResponse,
  type ConcernTopic,
  type SessionMode,
} from "@/app/lib/my-therapist-api";

const CONCERN_OPTIONS: { id: ConcernTopic; label: string; emoji: string }[] = [
  { id: "anxiety", label: "اضطراب و استرس", emoji: "😰" },
  { id: "depression", label: "افسردگی و کم‌خلقی", emoji: "😔" },
  { id: "relationships", label: "روابط زناشویی/عاطفی", emoji: "💔" },
  { id: "self_growth", label: "رشد فردی و خودشناسی", emoji: "🌱" },
  { id: "trauma", label: "تجربه‌های آسیب‌زا", emoji: "🌧️" },
  { id: "loneliness", label: "تنهایی و انزوا", emoji: "🌙" },
  { id: "family", label: "مسائل خانواده", emoji: "🏠" },
  { id: "career", label: "شغل و مسیر زندگی", emoji: "💼" },
  { id: "addiction", label: "اعتیاد یا وابستگی", emoji: "🔗" },
  { id: "other", label: "موضوع دیگر", emoji: "💭" },
];

const TIME_SLOTS = ["صبح (۸ تا ۱۲)", "ظهر (۱۲ تا ۱۶)", "عصر (۱۶ تا ۲۰)", "شب (۲۰ تا ۲۴)"];

const SCALE_QUESTIONS = [
  { id: "stress", text: "در دو هفته گذشته، استرس را چقدر تجربه کرده‌اید؟" },
  { id: "mood", text: "خلق و حال کلی شما در روزهای اخیر چگونه بوده است؟" },
  { id: "sleep", text: "کیفیت خواب شما در ماه گذشته چطور بوده است؟" },
  { id: "social", text: "میزان رضایت از روابط اجتماعی‌تان چقدر است؟" },
  { id: "energy", text: "سطح انرژی روزانه شما در حد قابل قبولی هست؟" },
];

const TOTAL_STEPS = 5;

function InnerIntakePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextSection = searchParams.get("next") || "ham-ravan";

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [concerns, setConcerns] = useState<ConcernTopic[]>([]);
  const [customConcern, setCustomConcern] = useState("");
  const [mode, setMode] = useState<SessionMode>("online");
  const [city, setCity] = useState("");
  const [times, setTimes] = useState<string[]>([]);
  const [scale, setScale] = useState<Record<string, number>>({});
  const [budget, setBudget] = useState<number | "">("");
  const [genderPref, setGenderPref] = useState<"male" | "female" | "any">("any");
  const [notes, setNotes] = useState("");

  const toggleConcern = (id: ConcernTopic) => {
    setConcerns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };
  const toggleTime = (t: string) => {
    setTimes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  function canGoNext() {
    if (step === 1) return concerns.length > 0;
    if (step === 2) return Object.keys(scale).length === SCALE_QUESTIONS.length;
    if (step === 3) return times.length > 0;
    return true;
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    const payload: IntakeResponse = {
      concernTopics: concerns,
      customConcern: customConcern || undefined,
      preferredMode: mode,
      preferredTimes: times,
      city: city || undefined,
      scaleAnswers: scale,
      budget: budget ? Number(budget) : undefined,
      genderPreference: genderPref,
      notes: notes || undefined,
    };
    try {
      await myTherapistAPI.submitIntake(payload);
      localStorage.setItem("mt_intake_done", "1");
      router.replace(`/dashboard/my-therapist/${nextSection}`);
    } catch (e: any) {
      setError(e?.message || "خطا در ارسال پرسش‌نامه");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen pb-28" dir="rtl">
      <div className="sticky top-0 z-30 border-b border-slate-100/30 shadow-sm" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push("/dashboard/my-therapist")} className="p-2 rounded-xl hover:bg-slate-100">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-base font-black text-slate-900">پرسش‌نامه اختصاصی</h1>
          <div className="mr-auto text-xs font-bold text-slate-500">مرحله {step} از {TOTAL_STEPS}</div>
        </div>
        <div className="h-1 bg-slate-100">
          <div className="h-full transition-all duration-500" style={{ width: `${(step / TOTAL_STEPS) * 100}%`, background: "linear-gradient(90deg,#FF6B00,#FF9A3C)" }} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6">
        {error && (
          <div className="mb-5 rounded-2xl p-4 flex items-start gap-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <AlertCircle size={18} className="text-red-500" />
            <p className="text-red-600 text-sm font-bold">{error}</p>
          </div>
        )}

        {step === 1 && (
          <div className="rounded-3xl p-5 bg-white shadow-sm">
            <h2 className="font-black text-slate-900 text-lg mb-1">موضوعی که می‌خواهی روی آن کار کنی چیست؟</h2>
            <div className="grid grid-cols-2 gap-2.5 mt-4">
              {CONCERN_OPTIONS.map((opt) => {
                const active = concerns.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleConcern(opt.id)}
                    className="relative rounded-2xl p-3 text-right transition-all"
                    style={active ? { background: "rgba(255,107,0,0.12)", border: "1.5px solid #FF6B00" } : { background: "rgba(0,0,0,0.02)", border: "1.5px solid rgba(0,0,0,0.06)" }}
                  >
                    {active && <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                    <div className="text-2xl mb-1">{opt.emoji}</div>
                    <div className="font-bold text-sm" style={{ color: active ? "#9a3412" : "#334155" }}>{opt.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-3xl p-5 bg-white shadow-sm">
            <h2 className="font-black text-slate-900 text-lg mb-1">یک نگاه سریع به حال این روزهات</h2>
            <div className="space-y-5 mt-4">
              {SCALE_QUESTIONS.map((q) => (
                <div key={q.id}>
                  <p className="text-sm font-bold text-slate-800 mb-2">{q.text}</p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        onClick={() => setScale((p) => ({ ...p, [q.id]: v }))}
                        className="flex-1 py-2 rounded-xl font-black transition-all"
                        style={scale[q.id] === v ? { background: "linear-gradient(135deg,#FF6B00,#FF9A3C)", color: "white" } : { background: "rgba(0,0,0,0.03)", color: "#64748b" }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="rounded-3xl p-5 bg-white shadow-sm">
            <h2 className="font-black text-slate-900 text-lg mb-1">ترجیحات جلسه</h2>
            <div className="mb-4">
              <p className="text-sm font-bold text-slate-700 mb-2">نوع برگزاری</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setMode("online")} className="rounded-2xl p-3 text-center" style={mode === "online" ? { background: "rgba(255,107,0,0.12)", border: "1.5px solid #FF6B00" } : { background: "rgba(0,0,0,0.02)" }}>💻 آنلاین</button>
                <button onClick={() => setMode("in_person")} className="rounded-2xl p-3 text-center" style={mode === "in_person" ? { background: "rgba(255,107,0,0.12)", border: "1.5px solid #FF6B00" } : { background: "rgba(0,0,0,0.02)" }}>🏢 حضوری</button>
              </div>
            </div>
            {mode === "in_person" && (
              <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 rounded-2xl mb-4" placeholder="شهر" style={{ background: "rgba(0,0,0,0.02)" }} />
            )}
            <div>
              <p className="text-sm font-bold text-slate-700 mb-2">زمان مناسب</p>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((t) => (
                  <button key={t} onClick={() => toggleTime(t)} className="py-2 rounded-xl text-sm" style={times.includes(t) ? { background: "#1B2A4A", color: "white" } : { background: "white", border: "1px solid #e2e8f0" }}>{t}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="rounded-3xl p-5 bg-white shadow-sm">
            <h2 className="font-black text-slate-900 text-lg mb-1">چند نکته تکمیلی</h2>
            <div className="mb-4">
              <p className="text-sm font-bold text-slate-700 mb-2">ترجیح جنسیت متخصص</p>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setGenderPref("any")} className="py-2 rounded-xl" style={genderPref === "any" ? { background: "#1B2A4A", color: "white" } : { background: "white", border: "1px solid #e2e8f0" }}>فرقی ندارد</button>
                <button onClick={() => setGenderPref("female")} className="py-2 rounded-xl" style={genderPref === "female" ? { background: "#1B2A4A", color: "white" } : { background: "white", border: "1px solid #e2e8f0" }}>خانم</button>
                <button onClick={() => setGenderPref("male")} className="py-2 rounded-xl" style={genderPref === "male" ? { background: "#1B2A4A", color: "white" } : { background: "white", border: "1px solid #e2e8f0" }}>آقا</button>
              </div>
            </div>
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value === "" ? "" : Number(e.target.value))} className="w-full px-4 py-3 rounded-2xl mb-4" placeholder="بودجه هر جلسه (تومان)" style={{ background: "rgba(0,0,0,0.02)" }} />
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-3 rounded-2xl" placeholder="هر چیز دیگری که می‌خواهی بگویی..." style={{ background: "rgba(0,0,0,0.02)" }} />
          </div>
        )}

        {step === 5 && (
          <div className="rounded-3xl p-5 bg-white shadow-sm">
            <h2 className="font-black text-slate-900 text-lg mb-1">مرور و تأیید</h2>
            <div className="space-y-2 mb-4">
              <p><span className="font-bold">موضوعات:</span> {concerns.map(c => CONCERN_OPTIONS.find(o => o.id === c)?.label).join(", ")}</p>
              <p><span className="font-bold">نوع برگزاری:</span> {mode === "online" ? "آنلاین" : `حضوری${city ? ` - ${city}` : ""}`}</p>
              <p><span className="font-bold">زمان‌ها:</span> {times.join(", ")}</p>
              {budget && <p><span className="font-bold">بودجه:</span> {Number(budget).toLocaleString()} تومان</p>}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mt-5">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 rounded-2xl border">مرحله قبل</button>
          )}
          {step < TOTAL_STEPS ? (
            <button onClick={() => canGoNext() && setStep(s => s + 1)} disabled={!canGoNext()} className="flex-1 py-3 rounded-2xl text-white bg-orange-500 disabled:opacity-40">مرحله بعد <ChevronLeft size={16} className="inline" /></button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-3 rounded-2xl text-white bg-orange-500">
              {submitting ? <Loader2 size={16} className="animate-spin inline" /> : "ارسال و مشاهده پیشنهادات"} <ArrowLeft size={16} className="inline" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"/></div>}><Inner /></Suspense>;
}
