"use client";

import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Reveal from "../Reveal";

const SAMPLE_SUGGESTIONS = [
  {
    title: "مقاله پیشنهادی بر اساس تست شخصیت",
    desc: "مقالاتی متناسب با نوع شخصیت و نیازهای روان‌شناختی شما",
    icon: "🧠",
    color: "#6366f1",
  },
  {
    title: "رویدادهای متناسب با علایق شما",
    desc: "رویدادهایی که بیشترین تطابق را با پروفایل شما دارند",
    icon: "🎯",
    color: "#f97316",
  },
  {
    title: "تست‌های پیشنهادی برای شناخت بیشتر",
    desc: "تست‌هایی که هنوز انجام نداده‌اید و می‌توانند بینش جدیدی بدهند",
    icon: "📋",
    color: "#22c55e",
  },
];

export default function RaviRecommendations() {
  return (
    <Reveal
      direction="up"
      className="py-16 md:py-24 px-4 md:px-6"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Sparkles size={16} />
            پیشنهاد راوی به شما
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-4">
            محتوای اختصاصی شما
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
            بر اساس پروفایل و نتایج تست‌های شما، محتوا و خدمات متناسب پیشنهاد
            می‌شود
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {SAMPLE_SUGGESTIONS.map((item, i) => (
            <Reveal key={i} direction="up" delay={i * 0.1}>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: `${item.color}15` }}
                >
                  {item.icon}
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {item.desc}
                </p>
                <div
                  className="flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all"
                  style={{ color: item.color }}
                >
                  <span>مشاهده</span>
                  <ArrowLeft size={14} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/dashboard/recommendations"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-all hover:shadow-lg hover:shadow-orange-200/50"
          >
            <Sparkles size={18} />
            مشاهده همه پیشنهادات
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
