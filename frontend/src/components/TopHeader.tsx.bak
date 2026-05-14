"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, LayoutDashboard, User, Compass, Wallet, Bell, Calendar, Shield, Brain, Users, Coffee, BarChart2, ChevronLeft, Gamepad2, Home } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { isAdminPhone } from "@/lib/api";

// گزینه‌های نوبار داشبورد کاربری
const USER_DASH_NAV = [
  { href: "/dashboard", label: "خانه", icon: LayoutDashboard, exact: true },
  { href: "/events", label: "رزرو", icon: Calendar },
  { href: "/dashboard/explore", label: "کشف", icon: Compass },
  { href: "/dashboard/profile", label: "پروفایل", icon: User },
  { href: "/dashboard/wallet", label: "کیف پول", icon: Wallet },
  { href: "/dashboard/notifications", label: "اعلان", icon: Bell },
  { href: "/dashboard/game", label: "بازی", icon: Gamepad2 },
];

// گزینه‌های نوبار داشبورد ادمین
const ADMIN_DASH_NAV = [
  { href: "/admin/dashboard", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/admin/events", label: "همنشینی‌ها", icon: Calendar },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/crm", label: "CRM", icon: Brain },
  { href: "/admin/cafe-telegram", label: "کافه‌ها", icon: Coffee },
  { href: "/admin/bookings", label: "رزروها", icon: BarChart2 },
  { href: "/admin/ai-chat", label: "AI ادمین", icon: Shield },
];

export default function TopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useApp();

  // در صفحات لاگین نمایش نده
  const hiddenPaths = ["/login", "/verify-mobile", "/(auth)"];
  if (hiddenPaths.some((p) => pathname?.startsWith(p))) return null;

  const city =
    state.city ||
    (state.user as any)?.city ||
    (state.user as any)?.profile?.city;

  const isAdmin = isAdminPhone(state.user?.mobileNumber);

  // تشخیص اینکه کاربر داخل داشبورد است یا نه
  const inUserDashboard = pathname?.startsWith("/dashboard");
  const inAdminDashboard = pathname?.startsWith("/admin");
  const inDashboard = inUserDashboard || inAdminDashboard;

  const navItems = inAdminDashboard && isAdmin ? ADMIN_DASH_NAV : USER_DASH_NAV;

  // ─── نوبار داشبورد ───────────────────────────────────────────
  if (inDashboard) {
    return (
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center h-14"
        style={{
          background: "rgba(9,14,28,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
        dir="rtl"
      >
        {/* لوگو کوچک */}
        <Link
          href={inAdminDashboard ? "/admin/dashboard" : "/dashboard"}
          className="flex items-center gap-2 pr-4 pl-2 flex-shrink-0 border-l border-white/8"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#FF6B00,#FF9A3C)" }}
          >
            <img
              src="/logo.JPG"
              alt="راوی"
              className="w-full h-full rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <span
            className="text-sm font-black hidden sm:block"
            style={{ color: inAdminDashboard ? "#818cf8" : "#FF9A3C" }}
          >
            {inAdminDashboard ? "پنل مدیریت" : "راوی"}
          </span>
        </Link>

        {/* گزینه‌های داشبورد — اسکرول‌پذیر */}
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-center h-14 gap-0.5 px-2">
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const active = exact
                ? pathname === href
                : pathname === href || (href !== "/dashboard" && href !== "/admin/dashboard" && pathname?.startsWith(href));

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 transition-all duration-200 relative ${
                    active
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                  style={
                    active
                      ? {
                          background: inAdminDashboard
                            ? "rgba(99,102,241,0.18)"
                            : "rgba(255,107,0,0.18)",
                          color: inAdminDashboard ? "#a5b4fc" : "#FF9A3C",
                          border: `1px solid ${inAdminDashboard ? "rgba(99,102,241,0.3)" : "rgba(255,107,0,0.3)"}`,
                        }
                      : { border: "1px solid transparent" }
                  }
                >
                  <Icon size={13} />
                  <span>{label}</span>
                  {active && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ background: inAdminDashboard ? "#818cf8" : "#FF6B00" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* سمت چپ: بج ادمین یا شهر */}
        <div className="flex items-center gap-2 pl-4 pr-2 flex-shrink-0 border-r border-white/8">
          {inAdminDashboard ? (
            <Link
              href="/dashboard?user=1"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-orange-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
            >
              <Home size={13} />
              <span className="hidden sm:block">کاربری</span>
            </Link>
          ) : (
            <>
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-1.5 text-xs font-bold px-2 py-1.5 rounded-lg transition-all"
                  style={{
                    background: "rgba(99,102,241,0.12)",
                    color: "#818cf8",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                >
                  <Shield size={12} />
                  <span className="hidden sm:block">ادمین</span>
                </Link>
              )}
              {city && (
                <button
                  onClick={() => router.push("/dashboard/profile")}
                  className="flex items-center gap-1 text-xs font-bold px-2 py-1.5 rounded-lg transition-all"
                  style={{
                    background: "rgba(255,107,0,0.1)",
                    color: "#FF9A3C",
                    border: "1px solid rgba(255,107,0,0.2)",
                  }}
                >
                  <MapPin size={11} />
                  <span>{city}</span>
                </button>
              )}
            </>
          )}
        </div>
      </header>
    );
  }

  // ─── نوبار معمولی (بیرون از داشبورد) ────────────────────────
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-16"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1.5px solid rgba(255,107,0,0.1)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
      }}
    >
      {/* لوگو */}
      <Link href="/" className="flex items-center gap-3 select-none">
        <div
          className="flex items-center justify-center rounded-full text-white font-black text-xl"
          style={{
            width: 58,
            height: 58,
            background: "linear-gradient(135deg, #FF6B00 0%, #FF9A3C 100%)",
            boxShadow: "0 4px 20px rgba(255,107,0,0.45)",
          }}
        >
          <img
            src="/logo.JPG"
            alt="راوی"
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).parentElement!.innerHTML = "ر";
            }}
          />
        </div>
        <span className="text-3xl font-black tracking-wide" style={{ color: "#1a3a5c" }}>
          راوی
        </span>
      </Link>

      {/* دکمه شهر */}
      <button
        onClick={() => router.push("/dashboard/profile")}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-all active:scale-95"
        style={{
          background: city ? "rgba(255,107,0,0.1)" : "rgba(26,58,92,0.07)",
          color: city ? "#FF6B00" : "#6b7280",
          border: `1.5px solid ${city ? "rgba(255,107,0,0.2)" : "rgba(26,58,92,0.1)"}`,
        }}
      >
        <MapPin size={14} className={city ? "text-orange-500" : "text-slate-400"} />
        <span>{city || "انتخاب شهر"}</span>
      </button>
    </header>
  );
}
