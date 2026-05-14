"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, AlertTriangle, Phone, ChevronRight } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TELEGRAM_SUPPORT = "https://t.me/ravi_support";

interface SuspendedBannerProps {
  className?: string;
}

export default function SuspendedBanner({ className = "" }: SuspendedBannerProps) {
  const [isSuspended, setIsSuspended] = useState(false);
  const [noShowCount, setNoShowCount] = useState(0);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) { setChecked(true); return; }

    fetch(`${API_URL}/api/intelligence/my-profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setIsSuspended(data?.is_suspended || false);
        setNoShowCount(data?.no_show_count || 0);
      })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  if (!checked || !isSuspended) return null;

  return (
    <div
      className={`rounded-2xl p-4 ${className}`}
      style={{
        background: "linear-gradient(135deg, #2A0F0F 0%, #1A0808 100%)",
        border: "1px solid rgba(239,68,68,0.4)",
        boxShadow: "0 4px 24px rgba(239,68,68,0.15)",
      }}
      dir="rtl"
    >
      {/* خط بالای قرمز */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-red-500/60" />

      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(239,68,68,0.15)" }}
        >
          <ShieldAlert size={22} className="text-red-400" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-black text-red-400 text-sm">حساب کاربری شما موقتاً محدود شده</h3>
            <AlertTriangle size={14} className="text-red-400" />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            به دلیل <strong className="text-red-300">
              {noShowCount} بار غیبت در رویداد
            </strong> بدون اطلاع قبلی، حساب شما تعلیق شده است.
            برای رفع محدودیت، لطفاً با پشتیبانی راوی تماس بگیرید.
          </p>

          <div className="flex gap-2 mt-3 flex-wrap">
            <a
              href={TELEGRAM_SUPPORT}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition"
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
              }}
            >
              <Phone size={12} />
              تماس با پشتیبانی
            </a>

            <span
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs"
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}
            >
              ادمین باید تأیید کند
              <ChevronRight size={11} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
