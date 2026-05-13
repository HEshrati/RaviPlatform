"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { testimonialsData } from "@/lib/testimonials";

type Mode = "login" | "signup";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen" style={{ background: "transparent" }} />
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/events";
  const { login } = useApp();

  const [mode, setMode] = useState<Mode>("login");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [fade, setFade] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    setMounted(true);
    const iv = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTestimonialIdx((p) => (p + 1) % testimonialsData.length);
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const isValidPhone = (v: string) => /^09\d{9}$/.test(v.replace(/\s/g, ""));

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValidPhone(phone))
      return setError("شماره موبایل معتبر نیست. مثال: 09123456789");
    if (mode === "signup") {
      if (!firstName.trim() || firstName.trim().length < 2)
        return setError("نام باید حداقل ۲ حرف باشد.");
      if (!lastName.trim() || lastName.trim().length < 2)
        return setError("نام خانوادگی باید حداقل ۲ حرف باشد.");
      setLoading(true);
      try {
        const checkRes = await fetch(`${API}/api/auth/check-phone`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobileNumber: phone.replace(/\s/g, "") }),
        });
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          if (checkData.exists) {
            setError(
              "شما قبلاً ثبت‌نام کرده‌اید. لطفاً از قسمت ورود وارد شوید.",
            );
            setLoading(false);
            return;
          }
        }
      } catch {}
      setLoading(false);
    }
    setLoading(true);
    try {
      const ck = await fetch(`${API}/api/auth/check-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: phone.replace(/\s/g, "") }),
      });
      if (ck.ok) {
        const cd = await ck.json();
        if (mode === "login" && !cd.exists) {
          setError("این شماره ثبت‌نام نشده است. لطفاً ابتدا ثبت‌نام کنید.");
          setLoading(false);
          return;
        }
        if (mode === "signup" && cd.exists) {
          setError("شما قبلاً ثبت‌نام کرده‌اید. لطفاً از قسمت ورود وارد شوید.");
          setLoading(false);
          return;
        }
      }
    } catch {}
    try {
      const res = await fetch(`${API}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: phone.replace(/\s/g, "") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در ارسال کد");
      setOtpSent(true);
      if (data.dev_code) {
        setOtpCode(data.dev_code);
        setError("[DEV] کد: " + data.dev_code);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fullName =
        mode === "signup"
          ? `${firstName.trim()} ${lastName.trim()}`
          : undefined;
      const res = await fetch(`${API}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: phone.replace(/\s/g, ""),
          code: otpCode,
          name: fullName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "کد تایید نامعتبر است");
      localStorage.setItem("token", data.access_token);
      document.cookie = `token=${data.access_token}; path=/; max-age=604800; SameSite=Lax`;
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.user, data.access_token);
        if (!data.user.isTestTaken || !data.user.isProfileComplete) {
          router.replace("/dashboard/complete-profile");
          return;
        }
      }
      router.replace(redirectTo);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const t = testimonialsData[testimonialIdx];
  const inp =
    "w-full border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-black bg-white outline-none focus:ring-2 focus:ring-orange-400 transition placeholder:text-slate-400";
  const btn =
    "w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-200 disabled:opacity-60 text-base";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      dir="rtl"
    >
      <div
        className="w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex min-h-[600px]"
        style={{
          background: "rgba(15,23,42,0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="flex-1 p-8 md:p-10 flex flex-col justify-between relative"
          style={{ background: "rgba(10,22,40,0.6)" }}
        >
          {mounted && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-r-[2rem]">
              <div className="absolute top-0 -left-10 w-[300px] h-[300px] bg-orange-400/10 rounded-full mix-blend-multiply filter blur-[60px] animate-blob" />
              <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-yellow-400/10 rounded-full mix-blend-multiply filter blur-[60px] animate-blob animation-delay-2000" />
              <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] bg-orange-300/10 rounded-full mix-blend-multiply filter blur-[60px] animate-blob animation-delay-4000" />
            </div>
          )}

          <div className="relative z-10">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-8 transition"
            >
              ← بازگشت به رویدادها
            </Link>

            {!otpSent ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-white">
                    به پلتفرم راوی خوش آمدید
                  </h2>
                  <p className="text-slate-400 mt-1 text-sm">
                    {mode === "login"
                      ? "لطفا برای ادامه شماره موبایل خود را وارد کنید."
                      : "اطلاعات خود را برای ثبت‌نام وارد کنید."}
                  </p>
                </div>

                <div className="flex bg-white/10 p-1 rounded-2xl mb-6">
                  {(["login", "signup"] as Mode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setMode(m);
                        setError("");
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        mode === m
                          ? "bg-white/20 text-white shadow-sm"
                          : "text-slate-400"
                      }`}
                    >
                      {m === "login" ? "ورود" : "ثبت نام"}
                    </button>
                  ))}
                </div>

                {error && (
                  <div
                    className={`mb-4 px-4 py-3 rounded-xl text-sm ${
                      error.startsWith("[DEV]")
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    {error}
                    {error.includes("قبلاً ثبت‌نام") && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setError("");
                        }}
                        className="block mt-2 w-full bg-orange-500 text-white text-sm font-bold py-2 rounded-xl text-center"
                      >
                        رفتن به صفحه ورود ←
                      </button>
                    )}
                  </div>
                )}

                <form onSubmit={handleSendOtp} className="space-y-3">
                  {mode === "signup" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          نام
                        </label>
                        <input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={inp}
                          placeholder="علی"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          نام خانوادگی <span className="text-red-400">*</span>
                        </label>
                        <input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={inp}
                          placeholder="رضایی"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      شماره موبایل
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/[^\d]/g, ""))
                        }
                        className="w-full border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-black bg-white outline-none focus:ring-2 focus:ring-orange-400 transition placeholder:text-slate-400 text-left"
                        placeholder="09123456789"
                        dir="ltr"
                        maxLength={11}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className={btn}>
                    {loading
                      ? "در حال ارسال..."
                      : mode === "login"
                        ? "ورود ←"
                        : "ثبت نام کنید ←"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <div className="text-3xl mb-1">🔐</div>
                  <h2 className="text-2xl font-black text-white">کد تایید</h2>
                  <p className="text-slate-400 mt-1 text-sm">
                    کد ۶ رقمی ارسال‌شده به{" "}
                    <span className="font-bold text-slate-200">{phone}</span> را
                    وارد کنید.
                  </p>
                </div>

                {error && (
                  <div
                    className={`mb-4 px-4 py-3 rounded-xl text-sm ${
                      error.startsWith("[DEV]")
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otpCode}
                    onChange={(e) =>
                      setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-5 text-center text-3xl font-black text-white tracking-[0.5em] outline-none focus:ring-2 focus:ring-orange-400 transition"
                    placeholder="------"
                    maxLength={6}
                    dir="ltr"
                    autoFocus
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading || otpCode.length !== 6}
                    className={btn}
                  >
                    {loading ? "در حال تایید..." : "تایید کد ←"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode("");
                      setError("");
                    }}
                    className="w-full text-sm text-slate-400 hover:text-orange-500 py-2 transition"
                  >
                    ← اصلاح شماره موبایل
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="relative z-10 mt-6 space-y-3">
            <div className="border-t border-white/10 pt-4">
              <Link href="/cafe/login">
                <button className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3 rounded-2xl transition shadow-md active:scale-[0.98]">
                  <span>☕</span>
                  ورود همکاران
                </button>
              </Link>
            </div>

            <div className="flex justify-center gap-4 text-xs text-slate-400">
              <Link href="/terms" className="hover:text-slate-300 transition">
                قوانین و مقررات
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-slate-300 transition">
                حریم خصوصی
              </Link>
              <span>•</span>
              <Link href="/about" className="hover:text-slate-300 transition">
                پشتیبانی
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden md:flex w-[42%] bg-[#1e2535] flex-col justify-between p-8 relative overflow-hidden">
          <div className="absolute top-[-60px] right-[-60px] w-[220px] h-[220px] rounded-full bg-white/5" />
          <div className="absolute top-[-20px] right-[-20px] w-[140px] h-[140px] rounded-full bg-white/5" />
          <div className="absolute bottom-[-80px] left-[-40px] w-[260px] h-[260px] rounded-full bg-orange-500/10" />

          <div className="relative z-10 flex items-center justify-between">
            <Image
              src="/logo.png"
              alt="راوی"
              width={70}
              height={70}
              className="object-contain brightness-0 invert opacity-90"
            />
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white text-lg">
              ✦
            </div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
            <div className="w-14 h-14 bg-[#2a3347] rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-lg">
              ✨
            </div>
            <h3 className="text-white text-3xl font-black leading-snug mb-4">
              هوشمندانه
              <br />
              انتخاب کن
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              با ورود به راوی، به جامعه‌ای از افراد می‌پیوندید که به دنبال روابط
              معنادار بر پایه علم روانشناسی هستند.
            </p>
          </div>

          <div className="relative z-10">
            <div
              className="bg-[#2a3347] rounded-2xl p-5 transition-all duration-300"
              style={{
                opacity: fade ? 1 : 0,
                transform: fade ? "translateY(0)" : "translateY(6px)",
              }}
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t?.rating || 5 }).map((_, i) => (
                  <span key={i} className="text-orange-400 text-sm">
                    ★
                  </span>
                ))}
                {Array.from({ length: 5 - (t?.rating || 5) }).map((_, i) => (
                  <span key={i} className="text-slate-300 text-sm">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                «{t?.message}»
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-xs font-bold">
                    {t?.initials}
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">{t?.name}</p>
                    <p className="text-slate-400 text-[10px]">{t?.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  آنلاین
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-1.5 mt-3">
              {testimonialsData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`rounded-full transition-all ${
                    i === testimonialIdx
                      ? "w-4 h-1.5 bg-orange-400"
                      : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
