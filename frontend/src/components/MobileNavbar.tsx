// src/components/MobileNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  LayoutDashboard,
  MessageCircle,
  User,
} from "lucide-react";

export default function MobileNavbar() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "خانه", href: "/" },
    { icon: Calendar, label: "رزرو", href: "/events" },
    { icon: MessageCircle, label: "پیام‌ها", href: "/dashboard/explore" },
    { icon: LayoutDashboard, label: "داشبورد", href: "/dashboard" },
    { icon: User, label: "پروفایل", href: "/dashboard/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* ظرف اصلی — سورمه‌ای تیره */}
      <div
        className="flex justify-around items-center px-2 py-2"
        style={{
          background: "#0B1F3A",
          borderTop: "1px solid rgba(255,122,0,0.15)",
        }}
      >
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 py-1 px-3 transition-all duration-200"
            >
              {/* دایره پس‌زمینه آیکون فعال */}
              {isActive && (
                <span
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
                  style={{ background: "rgba(255,122,0,0.15)" }}
                />
              )}

              <item.icon
                size={isActive ? 22 : 20}
                strokeWidth={isActive ? 2.5 : 1.8}
                className="relative z-10 transition-all"
                style={{ color: isActive ? "#FF7A00" : "#94a3b8" }}
              />

              <span
                className="text-[9px] font-bold transition-all"
                style={{ color: isActive ? "#FF7A00" : "#64748b" }}
              >
                {item.label}
              </span>

              {/* نقطه نشانگر زیر آیتم فعال */}
              {isActive && (
                <span
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{
                    background: "#FF7A00",
                    boxShadow: "0 0 6px rgba(255,122,0,0.8)",
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
