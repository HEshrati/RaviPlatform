"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import Reveal from "../Reveal";

const pricingPlans = [
  {
    name: "رایگان",
    price: "۰",
    description: "برای شروع کردن",
    features: [
      "تست شخصیت‌شناسی کامل",
      "دسترسی به ۱ رویداد عمومی در ماه",
      "پروفایل پایه کاربری",
      "پشتیبانی ایمیل",
    ],
    cta: "شروع کنید",
    href: "/test",
    highlighted: false,
  },
  {
    name: "طلایی",
    price: "۱۹۹,۰۰۰",
    description: "برای افراد فعال",
    features: [
      "تمام امکانات رایگان",
      "دسترسی نامحدود به رویدادها",
      "الگوریتم پیشنهاد پیشرفته",
      "تحلیل تطابق دقیق‌تر",
      "پشتیبانی اختصاصی",
    ],
    cta: "خرید طلایی",
    href: "#",
    highlighted: true,
  },
  {
    name: "پلاتینیوم",
    price: "۴۹۹,۰۰۰",
    description: "برای تجربه VIP",
    features: [
      "تمام امکانات طلایی",
      "دعوت به رویدادهای اختصاصی",
      "مشاوره شخصی",
      "اولویت در پیشنهادها",
      "گزارش تحلیلی ماهانه",
    ],
    cta: "خرید پلاتینیوم",
    href: "#",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <Reveal
      as="section"
      direction="right"
      className="py-16 md:py-24 px-4 md:px-6 bg-white/40 backdrop-blur-sm"
    >
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-orange-500 font-bold text-xs md:text-sm tracking-widest uppercase">
            پلن‌های اشتراک
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mt-2 mb-4">
            بهترین قیمت را انتخاب کنید
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
            با هر بودجه‌ای می‌توانید تجربه راوی را داشته باشید. همیشه می‌توانید
            ارتقا پیدا کنید.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Reveal key={plan.name} direction="up" delay={index * 0.1}>
              <div
                className={`relative rounded-2xl md:rounded-3xl p-6 md:p-8 border transition-all hover:shadow-2xl hover:-translate-y-2 ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-400 shadow-xl shadow-orange-200/50 scale-105"
                    : "bg-white border-slate-200 hover:border-orange-200"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    محبوب‌ترین
                  </div>
                )}

                <div className="text-center mb-6 md:mb-8">
                  <h3
                    className={`text-xl md:text-2xl font-black mb-2 ${
                      plan.highlighted ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-xs md:text-sm mb-4 ${
                      plan.highlighted ? "text-orange-100" : "text-slate-500"
                    }`}
                  >
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span
                      className={`text-3xl md:text-4xl lg:text-5xl font-black ${
                        plan.highlighted ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-sm md:text-base ${
                        plan.highlighted ? "text-orange-100" : "text-slate-500"
                      }`}
                    >
                      تومان/ماه
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={`shrink-0 mt-0.5 w-4 h-4 md:w-5 md:h-5 ${
                          plan.highlighted ? "text-white" : "text-green-500"
                        }`}
                      />
                      <span
                        className={`text-xs md:text-sm ${
                          plan.highlighted ? "text-orange-50" : "text-slate-600"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className="block">
                  <button
                    className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all ${
                      plan.highlighted
                        ? "bg-white text-orange-500 hover:bg-orange-50 shadow-lg"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
