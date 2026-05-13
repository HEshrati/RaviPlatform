"use client";


import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  Calendar,
  TrendingDown,
  MessageSquare,
  Star,
  Clock,
  XCircle,
  CheckCircle,
  User,
  Activity,
} from "lucide-react";

interface UserBehaviorData {
  userId: string;
  name: string;
  riskLevel: "critical" | "high" | "medium" | "low";
  riskScore: number;
  lastActivity: string;
  accountAge: string;
  totalEvents: number;
  cancelledEvents: number;
  averageRating: number;
  messagesIgnored: number;
  engagementTrend: "declining" | "stable" | "improving";
  reasons: string[];
  recommendations: string[];
  activityTimeline: {
    date: string;
    action: string;
    type: "positive" | "negative" | "neutral";
  }[];
}

// Mock data - in production, fetch from API
const MOCK_USER_DATA: Record<string, UserBehaviorData> = {
  "user-1": {
    userId: "user-1",
    name: "محمد احمدی",
    riskLevel: "critical",
    riskScore: 87,
    lastActivity: "۴۵ روز پیش",
    accountAge: "۸ ماه",
    totalEvents: 15,
    cancelledEvents: 7,
    averageRating: 3.2,
    messagesIgnored: 12,
    engagementTrend: "declining",
    reasons: [
      "بیش از ۴۵ روز فعالیتی نداشته است",
      "۴۶٪ از رویدادهای رزرو شده را کنسل کرده",
      "میانگین امتیازات پایین (۳.۲ از ۵)",
      "۱۲ پیام سیستمی را نادیده گرفته",
      "روند مشارکت در حال کاهش است",
      "هیچ دوستی را دعوت نکرده",
    ],
    recommendations: [
      "ارسال پیام شخصی‌سازی شده با توجه به علایق",
      "ارائه تخفیف ۳۰٪ برای رویداد بعدی",
      "پیشنهاد رویدادهای مرتبط با دسته محبوب (همنشین)",
      "انجام تماس تلفنی برای شنیدن بازخورد",
      "ارسال نظرسنجی درباره دلایل عدم حضور",
    ],
    activityTimeline: [
      {
        date: "۱۴۰۳/۰۹/۱۵",
        action: "کنسل کردن رویداد همنشین",
        type: "negative",
      },
      {
        date: "۱۴۰۳/۰۹/۰۱",
        action: "نادیده گرفتن پیام یادآوری",
        type: "negative",
      },
      {
        date: "۱۴۰۳/۰۸/۲۳",
        action: "امتیاز ۲ ستاره به رویداد",
        type: "negative",
      },
      {
        date: "۱۴۰۳/۰۸/۲۰",
        action: "شرکت در رویداد هم‌بازی",
        type: "positive",
      },
      {
        date: "۱۴۰۳/۰۸/۱۰",
        action: "کنسل کردن رویداد هم‌صحبت",
        type: "negative",
      },
    ],
  },
};

const RISK_COLORS = {
  critical: { bg: "#ef4444", text: "#fee2e2", border: "#fca5a5" },
  high: { bg: "#f97316", text: "#ffedd5", border: "#fdba74" },
  medium: { bg: "#eab308", text: "#fef9c3", border: "#fde047" },
  low: { bg: "#22c55e", text: "#dcfce7", border: "#86efac" },
};

export default function UserBehaviorPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [userData, setUserData] = useState<UserBehaviorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch from API
    setTimeout(() => {
      setUserData(MOCK_USER_DATA[userId] || null);
      setLoading(false);
    }, 500);
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h2 className="text-white font-black text-2xl mb-2">
            کاربر یافت نشد
          </h2>
          <button
            onClick={() => router.back()}
            className="text-orange-400 hover:text-orange-300"
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  const riskColor = RISK_COLORS[userData.riskLevel];

  return (
    <div className="min-h-screen pb-24" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800/60 backdrop-blur-md bg-opacity-90">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl bg-slate-800/60 hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <ArrowLeft size={18} className="text-slate-400" />
            </button>
            <div>
              <h1 className="text-xl font-black text-white">تحلیل رفتار کاربر</h1>
              <p className="text-xs text-slate-400">{userData.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Risk Overview Card */}
        <div
          className="rounded-3xl p-6 mb-6"
          style={{
            background: `linear-gradient(135deg, ${riskColor.bg}15 0%, ${riskColor.bg}05 100%)`,
            border: `1px solid ${riskColor.bg}40`,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: `${riskColor.bg}20` }}
              >
                <AlertTriangle size={28} style={{ color: riskColor.bg }} />
              </div>
              <div>
                <h2 className="text-white font-black text-2xl mb-1">
                  {userData.name}
                </h2>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: `${riskColor.bg}30`,
                      color: riskColor.bg,
                    }}
                  >
                    {userData.riskLevel === "critical"
                      ? "خطر بحرانی"
                      : userData.riskLevel === "high"
                        ? "خطر بالا"
                        : userData.riskLevel === "medium"
                          ? "خطر متوسط"
                          : "خطر پایین"}
                  </span>
                  <span className="text-slate-400 text-xs">
                    امتیاز ریسک: {userData.riskScore}٪
                  </span>
                </div>
              </div>
            </div>

            <div
              className="text-right px-4 py-2 rounded-xl"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <p className="text-slate-400 text-xs mb-0.5">آخرین فعالیت</p>
              <p className="text-white font-black text-lg">
                {userData.lastActivity}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div
              className="rounded-2xl p-3"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <p className="text-slate-400 text-xs mb-1">کل رویدادها</p>
              <p className="text-white font-black text-xl">
                {userData.totalEvents}
              </p>
            </div>
            <div
              className="rounded-2xl p-3"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <p className="text-slate-400 text-xs mb-1">کنسل شده</p>
              <p className="text-white font-black text-xl">
                {userData.cancelledEvents}
              </p>
            </div>
            <div
              className="rounded-2xl p-3"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <p className="text-slate-400 text-xs mb-1">میانگین امتیاز</p>
              <p className="text-white font-black text-xl">
                {userData.averageRating}
              </p>
            </div>
            <div
              className="rounded-2xl p-3"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <p className="text-slate-400 text-xs mb-1">پیام‌های نادیده</p>
              <p className="text-white font-black text-xl">
                {userData.messagesIgnored}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Reasons Card */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <XCircle size={18} className="text-red-400" />
              </div>
              <h3 className="text-white font-black text-lg">
                دلایل خطر ریزش
              </h3>
            </div>

            <div className="space-y-2">
              {userData.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(239,68,68,0.05)" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Card */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle size={18} className="text-green-400" />
              </div>
              <h3 className="text-white font-black text-lg">
                اقدامات پیشنهادی
              </h3>
            </div>

            <div className="space-y-2">
              {userData.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(34,197,94,0.05)" }}
                >
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-400 text-xs font-bold">
                      {idx + 1}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div
          className="rounded-2xl p-6 mt-6"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Activity size={18} className="text-indigo-400" />
            </div>
            <h3 className="text-white font-black text-lg">
              تاریخچه فعالیت اخیر
            </h3>
          </div>

          <div className="space-y-3">
            {userData.activityTimeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.type === "positive"
                        ? "bg-green-500/20"
                        : item.type === "negative"
                          ? "bg-red-500/20"
                          : "bg-slate-500/20"
                    }`}
                  >
                    {item.type === "positive" ? (
                      <CheckCircle
                        size={16}
                        className="text-green-400"
                      />
                    ) : item.type === "negative" ? (
                      <XCircle size={16} className="text-red-400" />
                    ) : (
                      <Clock size={16} className="text-slate-400" />
                    )}
                  </div>
                  {idx < userData.activityTimeline.length - 1 && (
                    <div className="w-0.5 h-full bg-slate-700/40 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-white font-bold text-sm mb-1">
                    {item.action}
                  </p>
                  <p className="text-slate-400 text-xs">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-colors">
            ارسال پیام شخصی
          </button>
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl transition-colors">
            ارائه تخفیف ویژه
          </button>
          <button className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-4 rounded-2xl transition-colors">
            تماس تلفنی
          </button>
        </div>
      </div>
    </div>
  );
}
