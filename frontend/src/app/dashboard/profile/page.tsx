"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  fetchMyTestResults,
  fetchUserStats,
  fetchUserProfile,
  isAdminPhone,
  type UserProfile,
  type UserStats,
} from "@/lib/api";
import {
  ChevronLeft,
  Edit3,
  MapPin,
  Brain,
  Sparkles,
  TrendingUp,
  Activity,
  Calendar,
  Heart,
  Users,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Loader2,
  Phone,
  Cake,
  GraduationCap,
  Shield,
  Trophy,
  Target,
  Zap,
  Star,
  ArrowLeft,
} from "lucide-react";

// ─── Style ──────────────────────────────────────────────────────────
const CARD = {
  background: "linear-gradient(145deg, #1B2A4A, #132038)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
};

interface TestResult {
  id: string;
  test_name: string;
  main_result: string;
  completed_at: string;
  scores?: Record<string, number>;
}

// ─── MBTI Logic ─────────────────────────────────────────────────────
const MBTI_DIMENSIONS = [
  {
    id: "EI",
    leftLetter: "I",
    rightLetter: "E",
    leftLabel: "درون‌گرا",
    rightLabel: "برون‌گرا",
    leftEmoji: "🌙",
    rightEmoji: "☀️",
    leftDesc: "از تنهایی انرژی می‌گیری",
    rightDesc: "از جمع انرژی می‌گیری",
  },
  {
    id: "SN",
    leftLetter: "S",
    rightLetter: "N",
    leftLabel: "حسی",
    rightLabel: "شهودی",
    leftEmoji: "🔍",
    rightEmoji: "💡",
    leftDesc: "روی واقعیت‌ها متمرکزی",
    rightDesc: "ایده‌ها و الگوها رو می‌بینی",
  },
  {
    id: "TF",
    leftLetter: "T",
    rightLetter: "F",
    leftLabel: "تفکری",
    rightLabel: "احساسی",
    leftEmoji: "🧠",
    rightEmoji: "💖",
    leftDesc: "با منطق تصمیم می‌گیری",
    rightDesc: "با احساس تصمیم می‌گیری",
  },
  {
    id: "JP",
    leftLetter: "J",
    rightLetter: "P",
    leftLabel: "قضاوتی",
    rightLabel: "ادراکی",
    leftEmoji: "📋",
    rightEmoji: "🎲",
    leftDesc: "ساختار و برنامه دوست داری",
    rightDesc: "انعطاف‌پذیر و خودانگیخته",
  },
];

const MBTI_DESCRIPTIONS: Record<
  string,
  { title: string; emoji: string; desc: string }
> = {
  INTJ: {
    title: "استراتژیست",
    emoji: "♟️",
    desc: "ذهنی نقشه‌ریز و دوراندیش با میل قوی برای فهم سیستم‌های پیچیده.",
  },
  INTP: {
    title: "منطق‌دان",
    emoji: "🔬",
    desc: "متفکر تحلیلی، کنجکاو دائمی، عاشق ایده‌های انتزاعی.",
  },
  ENTJ: {
    title: "فرمانده",
    emoji: "👑",
    desc: "رهبر طبیعی با اعتمادبه‌نفس بالا و توانایی تصمیم‌گیری قاطع.",
  },
  ENTP: {
    title: "بحث‌گر",
    emoji: "💡",
    desc: "نوآور و چالشگر، عاشق ایده‌های جدید و گفت‌وگوهای فکری.",
  },
  INFJ: {
    title: "حامی",
    emoji: "🌿",
    desc: "بصیرت‌مند و دلسوز، با تعهد عمیق به ارزش‌هایی که بهشون باور دارن.",
  },
  INFP: {
    title: "میانجی",
    emoji: "🕊️",
    desc: "آرمان‌گرا و خلاق، با دنیای درونی غنی و تخیل گسترده.",
  },
  ENFJ: {
    title: "قهرمان",
    emoji: "✨",
    desc: "الهام‌بخش و کاریزماتیک، با توانایی درک عمیق دیگران.",
  },
  ENFP: {
    title: "مبارز",
    emoji: "🌟",
    desc: "پرشور و خلاق، عاشق امکانات جدید و ارتباطات گرم.",
  },
  ISTJ: {
    title: "عمل‌گرا",
    emoji: "🛡️",
    desc: "منظم، مسئول، قابل اعتماد. کارها رو درست و دقیق انجام می‌ده.",
  },
  ISFJ: {
    title: "محافظ",
    emoji: "🤲",
    desc: "وفادار، توجه‌کننده، آرام. در سکوت از عزیزانش مراقبت می‌کنه.",
  },
  ESTJ: {
    title: "اجراگر",
    emoji: "⚙️",
    desc: "قاطع، کارآمد، اهل ساختار. سنت‌ها و قوانین براش مهمن.",
  },
  ESFJ: {
    title: "سفیر",
    emoji: "💐",
    desc: "اجتماعی، دلسوز، بازیگر تیم خوب. روابط براش اولویت داره.",
  },
  ISTP: {
    title: "صنعتگر",
    emoji: "🔧",
    desc: "عمل‌گرا و سنجیده، مهارت‌های فنی بالا، آرام در بحران.",
  },
  ISFP: {
    title: "هنرمند",
    emoji: "🎨",
    desc: "حساس و دلپذیر، با حس زیبایی‌شناسی قوی و عشق به آزادی.",
  },
  ESTP: {
    title: "ماجراجو",
    emoji: "🏎️",
    desc: "پرانرژی، اهل ریسک، عاشق هیجان و تجربه‌های جدید.",
  },
  ESFP: {
    title: "بازیگر",
    emoji: "🎭",
    desc: "خوش‌گذران، خودانگیخته، مرکز توجه در هر جمعی.",
  },
};

function parseMbtiCode(code: string | undefined | null): string | null {
  if (!code) return null;
  const normalized = code.toUpperCase().trim();
  return /^[IE][NS][TF][JP]$/.test(normalized) ? normalized : null;
}

/**
 * محاسبه شدت هر بُعد از MBTI
 * - اگه scores موجود باشه از اون استفاده می‌کنیم
 * - وگرنه ۶۵٪ پیش‌فرض برای سمت غالب
 */
function getDimensionStrength(
  type: string,
  dim: (typeof MBTI_DIMENSIONS)[number],
  scores?: Record<string, number>,
): { rightPercent: number; dominantSide: "left" | "right" } {
  const letters = type.split("");
  const dimIdx = MBTI_DIMENSIONS.findIndex((d) => d.id === dim.id);
  const userLetter = letters[dimIdx];
  const dominantSide = userLetter === dim.rightLetter ? "right" : "left";

  if (scores) {
    const rightScore = scores[dim.rightLetter];
    const leftScore = scores[dim.leftLetter];
    if (typeof rightScore === "number" && typeof leftScore === "number") {
      const total = rightScore + leftScore || 1;
      return { rightPercent: Math.round((rightScore / total) * 100), dominantSide };
    }
  }

  // fallback: 65% به سمت غالب
  return { rightPercent: dominantSide === "right" ? 65 : 35, dominantSide };
}

// ─── کامپوننت اصلی ─────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const { state } = useApp();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchUserProfile().catch(() => null),
      fetchUserStats().catch(() => null),
      fetchMyTestResults().catch(() => ({ data: [] })),
    ]).then(([p, s, t]) => {
      setProfile(p);
      setStats(s);
      setTests((t as any)?.data || []);
      setLoading(false);
    });
  }, []);

  const userName = state.user?.name || "کاربر راوی";
  const initial = userName.charAt(0);
  const mobile = state.user?.mobileNumber;
  const isAdmin = isAdminPhone(mobile);

  const latestTest = tests[0];
  const mbtiType = latestTest ? parseMbtiCode(latestTest.main_result) : null;
  const mbtiInfo = mbtiType ? MBTI_DESCRIPTIONS[mbtiType] : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={36} className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-24 space-y-4" dir="rtl">
      {/* ─── Hero Card ─── */}
      <div className="rounded-3xl p-6 relative overflow-hidden" style={CARD}>
        <div
          className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle,#FF6B00,transparent)",
            transform: "translate(-30%,-30%)",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-white font-black text-3xl flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,#FF6B00,#FF9A3C)",
                boxShadow: "0 8px 24px rgba(255,107,0,0.4)",
              }}
            >
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl font-black text-white truncate">
                  {userName}
                </h1>
                {isAdmin && (
                  <span
                    className="text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(255,107,0,0.2)",
                      color: "#FF9A3C",
                      border: "1px solid rgba(255,107,0,0.3)",
                    }}
                  >
                    <Shield size={10} className="inline ml-1" />
                    ادمین
                  </span>
                )}
                {mbtiType && (
                  <span
                    className="text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(99,102,241,0.2)",
                      color: "#a5b4fc",
                      border: "1px solid rgba(99,102,241,0.3)",
                    }}
                  >
                    🧠 {mbtiType}
                  </span>
                )}
              </div>
              {mobile && (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Phone size={11} />
                  {mobile}
                </div>
              )}
              {profile?.city && (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <MapPin size={11} />
                  {profile.city}
                  {profile.neighborhood && ` — ${profile.neighborhood}`}
                </div>
              )}
            </div>
            <Link
              href="/dashboard/complete-profile"
              className="p-2 rounded-xl transition-all flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Edit3 size={16} className="text-slate-300" />
            </Link>
          </div>

          {/* Profile Completion */}
          {profile?.completionPercentage !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-400">تکمیل پروفایل</span>
                <span className="text-xs font-black text-orange-400">
                  {profile.completionPercentage}٪
                </span>
              </div>
              <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${profile.completionPercentage}%`,
                    background: "linear-gradient(90deg,#FF6B00,#FF9A3C)",
                  }}
                />
              </div>
              {profile.completionPercentage < 100 && (
                <Link
                  href="/dashboard/complete-profile"
                  className="text-xs text-orange-400 font-bold mt-2 inline-flex items-center gap-1 hover:text-orange-300"
                >
                  تکمیل پروفایل <ArrowLeft size={11} />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── شخصیت من (MBTI) ─── */}
      {mbtiType && (
        <MbtiCard
          type={mbtiType}
          info={mbtiInfo}
          scores={latestTest?.scores}
          testName={latestTest?.test_name}
        />
      )}

      {!mbtiType && tests.length === 0 && <NoTestCard />}

      {!mbtiType && tests.length > 0 && (
        <div className="rounded-3xl p-5" style={CARD}>
          <div className="flex items-center gap-2 mb-3">
            <Brain size={18} className="text-purple-400" />
            <h3 className="font-black text-white">نتیجه آخرین تست</h3>
          </div>
          <p className="text-2xl font-black text-orange-400">
            {tests[0].main_result}
          </p>
          <p className="text-slate-400 text-sm mt-1">{tests[0].test_name}</p>
        </div>
      )}

      {/* ─── آمار سریع ─── */}
      {stats && <StatsGrid stats={stats} />}

      {/* ─── تاریخچه تست‌ها ─── */}
      {tests.length > 0 && <TestHistory tests={tests} />}

      {/* ─── جزئیات پروفایل ─── */}
      <ProfileDetails profile={profile} />
    </div>
  );
}

// ─── MBTI Card ─────────────────────────────────────────────────────
function MbtiCard({
  type,
  info,
  scores,
  testName,
}: {
  type: string;
  info: { title: string; emoji: string; desc: string } | null;
  scores?: Record<string, number>;
  testName?: string;
}) {
  return (
    <div className="rounded-3xl p-6 relative overflow-hidden" style={CARD}>
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle,#8b5cf6,transparent)",
          transform: "translate(30%,-30%)",
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Brain size={16} className="text-purple-400" />
          </div>
          <h3 className="font-black text-white">شخصیت من</h3>
          <span className="text-xs text-slate-500 mr-auto">{testName}</span>
        </div>

        {/* Type + Title */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              boxShadow: "0 8px 20px rgba(99,102,241,0.35)",
            }}
          >
            {info?.emoji || "🧠"}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-3xl font-black text-white tracking-wider">
                {type}
              </span>
            </div>
            {info && (
              <p className="text-orange-400 text-sm font-black">{info.title}</p>
            )}
          </div>
        </div>

        {info && (
          <p className="text-slate-300 text-sm leading-relaxed mb-5">
            {info.desc}
          </p>
        )}

        {/* Dimension Bars */}
        <div className="space-y-4">
          {MBTI_DIMENSIONS.map((dim) => {
            const { rightPercent, dominantSide } = getDimensionStrength(
              type,
              dim,
              scores,
            );
            const dominantLabel =
              dominantSide === "right" ? dim.rightLabel : dim.leftLabel;
            const dominantDesc =
              dominantSide === "right" ? dim.rightDesc : dim.leftDesc;
            const strength =
              dominantSide === "right" ? rightPercent : 100 - rightPercent;

            return (
              <div key={dim.id}>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span
                    className={
                      dominantSide === "left"
                        ? "font-black text-orange-400"
                        : "text-slate-500"
                    }
                  >
                    {dim.leftEmoji} {dim.leftLabel}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">
                    {strength}٪ {dominantLabel}
                  </span>
                  <span
                    className={
                      dominantSide === "right"
                        ? "font-black text-orange-400"
                        : "text-slate-500"
                    }
                  >
                    {dim.rightLabel} {dim.rightEmoji}
                  </span>
                </div>
                <div
                  className="h-2 rounded-full relative overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <div
                    className="absolute top-0 right-0 h-full"
                    style={{ width: `${100 - rightPercent}%`, background: "rgba(99,102,241,0.6)" }}
                  />
                  <div
                    className="absolute top-0 left-0 h-full"
                    style={{ width: `${rightPercent}%`, background: "rgba(255,107,0,0.7)" }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5"
                    style={{
                      left: `${rightPercent}%`,
                      transform: "translateX(-50%)",
                      background: "white",
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{dominantDesc}</p>
              </div>
            );
          })}
        </div>

        <Link
          href="/dashboard/personality-test?retake=true"
          className="mt-5 w-full py-2.5 rounded-2xl text-sm font-black text-white text-center inline-block transition-all"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <RefreshCw size={13} className="inline ml-1.5" />
          بازانجام تست
        </Link>
      </div>
    </div>
  );
}

// ─── No Test Card ──────────────────────────────────────────────────
function NoTestCard() {
  return (
    <div
      className="rounded-3xl p-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg,rgba(255,107,0,0.15),rgba(255,107,0,0.05))",
        border: "1px solid rgba(255,107,0,0.25)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center">
          <Brain size={22} className="text-orange-400" />
        </div>
        <div>
          <h3 className="font-black text-white">شخصیت خودت رو بشناس</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            هنوز تست شخصیت ندادی
          </p>
        </div>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        با یک تست کوتاه ۱۰ دقیقه‌ای، ابعاد شخصیتی خودت رو بشناس. این به ما کمک
        می‌کنه همنشینی‌ها و گروه‌های مناسب‌تری برات پیشنهاد بدیم.
      </p>
      <Link
        href="/dashboard/personality-test?retake=true"
        className="inline-flex items-center gap-2 py-2.5 px-5 rounded-2xl text-sm font-black text-white transition-all"
        style={{
          background: "linear-gradient(135deg,#FF6B00,#FF9A3C)",
          boxShadow: "0 4px 16px rgba(255,107,0,0.3)",
        }}
      >
        <Sparkles size={14} />
        شروع تست شخصیت
      </Link>
    </div>
  );
}

// ─── Stats Grid ────────────────────────────────────────────────────
function StatsGrid({ stats }: { stats: UserStats }) {
  const items = [
    {
      label: "همنشینی‌های آینده",
      value: stats.upcomingEvents || 0,
      icon: Calendar,
      color: "#FF6B00",
    },
    {
      label: "همنشینی‌های گذشته",
      value: stats.completedEvents || 0,
      icon: CheckCircle2,
      color: "#22c55e",
    },
    {
      label: "تطبیق‌های موفق",
      value: stats.successfulMatches || 0,
      icon: Heart,
      color: "#ec4899",
    },
    {
      label: "کل رزروها",
      value: stats.totalBookings || 0,
      icon: Activity,
      color: "#3b82f6",
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map(({ label, value, icon: Icon, color }) => (
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
            <span className="text-2xl font-black text-white">{value}</span>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: `${color}25` }}
            >
              <Icon size={14} style={{ color }} />
            </div>
          </div>
          <p
            className="text-[11px] font-bold"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Test History ─────────────────────────────────────────────────
function TestHistory({ tests }: { tests: TestResult[] }) {
  return (
    <div className="rounded-3xl p-6" style={CARD}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Trophy size={14} className="text-purple-400" />
          </div>
          <h3 className="font-black text-white">تاریخچه تست‌ها</h3>
        </div>
        <Link
          href="/dashboard/personality-test?retake=true"
          className="text-orange-400 text-xs font-bold flex items-center gap-1 hover:text-orange-300"
        >
          تست جدید <ChevronLeft size={12} />
        </Link>
      </div>
      <div className="space-y-2">
        {tests.slice(0, 5).map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 p-3 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0">
              <Brain size={14} className="text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {t.test_name}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {t.completed_at
                  ? new Date(t.completed_at).toLocaleDateString("fa-IR")
                  : "—"}
              </p>
            </div>
            <span
              className="text-xs font-black px-2.5 py-1 rounded-lg flex-shrink-0"
              style={{
                background: "rgba(255,107,0,0.15)",
                color: "#FF9A3C",
                border: "1px solid rgba(255,107,0,0.25)",
              }}
            >
              {t.main_result}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Profile Details ──────────────────────────────────────────────
function ProfileDetails({ profile }: { profile: UserProfile | null }) {
  const items = [
    { label: "شهر", value: profile?.city, icon: MapPin },
    { label: "محله", value: profile?.neighborhood, icon: MapPin },
    { label: "سن", value: profile?.age ? `${profile.age} سال` : null, icon: Cake },
    {
      label: "جنسیت",
      value:
        profile?.gender === "male"
          ? "آقا"
          : profile?.gender === "female"
            ? "خانم"
            : null,
      icon: Users,
    },
    {
      label: "تحصیلات",
      value: profile?.education,
      icon: GraduationCap,
    },
  ].filter((i) => !!i.value);

  return (
    <div className="rounded-3xl p-6" style={CARD}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <Sparkles size={14} className="text-orange-400" />
          </div>
          <h3 className="font-black text-white">جزئیات پروفایل</h3>
        </div>
        <Link
          href="/dashboard/complete-profile"
          className="text-orange-400 text-xs font-bold flex items-center gap-1 hover:text-orange-300"
        >
          ویرایش <Edit3 size={11} />
        </Link>
      </div>

      {profile?.bio && (
        <div
          className="rounded-2xl p-3 mb-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-[10px] text-slate-500 font-bold mb-1">درباره من</p>
          <p className="text-sm text-slate-200 leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {items.length === 0 && !profile?.bio ? (
        <div className="text-center py-6">
          <p className="text-slate-500 text-sm mb-3">
            هنوز اطلاعات کاملی در پروفایلت نیست
          </p>
          <Link
            href="/dashboard/complete-profile"
            className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-black text-white"
            style={{
              background: "linear-gradient(135deg,#FF6B00,#FF9A3C)",
            }}
          >
            تکمیل پروفایل
            <ArrowLeft size={12} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {items.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 p-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <Icon size={13} className="text-slate-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-slate-500 font-bold">{label}</p>
                <p className="text-xs font-bold text-white truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interests */}
      {profile?.interests && profile.interests.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] text-slate-500 font-bold mb-2">علایق</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                style={{
                  background: "rgba(255,107,0,0.1)",
                  color: "#FF9A3C",
                  border: "1px solid rgba(255,107,0,0.2)",
                }}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
