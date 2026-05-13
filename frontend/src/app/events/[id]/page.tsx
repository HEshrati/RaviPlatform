"use client";


import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, Users, Calendar, Tag, ChevronLeft, Lock, UserPlus } from "lucide-react";
import { getEventImage, getEventImageFallback } from "@/lib/dynamic-images";
import { useApp } from "@/context/AppContext";
import { fetchPlusOneCandidates, reserveEvent, PlusOneCandidate } from "@/lib/api";

const MOCK_EVENTS_MAP: Record<string, any> = {
  "ev-1": {
    id: "ev-1", category: "hambazi", categoryLabel: "هم‌بازی",
    title: "دورهمی همبازی (بردگیم‌های گروهی)، پنجشنبه ۲۳ بهمن",
    description: "یک شب هیجانی و گرم با دوستان جدید در دنیای بردگیم‌های استراتژیک. این دورهمی برای کسانی است که عاشق بازی‌های فکری گروهی هستند و دوست دارند با آدم‌های جدید آشنا شوند.",
    date: "۱۴۰۳/۱۱/۲۳", time: "۱۵:۰۰", weekday: "پنج‌شنبه",
    location: "کافه بازی جام جم، خیابان جام جم، تهران",
    capacity: 12, reserved: 12, price: 150000,
    tags: ["بردگیم", "گروهی", "شب‌نشینی"],
    isFull: true,
    whatToExpect: ["آشنایی با آدم‌های جدید", "بازی Catan و Ticket to Ride", "پذیرایی شب‌نشینی", "۲ ساعت بازی گروهی"],
    host: { name: "گروه همنشین‌های تهران", events: 47 },
  },
  "ev-2": {
    id: "ev-2", category: "hambazi", categoryLabel: "هم‌بازی",
    title: "هم‌بازی ۲۴ بهمن (مافیا)",
    description: "بازی مافیا در یک محیط صمیمی و پرانرژی. این رویداد برای کسانی است که دوست دارند یک شب هیجانی با غریبه‌های جدید داشته باشند.",
    date: "۱۴۰۳/۱۱/۲۴", time: "۱۷:۰۰", weekday: "جمعه",
    location: "کافه لیلا، ونک، تهران",
    capacity: 14, reserved: 10, price: 80000,
    tags: ["مافیا", "کارآگاهی", "شبانه"],
    isFull: false,
    whatToExpect: ["آموزش قوانین مافیا به تازه‌کارها", "۳ دور بازی", "رتبه‌بندی نهایی", "شام مختصر"],
    host: { name: "کلوب بازی‌های فکری", events: 23 },
  },
  "ev-3": {
    id: "ev-3", category: "hambazi", categoryLabel: "هم‌بازی",
    title: "دورهمی هم‌بازی (اتاق فرار)، جمعه ۲۴ بهمن",
    description: "چالش اتاق فرار به صورت تیمی — یک تجربه هیجانی که همکاری گروهی را آزمایش می‌کند.",
    date: "۱۴۰۳/۱۱/۲۴", time: "۱۷:۱۵", weekday: "جمعه",
    location: "اتاق فرار ایران، جردن، تهران",
    capacity: 10, reserved: 7, price: 200000,
    tags: ["اتاق فرار", "تیمی", "هیجان"],
    isFull: false,
    whatToExpect: ["جلسه آشنایی ۱۵ دقیقه‌ای", "۱ ساعت اتاق فرار", "عکس یادگاری", "شربت خوشامدگویی"],
    host: { name: "آتش اسکیپ", events: 91 },
  },
  "ev-4": {
    id: "ev-4", category: "hamneshin", categoryLabel: "همنشین",
    title: "قرار صبحانه (میز منتخب)",
    description: "صبحانه‌ی دنج در کافه‌ای زیبا با افراد هم‌فرکانس.",
    date: "۱۴۰۳/۱۱/۲۴", time: "۱۰:۰۰", weekday: "جمعه",
    location: "کافه آهنگ صبح، سعادت‌آباد، تهران",
    capacity: 6, reserved: 6, price: 120000,
    tags: ["صبحانه", "کافه", "گفتگو"],
    isFull: true,
    whatToExpect: ["صبحانه اروپایی کامل", "آشنایی با ۵ نفر جدید", "گفتگوی آزاد ۱.۵ ساعته"],
    host: { name: "جمعه‌های همنشین", events: 34 },
  },
};

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state } = useApp();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [plusOneOpen, setPlusOneOpen] = useState(false);
  const [plusOneUsers, setPlusOneUsers] = useState<PlusOneCandidate[]>([]);
  const [plusOneUserId, setPlusOneUserId] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (MOCK_EVENTS_MAP[params.id]) {
      setEvent(MOCK_EVENTS_MAP[params.id]);
      setLoading(false);
      return;
    }

    const ctrl = new AbortController();
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/events/${params.id}`,
      { signal: ctrl.signal }
    )
      .then((r) => r.json())
      .then((data) => {
        setEvent({
          ...data,
          isFull: data.capacity - (data.reservedCount ?? data.current_bookings ?? 0) <= 0,
          categoryLabel: data.category || "همنشینی",
          // تصویر داینامیک بر اساس category
          img: getEventImage(data.category, data.id, data.image_url),
          whatToExpect: [],
          host: { name: "برگزارکننده", events: 0 },
        });
      })
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [params.id]);

  const loadPlusOneUsers = async () => {
    setPlusOneOpen((v) => !v);
    if (plusOneUsers.length || !params.id) return;
    try {
      const data = await fetchPlusOneCandidates(params.id);
      setPlusOneUsers(data.users || []);
    } catch {
      setPlusOneUsers([]);
    }
  };

  const handleReserve = async () => {
    if (!state.isLoggedIn) { router.push("/login"); return; }
    setBookingLoading(true);
    try {
      const res = await reserveEvent(event.id, plusOneUserId ? 2 : 1, plusOneUserId || undefined);
      if (res?.paymentUrl) window.location.href = res.paymentUrl;
      else router.push("/dashboard");
    } catch (err: any) {
      alert(err?.message || "خطا در ثبت رزرو");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" dir="rtl">
        <div className="flex gap-2">
          {[300, 150, 0].map((d, i) => (
            <div key={i} className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: `-${d}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white pb-28" dir="rtl">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-slate-700 font-black text-lg mb-2">رویداد یافت نشد</p>
        <p className="text-slate-400 text-sm mb-6">این رویداد حذف شده یا موجود نیست</p>
        <Link href="/events" className="bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl">
          بازگشت به رزرو
        </Link>
      </div>
    );
  }

  const remaining = event.capacity - (event.reserved ?? event.reservedCount ?? 0);
  const progress = Math.min(100, Math.round(((event.reserved ?? event.reservedCount ?? 0) / event.capacity) * 100));

  // تصویر داینامیک - اگر /categories/ باشد از unsplash بگیر
  const eventImage = getEventImage(event.category, event.id, event.img);

  // لوکیشن: در صفحه عمومی کل آدرس نشان داده می‌شود
  // (مخفی‌سازی واقعی فقط در داشبورد انجام می‌شه)
  const showFullLocation = true; // در صفحه عمومی آدرس کلی نشون داده میشه

  return (
    <div className="min-h-screen bg-white pb-28" dir="rtl">

      {/* هدر تصویر - داینامیک */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={eventImage}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = getEventImageFallback(event.category);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full border border-white/30"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="absolute bottom-4 right-4 left-4 text-white">
          <span className="inline-block bg-orange-500 text-[10px] font-black px-2.5 py-1 rounded-full mb-2">
            {event.categoryLabel}
          </span>
          <h1 className="font-black text-lg leading-snug">{event.title}</h1>
        </div>

        {event.isFull && (
          <div className="absolute top-4 left-4 bg-white/90 text-slate-700 text-xs font-black px-3 py-1.5 rounded-full shadow">
            تکمیل ظرفیت
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5">

        {/* اطلاعات سریع */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-50 rounded-2xl p-3 flex items-start gap-2.5">
            <Calendar size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-medium">تاریخ</p>
              <p className="text-sm font-black text-slate-900">{event.weekday}، {event.date}</p>
              <p className="text-xs text-slate-500">ساعت {event.time}</p>
            </div>
          </div>

          {/* مکان: فقط شهر به صورت عمومی */}
          <div className="bg-slate-50 rounded-2xl p-3 flex items-start gap-2.5">
            <MapPin size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-medium">شهر</p>
              <p className="text-sm font-black text-slate-900 line-clamp-2">
                {event.city || (event.location ? event.location.split('،').pop()?.trim() || event.location : 'تهران')}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3 flex items-start gap-2.5">
            <Users size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-medium">ظرفیت</p>
              <p className="text-sm font-black text-slate-900">
                {event.isFull ? "تکمیل شده" : `${remaining} از ${event.capacity} نفر`}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3 flex items-start gap-2.5">
            <Tag size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-medium">هزینه</p>
              <p className="text-sm font-black text-slate-900">
                {Number(event.price).toLocaleString("fa-IR")} تومان
              </p>
            </div>
          </div>
        </div>

        {/* نکته لوکیشن برای رزرو‌کنندگان */}
        <div className="mb-5 p-3 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-2.5">
          <Lock size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-orange-700">
            آدرس دقیق محل برگزاری، ۱۰ ساعت قبل از شروع فقط در داشبورد کاربرانی که رزرو کرده‌اند نمایش داده می‌شود.
          </p>
        </div>

        {/* نوار ظرفیت */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500 font-medium">پیشرفت ظرفیت</span>
            <span className={`font-bold ${progress >= 80 ? "text-orange-500" : "text-slate-600"}`}>{progress}٪</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${progress >= 90 ? "bg-red-500" : "bg-orange-500"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {!event.isFull && remaining <= 4 && (
            <p className="text-xs text-orange-600 font-bold mt-1">⚡ فقط {remaining} جای خالی باقی مانده!</p>
          )}
        </div>

        {/* توضیحات */}
        <div className="mb-6">
          <h2 className="font-black text-slate-900 mb-2">درباره این همنشینی</h2>
          <p className="text-sm text-slate-600 leading-7">{event.description}</p>
        </div>

        {/* چی انتظار داری */}
        {event.whatToExpect?.length > 0 && (
          <div className="mb-6">
            <h2 className="font-black text-slate-900 mb-3">چه تجربه‌ای خواهی داشت؟</h2>
            <div className="flex flex-col gap-2">
              {event.whatToExpect.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* تگ‌ها */}
        {event.tags?.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {event.tags.map((tag: string) => (
              <span key={tag} className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-200">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* برگزارکننده */}
        {state.isLoggedIn && (
          <div className="mb-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <button onClick={loadPlusOneUsers} className="w-full flex items-center justify-between text-right">
              <span className="flex items-center gap-2 font-black text-slate-900"><UserPlus size={18} className="text-orange-500" /> انتخاب همراه Plus One</span>
              <span className="text-xs text-orange-500 font-bold">اختیاری</span>
            </button>
            {plusOneOpen && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-500 leading-6">اگر پروفایل شما کامل باشد، می‌توانید یک کاربر با پروفایل کامل را برای همین رویداد ثبت‌نام کنید.</p>
                <select value={plusOneUserId} onChange={(e) => setPlusOneUserId(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none">
                  <option value="">بدون همراه</option>
                  {plusOneUsers.map((u) => <option key={u.id} value={u.id}>{u.name || u.mobileNumber || "کاربر راوی"} {u.city ? `- ${u.city}` : ""}</option>)}
                </select>
                {plusOneUsers.length === 0 && <p className="text-xs text-slate-400">کاربر واجد شرایطی برای همراه پیدا نشد.</p>}
              </div>
            )}
          </div>
        )}

        {event.host && (
          <div className="mb-8 bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
              🌟
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-400">برگزارکننده</p>
              <p className="font-black text-slate-900 text-sm">{event.host.name}</p>
              <p className="text-xs text-slate-500">{event.host.events} همنشینی برگزار شده</p>
            </div>
          </div>
        )}
      </div>

      {/* دکمه ثابت پایین */}
      <div className="fixed bottom-[68px] left-0 right-0 z-40 bg-white border-t border-slate-100 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div>
            <p className="text-[10px] text-slate-400">هزینه</p>
            <p className="text-sm font-black text-slate-900">
              {Number(event.price).toLocaleString("fa-IR")} <span className="text-xs font-medium text-slate-500">تومان</span>
            </p>
          </div>
          {event.isFull ? (
            <div className="flex-1 bg-slate-200 text-slate-500 text-sm font-black py-3.5 rounded-2xl text-center">
              تکمیل ظرفیت
            </div>
          ) : (
            <button
              onClick={handleReserve}
              disabled={bookingLoading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60 text-white text-sm font-black py-3.5 rounded-2xl text-center shadow-lg shadow-orange-500/30 transition-all"
            >
              {bookingLoading ? "در حال ثبت..." : state.isLoggedIn ? (plusOneUserId ? "رزرو با Plus One" : "رزرو این همنشینی") : "ورود برای رزرو"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
