"use client";

import Link from "next/link";
import { Zap, Users, Brain, Heart, Target, Award } from "lucide-react";
import Reveal from "@/components/Reveal";
import MobileNavbar from "@/components/MobileNavbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen font-sans text-slate-900 overflow-x-hidden relative bg-transparent pb-24 md:pb-0">
      {/* Mobile Navbar Floating */}
      <MobileNavbar />

      {/* Background Blobs - کمتر در موبایل */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-white/30">
        <div className="absolute top-0 -left-10 md:-left-20 w-[200px] md:w-[500px] h-[200px] md:h-[500px] bg-orange-400/30 md:bg-orange-400/40 rounded-full mix-blend-multiply filter blur-[60px] md:blur-[80px] animate-blob"></div>
        <div className="absolute top-0 -right-10 md:-right-20 w-[150px] md:w-[400px] h-[150px] md:h-[400px] bg-yellow-400/30 md:bg-yellow-400/40 rounded-full mix-blend-multiply filter blur-[60px] md:blur-[80px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 -right-10 md:-right-20 w-[200px] md:w-[600px] h-[200px] md:h-[600px] bg-orange-100/50 md:bg-orange-100/60 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] animate-blob"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-lg z-40 border-b border-white/50 h-16 md:h-20 flex items-center shadow-sm">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-orange-200">
              <Zap size={20} className="md:w-6 md:h-6" fill="currentColor" />
            </div>
            <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
              راوی
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-900 transition">
              خانه
            </Link>
            <Link href="/about" className="text-orange-600 font-bold">
              درباره ما
            </Link>
            <Link href="/events" className="hover:text-slate-900 transition">
              رویدادها
            </Link>
          </nav>

          <Link href="/test" className="hidden md:block">
            <button className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200">
              شروع کنید
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <Reveal
        as="section"
        direction="up"
        className="pt-28 md:pt-36 pb-12 md:pb-20 px-4 md:px-6"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-block bg-orange-100/80 backdrop-blur text-orange-600 px-3 py-1.5 rounded-full text-xs md:text-sm font-bold mb-4 border border-orange-200">
            ✨ داستان ما
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">
            ما کی هستیم و چرا راوی رو ساختیم؟
          </h1>
          <p className="text-slate-600 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            راوی متولد شد از این ایده که آشنایی و دوست‌یابی نباید تصادفی باشد.
            ما با ترکیب علم روان‌شناسی و هوش مصنوعی، می‌خواهیم افراد را با
            کسانی متصل کنیم که واقعاً با آن‌ها هم‌خوانی دارند.
          </p>
        </div>
      </Reveal>

      {/* Mission & Vision */}
      <Reveal
        as="section"
        direction="left"
        className="py-12 md:py-20 px-4 md:px-6"
      >
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="bg-white/80 backdrop-blur rounded-2xl md:rounded-3xl p-6 md:p-10 border border-slate-200 shadow-lg">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
              <Target className="text-orange-500 w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-4">
              ماموریت ما
            </h2>
            <p className="text-slate-600 text-xs md:text-sm lg:text-base leading-relaxed">
              ایجاد فضایی امن و علمی برای آشنایی و ساخت روابط معنادار. ما
              می‌خواهیم افراد بتوانند به راحتی و با اطمینان، افرادی را پیدا
              کنند که با آن‌ها تفاهم واقعی دارند.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl md:rounded-3xl p-6 md:p-10 border border-slate-200 shadow-lg">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
              <Heart className="text-blue-500 w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-4">
              چشم‌انداز ما
            </h2>
            <p className="text-slate-600 text-xs md:text-sm lg:text-base leading-relaxed">
              تبدیل شدن به بزرگ‌ترین پلتفرم آشنایی مبتنی بر علم و هوش مصنوعی
              در ایران، جایی که هر کسی بتواند جامعه‌ای از افراد هم‌فکر و
              هم‌سطح خودش را پیدا کند.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Our Values */}
      <Reveal
        as="section"
        direction="right"
        className="py-12 md:py-20 px-4 md:px-6 bg-white/40 backdrop-blur-sm"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-orange-500 font-bold text-xs md:text-sm tracking-widest uppercase">
              ارزش‌های ما
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mt-2">
              چیزهایی که برامون مهمه
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Brain,
                title: "علمی بودن",
                description:
                  "تمام تست‌ها و الگوریتم‌های ما بر پایه تحقیقات روان‌شناسی معتبر هستند.",
              },
              {
                icon: Users,
                title: "احترام به افراد",
                description:
                  "ما به حریم خصوصی و امنیت داده‌های شما بسیار اهمیت می‌دهیم.",
              },
              {
                icon: Award,
                title: "شفافیت",
                description:
                  "همیشه صادقانه کار می‌کنیم و هیچ چیزی از شما پنهان نمی‌کنیم.",
              },
            ].map((value, index) => (
              <Reveal key={value.title} direction="up" delay={index * 0.1}>
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-slate-200 hover:border-orange-200 transition-all hover:shadow-xl hover:-translate-y-2">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-100 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                    <value.icon className="text-orange-500 w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2 md:mb-3">
                    {value.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Team Section */}
      <Reveal
        as="section"
        direction="left"
        className="py-12 md:py-20 px-4 md:px-6"
      >
        <div className="container mx-auto max-w-5xl text-center">
          <span className="text-orange-500 font-bold text-xs md:text-sm tracking-widest uppercase">
            تیم راوی
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mt-2 mb-6 md:mb-8">
            کسانی که راوی رو می‌سازن
          </h2>
          <p className="text-slate-600 text-xs md:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto mb-10 md:mb-16">
            تیم ما شامل روانشناسان، توسعه‌دهندگان نرم‌افزار، و متخصصان هوش
            مصنوعی است که همگی برای یک هدف کار می‌کنند: ایجاد بهترین تجربه
            آشنایی برای شما.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-200 rounded-full mx-auto mb-3 md:mb-4"></div>
                <h4 className="font-bold text-slate-900 text-xs md:text-sm mb-1">
                  عضو تیم {i}
                </h4>
                <p className="text-[10px] md:text-xs text-slate-500">نقش شغلی</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal
        as="section"
        direction="up"
        className="py-12 md:py-20 px-4 md:px-6"
      >
        <div className="container mx-auto max-w-4xl bg-slate-900 text-white rounded-2xl md:rounded-3xl px-6 md:px-10 py-10 md:py-16 relative overflow-hidden text-center">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/30 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black mb-4">
              آماده‌ای بهترین هم‌نشین‌ها رو پیدا کنی؟
            </h2>
            <p className="text-slate-300 leading-relaxed text-xs md:text-sm lg:text-base mb-6 md:mb-8 max-w-2xl mx-auto">
              همین الان تست شخصیت‌شناسی رایگان راوی رو شروع کن و ببین چه
              افرادی منتظر آشنایی با تو هستند!
            </p>
            <Link href="/test">
              <button className="bg-white text-slate-900 px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base lg:text-lg hover:bg-slate-100 transition shadow-lg hover:-translate-y-1">
                شروع کنید
              </button>
            </Link>
          </div>
        </div>
      </Reveal>

      {/* Footer - استفاده از همان فوتر لندینگ */}
      <footer className="bg-slate-900 text-white pt-16 md:pt-20 pb-28 md:pb-12 px-6 relative overflow-hidden">
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
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              راوی با ترکیب تست‌های روان‌شناسی و الگوریتم‌های هوش مصنوعی،
              امن‌ترین مسیر را برای آشنایی و ایجاد روابط عمیق فراهم می‌کند.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm md:text-base">
              لینک‌های مفید
            </h4>
            <ul className="space-y-4 text-xs md:text-sm">
              <li>
                <Link href="/about" className="hover:text-orange-500 transition">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/test" className="hover:text-orange-500 transition">
                  تست شخصیت‌شناسی
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-orange-500 transition">
                  رویدادها
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm md:text-base">
              تماس با ما
            </h4>
            <ul className="space-y-4 text-xs md:text-sm">
              <li>info@raavi.ir 📧</li>
              <li>۰۲۱-۸۸۸۸۸۸۸۸ 📞</li>
              <li>تهران، خیابان ولیعصر 📍</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm md:text-base">
              نماد اعتماد
            </h4>
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
