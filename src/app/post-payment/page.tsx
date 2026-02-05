// src/app/post-payment/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function PostPaymentPage() {
  const router = useRouter();
  const search = useSearchParams();
  const eventId = search.get("eventId") || "next";

  const openTelegram = () => {
    // لینک کانال/گروه تلگرام واقعی را اینجا قرار دهید
    window.location.href = "https://t.me/your_channel_link";
  };

  const openSiteChat = () => {
    router.push(`/chat?eventId=${eventId}`);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-xl mx-auto border border-slate-200 rounded-2xl p-6">
        <h1 className="text-xl font-black mb-4">نحوه تعامل را انتخاب کنید</h1>
        <p className="text-slate-600 mb-6">
          می‌خواهید وارد کانال تلگرام شوید یا در گروه این ایونت در داخل سایت چت
          کنید؟
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={openTelegram}
            className="bg-slate-900 text-white rounded-xl py-4 font-bold hover:bg-slate-800 transition"
          >
            ورود به تلگرام
          </button>
          <button
            onClick={openSiteChat}
            className="bg-orange-500 text-white rounded-xl py-4 font-bold hover:bg-orange-600 transition"
          >
            چت داخل سایت
          </button>
        </div>
      </div>
    </div>
  );
}
