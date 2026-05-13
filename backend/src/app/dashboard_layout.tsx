"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard, User, Wallet, Bell, LogOut,
  ChevronLeft, Compass, Gamepad2, Home, Shield
} from "lucide-react";
import { isAdminPhone } from "@/lib/api";

const NAV_ITEMS = [
  { href: "/dashboard",               label: "داشبورد",     icon: LayoutDashboard },
  { href: "/dashboard/profile",       label: "پروفایل",     icon: User },
  { href: "/dashboard/explore",       label: "کشف همنشینی", icon: Compass },
  { href: "/dashboard/game",          label: "بازی‌ها",     icon: Gamepad2 },
  { href: "/dashboard/wallet",        label: "کیف پول",     icon: Wallet },
  { href: "/dashboard/notifications", label: "اعلان‌ها",   icon: Bell },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const userName = state.user?.name || "کاربر راوی";
  const initial = userName.charAt(0);
  const isAdmin = isAdminPhone(state.user?.mobileNumber);

  const currentLabel = NAV_ITEMS.find(
    (n) => pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href))
  )?.label ?? "داشبورد";

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    dispatch?.({ type: "LOGOUT" } as any);
    router.push("/");
  }

  return (
    <div className="flex min-h-screen pb-[68px] lg:pb-0 relative" dir="rtl">

      {/* ══ DESKTOP SIDEBAR ══ */}
      <aside
        className="hidden lg:flex flex-col w-72 sticky top-0 h-screen z-30 border-l"
        style={{
          background: "linear-gradient(180deg, #090E1C 0%, #050911 100%)",
          borderColor: "rgba(255,255,255,0.06)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.4)"
        }}
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg
                         flex-shrink-0 transition-transform group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #FF6B00, #FF9A3C)",
                boxShadow: "0 4px 16px rgba(255,107,0,0.45)"
              }}
            >
              <span className="text-white font-black text-base">ر</span>
            </div>
            <div>
              <p className="font-black text-white text-xl leading-none">راوی</p>
              <p className="text-[11px] text-slate-500 mt-0.5 group-hover:text-orange-400/60 transition-colors">
                بازگشت به خانه
              </p>
            </div>
          </Link>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div
            className="flex items-center gap-3 p-3 rounded-2xl"
            style={{
              background: "rgba(255,107,0,0.08)",
              border: "1px solid rgba(255,107,0,0.18)"
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ background: "linear-gradient(135deg, #FF6B00, #FF9A3C)" }}
            >
              <span className="text-base font-black text-white">{initial}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-black text-white text-sm truncate">{userName}</p>
              <p className="text-[11px] text-slate-500 truncate">{state.user?.mobileNumber}</p>
            </div>
            {isAdmin && (
              <span
                className="text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background: "rgba(255,107,0,0.2)",
                  border: "1px solid rgba(255,107,0,0.35)",
                  color: "#FF9A3C"
                }}
              >
                ادمین
              </span>
            )}
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-4 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold
                           transition-all duration-200 relative overflow-hidden group"
                style={{
                  background: active ? "rgba(255,107,0,0.85)" : "transparent",
                  color: active ? "white" : "rgba(148,163,184,1)",
                  boxShadow: active ? "0 4px 18px rgba(255,107,0,0.3)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "rgba(148,163,184,1)";
                  }
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)" }}
                >
                  <Icon size={15} />
                </div>
                <span>{label}</span>
                {active && <ChevronLeft size={13} className="mr-auto" />}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="h-px my-3" style={{ background: "rgba(255,255,255,0.06)" }} />
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold
                           transition-all"
                style={{ color: "#FF9A3C" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,107,0,0.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Shield size={15} />
                </div>
                پنل ادمین
              </Link>
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-5 pt-3 border-t space-y-0.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold
                       text-slate-500 transition-all"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "white"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = ""; (e.currentTarget as HTMLElement).style.background = ""; }}
          >
            <Home size={16} /> صفحه اصلی
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold
                       text-slate-500 transition-all"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f87171"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = ""; (e.currentTarget as HTMLElement).style.background = ""; }}
          >
            <LogOut size={16} /> خروج
          </button>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ══ */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header
          className="sticky top-0 z-40 border-b px-4 lg:px-6 py-3.5 flex items-center justify-between"
          style={{
            background: "rgba(7, 11, 22, 0.94)",
            backdropFilter: "blur(18px)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile logo */}
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg,#FF6B00,#FF9A3C)", boxShadow: "0 4px 12px rgba(255,107,0,0.4)" }}
              >
                <span className="text-white font-black text-sm">ر</span>
              </div>
              <span className="font-black text-white text-sm">راوی</span>
            </Link>

            {/* Desktop breadcrumb */}
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <Link href="/" className="text-slate-500 hover:text-orange-400 transition-colors flex items-center gap-1">
                <Home size={13} /> خانه
              </Link>
              <ChevronLeft size={13} className="text-slate-700" />
              <span className="text-slate-500">داشبورد</span>
              {currentLabel !== "داشبورد" && (
                <>
                  <ChevronLeft size={13} className="text-slate-700" />
                  <span className="text-orange-400 font-bold">{currentLabel}</span>
                </>
              )}
            </div>

            {/* Mobile page title */}
            <span className="lg:hidden text-white font-black text-sm">{currentLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/notifications"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400
                         hover:text-orange-400 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              <Bell size={16} />
            </Link>
            <Link href="/dashboard/profile">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg
                           cursor-pointer hover:scale-105 transition-transform"
                style={{
                  background: "linear-gradient(135deg,#FF6B00,#FF9A3C)",
                  boxShadow: "0 4px 12px rgba(255,107,0,0.3)"
                }}
              >
                <span className="text-sm font-black text-white">{initial}</span>
              </div>
            </Link>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-6 relative z-10">{children}</div>
      </main>

      {/* ══ MOBILE BOTTOM NAV ══ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
        style={{
          background: "rgba(5, 9, 18, 0.97)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-center h-[68px] px-1">
          {NAV_ITEMS.slice(0, 5).map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full
                           transition-all"
                style={{ color: active ? "#FF9A3C" : "rgba(100,116,139,1)" }}
              >
                <div
                  className="p-1.5 rounded-xl transition-all"
                  style={{ background: active ? "rgba(255,107,0,0.2)" : "transparent" }}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className="text-[9px] font-black leading-none">
                  {label.length > 5 ? label.slice(0, 5) + "…" : label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
