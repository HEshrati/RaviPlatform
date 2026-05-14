"use client";

import { useEffect, useState } from "react";
import {
  Brain, Zap, Heart, Eye, TrendingUp, AlertTriangle,
  Activity, Star, MessageCircle, Target, Sparkles,
  Shield, RefreshCw, ChevronDown, ChevronUp
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface SmartProfileData {
  communication_type: "introvert" | "extrovert" | "ambivert" | null;
  dominant_need: "seen" | "security" | "meaning" | "entertainment" | null;
  interaction_rhythm: "active" | "cautious" | "observer" | null;
  return_rate: number;
  total_events_attended: number;
  total_events_booked: number;
  smart_score: number;
  is_suspended: boolean;
  suspension_reason?: string;
  no_show_count?: number;
  energy_level?: number;
  next_event_interests?: string[];
  ai_insights?: {
    summary?: string;
    strengths?: string[];
    suggestions?: string[];
  };
  telegram_behavior?: {
    avg_messages_per_event?: number;
    is_initiator?: boolean;
    is_bridge?: boolean;
  };
}

const COMMUNICATION_LABELS: Record<string, { label: string; desc: string; color: string; bg: string }> = {
  introvert: {
    label: "درون‌گرا",
    desc: "در گروه‌های کوچک درخشش بیشتری داری",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
  },
  extrovert: {
    label: "برون‌گرا",
    desc: "انرژی‌ات گروه رو زنده می‌کنه",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
  },
  ambivert: {
    label: "ترکیبی",
    desc: "انعطاف بالا در موقعیت‌های مختلف",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
  },
};

const NEED_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  seen: { label: "دیده شدن", icon: <Eye size={13} />, color: "#ec4899" },
  security: { label: "امنیت", icon: <Heart size={13} />, color: "#22c55e" },
  meaning: { label: "معنا", icon: <Brain size={13} />, color: "#8b5cf6" },
  fun: { label: "سرگرمی", icon: <Zap size={13} />, color: "#f59e0b" },
  entertainment: { label: "سرگرمی", icon: <Zap size={13} />, color: "#f59e0b" },
};

const RHYTHM_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: "فعال", color: "#22c55e" },
  cautious: { label: "محتاط", color: "#f59e0b" },
  observer: { label: "ناظر", color: "#3b82f6" },
};

const CARD = {
  background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
};

export default function SmartProfileCard() {
  const [profile, setProfile] = useState<SmartProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    fetch(`${API_URL}/api/intelligence/my-profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl p-5 animate-pulse" style={CARD}>
        <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
        <div className="h-3 bg-white/10 rounded w-2/3 mb-2" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
    );
  }

  if (!profile) return null;

  const commType = profile.communication_type
    ? COMMUNICATION_LABELS[profile.communication_type]
    : null;
  const need = profile.dominant_need
    ? NEED_LABELS[profile.dominant_need]
    : null;
  const rhythm = profile.interaction_rhythm
    ? RHYTHM_LABELS[profile.interaction_rhythm]
    : null;

  const hasData = commType || need || rhythm;

  if (!hasData) {
    return (
      <div className="rounded-2xl p-5 relative overflow-hidden" style={CARD}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "rgba(255,107,0,0.4)" }} />
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,107,0,0.15)" }}>
            <Brain size={16} className="text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">پروفایل هوشمند</h3>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>در حال ساخته شدن...</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          با شرکت در رویدادها، پروفایل هوشمند شما تکمیل می‌شود و الگوریتم مچینگ بهتری خواهید داشت.
        </p>
        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full w-[15%] bg-orange-500/60 rounded-full" />
        </div>
        <p className="text-[10px] text-slate-500 mt-1">۱۵٪ تکمیل شده</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={CARD}>
      {/* خط بالا */}
      <div className="h-px" style={{ background: "linear-gradient(90deg, #FF6B00, #8b5cf6)" }} />

      <div className="p-5">
        {/* هدر */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,107,0,0.15)" }}>
              <Brain size={16} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                پروفایل هوشمند
                <Sparkles size={12} className="text-orange-400" />
              </h3>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                فقط برای سیستم مچینگ
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold"
            style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}
          >
            <Activity size={9} />
            زنده
          </div>
        </div>

        {/* تیپ ارتباطی */}
        {commType && (
          <div className="rounded-xl p-3 mb-3" style={{ background: commType.bg, border: `1px solid ${commType.color}25` }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: commType.color }}>
                {commType.label}
              </span>
              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>تیپ ارتباطی</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{commType.desc}</p>
          </div>
        )}

        {/* نیاز و ریتم */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {need && (
            <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-[10px] text-slate-500 mb-1">نیاز غالب</p>
              <div className="flex items-center gap-1.5">
                <span style={{ color: need.color }}>{need.icon}</span>
                <span className="text-xs font-bold text-white">{need.label}</span>
              </div>
            </div>
          )}
          {rhythm && (
            <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-[10px] text-slate-500 mb-1">ریتم تعامل</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: rhythm.color }} />
                <span className="text-xs font-bold text-white">{rhythm.label}</span>
              </div>
            </div>
          )}
        </div>

        {/* آمار */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
            <p className="text-lg font-black text-orange-400">{profile.total_events_attended || 0}</p>
            <p className="text-[10px] text-slate-500">رویداد شرکت کرده</p>
          </div>
          <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
            <p className="text-lg font-black text-green-400">
              {Math.round((profile.return_rate || 0) * 100)}٪
            </p>
            <p className="text-[10px] text-slate-500">نرخ بازگشت</p>
          </div>
          {typeof profile.energy_level === "number" && (
            <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-lg font-black text-blue-400">{Math.round(profile.energy_level)}</p>
              <p className="text-[10px] text-slate-500">سطح انرژی</p>
            </div>
          )}
        </div>

        {/* علایق برای رویداد بعدی */}
        {profile.next_event_interests && profile.next_event_interests.length > 0 && (
          <div className="rounded-xl p-3 mb-3"
            style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.15)" }}>
            <p className="text-[10px] text-slate-400 mb-2 flex items-center gap-1">
              <Target size={9} /> پیشنهادات شما برای رویداد بعدی
            </p>
            <div className="flex flex-wrap gap-1.5">
              {profile.next_event_interests.slice(0, 5).map((interest) => (
                <span
                  key={interest}
                  className="text-[10px] px-2 py-1 rounded-full font-bold"
                  style={{ background: "rgba(255,107,0,0.15)", color: "#FF9A3C", border: "1px solid rgba(255,107,0,0.2)" }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* بازشو - بینش‌های AI */}
        {profile.ai_insights?.summary && (
          <>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-white transition py-1"
            >
              <span className="flex items-center gap-1">
                <Sparkles size={11} className="text-purple-400" />
                بینش AI
              </span>
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {expanded && (
              <div
                className="rounded-xl p-3 mt-2 space-y-2"
                style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}
              >
                <p className="text-[11px] text-slate-300 leading-relaxed">{profile.ai_insights.summary}</p>
                {profile.ai_insights.strengths?.length && (
                  <div>
                    <p className="text-[10px] text-purple-400 font-bold mb-1">نقاط قوت:</p>
                    {profile.ai_insights.strengths.map((s) => (
                      <p key={s} className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Star size={8} className="text-yellow-400" />{s}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* هشدار تعلیق */}
        {profile.is_suspended && (
          <div
            className="mt-3 rounded-xl p-3 flex items-center gap-2"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <AlertTriangle size={14} className="text-red-400 shrink-0" />
            <p className="text-[11px] text-red-300">
              حساب شما موقتاً تعلیق است. با پشتیبانی تماس بگیرید.
            </p>
          </div>
        )}

        {/* نشانگر تلگرام */}
        {profile.telegram_behavior?.is_initiator && (
          <div
            className="mt-2 rounded-xl p-2.5 flex items-center gap-2"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}
          >
            <MessageCircle size={12} className="text-green-400" />
            <p className="text-[10px] text-slate-300">
              شما <strong className="text-green-400">شروع‌کننده</strong> گفتگو در گروه‌ها هستید
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
