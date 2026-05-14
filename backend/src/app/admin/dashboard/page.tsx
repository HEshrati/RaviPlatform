"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  fetchAdminStats,
  fetchMyAdminEvents,
  fetchAdminAnalytics,
  AdminEventStat,
  ApiEvent,
  isAdminPhone,
} from "@/lib/api";
import {
  BarChart2,
  Plus,
  Calendar,
  Users,
  TrendingUp,
  ChevronRight,
  Eye,
  Edit,
  DollarSign,
  Activity,
  PieChart,
  ArrowUpRight,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import RaviLoader from "@/components/RaviLoader";

// ── SVG Bar Chart ──────────────────────────────────────────────────────────
function BarChartSVG({
  data,
  color = "#FF6B00",
}: {
  data: { label: string; value: number }[];
  color?: string;
}) {
  if (!data.length)
    return (
      <p className="text-slate-500 text-sm text-center py-6">
        داده‌ای موجود نیست
      </p>
    );
  const max = Math.max(...data.map((d) => d.value), 1);
  const H = 120;
  const W = 100;

  return (
    <div className="overflow-x-auto">
      <svg
        width={Math.max(data.length * 52, 300)}
        height={H + 40}
        style={{ minWidth: "100%" }}
      >
        {data.map((d, i) => {
          const barH = Math.round((d.value / max) * H);
          const x = i * 52 + 10;
          return (
            <g key={i}>
              <rect
                x={x}
                y={H - barH}
                width={36}
                height={barH}
                fill={color}
                rx={4}
                opacity={0.85}
              />
              <text
                x={x + 18}
                y={H - barH - 6}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize={10}
              >
                {d.value}
              </text>
              <text
                x={x + 18}
                y={H + 14}
                textAnchor="middle"
                fill="#64748b"
                fontSize={9}
                className="truncate"
              >
                {d.label.slice(0, 6)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── SVG Donut Chart ────────────────────────────────────────────────────────
function DonutChart({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  if (!data.length)
    return (
      <p className="text-slate-500 text-sm text-center py-6">
        داده‌ای موجود نیست
      </p>
    );
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const R = 50;
  const cx = 70;
  const cy = 70;
  let angle = -Math.PI / 2;

  const slices = data.map((d) => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle);
    const y1 = cy + R * Math.sin(angle);
    angle += sweep;
    const x2 = cx + R * Math.cos(angle);
    const y2 = cy + R * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return {
      ...d,
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`,
    };
  });

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <svg width={140} height={140}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} opacity={0.85} />
        ))}
        <circle cx={cx} cy={cy} r={30} fill="#0f172a" />
        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fill="white"
          fontSize={11}
          fontWeight="bold"
        >
          {total}
        </text>
      </svg>
      <div className="space-y-1.5 flex-1">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ background: s.color }}
            />
            <span className="text-slate-300 truncate">{s.label}</span>
            <span className="text-white font-bold mr-auto">
              {Math.round((s.value / total) * 100)}٪
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Line Sparkline ─────────────────────────────────────────────────────────
function Sparkline({
  data,
  color = "#FF6B00",
}: {
  data: number[];
  color?: string;
}) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const W = 200;
  const H = 50;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - (v / max) * H;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width="100%"
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
    >
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} />
    </svg>
  );
}

// ── Success Bar Chart ──────────────────────────────────────────────────────
function SuccessChart({ events }: { events: AdminEventStat[] }) {
  if (!events.length) {
    return (
      <div className="text-center py-8">
        <BarChart2 size={36} className="text-slate-600 mx-auto mb-3" />
        <p className="text-slate-500 text-sm">هنوز رویدادی برگزار نشده است.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {events.map((ev) => (
        <div key={ev.eventId}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-300 truncate max-w-[60%]">
              {ev.title}
            </span>
            <span className="text-xs font-black text-orange-400">
              {Math.round(ev.successRate)}٪
            </span>
          </div>
          <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-700"
              style={{ width: `${ev.successRate}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>
              {ev.attended} شرکت‌کننده از {ev.reserved} رزرو
            </span>
            <span>{ev.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const CARD = {
  background: "linear-gradient(145deg, #1B2A4A, #132038)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
};

export default function AdminDashboardPage() {
  const { state } = useApp();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [myEvents, setMyEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [successInfoModal, setSuccessInfoModal] = useState(false);
  const [chartInfoModal, setChartInfoModal] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    if (!isAdminPhone(state.user?.mobileNumber)) {
      router.replace("/dashboard");
      return;
    }
    // ── کَش فوری ─────────────────────────────────────────────
    try {
      const cs = localStorage.getItem("adm_s");
      const ca = localStorage.getItem("adm_a");
      const ce = localStorage.getItem("adm_e");
      if (cs) { setStats(JSON.parse(cs)); setLoading(false); }
      if (ca) setAnalytics(JSON.parse(ca));
      if (ce) setMyEvents(JSON.parse(ce));
    } catch {}
    // ── fetch موازی تدریجی ────────────────────────────────
    fetchAdminStats()
      .then(s => { setStats(s); setLoading(false);
        try { localStorage.setItem("adm_s", JSON.stringify(s)); } catch {} })
      .catch(() => setLoading(false));
    fetchAdminAnalytics()
      .then(a => { if (a) { setAnalytics(a);
        try { localStorage.setItem("adm_a", JSON.stringify(a)); } catch {} } })
      .catch(() => {});
    fetchMyAdminEvents()
      .then(e => { const ev = e.events.slice(0,5); setMyEvents(ev);
        try { localStorage.setItem("adm_e", JSON.stringify(ev)); } catch {} })
      .catch(() => {});
  }, [state.user]);

  if (loading) return <RaviLoader />;

  const catColors = [
    "#FF6B00",
    "#3B82F6",
    "#10B981",
    "#8B5CF6",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#EC4899",
  ];
  const catData = (analytics?.categoryBreakdown || []).map(
    (c: any, i: number) => ({
      label: c.category,
      value: c.count,
      color: catColors[i % catColors.length],
    }),
  );
  const bookingMonths = (analytics?.bookingsPerMonth || []).map((m: any) => ({
    label: m.month,
    value: m.count,
  }));
  const revenueSparkline = (analytics?.revenuePerMonth || []).map(
    (m: any) => m.revenue,
  );

  return (
    <div className="max-w-3xl mx-auto pb-24 space-y-5" dir="rtl">
      {/* مودال معیارهای موفقیت */}
      {successInfoModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={() => setSuccessInfoModal(false)}>
          <div className="w-full max-w-md rounded-3xl p-6 shadow-2xl" style={{ background: "linear-gradient(145deg,#1B2A4A,#0d1e35)", border: "1px solid rgba(255,255,255,0.1)" }} onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-black text-lg mb-4">معیارهای موفقیت رویداد</h3>
            <div className="space-y-3 text-sm">
              <div className="rounded-2xl p-3" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <p className="text-green-400 font-bold mb-1">✅ حضور کاربران</p>
                <p className="text-slate-300">حضور بیش از ۸۰٪ ظرفیت در رویداد نشان‌دهنده موفقیت است.</p>
              </div>
              <div className="rounded-2xl p-3" style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
                <p className="text-orange-400 font-bold mb-1">⭐ رتینگ شرکت‌کنندگان</p>
                <p className="text-slate-300">میانگین امتیاز بالاتر از ۴ از ۵ به عنوان رویداد موفق شناخته می‌شود.</p>
              </div>
              <div className="rounded-2xl p-3" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <p className="text-indigo-400 font-bold mb-1">🔁 نرخ بازگشت</p>
                <p className="text-slate-300">اگر بیش از ۵۰٪ شرکت‌کنندگان در رویداد بعدی نیز شرکت کنند، رویداد موفق بوده است.</p>
              </div>
              <div className="rounded-2xl p-3" style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)" }}>
                <p className="text-yellow-400 font-bold mb-1">💬 تکمیل پروفایل</p>
                <p className="text-slate-300">افزایش نرخ تکمیل پروفایل کاربران پس از رویداد نشانه تجربه مثبت است.</p>
              </div>
            </div>
            <button onClick={() => setSuccessInfoModal(false)} className="mt-5 w-full py-3 rounded-2xl text-sm font-black text-white" style={{ background: "linear-gradient(135deg,#FF6B00,#FF9A3C)" }}>بستن</button>
          </div>
        </div>
      )}

      {/* مودال توضیح نمودارها */}
      {chartInfoModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={() => setChartInfoModal(null)}>
          <div className="w-full max-w-md rounded-3xl p-6 shadow-2xl" style={{ background: "linear-gradient(145deg,#1B2A4A,#0d1e35)", border: "1px solid rgba(255,255,255,0.1)" }} onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-black text-lg mb-3">{chartInfoModal.title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{chartInfoModal.content}</p>
            <button onClick={() => setChartInfoModal(null)} className="mt-5 w-full py-3 rounded-2xl text-sm font-black text-white" style={{ background: "linear-gradient(135deg,#FF6B00,#FF9A3C)" }}>بستن</button>
          </div>
        </div>
      )}
      <div className="rounded-3xl p-6" style={CARD}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-white">داشبورد ادمین 🛡️</h1>
            <p
              className="text-sm mt-1"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              سلام {state.user?.name || "ادمین"} — مدیریت کامل سیستم
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/admin/events/new"
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-2xl font-bold text-sm hover:bg-orange-400 transition shadow-lg shadow-orange-500/30"
            >
              <Plus size={16} />
              همنشینی جدید
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Users size={16} />
              کاربران
            </Link>
          </div>
        </div>

        {/* Quick nav */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {[
            { href: "/admin/events", label: "همنشینی‌ها", icon: Calendar },
            { href: "/admin/users", label: "کاربران", icon: Users },
            { href: "/admin/bookings", label: "رزروها", icon: Activity },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition"
              style={{
                background: "rgba(255,107,0,0.12)",
                color: "#FF9A3C",
                border: "1px solid rgba(255,107,0,0.2)",
              }}
            >
              <Icon size={13} />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "کل رویدادها",
            value: stats?.totalEvents || analytics?.totalEvents || 0,
            icon: Calendar,
            color: "#FF6B00",
          },
          {
            label: "کل رزروها",
            value:
              (stats as any)?.totalBookings || analytics?.totalBookings || 0,
            icon: Activity,
            color: "#3B82F6",
          },
          {
            label: "کل کاربران",
            value: (stats as any)?.totalUsers || analytics?.totalUsers || 0,
            icon: Users,
            color: "#10B981",
          },
          {
            label: "میانگین موفقیت",
            value: `${Math.round(stats?.avgSuccessRate || 0)}٪`,
            icon: TrendingUp,
            color: "#F59E0B",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl p-4 relative overflow-hidden"
            style={CARD}
          >
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: color }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl font-black text-white">{value}</span>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${color}20` }}
              >
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <p
              className="text-[11px] font-medium"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── دکمه ایجاد همنشینی — برجسته ── */}
      <Link
        href="/admin/events/new"
        className="block rounded-3xl p-5 transition-all hover:scale-[1.01] active:scale-[0.99]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,107,0,0.2), rgba(255,107,0,0.08))",
          border: "1px solid rgba(255,107,0,0.35)",
          boxShadow: "0 4px 24px rgba(255,107,0,0.15)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: "rgba(255,107,0,0.2)" }}
            >
              🤝
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                + ایجاد همنشینی جدید
              </h3>
              <p className="text-sm text-orange-300 mt-0.5">
                تصویر، قیمت، شهر، دسته‌بندی و زمان را تعیین کنید
              </p>
              <div className="flex gap-2 mt-2">
                {["آپلود تصویر", "انتخاب شهر", "تعیین قیمت", "دسته‌بندی"].map(
                  (f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold text-orange-300"
                      style={{ background: "rgba(255,107,0,0.15)" }}
                    >
                      {f}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,107,0,0.2)" }}
          >
            <ChevronRight size={20} className="text-orange-400" />
          </div>
        </div>
      </Link>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly bookings */}
        <div className="rounded-3xl p-5" style={CARD}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <BarChart2 size={15} className="text-orange-400" />
            </div>
            <h3 className="font-black text-white text-sm">رزروهای ماهانه</h3>
            <button
              onClick={() => {
                const totalB = analytics?.totalBookings || 0;
                const peakM = bookingMonths.length ? bookingMonths.reduce((a:any,b:any)=>a.value>b.value?a:b,{label:"",value:0}) : null;
                setChartInfoModal({ title: "رزروهای ماهانه", content: `این نمودار تعداد رزروهای انجام‌شده در هر ماه را نشان می‌دهد.\n\n📊 آمار جاری:\n• مجموع کل رزروها: ${totalB.toLocaleString()} رزرو${peakM?.label ? "\n• پرترافیک‌ترین ماه: " + peakM.label + " با " + peakM.value + " رزرو" : ""}\n\nماه‌هایی که تعداد رزرو بیشتری دارند نشان‌دهنده افزایش استقبال کاربران هستند. کاهش ناگهانی ممکن است نشان‌دهنده مشکل فنی یا کاهش رضایت کاربران باشد.` });
              }}
              className="mr-auto text-xs text-slate-500 hover:text-slate-300 border border-slate-700 rounded-lg px-2 py-0.5 transition-all hover:border-slate-500"
            >
              توضیح
            </button>
          </div>
          <BarChartSVG
            data={
              bookingMonths.length
                ? bookingMonths
                : [
                    { label: "فروردین", value: 12 },
                    { label: "اردیبهشت", value: 19 },
                    { label: "خرداد", value: 8 },
                    { label: "تیر", value: 25 },
                    { label: "مرداد", value: 31 },
                    { label: "شهریور", value: 22 },
                  ]
            }
          />
        </div>

        {/* Category donut */}
        <div className="rounded-3xl p-5" style={CARD}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <PieChart size={15} className="text-purple-400" />
            </div>
            <h3 className="font-black text-white text-sm">
              توزیع دسته‌بندی‌ها
            </h3>
            <button
              onClick={() => {
                const topCat = catData.length ? catData.reduce((a:any,b:any)=>a.value>b.value?a:b,{label:"",value:0}) : null;
                const total = catData.reduce((s:number,c:any)=>s+c.value,0)||1;
                setChartInfoModal({ title: "توزیع دسته‌بندی‌ها", content: `این نمودار نشان می‌دهد کاربران بیشتر در کدام دسته‌بندی‌های همنشینی شرکت می‌کنند.${topCat?.label ? "\n\n📊 آمار جاری:\n• محبوب‌ترین دسته: " + topCat.label + " با " + topCat.value + " رویداد (" + Math.round(topCat.value/total*100) + "٪ از کل)\n• تعداد دسته‌بندی‌های فعال: " + catData.length : ""}\n\nاز این داده برای اولویت‌بندی سرمایه‌گذاری در رویدادها و بازاریابی هدفمند استفاده کنید.` });
              }}
              className="mr-auto text-xs text-slate-500 hover:text-slate-300 border border-slate-700 rounded-lg px-2 py-0.5 transition-all hover:border-slate-500"
            >
              توضیح
            </button>
          </div>
          <DonutChart
            data={
              catData.length
                ? catData
                : [
                    { label: "همنشین", value: 35, color: "#FF6B00" },
                    { label: "هم‌بازی", value: 25, color: "#3B82F6" },
                    { label: "هم‌صحبت", value: 20, color: "#10B981" },
                    { label: "هم‌پا", value: 15, color: "#8B5CF6" },
                    { label: "سایر", value: 5, color: "#F59E0B" },
                  ]
            }
          />
        </div>
      </div>

      {/* Revenue sparkline */}
      {revenueSparkline.length > 0 && (
        <div className="rounded-3xl p-5" style={CARD}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DollarSign size={15} className="text-green-400" />
              </div>
              <h3 className="font-black text-white text-sm">روند درآمد</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                <ArrowUpRight size={13} /> در حال رشد
              </span>
              <button
                onClick={() => {
                  const maxRev = revenueSparkline.length ? Math.max(...revenueSparkline) : 0;
                  const totalRev = revenueSparkline.reduce((a:number,b:number)=>a+b,0);
                  setChartInfoModal({ title: "روند درآمد", content: `این نمودار روند درآمد پلتفرم در طول زمان را نشان می‌دهد.\n\n💰 آمار جاری:\n• مجموع درآمد کل: ${totalRev.toLocaleString()} تومان\n• بیشترین درآمد ماهانه: ${maxRev.toLocaleString()} تومان\n\nافزایش درآمد نشان‌دهنده رشد تعداد رزروها است. نقاط پایین ممکن است نشان‌دهنده دوره‌های تعطیلات باشد.` });
                }}
                className="text-xs text-slate-500 hover:text-slate-300 border border-slate-700 rounded-lg px-2 py-0.5 transition-all hover:border-slate-500"
              >
                توضیح
              </button>
            </div>
          </div>
          <Sparkline data={revenueSparkline} color="#10B981" />
        </div>
      )}

      {/* Success rate chart */}
      <div className="rounded-3xl p-6" style={CARD}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <TrendingUp size={15} className="text-orange-400" />
          </div>
          <h3 className="font-black text-white">درصد موفقیت رویدادها</h3>
          <button
            onClick={() => setSuccessInfoModal(true)}
            className="mr-auto text-xs text-slate-400 hover:text-white border border-slate-600 rounded-lg px-2 py-1 transition-all hover:border-orange-500"
          >
            معیارهای موفقیت ↗
          </button>
        </div>
        <SuccessChart events={stats?.events || []} />
      </div>

      {/* Recent events */}
      <div className="rounded-3xl p-6" style={CARD}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-white">رویدادهای اخیر</h3>
          <Link
            href="/admin/events"
            className="text-orange-400 text-sm font-bold hover:text-orange-300 flex items-center gap-1"
          >
            همه <ChevronRight size={16} />
          </Link>
        </div>

        {myEvents.length === 0 ? (
          <div className="text-center py-6">
            <Calendar size={32} className="text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">
              هنوز رویدادی ایجاد نکرده‌اید.
            </p>
            <Link
              href="/admin/events/new"
              className="inline-block mt-3 text-orange-400 font-bold text-sm"
            >
              اولین رویداد را بسازید
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {ev.title}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    ظرفیت: {ev.capacity} نفر |{" "}
                    {ev.current_bookings || ev.reservedCount || 0} رزرو
                    {(ev as any).city && ` | ${(ev as any).city}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/events/${ev.id}`}
                    className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-700 transition"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <Eye size={14} className="text-slate-300" />
                  </Link>
                  <Link
                    href={`/admin/attendance/${ev.id}`}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition"
                    style={{ background: "rgba(16,185,129,0.15)" }}
                  >
                    <Users size={14} className="text-green-400" />
                  </Link>
                  <Link
                    href={`/admin/events/${ev.id}/edit`}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition"
                    style={{ background: "rgba(255,107,0,0.15)" }}
                  >
                    <Edit size={14} className="text-orange-400" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
