"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* سایدبار دسکتاپ */}
      <div className="hidden lg:block w-72 h-full">
        <Sidebar />
      </div>

      {/* پس‌زمینه تیره موبایل */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[100] lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* سایدبار موبایل */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-72 bg-[#111827] z-[101] lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* دکمه بستن */}
        <button
          onClick={closeMobileMenu}
          className="absolute top-4 left-4 z-[102] text-white hover:text-orange-500 transition-colors bg-slate-800/80 hover:bg-slate-700 rounded-full p-2.5 shadow-lg"
          aria-label="بستن منو"
        >
          <X size={20} />
        </button>
        
        {/* Sidebar Component */}
        <Sidebar isMobile={true} onClose={closeMobileMenu} />
      </div>

      {/* محتوای اصلی */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* هدر موبایل */}
        <header className="lg:hidden h-14 md:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-slate-600 hover:text-slate-900 transition-colors p-2 -ml-2"
              aria-label="باز کردن منو"
            >
              <Menu size={24} />
            </button>
            {/* لینک اسم راوی به صفحه اصلی */}
            {!isHomePage && (
              <Link href="/" className="flex items-center gap-2 group">
                <span className="font-black text-xl text-slate-900 group-hover:text-orange-600 transition-colors">
                  راوی
                </span>
              </Link>
            )}
            {isHomePage && (
              <span className="font-black text-xl text-slate-900">راوی</span>
            )}
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
            S
          </div>
        </header>

        {/* محتوای اسکرول */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {/* دکمه بازگشت به صفحه اصلی در موبایل */}
          {!isHomePage && (
            <div className="lg:hidden mb-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium shadow-sm"
              >
                بازگشت به صفحه اصلی
              </Link>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
