"use client";

import Link from "next/link";
import {
  CheckCircle,
  Eye,
  MessageCircle,
  MoreHorizontal,
  AlertCircle,
  MapPin,
  Briefcase,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function UserProfile() {
  const { state } = useAppContext();
  const { userCity, isTestTaken } = state;

  const userData = {
    name: "سارا جهانگیری", // این بخش بعداً می‌تواند از کانتکست بیاید
    avatar: "https://github.com/shadcn.png",
    job: "توسعه‌دهنده وب",
  };

  return (
    <div className="space-y-8 min-h-full pb-10">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            پروفایل کاربری
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-2">
            مدیریت اطلاعات شخصی، مشاهده آمار و عملکرد
          </p>
        </div>

        {/* لینک مستقیم به صفحه تکمیل/ویرایش پروفایل */}
        <Link
          href="/dashboard/complete-profile"
          className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 font-bold text-sm transition shadow-sm active:scale-95 flex items-center gap-2"
        >
          ویرایش اطلاعات
        </Link>
      </div>

      {/* Stats Cards - بدون تغییر رنگ‌ها چون رنگ وضعیت هستند (سبز/قرمز/آبی) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition duration-300 flex items-center gap-5">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
            <MessageCircle size={26} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
              پیام‌های نخوانده
            </p>
            <h3 className="text-3xl font-black text-slate-900">۱۲</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition duration-300 flex items-center gap-5">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 shadow-inner">
            <CheckCircle size={26} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
              تطابق‌های موفق
            </p>
            <h3 className="text-3xl font-black text-slate-900">۸۵٪</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition duration-300 flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner">
            <Eye size={26} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
              بازدید پروفایل
            </p>
            <h3 className="text-3xl font-black text-slate-900">۱,۲۰۴</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: User Info Card */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center sticky top-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 ring-1 ring-slate-100">
              <img
                src={userData.avatar}
                className="w-full h-full object-cover"
                alt="User Avatar"
              />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {userData.name}
            </h2>

            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-6">
              <Briefcase size={16} />
              <span>{userData.job}</span>
              <span className="text-slate-300">|</span>
              <MapPin size={16} />
              <span>{userCity || "شهر نامشخص"}</span>
            </div>

            <div className="w-full bg-slate-50 rounded-2xl p-4 flex justify-between items-center text-sm border border-slate-100">
              <span className="text-slate-600 font-bold">
                وضعیت تست روانشناسی:
              </span>
              {isTestTaken ? (
                <span className="text-green-600 font-black flex items-center gap-1.5 bg-green-100 px-3 py-1 rounded-lg">
                  <CheckCircle size={16} /> انجام شده
                </span>
              ) : (
                <Link
                  href="/test"
                  className="text-orange-600 font-black flex items-center gap-1.5 bg-orange-100 px-3 py-1 rounded-lg hover:bg-orange-200 transition"
                >
                  <AlertCircle size={16} /> انجام نشده (شروع)
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-orange-500 rounded-full inline-block"></span>
                رویدادهای موفق اخیر
              </h3>
              <button className="text-slate-400 hover:text-slate-700 transition">
                <MoreHorizontal />
              </button>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition">
                    <img
                      src={`https://picsum.photos/200?random=${item}`}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
                      alt="Event"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-base truncate mb-1 group-hover:text-orange-600 transition">
                      کارگاه تیم‌سازی در {userCity || "تهران"}
                    </h4>
                    <p className="text-xs font-medium text-slate-500">
                      ۱۴۰۴/۱۰/۲۰ • حضوری
                    </p>
                  </div>
                  <span className="px-4 py-1.5 bg-green-50 text-green-700 text-xs font-black rounded-full shrink-0 border border-green-100">
                    تکمیل شده
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
