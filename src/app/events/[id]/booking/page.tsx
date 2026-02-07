"use client";

import { useAppContext } from "@/context/AppContext";
import { useRouter, useParams } from "next/navigation";
import { EVENTS_DATA } from "@/lib/events-data";
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  MoreHorizontal,
  CheckCircle2,
  ImageIcon,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BookingPage() {
  const { state } = useAppContext();
  const router = useRouter();
  const params = useParams();

  const eventId = params?.id as string;
  const event = EVENTS_DATA.find((e) => e.id === eventId) || EVENTS_DATA[0];
  const isTestTaken = state.isTestTaken;

  const [imageError, setImageError] = useState(false);
  const [instructorImageError, setInstructorImageError] = useState(false);

  const handleBookingAction = () => {
    if (!isTestTaken) {
      router.push("/test");
    } else {
      router.push(`/checkout?eventId=${event.id}`);
    }
  };

  // تابع برای ساخت gradient بر اساس category
  const getCategoryGradient = (category: string) => {
    const gradients: { [key: string]: string } = {
      "رویداد اجتماعی": "from-blue-400 via-purple-400 to-purple-600",
      "کارگاه آموزشی": "from-green-400 via-teal-400 to-teal-600",
      "ورزشی و طبیعت‌گردی": "from-emerald-400 via-cyan-400 to-blue-600",
      "فرهنگی و هنری": "from-pink-400 via-rose-400 to-red-600",
      "کسب‌وکار و شبکه‌سازی": "from-orange-400 via-red-400 to-red-600",
      "هنر و سرگرمی": "from-amber-400 via-yellow-400 to-orange-600",
    };
    return gradients[category] || "from-slate-400 to-slate-600";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-20 overflow-x-hidden">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center text-xs md:text-sm text-slate-500 gap-2">
          <Link
            href="/"
            className="hover:text-slate-900 flex items-center gap-1"
          >
            <Home size={14} /> خانه
          </Link>
          <ChevronLeft size={14} />
          <Link href="/events" className="hover:text-slate-900">
            رویدادها
          </Link>
          <ChevronLeft size={14} />
          <span className="text-slate-900 font-bold truncate max-w-[150px] md:max-w-none">
            {event.title}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 relative">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6 md:space-y-10 order-2 lg:order-1">
          {/* Header - نمایش در موبایل */}
          <div className="space-y-4 lg:hidden">
            <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {event.category}
              </span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full flex items-center gap-1">
                <MapPin size={12} /> {event.city}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              {event.title}
            </h1>

            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              {event.subtitle}
            </p>

            {/* Instructor */}
            <div className="flex items-center gap-3 md:gap-4 pt-2">
              {!instructorImageError ? (
                <img
                  src={event.instructor.avatar}
                  alt={event.instructor.name}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover border border-slate-200"
                  onError={() => setInstructorImageError(true)}
                />
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-orange-300 to-orange-500 border border-slate-200 flex items-center justify-center text-white font-bold text-lg">
                  {event.instructor.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-xs text-slate-400 mb-0.5">
                  مدرس / میزبان
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {event.instructor.name}
                </div>
                <div className="text-[10px] text-orange-500 font-medium">
                  {event.instructor.role}
                </div>
              </div>
            </div>
          </div>

          {/* Header - نمایش در دسکتاپ */}
          <div className="space-y-4 hidden lg:block">
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {event.category}
              </span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full flex items-center gap-1">
                <MapPin size={12} /> {event.city}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              {event.title}
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
              {event.subtitle}
            </p>

            {/* Instructor */}
            <div className="flex items-center gap-4 pt-2">
              {!instructorImageError ? (
                <img
                  src={event.instructor.avatar}
                  alt={event.instructor.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  onError={() => setInstructorImageError(true)}
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-300 to-orange-500 border border-slate-200 flex items-center justify-center text-white font-bold text-xl">
                  {event.instructor.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-xs text-slate-400 mb-0.5">
                  مدرس / میزبان
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {event.instructor.name}
                </div>
                <div className="text-[10px] text-orange-500 font-medium">
                  {event.instructor.role}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-video rounded-2xl md:rounded-[32px] overflow-hidden group shadow-2xl shadow-slate-200">
            {!imageError ? (
              <>
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={() => setImageError(true)}
                  loading="eager"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
              </>
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(
                  event.category,
                )} flex items-center justify-center`}
              >
                <div className="text-center text-white p-8">
                  <div className="text-6xl mb-4">
                    {event.category.includes("اجتماعی")
                      ? "🤝"
                      : event.category.includes("آموزشی")
                        ? "📚"
                        : event.category.includes("ورزشی")
                          ? "⛰️"
                          : event.category.includes("فرهنگی")
                            ? "📖"
                            : event.category.includes("کسب‌وکار")
                              ? "💼"
                              : "🎨"}
                  </div>
                  <h3 className="text-2xl font-bold">{event.title}</h3>
                </div>
              </div>
            )}

            <button className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white/90 backdrop-blur text-slate-900 px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-white transition shadow-lg">
              <ImageIcon size={14} className="md:w-4 md:h-4" />
              <span className="hidden sm:inline">مشاهده گالری تصاویر</span>
              <span className="sm:hidden">گالری</span>
            </button>
          </div>

          {/* About Section */}
          <section className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 md:mb-6 text-slate-900 font-bold text-base md:text-xl">
              <div className="w-1 h-5 md:h-6 bg-orange-500 rounded-full"></div>
              <h2>درباره رویداد</h2>
            </div>
            <div className="prose prose-slate prose-sm md:prose-lg max-w-none text-slate-500 text-xs md:text-base leading-6 md:leading-8 text-justify">
              <p>
                این رویداد فرصتی عالی برای {event.title} است. ما در محیطی
                حرفه‌ای و دوستانه گرد هم می‌آییم. شرکت در این برنامه به شما کمک
                می‌کند تا {event.learnings[0]} را تجربه کنید و شبکه ارتباطی خود
                را گسترش دهید.
              </p>
              <p className="mt-3 md:mt-4">
                تمام برنامه‌ریزی‌ها انجام شده تا شما بهترین تجربه را داشته
                باشید. ظرفیت محدود است و اولویت با کسانی است که زودتر ثبت‌نام
                کنند.
              </p>
            </div>
          </section>

          {/* Learnings Section */}
          <section className="bg-slate-50 p-5 md:p-8 rounded-2xl md:rounded-[32px] border border-slate-100">
            <h3 className="font-bold text-slate-900 text-base md:text-lg mb-4 md:mb-6">
              چه دستاوردهایی خواهید داشت؟
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {event.learnings.map((item: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 md:gap-3 bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm"
                >
                  <CheckCircle2 className="text-green-500 shrink-0 w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm font-medium text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Schedule Section */}
          <section className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6 md:mb-8 text-slate-900 font-bold text-base md:text-xl">
              <div className="w-1 h-5 md:h-6 bg-orange-500 rounded-full"></div>
              <h2>برنامه زمان‌بندی</h2>
            </div>

            <div className="relative border-r-2 border-slate-100 mr-2 md:mr-3 space-y-6 md:space-y-10">
              {event.schedule.map((item: any, idx: number) => (
                <div key={idx} className="relative pr-6 md:pr-8 group">
                  <div className="absolute -right-[7px] md:-right-[9px] top-1 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white bg-orange-200 group-hover:bg-orange-500 transition-colors shadow-sm"></div>

                  <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md mb-2 inline-block">
                    {item.time}
                  </span>
                  <h4 className="text-sm md:text-lg font-bold text-slate-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky Sidebar */}
        <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Price Card */}
            <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex justify-between items-start mb-4 md:mb-6 flex-col md:flex-row gap-3 md:gap-0">
                <div className="bg-red-50 text-red-500 text-xs font-extrabold px-3 py-1.5 rounded-lg">
                  فقط {event.capacity} نفر باقی‌مانده
                </div>
                <div className="md:text-left">
                  <div className="text-xs text-slate-400 mb-1">
                    هزینه ثبت‌نام
                  </div>
                  <div className="text-xl md:text-2xl font-black text-slate-900">
                    {event.price.toLocaleString("fa-IR")}{" "}
                    <span className="text-sm font-normal text-slate-500">
                      تومان
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-xs md:text-sm">
                    <Calendar size={16} className="md:w-[18px] md:h-[18px]" />
                    <span>تاریخ</span>
                  </div>
                  <span className="font-bold text-slate-900 text-xs md:text-sm">
                    {event.date}
                  </span>
                </div>
                <div className="w-full h-px bg-slate-200"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-xs md:text-sm">
                    <Clock size={16} className="md:w-[18px] md:h-[18px]" />
                    <span>ساعت</span>
                  </div>
                  <span className="font-bold text-slate-900 text-xs md:text-sm">
                    {event.time}
                  </span>
                </div>
                <div className="w-full h-px bg-slate-200"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-xs md:text-sm">
                    <MapPin size={16} className="md:w-[18px] md:h-[18px]" />
                    <span>محل</span>
                  </div>
                  <span className="font-bold text-slate-900 text-xs md:text-sm">
                    {event.city}
                  </span>
                </div>
              </div>

              {!isTestTaken ? (
                <div className="space-y-3">
                  <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex items-start gap-2">
                    <AlertCircle className="text-orange-500 shrink-0 mt-0.5 w-4 h-4" />
                    <p className="text-xs text-orange-700 leading-5">
                      برای رزرو، ابتدا باید تست شخصیت‌شناسی را تکمیل کنید.
                    </p>
                  </div>
                  <button
                    onClick={handleBookingAction}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 md:py-4 rounded-xl text-sm md:text-base shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    شروع تست رایگان
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleBookingAction}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 md:py-4 rounded-xl shadow-lg shadow-orange-200 transition-transform active:scale-95 flex items-center justify-center gap-2 text-base md:text-lg"
                >
                  رزرو جایگاه
                  <ChevronLeft size={18} className="md:w-5 md:h-5" />
                </button>
              )}

              <p className="text-[10px] text-center text-slate-400 mt-3 md:mt-4 flex items-center justify-center gap-1">
                <ShieldCheck size={12} />
                تضمین کیفیت برگزاری رویداد
              </p>
            </div>

            {/* Map Placeholder - فقط در دسکتاپ */}
            <div className="hidden lg:block bg-white p-4 rounded-[32px] shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4 px-2">
                <MapPin className="text-orange-500" size={20} />
                <span className="font-bold text-slate-900">محل برگزاری</span>
              </div>

              <div className="relative h-40 bg-slate-200 rounded-2xl overflow-hidden mb-3 border border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                  alt={`نقشه ${event.city}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&q=80";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                    📍 {event.city}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center gap-4">
              <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-xs font-bold transition">
                <Share2 size={16} /> اشتراک‌گذاری
              </button>
              <span className="text-slate-300">|</span>
              <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-xs font-bold transition">
                <MoreHorizontal size={16} /> سایر
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
