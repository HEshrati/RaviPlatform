"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Bell,
  Calendar,
  Gamepad2,
  BookOpen,
  LogOut,
  LayoutDashboard,
  Shield,
  Home,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { isAdminPhone } from "@/lib/api";

const USER_NAV = [
  { name: "خانه", href: "/", icon: Home },
  { name: "داشبورد", href: "/dashboard", icon: LayoutDashboard },
  { name: "پروفایل", href: "/dashboard/profile", icon: User },
  { name: "بازی", href: "/dashboard/game", icon: Gamepad2 },
  { name: "رزرو", href: "/events", icon: Calendar },
];

const ADMIN_NAV = [
  { name: "خانه", href: "/", icon: Home },
  { name: "پروفایل", href: "/dashboard/profile", icon: User },
  { name: "اعلان‌ها", href: "/dashboard/notifications", icon: Bell },
  { name: "رزرو", href: "/events", icon: Calendar },
  { name: "پنل ادمین", href: "/admin/dashboard", icon: Shield },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, logout } = useApp();

  const hiddenPaths = ["/login", "/test", "/(auth)", "/verify-mobile"];
  if (hiddenPaths.some((p) => pathname.startsWith(p)) || pathname.startsWith("/admin")) return null;

  if (state.isLoading) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-700/60"
        style={{ backgroundColor: "#0f172a", height: 68 }}
      />
    );
  }

  const isAdmin = isAdminPhone(state.user?.mobileNumber);
  const nav = isAdmin ? ADMIN_NAV : USER_NAV;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-700/60 shadow-[0_-4px_24px_rgba(0,0,0,0.25)]"
      style={{ backgroundColor: "#0f172a" }}
    >
      <div className="flex justify-around items-center h-[68px] w-full px-2 max-w-lg mx-auto">
        {nav.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : item.href === "/admin/dashboard"
                ? pathname.startsWith("/admin")
                : pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full relative transition-all duration-300 ${
                isActive
                  ? "text-orange-500"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-10 h-[3px] bg-orange-500 rounded-b-full shadow-[0_2px_10px_rgba(249,115,22,0.7)]" />
              )}
              <item.icon
                size={isActive ? 26 : 22}
                strokeWidth={isActive ? 2.5 : 2}
                className="transition-all"
              />
              <span
                className={`text-[10px] transition-all ${isActive ? "font-black" : "font-medium"}`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
        {state.isLoggedIn && (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center gap-1 w-full h-full text-slate-400 hover:text-red-400 transition-all duration-300 active:scale-95"
          >
            <LogOut size={22} strokeWidth={2} />
            <span className="text-[10px] font-medium">خروج</span>
          </button>
        )}
      </div>
    </div>
  );
}
