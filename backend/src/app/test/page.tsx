"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const PROVINCES = [
  "تهران",
  "اصفهان",
  "فارس",
  "خراسان رضوی",
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "البرز",
  "اردبیل",
  "بوشهر",
  "چهارمحال و بختیاری",
  "گیلان",
  "گلستان",
  "همدان",
  "هرمزگان",
  "ایلام",
  "کرمان",
  "کرمانشاه",
  "خوزستان",
  "کهگیلویه و بویراحمد",
  "کردستان",
  "لرستان",
  "مازندران",
  "مرکزی",
  "قزوین",
  "قم",
  "سمنان",
  "سیستان و بلوچستان",
  "خراسان شمالی",
  "خراسان جنوبی",
  "زنجان",
  "یزد",
];

const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const QUESTIONS = [
  {
    id: 1,
    type: "mcq",
    text: "معمولاً تو تصمیم‌هات، کدوم بیشتر راهنمایته؟",
    options: [
      { id: "A", text: "بیشتر با فکر و تحلیل جلو میرم" },
      { id: "B", text: "بیشتر با حس و حال دلم تصمیم می‌گیرم" },
    ],
  },
  {
    id: 2,
    type: "mcq",
    text: "اگه بخوای حال‌وهوات رو به یه کافه تشبیه کنی، بیشتر کدوم فضارو انتخاب می‌کنی؟",
    options: [
      { id: "A", text: "یه کافه‌ی آروم و دنج با میزهای همیشگی و فضای آشنا" },
      {
        id: "B",
        text: "یه کافه‌ی مدرن و پرهیجان با دکور متفاوت و حال‌وهوای تازه",
      },
    ],
  },
  {
    id: 3,
    type: "mcq",
    text: "اگه بخوای حال‌وهوات رو به یه سفر تشبیه کنی، کدوم مدل بیشتر شبیه توئه؟",
    options: [
      {
        id: "A",
        text: "سفری که از قبل مسیرش مشخصه و همه‌چیز طبق برنامه جلو میره",
      },
      {
        id: "B",
        text: "سفری که مقصدش یه بهونه‌ست و ماجراهاش همون‌جا شکل می‌گیره",
      },
    ],
  },
  {
    id: 4,
    type: "scale",
    text: "شخصیت تو به کدوم نزدیک‌تره؟",
    min: 1,
    max: 5,
    minLabel: "کاملاً درون‌گرا",
    maxLabel: "کاملاً برون‌گرا",
  },
  {
    id: 5,
    type: "scale",
    text: "اگه بخوای انگیزه‌تو به یه آتیش تشبیه کنی، بیشتر کدوم حالته؟",
    min: 1,
    max: 5,
    minLabel: "معمولاً یکی باید جرقه بزنه تا شعله‌ور بشم",
    maxLabel: "خودم از درون روشن می‌شم و حرکت می‌کنم",
  },
  {
    id: 6,
    type: "scale",
    text: "از جایگاهی که الان تو مسیر کاری‌ت داری، چقدر راضی‌ای؟",
    min: 1,
    max: 5,
    minLabel: "اصلاً راضی نیستم",
    maxLabel: "کاملاً از موقعیتم رضایت دارم",
  },
  {
    id: 7,
    type: "mcq",
    text: "اگه بخوای حالتو به یه لوکیشن فیلم تشبیه کنی، کدوم صحنه بیشتر شبیه توئه؟",
    options: [
      { id: "A", text: "خیابون‌های زنده و نورهای شهر" },
      { id: "B", text: "هر جا داستان خوب باشه، برام فرقی نمی‌کنه" },
      { id: "C", text: "منظره‌ی کوه و جنگل و صدای باد" },
    ],
  },
  {
    id: 8,
    type: "mcq",
    text: "الان تو چه مرحله‌ای از رابطه‌ای؟",
    options: [
      { id: "A", text: "مجرد" },
      { id: "B", text: "متأهل" },
      { id: "C", text: "در رابطه" },
      { id: "D", text: "وضعیت پیچیده‌ست" },
    ],
  },
  {
    id: 9,
    type: "province",
    text: "بیشتر دوست داری دورهمی‌هات تو کدوم استان برگزار بشه؟",
    subtitle: "(بعداً هم می‌تونی موقعیتتو تغییر بدی)",
  },
  {
    id: 10,
    type: "mcq",
    text: "جنسیتت رو مشخص کن:",
    options: [
      { id: "male", text: "مرد" },
      { id: "female", text: "زن" },
    ],
  },
  { id: 11, type: "text", text: "چطور صدات کنیم؟" },
  {
    id: 12,
    type: "textarea",
    text: "چند تا چیز جالب درباره‌ی خودت بگو که بقیه با خوندنش یه تصویر ازت بسازن:",
    subtitle: "حداکثر ۵۰۰ کاراکتر",
  },
  { id: 13, type: "date", text: "تاریخ تولدت رو وارد کن:" },
];

function ScaleQ({ q, value, onChange }) {
  const min = q.min ?? 1;
  const max = q.max ?? 5;
  const count = max - min + 1;
  // steps from max(top) to min(bottom)
  const steps = Array.from({ length: count }, (_, i) => max - i);

  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  // Each step occupies an equal slice of the track height.
  // The thumb center maps to the middle of each slice:
  //   thumbPct = (stepIndex + 0.5) / count * 100
  const stepIndex = max - value; // 0=max(top), count-1=min(bottom)
  const thumbPct = (stepIndex + 0.5) / count; // 0..1

  const getVal = useCallback(
    (clientY) => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      // reverse: pct = (stepIdx + 0.5)/count → stepIdx = pct*count - 0.5
      const idx = Math.round(pct * count - 0.5);
      const clamped = Math.max(0, Math.min(count - 1, idx));
      return max - clamped;
    },
    [min, max, count, value],
  );

  useEffect(() => {
    const mm = (e) => {
      if (!dragging) return;
      onChange(getVal(e.clientY));
    };
    const tm = (e) => {
      if (!dragging || !e.touches[0]) return;
      onChange(getVal(e.touches[0].clientY));
    };
    const stop = () => setDragging(false);
    if (dragging) {
      window.addEventListener("mousemove", mm);
      window.addEventListener("mouseup", stop);
      window.addEventListener("touchmove", tm, { passive: true });
      window.addEventListener("touchend", stop);
    }
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", stop);
    };
  }, [dragging, getVal, onChange]);

  // Bar width per step: wider at extremes, narrowest at middle
  // For 1-5: step3=middle → narrowest, step5 & step1 → widest
  const barWidth = (step) => {
    const mid = (max + min) / 2; // 3 for 1-5
    const maxDist = (max - min) / 2; // 2 for 1-5
    const dist = Math.abs(step - mid);
    // 44px at middle, 72px at extremes
    return Math.round(44 + (dist / maxDist) * 28);
  };

  // Color: selected value and below (toward min) = orange; above = gray
  const barColor = (step) => {
    if (step <= value) return "#f97316"; // selected & toward min
    return "#374151"; // above selected
  };
  const barOpacity = (step) => {
    if (step === value) return 1;
    if (step < value) return 0.6; // filled but dimmer toward min
    return 1; // gray above
  };

  // Fixed height per step group (4 bars + spacing)
  const STEP_H = 52;
  const TRACK_H = STEP_H * count;
  const BARS = 4; // bars per step level

  return (
    <div className="w-full flex flex-col items-center py-2" dir="ltr">
      {/* Main track area: [label col] [bars col] [number col] */}
      <div className="flex items-center gap-0" style={{ height: TRACK_H }}>
        {/* LEFT: min/max labels pinned to top and bottom */}
        <div
          className="flex flex-col justify-between items-end pr-3"
          style={{ width: 100, height: TRACK_H }}
        >
          <span
            className="text-xs font-semibold leading-tight text-right"
            style={{
              color: value === max ? "#f97316" : "#9ca3af",
              maxWidth: 96,
            }}
          >
            {q.maxLabel}
          </span>
          <span
            className="text-xs font-semibold leading-tight text-right"
            style={{
              color: value === min ? "#f97316" : "#9ca3af",
              maxWidth: 96,
            }}
          >
            {q.minLabel}
          </span>
        </div>

        {/* CENTER: bars track + draggable overlay + thumb */}
        <div className="relative" style={{ width: 80, height: TRACK_H }}>
          {/* Drag capture */}
          <div
            ref={trackRef}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            style={{ zIndex: 10 }}
            onMouseDown={(e) => {
              e.preventDefault();
              setDragging(true);
              onChange(getVal(e.clientY));
            }}
            onTouchStart={(e) => {
              setDragging(true);
              onChange(getVal(e.touches[0].clientY));
            }}
          />

          {/* Step bar groups */}
          <div
            className="absolute inset-0 flex flex-col pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {steps.map((step) => (
              <div
                key={step}
                className="flex flex-col items-center justify-evenly"
                style={{ height: STEP_H, flex: "none" }}
              >
                {Array.from({ length: BARS }).map((_, bi) => (
                  <div
                    key={bi}
                    className="rounded-full transition-colors duration-200"
                    style={{
                      width: barWidth(step),
                      height: 5,
                      background: barColor(step),
                      opacity: barOpacity(step),
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Thumb — centered on selected step */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: `${thumbPct * 100}%`,
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 20,
              transition: dragging
                ? "none"
                : "top 0.18s cubic-bezier(.4,0,.2,1)",
            }}
          >
            <div
              className={`rounded-full transition-transform duration-100 ${dragging ? "scale-105" : ""}`}
              style={{
                width: 46,
                height: 46,
                background:
                  "radial-gradient(circle at 38% 33%, #ffffff 0%, #d1d5db 100%)",
                boxShadow:
                  "0 6px 24px rgba(0,0,0,0.45), inset 0 2px 4px rgba(255,255,255,0.8), 0 0 0 2px rgba(249,115,22,0.25)",
              }}
            />
          </div>
        </div>

        {/* RIGHT: step numbers */}
        <div
          className="flex flex-col justify-between items-center pl-3"
          style={{ height: TRACK_H }}
        >
          {steps.map((step) => (
            <div
              key={step}
              className="flex items-center justify-center cursor-pointer select-none"
              style={{ height: STEP_H }}
              onMouseDown={() => onChange(step)}
            >
              <span
                className="font-bold text-sm transition-colors duration-150"
                style={{ color: step === value ? "#f97316" : "#6b7280" }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function McqQ({ q, value, onChange }) {
  return (
    <div className="space-y-3 w-full">
      {q.options?.map((opt) => {
        const sel = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className="w-full p-5 rounded-2xl text-right transition-all duration-200"
            style={{
              background: sel
                ? "rgba(249,115,22,0.1)"
                : "rgba(255,255,255,0.04)",
              border: `2px solid ${sel ? "#f97316" : "rgba(255,255,255,0.1)"}`,
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                style={{
                  background: sel ? "#f97316" : "transparent",
                  borderColor: sel ? "#f97316" : "#6b7280",
                }}
              >
                {sel && (
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-base font-semibold ${sel ? "text-white" : "text-gray-200"}`}
              >
                {opt.text}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function TestPage() {
  const router = useRouter();
  const { setUser, state, logout } = useApp();
  const [current, setCurrent] = useState(0);

  // Guard: if not logged in → login, if test already taken → dashboard
  useEffect(() => {
    if (state.isLoading) return;
    if (!state.isLoggedIn) {
      router.replace("/login");
      return;
    }
    if (state.isTestTaken) {
      router.replace("/dashboard");
      return;
    }
  }, [state.isLoading, state.isLoggedIn, state.isTestTaken]);
  const [answers, setAnswers] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [province, setProvince] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const q = QUESTIONS[current];
  const progress = Math.round(((current + 1) / QUESTIONS.length) * 100);

  const setAnswer = (val) => setAnswers((prev) => ({ ...prev, [q.id]: val }));
  const getCur = () => answers[q.id];

  const canNext = () => {
    if (q.type === "mcq") return !!getCur();
    if (q.type === "scale") return getCur() !== undefined;
    if (q.type === "province") return !!province;
    if (q.type === "text") return !!firstName.trim();
    if (q.type === "textarea") return bio.trim().length >= 10;
    if (q.type === "date") return !!birthDay && !!birthMonth && !!birthYear;
    return true;
  };

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
      setError("");
    } else handleSubmit();
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      setError("");
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const profileData: Record<string, any> = {
        first_name: firstName.trim(),
        last_name: lastName.trim() || undefined,
        bio: bio.trim(),
        city: province,
        gender: answers[10] || undefined,
        marital_status:
          answers[8] === "A"
            ? "single"
            : answers[8] === "B"
              ? "married"
              : answers[8] === "C"
                ? "in_relationship"
                : "other",
      };
      if (birthDay && birthMonth && birthYear) {
        const monthIdx = String(JALALI_MONTHS.indexOf(birthMonth) + 1).padStart(
          2,
          "0",
        );
        profileData.birth_date = `${birthYear}-${monthIdx}-${birthDay.padStart(2, "0")}`;
      }
      await fetch(`${API}/api/profiles/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      await fetch(`${API}/api/test-results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          test_name: "onboarding_personality",
          scores: answers,
          main_result: `q4:${answers[4]},q5:${answers[5]},q6:${answers[6]}`,
        }),
      }).catch(() => {});
      const mRes = await fetch(`${API}/api/auth/mark-test-taken`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!mRes.ok) throw new Error("خطا در ثبت نتیجه");
      const saved = JSON.parse(localStorage.getItem("user") || "{}");
      const updated = { ...saved, isTestTaken: true, name: firstName.trim() };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      router.push("/dashboard");
    } catch (e) {
      setError(e?.message || "خطا در ثبت اطلاعات");
    } finally {
      setSubmitting(false);
    }
  };

  const renderBody = () => {
    switch (q.type) {
      case "mcq":
        return <McqQ q={q} value={getCur() || ""} onChange={setAnswer} />;
      case "scale":
        return (
          <ScaleQ
            q={q}
            value={getCur() ?? Math.ceil(((q.min ?? 1) + (q.max ?? 5)) / 2)}
            onChange={setAnswer}
          />
        );
      case "province":
        return (
          <div className="w-full">
            {q.subtitle && (
              <p className="text-orange-300 text-sm mb-4">{q.subtitle}</p>
            )}
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-white text-base outline-none focus:ring-2 focus:ring-orange-500"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.15)",
              }}
              dir="rtl"
            >
              <option value="" style={{ background: "#132038" }}>
                انتخاب استان…
              </option>
              {PROVINCES.map((p) => (
                <option key={p} value={p} style={{ background: "#132038" }}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        );
      case "text":
        return (
          <div className="w-full space-y-3">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="نام"
              className="w-full rounded-xl px-4 py-3 text-white text-base outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-gray-500"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.15)",
              }}
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="نام خانوادگی (اختیاری)"
              className="w-full rounded-xl px-4 py-3 text-white text-base outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-gray-500"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.15)",
              }}
            />
          </div>
        );
      case "textarea":
        return (
          <div className="w-full">
            {q.subtitle && (
              <p className="text-orange-300 text-sm mb-3">{q.subtitle}</p>
            )}
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 500))}
              placeholder="بیو..."
              rows={5}
              className="w-full rounded-xl px-4 py-3 text-white text-base outline-none focus:ring-2 focus:ring-orange-500 resize-none placeholder:text-gray-500"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.15)",
              }}
            />
            <p className="text-gray-400 text-xs mt-1 text-left">
              {bio.length}/500
            </p>
          </div>
        );
      case "date": {
        const days = Array.from({ length: 31 }, (_, i) =>
          String(i + 1).padStart(2, "0"),
        );
        const years = Array.from({ length: 60 }, (_, i) => String(1340 + i));
        return (
          <div className="w-full flex gap-3">
            {[
              { label: "روز", val: birthDay, set: setBirthDay, opts: days },
              {
                label: "ماه",
                val: birthMonth,
                set: setBirthMonth,
                opts: JALALI_MONTHS,
              },
              { label: "سال", val: birthYear, set: setBirthYear, opts: years },
            ].map(({ label, val, set, opts }) => (
              <div key={label} className="flex-1">
                <label className="text-gray-400 text-xs mb-1 block">
                  {label}
                </label>
                <select
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  dir="rtl"
                  className="w-full rounded-xl px-3 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1.5px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <option value="" style={{ background: "#132038" }}>
                    —
                  </option>
                  {opts.map((o) => (
                    <option key={o} value={o} style={{ background: "#132038" }}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        );
      }
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(249,115,22,0.12) 0%, #060e1c 55%, #040a14 100%)",
        padding: "24px 16px",
      }}
      dir="rtl"
    >
      {/* ── Logo / brand above card ── */}
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(249,115,22,0.18)",
            border: "1px solid rgba(249,115,22,0.3)",
          }}
        >
          <span className="text-orange-400 text-base">✦</span>
        </div>
        <span className="text-white font-black text-base tracking-wide">
          راوی
        </span>
      </div>

      {/* ── Card ── */}
      <div
        className="w-full flex flex-col overflow-hidden"
        style={{
          maxWidth: 540,
          borderRadius: 24,
          background: "linear-gradient(155deg, #112040 0%, #0a1728 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 0 0 1px rgba(249,115,22,0.05), 0 24px 64px rgba(0,0,0,0.55), 0 4px 16px rgba(249,115,22,0.06)",
        }}
      >
        {/* ── Card top bar ── */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            خروج از حساب
          </button>
          <span className="text-gray-300 text-xs font-medium">
            سوال {current + 1} از {QUESTIONS.length}
          </span>
          <span className="text-sm font-black" style={{ color: "#f97316" }}>
            {progress}٪
          </span>
        </div>

        {/* ── Progress bar + step dots ── */}
        <div className="px-6 pt-4 pb-3 space-y-2">
          {/* Step dots */}
          <div className="flex gap-1 justify-center">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 18 : 5,
                  height: 5,
                  background:
                    i < current
                      ? "#f97316"
                      : i === current
                        ? "#fb923c"
                        : "rgba(255,255,255,0.1)",
                  opacity: i > current ? 0.5 : 1,
                }}
              />
            ))}
          </div>
          {/* Bar */}
          <div
            className="w-full h-1 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg,#f97316,#fb923c)",
                boxShadow: "0 0 10px rgba(249,115,22,0.6)",
              }}
            />
          </div>
        </div>

        {/* ── Question ── */}
        <div className="px-6 pt-2 pb-2 flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{
              background: "rgba(249,115,22,0.12)",
              border: "1px solid rgba(249,115,22,0.22)",
            }}
          >
            <span className="text-orange-400 font-black text-xs">
              {current + 1}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white leading-relaxed">
            {q.text}
          </h2>
        </div>

        {/* ── Question body ── */}
        <div className="px-6 py-4" style={{ minHeight: 280 }}>
          {renderBody()}
          {error && (
            <div
              className="mt-4 p-3 rounded-xl text-red-300 text-sm text-center"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* ── Navigation ── */}
        <div
          className="flex gap-3 px-6 py-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {current > 0 && (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-5 py-3 rounded-2xl font-bold text-gray-400 hover:text-white transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <ChevronRight size={16} />
              قبلی
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canNext() || submitting}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-white transition-all disabled:opacity-35"
            style={{
              background: "linear-gradient(135deg,#f97316,#fb923c)",
              boxShadow: canNext()
                ? "0 6px 22px rgba(249,115,22,0.38)"
                : "none",
            }}
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                در حال ثبت...
              </>
            ) : current === QUESTIONS.length - 1 ? (
              "ثبت اطلاعات ✓"
            ) : (
              <>
                <ChevronLeft size={16} />
                سوال بعدی
              </>
            )}
          </button>
        </div>
      </div>

      {/* Privacy note below card */}
      <p className="text-center text-gray-700 text-xs mt-5">
        🔒 پاسخ‌های شما کاملاً محرمانه باقی می‌ماند.
      </p>
    </div>
  );
}
