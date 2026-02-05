"use client";

import Link from "next/link";
import { CheckCircle2, MessageCircle, Send, ArrowLeft } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-3xl w-full bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 md:p-16 text-center relative overflow-hidden">
        {/* Confetti Background Effect (CSS only) */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500"></div>

        <div className="w-28 h-28 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-[bounce_1s_infinite]">
          <CheckCircle2 size={56} />
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
          پرداخت موفقیت‌آمیز بود!
        </h1>
        <p className="text-slate-500 mb-12 text-lg max-w-lg mx-auto leading-relaxed">
          رزرو شما برای رویداد قطعی شد. هم‌اکنون می‌توانید با سایر شرکت‌کنندگان
          که هوش مصنوعی برای شما انتخاب کرده، آشنا شوید.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* گزینه تلگرام */}
          <a
            href="#"
            onClick={(e) => e.preventDefault()} // در نسخه واقعی لینک تلگرام بگذارید
            className="group relative bg-[#2AABEE]/5 border-2 border-[#2AABEE]/20 hover:bg-[#2AABEE] rounded-3xl p-8 transition-all duration-300 cursor-pointer flex flex-col items-center hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-200"
          >
            <div className="w-20 h-20 bg-white text-[#2AABEE] rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <Send size={40} className="-ml-1 mt-1 rotate-[-45deg]" />
            </div>
            <h3 className="font-bold text-2xl text-slate-800 group-hover:text-white mb-2">
              تلگرام
            </h3>
            <p className="text-sm text-slate-500 group-hover:text-blue-50 mb-6">
              عضویت در گروه تلگرامی رویداد
            </p>
            <span className="bg-white text-[#2AABEE] px-6 py-2 rounded-full font-bold text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
              عضویت
            </span>
          </a>

          {/* گزینه چت داخلی */}
          <Link
            href="/chat"
            className="group relative bg-orange-50 border-2 border-orange-100 hover:bg-orange-500 rounded-3xl p-8 transition-all duration-300 cursor-pointer flex flex-col items-center hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-200"
          >
            {/* Badge پیشنهاد ما */}
            <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
              پیشنهاد ما
            </div>

            <div className="w-20 h-20 bg-white text-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <MessageCircle size={40} />
            </div>
            <h3 className="font-bold text-2xl text-slate-800 group-hover:text-white mb-2">
              چت راوی
            </h3>
            <p className="text-sm text-slate-500 group-hover:text-orange-50 mb-6">
              گفتگوی امن در اپلیکیشن
            </p>
            <span className="bg-white text-orange-600 px-6 py-2 rounded-full font-bold text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
              ورود به چت <ArrowLeft size={16} className="inline mr-1" />
            </span>
          </Link>
        </div>

        <div className="mt-10">
          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-slate-600 text-sm font-bold border-b border-transparent hover:border-slate-400 transition"
          >
            بازگشت به داشبورد
          </Link>
        </div>
      </div>
    </div>
  );
}
