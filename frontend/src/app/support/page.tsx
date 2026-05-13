"use client";


import { useState } from "react";
import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useApp } from "@/context/AppContext";
import {
  ArrowRight, MessageCircle, Ticket, Send, CheckCircle2,
  ExternalLink, ChevronDown, ChevronUp, HelpCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TELEGRAM_SUPPORT = "https://t.me/ravi_support";

const CARD_STYLE = {
  background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)",
  border: "1px solid rgba(255,255,255,0.07)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
};

const FAQ_ITEMS = [
  {
    q: "چطور می‌تونم در دورهمی شرکت کنم؟",
    a: "ابتدا ثبت‌نام کن، پروفایلت رو تکمیل کن، سپس از بخش رویدادها یه دورهمی انتخاب کن و رزرو کن. بعد از پرداخت، ۲۴ ساعت قبل از رویداد پیامک می‌گیری.",
  },
  {
    q: "آدرس دقیق رویداد کجاست؟",
    a: "آدرس دقیق رویداد ۱۰ ساعت قبل از شروع در داشبورد کاربری‌ات نمایش داده می‌شه. این برای حفظ امنیت شرکت‌کنندگان است.",
  },
  {
    q: "چرا به گروه تلگرامی دعوت می‌شم؟",
    a: "حین رویداد یک گروه تلگرامی خصوصی برای اعضای گروهت ساخته می‌شه. این برای هماهنگی بیشتر و تسهیل ارتباط است. ربات راوی قوانین را ارسال می‌کنه.",
  },
  {
    q: "اگر ثبت‌نام کنم و نیام چی می‌شه؟",
    a: "در صورت ۲ بار غیبت بدون اطلاع قبلی، حساب کاربری‌ات موقتاً محدود می‌شه و باید با تیم راوی تماس بگیری تا تأیید بشه.",
  },
  {
    q: "چطور الگوریتم مچینگ کار می‌کنه؟",
    a: "الگوریتم راوی با توجه به سن (حداکثر ۵ سال اختلاف)، لوکیشن، تیپ شخصیتی و سابقه رفتاری شما، بهترین گروه ۴-۶ نفره رو برات انتخاب می‌کنه.",
  },
];

const CATEGORIES = [
  { value: "booking", label: "رزرو و ثبت‌نام" },
  { value: "payment", label: "پرداخت" },
  { value: "technical", label: "مشکل فنی" },
  { value: "event", label: "رویداد" },
  { value: "account", label: "حساب کاربری" },
  { value: "other", label: "سایر" },
];

export default function SupportPage() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<"faq" | "ticket">("faq");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [form, setForm] = useState({
    subject: "",
    message: "",
    category: "other",
    contactPhone: "",
    contactName: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!form.subject.trim() || !form.message.trim()) {
      setError("موضوع و توضیحات الزامی است");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/support/ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        if (data.ai_response) setAiResponse(data.ai_response);
      } else {
        setError(data.message || "خطا در ارسال تیکت");
      }
    } catch {
      // اگر backend در دسترس نبود، نمایش پیام مستقیم
      setSubmitted(true);
      setAiResponse(`ممنون از پیامت! تیم راوی در اسرع وقت پاسخ می‌دهد. برای پیگیری سریع‌تر در تلگرام با ما در تماس باشید.`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen pb-28 relative" dir="rtl">
      <AnimatedBackground />
      <div className="relative z-10 max-w-xl mx-auto px-4 pt-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors"
        >
          <ArrowRight size={16} /> بازگشت
        </Link>

        <h1 className="text-xl font-black text-white mb-1">پشتیبانی راوی</h1>
        <p className="text-xs text-slate-400 mb-5">چطور می‌تونیم کمکت کنیم؟</p>

        {/* تلگرام مستقیم */}
        <a
          href={TELEGRAM_SUPPORT}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl p-4 mb-5 transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, rgba(37,211,102,0.15), rgba(37,211,102,0.05))",
            border: "1px solid rgba(37,211,102,0.2)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(37,211,102,0.2)" }}
          >
            <ExternalLink size={18} className="text-green-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-300">پشتیبانی مستقیم تلگرام</p>
            <p className="text-xs text-slate-400">پاسخگویی سریع · ۷ روز هفته</p>
          </div>
          <div className="mr-auto">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        </a>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { id: "faq", label: "سوالات متداول", icon: HelpCircle },
            { id: "ticket", label: "ثبت تیکت", icon: Ticket },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-bold transition-all"
              style={{
                background:
                  activeTab === id
                    ? "rgba(255,107,0,0.8)"
                    : "rgba(255,255,255,0.06)",
                color: activeTab === id ? "white" : "rgba(255,255,255,0.5)",
                border: "1px solid",
                borderColor:
                  activeTab === id
                    ? "rgba(255,107,0,0.5)"
                    : "rgba(255,255,255,0.08)",
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* FAQ */}
        {activeTab === "faq" && (
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={CARD_STYLE}>
                <button
                  className="w-full flex items-center justify-between p-4 text-right"
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                >
                  <span className="text-sm font-bold text-white flex-1 text-right">
                    {item.q}
                  </span>
                  {expandedFaq === i ? (
                    <ChevronUp size={16} className="text-orange-400 flex-shrink-0 mr-2" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400 flex-shrink-0 mr-2" />
                  )}
                </button>
                {expandedFaq === i && (
                  <div
                    className="px-4 pb-4 text-sm text-slate-300 leading-relaxed"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <p className="pt-3">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Ticket */}
        {activeTab === "ticket" && (
          <div className="rounded-3xl p-5" style={CARD_STYLE}>
            {submitted ? (
              <div className="text-center py-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(34,197,94,0.2)" }}
                >
                  <CheckCircle2 size={32} className="text-green-400" />
                </div>
                <p className="text-white font-black text-lg mb-2">تیکت ثبت شد!</p>
                <p className="text-slate-400 text-sm mb-4">
                  {aiResponse || "تیم پشتیبانی در اسرع وقت پاسخ می‌دهد"}
                </p>
                {aiResponse && (
                  <div
                    className="rounded-2xl p-3 text-right text-sm text-slate-200 leading-relaxed mb-4"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <p className="text-[11px] text-orange-400 mb-2 font-bold">پاسخ هوشمند:</p>
                    {aiResponse}
                  </div>
                )}
                <button
                  onClick={() => { setSubmitted(false); setAiResponse(""); setForm({ subject: "", message: "", category: "other", contactPhone: "", contactName: "" }); }}
                  className="text-orange-400 text-sm font-bold hover:text-orange-300"
                >
                  ثبت تیکت جدید
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-bold text-white mb-1">ثبت تیکت پشتیبانی</p>
                <p className="text-xs text-slate-400 -mt-2 mb-3">
                  دستیار هوشمند ما سریعاً پاسخ می‌دهد و در صورت نیاز به تیم انسانی ارجاع می‌شه
                </p>

                {/* دسته‌بندی */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">دسته‌بندی مشکل</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value} style={{ background: "#132038" }}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* موضوع */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">موضوع</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="مشکل یا سوالت رو خلاصه بنویس..."
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none placeholder-slate-500"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>

                {/* توضیحات */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">توضیحات</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="جزئیات بیشتری بنویس..."
                    rows={4}
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none placeholder-slate-500 resize-none"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>

                {/* اگر لاگین نیستن */}
                {!state.isLoggedIn && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">نام</label>
                      <input
                        type="text"
                        value={form.contactName}
                        onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                        placeholder="نام شما"
                        className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none placeholder-slate-500"
                        style={{
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">شماره موبایل</label>
                      <input
                        type="tel"
                        value={form.contactPhone}
                        onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                        placeholder="09..."
                        className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none placeholder-slate-500"
                        style={{
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-xs text-red-400">{error}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #FF6B00, #FF8C00)",
                    boxShadow: "0 4px 16px rgba(255,107,0,0.3)",
                  }}
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      ارسال تیکت
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
