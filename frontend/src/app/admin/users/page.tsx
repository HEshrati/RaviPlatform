"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  fetchAllUsers,
  isAdminPhone,
  AdminUser,
  updateAdminUserRole,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  MapPin,
  Phone,
  UserX,
  CheckCircle2,
  ShieldAlert,
  RefreshCw,
  Brain,
  X,
  Sparkles,
  Calendar,
  BarChart2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const CITIES = [
  "همه شهرها",
  "تهران",
  "مشهد",
  "اصفهان",
  "شیراز",
  "تبریز",
  "کرج",
  "قم",
  "اهواز",
  "کرمانشاه",
  "ارومیه",
  "رشت",
  "زاهدان",
  "کرمان",
  "همدان",
  "یزد",
];
const CARD = {
  background: "linear-gradient(145deg, #1B2A4A, #132038)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const MBTI_DESC: Record<string, string> = {
  ENFJ: "گرم، جمع‌ساز و هدفمند؛ برای رویدادهای گفتگو محور و تیمی عالی است.",
  ENFP: "کنجکاو، پرانرژی و ایده‌پرداز؛ با تجربه‌های تازه و جمع‌های متنوع مچ می‌شود.",
  INFJ: "عمیق، معناگرا و همدل؛ جمع‌های کوچک و گفت‌وگوهای باکیفیت برایش مناسب‌تر است.",
  INFP: "اصیل، احساسی و خلاق؛ با آدم‌های امن و فضاهای آرام بهتر وصل می‌شود.",
  ENTJ: "تصمیم‌ساز و ساختارمند؛ در رویدادهای هدفمند یا حرفه‌ای خوب می‌درخشد.",
  ENTP: "چالش‌دوست و گفتگو محور؛ بازی، مناظره و تجربه‌های غیرکلیشه‌ای مناسبش است.",
  INTJ: "تحلیلی و مستقل؛ برنامه‌های کم‌حاشیه، دقیق و فکری برایش بهتر است.",
  INTP: "کاوشگر و منطقی؛ جمع‌های فکری و بازی‌های استراتژیک مچ خوبی هستند.",
  ESFJ: "حمایت‌گر و اجتماعی؛ با دورهمی‌های گرم و آشنا سریع ارتباط می‌گیرد.",
  ESFP: "تجربه‌گرا و پرشور؛ برنامه‌های سرگرم‌کننده و پرانرژی مناسبش است.",
  ISFJ: "وفادار و مراقب؛ جمع‌های امن، قابل پیش‌بینی و صمیمی برایش بهترند.",
  ISFP: "آرام، هنری و تجربه‌محور؛ فضاهای لطیف، کافه‌ای و کم‌فشار مناسبش است.",
  ESTJ: "اجرایی و منظم؛ رویدادهای برنامه‌دار و نتیجه‌محور برایش جذاب‌تر است.",
  ESTP: "عمل‌گرا و هیجان‌دوست؛ فعالیت، بازی و چالش زنده مناسبش است.",
  ISTJ: "دقیق و قابل اعتماد؛ برنامه‌های منظم، کوچک و با قوانین روشن برایش بهتر است.",
  ISTP: "مستقل و تجربه‌گر؛ فعالیت‌های عملی و کم‌تعارف برایش جذاب است.",
};

const SCORE_LABELS: Record<string, [string, string]> = {
  EI: ["درون‌گرا", "برون‌گرا"],
  SN: ["جزئی‌نگر", "تنوع‌طلب"],
  TF: ["منطقی", "احساسی"],
  JP: ["منعطف", "ساختارمند"],
  SOCIAL: ["ارتباط عمیق", "جمع‌ساز"],
  PACE: ["ریتم آرام", "ریتم سریع"],
};

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

interface TestResult {
  id: string;
  test_name: string;
  main_result: string;
  completed_at: string;
  scores?: Record<string, any>;
}

type ViewMode = "all" | "suspended";

// ── مودال نتیجه تست ────────────────────────────────────────────
function TestResultModal({
  user,
  onClose,
}: {
  user: AdminUserExtended;
  onClose: () => void;
}) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`${API_URL}/api/test-results/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("خطا در دریافت اطلاعات");
        const data = await res.json();
        setResults(data.data || []);
      } catch {
        setError("نتیجه تستی یافت نشد یا خطایی رخ داد.");
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [user.id]);

  const latest = results[0];
  const scores = latest?.scores || {};
  const code = latest?.main_result || "—";
  const desc = MBTI_DESC[code] || "اطلاعات کافی برای تحلیل وجود ندارد.";
  const fullType = scores.fullType || code;

  // محاسبه نمودار برای هر محور
  const axes = ["EI", "SN", "TF", "JP", "SOCIAL", "PACE"];

  return (
    <div
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(160deg, #0f172a 0%, #1B2A4A 100%)",
          border: "1px solid rgba(255,107,0,0.25)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر مودال */}
        <div
          className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,107,0,0.15)" }}
            >
              <Brain size={18} className="text-orange-400" />
            </div>
            <div>
              <p className="font-black text-white text-sm">
                {user.name || "کاربر"}
              </p>
              <p
                className="text-[11px]"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                نتیجه تست شخصیت
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <X size={15} className="text-slate-400" />
          </button>
        </div>

        {/* محتوای مودال */}
        <div className="p-5 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 text-sm">در حال بارگذاری...</p>
            </div>
          ) : error || results.length === 0 ? (
            <div className="text-center py-10">
              <Brain size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-bold">
                {error || "این کاربر هنوز تست نداده است"}
              </p>
            </div>
          ) : (
            <>
              {/* کد شخصیت */}
              <div
                className="rounded-2xl p-5 text-center relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,107,0,0.12), rgba(255,154,60,0.06))",
                  border: "1px solid rgba(255,107,0,0.25)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 50% 50%, #FF6B00 0%, transparent 70%)",
                  }}
                />
                <p className="text-[11px] text-orange-400 font-black mb-1 relative z-10">
                  تیپ شخصیتی مچینگ
                </p>
                <h2 className="text-4xl font-black text-white mb-1 tracking-widest relative z-10">
                  {code}
                </h2>
                {fullType !== code && (
                  <p
                    className="text-xs font-bold relative z-10"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {fullType}
                  </p>
                )}
                <p
                  className="text-xs mt-3 leading-6 relative z-10"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {desc}
                </p>
              </div>

              {/* تاریخ انجام تست */}
              {latest.completed_at && (
                <div className="flex items-center gap-2 px-1">
                  <Calendar size={12} className="text-orange-400" />
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    تاریخ انجام:{" "}
                    <span className="text-slate-300 font-bold">
                      {new Date(latest.completed_at).toLocaleDateString(
                        "fa-IR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </p>
                </div>
              )}

              {/* نمودار محورها */}
              {Object.keys(scores).some((k) => axes.includes(k)) && (
                <div
                  className="rounded-2xl p-4 space-y-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <p className="text-xs font-black text-white flex items-center gap-2">
                    <BarChart2 size={13} className="text-orange-400" />
                    تحلیل ابعاد شخصیتی
                  </p>
                  {axes.map((axis) => {
                    if (!(axis in scores)) return null;
                    const val = Number(scores[axis]) || 0;
                    const [negLabel, posLabel] = SCORE_LABELS[axis];
                    // نرمالایز به ۰-۱۰۰ (range واقعی: -۴ تا +۴)
                    const pct = Math.round(((val + 4) / 8) * 100);
                    const isPositive = val >= 0;
                    return (
                      <div key={axis}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="text-[11px] font-bold"
                            style={{ color: "rgba(255,255,255,0.55)" }}
                          >
                            {isPositive ? posLabel : negLabel}
                          </span>
                          <span
                            className="text-[11px] font-black px-2 py-0.5 rounded-full"
                            style={{
                              background: isPositive
                                ? "rgba(255,107,0,0.15)"
                                : "rgba(99,102,241,0.15)",
                              color: isPositive ? "#FF9A3C" : "#818cf8",
                            }}
                          >
                            {axis}: {val > 0 ? "+" : ""}
                            {val}
                          </span>
                        </div>
                        <div
                          className="h-2 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.08)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              background: isPositive
                                ? "linear-gradient(90deg, #FF6B00, #FF9A3C)"
                                : "linear-gradient(90deg, #6366f1, #818cf8)",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* تعداد تست‌ها */}
              {results.length > 1 && (
                <p
                  className="text-center text-[11px]"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  <Sparkles size={10} className="inline ml-1 text-orange-400" />
                  این کاربر {results.length} بار تست داده — آخرین نتیجه نمایش
                  داده شد
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── صفحه اصلی ──────────────────────────────────────────────────
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
  // ── state مودال ──
  const [testModalUser, setTestModalUser] = useState<AdminUserExtended | null>(
    null,
  );

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    if (!state.isLoading && !isAdminPhone(state.user?.mobileNumber))
      router.replace("/dashboard");
  }, [state.isLoading, state.user]);

  useEffect(() => {
    loadData();
  }, [cityFilter, page, viewMode]);

  async function loadData() {
    setLoading(true);
    try {
      if (viewMode === "suspended") {
        const res = await fetch(`${API_URL}/api/intelligence/suspended-users`, {
          headers,
        });
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
          {
            id: "1",
            name: "علی احمدی",
            mobileNumber: "09120000001",
            city: "تهران",
            createdAt: new Date().toISOString(),
            bookingCount: 3,
          },
          {
            id: "2",
            name: "مریم حسینی",
            mobileNumber: "09130000002",
            city: "مشهد",
            createdAt: new Date().toISOString(),
            bookingCount: 1,
          },
          {
            id: "3",
            name: "رضا کریمی",
            mobileNumber: "09140000003",
            city: "اصفهان",
            createdAt: new Date().toISOString(),
            bookingCount: 5,
          },
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
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u)),
      );
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
    ? users.filter(
        (u) => u.name?.includes(search) || u.mobileNumber?.includes(search),
      )
    : users;

  return (
    <div className="max-w-2xl mx-auto pb-24 space-y-5 relative z-10" dir="rtl">
      {/* مودال نتیجه تست */}
      {testModalUser && (
        <TestResultModal
          user={testModalUser}
          onClose={() => setTestModalUser(null)}
        />
      )}

      {/* هدر */}
      <div className="rounded-3xl p-6" style={CARD}>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Users size={20} className="text-orange-400" /> مدیریت کاربران
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
          مجموع {total} {viewMode === "suspended" ? "کاربر ساسپند" : "کاربر"}
        </p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setViewMode("all");
              setPage(1);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === "all" ? "bg-orange-500 text-white" : "text-slate-400"}`}
            style={
              viewMode !== "all"
                ? {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }
                : {}
            }
          >
            <Users size={14} /> همه کاربران
          </button>
          <button
            onClick={() => {
              setViewMode("suspended");
              setPage(1);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === "suspended" ? "bg-red-500 text-white" : "text-slate-400"}`}
            style={
              viewMode !== "suspended"
                ? {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }
                : {}
            }
          >
            <UserX size={14} /> ساسپند شده
            {suspendedUsers.length > 0 && viewMode !== "suspended" && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {suspendedUsers.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* فیلترها */}
      {viewMode === "all" && (
        <div className="rounded-2xl p-4 space-y-3" style={CARD}>
          <div className="relative">
            <Search
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="جستجو نام یا شماره..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-4 py-2.5 rounded-xl text-sm text-white outline-none"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CITIES.slice(0, 8).map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCityFilter(c);
                  setPage(1);
                }}
                className={`text-xs px-3 py-1 rounded-xl font-bold transition-all ${cityFilter === c ? "bg-orange-500 text-white" : "text-slate-400"}`}
                style={
                  cityFilter === c
                    ? {}
                    : {
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* لیست */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : viewMode === "suspended" ? (
        <div className="space-y-3">
          {suspendedUsers.length === 0 ? (
            <div className="rounded-2xl p-8 text-center" style={CARD}>
              <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
              <p className="text-white font-bold">
                هیچ کاربر ساسپندی وجود ندارد
              </p>
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
                    <p className="font-black text-white text-sm">
                      {u.user?.name || u.name || "کاربر ناشناس"}
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      <ShieldAlert size={10} className="inline ml-1" />
                      {u.no_show_count || 2} بار غیبت
                      {u.suspended_at && (
                        <span className="mr-3">
                          {new Date(u.suspended_at).toLocaleDateString("fa-IR")}{" "}
                          تعلیق شد
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => unsuspendUser(u.user_id || u.id)}
                    disabled={unsuspending === (u.user_id || u.id)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    style={{
                      background: "rgba(34,197,94,0.15)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      color: "#4ade80",
                    }}
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
        <div className="space-y-3">
          {filteredUsers.map((u) => (
            <div key={u.id} className="rounded-2xl p-4" style={CARD}>
              <div className="flex items-center gap-3">
                {/* آواتار */}
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

                {/* اطلاعات کاربر */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-white text-sm">
                      {u.name || "بدون نام"}
                    </p>
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
                    <span
                      className="text-[11px] flex items-center gap-1"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      <Phone size={10} />
                      {u.mobileNumber || "—"}
                    </span>
                    {u.city && (
                      <span
                        className="text-[11px] flex items-center gap-1"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        <MapPin size={10} className="text-orange-400" />
                        {u.city}
                      </span>
                    )}
                  </div>
                </div>

                {/* دکمه‌ها */}
                <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                  {u.bookingCount !== undefined && (
                    <span
                      className="text-xs px-2 py-1 rounded-xl font-bold"
                      style={{
                        background: "rgba(255,107,0,0.12)",
                        color: "#FF9A3C",
                      }}
                    >
                      {u.bookingCount} رزرو
                    </span>
                  )}

                  {/* دکمه نتیجه تست */}
                  <button
                    onClick={() => setTestModalUser(u)}
                    className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-xl font-bold transition-all hover:opacity-90"
                    style={{
                      background: "rgba(139,92,246,0.2)",
                      border: "1px solid rgba(139,92,246,0.3)",
                      color: "#c084fc",
                    }}
                  >
                    <Brain size={10} /> نتیجه تست
                  </button>

                  <button
                    onClick={() =>
                      changeRole(u.id, u.role === "admin" ? "user" : "admin")
                    }
                    disabled={roleUpdating === u.id}
                    className="text-[10px] px-2 py-1 rounded-xl font-bold text-white disabled:opacity-50"
                    style={{
                      background:
                        u.role === "admin"
                          ? "rgba(239,68,68,0.25)"
                          : "rgba(99,102,241,0.25)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    {roleUpdating === u.id
                      ? "..."
                      : u.role === "admin"
                        ? "حذف ادمین"
                        : "ادمین کن"}
                  </button>

                  {u.createdAt && (
                    <p
                      className="text-[10px]"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {new Date(u.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  )}
                </div>
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
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            قبلی
          </button>
          <span className="text-white text-sm font-bold">صفحه {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={users.length < 20}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
