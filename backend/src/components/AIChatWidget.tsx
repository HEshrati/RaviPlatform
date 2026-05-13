"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

const AI_BASE = "https://api.gapgpt.app/v1";
const API_KEY = "sk-fRQfQLXc8pkuNIIf6eSokMD2KU1BdsLUXXj4gtv4yQLrIlxQ";
const AI_MODEL = "claude-haiku-4-5-20251001";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "سلام! 👋 من دستیار هوشمند راوی هستم. چطور می‌تونم کمکت کنم؟\n\nمی‌تونی بپرسی:\n• کدوم برنامه مناسب منه؟\n• نحوه رزرو رویداد\n• قوانین راوی",
  timestamp: new Date().toISOString(),
};

const SYSTEM_PROMPT = `شما دستیار هوشمند پلتفرم راوی هستید. راوی یک پلتفرم دورهمی اجتماعی هوشمند است که افراد را بر اساس شخصیت، سن و علایق با هم آشنا می‌کند.

وظایف شما:
- راهنمایی کاربر برای انتخاب برنامه مناسب
- کمک به رزرو رویداد
- توضیح قوانین و فرآیندهای راوی
- پاسخ به سوالات درباره گروه‌بندی هوشمند

درباره راوی:
- رویدادها شامل: دورهمی کافه، بردگیم، کوهنوردی، تئاتر، موسیقی و غیره
- گروه‌ها ۴-۶ نفره بر اساس الگوریتم هوشمند شکل می‌گیرند
- قیمت‌ها معمولاً بین ۳۰,۰۰۰ تا ۲۰۰,۰۰۰ تومان است
- مکان رویداد ۲۴ ساعت قبل اعلام می‌شود

همیشه به فارسی پاسخ بده. مختصر، دوستانه و مفید باش.`;

// کلید localStorage برای هر کاربر
function getChatKey(userId?: string | null) {
  return userId ? `ravi_chat_${userId}` : null; // guest: هیچی سیو نمیشه
}

export default function AIChatWidget() {
  const { state } = useApp();

  // شناسه یکتای کاربر (موبایل یا id)
  const userId =
    (state.user as any)?.mobileNumber || (state.user as any)?.id || null;
  const isLoggedIn = state.isLoggedIn && !!userId;
  const chatKey = getChatKey(userId);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const prevUserIdRef = useRef<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── بارگذاری/ریست هنگام تغییر وضعیت لاگین یا کاربر ──────────────
  useEffect(() => {
    const prevId = prevUserIdRef.current;

    if (!isLoggedIn || !chatKey) {
      // خروج: ریست به پیام خوشامد
      if (prevId !== null) {
        setMessages([WELCOME]);
        setIsOpen(false);
      }
      prevUserIdRef.current = null;
      return;
    }

    // کاربر جدید لاگین کرده یا همان کاربر قبلی برگشته
    if (prevId !== userId) {
      // لود تاریخچه از localStorage
      try {
        const saved = localStorage.getItem(chatKey);
        if (saved) {
          const parsed: Message[] = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          } else {
            setMessages([WELCOME]);
          }
        } else {
          setMessages([WELCOME]);
        }
      } catch {
        setMessages([WELCOME]);
      }
      prevUserIdRef.current = userId;
    }
  }, [isLoggedIn, userId, chatKey]);

  // ── ذخیره خودکار در localStorage (فقط برای کاربر لاگین‌شده) ───────
  useEffect(() => {
    if (!chatKey || !isLoggedIn) return;
    try {
      // حداکثر ۵۰ پیام آخر
      localStorage.setItem(chatKey, JSON.stringify(messages.slice(-50)));
    } catch {}
  }, [messages, chatKey, isLoggedIn]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(`${AI_BASE}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: AI_MODEL,
          max_tokens: 500,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const reply =
        data.content?.[0]?.text ||
        data.choices?.[0]?.message?.content ||
        "پاسخی دریافت نشد. دوباره تلاش کن.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          timestamp: new Date().toISOString(),
        },
      ]);
      if (!isOpen) setHasNewMessage(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "اتصال به دستیار موقتاً قطع شده. لطفاً دوباره تلاش کن. 🔄",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function clearHistory() {
    setMessages([WELCOME]);
    if (chatKey) {
      try {
        localStorage.removeItem(chatKey);
      } catch {}
    }
  }

  function formatTime(iso: string) {
    try {
      return new Date(iso).toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }

  return (
    <div className="fixed bottom-6 left-6 z-50" dir="rtl">
      {isOpen && (
        <div
          className="absolute bottom-16 left-0 w-[340px] sm:w-[380px] rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            height: "480px",
          }}
        >
          {/* هدر */}
          <div
            className="flex items-center justify-between p-4 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">دستیار راوی</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[11px] text-slate-400">آنلاین</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isLoggedIn && (
                <button
                  onClick={clearHistory}
                  title="پاک کردن تاریخچه"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-white/10 transition"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* پیام‌ها */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-orange-500 text-white rounded-bl-none"
                      : "text-slate-200 rounded-br-none"
                  }`}
                  style={
                    msg.role === "assistant"
                      ? {
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }
                      : {}
                  }
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                  <span className="text-[10px] opacity-60 block mt-1 text-left">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-end">
                <div
                  className="rounded-2xl rounded-br-none px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* سوالات سریع */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
              {["چه برنامه‌ای مناسبه؟", "قوانین راوی", "نحوه رزرو"].map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-full text-orange-400 hover:bg-orange-500 hover:text-white transition"
                  style={{ border: "1px solid rgba(255,107,0,0.3)" }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* فیلد ارسال */}
          <div
            className="p-3 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage()
                }
                placeholder="سوالت رو بپرس..."
                disabled={isLoading}
                className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* دکمه باز/بسته */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 bg-orange-500 hover:bg-orange-400 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all active:scale-95 relative"
        style={{ boxShadow: "0 8px 32px rgba(255,107,0,0.4)" }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {hasNewMessage && !isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping" />
        )}
        {!isOpen && (
          <div className="absolute inset-0 rounded-2xl bg-orange-500 animate-ping opacity-20" />
        )}
      </button>
    </div>
  );
}
