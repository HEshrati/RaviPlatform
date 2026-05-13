"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { getEventImage } from "@/lib/dynamic-images";
import {
  ArrowRight,
  Clock,
  MapPin,
  Users,
  Calendar,
  Tag,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const CATEGORIES: Record<string, { title: string; img: string; banner: string; color: string }> = {
  hamneshin:  { title: "همنشین",   img: "/categories/1.PNG", banner: "دورهمی امن و گرم با آدم‌های هم‌فرکانس",         color: "#FF6B00" },
  hamsohbat:  { title: "هم‌صحبت", img: "/categories/2.PNG", banner: "گفتگوهای عمیق و صمیمی با افراد هم‌فکر",          color: "#3B82F6" },
  hambazi:    { title: "هم‌بازی",  img: "/categories/3.PNG", banner: "یک شب هیجانی با بردگیم و بازی‌های گروهی",        color: "#10B981" },
  hampa:      { title: "هم‌پا",    img: "/categories/6.PNG", banner: "پیاده‌روی، گردش و تجربه در طبیعت",               color: "#8B5CF6" },
  hamamooz:   { title: "هم‌آموز", img: "/categories/5.PNG", banner: "یادگیری مهارت‌های جدید در کنار دیگران",          color: "#F59E0B" },
  hamkar:     { title: "همکار",    img: "/categories/4.PNG", banner: "همکاری در پروژه‌ها و کارهای مشترک",              color: "#EF4444" },
  hamfekr:    { title: "هم‌فکر",  img: "/categories/7.PNG", banner: "تبادل ایده و رویا با ذهن‌های خلاق",             color: "#EC4899" },
  hamteymi:   { title: "هم‌تیمی", img: "/categories/8.PNG", banner: "فعالیت‌های ورزشی و تیمی مشترک",                  color: "#14B8A6" },
  hamghesse:  { title: "هم‌قصه",  img: "/categories/1.PNG", banner: "خواندن و نوشتن و تجربه‌ی داستان",               color: "#A78BFA" },
};

const MOCK_EVENTS: Record<string, any[]> = {
  hamneshin: [
    { id: "ev-4",  title: "قرار صبحانه (میز منتخب)",          time: "۱۰:۰۰", date: "۱۴۰۳/۱۱/۲۴", location: "کافه آهنگ صبح، سعادت‌آباد", capacity: 6,  reserved: 6,  price: 120000, tags: ["صبحانه","کافه"] },
    { id: "ev-5",  title: "قرار صبحانه، جمعه ۲۴ بهمن",       time: "۱۰:۰۰", date: "۱۴۰۳/۱۱/۲۴", location: "کافه بامداد، نیاوران",       capacity: 8,  reserved: 8,  price: 120000, tags: ["صبحانه","آشنایی"] },
    { id: "ev-6",  title: "دورهمی همنشین آخر هفته",           time: "۱۸:۳۰", date: "۱۴۰۳/۱۱/۲۵", location: "خانه فرهنگ نیاوران",         capacity: 10, reserved: 5,  price: 90000,  tags: ["شب‌نشینی","دوستی"] },
  ],
  hambazi: [
    { id: "ev-1",  title: "دورهمی همبازی (بردگیم‌های گروهی)", time: "۱۵:۰۰", date: "۱۴۰۳/۱۱/۲۳", location: "کافه بازی جام جم",           capacity: 12, reserved: 12, price: 150000, tags: ["بردگیم","گروهی"] },
    { id: "ev-2",  title: "هم‌بازی ۲۴ بهمن (مافیا)",         time: "۱۷:۰۰", date: "۱۴۰۳/۱۱/۲۴", location: "کافه لیلا، ونک",              capacity: 14, reserved: 10, price: 80000,  tags: ["مافیا","کارآگاهی"] },
  ],
  hamsohbat: [
    { id: "ev-7",  title: "قهوه و گفتگو – آرامش در دنیای شلوغ", time: "۱۶:۰۰", date: "۱۴۰۳/۱۱/۲۵", location: "کافه فلسفه، انقلاب",    capacity: 8,  reserved: 3,  price: 60000,  tags: ["گفتگو","فلسفه"] },
  ],
  hampa: [
    { id: "ev-9",  title: "پیاده‌روی بامدادی توچال",           time: "۰۷:۰۰", date: "۱۴۰۳/۱۱/۲۴", location: "ایستگاه تله‌کابین توچال",  capacity: 15, reserved: 11, price: 40000,  tags: ["طبیعت","کوهنوردی"] },
  ],
  hamamooz: [
    { id: "ev-11", title: "کارگاه عکاسی موبایل",               time: "۱۴:۰۰", date: "۱۴۰۳/۱۱/۲۳", location: "استودیو عکس آفتاب، میرداماد", capacity: 8, reserved: 5, price: 180000, tags: ["عکاسی","کارگاه"] },
  ],
  hamkar: [
    { id: "ev-13", title: "روز کار اشتراکی (Co-working Day)",  time: "۱۰:۰۰", date: "۱۴۰۳/۱۱/۲۵", location: "فضای کار مشترک هاب",       capacity: 20, reserved: 12, price: 80000,  tags: ["کار","فریلنسر"] },
  ],
  hamfekr: [
    { id: "ev-14", title: "نشست ایده‌پردازی – استارتاپ",       time: "۱۸:۰۰", date: "۱۴۰۳/۱۱/۲۵", location: "خانه نوآوری، ولیعصر",      capacity: 16, reserved: 9,  price: 50000,  tags: ["استارتاپ","ایده"] },
  ],
  hamteymi: [
    { id: "ev-15", title: "فوتبال دوستانه، جمعه ۲۴ بهمن",     time: "۰۹:۰۰", date: "۱۴۰۳/۱۱/۲۴", location: "زمین چمن پارک لاله",        capacity: 14, reserved: 8,  price: 30000,  tags: ["فوتبال","ورزش"] },
  ],
  hamghesse: [
    { id: "ev-16", title: "حلقه داستان‌سرایی",                  time: "۱۸:۰۰", date: "۱۴۰۳/۱۱/۲۳", location: "خانه هنرمندان، لاله‌زار",   capacity: 12, reserved: 8,  price: 60000,  tags: ["داستان","هنر"] },
  ],
};

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

export default function CategoryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state } = useApp();
  const categoryId = params.id;
  const cat = CATEGORIES[categoryId];

  const [events, setEvents] = useState<any[]>(MOCK_EVENTS[categoryId] || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    const ctrl = new AbortController();
    const token = getToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const userCity = state.city || (typeof window !== "undefined" ? localStorage.getItem("city") : null) || "";
    const params = new URLSearchParams({ limit: "20", category: categoryId });
    if (userCity) params.set("city", userCity);

    fetch(`${API}/api/events?${params}`, { signal: ctrl.signal, headers })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (data?.events?.length > 0) {
          setEvents(data.events.map((e: any) => ({
            id: e.id,
            title: e.title,
            date: new Date(e.start_date || e.startDate).toLocaleDateString("fa-IR"),
            time: new Date(e.start_date || e.startDate).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
            location: e.location || "",
            city: e.city || "",
            capacity: e.capacity,
            reserved: e.reservedCount ?? e.current_bookings ?? 0,
            price: e.price,
            tags: e.tags || [],
          })));
        }
      })
      .catch(() => {})
      .finally(() => { setLoading(false); });

    return () => ctrl.abort();
  }, [categoryId, state.city]);

  if (!cat) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-white text-xl font-black mb-4">دسته‌بندی یافت نشد</p>
          <button onClick={() => router.push("/events")} className="text-orange-400 font-bold">بازگشت به همنشینی‌ها</button>
        </div>
      </div>
    );
  }

  const NAVY = "#1B2A4A";
  const NAVY_DARK = "#0d1e35";

  return (
    <div className="min-h-screen pb-28" dir="rtl">
      {/* هدر */}
      <div className="relative overflow-hidden" style={{ background: NAVY }}>
        <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent" />
        <div className="relative z-10 max-w-lg mx-auto px-4 pt-4 pb-6">
          <button
            onClick={() => router.push("/events")}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors text-sm"
          >
            <ArrowRight size={16} />
            بازگشت به همنشینی‌ها
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 flex-shrink-0">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-bold text-white/60 uppercase">دسته‌بندی</span>
              <h1 className="text-2xl font-black text-white">{cat.title}</h1>
              <p className="text-white/70 text-sm mt-0.5">{cat.banner}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.1)" }}>
              <p className="text-white font-black text-lg">{events.length}</p>
              <p className="text-white/60 text-xs">رویداد فعال</p>
            </div>
            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.1)" }}>
              <p className="text-white font-black text-lg">{events.reduce((s, e) => s + (e.capacity - e.reserved), 0)}</p>
              <p className="text-white/60 text-xs">جای خالی</p>
            </div>
            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.1)" }}>
              <p className="text-white font-black text-lg">{events.length > 0 ? Math.min(...events.map(e => e.price)).toLocaleString() : "—"}</p>
              <p className="text-white/60 text-xs">کمترین قیمت</p>
            </div>
          </div>
        </div>
      </div>

      {/* لیست رویدادها */}
      <div className="max-w-lg mx-auto px-4 pt-5">
        <h2 className="text-base font-black text-slate-900 mb-4">همنشینی‌های {cat.title}</h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="flex gap-2">
              {[300, 150, 0].map((d, i) => (
                <div key={i} className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: `-${d}ms` }} />
              ))}
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-slate-600 font-bold text-lg mb-1">رویدادی موجود نیست</p>
            <p className="text-slate-400 text-sm mb-6">به‌زودی رویدادهای جدید اضافه می‌شوند</p>
            <button
              onClick={() => router.push("/events")}
              className="bg-orange-500 text-white font-black px-6 py-2.5 rounded-xl text-sm"
            >
              بازگشت
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((ev) => {
              const full = ev.capacity <= (ev.reserved ?? 0);
              const remaining = ev.capacity - (ev.reserved ?? 0);

              return (
                <div key={ev.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  {/* تصویر */}
                  <div className="relative h-40" style={{ background: NAVY_DARK }}>
                    <img
                      src={getEventImage(categoryId, ev.id, ev.img)}
                      alt={ev.title}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {full && (
                      <div className="absolute top-3 right-3 bg-white/90 text-slate-700 text-[11px] font-black px-3 py-1 rounded-full">
                        تکمیل ظرفیت
                      </div>
                    )}

                    {ev.tags?.length > 0 && (
                      <div className="absolute top-3 left-3 flex gap-1">
                        {ev.tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: cat.color + "cc" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 left-28 text-white">
                      <h3 className="font-black text-sm leading-snug line-clamp-2 mb-1">{ev.title}</h3>
                      <div className="flex items-center gap-1 text-white/75">
                        <Clock size={10} />
                        <span className="text-[10px]">{ev.date} · {ev.time}</span>
                      </div>
                      {ev.location && (
                        <div className="flex items-center gap-1 text-white/60 mt-0.5">
                          <MapPin size={10} />
                          <span className="text-[10px] line-clamp-1">{ev.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute left-3 bottom-3 flex flex-col gap-1.5 items-end">
                      <Link href={`/events/${ev.id}`} className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-xl border border-white/30">
                        جزئیات
                      </Link>
                      {!full ? (
                        <Link href={`/events/${ev.id}/booking`} className="text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg" style={{ background: cat.color }}>
                          رزرو
                        </Link>
                      ) : (
                        <div className="bg-slate-800/60 text-white/60 text-[10px] font-bold px-3 py-2 rounded-xl">
                          تکمیل ظرفیت
                        </div>
                      )}
                    </div>
                  </div>

                  {/* پایین کارت */}
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Users size={13} className="text-slate-400" />
                        <span className="text-xs text-slate-500">{ev.reserved}/{ev.capacity} نفر</span>
                      </div>
                      {!full && remaining <= 4 && (
                        <span className="text-xs font-bold text-orange-500">⚡ {remaining} جای خالی!</span>
                      )}
                    </div>
                    <span className="text-sm font-black text-orange-500">
                      {ev.price > 0 ? ev.price.toLocaleString() + " ت" : "رایگان"}
                    </span>
                  </div>

                  {/* نوار ظرفیت */}
                  <div className="mx-4 mb-3 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.round((ev.reserved / ev.capacity) * 100)}%`, background: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
