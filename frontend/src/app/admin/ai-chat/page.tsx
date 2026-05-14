"use client";


import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { isAdminPhone } from "@/lib/api";
import {
  Send, Brain, RefreshCw, Trash2, Copy, CheckCheck,
  TrendingUp, Users, AlertTriangle, BarChart2,
} from "lucide-react";

const AI_BASE = "https://api.gapgpt.app/v1";
const API_KEY = "sk-fRQfQLXc8pkuNIIf6eSokMD2KU1BdsLUXXj4gtv4yQLrIlxQ";
const AI_MODEL = "claude-haiku-4-5-20251001";
const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Message {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

const ADMIN_SYSTEM_PROMPT = `شما دستیار هوش مصنوعی اختصاصی ادمین پلتفرم راوی هستید. راوی یک پلتفرم دورهمی اجتماعی هوشمند ایرانی است.

وظایف شما به عنوان دستیار ادمین:
- تحلیل داده‌های کاربران و رویدادها
- ارائه پیشنهادات برای بهبود پلتفرم
- کمک به تصمیم‌گیری درباره استراتژی‌های رشد
- تفسیر معیارهای CRM و نرخ ریزش
- پیشنهاد بهبود در محتوا، قیمت‌گذاری و برنامه‌ریزی رویدادها
- تحلیل رفتار کاربران و شناسایی الگوهای مشکل‌ساز

اطلاعات پلتفرم راوی:
- دسته‌بندی‌ها: همنشین، هم‌بازی، هم‌صحبت، هم‌پا، هم‌آموز، همکار، هم‌فکر، هم‌تیمی، هم‌قصه
- کاربران از طریق شماره موبایل و OTP وارد می‌شوند
- گروه‌بندی بر اساس تست شخصیت انجام می‌شود
- رویدادها در کافه‌های شریک برگزار می‌شوند

همیشه به فارسی پاسخ بده. پاسخ‌های جامع، تحلیلی و کاربردی بده. از داده‌های واقعی صحبت کن.`;

const QUICK_PROMPTS = [
  { icon: TrendingUp, label: "تحلیل نرخ ریزش", text: "چطور می‌توانم نرخ ریزش کاربران را کاهش دهم؟ چه استراتژی‌هایی پیشنهاد می‌کنی؟" },
  { icon: Users, label: "رشد کاربران", text: "بهترین روش‌های جذب کاربر جدید برای پلتفرم راوی چیست؟" },
  { icon: AlertTriangle, label: "شناسایی مشکلات", text: "چه مشکلاتی ممکن است باعث نارضایتی کاربران شود؟ چطور آنها را شناسایی کنم؟" },
  { icon: BarChart2, label: "بهینه‌سازی رویدادها", text: "چطور می‌توانم رویدادها را بهینه کنم تا نرخ تکرار و رضایت بالاتر باشد؟" },
];

const WELCOME: Message = {
  role: "assistant",
  content: "سلام ادمین عزیز! 🧠\n\nمن دستیار هوش مصنوعی اختصاصی پلتفرم راوی هستم. می‌توانم در موارد زیر کمک کنم:\n\n• تحلیل رفتار کاربران و ریزش\n• بهینه‌سازی رویدادها و دسته‌بندی‌ها\n• استراتژی‌های رشد و بازاریابی\n• تفسیر داده‌های CRM\n• پیشنهاد بهبود محصول\n\nسوالت رو بپرس!",
  ts: Date.now(),
};

export default function AdminAIChatPage() {
  const { state } = useApp();
  const router = useRouter();
  const isAdmin = isAdminPhone(state.user?.mobileNumber);

  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!state.isLoading && (!state.isLoggedIn || !isAdmin)) {
      router.push("/dashboard");
    }
  }, [state.isLoading, state.isLoggedIn, isAdmin]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const historyMessages = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(`${AI_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: [
            { role: "system", content: ADMIN_SYSTEM_PROMPT },
            ...historyMessages,
            { role: "user", content: text },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "متأسفم، پاسخی دریافت نشد.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply, ts: Date.now() }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "خطا در اتصال به هوش مصنوعی. لطفاً دوباره امتحان کنید.", ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const copyMsg = async (content: string, ts: number) => {
    await navigator.clipboard.writeText(content);
    setCopied(ts);
    setTimeout(() => setCopied(null), 2000);
  };

  const CARD = {
    background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)",
    border: "1px solid rgba(255,255,255,0.07)",
  };

  if (!isAdmin) return null;

  return (
    <div className="h-[100dvh] md:h-screen flex flex-col overflow-hidden" dir="rtl" style={{ background: "transparent" }}>
      {/* هدر */}
      <div className="shrink-0 z-20 p-4 md:p-6 flex items-center gap-4" style={{ background: "rgba(13,26,45,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}>
          <Brain size={22} className="text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-white font-black text-lg">دستیار هوشمند ادمین</h1>
          <p className="text-slate-400 text-xs">تحلیل داده و پیشنهادات هوش مصنوعی برای پلتفرم راوی</p>
        </div>
        <button
          onClick={() => setMessages([WELCOME])}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          title="پاک کردن مکالمه"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* دسترسی سریع */}
      <div className="shrink-0 px-4 md:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {QUICK_PROMPTS.map((qp) => (
          <button
            key={qp.label}
            onClick={() => { setInput(qp.text); textareaRef.current?.focus(); }}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 transition-all hover:text-white"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <qp.icon size={13} className="text-purple-400" />
            {qp.label}
          </button>
        ))}
      </div>

      {/* چت */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 py-4 space-y-4 pb-6">
        {messages.map((msg) => (
          <div key={msg.ts} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[85%] ${msg.role === "user" ? "order-2" : "order-1"}`}>
              {msg.role === "assistant" && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}>
                    <Brain size={11} className="text-white" />
                  </div>
                  <span className="text-[10px] text-slate-500">دستیار ادمین</span>
                </div>
              )}
              <div
                className="rounded-2xl px-4 py-3 relative group"
                style={
                  msg.role === "assistant"
                    ? CARD
                    : { background: "linear-gradient(135deg,#7c3aed,#9333ea)" }
                }
              >
                <p className="text-white text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                {msg.role === "assistant" && (
                  <button
                    onClick={() => copyMsg(msg.content, msg.ts)}
                    className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/10"
                  >
                    {copied === msg.ts ? <CheckCheck size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-end">
            <div className="rounded-2xl px-5 py-4 flex items-center gap-2" style={CARD}>
              <div className="flex gap-1">
                {[0, 150, 300].map((d) => (
                  <div key={d} className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
              <span className="text-slate-400 text-xs">در حال تفکر...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ورودی */}
      <div className="shrink-0 p-4 md:p-6 pb-[calc(1rem+72px)] md:pb-6" style={{ background: "rgba(13,26,45,0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-4xl mx-auto flex gap-3 items-end">
          <div className="flex-1 rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="سوال ادمین خود را بنویسید... (Enter برای ارسال)"
              className="w-full bg-transparent text-white text-sm placeholder:text-slate-500 outline-none resize-none max-h-32"
              rows={2}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}
          >
            {loading ? <RefreshCw size={18} className="text-white animate-spin" /> : <Send size={18} className="text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
