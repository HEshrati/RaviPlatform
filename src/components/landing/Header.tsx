"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state } = useAppContext();
  const { isLoggedIn } = state;
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-lg z-40 border-b border-white/50 h-16 md:h-20 flex items-center shadow-sm">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* لوگو و اسم راوی با لینک به صفحه اصلی */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-orange-200 group-hover:shadow-orange-300 group-hover:scale-105 transition-all duration-300">
            <Zap size={20} className="md:w-6 md:h-6" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight group-hover:text-orange-600 transition-colors">
              راوی
            </span>
            <span className="text-[10px] md:text-xs text-slate-400 hidden md:block">
              صفحه اصلی
            </span>
          </div>
        </Link>

        {/* دکمه بازگشت به صفحه اصلی در دسکتاپ - فقط اگر در صفحه اصلی نباشیم */}
        {!isHomePage && (
          <div className="hidden md:flex items-center gap-2 mr-4">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors text-sm font-medium border border-slate-200 hover:border-orange-200"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        )}

        <nav className="hidden md:flex items-center gap-8 text-slate-500 font-medium">
          <Link
            href="/"
            className={
              isHomePage
                ? "text-orange-600 font-bold"
                : "hover:text-slate-900 transition"
            }
          >
            خانه
          </Link>
          <Link href="/about" className="hover:text-slate-900 transition">
            درباره ما
          </Link>
          <Link href="/events" className="hover:text-slate-900 transition">
            رویدادها
          </Link>
          {isLoggedIn && (
            <>
              {/* <Link
                href="/dashboard"
                className="hover:text-slate-900 transition"
              >
                داشبورد
              </Link> */}
              <Link href="/chat" className="hover:text-slate-900 transition">
                چت‌ها
              </Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/profile"
                className="text-slate-600 font-bold hover:text-slate-900"
              >
                پروفایل
              </Link>
              <Link href="/dashboard">
                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                  داشبورد
                </button>
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-600 font-bold hover:text-slate-900"
              >
                ورود
              </Link>
              <Link href="/test">
                <button className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200">
                  ثبت نام رایگان
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl md:hidden animate-in slide-in-from-top-5 z-50">
          {/* دکمه بازگشت به صفحه اصلی در منوی موبایل - فقط اگر در صفحه اصلی نباشیم */}
          {!isHomePage && (
            <Link
              href="/"
              className="text-orange-600 font-bold text-base flex items-center gap-2 py-2 border-b border-slate-100 pb-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              بازگشت به صفحه اصلی
            </Link>
          )}

          <Link
            href="/about"
            className="font-medium text-slate-700 text-base flex items-center gap-2 py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            درباره ما
          </Link>
          <Link
            href="/events"
            className="font-medium text-slate-700 text-base flex items-center gap-2 py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            رویدادها
          </Link>

          {isLoggedIn ? (
            <>
              <div className="border-t border-slate-200 pt-4 mt-2">
                <p className="text-xs text-slate-400 mb-2">حساب کاربری</p>
                <Link
                  href="/dashboard"
                  className="font-medium text-slate-700 text-base flex items-center gap-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  داشبورد
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="font-medium text-slate-700 text-base flex items-center gap-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  پروفایل
                </Link>
                <Link
                  href="/chat"
                  className="font-medium text-slate-700 text-base flex items-center gap-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  چت‌ها
                </Link>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-medium text-slate-700 text-base py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                ورود
              </Link>
              <Link
                href="/test"
                className="bg-orange-500 text-white text-center py-3 rounded-xl font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                شروع کنید
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
