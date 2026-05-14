"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Eye, EyeOff, AlertCircle } from "lucide-react";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const C: any = {
  background: "linear-gradient(145deg,#1B2A4A 0%,#132038 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};
export default function CafeLogin() {
  const router = useRouter();
  const [u, setU] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  async function login() {
    if (!u || !pw) {
      setErr("نام کاربری و رمز را وارد کنید");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API_URL}/api/cafe/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: pw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "خطا در ورود");
      localStorage.setItem("cafe_token", data.token);
      localStorage.setItem("cafe_name", data.cafeName);
      router.push("/cafe/attendance");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      dir="rtl"
      style={{ background: "#0B1628" }}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg,#FF6B00,#FF9A3C)" }}
          >
            <Coffee size={32} className="text-white" />
          </div>
          <h1 className="text-xl font-black text-white">ورود همکاران</h1>
          <p className="text-slate-400 text-sm mt-1">
            این صفحه مخصوص ورود همکاران کافه‌ها است
          </p>
        </div>
        <div className="rounded-2xl p-6 space-y-4" style={C}>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              نام کاربری
            </label>
            <input
              value={u}
              onChange={(e) => setU(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="cafe_argo"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 text-white text-sm outline-none"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              رمز عبور
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
                className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-800/60 text-white text-sm outline-none"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {err && (
            <div
              className="flex items-center gap-2 p-3 rounded-xl text-red-400 text-xs"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              <AlertCircle size={13} />
              {err}
            </div>
          )}
          <button
            onClick={login}
            disabled={loading}
            className="w-full py-3 rounded-xl font-black text-white"
            style={{
              background: "linear-gradient(135deg,#FF6B00,#FF9A3C)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "در حال ورود..." : "ورود به سامانه"}
          </button>
        </div>
      </div>
    </main>
  );
}
