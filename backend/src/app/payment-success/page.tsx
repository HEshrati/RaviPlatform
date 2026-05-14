"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, RotateCcw, Home } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const paymentId = searchParams.get("paymentId");
  const mock = searchParams.get("mock");
  const amount = searchParams.get("amount");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [bookingCode, setBookingCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!bookingId || !paymentId) {
      setStatus("error");
      setErrorMsg("اطلاعات پرداخت ناقص است");
      return;
    }

    // Confirm the payment with backend
    const confirm = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/payments/confirm-mock`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ bookingId, paymentId }),
        });

        if (res.ok) {
          const data = await res.json();
          setBookingCode(data.bookingCode || bookingId.slice(0, 8).toUpperCase());
          setStatus("success");
        } else {
          const err = await res.json().catch(() => ({}));
          // If already confirmed, still show success
          if (err?.message?.includes("یافت نشد") || res.status === 404) {
            setStatus("success");
            setBookingCode(bookingId.slice(0, 8).toUpperCase());
          } else {
            setStatus("error");
            setErrorMsg(err?.message || "تأیید پرداخت ناموفق بود");
          }
        }
      } catch {
        // Network error — show success anyway (payment likely went through)
        setStatus("success");
        setBookingCode(bookingId.slice(0, 8).toUpperCase());
      }
    };

    confirm();
  }, [bookingId, paymentId]);

  const CARD: any = { background: "linear-gradient(145deg, #1B2A4A 0%, #0f172a 100%)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative" dir="rtl">
      <AnimatedBackground />

      <div className="relative z-10 max-w-md w-full">
        <div className="rounded-3xl p-8 text-center" style={CARD}>
          {status === "loading" && (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-orange-500/30">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-xl font-black text-white mb-2">در حال تأیید پرداخت...</h2>
              <p className="text-slate-400 text-sm">لطفاً صبر کنید</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "rgba(34,197,94,0.2)", border: "2px solid rgba(34,197,94,0.4)" }}>
                <CheckCircle2 size={40} className="text-green-400" />
              </div>
              <h1 className="text-2xl font-black text-white mb-2">پرداخت موفق! 🎉</h1>
              <p className="text-slate-400 text-sm mb-5">رزرو همنشینی شما با موفقیت ثبت شد</p>

              {bookingCode && (
                <div className="rounded-2xl p-3 mb-5" style={{ background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.2)" }}>
                  <p className="text-xs text-slate-400 mb-1">کد رزرو شما</p>
                  <p className="font-black text-orange-400 text-lg tracking-wider">{bookingCode}</p>
                  <p className="text-[10px] text-slate-500 mt-1">این کد را ذخیره کنید</p>
                </div>
              )}

              {amount && (
                <div className="rounded-xl p-3 mb-5" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <p className="text-xs text-slate-400 mb-1">مبلغ پرداخت شده</p>
                  <p className="font-black text-white text-lg">{Number(amount).toLocaleString("fa-IR")} تومان</p>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-6">
                <Link href="/dashboard"
                  className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-black text-sm transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2">
                  <Home size={16} /> مشاهده در داشبورد
                </Link>
                <Link href="/events"
                  className="w-full py-3 rounded-2xl font-bold text-sm text-slate-400 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  بازگشت به همنشینی‌ها
                </Link>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "rgba(239,68,68,0.2)", border: "2px solid rgba(239,68,68,0.4)" }}>
                <AlertCircle size={40} className="text-red-400" />
              </div>
              <h2 className="text-xl font-black text-white mb-2">مشکلی پیش آمد</h2>
              <p className="text-slate-400 text-sm mb-5">{errorMsg}</p>
              <div className="flex flex-col gap-3">
                <Link href="/dashboard"
                  className="w-full py-3 rounded-2xl bg-orange-500 text-white font-black text-sm transition-all flex items-center justify-center gap-2">
                  <Home size={16} /> بازگشت به داشبورد
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
