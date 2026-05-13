"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { isAdminPhone } from "@/lib/api";
import {
  Brain, Users, Play, CheckCircle2, AlertCircle,
  Zap, RefreshCw, ArrowRight,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const CARD = {
  background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
};

export default function MatchingAdminPage() {
  const { state } = useApp();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [groupSize, setGroupSize] = useState(5);
  const [result, setResult] = useState<any>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    if (!state.isLoggedIn || !isAdminPhone(state.user?.mobileNumber)) {
      router.push("/dashboard");
      return;
    }
    fetchEvents();
  }, [state.isLoggedIn]);

  async function fetchEvents() {
    try {
      const res = await fetch(`${API_URL}/api/events?limit=20`, { headers });
      const data = await res.json();
      setEvents(data.data || data || []);
    } catch {}
  }

  async function runMatching() {
    if (!selectedEvent) return;
    setLoading(true);
    setResult(null);

    try {
      // دریافت کاربران ثبت‌نام‌شده
      const bookingsRes = await fetch(
        `${API_URL}/api/admin/events/${selectedEvent.id}/bookings`,
        { headers }
      );
      const bookings = await bookingsRes.json();
      const userIds = (bookings || []).map((b: any) => b.userId || b.user_id).filter(Boolean);

      if (userIds.length < 2) {
        setResult({ error: "تعداد کاربران ثبت‌نام‌شده کافی نیست (حداقل ۲ نفر)" });
        return;
      }

      // اجرای الگوریتم
      const res = await fetch(
        `${API_URL}/api/matching/create-groups/${selectedEvent.id}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            userIds,
            groupSize,
            eventType: selectedEvent.event_type || "mixed",
          }),
        }
      );
      const data = await res.json();
      setResult(data);
      setGroups(data.groups || []);
    } catch (e: any) {
      setResult({ error: e.message || "خطا در اجرای الگوریتم" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: "linear-gradient(135deg, #0D1B2A 0%, #0A1628 100%)" }}
      dir="rtl"
    >
      {/* هدر */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => router.back()}
            className="text-slate-400 hover:text-white transition"
          >
            <ArrowRight size={20} />
          </button>
          <Brain size={20} className="text-orange-400" />
          <h1 className="text-lg font-black text-white">گروه‌بندی هوشمند</h1>
        </div>
        <p className="text-xs text-slate-400 mr-10">الگوریتم Matching چندبعدی راوی</p>
      </div>

      <div className="px-4 space-y-5">
        {/* انتخاب رویداد */}
        <div className="rounded-2xl p-5" style={CARD}>
          <h2 className="text-sm font-bold text-white mb-4">انتخاب رویداد</h2>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {events.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">همنشینی‌ای یافت نشد</p>
            )}
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`w-full text-right p-3 rounded-xl transition text-sm ${
                  selectedEvent?.id === event.id
                    ? "bg-orange-500/20 border border-orange-500/40 text-orange-300"
                    : "bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <div className="font-bold">{event.title}</div>
                <div className="text-xs opacity-60 mt-0.5">
                  {event.current_bookings || 0} رزرو
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            <label className="text-xs text-slate-400 mb-2 block">اندازه گروه</label>
            <div className="flex gap-2">
              {[4, 5, 6].map((size) => (
                <button
                  key={size}
                  onClick={() => setGroupSize(size)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${
                    groupSize === size
                      ? "bg-orange-500 text-white"
                      : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {size} نفر
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* دکمه اجرا */}
        <button
          onClick={runMatching}
          disabled={!selectedEvent || loading}
          className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 transition disabled:opacity-50"
          style={{
            background: loading ? "#555" : "linear-gradient(135deg, #FF6B00, #FF8C42)",
            boxShadow: loading ? "none" : "0 4px 20px rgba(255,107,0,0.4)",
          }}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              در حال اجرای الگوریتم...
            </>
          ) : (
            <>
              <Zap size={20} />
              اجرای گروه‌بندی هوشمند
            </>
          )}
        </button>

        {/* نتایج */}
        {result?.error && (
          <div className="rounded-2xl p-4 flex items-center gap-3 bg-red-500/10 border border-red-500/20">
            <AlertCircle size={20} className="text-red-400 shrink-0" />
            <p className="text-red-300 text-sm">{result.error}</p>
          </div>
        )}

        {groups.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-400">نتیجه گروه‌بندی</h2>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-400" />
                <span className="text-xs text-green-400">
                  {groups.length} گروه • {result?.totalMatched} کاربر
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {groups.map((group: any, i: number) => (
                <div key={i} className="rounded-2xl p-4" style={CARD}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold text-sm">{group.groupName}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-orange-400">{group.avgCompatibilityScore}٪</span>
                      <span className="text-xs text-slate-500">سازگاری</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap mb-3">
                    {group.memberIds.map((id: string) => (
                      <div
                        key={id}
                        className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center"
                        title={id}
                      >
                        <Users size={12} className="text-orange-400" />
                      </div>
                    ))}
                    <span className="text-xs text-slate-500 mr-1">{group.memberIds.length} نفر</span>
                  </div>

                  {group.matchReasons?.length > 0 && (
                    <div className="space-y-1">
                      {group.matchReasons.map((reason: string, j: number) => (
                        <div key={j} className="text-[11px] text-slate-400 flex items-center gap-1">
                          <CheckCircle2 size={10} className="text-green-400" />
                          {reason}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* قوانین الگوریتم */}
        <div className="rounded-2xl p-5" style={CARD}>
          <h2 className="text-sm font-bold text-white mb-4">قوانین الگوریتم مچینگ</h2>
          <div className="space-y-3">
            {[
              { label: "بازه سنی", desc: "حداکثر ۵ سال تفاوت سنی", required: true },
              { label: "تعادل جنسیتی", desc: "حداقل ۱-۲ خانم در گروه‌های مختلط", required: true },
              { label: "ترکیب شخصیتی", desc: "ترکیب درون‌گرا و برون‌گرا در هر گروه", required: true },
              { label: "اولویت مکان", desc: "اولویت محله مشترک / سراسر شهر", required: true },
              { label: "شباهت علایق", desc: "تا ۳۰ امتیاز بر اساس علایق مشترک", required: false },
              { label: "تعادل انرژی", desc: "متعادل‌سازی سطح انرژی اعضا", required: false },
            ].map((rule) => (
              <div key={rule.label} className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    rule.required ? "bg-orange-500/20" : "bg-blue-500/20"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${rule.required ? "bg-orange-400" : "bg-blue-400"}`} />
                </div>
                <div>
                  <div className="text-white text-xs font-bold">{rule.label}
                    {rule.required && <span className="text-orange-400 text-[10px] mr-1">(اجباری)</span>}
                  </div>
                  <div className="text-slate-500 text-[11px]">{rule.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
