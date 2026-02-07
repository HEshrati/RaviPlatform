"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  MessageSquare,
  User,
  Zap,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const menuItems = [
    { name: "داشبورد", icon: LayoutDashboard, path: "/dashboard" },
    { name: "کاوش رویدادها", icon: Compass, path: "/events" },
    { name: "چت‌ها", icon: MessageSquare, path: "/chat" },
    { name: "پروفایل کاربری", icon: User, path: "/dashboard/profile" },
  ];

  return (
    <aside className="w-72 bg-[#111827] text-white hidden md:flex flex-col h-full shrink-0 border-l border-slate-800 overflow-y-auto font-sans">
      {/* هدر سایدبار با لینک به صفحه اصلی */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-3 group">
          {/* لوگو با انیمیشن هاور */}
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-300">
            <Zap size={22} className="text-white" fill="currentColor" />
          </div>
          {/* اسم راوی با لینک */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 tracking-tighter group-hover:from-orange-300 group-hover:to-amber-300 transition-all">
              RAAVI
            </h2>
            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
              صفحه اصلی
            </span>
          </div>
        </Link>
      </div>

      {/* منوی اصلی */}
      <nav className="flex-1 p-4 space-y-2">
        {/* گزینه بازگشت به صفحه اصلی - بدون آیکون */}
        {!isHomePage && (
          <Link
            href="/"
            className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-center"
          >
            <span className="text-sm">بازگشت به صفحه اصلی</span>
          </Link>
        )}

        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-orange-500 shadow-lg shadow-orange-900/40 text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-medium"
              }`}
            >
              <item.icon
                size={22}
                className={`transition-colors ${isActive ? "text-white" : "group-hover:text-orange-400"}`}
              />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}

        {/* بخش پیشنهادی */}
        <div className="mt-8 px-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <Zap size={24} className="text-amber-400 mb-3" />
            <p className="text-sm font-bold text-white mb-1">پیشنهاد ویژه</p>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              کارگاه ویژه تیم‌سازی اصفهان با ۵۰٪ تخفیف
            </p>
            <button className="w-full py-2 bg-white text-slate-900 text-xs font-black rounded-lg hover:bg-orange-50 hover:text-orange-600 transition shadow-md">
              مشاهده پیشنهاد
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
