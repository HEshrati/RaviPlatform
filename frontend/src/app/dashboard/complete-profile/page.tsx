"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { updateUserProfile, updateUserName, isAdminPhone } from "@/lib/api";
import {
  MapPin, User, CheckCircle2, ArrowLeft, Sparkles,
  AlertCircle, ChevronDown
} from "lucide-react";

const CITIES = [
  "تهران", "مشهد", "اصفهان", "شیراز", "تبریز", "کرج",
  "قم", "اهواز", "کرمانشاه", "ارومیه", "رشت", "زاهدان",
  "کرمان", "همدان", "یزد", "بندرعباس", "بوشهر", "سنندج",
  "ساری", "گرگان", "قزوین", "اردبیل", "سبزوار", "بابل",
];

export default function CompleteProfilePage() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [name, setName] = useState(state.user?.name || "");
  const [city, setCity] = useState(state.city || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  // If admin or already has name+city, skip
  useEffect(() => {
    if (state.isLoading) return;
    if (!state.isLoggedIn) { router.replace("/login"); return; }
    if (isAdminPhone(state.user?.mobileNumber)) { router.replace("/"); return; }
  }, [state.isLoading, state.isLoggedIn]);

  const handleSubmit = async () => {
    setError("");
    if (!name.trim() || name.trim().length < 2) {
      setError("نام باید حداقل ۲ حرف باشد.");
      return;
    }
    if (!city) {
      setError("لطفاً شهر خود را انتخاب کنید.");
      return;
    }

    setSaving(true);
    try {
      // Save both name (to User entity) and city (to Profile entity)
      await Promise.all([
        updateUserName(name.trim()),
        updateUserProfile({ city, bio: "" }),
      ]);

      // Update context
      dispatch({ type: "SET_CITY", payload: city } as any);
      dispatch({
        type: "SET_USER",
        payload: { ...state.user!, name: name.trim(), city } as any,
      } as any);

      // Persist in localStorage
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("user");
        if (raw) {
          const u = JSON.parse(raw);
          u.name = name.trim();
          u.city = city;
          localStorage.setItem("user", JSON.stringify(u));
        }
      }

      setDone(true);
      setTimeout(() => router.replace("/events"), 1800);
    } catch (e: any) {
      setError(e?.message || "خطا در ذخیره اطلاعات. دوباره تلاش کنید.");
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40
                          flex items-center justify-center mx-auto mb-5 animate-pulse">
            <CheckCircle2 size={38} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">پروفایل تکمیل شد! 🎉</h2>
          <p className="text-slate-400 text-sm">در حال انتقال به صفحه همنشینی...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-28 relative">
      <div className="w-full max-w-md space-y-6" dir="rtl">

        {/* ── Hero Header ── */}
        <div className="text-center mb-2">
          <div
            className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-xl"
            style={{
              background: "linear-gradient(135deg, #FF6B00 0%, #FF9A3C 100%)",
              boxShadow: "0 12px 32px rgba(255,107,0,0.45)"
            }}
          >
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white leading-tight">تکمیل پروفایل</h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            برای دسترسی به همنشینی‌ها، لطفاً اطلاعات زیر را وارد کنید
          </p>
        </div>

        {/* ── Name Input ── */}
        <div
          className="rounded-3xl p-5 border border-white/8"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
            <User size={15} className="text-orange-400" />
            نام و نام خانوادگی <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="مثال: علی احمدی"
            className="w-full rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500
                       outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: `1px solid ${name.trim().length >= 2 ? "rgba(255,107,0,0.4)" : "rgba(255,255,255,0.12)"}`,
            }}
          />
          {name.trim().length >= 2 && (
            <p className="text-xs text-orange-400 mt-1.5 flex items-center gap-1">
              <CheckCircle2 size={11} /> نام معتبر
            </p>
          )}
        </div>

        {/* ── City Selector ── */}
        <div
          className="rounded-3xl p-5 border border-white/8"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
            <MapPin size={15} className="text-orange-400" />
            شهر محل سکونت <span className="text-red-400">*</span>
          </label>

          {/* Custom dropdown */}
          <div className="relative">
            <button
              onClick={() => setCityOpen(!cityOpen)}
              className="w-full rounded-2xl px-4 py-3 text-sm text-right flex items-center justify-between transition-all"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: `1px solid ${city ? "rgba(255,107,0,0.4)" : "rgba(255,255,255,0.12)"}`,
                color: city ? "white" : "rgba(148,163,184,1)"
              }}
            >
              <span>{city || "شهر خود را انتخاب کنید"}</span>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${cityOpen ? "rotate-180" : ""}`}
              />
            </button>

            {cityOpen && (
              <div
                className="absolute top-full mt-2 left-0 right-0 rounded-2xl border border-white/10
                           shadow-2xl z-50 overflow-y-auto max-h-52"
                style={{ background: "rgba(15, 23, 42, 0.97)", backdropFilter: "blur(16px)" }}
              >
                {CITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCity(c); setCityOpen(false); setError(""); }}
                    className={`w-full text-right px-4 py-2.5 text-sm transition-colors
                                ${c === city
                                  ? "bg-orange-500/20 text-orange-400 font-bold"
                                  : "text-slate-300 hover:bg-white/5 hover:text-white"
                                }`}
                  >
                    {c === city && "✓ "}
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid fallback */}
          <div className="grid grid-cols-3 gap-1.5 mt-3">
            {CITIES.slice(0, 9).map((c) => (
              <button
                key={c}
                onClick={() => { setCity(c); setError(""); }}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                  city === c
                    ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
                style={city !== c
                  ? { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }
                  : {}
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm px-1
                          bg-red-500/10 border border-red-500/20 rounded-2xl p-3">
            <AlertCircle size={14} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ── Submit ── */}
        <button
          onClick={handleSubmit}
          disabled={saving || name.trim().length < 2 || !city}
          className="w-full py-4 rounded-2xl font-black text-base transition-all
                     flex items-center justify-center gap-2 disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, #FF6B00, #FF9A3C)",
            color: "white",
            boxShadow: "0 8px 24px rgba(255,107,0,0.4)",
            opacity: (saving || name.trim().length < 2 || !city) ? 0.4 : 1,
          }}
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              ورود به همنشینی‌ها
              <ArrowLeft size={18} />
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-600">
          اطلاعات شما کاملاً محرمانه نگهداری می‌شود
        </p>
      </div>
    </div>
  );
}
