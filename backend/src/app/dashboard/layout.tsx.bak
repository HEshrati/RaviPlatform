"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100 pb-20">
      <div className="hidden lg:block"><Sidebar /></div>
      <main className="flex-1 p-4 lg:p-8">
        <header className="mb-6 bg-slate-900 text-white rounded-2xl px-5 py-4 flex items-center justify-between">
          <h1 className="font-black text-xl">داشبورد راوی</h1>
          <Link href="/" className="text-orange-400 font-bold">رفتن به صفحه اصلی</Link>
        </header>
        {children}
      </main>
    </div>
  );
}
