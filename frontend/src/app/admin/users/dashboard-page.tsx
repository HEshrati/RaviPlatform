"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  fetchMyBookings, fetchEventLocation, fetchEventById,
  isAdminPhone, Booking, ApiEvent,
} from "@/lib/api";
import {
  MapPin, Clock, Lock, Calendar, ChevronLeft,
  AlertCircle, Sparkles, Home, BarChart2, Gamepad2,
  TrendingUp, Star, CheckCircle2, Brain, ShieldAlert
} from "lucide-react";
import SmartProfileCard from "@/components/SmartProfileCard";
import SuspendedBanner from "@/components/SuspendedBanner";

interface BookingWithEvent extends Booking {
  eventData?: ApiEvent;
  locationInfo?: { location: string | null; revealed: boolean; minutesRemaining: number };
}

const toPersian = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

const fmtMins = (mins: number) => {
  if (mins <= 0) return "هم‌اکنون";
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? `${toPersian(h)}h ${toPersian(m)}m` : `${toPersian(m)} دقیقه`;
};

function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
      }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "rgba(255,107,0,0.4)" }} />
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-black text-white">{value}</span>
        <div className="text-orange-400">{icon}</div>
      </div>
      <p className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>{label}</p>
    </div>
  );
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function DashboardPage() {
  const { state } = useApp();
  const [bookings, setBookings] = useState<BookingWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuspended, setIsSuspended] = useState(false);
  const isAdmin = isAdminPhone(state.user?.mobileNumber);

  useEffect(() => {
    if (!state.isLoggedIn) { setLoading(false); return; }

    // بررسی وضعیت تعلیق
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/api/intelligence/my-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => setIsSuspended(data?.is_suspended || false))
        .catch(() => {});
    }

    (async () => {
      try {
        const raw = await fetchMyBookings();
        const active = raw.filter((b) => b.status !== "cancelled");
        const enriched = await Promise.all(
          active.map(async (b) => {
            try {
              const eventId = b.eventId || b.event_id || "";
              const [eventData, locationInfo] = await Promise.all([
                fetchEventById(eventId).catch(() => undefined),
                fetchEventLocation(eventId).catch(() => undefined),
              ]);
              return { ...b, eventData, locationInfo } as BookingWithEvent;
            } catch { return b as BookingWithEvent; }
          })
        );
        setBookings(enriched);
      } catch { setBookings([]); }
      finally { setLoading(false); }
    })();
  }, [state.isLoggedIn]);

  if (!state.isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-4" dir="rtl">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ background: "rgba(255,107,0,0.15)", border: "1px solid rgba(255,107,0,0.3)" }}>
          <Home size={36} className="text-orange-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black text-white mb-2">به راوی خوش آمدید</h2>
          <p className="text-slate-400 text-sm">برای مشاهده داشبورد وارد شوید</p>
        </div>
        <Link href="/login"
          className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-lg shadow-orange-500/20">
          ورود / ثبت‌نام
        </Link>
      </div>
    );
  }

  const upcomingBookings = bookings.filter((b) => {
    const eventDate = b.eventData?.start_date || b.start_date;
    return eventDate && new Date(eventDate) > new Date();
  });
  const pastBookings = bookings.filter((b) => {
    const eventDate = b.eventData?.start_date || b.start_date;
    return eventDate && new Date(eventDate) <= new Date();
  });

  return (
    <div className="max-w-lg mx-auto pb-28 space-y-5 px-2" dir="rtl">

      {/* بنر تعلیق */}
      {isSuspended && (
        <SuspendedBanner className="relative" />
      )}

      {/* سلام */}
      <div className="rounded-3xl p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FF6B00 0%, #c2410c 100%)",
          boxShadow: "0 12px 40px rgba(255,107,0,0.3)",
        }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">خوش آمدی،</p>
            <h1 className="text-2xl font-black text-white mt-0.5">
              {state.user?.name || "دوست راوی"} 👋
            </h1>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 mt-2 text-[11px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                <Star size={10} />
                ادمین
              </span>
            )}
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
            <span className="text-3xl font-black text-white">
              {(state.user?.name || "R").charAt(0)}
            </span>
          </div>
        </div>
      </div>

      {/* آمار */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          value={toPersian(bookings.length)}
          label="کل رزروها"
          icon={<Calendar size={18} />}
        />
        <StatCard
          value={toPersian(upcomingBookings.length)}
          label="همنشینی پیش‌رو"
          icon={<TrendingUp size={18} />}
        />
        <StatCard
          value={toPersian(pastBookings.length)}
          label="شرکت کرده"
          icon={<CheckCircle2 size={18} />}
        />
      </div>

      {/* دسترسی سریع ادمین */}
      {isAdmin && (
        <div className="rounded-2xl p-4"
          style={{
            background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)",
            border: "1px solid rgba(255,107,0,0.2)",
          }}>
          <p className="text-xs font-black text-orange-400 mb-3 flex items-center gap-1">
            <Star size={12} /> پنل ادمین
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: "/admin/smart-dashboard", icon: <Brain size={14} />, label: "داشبورد هوشمند" },
              { href: "/admin/matching", icon: <Sparkles size={14} />, label: "مچینگ" },
              { href: "/admin/content", icon: <BarChart2 size={14} />, label: "محتوا" },
              { href: "/admin/users", icon: <TrendingUp size={14} />, label: "کاربران" },
            ].map(({ href, icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-white transition hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="text-orange-400">{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* پروفایل هوشمند */}
      {!isSuspended && (
        <SmartProfileCard />
      )}

      {/* همنشینی‌های پیش‌رو */}
      <div>
        <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-orange-400" />
          همنشینی‌های پیش‌رو
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : upcomingBookings.length === 0 ? (
          <div className="rounded-2xl p-6 text-center"
            style={{ background: "linear-gradient(145deg, #1B2A4A, #132038)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <Calendar size={32} className="text-slate-600 mx-auto mb-3" />
            <p className="text-white font-bold text-sm">هنوز همنشینی پیش‌رویی نداری</p>
            <p className="text-slate-500 text-xs mt-1">برو یه دورهمی رزرو کن!</p>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 mt-4 bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
            >
              <Sparkles size={12} />
              مشاهده رویدادها
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((b) => {
              const event = b.eventData;
              const title = event?.title || b.eventTitle || `رویداد ${b.eventId?.slice(-4) || ""}`;
              const eventDate = event?.start_date || b.start_date;
              const location = b.locationInfo?.location;
              const revealed = b.locationInfo?.revealed;
              const minsRemaining = b.locationInfo?.minutesRemaining || 0;

              return (
                <div
                  key={b.id}
                  className="rounded-2xl p-4"
                  style={{ background: "linear-gradient(145deg, #1B2A4A, #132038)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-white text-sm truncate">{title}</h3>

                      {eventDate && (
                        <p className="text-[11px] mt-1 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                          <Clock size={10} />
                          {new Date(eventDate).toLocaleDateString("fa-IR", {
                            weekday: "short", month: "long", day: "numeric",
                          })}
                          {" · "}
                          {new Date(eventDate).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}

                      {/* وضعیت مکان */}
                      <div className="mt-2">
                        {revealed && location ? (
                          <p className="text-[11px] flex items-center gap-1 text-green-400 font-bold">
                            <MapPin size={10} />
                            {location}
                          </p>
                        ) : (
                          <p className="text-[11px] flex items-center gap-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                            <Lock size={10} />
                            {minsRemaining > 0
                              ? `آدرس تا ${fmtMins(minsRemaining)} دیگر نمایش داده می‌شود`
                              : "آدرس ۲۴ ساعت قبل اعلام می‌شود"}
                          </p>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/events/${b.eventId || b.event_id}`}
                      className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition hover:bg-white/10"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <ChevronLeft size={16} className="text-orange-400" />
                    </Link>
                  </div>

                  {b.status === "confirmed" && (
                    <div className="mt-2 flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-green-400" />
                      <span className="text-[10px] text-green-400 font-bold">تأیید شده</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* دسترسی سریع */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { href: "/events", icon: <Sparkles size={18} />, label: "رویدادها" },
          { href: "/articles", icon: <BarChart2 size={18} />, label: "مقالات" },
          { href: "/support", icon: <AlertCircle size={18} />, label: "پشتیبانی" },
        ].map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition hover:bg-white/10"
            style={{ background: "linear-gradient(145deg, #1B2A4A, #132038)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <span className="text-orange-400">{icon}</span>
            <span className="text-xs font-bold text-white">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
