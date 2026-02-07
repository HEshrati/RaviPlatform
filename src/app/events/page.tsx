"use client";

import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import { MapPin, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { EVENTS_DATA } from "@/lib/events-data";
import { useState } from "react";

export default function EventsPage() {
  const { state } = useAppContext();
  const { userCity } = state;
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {},
  );

  // فیلتر کردن رویدادها بر اساس شهر کاربر (اگر شهر ست شده باشد)
  const filteredEvents = userCity
    ? EVENTS_DATA.filter((e) => e.city === userCity)
    : EVENTS_DATA;

  // اگر نتیجه فیلتر خالی بود، کل رویدادها را نشان بده (Fallback)
  const eventsToShow = filteredEvents.length > 0 ? filteredEvents : EVENTS_DATA;

  const handleImageError = (eventId: string) => {
    setImageErrors((prev) => ({ ...prev, [eventId]: true }));
  };

  // تابع برای ساخت gradient بر اساس category
  const getCategoryGradient = (category: string) => {
    const gradients: { [key: string]: string } = {
      "رویداد اجتماعی": "from-blue-400 to-purple-500",
      "کارگاه آموزشی": "from-green-400 to-teal-500",
      "ورزشی و طبیعت‌گردی": "from-emerald-400 to-cyan-500",
      "فرهنگی و هنری": "from-pink-400 to-rose-500",
      "کسب‌وکار و شبکه‌سازی": "from-orange-400 to-red-500",
      "هنر و سرگرمی": "from-amber-400 to-yellow-500",
    };
    return gradients[category] || "from-slate-400 to-slate-600";
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6 font-sans pb-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/"
                className="bg-white p-2 rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 transition"
              >
                <ArrowRight size={20} />
              </Link>
              <span className="text-sm font-bold text-slate-400">بازگشت</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">
              رویدادهای پیش‌رو
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              {userCity
                ? `نمایش رویدادهای شهر: ${userCity}`
                : "نمایش تمام رویدادها"}
            </p>
          </div>

          <Link
            href="/dashboard/complete-profile"
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-100 transition shadow-sm"
          >
            {userCity ? `تغییر شهر (${userCity})` : "انتخاب شهر سکونت"}
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsToShow.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col group"
            >
              {/* Image */}
              <div className="h-56 bg-slate-200 relative overflow-hidden">
                {!imageErrors[event.id] ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={() => handleImageError(event.id)}
                    loading="lazy"
                  />
                ) : (
                  // Fallback gradient
                  <div
                    className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(
                      event.category,
                    )} flex items-center justify-center`}
                  >
                    <div className="text-center text-white p-6">
                      <div className="text-4xl mb-2">
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
                      <h4 className="text-sm font-bold">{event.category}</h4>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="bg-white/95 backdrop-blur text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                    <MapPin size={12} className="text-orange-500" />
                    {event.city}
                  </span>
                </div>
                {/* Price Badge on Image */}
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold">
                  {event.price.toLocaleString("fa-IR")} تومان
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="text-[10px] font-bold text-orange-600 bg-orange-50 w-fit px-2 py-1 rounded-md mb-3">
                  {event.category}
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-3 leading-snug line-clamp-2">
                  {event.title}
                </h3>

                <div className="flex items-center text-slate-500 text-xs mb-6 gap-3 mt-auto pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{event.date}</span>
                  </div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">ظرفیت:</span>
                    <span className="text-slate-900 font-bold">
                      {event.capacity} نفر
                    </span>
                  </div>
                </div>

                <Link
                  href={`/events/${event.id}/booking`}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-700 transition shadow-lg shadow-slate-200"
                >
                  مشاهده و رزرو <ArrowLeft size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {eventsToShow.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              هیچ رویدادی یافت نشد
            </h3>
            <p className="text-slate-500 mb-6">
              در حال حاضر رویدادی در این شهر برگزار نمی‌شود
            </p>
            <Link
              href="/dashboard/complete-profile"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition"
            >
              تغییر شهر
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
