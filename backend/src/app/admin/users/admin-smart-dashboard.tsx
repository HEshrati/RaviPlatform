"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { isAdminPhone } from "@/lib/api";
import {
  Brain, Users, TrendingUp, AlertTriangle, CheckCircle2,
  Sparkles, BarChart2, Star, RefreshCw, XCircle,
  UserX, FileText, Activity, Zap, Target, MapPin,
  Heart, MessageCircle, Calendar, ChevronRight,
  Shield, Eye, Coffee, Mountain, Film, Music, Trophy
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const CARD = {
  background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
};

const INTEREST_ICONS: Record<string, any> = {
  "سینما": Film,
  "کوهنوردی": Mountain,
  "کافه": Coffee,
  "موسیقی": Music,
  "بازی": Trophy,
};

function StatCard({
  icon, value, label, color = "orange", sub,
}: {
  icon: React.ReactNode; value: string | number; label: string; color?: string; sub?: string;
}) {
  const colors: Record<string, string> = {
    orange: "#FF6B00", green: "#22c55e", blue: "#3b82f6",
    red: "#ef4444", purple: "#a855f7",
  };
  return (
    <div className="rounded-2xl p-5 relative overflow-hidden" style={CARD}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `rgba(${color === "orange" ? "255,107,0" : color === "green" ? "34,197,94" : color === "red" ? "239,68,68" : color === "purple" ? "168,85,247" : "59,130,246"},0.5)` }}
      />
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ background: `${colors[color]}20` }}
      >
        <div style={{ color: colors[color] }}>{icon}</div>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</p>
      {sub && <p className="text-[11px] mt-1" style={{ color: colors[color] }}>{sub}</p>}
    </div>
  );
}

function SectionTitle({ icon, title, badge }: { icon: React.ReactNode; title: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-black text-white flex items-center gap-2">
        {icon}{title}
      </h2>
      {badge && (
        <span className="text-xs px-2.5 py-1 rounded-full font-bold"
          style={{ background: "rgba(255,107,0,0.15)", color: "#FF9A3C", border: "1px solid rgba(255,107,0,0.3)" }}>
          {badge}
        </span>
      )}
    </div>
  );
}

export default function AdminSmartDashboard() {
  const { state } = useApp();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [suspended, setSuspended] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [patterns, setPatterns] = useState<any>(null);
  const [inactive, setInactive] = useState<number>(0);
  const [demandData, setDemandData] = useState<any[]>([]);
  const [weeklyReport, setWeeklyReport] = useState<any>(null);
  const [tab, setTab] = useState<"overview" | "suspended" | "demand" | "content">("overview");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    if (!state.isLoggedIn || !isAdminPhone(state.user?.mobileNumber)) {
      router.push("/dashboard");
    }
  }, [state.isLoggedIn]);

  useEffect(() => {
    if (state.isLoggedIn && isAdminPhone(state.user?.mobileNumber)) {
      loadAll();
    }
  }, [state.isLoggedIn]);

  async function loadAll() {
    setLoading(true);
    const [statsRes, suspendedRes, draftsRes, patternsRes, inactiveRes] = await Promise.allSettled([
      fetch(`${API_URL}/api/intelligence/stats`, { headers }).then((r) => r.json()),
      fetch(`${API_URL}/api/intelligence/suspended-users`, { headers }).then((r) => r.json()),
      fetch(`${API_URL}/api/content/admin/drafts`, { headers }).then((r) => r.json()),
      fetch(`${API_URL}/api/admin/analytics`, { headers }).then((r) => r.json()),
      fetch(`${API_URL}/api/admin/stats`, { headers }).then((r) => r.json()),
    ]);

    if (statsRes.status === "fulfilled") {
      setStats(statsRes.value);
      setDemandData(statsRes.value?.topInterests || []);
    }
    if (suspendedRes.status === "fulfilled") setSuspended(suspendedRes.value?.users || []);
    if (draftsRes.status === "fulfilled") setDrafts(Array.isArray(draftsRes.value) ? draftsRes.value : []);
    if (patternsRes.status === "fulfilled") setPatterns(patternsRes.value);
    if (inactiveRes.status === "fulfilled") setInactive(0);

    // ساخت گزارش هفتگی از داده‌ها
    if (patternsRes.status === "fulfilled") {
      const data = patternsRes.value;
      setWeeklyReport({
        newRegistrations: data?.totalUsers || 0,
        totalBookings: data?.totalBookings || 0,
        revenue: data?.totalRevenue || 0,
        topEvent: data?.topEvents?.[0]?.title || "—",
        returnRate: stats?.avgReturnRate || 0,
      });
    }

    setLoading(false);
  }

  async function unsuspendUser(userId: string) {
    await fetch(`${API_URL}/api/intelligence/unsuspend/${userId}`, {
      method: "PATCH",
      headers,
    });
    setSuspended((prev) => prev.filter((u) => u.user_id !== userId));
  }

  async function approveDraft(id: string) {
    await fetch(`${API_URL}/api/content/admin/approve/${id}`, { method: "POST", headers });
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }

  const TABS = [
    { id: "overview", label: "نمای کلی", icon: <BarChart2 size={14} /> },
    { id: "suspended", label: `ساسپند (${suspended.length})`, icon: <UserX size={14} /> },
    { id: "demand", label: "تقاضا", icon: <TrendingUp size={14} /> },
    { id: "content", label: `محتوا (${drafts.length})`, icon: <FileText size={14} /> },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">در حال بارگذاری داده‌های هوش مصنوعی...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-24 space-y-5 relative z-10" dir="rtl">
      {/* هدر */}
      <div className="rounded-3xl p-6" style={CARD}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <Brain size={22} className="text-orange-400" />
              داشبورد هوشمند
            </h1>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
              سیستم هوشمندسازی راوی — به‌روزرسانی لحظه‌ای
            </p>
          </div>
          <button
            onClick={loadAll}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <RefreshCw size={15} className="text-orange-400" />
          </button>
        </div>

        {/* تب‌ها */}
        <div className="flex gap-2 mt-5 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === t.id ? "bg-orange-500 text-white" : "text-slate-400"
              } ${t.id === "suspended" && suspended.length > 0 && tab !== "suspended" ? "relative" : ""}`}
              style={tab !== t.id ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" } : {}}
            >
              {t.icon}{t.label}
              {t.id === "suspended" && suspended.length > 0 && tab !== "suspended" && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-black">
                  {suspended.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── نمای کلی ── */}
      {tab === "overview" && (
        <>
          {/* آمار کلی */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Brain size={18} />}
              value={stats?.totalProfiles || 0}
              label="پروفایل هوشمند"
              color="orange"
            />
            <StatCard
              icon={<UserX size={18} />}
              value={suspended.length}
              label="ساسپند شده"
              color="red"
              sub={suspended.length > 0 ? "نیاز به بررسی" : "همه فعال"}
            />
            <StatCard
              icon={<TrendingUp size={18} />}
              value={`${stats?.avgReturnRate || 0}٪`}
              label="نرخ بازگشت"
              color="green"
            />
            <StatCard
              icon={<FileText size={18} />}
              value={drafts.length}
              label="محتوای در انتظار"
              color="purple"
            />
          </div>

          {/* توزیع تیپ‌های ارتباطی */}
          {stats?.communicationDist && (
            <div className="rounded-2xl p-5" style={CARD}>
              <SectionTitle icon={<Users size={16} className="text-orange-400" />} title="توزیع تیپ ارتباطی" />
              <div className="space-y-3">
                {[
                  { key: "introvert", label: "درون‌گرا", color: "#3b82f6", icon: <Eye size={14} /> },
                  { key: "extrovert", label: "برون‌گرا", color: "#f59e0b", icon: <Zap size={14} /> },
                  { key: "ambivert", label: "ترکیبی", color: "#8b5cf6", icon: <Activity size={14} /> },
                ].map(({ key, label, color, icon }) => {
                  const count = stats.communicationDist[key] || 0;
                  const total = Object.values(stats.communicationDist || {}).reduce((a: any, b: any) => a + b, 0) as number;
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span style={{ color }}>{icon}</span>{label}
                        </span>
                        <span className="text-xs font-bold" style={{ color }}>
                          {count} نفر ({pct}٪)
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* گزارش هفتگی */}
          {patterns && (
            <div className="rounded-2xl p-5" style={{
              ...CARD,
              border: "1px solid rgba(255,107,0,0.2)",
            }}>
              <SectionTitle
                icon={<Calendar size={16} className="text-orange-400" />}
                title="گزارش هفتگی"
                badge="Weekly Insight"
              />
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "کل کاربران", value: patterns.totalUsers || 0, color: "#FF6B00" },
                  { label: "کل رزروها", value: patterns.totalBookings || 0, color: "#22c55e" },
                  { label: "درآمد کل", value: `${Math.round((patterns.totalRevenue || 0) / 1000)}K`, color: "#3b82f6" },
                  { label: "رویدادهای فعال", value: patterns.totalEvents || 0, color: "#a855f7" },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="rounded-xl p-3"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <p className="text-lg font-black" style={{ color }}>{value}</p>
                    <p className="text-[11px] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
              {patterns.topEvents?.[0] && (
                <div
                  className="mt-3 rounded-xl p-3 flex items-center gap-2"
                  style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.15)" }}
                >
                  <Star size={14} className="text-orange-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400">محبوب‌ترین رویداد</p>
                    <p className="text-xs font-bold text-white">{patterns.topEvents[0].title}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── ساسپند شده‌ها ── */}
      {tab === "suspended" && (
        <div className="space-y-3">
          <div className="rounded-2xl p-4" style={{ ...CARD, border: "1px solid rgba(239,68,68,0.2)" }}>
            <p className="text-sm text-slate-300">
              کاربران زیر به دلیل <strong className="text-red-400">۲ بار غیبت</strong> ساسپند شده‌اند.
              برای رفع تعلیق روی دکمه کلیک کنید.
            </p>
          </div>

          {suspended.length === 0 ? (
            <div className="rounded-2xl p-8 text-center" style={CARD}>
              <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
              <p className="font-bold text-white">هیچ کاربر ساسپندی وجود ندارد</p>
            </div>
          ) : (
            suspended.map((user: any) => (
              <div
                key={user.user_id}
                className="rounded-2xl p-4"
                style={{ background: "linear-gradient(145deg, #2A1B1B, #1A0F0F)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)" }}>
                    <UserX size={18} className="text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-white text-sm">
                      {user.user?.name || user.name || `کاربر #${user.user_id?.slice(-6)}`}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                      <AlertTriangle size={9} className="inline ml-1 text-red-400" />
                      {user.no_show_count || 2} بار غیبت
                      {user.suspended_at && (
                        <span className="mr-2">• {new Date(user.suspended_at).toLocaleDateString("fa-IR")}</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => unsuspendUser(user.user_id)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                    style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}
                  >
                    <CheckCircle2 size={12} />
                    تأیید و رفع تعلیق
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── تقاضای کاربران ── */}
      {tab === "demand" && (
        <div className="space-y-4">
          <div className="rounded-2xl p-4" style={{ ...CARD, border: "1px solid rgba(34,197,94,0.2)" }}>
            <p className="text-sm text-slate-300">
              این داده‌ها از <strong className="text-green-400">رفتار کاربران در گروه‌های تلگرامی</strong> استخراج شده‌اند.
              پربازدیدترین نیازها برای رویداد بعدی:
            </p>
          </div>

          {demandData.length === 0 ? (
            <div className="rounded-2xl p-8 text-center" style={CARD}>
              <TrendingUp size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">داده کافی برای نمایش وجود ندارد</p>
              <p className="text-slate-500 text-xs mt-1">بعد از برگزاری چند رویداد داده جمع‌آوری می‌شود</p>
            </div>
          ) : (
            <div className="rounded-2xl p-5 space-y-3" style={CARD}>
              <SectionTitle
                icon={<Target size={16} className="text-orange-400" />}
                title="نیازهای پرتقاضای کاربران"
                badge={`${demandData.length} مورد`}
              />
              {demandData.map((item: any, i: number) => {
                const maxCount = demandData[0]?.count || 1;
                const pct = Math.round((item.count / maxCount) * 100);
                const IconComp = INTEREST_ICONS[item.interest] || Target;
                return (
                  <div key={item.interest || i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-white flex items-center gap-2">
                        <IconComp size={14} className="text-orange-400" />
                        {item.interest}
                      </span>
                      <span className="text-xs font-bold text-orange-400">{item.count} نفر</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: i === 0
                            ? "linear-gradient(90deg, #FF6B00, #FF8C00)"
                            : "rgba(255,107,0,0.6)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              <div
                className="mt-4 rounded-xl p-3 flex items-start gap-2"
                style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.15)" }}
              >
                <Sparkles size={14} className="text-orange-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  <strong className="text-orange-400">پیشنهاد هوشمند:</strong> بر اساس تقاضا، رویداد «{demandData[0]?.interest}» برای برگزاری در هفته آینده پیشنهاد می‌شود.
                </p>
              </div>
            </div>
          )}

          {/* فرم ثبت نیاز جدید برای کاربران - نمایش اطلاعات */}
          <div className="rounded-2xl p-5" style={CARD}>
            <SectionTitle
              icon={<MessageCircle size={16} className="text-blue-400" />}
              title="روش جمع‌آوری داده"
            />
            <div className="space-y-2">
              {[
                { icon: <MessageCircle size={12} />, text: "تحلیل متادیتای گروه‌های تلگرامی (بدون خواندن محتوا)" },
                { icon: <Star size={12} />, text: "نتایج نظرسنجی بعد از رویداد" },
                { icon: <Activity size={12} />, text: "رفتار کاربر در سایت (رویدادهای بازدید شده)" },
                { icon: <Shield size={12} />, text: "تست شخصیت و پرسشنامه‌های اختیاری" },
              ].map(({ icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-orange-400">{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── محتوای در انتظار ── */}
      {tab === "content" && (
        <div className="space-y-3">
          <div className="rounded-2xl p-4" style={{ ...CARD, border: "1px solid rgba(168,85,247,0.2)" }}>
            <p className="text-sm text-slate-300">
              محتوای تولید شده توسط AI که منتظر <strong className="text-purple-400">تأیید ادمین</strong> برای انتشار است.
            </p>
          </div>

          {drafts.length === 0 ? (
            <div className="rounded-2xl p-8 text-center" style={CARD}>
              <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
              <p className="font-bold text-white">همه محتوا تأیید شده</p>
              <p className="text-slate-400 text-sm mt-1">محتوای جدیدی در انتظار نیست</p>
            </div>
          ) : (
            drafts.slice(0, 5).map((draft: any) => (
              <div key={draft.id} className="rounded-2xl p-4 space-y-3" style={CARD}>
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(168,85,247,0.15)" }}>
                    <Sparkles size={14} className="text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm line-clamp-2">{draft.title}</p>
                    <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {draft.summary || draft.body?.slice(0, 100)}...
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {draft.tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(168,85,247,0.15)", color: "#c084fc" }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveDraft(draft.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition"
                    style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}
                  >
                    <CheckCircle2 size={12} /> تأیید و انتشار
                  </button>
                  <button
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
                  >
                    <XCircle size={12} /> رد
                  </button>
                </div>
              </div>
            ))
          )}

          {drafts.length > 5 && (
            <div className="text-center">
              <button
                onClick={() => router.push("/admin/content")}
                className="text-sm text-orange-400 hover:text-orange-300 font-bold"
              >
                مشاهده همه {drafts.length} محتوا ←
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
