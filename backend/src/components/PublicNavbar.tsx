"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

export default function PublicNavbar() {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* لوگو */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="font-bold text-xl text-white">
                MyPlatform
              </span>
            </Link>
          </div>

          {/* منو (دسکتاپ) */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link
              href="#"
              className="text-slate-200 hover:text-orange-400 font-medium"
            >
              خانه
            </Link>
            <Link
              href="/courses"
              className="text-slate-200 hover:text-orange-400 font-medium"
            >
              دوره‌ها
            </Link>
            <Link
              href="/event"
              className="text-slate-200 hover:text-orange-400 font-medium"
            >
              رویدادها
            </Link>
          </div>

          {/* دکمه ورود */}
          <div className="flex items-center gap-4">
            {/* دکمه ورود به صفحه لاگین */}
            <Link
              href="/login"
              className="hidden md:inline-flex items-center px-6 py-2 border border-orange-400/30 text-sm font-bold rounded-xl text-orange-300 bg-slate-800 hover:bg-slate-700 transition"
            >
              ورود به حساب کاربری
            </Link>
            <button className="md:hidden text-slate-200">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
