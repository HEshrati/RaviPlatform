"use client";
/**
 * دکمه اتصال به بات تلگرام
 * مسیر: src/components/TelegramLinkButton.tsx
 *
 * نحوه استفاده:
 *   import TelegramLinkButton from '@/components/TelegramLinkButton';
 *   <TelegramLinkButton />
 */

import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

/** وضعیت اتصال تلگرام را از localStorage می‌خواند */
function getTelegramLinked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    return !!u.telegram_id;
  } catch {
    return false;
  }
}

/** بعد از اتصال موفق، telegram_id را در localStorage ذخیره می‌کند */
function saveTelegramToLocalStorage(telegramId: string) {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    u.telegram_id = telegramId;
    localStorage.setItem("user", JSON.stringify(u));
  } catch {}
}

type State = "idle" | "loading" | "linked" | "already" | "error";

export default function TelegramLinkButton() {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErr] = useState("");
  const [deepLink, setLink] = useState("");

  // بررسی وضعیت اتصال هنگام mount — از localStorage خوانده می‌شه
  useEffect(() => {
    if (getTelegramLinked()) setState("already");
  }, []);

  // گوش دادن به تغییرات localStorage (مثلاً وقتی در تب دیگه‌ای لینک می‌شه)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "user" && e.newValue) {
        try {
          const u = JSON.parse(e.newValue);
          if (u.telegram_id) setState("already");
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleClick = async () => {
    setState("loading");
    setErr("");
    try {
      const res = await fetch(`${API}/api/bot/generate-link-token`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error(`خطای سرور: ${res.status}`);
      const data = await res.json();

      if (data.alreadyLinked) {
        setState("already");
        // مستقیم redirect — بلاک نمی‌شه
        const a = document.createElement("a");
        a.href = data.deepLink;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      setLink(data.deepLink);
      setState("linked");

      // مستقیم redirect — بلاک نمی‌شه
      const a = document.createElement("a");
      a.href = data.deepLink;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // شروع polling برای تشخیص اتصال موفق (هر ۳ ثانیه، تا ۵ دقیقه)
      const startPoll = Date.now();
      const poll = setInterval(async () => {
        if (Date.now() - startPoll > 5 * 60 * 1000) {
          clearInterval(poll);
          return;
        }
        try {
          const r = await fetch(`${API}/api/auth/me`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          });
          if (!r.ok) return;
          const user = await r.json();
          if (user?.telegram_id) {
            saveTelegramToLocalStorage(user.telegram_id);
            setState("already");
            clearInterval(poll);
          }
        } catch {}
      }, 3000);
    } catch (err: any) {
      setErr(err?.message || "خطا در ارتباط با سرور");
      setState("error");
    }
  };

  if (state === "already") {
    return (
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-2xl border"
        style={{
          background: "rgba(34,197,94,0.08)",
          borderColor: "rgba(34,197,94,0.25)",
        }}
        dir="rtl"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 flex-shrink-0"
          fill="#22c55e"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
        </svg>
        <div>
          <p className="text-green-400 font-bold text-sm">تلگرام متصل است ✅</p>
          <p className="text-slate-400 text-xs">
            رویدادهای شما در بات نمایش داده می‌شوند
          </p>
        </div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <button
        disabled
        className="flex items-center gap-3 px-5 py-3 rounded-2xl font-bold text-sm text-slate-400 cursor-wait"
        style={{
          background: "rgba(59,130,246,0.08)",
          border: "1px solid rgba(59,130,246,0.2)",
        }}
        dir="rtl"
      >
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        در حال ایجاد لینک...
      </button>
    );
  }

  if (state === "linked") {
    return (
      <div className="space-y-2" dir="rtl">
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-2xl border"
          style={{
            background: "rgba(34,197,94,0.08)",
            borderColor: "rgba(34,197,94,0.25)",
          }}
        >
          <svg
            viewBox="0 0 20 20"
            fill="#22c55e"
            className="w-5 h-5 flex-shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-green-400 font-bold text-sm">لینک باز شد!</p>
            <p className="text-slate-400 text-xs">
              در تلگرام /start را بزنید تا رویدادها نمایش داده شوند 🎉
            </p>
          </div>
        </div>
        {deepLink && (
          <a
            href={deepLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            اگه لینک باز نشد اینجا کلیک کنید
          </a>
        )}
        <button
          onClick={() => setState("idle")}
          className="text-xs text-slate-500 hover:text-slate-300 underline block"
        >
          دوباره امتحان کن
        </button>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="space-y-2" dir="rtl">
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-2xl border"
          style={{
            background: "rgba(239,68,68,0.08)",
            borderColor: "rgba(239,68,68,0.25)",
          }}
        >
          <svg
            viewBox="0 0 20 20"
            fill="#ef4444"
            className="w-5 h-5 flex-shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-400 text-sm">{errorMsg}</p>
        </div>
        <button
          onClick={() => setState("idle")}
          className="text-xs text-slate-500 hover:text-slate-300 underline"
        >
          دوباره تلاش کن
        </button>
      </div>
    );
  }

  // حالت پیشفرض (idle)
  return (
    <button
      onClick={handleClick}
      className="group flex items-center gap-3 px-5 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-95 w-full"
      style={{
        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        boxShadow: "0 4px 20px rgba(37,99,235,0.3)",
      }}
      dir="rtl"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
      </svg>
      <span>اتصال به بات تلگرام</span>
      <svg
        className="w-4 h-4 transition-transform group-hover:-translate-x-1 mr-auto"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
