"use client";

import Link from "next/link";
import { BrainCircuit, Sparkles, ArrowLeft } from "lucide-react";
import Reveal from "../Reveal";

export default function BrainMatchingSection() {
  return (
    <Reveal
      as="section"
      direction="up"
      className="py-16 md:py-24 px-4 md:px-6"
    >
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-[36px] bg-white border border-orange-100 shadow-[0_20px_80px_rgba(255,115,0,0.08)]">

          {/* گرادینت بکگراند */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-white" />

          {/* Glow */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-orange-300/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-8 md:p-14">

            {/* متن */}
            <div className="text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 mb-6">
                <Sparkles size={16} className="text-orange-500" />
                <span className="text-sm font-bold text-orange-600">
                  تطابق هوشمند راوی
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl leading-[1.5] font-black text-slate-900 mb-6">
                گفتگوهای واقعی
                <br />
                بر پایه شناخت عمیق
              </h2>

              <p className="text-slate-600 text-base md:text-lg leading-9 mb-8 max-w-xl">
                الگوریتم هوش مصنوعی راوی با تحلیل شخصیت، علایق و الگوهای رفتاری،
                افرادی را پیدا می‌کند که بیشترین هماهنگی را با شما دارند.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/dashboard/personality-test">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-200 transition-all hover:-translate-y-1 flex items-center gap-2">
                    شروع تست شخصیت
                    <ArrowLeft size={20} />
                  </button>
                </Link>

                <Link href="/events">
                  <button className="bg-[#0B1F3A] hover:bg-[#10284d] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all">
                    مشاهده رویدادها
                  </button>
                </Link>
              </div>
            </div>

            {/* بخش مغز */}
            <div className="relative flex items-center justify-center">

              {/* glow */}
              <div className="absolute w-[320px] h-[320px] bg-orange-400/20 rounded-full blur-3xl animate-pulse" />

              {/* حلقه */}
              <div className="absolute w-[300px] h-[300px] border border-orange-200 rounded-full" />

              <div className="absolute w-[240px] h-[240px] border border-orange-300/60 rounded-full" />

              {/* کارت اصلی */}
              <div className="relative w-[220px] h-[220px] rounded-[40px] bg-gradient-to-br from-orange-50 via-white to-orange-100 border border-orange-100 shadow-[0_20px_60px_rgba(255,115,0,0.12)] flex items-center justify-center">

                {/* نور داخلی */}
                <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-white via-orange-50/50 to-orange-100/40" />

                {/* آیکون مغز */}
                <div className="relative z-10 w-24 h-24 rounded-3xl bg-white border border-orange-200 shadow-lg flex items-center justify-center">
                  <BrainCircuit
                    size={60}
                    className="text-orange-400"
                    strokeWidth={1.8}
                  />
                </div>

                {/* badge */}
                <div className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-xl border border-orange-100 px-4 py-3">
                  <div className="text-xs text-slate-500 mb-1">
                    تطابق هوشمند
                  </div>
                  <div className="text-lg font-black text-orange-500">
                    %۹۸
                  </div>
                </div>

                {/* badge دوم */}
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl border border-orange-100 px-4 py-3">
                  <div className="text-xs text-slate-500 mb-1">
                    تحلیل شخصیت
                  </div>
                  <div className="text-lg font-black text-[#0B1F3A]">
                    AI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
