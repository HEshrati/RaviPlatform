"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "../Reveal";

const faqItems = [
  {
    question: "چطور الگوریتم هوش مصنوعی راوی تطابق ایجاد می‌کند؟",
    answer:
      "ما ابتدا تیپ شخصیتی، علایق و سبک زندگی شما را با یک تست علمی شناسایی می‌کنیم. سپس الگوریتم با تحلیل داده‌های مشابهات افراد دیگر، بهترین هم‌نشین‌ها را پیشنهاد می‌دهد.",
  },
  {
    question: "آیا رویدادهای راوی آنلاین هم برگزار می‌شوند؟",
    answer:
      "بله، علاوه بر رویدادهای حضوری، جلسات آنلاین گروهی نیز داریم تا بتوانید در هر شرایطی با افراد جدید آشنا شوید.",
  },
  {
    question: "چطور از امنیت و حریم خصوصی کاربران محافظت می‌کنید؟",
    answer:
      "همه داده‌ها با استانداردهای امنیتی بالا نگهداری می‌شوند و هیچ اطلاعاتی بدون اجازه شما به اشتراک گذاشته نمی‌شود. ما روی ایجاد فضایی امن و حرفه‌ای تمرکز داریم.",
  },
  {
    question: "اگر از پیشنهادها راضی نبودم چه می‌شود؟",
    answer:
      "تیم پشتیبانی راوی در کنار شماست تا با بازنگری در پروفایل و دادن بازخورد به الگوریتم، نتایج بهتری ارائه شود.",
  },
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleFaqToggle = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <Reveal
      as="section"
      direction="right"
      className="py-16 md:py-24 px-4 md:px-6 bg-transparent"
    >
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-orange-500 font-bold text-xs md:text-sm tracking-widest uppercase">
            سوالات متداول
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mt-2 mb-4">
            پاسخ به رایج‌ترین پرسش‌ها
          </h2>
        </div>

        <div className="space-y-3 md:space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={item.question}
                className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => handleFaqToggle(index)}
                  className="w-full flex items-center justify-between text-right px-4 md:px-6 py-4 md:py-5 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-slate-800 font-bold text-sm md:text-base lg:text-lg pr-2">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`transition-transform duration-300 text-slate-400 w-5 h-5 md:w-6 md:h-6 shrink-0 ${isOpen ? "rotate-180 text-orange-500" : ""}`}
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0 text-xs md:text-sm lg:text-base text-slate-600 leading-6 md:leading-7 lg:leading-8">
                      <div className="border-t border-slate-100 pt-4 mt-2">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
