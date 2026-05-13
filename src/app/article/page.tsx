"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function ArticlePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" dir="rtl">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
          style={{ background: "rgba(255,107,0,0.1)" }}>
          <BookOpen size={28} className="text-orange-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">کتابخانه مقالات</h1>
        <p className="text-slate-500 text-sm">به‌زودی مقالات علمی و کاربردی در این بخش قرار می‌گیرد.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-orange-500 font-bold text-sm hover:underline">
          <ArrowRight size={14} /> بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
