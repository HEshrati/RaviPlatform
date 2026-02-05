"use client"; // این خط الزامی است چون از useState استفاده می‌کنیم

import { useState } from "react";
import Sidebar from "@/components/Sidebar"; // فرض بر این است سایدبار شما اینجاست
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* 1. سایدبار دسکتاپ (همیشه هست ولی در موبایل مخفی) */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      {/* 2. سایدبار موبایل (Overlay) */}
      {/* پس زمینه تیره */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* خود سایدبار کشویی */}
      <div
        className={`fixed inset-y-0 right-0 w-72 bg-[#111827] z-50 transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 left-4 text-white hover:text-orange-500"
        >
          <X size={24} />
        </button>
        {/* استفاده از همان کامپوننت سایدبار */}
        <div className="h-full pt-10">
          {" "}
          {/* پدینگ بالا برای دکمه بستن */}
          <Sidebar />
        </div>
      </div>

      {/* محتوای اصلی */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* هدر موبایل */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-slate-600"
            >
              <Menu size={24} />
            </button>
            <span className="font-black text-slate-800">راوی</span>
          </div>
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
            S
          </div>
        </header>

        {/* محتوای اسکرول‌خور */}
        <div className="flex-1 overflow-auto p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
