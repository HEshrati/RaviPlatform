"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, User, Wallet, UserPlus, House } from "lucide-react";

export default function SidebarContent() {
  const pathname = usePathname();
  const menuItems = [
    { name: "صفحه اصلی", icon: House, path: "/" },
    { name: "رزرو همنشینی", icon: CalendarDays, path: "/events" },
    { name: "داشبورد", icon: LayoutDashboard, path: "/dashboard" },
    { name: "کیف پول", icon: Wallet, path: "/dashboard/wallet" },
    { name: "دعوت دوستان", icon: UserPlus, path: "/dashboard/invite" },
    { name: "پروفایل", icon: User, path: "/dashboard/profile" },
  ];

  return (
    <>
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="text-2xl font-black text-orange-400">RAAVI</Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isActive ? "bg-orange-500 text-white" : "text-slate-300 hover:bg-slate-800"}`}>
              <item.icon size={19} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
