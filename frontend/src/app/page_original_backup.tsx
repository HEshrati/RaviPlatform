"use client";

import PsychologyArticles from "@/components/PsychologyArticles";

export default function HomePage() {
  return (
    <div className="min-h-screen" dir="rtl" style={{ background: "#0f172a" }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-white font-black text-3xl mb-3">راوی</h1>
          <p className="text-slate-400 text-lg">آماده‌ای همنشینی خودت را پیدا کنی؟</p>
        </div>
        <PsychologyArticles />
      </div>
    </div>
  );
}
