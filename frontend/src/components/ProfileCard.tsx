// ─────────────────────────────────────────────────────────────────────────────
// تغییر ۳: دکمه ویرایش پروفایل در داشبورد
// این کامپوننت را داخل کارت پروفایل کاربر در داشبورد اضافه کن
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import Link from "next/link";
import { Edit2, MapPin, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

// ── کامپوننت کارت پروفایل داشبورد (جایگزین یا مکمل موجود) ──
export function DashboardProfileCard() {
  const { state } = useApp();
  const user = state.user;
  const userCity = (user as any)?.city || (user as any)?.profile?.city || "";
  const userNeighborhood = (user as any)?.neighborhood || (user as any)?.profile?.neighborhood || "";

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "white",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
      }}
    >
      {/* بنر بالای کارت */}
      <div
        className="h-16 relative"
        style={{
          background: "linear-gradient(135deg, #1B2A4A 0%, #0d1e35 100%)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #FF6B00, transparent)",
            transform: "translate(30%, -30%)",
          }}
        />
      </div>

      <div className="px-5 pb-5">
        {/* آواتار */}
        <div className="flex items-end justify-between -mt-8 mb-3">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
            >
              {(user as any)?.avatar ? (
                <img
                  src={(user as any).avatar}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: "rgba(255,107,0,0.1)" }}
                >
                  <User size={24} className="text-orange-500" />
                </div>
              )}
            </div>
          </div>

          {/* ── دکمه ویرایش پروفایل ── */}
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255,107,0,0.08)",
              border: "1px solid rgba(255,107,0,0.2)",
              color: "#FF6B00",
            }}
          >
            <Edit2 size={13} />
            ویرایش پروفایل
          </Link>
        </div>

        {/* نام و اطلاعات */}
        <h3 className="font-black text-slate-900 text-base mb-0.5">
          {user?.name || "کاربر"}
        </h3>

        {userCity && (
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
            <MapPin size={11} className="text-orange-500" />
            <span>
              {userCity}
              {userNeighborhood && ` · ${userNeighborhood}`}
            </span>
          </div>
        )}

        {/* آمار سریع */}
        <div
          className="flex items-center divide-x divide-slate-100 rounded-2xl overflow-hidden"
          style={{ background: "rgba(0,0,0,0.03)" }}
        >
          <div className="flex-1 text-center py-3">
            <p className="text-lg font-black text-slate-900">
              {(user as any)?.friendsCount ?? 0}
            </p>
            <p className="text-[10px] text-slate-500">دوستان</p>
          </div>
          <div className="flex-1 text-center py-3">
            <p className="text-lg font-black text-slate-900">
              {(user as any)?.eventsCount ?? 0}
            </p>
            <p className="text-[10px] text-slate-500">رویدادها</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// اگه کارت موجود داری و فقط می‌خوای دکمه رو اضافه کنی:
// این JSX را داخل کارت پروفایل موجود بعد از نام کاربر اضافه کن:
// ─────────────────────────────────────────────────────────────────────────────

export const EditProfileButton = () => (
  <Link
    href="/dashboard/profile"
    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
    style={{
      background: "rgba(255,107,0,0.08)",
      border: "1px solid rgba(255,107,0,0.2)",
      color: "#FF6B00",
    }}
  >
    <Edit2 size={13} />
    <span>ویرایش پروفایل</span>
  </Link>
);

// ── برای موبایل (در bottom sheet یا منوی پروفایل) ──
export const EditProfileButtonMobile = () => (
  <Link
    href="/dashboard/profile"
    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl transition-all hover:bg-orange-50 active:scale-[0.98]"
    style={{
      background: "rgba(255,107,0,0.06)",
      border: "1px solid rgba(255,107,0,0.15)",
    }}
  >
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(255,107,0,0.1)" }}
    >
      <Edit2 size={16} className="text-orange-500" />
    </div>
    <div className="text-right">
      <p className="font-black text-slate-800 text-sm">ویرایش پروفایل</p>
      <p className="text-[11px] text-slate-500">شهر، محله، نام و اطلاعات شخصی</p>
    </div>
    <div className="mr-auto">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 8L6 4M6 12L10 8" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  </Link>
);
