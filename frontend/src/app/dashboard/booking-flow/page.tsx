"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function BookingFlowPage() {
  const { state } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function start(serviceType: "psychologist" | "hamzist") {
    setLoading(true); setErr("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${API}/api/consultation-flow/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ serviceType }),
      });
      if (!res.ok) throw new Error("خطا در شروع");
      const data = await res.json();
      router.push(`/dashboard/booking-flow/topic?sid=${data.session.id}&type=${serviceType}`);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🧠</div>
          <h1 className="text-3xl font-black text-white mb-3">مشاوره راوی</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            با چه نوع خدمتی می‌خواهید شروع کنید؟
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => start("psychologist")}
            disabled={loading}
            className="group p-6 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-all text-right"
            style={{ background: "linear-gradient(135deg,#1a2a4a,#0f1a2e)" }}
          >
            <div className="text-4xl mb-3">👨‍⚕️</div>
            <div className="font-black text-white text-xl mb-2">روانشناس</div>
            <div className="text-slate-400 text-xs leading-relaxed">
              مشاوره فردی با روانشناس متخصص بر اساس نیاز شما
            </div>
          </button>

          <button
            onClick={() => start("hamzist")}
            disabled={loading}
            className="group p-6 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-all text-right"
            style={{ background: "linear-gradient(135deg,#1a2a4a,#0f1a2e)" }}
          >
            <div className="text-4xl mb-3">🤝</div>
            <div className="font-black text-white text-xl mb-2">همزیست</div>
            <div className="text-slate-400 text-xs leading-relaxed">
              همراهی و پشتیبانی روزانه برای بهتر زیستن
            </div>
          </button>
        </div>

        {err && <p className="text-red-400 text-center mt-4 text-sm">{err}</p>}
        {loading && <p className="text-orange-400 text-center mt-4 text-sm">در حال بارگذاری...</p>}
      </div>
    </div>
  );
}
