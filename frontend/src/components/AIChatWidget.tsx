"use client";

import { useState, useRef, useEffect } from "react";
import { Brain, X, Send, Trash2, ChevronDown } from "lucide-react";
import { useApp } from "@/context/AppContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

function getChatKey(userId?: string | null) {
  return userId ? `ravi_chat_${userId}` : null;
}

export default function AIChatWidget() {
  const { state } = useApp();

  const userId =
    (state.user as any)?.mobileNumber || (state.user as any)?.id || null;
  const isLoggedIn = state.isLoggedIn && !!userId;
  const chatKey = getChatKey(userId);

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const prevUserIdRef = useRef<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // mount برای انیمیشن اولیه
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const prevId = prevUserIdRef.current;
    if (!isLoggedIn || !chatKey) {
      if (prevId !== null) {
        setMessages([WELCOME]);
        setIsOpen(false);
      }
      prevUserIdRef.current = null;
      return;
    }
    if (prevId !== userId) {
      try {
        const saved = localStorage.getItem(chatKey);
        if (saved) {
          const parsed: Message[] = JSON.parse(saved);
          setMessages(
            Array.isArray(parsed) && parsed.length > 0 ? parsed : [WELCOME],
          );
        } else {
          setMessages([WELCOME]);
        }
      } catch {
        setMessages([WELCOME]);
      }
      prevUserIdRef.current = userId;
    }
  }, [isLoggedIn, userId, chatKey]);

  useEffect(() => {
    if (!chatKey || !isLoggedIn) return;
    try {
      localStorage.setItem(chatKey, JSON.stringify(messages.slice(-50)));
    } catch {}
  }, [messages, chatKey, isLoggedIn]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
      setTimeout(() => inputRef.current?.focus(), 300);
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

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const lastUserMsg = history.filter(m => m.role === "user").slice(-1)[0]?.content || "";
      const response = await fetch(`${API_URL}/api/content/support/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ question: lastUserMsg, messages: history }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const reply =
        data?.answer ||
        data?.reply ||
        data?.message ||
        data?.choices?.[0]?.message?.content ||
        data?.content?.[0]?.text ||
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
    } catch (err) {
      console.error("[AIChat] error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "اتصال به دستیار موقتاً قطع شده. لطفاً چند لحظه دیگر دوباره تلاش کن. 🔄",
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
    <div
      className="fixed z-50"
      dir="rtl"
      style={{
        // بالای BottomNav (68px) + کمی فاصله
        bottom: "84px",
        left: "16px",
      }}
    >
      {/* ── پنل چت ── */}
      <div
        className="absolute w-[340px] sm:w-[380px] rounded-2xl overflow-hidden flex flex-col"
        style={{
          bottom: "calc(100% + 12px)",
          left: 0,
          background: "linear-gradient(160deg, #1B2A4A 0%, #0f172a 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          height: "480px",
          // انیمیشن نرم باز/بسته شدن
          opacity: isOpen ? 1 : 0,
          transform: isOpen
            ? "translateY(0) scale(1)"
            : "translateY(16px) scale(0.96)",
          transformOrigin: "bottom left",
          pointerEvents: isOpen ? "auto" : "none",
          transition:
            "opacity 0.28s cubic-bezier(0.34,1.56,0.64,1), transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* هدر پنل */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #FF6B00, #FF9A3C)",
                boxShadow: "0 4px 14px rgba(255,107,0,0.35)",
              }}
            >
              <Brain size={17} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">دستیار راوی</h3>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[11px] text-slate-400">آنلاین</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isLoggedIn && (
              <button
                onClick={clearHistory}
                title="پاک کردن تاریخچه"
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-white/10 transition-all duration-200"
              >
                <Trash2 size={14} />
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <ChevronDown size={18} />
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
                <span className="text-[10px] opacity-50 block mt-1 text-left">
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

        {/* سوال‌های پیشنهادی */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
            {["چه برنامه‌ای مناسبه؟", "قوانین راوی", "نحوه رزرو"].map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-full text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-200"
                style={{ border: "1px solid rgba(255,107,0,0.3)" }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* ورودی */}
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
              className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all duration-200"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shrink-0 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #FF6B00, #FF9A3C)",
                boxShadow: "0 4px 12px rgba(255,107,0,0.3)",
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── دکمه شناور گرد ── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex items-center justify-center text-white"
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: isOpen
            ? "linear-gradient(135deg, #c2410c, #ea580c)"
            : "linear-gradient(135deg, #FF6B00, #FF9A3C)",
          boxShadow: isOpen
            ? "0 6px 20px rgba(255,107,0,0.35)"
            : "0 8px 28px rgba(255,107,0,0.45)",
          transition:
            "background 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease",
          transform: mounted ? "scale(1)" : "scale(0)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.94)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
      >
        {/* پالس پس‌زمینه */}
        {!isOpen && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: "rgba(255,107,0,0.3)",
              animationDuration: "2s",
            }}
          />
        )}

        {/* آیکون با انیمیشن rotate */}
        <span
          style={{
            display: "flex",
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          {isOpen ? <ChevronDown size={22} /> : <Brain size={22} />}
        </span>

        {/* نشانگر پیام جدید */}
        {hasNewMessage && !isOpen && (
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#0f172a] animate-bounce"
            style={{ background: "#ef4444" }}
          />
        )}
      </button>
    </div>
  );
}
