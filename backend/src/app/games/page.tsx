"use client";

import Link from "next/link";

export default function GamesPage() {
  const reservedEventStarted = true;

  return (
    <div className="min-h-screen px-4 py-8 pb-24">
      <div className="max-w-3xl mx-auto app-card rounded-3xl p-6">
        <h1 className="text-2xl font-black">بازی پرسش و پاسخ همنشینی</h1>
        {reservedEventStarted ? (
          <div className="mt-5 space-y-3">
            <p className="text-slate-200">این بازی براساس همنشینی رزروشده شما فعال شده است.</p>
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="font-bold text-white">سوال: اولین چیزی که باعث همدلی در جمع می‌شود چیست؟</p>
            </div>
            <div className="grid gap-2">
              <button className="rounded-xl bg-slate-800 p-3 text-right hover:bg-slate-700">گوش‌دادن فعال</button>
              <button className="rounded-xl bg-slate-800 p-3 text-right hover:bg-slate-700">شوخی یخ‌شکن</button>
              <button className="rounded-xl bg-slate-800 p-3 text-right hover:bg-slate-700">معرفی کوتاه</button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-slate-300">بعد از شروع همنشینی رزرو شده، بازی برای شما نمایش داده می‌شود.</p>
        )}
        <Link href="/dashboard" className="inline-block mt-6 text-orange-300">بازگشت به داشبورد</Link>
      </div>
    </div>
  );
}
