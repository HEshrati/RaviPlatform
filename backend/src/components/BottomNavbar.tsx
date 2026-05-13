"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Gamepad2, Bell, Calendar } from "lucide-react";

export default function BottomNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard/profile", label: "پروفایل", icon: User },
    { href: "/dashboard/games", label: "بازی", icon: Gamepad2 },
    { href: "/dashboard/notifications", label: "اعلان‌ها", icon: Bell },
    { href: "/events", label: "رزرو", icon: Calendar },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-navy-900 border-t border-navy-800 shadow-2xl">
      <div className="max-w-md mx-auto flex justify-around items-center p-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full py-2 rounded-xl transition-all duration-300 ${
                isActive ? "text-raavi-orange" : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon size={24} className={isActive ? "fill-raavi-orange/20" : ""} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
