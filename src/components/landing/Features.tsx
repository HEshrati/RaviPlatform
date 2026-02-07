"use client";

import { Brain, Users, Shield, Zap } from "lucide-react";
import Reveal from "../Reveal";

const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "تحلیل هوش مصنوعی",
    desc: "الگوریتم‌های پیشرفته ما شخصیت شما را به‌طور دقیق تحلیل می‌کنند.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "تطابق هوشمند",
    desc: "افرادی را پیدا کنید که واقعاً با شما سازگار هستند.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "امنیت و حریم خصوصی",
    desc: "اطلاعات شما کاملاً محرمانه و امن نگهداری می‌شود.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "سریع و آسان",
    desc: "در کمتر از ۱۰ دقیقه، تست را تکمیل کنید و نتیجه بگیرید.",
  },
];

export default function Features() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-transparent">
      <div className="container mx-auto">
        <Reveal direction="up" className="text-center mb-12 md:mb-16">
          <span className="text-orange-500 font-bold text-sm md:text-base uppercase tracking-wide">
            چطور کار می‌کند؟
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mt-3 mb-4">
            فقط چند قدم تا یافتن هم‌نشین ایده‌آل
          </h2>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
            با تکنولوژی هوش مصنوعی و تست‌های روان‌شناختی، بهترین افراد را برای
            شما پیدا می‌کنیم
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <Reveal
              key={idx}
              direction="up"
              delay={idx * 0.1}
              className="group"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-slate-100/80 shadow-lg shadow-slate-200/30 hover:shadow-xl hover:shadow-orange-200/20 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 mb-4 md:mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed flex-1">
                  {feature.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
