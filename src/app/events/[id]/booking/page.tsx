"use client";

import { useAppContext } from "@/context/AppContext";
import { useRouter, useParams } from "next/navigation";
import { EVENTS_DATA } from "@/lib/events-data"; // <--- Import داده‌های مشترک
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

export default function BookingPage() {
  const { state } = useAppContext();
  const router = useRouter();
  const params = useParams();

  // 1. دریافت ID از URL
  const eventId = params?.id as string;

  // 2. پیدا کردن ایونت مورد نظر از فایل دیتای مشترک
  // اگر پیدا نشد، اولی را به عنوان پیش‌فرض نشان بده (برای جلوگیری از کرش)
  const event = EVENTS_DATA.find((e) => e.id === eventId) || EVENTS_DATA[0];

  const isTestTaken = state.isTestTaken;

  const handleBookingAction = () => {
    if (!isTestTaken) {
      router.push("/test");
    } else {
      router.push(`/checkout?eventId=${event.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-20">
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

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-10 order-2 lg:order-1">
          {/* Header */}
          <div className="space-y-4">
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
              <img
                src={event.instructor.avatar}
                alt={event.instructor.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
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
          <div className="relative aspect-video rounded-[32px] overflow-hidden group shadow-2xl shadow-slate-200">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>

            <button className="absolute bottom-6 right-6 bg-white/90 backdrop-blur text-slate-900 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white transition shadow-lg">
              <ImageIcon size={16} />
              مشاهده گالری تصاویر
            </button>
          </div>

          {/* About Section */}
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-xl">
              <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
              <h2>درباره رویداد</h2>
            </div>
            <div className="prose prose-slate prose-lg max-w-none text-slate-500 text-sm md:text-base leading-8 text-justify">
              <p>
                این رویداد فرصتی عالی برای {event.title} است. ما در محیطی
                حرفه‌ای و دوستانه گرد هم می‌آییم. شرکت در این برنامه به شما کمک
                می‌کند تا {event.learnings[0]} را تجربه کنید و شبکه ارتباطی خود
                را گسترش دهید.
              </p>
              <p className="mt-4">
                تمام برنامه‌ریزی‌ها انجام شده تا شما بهترین تجربه را داشته
                باشید. ظرفیت محدود است و اولویت با کسانی است که زودتر ثبت‌نام
                کنند.
              </p>
            </div>
          </section>

          {/* Learnings Section */}
          <section className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg mb-6">
              چه دستاوردهایی خواهید داشت؟
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.learnings.map((item: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
                >
                  <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                  <span className="text-sm font-medium text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Schedule Section */}
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-8 text-slate-900 font-bold text-xl">
              <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
              <h2>برنامه زمان‌بندی</h2>
            </div>

            <div className="relative border-r-2 border-slate-100 mr-3 space-y-10">
              {event.schedule.map((item: any, idx: number) => (
                <div key={idx} className="relative pr-8 group">
                  <div className="absolute -right-[9px] top-1 w-4 h-4 rounded-full border-2 border-white bg-orange-200 group-hover:bg-orange-500 transition-colors shadow-sm"></div>

                  <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md mb-2 inline-block">
                    {item.time}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky Sidebar */}
        <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
          <div className="sticky top-24 space-y-6">
            {/* Price Card */}
            <div className="bg-white p-6 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-red-50 text-red-500 text-xs font-extrabold px-3 py-1.5 rounded-lg">
                  فقط {event.capacity} نفر باقی‌مانده
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-400 mb-1">
                    هزینه ثبت‌نام
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {event.price.toLocaleString("fa-IR")}{" "}
                    <span className="text-sm font-normal text-slate-500">
                      تومان
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Calendar size={18} />
                    <span>تاریخ</span>
                  </div>
                  <span className="font-bold text-slate-900 text-sm">
                    {event.date}
                  </span>
                </div>
                <div className="w-full h-px bg-slate-200"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Clock size={18} />
                    <span>ساعت</span>
                  </div>
                  <span className="font-bold text-slate-900 text-sm">
                    {event.time}
                  </span>
                </div>
              </div>

              {!isTestTaken ? (
                <div className="space-y-3">
                  <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex items-start gap-2">
                    <AlertCircle
                      className="text-orange-500 shrink-0 mt-0.5"
                      size={16}
                    />
                    <p className="text-xs text-orange-700 leading-5">
                      برای رزرو، ابتدا باید تست شخصیت‌شناسی را تکمیل کنید.
                    </p>
                  </div>
                  <button
                    onClick={handleBookingAction}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    شروع تست رایگان
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleBookingAction}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 transition-transform active:scale-95 flex items-center justify-center gap-2 text-lg"
                >
                  رزرو جایگاه
                  <ChevronLeft size={20} />
                </button>
              )}

              <p className="text-[10px] text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck size={12} />
                تضمین کیفیت برگزاری رویداد
              </p>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white p-4 rounded-[32px] shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4 px-2">
                <MapPin className="text-orange-500" size={20} />
                <span className="font-bold text-slate-900">محل برگزاری</span>
              </div>

              <div className="relative h-40 bg-slate-200 rounded-2xl overflow-hidden mb-3 border border-slate-100">
                <img
                  src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/w_2560%2Cc_limit/GoogleMapTA.jpg"
                  className="w-full h-full object-cover grayscale opacity-70"
                  alt="Map"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                    {event.city}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
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
