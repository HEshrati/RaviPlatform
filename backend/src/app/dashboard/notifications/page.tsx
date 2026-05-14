"use client";

import { useState } from "react";
import { Bell, Calendar, Users, Trophy, X, CheckCheck } from "lucide-react";

interface Notification {
  id: string;
  type: "event" | "match" | "reward" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  color: string;
  emoji: string;
}

const SAMPLE: Notification[] = [
  {
    id: "1", type: "event",
    title: "یک روز تا همنشینی!",
    message: "همنشینی «قدم زدن در پارک لاله» فردا ساعت ۱۷:۰۰ شروع می‌شه",
    time: "۲ ساعت پیش", read: false, color: "rgba(59,130,246,0.2)", emoji: "📅"
  },
  {
    id: "2", type: "match",
    title: "تطابق جدید!",
    message: "۱۵ نفر منتظر همنشینی با شما هستند. الان رزرو کن!",
    time: "۵ ساعت پیش", read: false, color: "rgba(255,107,0,0.2)", emoji: "🤝"
  },
  {
    id: "3", type: "reward",
    title: "پاداش جدید!",
    message: "۵۰ امتیاز برای تکمیل پروفایل به کیف پول شما اضافه شد",
    time: "دیروز", read: true, color: "rgba(34,197,94,0.2)", emoji: "🏆"
  },
  {
    id: "4", type: "system",
    title: "به‌روزرسانی راوی",
    message: "نسخه جدید راوی با قابلیت‌های جدید منتشر شد!",
    time: "۲ روز پیش", read: true, color: "rgba(168,85,247,0.2)", emoji: "🔔"
  },
];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(SAMPLE);

  const markRead = (id: string) =>
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const dismiss = (id: string) => setNotifs((prev) => prev.filter((n) => n.id !== id));

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto pb-8 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Bell size={20} className="text-orange-400" />
            اعلان‌ها
            {unread > 0 && (
              <span
                className="text-xs font-black px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,107,0,0.9)", color: "white" }}
              >
                {unread}
              </span>
            )}
          </h1>
          {unread > 0 && (
            <p className="text-slate-500 text-xs mt-0.5">{unread} اعلان خوانده‌نشده</p>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-bold text-orange-400
                       hover:text-orange-300 transition-colors px-3 py-1.5 rounded-xl
                       border border-orange-500/25 hover:border-orange-500/50"
          >
            <CheckCheck size={13} /> خواندن همه
          </button>
        )}
      </div>

      {/* List */}
      {notifs.length === 0 ? (
        <div className="rounded-3xl p-10 text-center border border-white/8"
          style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="text-5xl mb-3">🔔</div>
          <p className="text-white font-bold">اعلانی وجود ندارد</p>
          <p className="text-slate-500 text-xs mt-1">اعلان‌های جدید اینجا نمایش داده می‌شوند</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifs.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className="rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.01]
                         border border-white/8"
              style={{
                background: n.read ? "rgba(255,255,255,0.03)" : "rgba(255,107,0,0.05)",
                borderColor: n.read ? "rgba(255,255,255,0.07)" : "rgba(255,107,0,0.2)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl
                             flex-shrink-0 shadow-lg"
                  style={{ background: n.color }}
                >
                  {n.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-sm text-white leading-tight">{n.title}</h3>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {!n.read && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                        className="text-slate-600 hover:text-slate-300 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{n.message}</p>
                  <p className="text-slate-600 text-[10px] mt-1.5">{n.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
