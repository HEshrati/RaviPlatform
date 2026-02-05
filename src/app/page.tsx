// src/app/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Brain,
  BarChart3,
  Users,
  Calendar,
  ChevronDown,
  Menu,
  X,
  Zap,
  Check,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import CountdownTimer from "@/components/CountdownTimer";
import Reveal from "@/components/Reveal";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import MobileNavbar from "@/components/MobileNavbar"; // <--- Import New Component

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

export default function LandingPage() {
  const { state } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const ctaHref = useMemo(() => {
    if (!state.isLoggedIn) return "/test";
    if (!state.isProfileComplete || !state.isTestTaken) {
      return "/dashboard/complete-profile";
    }
    return "/events/next/booking";
  }, [state.isLoggedIn, state.isProfileComplete, state.isTestTaken]);

  const handleFaqToggle = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 overflow-x-hidden relative bg-transparent pb-24 md:pb-0">
      {/* Mobile Navbar Floating */}
      <MobileNavbar />

      {/* ================= BACKGROUND ANIMATED BLOBS ================= */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-white/30">
        <div className="absolute top-0 -left-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-400/40 rounded-full mix-blend-multiply filter blur-[60px] md:blur-[80px] animate-blob"></div>
        <div className="absolute top-0 -right-20 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-yellow-400/40 rounded-full mix-blend-multiply filter blur-[60px] md:blur-[80px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] -left-20 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-orange-300/50 rounded-full mix-blend-multiply filter blur-[60px] md:blur-[80px] animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 -right-20 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-orange-100/60 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] animate-blob"></div>
      </div>

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-lg z-40 border-b border-white/50 h-16 md:h-20 flex items-center shadow-sm">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-orange-200">
              <Zap size={20} className="md:w-6 md:h-6" fill="currentColor" />
            </div>
            <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
              راوی
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-slate-500 font-medium">
            <Link href="/" className="text-orange-600 font-bold">
              خانه
            </Link>
            <Link href="#" className="hover:text-slate-900 transition">
              درباره ما
            </Link>
            <Link href="/events" className="hover:text-slate-900 transition">
              رویدادها
            </Link>
            <Link href="#" className="hover:text-slate-900 transition">
              تماس با ما
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {state.isLoggedIn ? (
              <Link href="/dashboard">
                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                  ورود به داشبورد
                </button>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-600 font-bold hover:text-slate-900"
                >
                  ورود
                </Link>
                <Link href="/test">
                  <button className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200">
                    ثبت نام رایگان
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Optional since we have bottom nav, but kept for full menu access */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl md:hidden animate-in slide-in-from-top-5">
            <Link href="/" className="text-orange-600 font-bold">
              خانه
            </Link>
            <Link href="/events" className="font-medium text-slate-700">
              رویدادها
            </Link>
            <Link href="/login" className="font-medium text-slate-700">
              ورود
            </Link>
            <Link
              href="/test"
              className="bg-orange-500 text-white text-center py-3 rounded-xl font-bold"
            >
              شروع کنید
            </Link>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <Reveal
        as="section"
        direction="right"
        className="pt-28 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 relative"
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
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-slate-900 leading-tight">
              با <span className="text-orange-500">هوش مصنوعی</span>، <br />
              هم‌نشین تو پیدا کن
            </h1>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-lg font-medium">
              ما با استفاده از پیشرفته‌ترین الگوریتم‌های هوش مصنوعی و تست‌های
              روان‌شناسی دقیق، افرادی را پیدا می‌کنیم که بیشترین تفاهم را با شما
              دارند.
            </p>

            <div className="w-full flex justify-center md:justify-start">
              <CountdownTimer />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href={ctaHref} className="w-full sm:w-auto">
                <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-2xl font-bold text-base md:text-lg hover:bg-slate-800 transition shadow-xl w-full">
                  بزن بریم
                  <ArrowLeft size={20} />
                </button>
              </Link>
              <Link href="/events" className="w-full sm:w-auto">
                <button className="bg-white/50 backdrop-blur text-slate-700 border-2 border-slate-200 px-6 md:px-8 py-3.5 md:py-4 rounded-2xl font-bold text-base md:text-lg hover:bg-white hover:border-slate-400 transition w-full">
                  بیشتر بدانید
                </button>
              </Link>
            </div>

            <div className="flex items-center gap-4 pt-4 text-xs md:text-sm text-slate-500 font-medium justify-center md:justify-start">
              <div className="flex -space-x-3 space-x-reverse">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative"
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=User+${i}&background=random`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-orange-500 flex items-center justify-center text-white text-[10px] md:text-xs font-bold">
                  +10k
                </div>
              </div>
              <p>
                به جمع{" "}
                <span className="font-bold text-slate-900">۱۰ هزار کاربر</span>{" "}
                فعال ما بپیوندید
              </p>
            </div>
          </Reveal>

          {/* Image Content */}
          <Reveal
            direction="left"
            className="order-1 lg:order-2 relative px-4 md:px-0"
          >
            <div className="relative rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200 border-4 border-white/50 aspect-[4/3] group bg-slate-100">
              <img
                src="https://placehold.co/800x600/orange/white?text=RAAVI+Cover"
                alt="Raavi Platform"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/90 backdrop-blur rounded-2xl p-2 md:p-3 shadow-lg flex items-center gap-2 md:gap-3 animate-bounce-slow">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Check size={16} className="md:w-5 md:h-5" strokeWidth={4} />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-slate-500 font-bold">
                    تطابق یافت شد
                  </p>
                  <p className="text-xs md:text-sm font-black text-slate-900">
                    ۹۸٪ تفاهم اخلاقی
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Reveal>

      {/* ================= STATS ================= */}
      <Reveal
        as="section"
        direction="left"
        className="bg-slate-900 py-12 md:py-16 text-white relative overflow-hidden"
      >
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-black text-orange-500">
              10,000+
            </h3>
            <p className="text-slate-400 font-medium text-sm md:text-base">
              کاربر فعال
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-black text-orange-500">
              2,500+
            </h3>
            <p className="text-slate-400 font-medium text-sm md:text-base">
              تطابق موفق
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-black text-orange-500">
              16
            </h3>
            <p className="text-slate-400 font-medium text-sm md:text-base">
              تیپ شخصیتی
            </p>
          </div>
        </div>
        <div className="absolute top-1/2 left-10 w-4 h-4 bg-white rounded-full" />
      </Reveal>

      {/* ================= FLOW ================= */}
      <Reveal
        as="section"
        direction="right"
        className="py-16 md:py-24 px-4 md:px-6 bg-white/60 backdrop-blur-md"
      >
        <div className="container mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-orange-500 font-bold text-xs md:text-sm tracking-widest uppercase">
              فرآیند ساده
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mt-2 mb-4">
              چگونه هم‌نشین خود را پیدا می‌کنید؟
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
              مسیر پیدا کردن هم‌نشین ایده‌آل شما در ۴ مرحله ساده و علمی طراحی
              شده است تا بهترین تجربه را داشته باشید.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: Brain,
                title: "۱. تست روان‌شناسی",
                desc: "پاسخ به سوالات دقیق MBTI و روان‌شناسی برای شناخت بهتر لایه‌های شخصیتی شما.",
              },
              {
                icon: BarChart3,
                title: "۲. تحلیل هوش مصنوعی",
                desc: "الگوریتم‌های پیشرفته ما داده‌های شما را تحلیل کرده و بهترین الگوهای مطابق را می‌یابند.",
              },
              {
                icon: Users,
                title: "۳. تطابق گروهی",
                desc: "عضویت در گروه‌های اختصاصی تلگرام با افرادی که بالاترین درصد تفاهم را با شما دارند.",
              },
              {
                icon: Calendar,
                title: "۴. رویداد حضوری",
                desc: "شرکت در رویدادهای حضوری و بازی‌های گروهی برای تعمیق آشنایی در فضایی امن.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/80 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group backdrop-blur-sm"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <item.icon size={24} className="md:w-7 md:h-7" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ================= SMART ENGINE ================= */}
      <Reveal
        as="section"
        direction="left"
        className="py-16 md:py-24 px-4 md:px-6 overflow-hidden relative"
      >
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
          <div className="order-2 lg:order-1">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
              <Zap size={24} className="md:w-7 md:h-7" />
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 md:mb-6 leading-tight">
              موتور هوشمند تطابق شخصیت
            </h2>
            <p className="text-slate-600 text-base md:text-lg mb-6 md:mb-8 leading-relaxed font-medium">
              برخلاف روش‌های سنتی، ما فقط به سن و محل زندگی نگاه نمی‌کنیم. موتور
              هوشمند ما با تحلیل ۱۶ تیپ شخصیتی و الگوهای رفتاری، کسانی را به شما
              پیشنهاد می‌دهد که واقعاً با آن‌ها «حرف مشترک» دارید.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-700 font-medium text-sm md:text-base">
                <CheckCircle2 className="text-green-500 w-5 h-5 md:w-6 md:h-6" />
                تحلیل عمیق روان‌شناختی
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium text-sm md:text-base">
                <CheckCircle2 className="text-green-500 w-5 h-5 md:w-6 md:h-6" />
                یادگیری مستمر از بازخوردها
              </li>
            </ul>

            <button className="border-2 border-orange-500 text-orange-600 px-6 md:px-8 py-3 rounded-2xl font-bold hover:bg-orange-50 transition bg-white/50 backdrop-blur text-sm md:text-base w-full md:w-auto">
              درباره هوش مصنوعی
            </button>
          </div>

          <div className="order-1 lg:order-2">
            <div className="bg-slate-900 rounded-[30px] md:rounded-[40px] p-6 md:p-8 shadow-2xl relative">
              {/* Dashboard mockup content */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  داشبورد هوشمند
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800 p-4 rounded-2xl">
                  <div className="h-20 flex items-end gap-2 justify-between px-2">
                    <div className="w-full bg-orange-500/30 h-[40%] rounded-t" />
                    <div className="w-full bg-orange-500 h-[80%] rounded-t shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                    <div className="w-full bg-orange-500/50 h-[60%] rounded-t" />
                  </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-2xl flex flex-col justify-center items-center">
                  <div className="text-3xl font-bold text-white mb-1">۱۲۴</div>
                  <div className="text-xs text-slate-400">تعداد تطابق</div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 mb-1">
                    احتمال تفاهم
                  </div>
                  <div className="text-2xl font-bold text-orange-500">۹۵٪</div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ================= TESTIMONIALS ================= */}
      <Reveal
        as="section"
        direction="right"
        className="py-16 md:py-24 px-4 md:px-6 bg-white/40 backdrop-blur-sm overflow-hidden"
      >
        <div className="container mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">
              تجربه کاربران راوی
            </h2>
            <p className="text-slate-500 text-sm md:text-base">
              ببینید دیگران چگونه هم‌نشین‌های خود را پیدا کردند.
            </p>
          </div>

          <TestimonialsCarousel />
        </div>
      </Reveal>

      {/* ================= CTA ================= */}
      <Reveal
        as="section"
        direction="left"
        className="py-16 md:py-24 px-4 md:px-6"
      >
        <div className="container mx-auto bg-slate-900 text-white rounded-[30px] md:rounded-3xl px-6 md:px-8 py-10 md:py-16 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/30 rounded-full blur-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
            <div className="text-center md:text-right">
              <h2 className="text-2xl md:text-3xl font-black mb-4">
                آماده‌ای هم‌نشین خودت را پیدا کنی؟
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                با یک تست ۱۵ دقیقه‌ای شروع کن و به جمع ۱۰ هزار نفره راوی اضافه
                شو. تیم ما در کنار توست تا تجربه‌ای امن، علمی و هیجان‌انگیز
                داشته باشی.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Link href={ctaHref} className="w-full sm:w-auto">
                <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-base md:text-lg hover:bg-slate-100 transition shadow-lg hover:-translate-y-1 w-full">
                  بزن بریم
                </button>
              </Link>
              <Link href="/events" className="w-full sm:w-auto">
                <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-base md:text-lg hover:bg-white/10 transition w-full">
                  شرکت در رویداد بعدی
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ================= FAQ ================= */}
      <Reveal
        as="section"
        direction="right"
        className="py-16 md:py-24 px-4 md:px-6 bg-white/40 backdrop-blur-sm"
      >
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-orange-500 font-bold text-xs md:text-sm tracking-widest uppercase">
              سوالات متداول
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2 mb-4">
              پاسخ به رایج‌ترین پرسش‌ها
            </h2>
          </div>

          <div className="space-y-3 md:space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={item.question}
                  className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => handleFaqToggle(index)}
                    className="w-full flex items-center justify-between text-right px-4 md:px-6 py-4 md:py-5 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-slate-800 font-bold text-sm md:text-lg">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`transition-transform duration-300 text-slate-400 w-5 h-5 md:w-6 md:h-6 ${isOpen ? "rotate-180 text-orange-500" : ""}`}
                    />
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0 text-sm md:text-base text-slate-600 leading-7 md:leading-8">
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

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 text-white pt-16 md:pt-20 pb-28 md:pb-12 px-6 relative overflow-hidden">
        {/* Animated Blobs for Footer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 relative z-10 text-center md:text-right">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-200">
                <Zap size={24} fill="currentColor" />
              </div>
              <span className="text-2xl font-black tracking-tight">راوی</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              راوی با ترکیب تست‌های روان‌شناسی و الگوریتم‌های هوش مصنوعی،
              امن‌ترین مسیر را برای آشنایی و ایجاد روابط عمیق فراهم می‌کند.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">لینک‌های مفید</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/test" className="hover:text-orange-500 transition">
                  تست شخصیت‌شناسی
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-orange-500 transition"
                >
                  رویدادها
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition">
                  قوانین و مقررات
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">تماس با ما</h4>
            <ul className="space-y-4 text-sm">
              <li>info@raavi.ir 📧</li>
              <li>۰۲۱-۸۸۸۸۸۸۸۸ 📞</li>
              <li>تهران، خیابان ولیعصر 📍</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">نماد اعتماد</h4>
            <div className="flex gap-4 justify-center md:justify-start">
              <div className="w-20 h-20 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-xs text-slate-500">
                E-Namad
              </div>
              <div className="w-20 h-20 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-xs text-slate-500">
                Samandehi
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-12 md:mt-16 pt-8 border-t border-slate-800 text-center text-xs text-slate-600 relative z-10">
          © ۱۴۰۴ راوی. تمامی حقوق محفوظ است.
        </div>
      </footer>
    </div>
  );
}
