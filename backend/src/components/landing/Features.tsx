"use client";

import { Brain, Users, Shield, Zap } from "lucide-react";
import Reveal from "../Reveal";

const features = [
  {
    icon: Brain,
    title: "تحلیل هوش مصنوعی",
    desc: "الگوریتم‌های پیشرفته ما شخصیت شما را به‌طور دقیق تحلیل می‌کنند.",
    accent: "#FF6B00",
  },
  {
    icon: Users,
    title: "تطابق هوشمند",
    desc: "افرادی را پیدا کنید که واقعاً با شما سازگار هستند.",
    accent: "#FF9A3C",
  },
  {
    icon: Shield,
    title: "امنیت و حریم خصوصی",
    desc: "اطلاعات شما کاملاً محرمانه و امن نگهداری می‌شود.",
    accent: "#FF6B00",
  },
  {
    icon: Zap,
    title: "سریع و آسان",
    desc: "در کمتر از ۱۰ دقیقه، تست را تکمیل کنید و نتیجه بگیرید.",
    accent: "#FF9A3C",
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
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Reveal key={idx} direction="up" delay={idx * 0.1} className="group">
                {/*
                  ✅ NAVY BLUE (#1B2A4A) background
                  ✅ ALL text is WHITE
                  ✅ Orange icon on navy background (no white bg)
                */}
                <div
                  className="rounded-[24px] md:rounded-[32px] p-6 md:p-8 h-full flex flex-col
                             hover:-translate-y-2 transition-all duration-300
                             hover:shadow-2xl hover:shadow-orange-500/15"
                  style={{
                    background: "linear-gradient(145deg, #1B2A4A 0%, #132038 60%, #0d1826 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                  }}
                >
                  {/* Orange icon directly on navy — no white wrapper */}
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center
                               mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `rgba(255, 107, 0, 0.18)`,
                      border: "1px solid rgba(255,107,0,0.35)",
                    }}
                  >
                    <Icon
                      className="w-7 h-7 md:w-8 md:h-8"
                      style={{ color: feature.accent }}
                    />
                  </div>

                  {/* White title */}
                  <h3 className="text-lg md:text-xl font-black mb-3" style={{ color: "#FFFFFF" }}>
                    {feature.title}
                  </h3>

                  {/* White description (slightly dimmed for hierarchy) */}
                  <p
                    className="text-sm md:text-base leading-relaxed flex-1"
                    style={{ color: "rgba(255,255,255,0.72)" }}
                  >
                    {feature.desc}
                  </p>

                  {/* Bottom accent bar */}
                  <div
                    className="mt-5 h-0.5 w-10 rounded-full group-hover:w-full
                               transition-all duration-500"
                    style={{ background: `linear-gradient(90deg, ${feature.accent}, transparent)` }}
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
