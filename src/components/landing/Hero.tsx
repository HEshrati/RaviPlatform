"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import CountdownTimer from "../CountdownTimer";
import Reveal from "../Reveal";
import { useState } from "react";

interface HeroProps {
  ctaHref: string;
}

export default function Hero({ ctaHref }: HeroProps) {
  const nextEventId = "next";
  const [imageError, setImageError] = useState(false);

  // تصاویر با موضوع گردهمایی، ارتباطات و روابط اجتماعی
  const heroImages = [
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=80", // گروه دوستان در کافه
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=80", // جلسه گروهی
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&q=80", // تیم در حال کار
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageError = () => {
    if (currentImageIndex < heroImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setImageError(true);
    }
  };

  return (
    <Reveal
      as="section"
      direction="right"
      className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 relative bg-transparent"
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Text Content */}
        <Reveal
          direction="right"
          className="order-2 lg:order-1 text-right space-y-6 md:space-y-8"
        >
          <span className="inline-block bg-orange-100/80 backdrop-blur text-orange-600 px-3 py-1 rounded-full text-xs md:text-sm font-bold mb-2 border border-orange-200">
            ✨ هوشمندترین پلتفرم برگزاری ایونت
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 leading-tight">
            با <span className="text-orange-500">هوش مصنوعی</span>، <br />
            هم‌نشین تو پیدا کن
          </h1>
          <p className="text-slate-600 text-sm md:text-base lg:text-lg leading-relaxed max-w-lg font-medium">
            ما با استفاده از پیشرفته‌ترین الگوریتم‌های هوش مصنوعی و تست‌های
            روان‌شناسی دقیق، افرادی را پیدا می‌کنیم که بیشترین تفاهم را با شما
            دارند.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
            <Link href={ctaHref} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-orange-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-sm md:text-base hover:bg-orange-600 transition shadow-xl shadow-orange-200/50 hover:-translate-y-1">
                شروع رایگان کنید
              </button>
            </Link>
            <Link href="/events" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-slate-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-sm md:text-base hover:bg-slate-800 transition shadow-xl shadow-slate-200/50 hover:-translate-y-1">
                مشاهده رویدادها
              </button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 md:gap-6 pt-4 md:pt-6 text-xs md:text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500 w-4 h-4 md:w-5 md:h-5" />
              <span>تست روانشناسی معتبر</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500 w-4 h-4 md:w-5 md:h-5" />
              <span>الگوریتم هوش مصنوعی</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500 w-4 h-4 md:w-5 md:h-5" />
              <span>کاملا امن و محرمانه</span>
            </div>
          </div>
        </Reveal>

        {/* Image Side */}
        <Reveal direction="left" className="order-1 lg:order-2">
          <div className="relative">
            <div className="aspect-square md:aspect-auto md:h-[500px] lg:h-[600px] rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl shadow-orange-200/30 border-4 border-white/90 backdrop-blur-sm">
              {!imageError ? (
                <img
                  src={heroImages[currentImageIndex]}
                  alt="گروهی از افراد در حال گفتگو و تعامل در یک محیط دوستانه و حرفه‌ای"
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  loading="eager"
                />
              ) : (
                // Fallback gradient if all images fail
                <div className="w-full h-full bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-300 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="text-6xl mb-4">🤝</div>
                    <h3 className="text-2xl font-bold">هم‌نشین‌یابی هوشمند</h3>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent" />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-4 md:-bottom-8 md:-left-8 bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl shadow-slate-200 border border-slate-100">
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-xl md:rounded-2xl flex items-center justify-center text-orange-500 text-xl md:text-2xl font-black">
                  AI
                </div>
                <div>
                  <div className="text-xs md:text-sm text-slate-500">
                    قدرت گرفته از
                  </div>
                  <div className="font-black text-slate-900 text-sm md:text-base">
                    تطابق هوش مصنوعی
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-[10px] md:text-xs text-slate-500 font-bold">
                  +۱۰۰۰ کاربر فعال
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Countdown Timer */}
      <div className="container mx-auto mt-12 md:mt-20">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/30">
          <div className="text-center mb-6 md:mb-8">
            <span className="text-orange-500 font-bold text-xs md:text-sm tracking-widest uppercase">
              رویداد بعدی
            </span>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 mt-2">
              گردهمایی شب شناخت و دوستی
            </h2>
            <p className="text-slate-500 mt-2 text-xs md:text-sm">
              جمعه، ۱۵ اسفند | کافه رستوران پارک‌ساید، تهران
            </p>
          </div>
          <CountdownTimer target="2026-03-06T19:00:00" />
          <div className="flex justify-center mt-6 md:mt-8">
            <Link
              href={`/events/${nextEventId}/booking`}
              className="w-full sm:w-auto text-center"
            >
              <button className="w-full sm:w-auto bg-orange-500 text-white px-6 md:px-10 py-3 md:py-4 rounded-2xl font-bold text-sm md:text-lg hover:bg-orange-600 transition shadow-lg shadow-orange-200 hover:-translate-y-1">
                رزرو جایگاه
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
