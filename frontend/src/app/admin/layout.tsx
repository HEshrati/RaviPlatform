"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard, Users, Calendar, LogOut, Shield, Home,
  AlertTriangle, Coffee, Brain, BarChart2, MessageSquare,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { isAdminPhone } from "@/lib/api";
import AnimatedBackground from "@/components/AnimatedBackground";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/events", label: "همنشینی‌ها", icon: Calendar },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/bookings", label: "رزروها", icon: BarChart2 },
  { href: "/admin/cafe-telegram", label: "ربات کافه‌ها", icon: Coffee },
  { href: "/admin/crm", label: "CRM هوشمند", icon: Brain, highlight: true },
  { href: "/admin/ai-chat", label: "چت ادمین AI", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const userName = state.user?.name || "مدیر راوی";
  const initial = userName.charAt(0);

  // ✅ FIX #4: صفحاتی مثل CRM و AI-Chat باید بدون pb اضافی نمایش داده شوند تا اسکرول کامل کار کند
  const isFullPage = pathname === "/admin/ai-chat" || pathname === "/admin/crm";

  async function handleLogout() {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("city");
      sessionStorage.clear();
      document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
    dispatch?.({ type: "LOGOUT" } as any);
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen relative" dir="rtl" style={{ background: "transparent" }}>
      <AnimatedBackground />

      {/* مودال خروج */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
          <div className="rounded-3xl p-6 max-w-sm w-full border border-white/10 shadow-2xl" style={{ background: "linear-gradient(145deg,#1B2A4A,#0f172a)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <AlertTriangle size={22} className="text-red-400" />
              </div>
              <div>
                <h3 className="font-black text-white text-base">خروج از حساب</h3>
                <p className="text-slate-400 text-xs mt-0.5">آیا مطمئن هستید؟</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-6">با خروج، تمام اطلاعات جلسه پاک می‌شود و باید مجدداً وارد شوید.</p>
            <div className="flex gap-3">
              <button onClick={handleLogout} className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-sm transition-all">بله، خروج</button>
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 rounded-2xl font-black text-sm text-slate-300 transition-all" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>انصراف</button>
            </div>
          </div>
        </div>
      )}

      {/* سایدبار دسکتاپ — ✅ FIX #1: pointer-events: auto و z-index بالا */}
      <aside
        className="hidden lg:flex flex-col w-72 flex-shrink-0 sticky top-0 h-screen z-30"
        style={{
          background: "linear-gradient(180deg, #0f172a 0%, #0a0f1e 100%)",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          pointerEvents: "auto",
        }}
      >
        {/* لوگو */}
        <div
          className="flex items-center justify-center px-5 py-5 border-b border-white/8"
          style={{ background: "linear-gradient(135deg,#1a3a5c 0%,#0f2340 100%)" }}
        >
          <Link href="/" className="flex items-center gap-3 group hover:opacity-85 transition-opacity">
            <img
              src="/logo.webp" loading="lazy"
              alt="راوی"
              className="rounded-xl object-cover shadow-lg flex-shrink-0"
              style={{ width: 46, height: 46 }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="flex flex-col">
              <span className="text-2xl font-black" style={{ color: "#FF9A3C" }}>راوی</span>
              <span className="text-[10px] text-slate-400 font-bold">پنل مدیریت</span>
            </div>
          </Link>
        </div>

        {/* اطلاعات ادمین */}
        <div className="px-4 py-4 border-b border-white/8">
          <div
            className="flex items-center gap-3 p-3 rounded-2xl border"
            style={{ background: "rgba(99,102,241,0.07)", borderColor: "rgba(99,102,241,0.15)" }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
              <span className="text-base font-black text-white">{initial}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-black text-white text-sm truncate">{userName}</p>
              <p className="text-[11px] text-slate-500 truncate">{state.user?.mobileNumber}</p>
            </div>
            <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">
              ادمین
            </span>
          </div>
        </div>

        {/* آیتم‌های ناوبری */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon, highlight }) => {
            const active =
              href === "/admin/dashboard"
                ? pathname === href
                : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 relative overflow-hidden ${
                  active ? "text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                style={
                  active
                    ? {
                        background: "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(99,102,241,0.7))",
                        boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
                      }
                    : {}
                }
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    active ? "bg-white/20" : "bg-white/5"
                  }`}
                >
                  <Icon size={15} />
                </div>
                <span>{label}</span>
                {highlight && !active && (
                  <span className="mr-auto text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full border border-orange-500/30">
                    جدید
                  </span>
                )}
                {active && <ChevronLeft size={14} className="mr-auto" />}
              </Link>
            );
          })}

          {/* جدا کننده */}
          <div className="border-t border-white/8 my-2" />

          {/* دکمه برگشت به داشبورد کاربری */}
          <Link
            href="/dashboard?user=1"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <LayoutDashboard size={15} />
            </div>
            داشبورد کاربری
          </Link>
        </nav>

        {/* فوتر سایدبار */}
        <div className="px-4 pb-5 pt-3 border-t border-white/8 space-y-1">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Home size={16} /> صفحه اصلی
          </Link>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} /> خروج از حساب
          </button>
        </div>
      </aside>

      {/* محتوای اصلی */}
      <main
        className={`flex-1 min-w-0 relative z-10 ${
          isFullPage
            ? "min-h-screen overflow-hidden"
            : "min-h-screen overflow-y-auto pb-[80px] lg:pb-0"
        }`}
        style={{ pointerEvents: "auto" }}
      >
        {children}
      </main>

      {/* نوبار پایین موبایل (در صفحات تمام‌صفحه پنهان است) */}
      {!isFullPage && (
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-[55] flex items-center justify-around px-2 h-[68px] border-t border-slate-700/60"
          style={{ background: "rgba(15,23,42,0.97)", backdropFilter: "blur(16px)", pointerEvents: "auto" }}
        >
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all ${
              pathname === "/" ? "text-orange-400" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Home size={18} />
            <span className="text-[10px] font-bold">خانه</span>
          </Link>
          {NAV_ITEMS.slice(0, 4).map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all ${
                  active ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Icon size={18} />
                <span className="text-[10px] font-bold">
                  {label.length > 6 ? label.slice(0, 6) + "…" : label}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
