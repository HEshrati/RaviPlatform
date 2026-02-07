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

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* سایدبار دسکتاپ */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* پس‌زمینه تیره موبایل */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* سایدبار موبایل */}
      <div
        className={`fixed inset-y-0 right-0 w-72 bg-slate-900 z-50 transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 left-4 text-white hover:text-orange-500 transition"
        >
          <X size={24} />
        </button>
        <div className="pt-16">
          <Sidebar />
        </div>
      </div>

      {/* محتوای اصلی */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* هدر موبایل */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-slate-600 hover:text-slate-900 transition"
            >
              <Menu size={24} />
            </button>
            {/* لینک اسم راوی به صفحه اصلی - فقط اگر در صفحه اصلی نباشیم */}
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
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
            S
          </div>
        </header>

        {/* محتوای اسکرول */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {/* دکمه بازگشت به صفحه اصلی در موبایل - فقط اگر در صفحه اصلی نباشیم */}
          {!isHomePage && (
            <div className="lg:hidden mb-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
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
