"use client";


import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { isAdminPhone } from "@/lib/api";
import { CheckCircle, XCircle, AlertTriangle, ArrowRight, Users } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
function getToken() { return typeof window !== "undefined" ? localStorage.getItem("token") : null; }
async function api(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "خطا");
  return res.json();
}

export default function AttendancePage() {
  const params = useParams<{ eventId: string }>();
  const router = useRouter();
  const { state } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!isAdminPhone(state.user?.mobileNumber)) { router.replace("/dashboard"); return; }
    loadData();
  }, [state.user, params.eventId]);

  const loadData = async () => {
    try { const res = await api(`/api/attendance/event/${params.eventId}`); setData(res); }
    catch (e: any) { setMsg("خطا: " + e.message); }
    finally { setLoading(false); }
  };

  const mark = async (userId: string, attended: boolean) => {
    setMarking(userId);
    try {
      await api(`/api/attendance/event/${params.eventId}/mark`, { method: "POST", body: JSON.stringify({ userId, attended }) });
      await loadData();
      setMsg(attended ? "✅ حضور ثبت شد" : "⚠️ غیاب ثبت شد");
      setTimeout(() => setMsg(""), 2500);
    } catch (e: any) { setMsg("خطا: " + e.message); }
    finally { setMarking(null); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen pb-28 bg-white" dir="rtl">
      <div className="max-w-lg mx-auto px-4 py-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 text-sm mb-4 hover:text-slate-800">
          <ArrowRight size={16} /> بازگشت
        </button>

        {data?.event && (
          <div className="rounded-2xl p-4 mb-5" style={{ background: "#1a3a5c" }}>
            <h1 className="text-white font-black text-lg mb-1">{data.event.title}</h1>
            <p className="text-white/70 text-sm">{data.event.city} | {new Date(data.event.start_date).toLocaleDateString("fa-IR")}</p>
            {!data.event.eventStarted && (
              <div className="mt-3 rounded-xl px-3 py-2 text-xs font-bold" style={{ background: "rgba(251,191,36,0.2)", color: "#fbbf24" }}>
                ⏳ رویداد هنوز شروع نشده
              </div>
            )}
          </div>
        )}

        {data?.summary && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "حاضر", val: data.summary.attended, color: "#16a34a", icon: "✅" },
              { label: "غایب", val: data.summary.notAttended, color: "#ef4444", icon: "❌" },
              { label: "ثبت‌نشده", val: data.summary.notMarked, color: "#f59e0b", icon: "⏳" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-3 text-center bg-white shadow-sm border border-slate-100">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl font-black" style={{ color: s.color }}>{s.val}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {msg && (
          <div className={`rounded-xl p-3 mb-4 text-sm font-bold text-center ${msg.includes("✅") ? "bg-green-50 text-green-700" : msg.includes("خطا") ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"}`}>{msg}</div>
        )}

        <div className="space-y-3">
          {(data?.attendees || []).map((att: any) => (
            <div key={att.userId} className="rounded-2xl p-4 border transition-all"
              style={{
                background: att.attended ? "#f0fdf4" : att.attendanceMarkedAt ? "#fef2f2" : "#fff",
                borderColor: att.attended ? "#86efac" : att.attendanceMarkedAt ? "#fca5a5" : "#e5e7eb",
              }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-slate-900 text-sm">{att.name}</span>
                    {att.warningCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
                        <AlertTriangle size={10} /> {att.warningCount} هشدار
                      </span>
                    )}
                    {att.isBanned && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">🚫 بن‌شده</span>}
                  </div>
                  {att.phone && <p className="text-xs text-slate-500 mt-0.5 font-mono">{att.phone}</p>}
                </div>
                {data?.event?.eventStarted && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => mark(att.userId, true)} disabled={marking === att.userId}
                      className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-black transition-all active:scale-95"
                      style={{ background: att.attended ? "#16a34a" : "#e5e7eb", color: att.attended ? "#fff" : "#374151" }}>
                      <CheckCircle size={14} /> حاضر
                    </button>
                    <button onClick={() => mark(att.userId, false)} disabled={marking === att.userId}
                      className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-black transition-all active:scale-95"
                      style={{ background: att.attendanceMarkedAt && !att.attended ? "#ef4444" : "#e5e7eb", color: att.attendanceMarkedAt && !att.attended ? "#fff" : "#374151" }}>
                      <XCircle size={14} /> غایب
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {(!data?.attendees || data.attendees.length === 0) && (
            <div className="text-center py-12">
              <Users size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">هیچ رزروی ثبت نشده</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
