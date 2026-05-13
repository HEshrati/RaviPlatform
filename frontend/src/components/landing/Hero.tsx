"use client";

import Link from "next/link";
import { ArrowLeft, Brain, HeartHandshake, Sparkles } from "lucide-react";
import Reveal from "../Reveal";

interface HeroProps {
  ctaHref: string;
}

const cards = [
  {
    title: "تست شخصیت",
    desc: "شناخت عمیق‌تر از خودت",
    icon: Brain,
  },
  {
    title: "گفتگوهای واقعی",
    desc: "بدون مکالمات سطحی",
    icon: HeartHandshake,
  },
  {
    title: "تطابق هوشمند",
    desc: "بر اساس علایق و شخصیت",
    icon: Sparkles,
  },
];

export default function Hero({ ctaHref }: HeroProps) {
  return (
    <Reveal
      as="section"
      direction="right"
      className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-orange-50 via-white to-white" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-2 shadow-sm mb-6">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-slate-700">
              ارتباط‌هایی عمیق‌تر و واقعی‌تر
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl leading-[1.5] font-black text-slate-900 mb-6">
            با <span className="text-orange-500">راوی</span> هم صحبت خودت رو پیدا کن
          </h1>

          <p className="max-w-2xl mx-auto text-slate-600 text-lg md:text-xl leading-9 mb-10">
            تطابق های معنا دار و گفتگو های واقعی براساس شناخت عمیق از شما
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link href="/dashboard/personality-test">
              <button className="bg-orange-500 hover:bg-orange-600 transition-all text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-200 flex items-center gap-2">
                شروع تست
                <ArrowLeft size={20} />
              </button>
            </Link>

            <Link href="/events">
              <button className="border-2 border-slate-300 hover:border-orange-400 hover:text-orange-500 transition-all px-8 py-4 rounded-2xl font-bold text-slate-700 bg-white">
                مشاهده رویدادها
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-[#0B1F3A] rounded-[28px] p-7 border border-slate-800 shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-500/15 flex items-center justify-center mb-5">
                <card.icon className="text-orange-400" size={28} />
              </div>

              <h3 className="text-white font-black text-xl mb-3">
                {card.title}
              </h3>

              <p className="text-orange-100 leading-8 text-sm">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-14">
          <div className="bg-white rounded-[32px] shadow-2xl border border-orange-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="text-right">
                <span className="text-orange-500 font-bold text-sm">
                  نمونه تست شخصیت
                </span>

                <h3 className="text-2xl font-black text-slate-900 mt-3 mb-3">
                  خود واقعیتان را کشف کنید
                </h3>

                <p className="text-slate-600 leading-8">
                  تست روانشناسی اختصاصی راوی برای ایجاد ارتباطات عمیق‌تر
                </p>
              </div>

              <Link href="/dashboard/personality-test">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold whitespace-nowrap transition-all shadow-lg">
                  شروع تست شخصیت
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
