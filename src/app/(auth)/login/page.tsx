"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // اضافه شده برای ریدایرکت
import { useAppContext } from "@/context/AppContext"; // اضافه شده برای دسترسی به کانتکست
import {
  Lock,
  Smartphone,
  ArrowLeft,
  Star,
  User,
  Sparkles,
  LogIn,
  Apple,
  Chrome,
} from "lucide-react";
import { testimonials } from "@/lib/testimonials";

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login"); // پیش‌فرض روی login
  const [tIndex, setTIndex] = useState(0);

  // هوک‌های مورد نیاز
  const { dispatch } = useAppContext();
  const router = useRouter();

  // لاجیک چرخش نظرات
  useEffect(() => {
    const interval = setInterval(() => {
      setTIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const t = testimonials[tIndex];

  // هندل کردن ورود
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();

    // شبیه‌سازی عملیات ورود (در آینده اینجا API کال می‌شود)
    console.log("Logging in...");

    // 1. تغییر وضعیت در کانتکست
    dispatch({ type: "LOGIN" });

    // 2. تنظیم شهر کاربر (مثال)
    dispatch({ type: "SET_CITY", payload: "تهران" });

    // 3. هدایت به داشبورد
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_480px]">
        {/* سمت چپ: فرم */}
        <div className="relative p-6 lg:p-10">
          <div className="absolute top-6 left-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition text-sm font-medium"
            >
              <ArrowLeft size={18} />
              بازگشت به خانه
            </Link>
          </div>

          <div className="text-right space-y-2 mt-2 mb-6">
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 flex items-center justify-end gap-3">
              خوش آمدید <span className="text-4xl animate-pulse">👋</span>
            </h1>
            <p className="text-slate-500 text-sm lg:text-base">
              لطفا برای ادامه شماره موبایل خود را وارد کنید.
            </p>
          </div>

          <div className="bg-slate-100 p-1.5 rounded-2xl flex mb-6">
            <button
              onClick={() => setAuthMode("register")}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                authMode === "register"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              ثبت نام
            </button>
            <button
              onClick={() => setAuthMode("login")}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                authMode === "login"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              ورود
            </button>
          </div>

          {/* اتصال تابع handleAuth به فرم */}
          <form className="space-y-5" onSubmit={handleAuth}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block text-right">
                شماره موبایل
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors pointer-events-none">
                  <Smartphone size={20} />
                </div>
                <input
                  type="tel"
                  placeholder="0912..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-left placeholder:text-right font-medium"
                  dir="ltr"
                  required // الزامی کردن فیلد
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">
                  رمز عبور
                </label>
                {authMode === "login" && (
                  <Link
                    href="#"
                    className="text-xs text-orange-500 hover:text-orange-600 font-bold"
                  >
                    فراموشی رمز؟
                  </Link>
                )}
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors pointer-events-none">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-left placeholder:text-right font-bold tracking-widest"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 text-lg mt-4 cursor-pointer"
            >
              {authMode === "login" ? "ورود به حساب" : "ثبت نام کنید"}
              <LogIn className="rotate-180" size={20} />
            </button>
          </form>

          {/* ... بقیه کد (بخش سوشال و فوتر) بدون تغییر ... */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">
              یا ورود با
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 border border-slate-200 rounded-2xl py-3 text-slate-700 hover:bg-slate-50 transition">
              <Apple size={18} />
              <span className="font-bold text-sm">اپل</span>
            </button>
            <button className="flex items-center justify-center gap-2 border border-slate-200 rounded-2xl py-3 text-slate-700 hover:bg-slate-50 transition">
              <Chrome size={18} />
              <span className="font-bold text-sm">گوگل</span>
            </button>
          </div>
        </div>

        {/* سمت راست: برندینگ */}
        <div className="bg-[#161F2E] text-white p-8 lg:p-10 relative hidden lg:block">
          {/* ... کدهای سمت راست عیناً تکرار شود ... */}
          <div className="flex items-center justify-between">
            <div className="text-xl font-black">راوی</div>
            <div className="w-9 h-9 rounded-xl bg-slate-800/50 flex items-center justify-center">
              <Sparkles className="text-slate-300" size={20} />
            </div>
          </div>
          <div className="mt-10 text-right">
            <h1 className="text-4xl font-extrabold mb-6 leading-tight">
              هوشمندانه <br /> انتخاب کن
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed font-light mb-12">
              با ورود به راوی، به جامعه‌ای از افراد می‌پیوندید که به دنبال روابط
              معنادار بر پایه علم روانشناسی هستند.
            </p>
          </div>
          <div className="w-full bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50 shadow-xl relative">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="text-orange-500 fill-orange-500"
                />
              ))}
            </div>
            <p className="text-slate-300 text-sm text-right leading-7 italic mb-6">
              "{t.text}"
            </p>
            <div className="flex items-center justify-end gap-4">
              <div className="text-right">
                <h4 className="font-bold text-white text-sm">{t.name}</h4>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <span className="text-[10px] text-slate-400">
                    {t.role ?? "کاربر راوی"}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center overflow-hidden border border-slate-500">
                <User className="text-slate-300 w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-l from-transparent to-[#161F2E]" />
        </div>
      </div>
    </div>
  );
}
