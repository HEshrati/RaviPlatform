"use client";
import {useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {Menu,X} from "lucide-react";
import Image from "next/image";
import {useApp} from "@/context/AppContext";
export default function Header(){
  const [open,setOpen]=useState(false);
  const {state}=useApp();
  const pathname=usePathname();
  const isHome=pathname==="/";
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/88 backdrop-blur-lg z-40 border-b border-slate-200 h-16 md:h-20 flex items-center shadow-sm">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
            <Image src="/logo.png" alt="راوی" fill className="object-contain group-hover:scale-105 transition-all duration-300" priority/>
          </div>
          <span className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-orange-500 transition-colors">راوی</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-slate-700 font-medium">
          <Link href="/" className={isHome?"text-orange-500 font-bold":"hover:text-orange-500 transition"}>صفحه اصلی</Link>
          <Link href="/events" className="hover:text-orange-500 transition">رزرو همنشینی</Link>
          <Link href="/about" className="hover:text-orange-500 transition">درباره ما</Link>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {state.isLoggedIn?(
            <Link href="/dashboard/profile" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition">داشبورد</Link>
          ):(
            <>
              <Link href="/login" className="text-slate-700 hover:text-orange-500 font-bold text-sm transition">ورود</Link>
              <Link href="/test" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition shadow-md">شروع رایگان</Link>
            </>
          )}
        </div>
        <button onClick={()=>setOpen(!open)} className="md:hidden p-2 text-slate-700">{open?<X size={24}/>:<Menu size={24}/>}</button>
      </div>
      {open&&(
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-4 flex flex-col gap-3 md:hidden shadow-lg">
          <Link href="/" onClick={()=>setOpen(false)} className="text-slate-800 font-bold py-2">صفحه اصلی</Link>
          <Link href="/events" onClick={()=>setOpen(false)} className="text-slate-800 font-bold py-2">رزرو همنشینی</Link>
          {state.isLoggedIn?(
            <Link href="/dashboard/profile" onClick={()=>setOpen(false)} className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold text-center">داشبورد</Link>
          ):(
            <Link href="/login" onClick={()=>setOpen(false)} className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold text-center">ورود / ثبت‌نام</Link>
          )}
        </div>
      )}
    </header>
  );
}
