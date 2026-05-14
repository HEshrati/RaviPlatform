"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  fetchUserProfile,
  updateUserProfile,
  fetchUserStats,
  UserProfile,
  UserStats,
} from "@/lib/api";
import {
  User, Star, Calendar, Edit3, Save, X, Camera,
  CheckCircle, MapPin, BookOpen, Award, TrendingUp,
  Upload, Image as ImageIcon, Brain, Sparkles,
} from "lucide-react";
import SmartProfileCard from "@/components/SmartProfileCard";

// ... (existing IRANIAN_CITIES and other constants stay the same)

const IRANIAN_CITIES = [
  "تهران","اصفهان","شیراز","تبریز","مشهد","اهواز","کرمانشاه","ارومیه",
  "رشت","کرج","زاهدان","همدان","کرمان","یزد","اردبیل","بندرعباس","قم",
];

const INITIAL_PROFILE: UserProfile = {
  avatarUrl: "", bio: "", interests: [], city: "", age: null, gender: "", education: "",
};

const INITIAL_STATS: UserStats = {
  successfulMatches: 0, completedEvents: 0, upcomingEvents: 0, totalBookings: 0,
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ProfilePage() {
  const { state } = useApp();
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [interestsInput, setInterestsInput] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSmartProfile, setShowSmartProfile] = useState(true);

  useEffect(() => {
    if (!state.isLoggedIn) return;
    Promise.all([fetchUserProfile(), fetchUserStats()])
      .then(([p, s]) => {
        setProfile(p);
        setStats(s);
        setInterestsInput((p.interests || []).join("، "));
      })
      .catch(() => {});
  }, [state.isLoggedIn]);

  function updateField<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setStatus("");
    try {
      const interests = interestsInput
        .split(/[,،]/)
        .map((s) => s.trim())
        .filter(Boolean);
      await updateUserProfile({ ...profile, interests });
      setStatus("پروفایل با موفقیت ذخیره شد ✓");
      setIsEditing(false);
      setTimeout(() => setStatus(""), 3000);
    } catch {
      setStatus("خطا در ذخیره‌سازی. دوباره تلاش کنید.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setStatus("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
      return;
    }
    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setAvatarPreview(ev.target.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/profiles/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data?.avatarUrl) updateField("avatarUrl", data.avatarUrl);
    } catch {
      setStatus("خطا در آپلود تصویر");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  const displayName = state.user?.name || profile.bio || "کاربر راوی";
  const avatarSrc = avatarPreview || profile.avatarUrl;
  const initials = displayName.charAt(0).toUpperCase();

  if (!state.isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]" dir="rtl">
        <p className="text-slate-400">لطفاً ابتدا وارد شوید</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-28 space-y-5" dir="rtl">
      {/* ── کارت هدر پروفایل ── */}
      <div
        className="rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* بنر گرادیانت */}
        <div className="h-32 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 40%, #c2410c 100%)" }}>
          <div className="absolute inset-0"
            style={{ backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-16"
            style={{ background: "linear-gradient(to top, #0f172a, transparent)" }} />
        </div>

        <div className="px-6 pb-6 -mt-16">
          {/* آواتار */}
          <div className="relative w-24 h-24 mb-4">
            <div className="w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-slate-900 shadow-xl"
              style={{ background: "linear-gradient(135deg, #FF6B00, #c2410c)" }}>
              {avatarSrc ? (
                <img src={avatarSrc} alt="آواتار" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-black text-white">{initials}</span>
                </div>
              )}
            </div>
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute -bottom-2 -left-2 w-8 h-8 bg-orange-500 hover:bg-orange-400 rounded-xl flex items-center justify-center shadow-lg transition"
              >
                {isUploadingAvatar ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={14} className="text-white" />
                )}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">{displayName}</h2>
              <div className="flex items-center gap-3 mt-1">
                {profile.city && (
                  <span className="text-sm flex items-center gap-1 text-slate-400">
                    <MapPin size={12} className="text-orange-400" />{profile.city}
                  </span>
                )}
                {profile.age && (
                  <span className="text-sm text-slate-400">{profile.age} سال</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition"
              style={{ background: "rgba(255,107,0,0.15)", border: "1px solid rgba(255,107,0,0.3)" }}
            >
              <Edit3 size={14} />
              {isEditing ? "انصراف" : "ویرایش"}
            </button>
          </div>

          {/* آمار */}
          <div className="grid grid-cols-4 gap-2 mt-5">
            {[
              { value: stats.totalBookings, label: "رزرو" },
              { value: stats.completedEvents, label: "شرکت" },
              { value: stats.upcomingEvents, label: "پیش‌رو" },
              { value: stats.successfulMatches, label: "مچ" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center rounded-xl p-2"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-lg font-black text-orange-400">{value || 0}</p>
                <p className="text-[10px] text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── پروفایل هوشمند ── */}
      <SmartProfileCard />

      {/* ── فرم ویرایش ── */}
      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl p-6 space-y-4"
          style={{ background: "linear-gradient(145deg, #1B2A4A, #132038)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Edit3 size={16} className="text-orange-400" />
            ویرایش پروفایل
          </h3>

          {/* شهر */}
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-300 flex items-center gap-1">
              <MapPin size={13} className="text-orange-400" /> شهر
            </span>
            <select
              value={profile.city ?? ""}
              onChange={(e) => updateField("city", e.target.value)}
              className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition appearance-none cursor-pointer"
            >
              <option value="">انتخاب کنید</option>
              {IRANIAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          {/* سن */}
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-300">سن</span>
            <input
              type="number"
              min={18} max={80}
              value={profile.age ?? ""}
              onChange={(e) => updateField("age", e.target.value ? Number(e.target.value) : null)}
              className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition"
              placeholder="۲۵"
            />
          </label>

          {/* جنسیت */}
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-300">جنسیت</span>
            <select
              value={profile.gender ?? ""}
              onChange={(e) => updateField("gender", e.target.value)}
              className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition appearance-none cursor-pointer"
            >
              <option value="">انتخاب کنید</option>
              <option value="male">مرد</option>
              <option value="female">زن</option>
              <option value="prefer-not-to-say">ترجیح می‌دهم نگویم</option>
            </select>
          </label>

          {/* علایق */}
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-300 flex items-center gap-1">
              <Award size={13} className="text-purple-400" />
              علایق (با کاما جدا کنید)
            </span>
            <input
              value={interestsInput}
              onChange={(e) => setInterestsInput(e.target.value)}
              className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition"
              placeholder="کتاب، موسیقی، کوهنوردی، سینما"
            />
            <p className="text-[10px] text-slate-500">این اطلاعات برای بهبود پروفایل هوشمند استفاده می‌شود</p>
          </label>

          {/* دکمه‌ها */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white px-5 py-3 font-bold transition-all shadow-lg shadow-orange-500/20 text-sm"
            >
              <Save size={16} />
              {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-xl bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 font-bold transition text-sm"
            >
              انصراف
            </button>
          </div>

          {status && (
            <div className={`rounded-xl px-4 py-3 text-sm font-bold flex items-center gap-2 ${
              status.includes("موفق")
                ? "bg-green-500/15 text-green-400 border border-green-500/30"
                : "bg-red-500/15 text-red-400 border border-red-500/30"
            }`}>
              {status.includes("موفق") ? <CheckCircle size={15} /> : <X size={15} />}
              {status}
            </div>
          )}
        </form>
      )}

      {/* تست شخصیت */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(145deg, #1B2A4A, #132038)",
          border: "1px solid rgba(139,92,246,0.2)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(139,92,246,0.15)" }}>
            <Brain size={18} className="text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-white">تست شخصیت</h3>
            <p className="text-xs text-slate-400 mt-0.5">تیپ ارتباطی‌ات را شناسایی کن</p>
          </div>
          <a
            href="/dashboard/personality-test"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition"
            style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#c084fc" }}
          >
            <Sparkles size={12} />
            شروع
          </a>
        </div>
      </div>
    </div>
  );
}
