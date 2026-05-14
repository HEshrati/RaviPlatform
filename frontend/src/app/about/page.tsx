"use client";

import Link from "next/link";
import {
  ArrowLeft, Brain, Heart, Users, Shield,
  Sparkles, Coffee, Target, MapPin, MessageCircle,
} from "lucide-react";

const steps = [
  {
    icon: Brain,
    step: "۱",
    title: "تست شخصیت",
    desc: "با تست علمی راوی، تیپ شخصیتی، علایق و سبک زندگی خود را بشناسید. این شناخت پایه تطابق‌های دقیق است.",
  },
  {
    icon: Sparkles,
    step: "۲",
    title: "تطابق هوشمند",
    desc: "الگوریتم راوی بر اساس عمیق‌ترین سازگاری‌های روانشناختی، بهترین هم‌صحبت‌ها را پیشنهاد می‌دهد.",
  },
  {
    icon: Coffee,
    step: "۳",
    title: "همنشینی واقعی",
    desc: "در رویدادهای حضوری یا آنلاین راوی شرکت کنید و با افراد هم‌فکر واقعی آشنا شوید.",
  },
];

const values = [
  { icon: Heart, title: "ارتباطات معنادار", desc: "باور داریم کیفیت ارتباطات مهم‌تر از کمیت است. یک گفتگوی عمیق از هزار آشنایی سطحی ارزشمندتر است." },
  { icon: Shield, title: "امنیت و حریم خصوصی", desc: "تمام داده‌های کاربران با بالاترین استانداردهای امنیتی محافظت می‌شود و هیچ اطلاعاتی بدون اجازه به اشتراک گذاشته نمی‌شود." },
  { icon: Users, title: "جامعه‌ای امن و محترم", desc: "راوی فضایی امن، حرفه‌ای و محترم برای همه اعضاست. احترام متقابل اساس تمام تعاملات ماست." },
  { icon: Target, title: "دقت در تطابق", desc: "از علوم روانشناسی و هوش مصنوعی برای ایجاد تطابق‌های واقعی استفاده می‌کنیم، نه تطابق‌های تصادفی." },
];

const stats = [
  { number: "+۵۰۰۰", label: "کاربر فعال" },
  { number: "+۲۰۰", label: "رویداد برگزار شده" },
  { number: "۹۲٪", label: "رضایت کاربران" },
  { number: "+۱۵", label: "شهر ایران" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }} dir="rtl">

      {/* ─── هیرو ─── */}
      <section className="relative pt-28 md:pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10"
          style={{ background: "linear-gradient(180deg, #fff8f0 0%, #ffffff 100%)" }}
        />
        {/* دایره تزئینی */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,107,0,0.08), transparent 70%)" }}
        />
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <span className="inline-block text-xs font-black text-orange-500 px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.18)" }}
          >
            درباره ما
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            درباره <span style={{ color: "#FF7A00" }}>راوی</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            پلتفرم هم‌صحبت‌یابی هوشمند که با ترکیب علوم روانشناسی و هوش مصنوعی،
            ارتباطات معنادار ایجاد می‌کند.
          </p>
        </div>
      </section>

      {/* ─── ماموریت ─── */}
      <section className="py-10 container mx-auto px-4 max-w-4xl">
        <div className="rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1B2A4A 100%)" }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,107,0,0.12), transparent 70%)" }}
          />
          <div className="relative z-10">
            <span className="text-orange-400 font-black text-sm">ماموریت ما</span>
            <h2 className="text-2xl md:text-3xl font-black mt-3 mb-5">
              ارتباطات انسانی را عمیق‌تر می‌کنیم
            </h2>
            <p className="text-slate-300 leading-8 text-base md:text-lg max-w-2xl">
              در دنیایی که ارتباطات سطحی‌تر شده، راوی با ترکیب هوش مصنوعی و روانشناسی
              فضایی می‌سازد تا هر کسی بتواند هم‌فکر واقعی خود را پیدا کند.
              باور داریم که هر انسانی شایسته گفتگوهای عمیق و ارتباطات معنادار است.
            </p>
          </div>
        </div>
      </section>

      {/* ─── آمار ─── */}
      <section className="py-12 container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ number, label }) => (
            <div key={label} className="text-center p-6 rounded-2xl"
              style={{ background: "rgba(255,107,0,0.05)", border: "1px solid rgba(255,107,0,0.12)" }}
            >
              <div className="text-3xl md:text-4xl font-black mb-1"
                style={{ color: "#FF7A00" }}>
                {number}
              </div>
              <div className="text-sm text-slate-500 font-bold">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── چطور کار می‌کند ─── */}
      <section className="py-12 container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <span className="text-orange-500 font-black text-sm">فرآیند راوی</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-3">چطور کار می‌کند؟</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(({ icon: Icon, step, title, desc }) => (
            <div key={title}
              className="bg-white rounded-[28px] p-7 border border-slate-100 shadow-lg hover:-translate-y-1 transition-all duration-300 relative"
            >
              <div className="absolute top-5 left-5 text-5xl font-black opacity-5 text-orange-500">
                {step}
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg, rgba(255,107,0,0.12), rgba(255,154,60,0.08))" }}
              >
                <Icon className="text-orange-500" size={24} />
              </div>
              <span className="text-orange-500 font-black text-xs">مرحله {step}</span>
              <h3 className="font-black text-slate-900 text-xl mt-2 mb-3">{title}</h3>
              <p className="text-slate-500 leading-7 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ارزش‌ها ─── */}
      <section className="py-12"
        style={{ background: "linear-gradient(180deg, #fff8f0 0%, #ffffff 100%)" }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-orange-500 font-black text-sm">چه چیزی ما را متمایز می‌کند</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-3">ارزش‌های راوی</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className="bg-white rounded-2xl p-6 flex gap-4 items-start shadow-sm border border-slate-100 hover:border-orange-200 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(255,107,0,0.12), rgba(255,154,60,0.08))" }}
                >
                  <Icon className="text-orange-500" size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-7">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── چرا راوی ─── */}
      <section className="py-12 container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-orange-500 font-black text-sm">چرا راوی؟</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-3 mb-5">
              تفاوت راوی با بقیه پلتفرم‌ها
            </h2>
            <div className="space-y-4">
              {[
                { icon: Brain, text: "تطابق بر اساس روانشناسی عمیق، نه فقط علایق سطحی" },
                { icon: MessageCircle, text: "رویدادهای حضوری در کافه‌ها و فضاهای عمومی شهر" },
                { icon: Shield, text: "محیطی امن بدون پروفایل‌های جعلی و کاربران مزاحم" },
                { icon: MapPin, text: "حضور در بیش از ۱۵ شهر ایران" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(255,107,0,0.1)" }}
                  >
                    <Icon size={15} className="text-orange-500" />
                  </div>
                  <p className="text-slate-600 leading-7 text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] p-8"
            style={{
              background: "linear-gradient(145deg, #0f172a 0%, #1B2A4A 100%)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(255,107,0,0.15)" }}
            >
              <Heart className="text-orange-400" size={24} />
            </div>
            <h3 className="text-white font-black text-xl mb-3">داستان راوی</h3>
            <p className="text-slate-400 leading-8 text-sm">
              راوی از یک دغدغه ساده شروع شد: چرا با وجود شبکه‌های اجتماعی، بسیاری از مردم
              احساس تنهایی می‌کنند؟ پاسخ در کیفیت ارتباطات بود، نه کمیت. راوی پلتفرمی ساخت
              که با علم و هوش مصنوعی، ارتباطات واقعی را ممکن می‌سازد.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
            آماده‌ای هم‌صحبتت رو پیدا کنی؟
          </h2>
          <p className="text-slate-500 mb-8 leading-7">
            همین الان تست شخصیت راوی رو شروع کن و اولین قدم رو به سمت ارتباطات معنادار بردار.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/personality-test"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-white text-base transition-all hover:opacity-90 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #FF6B00, #FF9A3C)",
                boxShadow: "0 8px 24px rgba(255,107,0,0.3)",
              }}
            >
              <Sparkles size={18} />
              شروع تست شخصیت
            </Link>
            <Link href="/events"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-slate-700 text-base transition-all hover:text-orange-500 active:scale-95"
              style={{ border: "1.5px solid rgba(0,0,0,0.12)", background: "rgba(0,0,0,0.02)" }}
            >
              مشاهده رویدادها
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
