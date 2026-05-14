"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getCategoryById, getEventById } from "@/lib/events-catalog";
import { getTopicImage } from "@/lib/dynamic-images";
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

const TELEGRAM_BOT_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || "https://t.me/RaviMatchBot";

export default function BookingPage() {
  const params = useParams<{ id: string }>();
  const event = getEventById(params.id);
  const category = getCategoryById(event?.categoryId ?? "hamneshin");
  const [booked, setBooked] = useState(false);

  if (booked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        dir="rtl"
        style={{ background: "transparent" }}
      >
        <div
          className="max-w-md w-full rounded-[40px] p-8 text-center relative overflow-hidden shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#102647] to-orange-500" />
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-3">
            رزرو با موفقیت انجام شد!
          </h1>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            همنشینی شما ثبت شد. برای هماهنگی‌های بیشتر و دریافت اطلاعات تکمیلی
            وارد ربات تلگرام راوی شوید.
          </p>
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#2AABEE] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#229ED9] transition shadow-lg mb-4 w-full justify-center"
          >
            <Send size={20} className="rotate-[-45deg]" />
            ورود به ربات تلگرام راوی
          </a>
          <Link
            href="/dashboard"
            className="block text-slate-400 hover:text-slate-600 text-sm font-bold transition"
          >
            بازگشت به داشبورد
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-8 pb-24"
      style={{ background: "transparent" }}
    >
      <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 rounded-3xl p-6 space-y-4"
          style={{
            background: "rgba(15,23,42,0.75)",
            backdropFilter: "blur(16px)",
          }}
        >
          <img
            src={getTopicImage(
              event?.topic ?? category?.theme ?? "social meetup",
              90,
              1400,
              700,
            )}
            alt={event?.title ?? "رزرو همنشینی"}
            className="rounded-2xl h-56 w-full object-cover"
          />
          <h1 className="text-2xl font-black mb-3 text-white">
            جزئیات همنشینی {event?.title ?? params.id}
          </h1>
          <p className="text-slate-300 mb-4">
            این صفحه نهایی رزرو است. اطلاعات تکمیلی فقط در داشبورد خصوصی نمایش
            داده می‌شود.
          </p>

          <div className="rounded-2xl bg-slate-800/80 p-4">
            <p className="text-orange-300">۱۵ نفر منتظر همنشینی شما هستند.</p>
          </div>

          {category && (
            <>
              <div className="rounded-2xl bg-slate-800/80 p-4">
                <h2 className="font-black text-orange-400 mb-2">
                  نمونه‌های {category.title}
                </h2>
                <ul className="text-sm text-slate-200 space-y-1">
                  {category.samples.map((sample) => (
                    <li key={sample}>• {sample}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-slate-800/80 p-4">
                <h2 className="font-black text-orange-400 mb-2">
                  تخفیف‌های ویژه {category.title}
                </h2>
                <ul className="text-sm text-slate-200 space-y-1">
                  {category.discounts.map((discount) => (
                    <li key={discount}>• {discount}</li>
                  ))}
                </ul>
                <Link
                  href={`/events/category/${category.id}`}
                  className="inline-block mt-3 text-orange-300"
                >
                  مشاهده صفحه داینامیک دسته‌بندی
                </Link>
              </div>
            </>
          )}
        </div>

        <aside
          className="rounded-3xl p-6 h-fit"
          style={{
            background: "rgba(15,23,42,0.80)",
            backdropFilter: "blur(16px)",
          }}
        >
          <p className="text-sm text-slate-300">هزینه ثبت‌نام</p>
          <p className="text-2xl font-black mt-1 text-white">۴۵۰,۰۰۰ تومان</p>
          <button
            onClick={() => setBooked(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl py-3 mt-6 font-bold transition-all shadow-lg shadow-orange-500/30"
          >
            تکمیل رزرو
          </button>
          <Link
            href="/events"
            className="block text-center mt-3 text-slate-400 text-sm hover:text-slate-200 transition"
          >
            بازگشت
          </Link>
        </aside>
      </div>
    </div>
  );
}
