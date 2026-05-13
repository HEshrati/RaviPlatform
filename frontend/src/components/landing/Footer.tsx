"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 md:pt-20 pb-28 md:pb-12 px-6 relative overflow-hidden">
      {/* Animated Blobs for Footer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 relative z-10 text-center md:text-right">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-200">
              <Zap size={24} fill="currentColor" />
            </div>
            <span className="text-2xl font-black tracking-tight">راوی</span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            راوی با ترکیب تست‌های روان‌شناسی و الگوریتم‌های هوش مصنوعی،
            امن‌ترین مسیر را برای آشنایی و ایجاد روابط عمیق فراهم می‌کند.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-sm md:text-base">لینک‌های مفید</h4>
          <ul className="space-y-4 text-xs md:text-sm">
            <li>
              <Link href="/about" className="hover:text-orange-500 transition">
                درباره ما
              </Link>
            </li>
            <li>
              <Link href="/dashboard/personality-test" className="hover:text-orange-500 transition">
                تست شخصیت‌شناسی
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-orange-500 transition">
                رویدادها
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-orange-500 transition">
                قوانین و مقررات
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-sm md:text-base">تماس با ما</h4>
          <ul className="space-y-4 text-xs md:text-sm">
            <li>info@raavi.ir 📧</li>
            <li>۰۲۱-۸۸۸۸۸۸۸۸ 📞</li>
            <li>تهران، خیابان ولیعصر 📍</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-sm md:text-base">نماد اعتماد</h4>
          <div className="flex gap-4 justify-center md:justify-start">
            <a referrerPolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=722827&Code=DeagMyvczmoZIzSros0zlOZ3DeMCK3xS">
              <img referrerPolicy="origin" loading="lazy" src="https://trustseal.enamad.ir/logo.aspx?id=722827&Code=DeagMyvczmoZIzSros0zlOZ3DeMCK3xS" alt="نماد اعتماد الکترونیکی" style={{cursor:'pointer', width:'80px', height:'80px'}} code="DeagMyvczmoZIzSros0zlOZ3DeMCK3xS" />
            </a>
            <div className="w-20 h-20 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-xs text-slate-500">
              Samandehi
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-12 md:mt-16 pt-8 border-t border-slate-800 text-center text-xs text-slate-600 relative z-10">
        © ۱۴۰۴ راوی. تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}
