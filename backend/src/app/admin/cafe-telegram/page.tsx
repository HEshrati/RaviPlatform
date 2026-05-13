"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Coffee,
  Wifi,
  WifiOff,
  Bell,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  MapPin,
  Users,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const BOT_SECRET = process.env.NEXT_PUBLIC_BOT_SECRET || "ravi-bot-secret-2024";

interface Cafe {
  id: string;
  cafe_name: string;
  username: string;
  city: string;
  address?: string;
  is_active: boolean;
  telegram_linked: boolean;
  telegram_id?: string;
}

interface Event {
  id: string;
  title: string;
  city: string;
  start_date: string;
  location?: string;
}

export default function CafeTelegramPage() {
  const router = useRouter();
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifyingEvent, setNotifyingEvent] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData(token);
  }, []);

  async function fetchData(token: string) {
    setLoading(true);
    try {
      // دریافت لیست کافه‌ها
      const cRes = await fetch(`${API}/api/cafe/admin/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (cRes.status === 401) {
        router.push("/login");
        return;
      }
      const cData = await cRes.json();
      setCafes(Array.isArray(cData) ? cData : []);

      // دریافت رویدادهای فعال
      const eRes = await fetch(`${API}/api/events?status=upcoming&limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const eData = await eRes.json();
      setEvents(Array.isArray(eData) ? eData : eData?.events || []);
    } catch {
      setErrorMsg("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  }

  async function notifyEvent(eventId: string, eventTitle: string) {
    setNotifyingEvent(eventId);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await fetch(`${API}/api/bot/event/notify-cafes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-ravi-bot-secret": BOT_SECRET,
        },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(
          `✅ اطلاعات رویداد «${eventTitle}» آماده شد — ${data.count} کافه در صف نوتیفیکیشن`,
        );
      } else {
        setErrorMsg(data.error || "خطا در ارسال نوتیفیکیشن");
      }
    } catch {
      setErrorMsg("خطا در اتصال به سرور");
    } finally {
      setNotifyingEvent(null);
    }
  }

  const cities = [
    "all",
    ...Array.from(new Set(cafes.map((c) => c.city).filter(Boolean))),
  ];
  const filteredCafes =
    selectedCity === "all"
      ? cafes
      : cafes.filter((c) => c.city === selectedCity);
  const linkedCount = cafes.filter(
    (c) => c.telegram_linked && c.is_active,
  ).length;
  // کافه فعال = کافه‌هایی که حداقل یک‌بار رویداد در آنها برگزار شده (بر اساس location یا cafe_id یا اسم کافه)
  const cafeEventCounts: Record<string, number> = {};
  events.forEach((ev: any) => {
    // match by cafe_id
    if (ev.cafe_id) cafeEventCounts[ev.cafe_id] = (cafeEventCounts[ev.cafe_id] || 0) + 1;
    // match by location string containing cafe name
    const loc = (ev.location || "").toString().toLowerCase();
    if (loc) {
      cafes.forEach((c) => {
        if (c.cafe_name && loc.includes(c.cafe_name.toLowerCase())) {
          cafeEventCounts[c.id] = (cafeEventCounts[c.id] || 0) + 1;
        }
      });
    }
  });
  // کافه فعال = حداقل یک بار رویداد در آن کافه برگزار شده
  const totalActive = cafes.filter((c) => {
    const eventCount = cafeEventCounts[c.id] || 0;
    return eventCount >= 1;
  }).length;

  const S = {
    card: {
      background: "linear-gradient(145deg,#1B2A4A 0%,#132038 100%)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
    } as any,
    success: {
      background: "rgba(34,197,94,0.1)",
      border: "1px solid rgba(34,197,94,0.3)",
      borderRadius: 12,
    } as any,
    error: {
      background: "rgba(239,68,68,0.1)",
      border: "1px solid rgba(239,68,68,0.3)",
      borderRadius: 12,
    } as any,
  };

  return (
    <main
      className="min-h-screen pb-16"
      dir="rtl"
      style={{ background: "#0B1628" }}
    >
      {/* هدر */}
      <div
        className="sticky top-0 z-30 px-4 py-4"
        style={{
          background: "rgba(11,22,40,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,107,0,0.15)" }}
          >
            <Coffee size={18} className="text-orange-400" />
          </div>
          <div>
            <h1 className="text-white font-black text-base">
              مدیریت ربات کافه‌ها
            </h1>
            <p className="text-slate-400 text-xs">
              ارتباط کافه‌ها با تلگرام و ارسال نوتیفیکیشن رویداد
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* آمار کلی */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "کافه‌های فعال",
              value: totalActive,
              icon: Coffee,
              color: "#FF6B00",
            },
            {
              label: "لینک‌شده به تلگرام",
              value: linkedCount,
              icon: Wifi,
              color: "#22c55e",
            },
            {
              label: "بدون تلگرام",
              value: totalActive - linkedCount,
              icon: WifiOff,
              color: "#94a3b8",
            },
          ].map((s) => (
            <div key={s.label} className="p-4 text-center" style={S.card}>
              <s.icon
                size={18}
                style={{ color: s.color }}
                className="mx-auto mb-2"
              />
              <p className="text-2xl font-black" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-slate-400 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* پیام‌های موفقیت/خطا */}
        {successMsg && (
          <div
            className="flex items-start gap-3 p-4 text-green-400 text-sm"
            style={S.success}
          >
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div
            className="flex items-center gap-3 p-4 text-red-400 text-sm"
            style={S.error}
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ارسال نوتیفیکیشن برای رویداد */}
        <div className="p-4 space-y-3" style={S.card}>
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-orange-400" />
            <h2 className="text-white font-black text-sm">
              ارسال نوتیفیکیشن به کافه‌ها
            </h2>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            با انتخاب یک رویداد، اطلاعات آن به n8n ارسال می‌شود تا پیام تلگرامی
            به تمام کافه‌های لینک‌شده در آن شهر ارسال شود.
          </p>
          {loading ? (
            <div className="flex justify-center py-4">
              <RefreshCw size={20} className="text-slate-500 animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-3">
              رویداد فعالی وجود ندارد
            </p>
          ) : (
            <div className="space-y-2">
              {events.map((ev) => {
                const cityLinkedCafes = cafes.filter(
                  (c) => c.city === ev.city && c.telegram_linked && c.is_active,
                );
                return (
                  <div
                    key={ev.id}
                    className="rounded-xl p-3 flex items-center gap-3"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">
                        {ev.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin size={10} />
                          {ev.city}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar size={10} />
                          {new Date(ev.start_date).toLocaleDateString("fa-IR", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span
                          className="flex items-center gap-1 text-xs"
                          style={{
                            color:
                              cityLinkedCafes.length > 0
                                ? "#22c55e"
                                : "#94a3b8",
                          }}
                        >
                          <Wifi size={10} />
                          {cityLinkedCafes.length} کافه
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => notifyEvent(ev.id, ev.title)}
                      disabled={
                        notifyingEvent === ev.id || cityLinkedCafes.length === 0
                      }
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0"
                      style={{
                        background:
                          cityLinkedCafes.length === 0
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(255,107,0,0.2)",
                        color:
                          cityLinkedCafes.length === 0 ? "#475569" : "#FF9A3C",
                        border: `1px solid ${cityLinkedCafes.length === 0 ? "rgba(255,255,255,0.08)" : "rgba(255,107,0,0.3)"}`,
                        cursor:
                          cityLinkedCafes.length === 0
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {notifyingEvent === ev.id ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : (
                        <Send size={12} />
                      )}
                      {notifyingEvent === ev.id ? "..." : "نوتیفای"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* لیست کافه‌ها */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-black text-sm flex items-center gap-2">
              <Coffee size={15} className="text-orange-400" />
              وضعیت کافه‌ها
            </h2>
            {/* فیلتر شهر */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs rounded-lg px-2 py-1.5 text-white"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "همه شهرها" : c}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <RefreshCw size={24} className="text-orange-400 animate-spin" />
            </div>
          ) : filteredCafes.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Coffee size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">کافه‌ای یافت نشد</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCafes.map((cafe) => (
                <div
                  key={cafe.id}
                  className="p-4 flex items-center gap-4"
                  style={S.card}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: cafe.telegram_linked
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(255,255,255,0.05)",
                    }}
                  >
                    {cafe.telegram_linked ? (
                      <Wifi size={18} className="text-green-400" />
                    ) : (
                      <WifiOff size={18} className="text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">
                      {cafe.cafe_name}
                    </p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <MapPin size={10} />
                        {cafe.city || "—"}
                      </span>
                      <span className="text-xs text-slate-500">
                        @{cafe.username}
                      </span>
                      {!cafe.is_active && (
                        <span className="text-xs text-red-400">غیرفعال</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {cafe.telegram_linked ? (
                      <div className="flex items-center gap-1 text-xs text-green-400 font-bold">
                        <LinkIcon size={12} />
                        لینک‌شده
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500">بدون تلگرام</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* راهنمای اتصال */}
        <div
          className="p-4 rounded-2xl"
          style={{
            background: "rgba(255,107,0,0.05)",
            border: "1px solid rgba(255,107,0,0.15)",
          }}
        >
          <h3 className="text-orange-400 font-black text-sm mb-3">
            📖 راهنمای اتصال کافه به ربات
          </h3>
          <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
            <p>
              <span className="text-white font-bold">۱.</span> ادمین کافه وارد
              ربات تلگرام می‌شود
            </p>
            <p>
              <span className="text-white font-bold">۲.</span> دستور{" "}
              <code className="text-orange-300 bg-orange-900/20 px-1 rounded">
                /login
              </code>{" "}
              را می‌زند
            </p>
            <p>
              <span className="text-white font-bold">۳.</span> نام کاربری و رمز
              حساب کافه خود را وارد می‌کند
            </p>
            <p>
              <span className="text-white font-bold">۴.</span> ربات اکانت تلگرام
              را به کافه لینک می‌کند
            </p>
            <p>
              <span className="text-white font-bold">۵.</span> از این پس هر بار
              که رویداد جدیدی در شهر کافه ایجاد شود، نوتیفیکیشن خودکار دریافت
              می‌کنند
            </p>
            <p>
              <span className="text-white font-bold">۶.</span> با دستور{" "}
              <code className="text-orange-300 bg-orange-900/20 px-1 rounded">
                /attendance
              </code>{" "}
              می‌توانند حضور و غیاب ثبت کنند
            </p>
          </div>
        </div>

        {/* دستورات n8n */}
        <div
          className="p-4 rounded-2xl"
          style={{
            background: "rgba(99,102,241,0.05)",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <h3 className="text-indigo-400 font-black text-sm mb-3">
            ⚙️ اندپوینت‌های n8n
          </h3>
          <div className="space-y-2 font-mono text-xs text-slate-400">
            {[
              {
                method: "GET",
                path: "/api/bot/cafe/admins-by-city/:city",
                desc: "کافه‌های لینک‌شده در یک شهر",
              },
              {
                method: "GET",
                path: "/api/bot/event/info/:eventId",
                desc: "اطلاعات رویداد + پیام آماده",
              },
              {
                method: "POST",
                path: "/api/bot/event/notify-cafes",
                desc: "تریگر دستی نوتیفیکیشن",
              },
              {
                method: "GET",
                path: "/api/bot/cafe/upcoming-events/:telegramId",
                desc: "رویدادهای آینده کافه",
              },
            ].map((e) => (
              <div
                key={e.path}
                className="p-2 rounded-lg"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <span className="text-indigo-400 font-bold">{e.method}</span>
                <span className="text-slate-300 mx-2">{e.path}</span>
                <br />
                <span className="text-slate-500 text-xs">{e.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
