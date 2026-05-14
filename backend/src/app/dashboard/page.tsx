"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { fetchMyTestResults, isAdminPhone } from "@/lib/api";
import {
  Calendar, Users, Sparkles, ArrowLeft, MapPin,
  Edit3, X, CheckCircle2, Trophy, TrendingUp, Star,
} from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

export default function DashboardHomePage() {
  const { state } = useApp();
  const router = useRouter();
  const userName = state.user?.name || "کاربر راوی";
  const isAdmin = isAdminPhone(state.user?.mobileNumber);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileStats, setProfileStats] = useState<any>(null);
  const [latestTest, setLatestTest] = useState<any>(null);

  useEffect(() => {
    if (state.isLoading) return;
    if (!state.isLoggedIn) return;
    // ادمین‌ها فقط از صفحه اصلی داشبورد ریدایرکت می‌شن
    // نه از زیرصفحه‌هایی مثل /dashboard/profile
    if (isAdmin) {
      const isExactDashboard = window.location.pathname === "/dashboard";
      const hasUserParam = new URLSearchParams(window.location.search).has("user");
      if (isExactDashboard && !hasUserParam) {
        router.replace("/admin/dashboard");
      }
    }
  }, [state.isLoading, state.isLoggedIn, isAdmin]);

  useEffect(() => {
    if (!state.isLoggedIn) return;
    fetchMyTestResults().then((data) => setLatestTest(data.data?.[0] || null));
  }, [state.isLoggedIn]);

  const loadProfileStats = async () => {
    setShowProfileModal(true);
    const token = getToken();
    if (!token) return;
    try {
      const [bookingsRes, profileRes] = await Promise.all([
        fetch(`${API}/api/bookings`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/profiles/me`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const bookingsData = await bookingsRes.json();
      const profileData = profileRes.ok ? await profileRes.json() : null;
      const bookings = Array.isArray(bookingsData) ? bookingsData
        : Array.isArray(bookingsData?.data) ? bookingsData.data
        : Array.isArray(bookingsData?.bookings) ? bookingsData.bookings : [];
      const confirmed = bookings.filter((b: any) => b.status === "confirmed");
      const successRate = bookings.length > 0 ? Math.round((confirmed.length / bookings.length) * 100) : 0;
      setProfileStats({
        totalEvents: bookings.length,
        successfulEvents: confirmed.length,
        successRate,
        bio: profileData?.bio || (state.user as any)?.bio || "",
        city: profileData?.city || state.city || "",
        matchScore: Math.floor(Math.random() * 20) + 80,
      });
    } catch {
      setProfileStats({ totalEvents: 0, successfulEvents: 0, successRate: 0, bio: "", city: state.city || "", matchScore: 85 });
    }
  };

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6" dir="rtl">
      {/* مودال پروفایل */}
      {showProfileModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6 shadow-2xl"
            style={{ background: "linear-gradient(145deg,#1B2A4A,#0d1e35)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-black text-lg">اطلاعات کاربری</h2>
              <button onClick={() => setShowProfileModal(false)}>
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* آواتار و نام */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center text-3xl font-black text-orange-400">
                {userName[0]}
              </div>
              <div>
                <p className="text-white font-black text-base">{userName}</p>
                {profileStats?.city && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={11} className="text-orange-400" />
                    <span className="text-orange-300 text-xs">{profileStats.city}</span>
                  </div>
                )}
                {profileStats?.bio && (
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">{profileStats.bio}</p>
                )}
              </div>
            </div>

            {/* آمار */}
            {profileStats ? (
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="rounded-2xl p-3 text-center" style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
                  <div className="flex justify-center mb-1"><Calendar size={16} className="text-orange-400" /></div>
                  <p className="text-white font-black text-lg">{profileStats.totalEvents}</p>
                  <p className="text-slate-400 text-[10px]">رویداد</p>
                </div>
                <div className="rounded-2xl p-3 text-center" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <div className="flex justify-center mb-1"><CheckCircle2 size={16} className="text-green-400" /></div>
                  <p className="text-white font-black text-lg">{profileStats.successRate}%</p>
                  <p className="text-slate-400 text-[10px]">موفقیت</p>
                </div>
                <div className="rounded-2xl p-3 text-center" style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)" }}>
                  <div className="flex justify-center mb-1"><Star size={16} className="text-yellow-400" /></div>
                  <p className="text-white font-black text-lg">{profileStats.matchScore}%</p>
                  <p className="text-slate-400 text-[10px]">تطابق</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            <Link
              href="/dashboard/profile"
              className="block w-full text-center py-3 rounded-2xl font-black text-sm text-white"
              style={{ background: "linear-gradient(135deg,#FF6B00,#FF9A3C)" }}
              onClick={() => setShowProfileModal(false)}
            >
              ویرایش پروفایل و بیوگرافی
            </Link>
          </div>
        </div>
      )}

      {/* خوش‌آمدگویی */}
      <div
        className="rounded-3xl p-6 relative overflow-hidden cursor-pointer"
        style={{
          background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.05) 100%)",
          border: "1px solid rgba(249,115,22,0.2)",
        }}
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-orange-400 text-sm font-bold mb-1">خوش اومدی 👋</p>
              <h1 className="text-white font-black text-2xl mb-2">{userName}</h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                آماده‌ی یه همنشینی جدیدی؟ رویدادهای هفته رو ببین.
              </p>
              {state.city && (
                <div className="flex items-center gap-1.5 mt-3">
                  <MapPin size={13} className="text-orange-400" />
                  <span className="text-orange-300 text-xs font-bold">{state.city}</span>
                </div>
              )}
            </div>
            {/* دکمه پروفایل */}
            <button
              onClick={loadProfileStats}
              className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black text-orange-400 transition-all hover:scale-105"
              style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}
              title="مشاهده پروفایل"
            >
              {userName[0]}
            </button>
          </div>

          {/* دکمه ویرایش داشبورد */}
          <Link
            href="/dashboard/profile"
            className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-orange-300 hover:text-orange-200 transition-colors"
          >
            <Edit3 size={13} />
            ویرایش پروفایل و بیوگرافی
          </Link>
        </div>
        <div
          className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: "rgba(249,115,22,0.08)" }}
        />
      </div>


      {latestTest && (
        <div className="rounded-3xl p-5" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.22)" }}>
          <p className="text-emerald-300 text-xs font-black mb-1">نتیجه تست و مبنای اولیه مچینگ</p>
          <h2 className="text-white font-black text-lg">{latestTest.main_result}</h2>
          <p className="text-slate-400 text-xs mt-2 leading-6">این نتیجه فعلاً برای مچینگ اولیه، پیشنهاد رویداد و تشکیل گروه‌های هم‌فرکانس استفاده می‌شود.</p>
        </div>
      )}

      {/* دسترسی سریع */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/events"
          className="rounded-2xl p-5 flex items-center gap-4 group transition-all hover:scale-[1.02]"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.25)" }}>
            <Calendar size={22} className="text-orange-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-base">رویدادها</p>
            <p className="text-slate-500 text-xs mt-0.5">رزرو همنشینی</p>
          </div>
          <ArrowLeft size={16} className="text-slate-600 group-hover:text-orange-400 transition-colors" />
        </Link>

        <Link
          href="/dashboard/explore"
          className="rounded-2xl p-5 flex items-center gap-4 group transition-all hover:scale-[1.02]"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
            <Users size={22} className="text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-base">کشف همنشینی</p>
            <p className="text-slate-500 text-xs mt-0.5">پیدا کردن افراد هم‌ذوق</p>
          </div>
          <ArrowLeft size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
        </Link>

        <button
          onClick={loadProfileStats}
          className="rounded-2xl p-5 flex items-center gap-4 group transition-all hover:scale-[1.02] w-full text-right"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.25)" }}>
            <Sparkles size={22} className="text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-base">پروفایل من</p>
            <p className="text-slate-500 text-xs mt-0.5">اطلاعات و آمار کاربری</p>
          </div>
          <ArrowLeft size={16} className="text-slate-600 group-hover:text-green-400 transition-colors" />
        </button>

        <Link
          href="/dashboard/wallet"
          className="rounded-2xl p-5 flex items-center gap-4 group transition-all hover:scale-[1.02]"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.25)" }}>
            <span className="text-yellow-400 text-xl">💰</span>
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-base">کیف پول</p>
            <p className="text-slate-500 text-xs mt-0.5">موجودی و تراکنش‌ها</p>
          </div>
          <ArrowLeft size={16} className="text-slate-600 group-hover:text-yellow-400 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
