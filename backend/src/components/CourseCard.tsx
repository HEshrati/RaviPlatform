"use client";

import { Clock, Users, Star, ArrowLeft, Lock, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  id: string | number;
  title: string;
  image: string;
  time: string;
  price: string;
  students: number;
  rating: number;
  // ویژگی جدید برای منطق دیاگرام (فاز ۱ -> فاز ۲)
  isProfileComplete?: boolean;
}

export default function CourseCard({
  id,
  title,
  image,
  time,
  price,
  students,
  rating,
  isProfileComplete = true, // مقدار پیش‌فرض true برای نمایش عادی
}: CourseCardProps) {
  // فرمت کردن قیمت
  const formattedPrice = Number(price).toLocaleString("fa-IR");

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300 flex flex-col h-full relative">
      {/* بخش تصویر */}
      <div className="h-52 overflow-hidden relative bg-slate-100">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            !isProfileComplete
              ? "grayscale-[50%] blur-[1px]"
              : "group-hover:scale-105"
          }`}
        />

        {/* بج‌ها */}
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
            <Star size={10} className="text-yellow-500 fill-yellow-500" />
            <span>{rating}</span>
          </div>
        </div>

        {/* لایه قفل (اگر پروفایل کامل نباشد) */}
        {!isProfileComplete && (
          <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white backdrop-blur-[2px] z-10 animate-in fade-in duration-300">
            <div className="bg-white/10 p-3 rounded-full mb-2 backdrop-blur-md border border-white/20">
              <Lock size={24} />
            </div>
            <span className="font-bold text-sm">نیازمند تکمیل پروفایل</span>
          </div>
        )}
      </div>

      {/* بدنه کارت */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-800 mb-3 leading-relaxed line-clamp-2 min-h-[3.5rem]">
          {title}
        </h3>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-6">
          <div className="bg-slate-50 px-2 py-1 rounded-md flex items-center gap-1.5">
            <Clock size={14} className="text-indigo-500" />
            {time}
          </div>
          <div className="bg-slate-50 px-2 py-1 rounded-md flex items-center gap-1.5">
            <Users size={14} className="text-indigo-500" />
            {students} دانشجو
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400">
              مبلغ سرمایه‌گذاری
            </span>
            <div className="flex items-center gap-1">
              <span className="text-lg font-black text-slate-900">
                {formattedPrice}
              </span>
              <span className="text-xs text-slate-500 font-normal">تومان</span>
            </div>
          </div>

          {/* دکمه هوشمند بر اساس دیاگرام */}
          {isProfileComplete ? (
            <Link href={`/event/${id}`}>
              <button className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white flex items-center justify-center transition-colors shadow-lg shadow-slate-900/20 group-hover:scale-110">
                <ArrowLeft size={20} />
              </button>
            </Link>
          ) : (
            <Link href="/dashboard/profile">
              <button className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1">
                <ShieldAlert size={14} />
                تکمیل مدارک
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
