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
  TrendingUp, Star, ArrowUpRight, CheckCircle2
} from "lucide-react";

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

// Stat card component
function StatCard({ value, label, color, icon }: { value: string; label: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-4 border border-white/8 relative overflow-hidden"
      style={{ background: "rgba(255,255,255,0.04)" }}>
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${color}`} />
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-black text-white">{value}</span>
        <div className="text-slate-500">{icon}</div>
      </div>
      <p className="text-[11px] text-slate-500 font-medium">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { state } = useApp();
  const [bookings, setBookings] = useState<BookingWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = isAdminPhone(state.user?.mobileNumber);

  useEffect(() => {
    if (!state.isLoggedIn) { setLoading(false); return; }
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
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="rounded-3xl p-8 text-center max-w-sm w-full border border-white/10"
          style={{ background: "rgba(15,23,42,0.9)" }}>
          <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-orange-400" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">ورود لازم است</h2>
          <p className="text-slate-400 mb-6 text-sm">برای مشاهده داشبورد وارد شوید.</p>
          <Link href="/login"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-400 transition w-full text-center shadow-lg shadow-orange-500/30">
            ورود به حساب
          </Link>
        </div>
      </div>
    );
  }

  const paidCount = bookings.filter(b => b.payment_status === "paid").length;
  const revealedCount = bookings.filter(b => b.locationInfo?.revealed).length;

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8">

      {/* ── Welcome Hero ── */}
      <div className="rounded-3xl p-6 relative overflow-hidden border border-white/8"
        style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #0f172a 100%)" }}>
        {/* Decorative glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-5 -left-5 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs mb-1 flex items-center gap-1.5">
              <Star size={11} className="text-orange-400" />
              {isAdmin ? "حساب مدیریتی" : "حساب کاربری"}
            </p>
            <h2 className="text-2xl font-black text-white leading-tight">
              سلام، {state.user?.name?.split(" ")[0] || "کاربر"} 👋
            </h2>
            <p className="text-slate-400 text-xs mt-1.5 max-w-[200px]">
              {isAdmin ? "پنل مدیریت راوی" : "همنشینی‌های رزرو شده شما اینجاست"}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/40 flex-shrink-0">
            <span className="text-2xl font-black text-white">{(state.user?.name || "ک").charAt(0)}</span>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="relative z-10 mt-5 flex flex-wrap gap-2">
          <Link href="/events"
            className="flex items-center gap-1.5 bg-orange-500 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-orange-400 transition shadow-lg shadow-orange-500/30">
            <Calendar size={13} />
            رزرو همنشینی
          </Link>
          <Link href="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-slate-300 hover:text-white transition border border-white/10 hover:border-white/20">
            <Home size={13} />
            صفحه اصلی
          </Link>
          {isAdmin && (
            <Link href="/admin/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-orange-400 border border-orange-500/30 hover:bg-orange-500/10 transition">
              <BarChart2 size={13} />
              پنل ادمین
            </Link>
          )}
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          value={toPersian(bookings.length)}
          label="رزرو فعال"
          color="bg-orange-500"
          icon={<Calendar size={16} />}
        />
        <StatCard
          value={toPersian(paidCount)}
          label="پرداخت شده"
          color="bg-green-500"
          icon={<CheckCircle2 size={16} />}
        />
        <StatCard
          value={toPersian(revealedCount)}
          label="آدرس فعال"
          color="bg-blue-500"
          icon={<MapPin size={16} />}
        />
      </div>

      {/* ── Bookings List ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-white text-base flex items-center gap-2">
            <Sparkles size={16} className="text-orange-400" />
            همنشینی‌های من
          </h3>
          <Link href="/events" className="text-xs text-orange-400 font-bold flex items-center gap-1 hover:gap-2 transition-all">
            همه همنشینی‌ها <ChevronLeft size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl p-10 flex items-center justify-center border border-white/8"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl p-8 text-center border border-white/8"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-3"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              <Calendar size={24} className="text-slate-500" />
            </div>
            <p className="text-white font-bold mb-1 text-sm">هنوز همنشینی‌ای رزرو نکرده‌اید</p>
            <p className="text-slate-500 text-xs mb-5">اولین همنشینی خود را انتخاب کنید!</p>
            <Link href="/events"
              className="inline-block bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-400 transition shadow-lg shadow-orange-500/30">
              رزرو همنشینی
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const event = booking.eventData;
              const loc = booking.locationInfo;
              const title = event?.title || "همنشینی رزرو شده";
              const date = event?.startDate || event?.start_date;
              const isPaid = booking.payment_status === "paid";
              const confirmed = booking.status === "confirmed";

              return (
                <div key={booking.id}
                  className="rounded-3xl p-5 border border-white/8 hover:border-orange-500/20 transition-all"
                  style={{ background: "rgba(255,255,255,0.03)" }}>

                  <div className="flex items-start gap-3">
                    {/* Event icon */}
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border"
                      style={{ background: "rgba(255,107,0,0.12)", borderColor: "rgba(255,107,0,0.25)" }}>
                      <Sparkles size={18} className="text-orange-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title + status */}
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-black text-white text-sm leading-snug line-clamp-2 flex-1">
                          {title}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 border ${
                          confirmed
                            ? "bg-green-500/15 text-green-400 border-green-500/25"
                            : "bg-orange-500/15 text-orange-400 border-orange-500/25"
                        }`}>
                          {confirmed ? "✓ تأیید" : "در انتظار"}
                        </span>
                      </div>

                      {/* Date */}
                      {date && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                          <Clock size={11} />
                          {new Date(date).toLocaleDateString("fa-IR", { weekday: "long", month: "long", day: "numeric" })}
                        </div>
                      )}

                      {/* Payment badge */}
                      {isPaid && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                          <CheckCircle2 size={10} /> پرداخت شده
                        </span>
                      )}

                      {/* Location reveal logic */}
                      <div className="mt-3 p-3 rounded-2xl border"
                        style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
                        {loc?.revealed ? (
                          <div className="flex items-start gap-2">
                            <MapPin size={13} className="text-orange-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-[10px] text-slate-500 mb-0.5">محل برگزاری</p>
                              <p className="text-sm font-bold text-white">{loc.location}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <Lock size={13} className="text-slate-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-[10px] text-slate-500 mb-0.5">محل برگزاری</p>
                              <p className="text-xs text-slate-500">
                                🔒 {loc && loc.minutesRemaining > 600
                                  ? <>تا <span className="text-orange-400 font-bold">{fmtMins(loc.minutesRemaining - 600)}</span> دیگر نمایش داده می‌شود</>
                                  : "آدرس ۱۰ ساعت قبل از شروع نمایش داده می‌شود"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Quick Links ── */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/dashboard/game"
          className="rounded-2xl p-4 border border-white/8 hover:border-purple-500/30 transition-all group"
          style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
            style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(59,130,246,0.25))", border: "1px solid rgba(139,92,246,0.3)" }}>
            <Gamepad2 size={18} className="text-purple-400" />
          </div>
          <p className="font-black text-white text-sm">بازی‌ها</p>
          <p className="text-slate-500 text-[11px] mt-0.5">پرسش و پاسخ همنشینی</p>
        </Link>

        <Link href="/dashboard/explore"
          className="rounded-2xl p-4 border border-white/8 hover:border-blue-500/30 transition-all group"
          style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
            style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.25),rgba(16,185,129,0.25))", border: "1px solid rgba(59,130,246,0.3)" }}>
            <TrendingUp size={18} className="text-blue-400" />
          </div>
          <p className="font-black text-white text-sm">کشف</p>
          <p className="text-slate-500 text-[11px] mt-0.5">همنشینی‌های پیشنهادی</p>
        </Link>
      </div>
    </div>
  );
}
