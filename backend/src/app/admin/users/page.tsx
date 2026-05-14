"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { fetchAllUsers, isAdminPhone, AdminUser, updateAdminUserRole } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Users, Search, MapPin, Phone, Filter, UserX,
  CheckCircle2, ShieldAlert, RefreshCw, Eye, ChevronLeft
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const CITIES = ["همه شهرها","تهران","مشهد","اصفهان","شیراز","تبریز","کرج","قم","اهواز","کرمانشاه","ارومیه","رشت","زاهدان","کرمان","همدان","یزد"];
const CARD = { background: "linear-gradient(145deg, #1B2A4A, #132038)", border: "1px solid rgba(255,255,255,0.08)" };

interface AdminUserExtended extends AdminUser {
  is_suspended?: boolean;
  no_show_count?: number;
  smart_profile?: {
    is_suspended?: boolean;
    no_show_count?: number;
    communication_type?: string;
    total_events_attended?: number;
  };
}

type ViewMode = "all" | "suspended";

export default function AdminUsersPage() {
  const { state } = useApp();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUserExtended[]>([]);
  const [suspendedUsers, setSuspendedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState("همه شهرها");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [unsuspending, setUnsuspending] = useState<string | null>(null);
  const [suspending, setSuspending] = useState<string | null>(null);
  const [roleUpdating, setRoleUpdating] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    if (!state.isLoading && !isAdminPhone(state.user?.mobileNumber)) router.replace("/dashboard");
  }, [state.isLoading, state.user]);

  useEffect(() => {
    loadData();
  }, [cityFilter, page, viewMode]);

  async function loadData() {
    setLoading(true);
    try {
      if (viewMode === "suspended") {
        const res = await fetch(`${API_URL}/api/intelligence/suspended-users`, { headers });
        if (res.ok) {
          const data = await res.json();
          setSuspendedUsers(data.users || []);
          setTotal(data.total || 0);
        }
      } else {
        const res = await fetchAllUsers({
          city: cityFilter === "همه شهرها" ? undefined : cityFilter,
          page,
          limit: 20,
        });
        setUsers(res.users || []);
        setTotal(res.total || 0);
      }
    } catch {
      if (viewMode === "all") {
        setUsers([
          { id: "1", name: "علی احمدی", mobileNumber: "09120000001", city: "تهران", createdAt: new Date().toISOString(), bookingCount: 3 },
          { id: "2", name: "مریم حسینی", mobileNumber: "09130000002", city: "مشهد", createdAt: new Date().toISOString(), bookingCount: 1 },
          { id: "3", name: "رضا کریمی", mobileNumber: "09140000003", city: "اصفهان", createdAt: new Date().toISOString(), bookingCount: 5 },
        ]);
        setTotal(3);
      }
    } finally {
      setLoading(false);
    }
  }

  async function unsuspendUser(userId: string) {
    setUnsuspending(userId);
    try {
      await fetch(`${API_URL}/api/intelligence/unsuspend/${userId}`, {
        method: "PATCH",
        headers,
      });
      setSuspendedUsers((prev) => prev.filter((u) => u.user_id !== userId));
      setTotal((t) => Math.max(0, t - 1));
    } catch {}
    setUnsuspending(null);
  }

  async function changeRole(userId: string, role: "user" | "admin") {
    setRoleUpdating(userId);
    try {
      const updated = await updateAdminUserRole(userId, role);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: updated.role } : u));
    } catch {}
    setRoleUpdating(null);
  }

  async function suspendUser(userId: string) {
    setSuspending(userId);
    try {
      await fetch(`${API_URL}/api/matching/suspend/${userId}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ reason: "ادمین - تعلیق دستی" }),
      });
      await loadData();
    } catch {}
    setSuspending(null);
  }

  const filteredUsers = search.trim()
    ? users.filter((u) => u.name?.includes(search) || u.mobileNumber?.includes(search))
    : users;

  const COMMUNICATION_LABELS: Record<string, string> = {
    introvert: "درون‌گرا",
    extrovert: "برون‌گرا",
    ambivert: "ترکیبی",
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 space-y-5 relative z-10" dir="rtl">
      {/* هدر */}
      <div className="rounded-3xl p-6" style={CARD}>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Users size={20} className="text-orange-400" /> مدیریت کاربران
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
          مجموع {total} {viewMode === "suspended" ? "کاربر ساسپند" : "کاربر"}
        </p>

        {/* سوئیچ حالت */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => { setViewMode("all"); setPage(1); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              viewMode === "all" ? "bg-orange-500 text-white" : "text-slate-400"
            }`}
            style={viewMode !== "all" ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" } : {}}
          >
            <Users size={14} />
            همه کاربران
          </button>
          <button
            onClick={() => { setViewMode("suspended"); setPage(1); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              viewMode === "suspended" ? "bg-red-500 text-white" : "text-slate-400"
            }`}
            style={viewMode !== "suspended" ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" } : {}}
          >
            <UserX size={14} />
            ساسپند شده
            {suspendedUsers.length > 0 && viewMode !== "suspended" && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {suspendedUsers.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* فیلترها - فقط برای همه کاربران */}
      {viewMode === "all" && (
        <div className="rounded-2xl p-4 space-y-3" style={CARD}>
          <div className="relative">
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="جستجو نام یا شماره..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-4 py-2.5 rounded-xl text-sm text-white outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CITIES.slice(0, 8).map((c) => (
              <button
                key={c}
                onClick={() => { setCityFilter(c); setPage(1); }}
                className={`text-xs px-3 py-1 rounded-xl font-bold transition-all ${
                  cityFilter === c ? "bg-orange-500 text-white" : "text-slate-400"
                }`}
                style={cityFilter === c ? {} : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* لیست کاربران */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : viewMode === "suspended" ? (
        /* لیست ساسپندها */
        <div className="space-y-3">
          {suspendedUsers.length === 0 ? (
            <div className="rounded-2xl p-8 text-center" style={CARD}>
              <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
              <p className="text-white font-bold">هیچ کاربر ساسپندی وجود ندارد</p>
              <p className="text-slate-400 text-sm mt-1">همه کاربران فعال هستند</p>
            </div>
          ) : (
            suspendedUsers.map((u: any) => (
              <div
                key={u.user_id || u.id}
                className="rounded-2xl p-4"
                style={{
                  background: "linear-gradient(145deg, #2A1B1B, #1A0F0F)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(239,68,68,0.15)" }}
                  >
                    <UserX size={18} className="text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-black text-white text-sm">
                        {u.user?.name || u.name || "کاربر ناشناس"}
                      </p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        ساسپند
                      </span>
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                      <ShieldAlert size={10} className="inline ml-1" />
                      {u.no_show_count || 2} بار غیبت
                      {u.suspended_at && (
                        <span className="mr-3">
                          {new Date(u.suspended_at).toLocaleDateString("fa-IR")} تعلیق شد
                        </span>
                      )}
                    </p>
                    {u.suspension_reason && (
                      <p className="text-[10px] text-red-300/60 mt-0.5">{u.suspension_reason}</p>
                    )}
                  </div>
                  <button
                    onClick={() => unsuspendUser(u.user_id || u.id)}
                    disabled={unsuspending === (u.user_id || u.id)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}
                  >
                    {unsuspending === (u.user_id || u.id) ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={12} />
                    )}
                    رفع تعلیق
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* لیست همه کاربران */
        <div className="space-y-3">
          {filteredUsers.map((u) => (
            <div key={u.id} className="rounded-2xl p-4 flex items-center gap-3" style={CARD}>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: u.is_suspended
                    ? "rgba(239,68,68,0.15)"
                    : "rgba(255,107,0,0.15)",
                }}
              >
                {u.is_suspended ? (
                  <UserX size={18} className="text-red-400" />
                ) : (
                  <span className="font-black text-orange-400 text-base">
                    {(u.name || "؟").charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-black text-white text-sm">{u.name || "بدون نام"}</p>
                  {u.role === "admin" && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      ادمین
                    </span>
                  )}
                  {u.is_suspended && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                      ساسپند
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-[11px] flex items-center gap-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                    <Phone size={10} />{u.mobileNumber || "—"}
                  </span>
                  {u.city && (
                    <span className="text-[11px] flex items-center gap-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                      <MapPin size={10} className="text-orange-400" />{u.city}
                    </span>
                  )}
                  {u.latestTestResult && (
                    <span className="text-[11px] flex items-center gap-1 text-emerald-300">
                      نتیجه تست: {u.latestTestResult.main_result}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                {u.bookingCount !== undefined && (
                  <span
                    className="text-xs px-2 py-1 rounded-xl font-bold"
                    style={{ background: "rgba(255,107,0,0.12)", color: "#FF9A3C" }}
                  >
                    {u.bookingCount} رزرو
                  </span>
                )}
                <button
                  onClick={() => changeRole(u.id, u.role === "admin" ? "user" : "admin")}
                  disabled={roleUpdating === u.id}
                  className="text-[10px] px-2 py-1 rounded-xl font-bold text-white disabled:opacity-50"
                  style={{ background: u.role === "admin" ? "rgba(239,68,68,0.25)" : "rgba(99,102,241,0.25)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  {roleUpdating === u.id ? "..." : u.role === "admin" ? "حذف ادمین" : "ادمین کن"}
                </button>
                {u.createdAt && (
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {new Date(u.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                )}
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">کاربری یافت نشد</p>
            </div>
          )}
        </div>
      )}

      {/* صفحه‌بندی */}
      {viewMode === "all" && total > 20 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            قبلی
          </button>
          <span className="text-white text-sm font-bold">صفحه {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={users.length < 20}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
