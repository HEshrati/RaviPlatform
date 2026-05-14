"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, LayoutDashboard, User, Wallet, Bell, Gamepad2, Calendar, LogOut, Shield } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { isAdminPhone } from "@/lib/api";

const USER_ITEMS = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/events", label: "رویدادها", icon: Calendar },
  { href: "/dashboard/profile", label: "پروفایل", icon: User },
  { href: "/dashboard/wallet", label: "کیف پول", icon: Wallet },
  { href: "/dashboard/notifications", label: "اعلان‌ها", icon: Bell },
  { href: "/dashboard/game", label: "بازی", icon: Gamepad2 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { state, logout } = useApp();

  const isAdmin = isAdminPhone(state.user?.mobileNumber);

  return (
    <div className="min-h-screen relative" dir="rtl">
      <aside className="hidden md:flex fixed right-0 top-0 h-full w-64 z-40 flex-col border-l border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img src="/logo.JPG" alt="راوی" className="w-11 h-11 rounded-xl object-cover" />
          <div>
            <p className="text-white font-black">داشبورد راوی</p>
            <p className="text-orange-400 text-xs">{state.user?.name || "کاربر"}</p>
          </div>
        </Link>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {USER_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/10 transition">
              <Icon size={18} />
              {label}
            </Link>
          ))}
          {/* فقط برای ادمین: لینک پنل مدیریت */}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all"
              style={{
                color: "#818cf8",
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.15)",
              }}
            >
              <Shield size={18} />
              پنل مدیریت
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => { logout(); router.push('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-300 hover:bg-red-500/10 transition">
            <LogOut size={18} /> خروج
          </button>
        </div>
      </aside>
      <main className="md:mr-64 min-h-screen px-4 md:px-8 pb-28 pt-4">{children}</main>
    </div>
  );
}
