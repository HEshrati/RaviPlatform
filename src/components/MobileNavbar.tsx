// src/components/MobileNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, LayoutDashboard, User } from "lucide-react";

export default function MobileNavbar() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "خانه", href: "/" },
    { icon: Calendar, label: "رویدادها", href: "/events" },
    { icon: LayoutDashboard, label: "داشبورد", href: "/dashboard" },
    { icon: User, label: "پروفایل", href: "/dashboard/profile" },
  ];

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
      <div className="bg-slate-900/95 backdrop-blur-md text-slate-400 rounded-2xl shadow-2xl shadow-slate-900/50 border border-slate-700/50 flex justify-between items-center px-6 py-4">
        {navItems.map((item) => {
          // بررسی فعال بودن لینک
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} className="relative group">
              <div
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive
                    ? "text-orange-500 -translate-y-1"
                    : "hover:text-slate-200"
                }`}
              >
                <item.icon
                  size={isActive ? 26 : 24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-all"
                />

                {/* نشانگر نقطه زیر آیکون فعال */}
                {isActive && (
                  <span className="absolute -bottom-3 w-1 h-1 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
