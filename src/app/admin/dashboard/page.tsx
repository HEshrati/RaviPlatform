"use client";

import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" dir="rtl">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
          style={{ background: "rgba(147,51,234,0.1)" }}>
          <Shield size={28} className="text-purple-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">پنل مدیریت</h1>
        <p className="text-slate-500 text-sm">پنل مدیریت راوی برای ادمین‌ها.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-orange-500 font-bold text-sm hover:underline">
          <ArrowRight size={14} /> بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
