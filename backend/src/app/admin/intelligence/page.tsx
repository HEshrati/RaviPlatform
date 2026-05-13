"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { isAdminPhone } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Brain, Users, UserX, FileText, CheckCircle2, XCircle,
  Sparkles, TrendingUp, Shield, MessageSquare, ArrowRight,
  RefreshCw, AlertCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const CARD = {
  background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)",
  border: "1px solid rgba(255,255,255,0.07)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
};

function StatCard({ label, value, icon, color = "orange" }: any) {
  return (
    <div className="rounded-2xl p-4 relative overflow-hidden" style={CARD}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `rgba(255,${color === "orange" ? "107,0" : "255,255"},0.4)` }} />
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-black text-white">{value}</span>
        <span className={`text-${color === "orange" ? "orange" : "blue"}-400`}>{icon}</span>
      </div>
      <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
    </div>
  );
}

export default function AdminIntelligencePage() {
  const { state } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "suspended" | "content" | "tickets">("overview");
  const [stats, setStats] = useState<any>(null);
  const [suspended, setSuspended] = useState<any[]>([]);
  const [pendingContent, setPendingContent] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = isAdminPhone(state.user?.mobileNumber);

  useEffect(() => {
    if (!state.isLoggedIn || !isAdmin) {
      router.push("/dashboard");
    }
  }, [state.isLoggedIn, isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    try {
      if (activeTab === "overview") {
        const res = await fetch(`${API_URL}/api/intelligence/stats`, { headers });
        if (res.ok) setStats(await res.json());
      } else if (activeTab === "suspended") {
        const res = await fetch(`${API_URL}/api/intelligence/suspended-users`, { headers });
        if (res.ok) {
          const data = await res.json();
          setSuspended(data.users || []);
        }
      } else if (activeTab === "content") {
        const res = await fetch(`${API_URL}/api/articles/admin/list?status=pending`, { headers });
        if (res.ok) {
          const data = await res.json();
          setPendingContent(Array.isArray(data) ? data : []);
        }
      } else if (activeTab === "tickets") {
        const res = await fetch(`${API_URL}/api/support/admin/tickets?status=pending_human`, { headers });
        if (res.ok) {
          const data = await res.json();
          setTickets(Array.isArray(data) ? data : []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function unsuspendUser(userId: string) {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/intelligence/unsuspend/${userId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    setSuspended((prev) => prev.filter((u) => u.user_id !== userId));
  }

  async function approveContent(id: string) {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/articles/admin/${id}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setPendingContent((prev) => prev.filter((c) => c.id !== id));
  }

  async function rejectContent(id: string) {
    const reason = prompt("دلیل رد:");
    if (!reason) return;
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/articles/admin/${id}/reject`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setPendingContent((prev) => prev.filter((c) => c.id !== id));
  }

  async function generateContent() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/articles/admin/generate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ topic: "روابط بین‌فردی و هوش هیجانی", category: "emotion" }),
    });
    if (res.ok) alert("مقاله با موفقیت تولید شد. برای تأیید به تب محتوا بروید.");
  }

  if (!isAdmin) return null;

  const tabs = [
    { id: "overview", label: "آمار AI", icon: Brain },
    { id: "suspended", label: "ساسپند", icon: UserX },
    { id: "content", label: "محتوا", icon: FileText },
    { id: "tickets", label: "تیکت‌ها", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen pb-28" dir="rtl" style={{ background: "#0A1628" }}>
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="flex items-center gap-3 mb-5">
          <Link href="/admin/dashboard" className="text-slate-400 hover:text-white">
            <ArrowRight size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-black text-white flex items-center gap-2">
              <Brain size={20} className="text-orange-400" />
              پنل هوشمندسازی
            </h1>
            <p className="text-xs text-slate-400">مدیریت لایه‌های هوش مصنوعی راوی</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1.5 mb-5 p-1 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className="py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1"
              style={{
                background: activeTab === id ? "rgba(255,107,0,0.8)" : "transparent",
                color: activeTab === id ? "white" : "rgba(255,255,255,0.4)",
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Overview */}
            {activeTab === "overview" && (
              <div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <StatCard label="پروفایل هوشمند" value={stats?.totalProfiles || "—"} icon={<Brain size={18} />} />
                  <StatCard label="کاربر ساسپند" value={stats?.suspendedProfiles || "—"} icon={<Shield size={18} />} color="red" />
                  <StatCard label="نرخ بازگشت" value={`${stats?.avgReturnRate || 0}%`} icon={<TrendingUp size={18} />} />
                  <StatCard label="کل تیپ‌ها" value={stats ? Object.values(stats.communicationDist || {}).reduce((a: any, b: any) => a + b, 0) : "—"} icon={<Users size={18} />} />
                </div>

                {/* توزیع تیپ ارتباطی */}
                {stats?.communicationDist && (
                  <div className="rounded-3xl p-5 mb-4" style={CARD}>
                    <h3 className="text-sm font-black text-white mb-4">توزیع تیپ ارتباطی</h3>
                    {Object.entries(stats.communicationDist).map(([key, val]: any) => (
                      <div key={key} className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">
                            {key === "introvert" ? "درون‌گرا" : key === "extrovert" ? "برون‌گرا" : "ترکیبی"}
                          </span>
                          <span className="text-orange-400 font-bold">{val}</span>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              background: "linear-gradient(90deg, #FF6B00, #FF8C00)",
                              width: `${stats.totalProfiles ? (val / stats.totalProfiles) * 100 : 0}%`,
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* پرتقاضاترین نیازها */}
                {stats?.topInterests?.length > 0 && (
                  <div className="rounded-3xl p-5 mb-4" style={CARD}>
                    <h3 className="text-sm font-black text-white mb-3">پرتقاضاترین رویدادها</h3>
                    <div className="space-y-2">
                      {stats.topInterests.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-slate-300">{item.interest}</span>
                          <span
                            className="px-2 py-0.5 rounded-full font-bold"
                            style={{ background: "rgba(255,107,0,0.2)", color: "#FF6B00" }}
                          >
                            {item.count} نفر
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stats === null && (
                  <div className="rounded-3xl p-5 text-center" style={CARD}>
                    <AlertCircle size={32} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">داده‌ای موجود نیست. با کاربران بیشتری آمار تکمیل می‌شود.</p>
                  </div>
                )}
              </div>
            )}

            {/* Suspended Users */}
            {activeTab === "suspended" && (
              <div>
                <p className="text-xs text-slate-400 mb-4">
                  کاربرانی که ۲ بار ثبت‌نام کرده‌اند و حاضر نشده‌اند. برای فعال‌سازی مجدد باید تأیید کنید.
                </p>
                {suspended.length === 0 ? (
                  <div className="rounded-3xl p-8 text-center" style={CARD}>
                    <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
                    <p className="text-slate-300 font-bold">هیچ کاربر ساسپندی وجود ندارد</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {suspended.map((u) => (
                      <div key={u.id} className="rounded-2xl p-4" style={CARD}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-bold text-white">{u.user_id}</p>
                            <p className="text-xs text-slate-400">{u.suspension_reason}</p>
                            <p className="text-[10px] text-red-400 mt-1">
                              غیبت: {u.no_show_count} بار
                            </p>
                          </div>
                          <button
                            onClick={() => unsuspendUser(u.user_id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all"
                            style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.3)" }}
                          >
                            فعال‌سازی
                          </button>
                        </div>
                        {u.suspended_at && (
                          <p className="text-[10px] text-slate-500">
                            تاریخ ساسپند: {new Date(u.suspended_at).toLocaleDateString("fa-IR")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content Management */}
            {activeTab === "content" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-slate-400">مقالات AI در انتظار تأیید</p>
                  <button
                    onClick={generateContent}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: "rgba(255,107,0,0.2)",
                      border: "1px solid rgba(255,107,0,0.3)",
                      color: "#FF6B00",
                    }}
                  >
                    <Sparkles size={12} />
                    تولید مقاله جدید
                  </button>
                </div>

                {pendingContent.length === 0 ? (
                  <div className="rounded-3xl p-8 text-center" style={CARD}>
                    <FileText size={40} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-300 font-bold mb-1">پیش‌نویسی در انتظار نیست</p>
                    <p className="text-xs text-slate-500">مقالات AI دوشنبه‌ها و پنجشنبه‌ها تولید می‌شوند</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingContent.map((article) => (
                      <div key={article.id} className="rounded-3xl p-4" style={CARD}>
                        <h3 className="text-sm font-bold text-white mb-2">{article.title}</h3>
                        <p className="text-xs text-slate-400 mb-3 line-clamp-3">{article.content?.substring(0, 150)}...</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveContent(article.id)}
                            className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                            style={{ background: "rgba(34,197,94,0.2)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}
                          >
                            <CheckCircle2 size={12} />
                            انتشار
                          </button>
                          <button
                            onClick={() => rejectContent(article.id)}
                            className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                            style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}
                          >
                            <XCircle size={12} />
                            رد کردن
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Support Tickets */}
            {activeTab === "tickets" && (
              <div>
                <p className="text-xs text-slate-400 mb-4">
                  تیکت‌هایی که AI نتوانسته پاسخ دهد و نیاز به بررسی انسانی دارند
                </p>
                {tickets.length === 0 ? (
                  <div className="rounded-3xl p-8 text-center" style={CARD}>
                    <MessageSquare size={40} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-300 font-bold">تیکتی در انتظار نیست</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="rounded-2xl p-4" style={CARD}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-bold text-white">{ticket.subject}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {new Date(ticket.created_at).toLocaleDateString("fa-IR")}
                            </p>
                          </div>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(249,115,22,0.2)", color: "#f97316" }}
                          >
                            {ticket.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">{ticket.message}</p>
                        {ticket.ai_response && (
                          <div
                            className="rounded-xl p-2.5 mb-3"
                            style={{ background: "rgba(255,255,255,0.04)" }}
                          >
                            <p className="text-[10px] text-orange-400 mb-1">پاسخ AI:</p>
                            <p className="text-xs text-slate-400">{ticket.ai_response}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
