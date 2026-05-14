"use client";

import { Brain, Users, Shield, Zap } from "lucide-react";
import Reveal from "../Reveal";

const features = [
  {
    icon: Brain,
    title: "تحلیل شخصیت",
    desc: "شناخت عمیق شخصیت و الگوهای رفتاری شما",
  },
  {
    icon: Users,
    title: "تطابق هوشمند",
    desc: "پیدا کردن افراد نزدیک به روحیات شما",
  },
  {
    icon: Shield,
    title: "فضای امن",
    desc: "حریم خصوصی و امنیت کامل گفتگوها",
  },
  {
    icon: Zap,
    title: "ارتباط واقعی",
    desc: "گفتگوهای عمیق به جای ارتباطات سطحی",
  },
];

export default function Features() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-transparent">
      <div className="container mx-auto">
        <Reveal direction="up" className="text-center mb-12 md:mb-16">
          <span className="text-orange-500 font-bold text-sm md:text-base uppercase tracking-wide">
            چرا راوی؟
          </span>

          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-3 mb-4 leading-[1.5]">
            تجربه‌ای متفاوت از پیدا کردن آدم‌های هم‌فرکانس
          </h2>

          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-8">
            با کمک هوش مصنوعی و تحلیل شخصیت، گفتگوهایی عمیق‌تر و واقعی‌تر را تجربه کنید
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;

            return (
              <Reveal
                key={idx}
                direction="up"
                delay={idx * 0.1}
                className="group"
              >
                <div className="bg-[#0B1F3A] text-white border border-slate-800 rounded-[28px] p-7 h-full hover:-translate-y-2 transition-all duration-300 shadow-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-5 border border-orange-500/20">
                    <Icon className="text-orange-400" size={28} />
                  </div>

                  <h3 className="text-xl font-black mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-orange-100 leading-8 text-sm">
                    {feature.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
