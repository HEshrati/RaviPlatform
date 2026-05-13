"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function CompletePage() {
  const router = useRouter();
  const params = useSearchParams();
  const sid = params?.get("sid");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (!sid) return;
    const token = localStorage.getItem("token");
    fetch(`${API}/api/consultation-flow/${sid}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(setSession);
  }, [sid]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" dir="rtl">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl mb-6">✅</div>
        <h1 className="text-3xl font-black text-white mb-4">درخواست ثبت شد</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          اطلاعات و دغدغه‌های شما با موفقیت ثبت شدند.
          {session?.service_type === "psychologist"
            ? " روانشناس شما به زودی با شما در تماس خواهد بود."
            : " همزیست شما به زودی با شما در تماس خواهد بود."}
        </p>
        <div className="p-4 rounded-2xl mb-8 text-right"
          style={{ background: "rgba(255,165,0,0.08)", border: "1px solid rgba(255,165,0,0.2)" }}>
          <p className="text-orange-200 text-sm">
            🔒 نتایج و دغدغه‌های شما فقط برای متخصص مربوطه قابل مشاهده است.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard"
            className="flex-1 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all">
            بازگشت به داشبورد
          </Link>
          <Link href="/dashboard/booking-flow"
            className="flex-1 py-3 rounded-2xl border border-white/10 text-slate-300 hover:bg-white/5 font-bold text-sm transition-all">
            درخواست جدید
          </Link>
        </div>
      </div>
    </div>
  );
}
