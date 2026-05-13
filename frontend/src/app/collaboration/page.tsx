"use client";

import { useState } from "react";
import {
  Brain,
  Users,
  Coffee,
  Check,
  Upload,
  Shield,
  MapPin,
  Clock,
  Phone,
  User,
  FileText,
  ClipboardCheck,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/* ── Pricing Tiers ─────────────────────────────────────────── */
const COLLAB_PLANS = [
  {
    id: "psychologist",
    title: "روانشناس",
    icon: Brain,
    color: "#6366f1",
    bg: "rgba(99,102,241,0.1)",
    price: "توافقی",
    features: [
      "درج پروفایل حرفه‌ای",
      "دسترسی به پنل مشاوره",
      "دریافت مراجع از طریق راوی",
      "مشاهده نتایج تست‌های مراجع",
      "پشتیبانی اختصاصی",
    ],
    requirement: "تایید کد نظام روانشناسی الزامی است",
  },
  {
    id: "facilitator",
    title: "تسهیلگر",
    icon: Users,
    color: "#f97316",
    bg: "rgba(249,115,22,0.1)",
    price: "توافقی",
    features: [
      "ثبت پروفایل تسهیلگری",
      "اعلام زمان‌های خالی",
      "دریافت درخواست از کاربران",
      "مدیریت رزروها",
      "آمار و گزارش عملکرد",
    ],
    requirement: "تکمیل اطلاعات حرفه‌ای و رزومه",
  },
  {
    id: "cafe",
    title: "کافه",
    icon: Coffee,
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    price: "توافقی",
    features: [
      "درج کافه در نقشه راوی",
      "دریافت رویدادهای همکاری",
      "سیستم رزرو اختصاصی",
      "اعلام در شبکه‌های اجتماعی راوی",
      "پشتیبانی و آموزش",
    ],
    requirement: "نیاز به کد تایید راوی",
  },
];

/* ── Psychologist Form ─────────────────────────────────────── */
function PsychologistForm() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setSubmitting(true);
    setResult(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/collaboration/psychologist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nezamCode: code,
          fullName: name,
          phone,
          specialty,
        }),
      });
      if (res.ok) setResult("success");
      else setResult("error");
    } catch {
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-white text-sm font-bold block mb-2">
          <Shield size={14} className="inline ml-1" />
          کد نظام روانشناسی
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="کد نظام را وارد کنید"
          required
          className="w-full rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>
      <div>
        <label className="text-white text-sm font-bold block mb-2">
          نام و نام خانوادگی
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نام کامل"
          required
          className="w-full rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>
      <div>
        <label className="text-white text-sm font-bold block mb-2">
          شماره تماس
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="09xxxxxxxxx"
          required
          className="w-full rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>
      <div>
        <label className="text-white text-sm font-bold block mb-2">
          تخصص
        </label>
        <input
          type="text"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          placeholder="مثال: روانشناسی بالینی"
          className="w-full rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl font-black text-white transition-all"
        style={{ background: "#6366f1" }}
      >
        {submitting ? "در حال ارسال..." : "ثبت درخواست همکاری"}
      </button>
      {result === "success" && (
        <p className="text-green-400 text-sm text-center">
          درخواست شما با موفقیت ثبت شد. پس از بررسی کد نظام، نتیجه اطلاع‌رسانی
          می‌شود.
        </p>
      )}
      {result === "error" && (
        <p className="text-red-400 text-sm text-center">
          خطایی رخ داد. لطفاً دوباره تلاش کنید.
        </p>
      )}
    </form>
  );
}

/* ── Facilitator Form ──────────────────────────────────────── */
function FacilitatorForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    workField: "",
    workArea: "",
    availableTimes: "",
    bio: "",
  });
  const [resume, setResume] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (resume) fd.append("resume", resume);
      const res = await fetch(`${API}/api/collaboration/facilitator`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (res.ok) setResult("success");
      else setResult("error");
    } catch {
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  }

  const fields = [
    {
      key: "name",
      label: "نام و نام خانوادگی",
      icon: User,
      placeholder: "نام کامل",
      required: true,
    },
    {
      key: "phone",
      label: "شماره تماس",
      icon: Phone,
      placeholder: "09xxxxxxxxx",
      type: "tel",
      required: true,
    },
    {
      key: "city",
      label: "شهر",
      icon: MapPin,
      placeholder: "شهر محل سکونت",
      required: true,
    },
    {
      key: "workField",
      label: "حوزه کاری",
      icon: Brain,
      placeholder: "مثال: تسهیلگری گروه‌درمانی",
      required: true,
    },
    {
      key: "workArea",
      label: "محدوده کاری مدنظر",
      icon: MapPin,
      placeholder: "مثال: تهران، منطقه ۱ تا ۵",
    },
    {
      key: "availableTimes",
      label: "زمان‌های خالی",
      icon: Clock,
      placeholder: "مثال: شنبه تا چهارشنبه ۱۰ تا ۱۸",
      required: true,
    },
    {
      key: "bio",
      label: "اطلاعات شخصی و سوابق",
      icon: FileText,
      placeholder: "معرفی کوتاه از خودتان",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="text-white text-sm font-bold block mb-2">
            <f.icon size={14} className="inline ml-1" />
            {f.label}
            {f.required && <span className="text-red-400 mr-1">*</span>}
          </label>
          <input
            type={f.type || "text"}
            value={form[f.key as keyof typeof form]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            placeholder={f.placeholder}
            required={f.required}
            className="w-full rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
        </div>
      ))}

      <div>
        <label className="text-white text-sm font-bold block mb-2">
          <Upload size={14} className="inline ml-1" />
          ارسال رزومه کاری (اختیاری)
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files?.[0] || null)}
          className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-orange-500/10 file:text-orange-400 hover:file:bg-orange-500/20"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl font-black text-white transition-all"
        style={{ background: "#f97316" }}
      >
        {submitting ? "در حال ارسال..." : "ثبت درخواست تسهیلگری"}
      </button>
      {result === "success" && (
        <p className="text-green-400 text-sm text-center">
          درخواست شما ثبت شد. تیم راوی پس از بررسی با شما تماس می‌گیرد.
        </p>
      )}
      {result === "error" && (
        <p className="text-red-400 text-sm text-center">
          خطایی رخ داد. لطفاً دوباره تلاش کنید.
        </p>
      )}
    </form>
  );
}

/* ── Cafe Form ─────────────────────────────────────────────── */
function CafeForm() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setSubmitting(true);
    setResult(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/collaboration/cafe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          verificationCode: code,
          cafeName: name,
          address,
          phone,
        }),
      });
      if (res.ok) setResult("success");
      else setResult("error");
    } catch {
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-white text-sm font-bold block mb-2">
          <Shield size={14} className="inline ml-1" />
          کد تایید راوی
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="کد تاییدی که از راوی دریافت کرده‌اید"
          required
          className="w-full rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>
      <div>
        <label className="text-white text-sm font-bold block mb-2">
          نام کافه
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نام کافه"
          required
          className="w-full rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>
      <div>
        <label className="text-white text-sm font-bold block mb-2">
          آدرس
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="آدرس کامل کافه"
          required
          className="w-full rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>
      <div>
        <label className="text-white text-sm font-bold block mb-2">
          شماره تماس
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="شماره تلفن کافه"
          required
          className="w-full rounded-xl p-3 text-sm text-white placeholder-slate-500 outline-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl font-black text-white transition-all"
        style={{ background: "#22c55e" }}
      >
        {submitting ? "در حال ارسال..." : "ثبت درخواست همکاری کافه"}
      </button>
      {result === "success" && (
        <p className="text-green-400 text-sm text-center">
          کد تایید شد! درخواست همکاری ثبت شد.
        </p>
      )}
      {result === "error" && (
        <p className="text-red-400 text-sm text-center">
          کد تایید نامعتبر است یا خطایی رخ داد.
        </p>
      )}
    </form>
  );
}

/* ── Collaborator Checklist ────────────────────────────────── */
function CollaboratorChecklist({
  type,
}: {
  type: "psychologist" | "facilitator" | "cafe";
}) {
  const checklists: Record<string, { label: string; items: string[] }> = {
    psychologist: {
      label: "چک‌لیست روانشناس",
      items: [
        "تایید کد نظام روانشناسی",
        "تکمیل پروفایل حرفه‌ای",
        "آپلود مدارک تحصیلی",
        "شرکت در جلسه توجیهی راوی",
        "امضای قرارداد همکاری",
        "تنظیم زمان‌های مشاوره",
      ],
    },
    facilitator: {
      label: "چک‌لیست تسهیلگر",
      items: [
        "تکمیل فرم اطلاعات شخصی",
        "ارسال رزومه کاری",
        "مصاحبه اولیه",
        "شرکت در دوره آموزشی راوی",
        "امضای تعهدنامه",
        "تنظیم محدوده و زمان کاری",
      ],
    },
    cafe: {
      label: "چک‌لیست کافه",
      items: [
        "دریافت و تایید کد همکاری",
        "ثبت اطلاعات کافه",
        "بازدید تیم راوی",
        "امضای قرارداد همکاری",
        "نصب بنر و استند راوی",
        "آموزش سیستم رزرو",
      ],
    },
  };

  const list = checklists[type];
  return (
    <div
      className="rounded-2xl p-5 mt-6"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <ClipboardCheck size={16} className="text-orange-400" />
        {list.label}
      </h4>
      <div className="space-y-2">
        {list.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-slate-400 text-sm">
            <div
              className="w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              <span className="text-[10px] text-slate-500">{i + 1}</span>
            </div>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function CollaborationPage() {
  const [activeTab, setActiveTab] = useState<
    "psychologist" | "facilitator" | "cafe"
  >("psychologist");
  

  return (
    <div className="min-h-screen pb-24" dir="rtl">
      {/* Header */}
      <div className="px-4 pt-8 pb-6 text-center">
        <div className="text-5xl mb-4">🤝</div>
        <h1 className="text-3xl font-black text-white mb-3">همکاری با راوی</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
          با راوی همکار شوید و به هزاران نفر در مسیر سلامت روان کمک کنید
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {COLLAB_PLANS.map((plan) => {
            const Icon = plan.icon;
            
            return (
              <div
                key={plan.id}
                className="rounded-2xl p-6 transition-all cursor-pointer hover:scale-[1.02]"
                style={{
                  background:
                    activeTab === plan.id
                      ? "linear-gradient(145deg, #1B2A4A, #132038)"
                      : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeTab === plan.id ? plan.color + "40" : "rgba(255,255,255,0.08)"}`,
                }}
                onClick={() => setActiveTab(plan.id as typeof activeTab)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: plan.bg }}
                  >
                    <Icon size={24} style={{ color: plan.color }} />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-lg">
                      {plan.title}
                    </h3>
                    <span
                      className="text-xs font-bold"
                      style={{ color: plan.color }}
                    >
                      {plan.price}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-slate-300 text-sm"
                    >
                      <Check
                        size={14}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: plan.color }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <div
                  className="text-xs px-3 py-1.5 rounded-lg"
                  style={{
                    background: plan.bg,
                    color: plan.color,
                  }}
                >
                  {plan.requirement}
                </div>
              </div>
            );
          })}
        </div>

        {/* Registration Form */}
        <div
          className="rounded-2xl p-6 max-w-xl mx-auto"
          style={{
            background: "linear-gradient(145deg, #1B2A4A, #132038)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h2 className="text-xl font-black text-white mb-6 text-center">
            فرم ثبت درخواست{" "}
            {activeTab === "psychologist"
              ? "روانشناس"
              : activeTab === "facilitator"
                ? "تسهیلگر"
                : "کافه"}
          </h2>

          {activeTab === "psychologist" && <PsychologistForm />}
          {activeTab === "facilitator" && <FacilitatorForm />}
          {activeTab === "cafe" && <CafeForm />}

          <CollaboratorChecklist type={activeTab} />
        </div>

        {/* Messaging links */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm mb-4">
            همچنین می‌توانید از طریق پیام‌رسان‌ها با ما در ارتباط باشید:
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://t.me/raavi_platform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{
                background: "rgba(0,136,204,0.15)",
                color: "#0088cc",
                border: "1px solid rgba(0,136,204,0.3)",
              }}
            >
              تلگرام
            </a>
            <a
              href="https://ble.ir/raavi_platform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{
                background: "rgba(34,197,94,0.15)",
                color: "#22c55e",
                border: "1px solid rgba(34,197,94,0.3)",
              }}
            >
              بله
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
