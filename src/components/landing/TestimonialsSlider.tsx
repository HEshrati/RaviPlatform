// src/components/landing/TestimonialsSlider.tsx
"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Star } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "نگار حسینی",
    role: "شرکت‌کننده",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
    text: "فضا خیلی دوستانه بود، گفتگوها کیفیت داشت و با افراد هم‌فکر آشنا شدم. تجربه‌ای متفاوت!",
    rating: 5,
  },
  {
    id: 2,
    name: "پویان رستگار",
    role: "شرکت‌کننده",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&q=80&w=256",
    text: "بخش مچینگ هوشمند عالی بود! آشنایی‌های باکیفیتی شکل گرفت. پیشنهاد می‌کنم امتحان کنید.",
    rating: 4,
  },
  {
    id: 3,
    name: "مینا نادری",
    role: "شرکت‌کننده",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=256",
    text: "مطمئن بودم فضا ایمنه و همین باعث شد راحت‌تر گفتگو کنم. تیم برگزاری فوق‌العاده بود.",
    rating: 5,
  },
];

export default function TestimonialsSlider() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () =>
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[index];

  return (
    <section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="relative bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-slate-200 shadow-xl overflow-hidden">
        {/* دکمه‌ها در دو طرف کانتینر */}
        <button
          onClick={prev}
          aria-label="قبلی"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur hover:bg-white text-slate-900 border border-slate-200 w-10 h-10 rounded-full flex items-center justify-center shadow transition"
        >
          <ChevronRight size={18} />
        </button>
        <button
          onClick={next}
          aria-label="بعدی"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur hover:bg-white text-slate-900 border border-slate-200 w-10 h-10 rounded-full flex items-center justify-center shadow transition"
        >
          <ChevronLeft size={18} />
        </button>

        {/* کارت نظر با انیمیشن نرم */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-8 items-center">
          <div className="flex items-center gap-4">
            <img
              src={current.avatar}
              alt={current.name}
              className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <div className="text-right">
              <div className="font-bold text-slate-900 text-sm md:text-base">
                {current.name}
              </div>
              <div className="text-xs text-slate-400">{current.role}</div>
              <div className="flex items-center gap-1 mt-2 justify-end">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="text-orange-500 fill-orange-500"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              key={current.id}
              className="text-slate-700 text-sm md:text-base leading-7 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-100 translate-y-0"
            >
              “{current.text}”
            </div>
          </div>
        </div>

        {/* اندیکاتورهای کوچک */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                i === index ? "bg-orange-500" : "bg-slate-300"
              }`}
              aria-label={`نمایش نظر ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
