"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { dispatch } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "LOGIN" });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* لوگو و برگشت */}
        <div className="text-center mb-6 md:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 text-sm md:text-base"
          >
            <ArrowRight size={18} />
            <span>بازگشت به صفحه اصلی</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
            خوش آمدید
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            وارد حساب کاربری خود شوید
          </p>
        </div>

        {/* فرم */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {/* ایمیل */}
            <div>
              <label className="block text-sm md:text-base font-bold text-slate-900 mb-2">
                ایمیل
              </label>
              <div className="relative">
                <Mail
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="example@email.com"
                  className="w-full pr-10 md:pr-12 pl-3 md:pl-4 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-slate-200 focus:border-orange-500 outline-none transition text-sm md:text-base"
                  required
                />
              </div>
            </div>

            {/* رمز عبور */}
            <div>
              <label className="block text-sm md:text-base font-bold text-slate-900 mb-2">
                رمز عبور
              </label>
              <div className="relative">
                <Lock
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full pr-10 md:pr-12 pl-10 md:pl-12 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-slate-200 focus:border-orange-500 outline-none transition text-sm md:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* فراموشی رمز */}
            <div className="flex items-center justify-between text-xs md:text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-slate-600">مرا به خاطر بسپار</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-orange-500 hover:text-orange-600 font-bold"
              >
                فراموشی رمز عبور؟
              </Link>
            </div>

            {/* دکمه ورود */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 md:py-4 rounded-xl md:rounded-2xl shadow-lg shadow-orange-200 transition-all hover:-translate-y-1 text-sm md:text-base"
            >
              ورود به حساب کاربری
            </button>

            {/* خط جداکننده */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs md:text-sm">
                <span className="px-4 bg-white text-slate-500">یا</span>
              </div>
            </div>

            {/* ورود با گوگل */}
            <button
              type="button"
              className="w-full bg-white hover:bg-slate-50 text-slate-900 font-bold py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-slate-200 transition-all flex items-center justify-center gap-3 text-sm md:text-base"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              ورود با Google
            </button>
          </form>

          {/* ثبت نام */}
          <p className="text-center text-slate-600 mt-6 text-xs md:text-sm">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/signup"
              className="text-orange-500 hover:text-orange-600 font-bold"
            >
              ثبت نام کنید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
