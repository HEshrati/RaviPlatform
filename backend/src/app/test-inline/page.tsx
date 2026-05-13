"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  Menu,
  LayoutDashboard,
  Compass,
  MessageSquare,
  User,
  Zap,
} from "lucide-react";

export default function TestPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-orange-500 text-white rounded-lg flex items-center gap-2"
        >
          <Menu size={20} />
          باز کردن منو
        </button>
        <h1 className="text-xl font-bold">تست Sidebar</h1>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 border">
          <h2 className="text-2xl font-bold mb-4">راهنما:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>روی دکمه "باز کردن منو" کلیک کنید</li>
            <li>منو باید از سمت راست باز شود</li>
            <li>باید یک باکس نارنجی با متن "TEST SIDEBAR" ببینید</li>
            <li>باید 4 گزینه منو ببینید</li>
            <li>باید یک باکس سبز با علامت ✅ ببینید</li>
          </ol>

          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>نکته:</strong> اگر فقط پس‌زمینه تیره و دکمه X را می‌بینید
              و هیچ محتوای دیگری نیست، یعنی Sidebar component render نمی‌شود.
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[998]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - INLINE CODE */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-72 z-[999] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 left-4 z-[1000] bg-slate-700 hover:bg-slate-600 text-white rounded-full p-2"
        >
          <X size={20} />
        </button>

        {/* Sidebar Content - ALL INLINE */}
        <div className="w-full h-full bg-slate-900 text-white flex flex-col">
          {/* TEST Header - Orange Box */}
          <div className="w-full h-20 bg-orange-500 flex items-center justify-center shrink-0">
            <h1 className="text-2xl font-bold">TEST SIDEBAR</h1>
          </div>

          {/* Logo Header */}
          <div className="p-6 bg-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Zap size={22} className="text-white" fill="white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">راوی</h2>
                <span className="text-xs text-slate-400">RAAVI Platform</span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-orange-500 text-white"
              >
                <LayoutDashboard size={20} />
                <span className="text-sm font-bold">داشبورد</span>
              </Link>

              <Link
                href="/events"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <Compass size={20} />
                <span className="text-sm">کاوش رویدادها</span>
              </Link>

              <Link
                href="/chat"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <MessageSquare size={20} />
                <span className="text-sm">چت‌ها</span>
              </Link>

              <Link
                href="/dashboard/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <User size={20} />
                <span className="text-sm">پروفایل کاربری</span>
              </Link>
            </div>

            {/* Success Box */}
            <div className="mt-8 p-4 bg-green-500 rounded-lg">
              <p className="text-white text-sm font-bold">
                ✅ اگر این باکس سبز رو می‌بینید، همه چیز کار می‌کند!
              </p>
            </div>

            {/* Offer Box */}
            <div className="mt-4 p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={20} className="text-yellow-400" />
                <span className="text-sm font-bold">پیشنهاد ویژه</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                کارگاه تیم‌سازی با ۵۰٪ تخفیف
              </p>
              <button className="w-full py-2 bg-white text-slate-900 text-xs font-bold rounded-lg hover:bg-orange-50">
                مشاهده پیشنهاد
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
