"use client";
/**
 * layout.tsx ادمین — نسخه به‌روزشده
 * تغییر: اضافه شدن لینک CRM داشبورد به منو
 * مسیر: src/app/admin/layout.tsx
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  LogOut,
  Shield,
  Plus,
  Home,
  AlertTriangle,
  Coffee,
  Brain,
} from "lucide-react";
import { useState } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/events", label: "مدیریت همنشینی‌ها", icon: Calendar },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/bookings", label: "رزروها", icon: Shield },
  { href: "/admin/cafe-telegram", label: "ربات کافه‌ها", icon: Coffee },
  // ✅ لینک جدید CRM
  { href: "/admin/crm", label: "CRM هوشمند", icon: Brain, highlight: true },
  { href: "/admin/ai-chat", label: "چت ادمین AI", icon: Brain },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const userName = state.user?.name || "مدیر راوی";

  async function handleLogout() {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/logout`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          },
        ).catch(() => {});
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
    router.push("/auth");
  }

  return (
    <div
      className="min-h-screen relative"
      dir="rtl"
      style={{ background: "transparent" }}
    >
      <AnimatedBackground />

      {/* ── سایدبار دسکتاپ ── */}
      <aside
        className="hidden md:flex fixed right-0 top-0 h-full w-64 flex-col z-40"
        style={{
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* لوگو — بک‌گراند سورمه‌ای */}
        <div
          className="flex items-center justify-center px-5 py-5 border-b border-slate-700/50"
          style={{ background: "linear-gradient(135deg,#1a3a5c 0%,#0f2340 100%)" }}
        >
          <Link href="/admin/dashboard" className="flex items-center gap-3 group hover:opacity-85 transition-opacity">
            <img
              src="/logo.JPG"
              alt="راوی"
              className="rounded-xl object-cover shadow-lg flex-shrink-0"
              style={{ width: 46, height: 46 }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div>
              <p className="text-white font-black text-base tracking-wide">پنل مدیریت</p>
              <p className="text-[11px]" style={{ color: "#FF9A3C" }}>راوی</p>
            </div>
          </Link>
        </div>

        {/* کاربر */}
        <div className="px-4 py-4 border-b border-slate-700/30">
          <div
            className="flex items-center gap-3 rounded-2xl px-3 py-3"
            style={{ background: "rgba(249,115,22,0.08)" }}
          >
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-orange-500/20">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">
                {userName}
              </p>
              <p className="text-orange-400 text-xs font-medium">مدیر سیستم</p>
            </div>
          </div>
        </div>

        {/* دکمه ایجاد همنشینی جدید */}
        <div className="px-4 pt-4">
          <Link
            href="/admin/events/new"
            className="flex items-center justify-center gap-2 w-full rounded-2xl py-3 px-4 font-black text-white text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
            }}
          >
            <Plus size={18} strokeWidth={2.5} />
            ایجاد همنشینی جدید
          </Link>
        </div>

        {/* ناوبری */}
        <nav className="flex-1 px-4 pt-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon, highlight }) => {
            const active =
              pathname === href ||
              (href !== "/admin/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  active
                    ? "text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/40"
                }`}
                style={
                  active
                    ? {
                        background: highlight
                          ? "rgba(99,102,241,0.15)"
                          : "rgba(249,115,22,0.15)",
                        color: highlight ? "#818cf8" : "#fb923c",
                      }
                    : {}
                }
              >
                <Icon
                  size={18}
                  style={highlight && !active ? { color: "#818cf8" } : {}}
                />
                <span>{label}</span>
                {/* نقطه نارنجی برای CRM */}
                {highlight && !active && (
                  <span className="mr-auto w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* لینک بازگشت + خروج */}
        <div className="px-4 pb-6 space-y-2 border-t border-slate-700/30 pt-4">
          <Link
            href="/dashboard?user=1"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-700/40 text-sm font-bold transition-all"
          >
            <Home size={18} />
            داشبورد کاربری
          </Link>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm font-bold transition-all w-full text-right"
          >
            <LogOut size={18} />
            خروج از حساب
          </button>
        </div>
      </aside>

      {/* محتوا */}
      <main className="md:mr-64 relative z-10 min-h-screen overflow-y-auto">{children}</main>

      {/* ── نوار پایین موبایل ── */}
      <nav
        className="md:hidden fixed bottom-0 right-0 left-0 z-50 flex items-center justify-around px-2 py-2 border-t border-slate-700/60"
        style={{
          background: "rgba(15,23,42,0.97)",
          backdropFilter: "blur(16px)",
        }}
      >
        {NAV_ITEMS.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/admin/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold transition-all ${
                active ? "text-orange-400" : "text-slate-500"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
        <Link
          href="/admin/events/new"
          className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold text-orange-400"
        >
          <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Plus size={18} className="text-white" />
          </div>
          <span className="text-orange-400 text-[10px]">جدید</span>
        </Link>
      </nav>

      {/* مودال تأیید خروج */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="rounded-3xl p-7 w-full max-w-sm text-center space-y-5 border border-slate-700/60"
            style={{ background: "linear-gradient(145deg, #1e293b, #0f172a)" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-white font-black text-lg mb-1">
                خروج از پنل مدیریت؟
              </h2>
              <p className="text-slate-400 text-sm">آیا مطمئن هستید؟</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 rounded-2xl py-3 bg-red-500 hover:bg-red-400 text-white font-bold text-sm transition-all"
              >
                بله، خروج
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-2xl py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm transition-all"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
