"use client";
/**
 * صفحه داشبورد CRM برای ادمین
 * مسیر: src/app/admin/crm/page.tsx
 *
 * ویژگی‌ها:
 * - نمایش آمار کلی سیستم
 * - نمودار روند روزانه
 * - لیست هشدارهای AI با امکان بررسی
 * - trigger تحلیل دستی
 * - لیست کاربران در خطر ریزش
 * - فعال‌ترین endpoint ها
 * - صفحات پربازدید
 */

import { useState, useEffect, useCallback } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Brain,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  Globe,
  Clock,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Eye,
  BarChart2,
  Cpu,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ── helpers ──────────────────────────────────────────────────────────────────
function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

async function api(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── سطح رنگ‌بندی ─────────────────────────────────────────────────────────────
const SEVERITY_COLOR: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
  info: "#3b82f6",
};

const SEVERITY_BG: Record<string, string> = {
  critical: "rgba(239,68,68,0.12)",
  high: "rgba(249,115,22,0.12)",
  medium: "rgba(234,179,8,0.12)",
  low: "rgba(34,197,94,0.12)",
  info: "rgba(59,130,246,0.12)",
};

const STATUS_LABEL: Record<string, string> = {
  open: "باز",
  reviewed: "بررسی‌شده",
  resolved: "حل‌شده",
  ignored: "نادیده",
};

// ── کامپوننت‌های کوچک ────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "#f97316",
  trend,
  onClick,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  trend?: "up" | "down" | "neutral";
  onClick?: () => void;
}) {
  return (
    <div
      className="rounded-2xl p-5 border border-slate-700/40 flex flex-col gap-3"
      style={{ background: "rgba(15,23,42,0.7)", backdropFilter: "blur(12px)" }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div className="flex items-center gap-1">
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs font-bold ${
                trend === "up"
                  ? "text-green-400"
                  : trend === "down"
                    ? "text-red-400"
                    : "text-slate-400"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp size={14} />
              ) : trend === "down" ? (
                <TrendingDown size={14} />
              ) : null}
            </div>
          )}
          {onClick && (
            <button
              onClick={onClick}
              className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
              title="توضیحات"
            >
              <Eye size={13} />
            </button>
          )}
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white font-black text-2xl">{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function AlertCard({ alert, onUpdate }: { alert: any; onUpdate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const color = SEVERITY_COLOR[alert.severity] || "#94a3b8";
  const bg = SEVERITY_BG[alert.severity] || "rgba(148,163,184,0.1)";

  const handleStatus = async (status: string) => {
    setLoading(true);
    try {
      await api(`/api/crm/alerts/${alert.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      onUpdate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl border p-4 transition-all"
      style={{ background: bg, borderColor: `${color}30` }}
    >
      <div
        className="flex items-start gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${color}20` }}
        >
          <AlertTriangle size={16} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className="text-xs font-black px-2 py-0.5 rounded-full"
              style={{ background: `${color}25`, color }}
            >
              {alert.severity?.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {STATUS_LABEL[alert.status] || alert.status}
            </span>
            <span className="text-xs text-slate-500">
              {new Date(alert.created_at).toLocaleDateString("fa-IR", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="text-white font-bold text-sm">{alert.title}</p>
        </div>
        <div className="flex items-center gap-1">
          <span
            className="text-xs font-black px-2 py-1 rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}
          >
            {alert.risk_score}%
          </span>
          {expanded ? (
            <ChevronUp size={16} className="text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-slate-700/30 pt-3">
          <div>
            <p className="text-slate-400 text-xs font-bold mb-1">تحلیل AI</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              {alert.ai_analysis}
            </p>
          </div>
          {alert.recommendation && (
            <div>
              <p className="text-slate-400 text-xs font-bold mb-1">
                پیشنهاد اقدام
              </p>
              <p className="text-green-300 text-sm leading-relaxed">
                {alert.recommendation}
              </p>
            </div>
          )}
          {alert.status === "open" && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleStatus("resolved")}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-all"
              >
                <CheckCircle size={13} /> حل شد
              </button>
              <button
                onClick={() => handleStatus("reviewed")}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-all"
              >
                <Eye size={13} /> بررسی کردم
              </button>
              <button
                onClick={() => handleStatus("ignored")}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-500/15 text-slate-400 hover:bg-slate-500/25 transition-all"
              >
                <XCircle size={13} /> نادیده
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Mini Bar Chart ────────────────────────────────────────────────────────────
function MiniBar({
  data,
  valueKey,
  labelKey,
  color = "#f97316",
}: {
  data: any[];
  valueKey: string;
  labelKey: string;
  color?: string;
}) {
  if (!data?.length)
    return (
      <p className="text-slate-500 text-xs text-center py-4">داده‌ای نیست</p>
    );
  const max = Math.max(...data.map((d) => Number(d[valueKey]) || 0)) || 1;

  return (
    <div className="space-y-2">
      {data.slice(0, 8).map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-slate-400 text-xs w-28 truncate text-right flex-shrink-0">
            {d[labelKey]}
          </span>
          <div className="flex-1 h-5 rounded-full bg-slate-700/50 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.max(2, (Number(d[valueKey]) / max) * 100)}%`,
                background: color,
                opacity: 0.85,
              }}
            />
          </div>
          <span className="text-slate-300 text-xs font-bold w-12 text-left flex-shrink-0">
            {Number(d[valueKey]).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Daily Trend Chart ─────────────────────────────────────────────────────────
function TrendChart({ data }: { data: any[] }) {
  if (!data?.length) return null;
  const maxTotal = Math.max(...data.map((d) => d.total || 0)) || 1;

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-1 h-32">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-1 group"
          >
            <div
              className="relative w-full flex flex-col justify-end"
              style={{ height: "100px" }}
            >
              {/* خطاها */}
              <div
                className="w-full rounded-t-sm absolute bottom-0 opacity-60"
                style={{
                  height: `${Math.max(2, (d.errors / maxTotal) * 100)}%`,
                  background: "#ef4444",
                }}
              />
              {/* کل */}
              <div
                className="w-full rounded-t-sm"
                style={{
                  height: `${Math.max(2, (d.total / maxTotal) * 100)}%`,
                  background: "rgba(249,115,22,0.5)",
                  border: "1px solid rgba(249,115,22,0.3)",
                }}
              />
            </div>
            <span className="text-[10px] text-slate-500 truncate w-full text-center">
              {d.date}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-orange-500/50" />
          کل رویدادها
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-500/60" />
          خطاها
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// صفحه اصلی
// ═══════════════════════════════════════════════════════════════════════════════
export default function CrmDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [alerts, setAlerts] = useState<any>(null);
  const [churnUsers, setChurn] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "alerts" | "churn" | "endpoints"
  >("overview");
  const [days, setDays] = useState(7);
  const [infoModal, setInfoModal] = useState<{ title: string; content: string } | null>(null);
  const [selectedChurnUser, setSelectedChurnUser] = useState<any>(null);
  const [aiModal, setAiModal] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [dash, al, churn] = await Promise.all([
        api(`/api/crm/dashboard?days=${days}`),
        api(`/api/crm/alerts?limit=30`),
        api(`/api/crm/churn-risk`),
      ]);
      setData(dash);
      setAlerts(al);
      setChurn(churn || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalyzeResult(null);
    try {
      const result = await api(`/api/crm/analyze`, {
        method: "POST",
        body: JSON.stringify({ hours: days * 24 }),
      });
      setAnalyzeResult(result.message);
      setAiModal(result.message);
      await loadAll();
    } catch (err: any) {
      setAnalyzeResult("خطا در تحلیل: " + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const s = data?.summary;
  const openAlerts =
    alerts?.data?.filter((a: any) => a.status === "open") || [];
  const criticalCount = openAlerts.filter(
    (a: any) => a.severity === "critical",
  ).length;

  return (
    <div className="min-h-screen p-4 md:p-8 pb-32 overflow-y-auto" dir="rtl">
      {/* ── مودال توضیحات ── */}
      {infoModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={() => setInfoModal(null)}>
          <div className="w-full max-w-md max-h-[82dvh] overflow-y-auto rounded-3xl p-6 shadow-2xl" style={{ background: "linear-gradient(145deg,#1B2A4A,#0d1e35)", border: "1px solid rgba(255,255,255,0.1)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-black text-lg">{infoModal.title}</h3>
              <button onClick={() => setInfoModal(null)} className="text-slate-400 hover:text-white"><XCircle size={20} /></button>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{infoModal.content}</p>
            <button onClick={() => setInfoModal(null)} className="mt-5 w-full py-3 rounded-2xl text-sm font-black text-white" style={{ background: "linear-gradient(135deg,#FF6B00,#FF9A3C)" }}>متوجه شدم</button>
          </div>
        </div>
      )}

      {/* ── مودال تحلیل AI ── */}
      {aiModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={() => setAiModal(null)}>
          <div className="w-full max-w-lg max-h-[82dvh] overflow-y-auto rounded-3xl p-6 shadow-2xl" style={{ background: "linear-gradient(145deg,#1B2A4A,#0d1e35)", border: "1px solid rgba(255,255,255,0.1)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain size={20} className="text-purple-400" />
                <h3 className="text-white font-black text-lg">تحلیل هوش مصنوعی</h3>
              </div>
              <button onClick={() => setAiModal(null)} className="text-slate-400 hover:text-white"><XCircle size={20} /></button>
            </div>
            <div className="bg-purple-500/10 rounded-2xl p-4 border border-purple-500/20">
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{aiModal}</p>
            </div>
            <button onClick={() => setAiModal(null)} className="mt-4 w-full py-3 rounded-2xl text-sm font-black text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}>بستن</button>
          </div>
        </div>
      )}

      {/* ── مودال کاربر در خطر ریزش ── */}
      {selectedChurnUser && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={() => setSelectedChurnUser(null)}>
          <div className="w-full max-w-md max-h-[82dvh] overflow-y-auto rounded-3xl p-6 shadow-2xl" style={{ background: "linear-gradient(145deg,#1B2A4A,#0d1e35)", border: "1px solid rgba(255,255,255,0.1)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} className="text-yellow-400" />
                <h3 className="text-white font-black text-lg">رفتار کاربر در سایت</h3>
              </div>
              <button onClick={() => setSelectedChurnUser(null)} className="text-slate-400 hover:text-white"><XCircle size={20} /></button>
            </div>

            <div className="space-y-3 mb-5">
              <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-slate-400 text-xs mb-1">شناسه کاربر</p>
                <p className="text-white font-mono text-sm">{selectedChurnUser.user_id}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-3" style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)" }}>
                  <p className="text-slate-400 text-xs mb-1">آخرین فعالیت</p>
                  <p className="text-yellow-400 font-bold text-sm">{selectedChurnUser.last_active ? new Date(selectedChurnUser.last_active).toLocaleDateString("fa-IR") : "—"}</p>
                </div>
                <div className="rounded-2xl p-3" style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
                  <p className="text-slate-400 text-xs mb-1">تعداد اقدام</p>
                  <p className="text-orange-400 font-bold text-sm">{Number(selectedChurnUser.total_actions || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <p className="text-red-400 font-bold text-sm mb-2">⚠️ دلایل خطر ریزش:</p>
              <ul className="text-slate-300 text-xs space-y-1.5">
                <li>• بیش از ۱۴ روز است که وارد سیستم نشده</li>
                <li>• تعداد رزرو‌های تکمیل‌شده پایین است</li>
                <li>• آخرین تعامل با پلتفرم منجر به خرید نشده</li>
                <li>• الگوی رفتاری مشابه کاربران ریزش‌کرده قبلی</li>
              </ul>
            </div>

            <div className="rounded-2xl p-4" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <p className="text-green-400 font-bold text-sm mb-2">💡 پیشنهاد اقدام:</p>
              <p className="text-slate-300 text-xs">ارسال پیام شخصی‌سازی‌شده یا تخفیف ویژه برای این کاربر می‌تواند نرخ بازگشت را تا ۳۵٪ افزایش دهد.</p>
            </div>

            <button onClick={() => setSelectedChurnUser(null)} className="mt-4 w-full py-3 rounded-2xl text-sm font-black text-white" style={{ background: "linear-gradient(135deg,#FF6B00,#FF9A3C)" }}>بستن</button>
          </div>
        </div>
      )}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              }}
            >
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-2xl">داشبورد CRM</h1>
              <p className="text-slate-400 text-sm">
                تحلیل رفتار کاربران · هوش مصنوعی
              </p>
            </div>
          </div>
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 w-fit">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-red-400 text-xs font-bold">
                {criticalCount} هشدار بحرانی باز
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* انتخاب بازه زمانی */}
          <div
            className="flex items-center rounded-xl overflow-hidden border border-slate-700/50"
            style={{ background: "rgba(15,23,42,0.7)" }}
          >
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-2 text-xs font-bold transition-all ${
                  days === d
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {d} روز
              </button>
            ))}
          </div>

          {/* دکمه تحلیل AI */}
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            style={{
              background: analyzing
                ? "rgba(99,102,241,0.4)"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
            }}
          >
            {analyzing ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Brain size={16} />
            )}
            {analyzing ? "در حال تحلیل..." : "تحلیل AI اکنون"}
          </button>

          {/* دکمه رفرش */}
          <button
            onClick={loadAll}
            disabled={loading}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all border border-slate-700/50"
            style={{ background: "rgba(15,23,42,0.7)" }}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* نتیجه تحلیل - نمایش در مودال */}
      {analyzeResult && !aiModal && (
        <div
          className="mb-6 p-4 rounded-2xl border flex items-start gap-3 cursor-pointer hover:opacity-80 transition-all"
          style={{
            background: analyzeResult.includes("نرمال")
              ? "rgba(34,197,94,0.08)"
              : "rgba(249,115,22,0.08)",
            borderColor: analyzeResult.includes("نرمال")
              ? "rgba(34,197,94,0.3)"
              : "rgba(249,115,22,0.3)",
          }}
          onClick={() => setAiModal(analyzeResult)}
        >
          {analyzeResult.includes("نرمال") ? (
            <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle size={20} className="text-orange-400 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-slate-300 text-sm font-medium line-clamp-2">{analyzeResult}</p>
            <p className="text-slate-500 text-xs mt-1">کلیک کنید تا تحلیل کامل را ببینید ↗</p>
          </div>
        </div>
      )}

      {loading && !data ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw size={32} className="text-indigo-400 animate-spin" />
            <p className="text-slate-400">در حال بارگذاری...</p>
          </div>
        </div>
      ) : (
        <>
          {/* ── کارت‌های آمار ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Activity}
              label="کل رویدادها"
              value={(s?.totalEvents || 0).toLocaleString()}
              sub={`${days} روز گذشته`}
              color="#6366f1"
              onClick={() => {
                const total = s?.totalEvents || 0;
                const daily = days > 0 ? Math.round(total / days) : 0;
                setInfoModal({ title: "کل رویدادها", content: `کل رویدادها نشان‌دهنده مجموع تمام فعالیت‌های ثبت‌شده در سیستم در بازه زمانی انتخابی است.\n\n📊 آمار جاری:\n• کل رویدادها: ${total.toLocaleString()}\n• بازه زمانی: ${days} روز گذشته\n• میانگین روزانه: ${daily.toLocaleString()} رویداد\n\nافزایش این عدد نشان‌دهنده رشد فعالیت کاربران است. رویدادها شامل ورود به سایت، جستجو، رزرو و سایر تعاملات می‌شوند.` });
              }}
            />
            <StatCard
              icon={AlertTriangle}
              label="نرخ خطا"
              value={`${s?.errorRate || 0}%`}
              sub={`${(s?.errorEvents || 0).toLocaleString()} خطا`}
              color={s?.errorRate > 5 ? "#ef4444" : "#22c55e"}
              trend={s?.errorRate > 5 ? "down" : "up"}
              onClick={() => {
                const rate = s?.errorRate || 0;
                const errors = s?.errorEvents || 0;
                const status = rate < 2 ? "✅ طبیعی - وضعیت ایده‌آل" : rate < 5 ? "⚠️ نیاز به توجه" : "🔴 بحرانی - اقدام فوری لازم";
                setInfoModal({ title: "نرخ خطا", content: `نرخ خطا درصد درخواست‌هایی است که با خطا مواجه شده‌اند.\n\n❌ وضعیت جاری:\n• نرخ خطا: ${rate}٪\n• تعداد خطاها: ${errors.toLocaleString()}\n• وضعیت: ${status}\n\n📌 تفسیر:\n• زیر ۲٪: کاملاً طبیعی\n• ۲-۵٪: باید بررسی شود\n• بالای ۵٪: نیاز به اقدام فوری\n\nخطاهای ۴xx معمولاً از سمت کلاینت و ۵xx از سمت سرور هستند.` });
              }}
            />
            <StatCard
              icon={Clock}
              label="میانگین زمان API"
              value={`${s?.avgResponseTime || 0}ms`}
              sub={s?.avgResponseTime > 1000 ? "⚠️ کند" : "✅ نرمال"}
              color={s?.avgResponseTime > 1000 ? "#f97316" : "#22c55e"}
              onClick={() => {
                const rt = s?.avgResponseTime || 0;
                const status = rt < 300 ? "✅ عالی" : rt < 1000 ? "✅ نرمال" : rt < 2000 ? "⚠️ کند - بررسی شود" : "🔴 بسیار کند - اقدام فوری";
                setInfoModal({ title: "میانگین زمان پاسخ API", content: `میانگین زمان پاسخ API نشان می‌دهد سرور به طور میانگین چه مدت طول می‌کشد تا به درخواست‌ها پاسخ دهد.\n\n⏱️ وضعیت جاری:\n• زمان فعلی: ${rt}ms\n• وضعیت: ${status}\n\n📌 استانداردها:\n• زیر ۳۰۰ms: عالی\n• ۳۰۰-۱۰۰۰ms: قابل قبول\n• ۱۰۰۰-۲۰۰۰ms: کند\n• بالای ۲۰۰۰ms: بحرانی\n\nزمان‌های بالا می‌توانند به دلیل بار بالای سرور، کوئری‌های کند یا مشکل در پایگاه داده باشد.` });
              }}
            />
            <StatCard
              icon={ShieldAlert}
              label="هشدار باز"
              value={s?.openAlerts || 0}
              sub={`${s?.criticalAlerts || 0} بحرانی`}
              color={s?.criticalAlerts > 0 ? "#ef4444" : "#f97316"}
              onClick={() => {
                const open = s?.openAlerts || 0;
                const critical = s?.criticalAlerts || 0;
                const status = critical > 0 ? "🔴 نیاز به اقدام فوری" : open > 5 ? "⚠️ تعداد زیاد - بررسی شود" : open > 0 ? "⚠️ نیاز به پیگیری" : "✅ همه چیز مرتب است";
                setInfoModal({ title: "هشدارهای باز", content: `هشدارهای باز مواردی هستند که هوش مصنوعی آنها را شناسایی کرده و هنوز بررسی یا حل نشده‌اند.\n\n🚨 وضعیت جاری:\n• هشدارهای باز: ${open}\n• هشدارهای بحرانی: ${critical}\n• وضعیت کلی: ${status}\n\n📌 انواع هشدار:\n• بحرانی (Critical): نیاز به اقدام فوری\n• بالا (High): باید در ۲۴ ساعت بررسی شود\n• متوسط (Medium): بررسی در ۷۲ ساعت\n• پایین (Low): اطلاع‌رسانی\n\nبرای بررسی جزئیات به تب «هشدارها» بروید.` });
              }}
            />
          </div>

          {/* ── تب‌ها ── */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {[
              { key: "overview", label: "نمای کلی", icon: BarChart2 },
              {
                key: "alerts",
                label: `هشدارها (${openAlerts.length})`,
                icon: AlertTriangle,
              },
              {
                key: "churn",
                label: `ریزش (${churnUsers.length})`,
                icon: Users,
              },
              { key: "endpoints", label: "Endpoints", icon: Zap },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === key
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                }`}
                style={
                  activeTab === key
                    ? {
                        background: "rgba(99,102,241,0.2)",
                        border: "1px solid rgba(99,102,241,0.4)",
                      }
                    : {
                        background: "rgba(15,23,42,0.5)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }
                }
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* ── تب نمای کلی ── */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* روند روزانه */}
              <div
                className="rounded-2xl p-6 border border-slate-700/40"
                style={{ background: "rgba(15,23,42,0.7)" }}
              >
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-indigo-400" />
                  روند {days} روز گذشته
                  <button
                    onClick={() => {
                    const trend = data?.dailyTrend || [];
                    const totalEvents = trend.reduce((s:number,d:any)=>s+(d.total||0),0);
                    const totalErrors = trend.reduce((s:number,d:any)=>s+(d.errors||0),0);
                    const peakDay = trend.length ? trend.reduce((a:any,b:any)=>(a.total||0)>(b.total||0)?a:b,{date:"",total:0}) : null;
                    setInfoModal({ title: `روند ${days} روز گذشته`, content: `این نمودار تعداد فعالیت‌های کاربران در ${days} روز گذشته را نشان می‌دهد.\n\n📊 آمار این بازه:\n• کل رویدادها: ${totalEvents.toLocaleString()}\n• کل خطاها: ${totalErrors.toLocaleString()}\n• نرخ خطا: ${totalEvents>0?Math.round(totalErrors/totalEvents*100):0}٪${peakDay?.date?"\n• پرترافیک‌ترین روز: "+peakDay.date+" با "+peakDay.total+" رویداد":""}\n\nروند صعودی نشان‌دهنده رشد استفاده از پلتفرم است. از این نمودار برای شناسایی الگوهای فصلی استفاده کنید.` });
                  }}
                    className="mr-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    title="توضیحات"
                  >
                    <Eye size={14} />
                  </button>
                </h3>
                <TrendChart data={data?.dailyTrend || []} />
              </div>

              {/* توزیع نوع رویدادها */}
              <div
                className="rounded-2xl p-6 border border-slate-700/40"
                style={{ background: "rgba(15,23,42,0.7)" }}
              >
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-orange-400" />
                  توزیع رویدادها
                  <button
                    onClick={() => {
                    const types = data?.eventTypeBreakdown || [];
                    const top = types.length ? types.reduce((a:any,b:any)=>(Number(a.count)||0)>(Number(b.count)||0)?a:b,{type:"",count:0}) : null;
                    const totalCount = types.reduce((s:number,d:any)=>s+(Number(d.count)||0),0);
                    setInfoModal({ title: "توزیع رویدادها", content: `این نمودار توزیع رویدادها بر اساس دسته‌بندی‌های مختلف را نشان می‌دهد.\n\n📊 آمار جاری:\n• کل رویدادهای ثبت‌شده: ${totalCount.toLocaleString()}\n• تعداد دسته‌بندی فعال: ${types.length}${top?.type?"\n• پرطرفدارترین: "+top.type+" با "+top.count+" رویداد":""}\n\nاز این داده برای برنامه‌ریزی رویدادهای آینده و تخصیص منابع استفاده کنید.` });
                  }}
                    className="mr-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Eye size={14} />
                  </button>
                </h3>
                <MiniBar
                  data={data?.eventTypeBreakdown || []}
                  valueKey="count"
                  labelKey="type"
                  color="#f97316"
                />
              </div>

              {/* صفحات پربازدید */}
              <div
                className="rounded-2xl p-6 border border-slate-700/40"
                style={{ background: "rgba(15,23,42,0.7)" }}
              >
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Globe size={18} className="text-blue-400" />
                  صفحات پربازدید
                  <button
                    onClick={() => {
                    const pages = data?.topPages || [];
                    const top = pages.length ? pages.reduce((a:any,b:any)=>(Number(a.count)||0)>(Number(b.count)||0)?a:b,{path:"",count:0}) : null;
                    const totalViews = pages.reduce((s:number,d:any)=>s+(Number(d.count)||0),0);
                    setInfoModal({ title: "صفحات پربازدید", content: `این نمودار پربازدیدترین صفحات پلتفرم را نشان می‌دهد.\n\n📊 آمار جاری:\n• کل بازدیدها: ${totalViews.toLocaleString()}\n• تعداد صفحات رصدشده: ${pages.length}${top?.path?"\n• پربازدیدترین: "+top.path+" با "+top.count+" بازدید":""}\n\nصفحاتی که بازدید بیشتری دارند باید بهینه‌سازی شده و محتوای مشابه تولید شود.` });
                  }}
                    className="mr-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Eye size={14} />
                  </button>
                </h3>
                <MiniBar
                  data={data?.topPages || []}
                  valueKey="count"
                  labelKey="path"
                  color="#3b82f6"
                />
              </div>

              {/* آخرین هشدارها */}
              <div
                className="rounded-2xl p-6 border border-slate-700/40"
                style={{ background: "rgba(15,23,42,0.7)" }}
              >
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Brain size={18} className="text-purple-400" />
                  آخرین تحلیل‌های AI
                  <button
                    onClick={() => {
                    const recentA = data?.recentAlerts || [];
                    const critCount = openAlerts.filter((a:any)=>a.severity==="critical").length;
                    setInfoModal({ title: "تحلیل‌های هوش مصنوعی", content: `این بخش آخرین هشدارها و تحلیل‌های تولید شده توسط سیستم هوش مصنوعی راوی را نشان می‌دهد.\n\n🤖 آمار جاری:\n• کل هشدارهای باز: ${openAlerts.length}\n• هشدارهای بحرانی: ${critCount}\n• آخرین تحلیل‌های ثبت‌شده: ${recentA.length} مورد\n\nهوش مصنوعی رفتار کاربران و الگوهای استفاده را به صورت خودکار تحلیل می‌کند. برای مشاهده جزئیات روی هر هشدار کلیک کنید.` });
                  }}
                    className="mr-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Eye size={14} />
                  </button>
                </h3>
                <div className="space-y-3">
                  {(data?.recentAlerts || []).length === 0 ? (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle size={16} />
                      هیچ هشداری ثبت نشده — سیستم سالم است
                    </div>
                  ) : (
                    (data?.recentAlerts || []).map((a: any) => (
                      <button
                        key={a.id}
                        onClick={() => setAiModal(a.ai_analysis || a.title || "تحلیل در دسترس نیست")}
                        className="flex items-start gap-2 w-full text-right hover:bg-white/5 rounded-xl p-1 transition-all"
                      >
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                          style={{ background: SEVERITY_COLOR[a.severity] || "#94a3b8" }}
                        />
                        <div className="flex-1">
                          <p className="text-slate-300 text-sm">{a.title}</p>
                          <p className="text-slate-500 text-xs">
                            {new Date(a.created_at).toLocaleDateString("fa-IR")} · کلیک برای جزئیات
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── تب هشدارها ── */}
          {activeTab === "alerts" && (
            <div className="space-y-3">
              {(alerts?.data || []).length === 0 ? (
                <div
                  className="rounded-2xl p-8 border border-green-500/20 flex flex-col items-center gap-3"
                  style={{ background: "rgba(34,197,94,0.05)" }}
                >
                  <CheckCircle size={40} className="text-green-400" />
                  <p className="text-green-300 font-bold">
                    هیچ هشداری وجود ندارد
                  </p>
                  <p className="text-slate-400 text-sm">
                    سیستم در وضعیت نرمال کار می‌کند
                  </p>
                </div>
              ) : (
                (alerts?.data || []).map((a: any) => (
                  <AlertCard key={a.id} alert={a} onUpdate={loadAll} />
                ))
              )}
            </div>
          )}

          {/* ── تب کاربران در خطر ریزش ── */}
          {activeTab === "churn" && (
            <div
              className="rounded-2xl border border-slate-700/40 overflow-hidden"
              style={{ background: "rgba(15,23,42,0.7)" }}
            >
              <div className="p-4 border-b border-slate-700/40 flex items-center gap-2">
                <Users size={18} className="text-yellow-400" />
                <h3 className="text-white font-bold">کاربران در خطر ریزش</h3>
                <span className="mr-auto text-xs text-slate-400">
                  (فعال در ۳۰ روز، غیرفعال ۱۴+ روز)
                </span>
              </div>
              {churnUsers.length === 0 ? (
                <div className="p-8 flex flex-col items-center gap-2">
                  <CheckCircle size={32} className="text-green-400" />
                  <p className="text-slate-400">کاربری در خطر ریزش نیست</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/40">
                        <th className="text-right text-slate-400 font-bold px-4 py-3 text-xs">
                          کاربر
                        </th>
                        <th className="text-right text-slate-400 font-bold px-4 py-3 text-xs">
                          آخرین فعالیت
                        </th>
                        <th className="text-right text-slate-400 font-bold px-4 py-3 text-xs">
                          تعداد اقدام
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {churnUsers.map((u, i) => (
                        <tr
                          key={i}
                          className="border-b border-slate-700/20 hover:bg-slate-700/20 transition-colors cursor-pointer"
                          onClick={() => setSelectedChurnUser(u)}
                        >
                          <td className="px-4 py-3 text-slate-300 font-mono text-xs">
                            {u.user_id?.slice(0, 8)}...
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs">
                            {u.last_active
                              ? new Date(u.last_active).toLocaleDateString(
                                  "fa-IR",
                                )
                              : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-bold text-orange-400">
                              {Number(u.total_actions).toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── تب Endpoints ── */}
          {activeTab === "endpoints" && (
            <div className="grid grid-cols-1 gap-6 pb-32">
              {/* فعال‌ترین endpoint ها */}
              <div
                className="rounded-2xl p-6 border border-slate-700/40"
                style={{ background: "rgba(15,23,42,0.7)" }}
              >
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Zap size={18} className="text-yellow-400" />
                  فعال‌ترین API Endpoints
                </h3>
                {(data?.topEndpoints || []).length === 0 ? (
                  <p className="text-slate-500 text-sm">داده‌ای ثبت نشده</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700/40">
                          <th className="text-right text-slate-400 font-bold py-2 text-xs">
                            Endpoint
                          </th>
                          <th className="text-right text-slate-400 font-bold py-2 px-4 text-xs">
                            تعداد
                          </th>
                          <th className="text-right text-slate-400 font-bold py-2 px-4 text-xs">
                            میانگین ms
                          </th>
                          <th className="text-right text-slate-400 font-bold py-2 text-xs">
                            وضعیت
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(data?.topEndpoints || []).map((e: any, i: number) => {
                          const ms = Math.round(Number(e.avg_ms) || 0);
                          const slow = ms > 2000;
                          return (
                            <tr
                              key={i}
                              className="border-b border-slate-700/20 hover:bg-slate-700/10"
                            >
                              <td className="py-2.5 text-slate-300 font-mono text-xs max-w-xs truncate">
                                {e.endpoint}
                              </td>
                              <td className="py-2.5 px-4 text-orange-400 font-bold text-xs">
                                {Number(e.count).toLocaleString()}
                              </td>
                              <td className="py-2.5 px-4 text-xs">
                                <span
                                  className={
                                    slow
                                      ? "text-red-400 font-bold"
                                      : "text-green-400"
                                  }
                                >
                                  {ms}ms
                                </span>
                              </td>
                              <td className="py-2.5">
                                {slow ? (
                                  <span className="text-xs bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full font-bold">
                                    کند
                                  </span>
                                ) : (
                                  <span className="text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full font-bold">
                                    OK
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* آمار عملکرد */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl p-5 border border-slate-700/40 flex flex-col gap-3" style={{ background: "rgba(15,23,42,0.7)" }}>
                  <div className="flex items-center justify-between">
                    <Cpu size={20} style={{ color: "#6366f1" }} />
                    <button onClick={() => {
                    const sessions = s?.uniqueSessions || 0;
                    const total = s?.totalEvents || 1;
                    const ratio = Math.round(total/Math.max(sessions,1)*10)/10;
                    setInfoModal({ title: "جلسات یکتا", content: `تعداد جلسات یکتا (Unique Sessions) نشان می‌دهد چند نفر مجزا از پلتفرم استفاده کرده‌اند.\n\n📊 آمار جاری:\n• جلسات یکتا: ${sessions.toLocaleString()}\n• میانگین رویداد به ازای هر جلسه: ${ratio}\n\nافزایش این عدد نشان‌دهنده رشد کاربران فعال است.` });
                  }} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"><Eye size={13} /></button>
                  </div>
                  <div>
                    <p className="text-white font-black text-2xl">{(s?.uniqueSessions || 0).toLocaleString()}</p>
                    <p className="text-slate-400 text-xs mt-0.5">جلسات یکتا</p>
                  </div>
                </div>

                <div className="rounded-2xl p-5 border border-slate-700/40 flex flex-col gap-3" style={{ background: "rgba(15,23,42,0.7)" }}>
                  <div className="flex items-center justify-between">
                    <Clock size={20} style={{ color: "#f97316" }} />
                    <button onClick={() => {
                    const rt = s?.avgResponseTime || 0;
                    const status = rt < 500 ? "✅ عالی" : rt < 2000 ? "⚠️ متوسط" : "🔴 کند";
                    setInfoModal({ title: "میانگین زمان پاسخ", content: `میانگین زمان پاسخ API نشان می‌دهد سرور چه مدت به درخواست‌ها پاسخ می‌دهد.\n\n⏱️ وضعیت جاری:\n• زمان فعلی: ${rt}ms (${status})\n• استاندارد مطلوب: زیر ۵۰۰ms\n• محدوده قابل قبول: ۵۰۰-۲۰۰۰ms\n\nمقادیر بالای ۲۰۰۰ms نیاز به بررسی سرور یا پایگاه داده دارند.` });
                  }} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"><Eye size={13} /></button>
                  </div>
                  <div>
                    <p className="text-white font-black text-2xl">{s?.avgResponseTime || 0}ms</p>
                    <p className="text-slate-400 text-xs mt-0.5">میانگین پاسخ</p>
                  </div>
                </div>

                <div className="rounded-2xl p-5 border border-slate-700/40 flex flex-col gap-3" style={{ background: "rgba(15,23,42,0.7)" }}>
                  <div className="flex items-center justify-between">
                    <Activity size={20} style={{ color: "#ef4444" }} />
                    <button onClick={() => {
                    const errors = s?.errorEvents || 0;
                    const total = s?.totalEvents || 1;
                    const rate = s?.errorRate || 0;
                    const errStatus = rate < 2 ? "✅ طبیعی" : rate < 5 ? "⚠️ نیاز به توجه" : "🔴 بحرانی";
                    setInfoModal({ title: "خطاهای API", content: `تعداد خطاهای API نشان می‌دهد چه تعداد درخواست به خطا منجر شده است.\n\n❌ آمار جاری:\n• تعداد خطاها: ${errors.toLocaleString()}\n• از کل ${total.toLocaleString()} رویداد\n• نرخ خطا: ${rate}٪ (${errStatus})\n\nخطاهای ۴xx مشکل کلاینت و خطاهای ۵xx مشکل سرور هستند.` });
                  }} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"><Eye size={13} /></button>
                  </div>
                  <div>
                    <p className="text-white font-black text-2xl">{(s?.errorEvents || 0).toLocaleString()}</p>
                    <p className="text-slate-400 text-xs mt-0.5">خطاهای API</p>
                  </div>
                </div>

                <div className="rounded-2xl p-5 border border-slate-700/40 flex flex-col gap-3" style={{ background: "rgba(15,23,42,0.7)" }}>
                  <div className="flex items-center justify-between">
                    <CheckCircle size={20} style={{ color: "#22c55e" }} />
                    <button onClick={() => {
                    const rate = 100 - (s?.errorRate || 0);
                    const rateStatus = rate >= 98 ? "✅ عالی" : rate >= 95 ? "⚠️ قابل قبول" : "🔴 نیاز به بررسی فوری";
                    setInfoModal({ title: "نرخ موفقیت", content: `نرخ موفقیت درصد درخواست‌هایی است که بدون خطا پاسخ دریافت کرده‌اند.\n\n✅ آمار جاری:\n• نرخ موفقیت: ${rate}٪ (${rateStatus})\n• معیار ایده‌آل: بالای ۹۸٪\n• معیار قابل قبول: ۹۵-۹۸٪\n\nاین معیار یکی از مهم‌ترین شاخص‌های سلامت فنی پلتفرم است.` });
                  }} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"><Eye size={13} /></button>
                  </div>
                  <div>
                    <p className="text-white font-black text-2xl">{100 - (s?.errorRate || 0)}%</p>
                    <p className="text-slate-400 text-xs mt-0.5">نرخ موفقیت</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
