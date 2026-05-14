"use client";
import Link from "next/link";
import { Menu, X, BookOpen } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const links = [
    { href:"/", label:"خانه" },
    { href:"/events", label:"رویدادها" },
    { href:"/articles", label:"مقالات", icon:true },
  ];
  return (
    <header className="w-full bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">ر</div>
            <span className="font-bold text-xl text-white">راوی</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8" dir="rtl">
            {links.map(l=>(
              <Link key={l.href} href={l.href}
                className={`font-medium transition-colors flex items-center gap-1 ${(l.href==="/"?pathname==="/":pathname.startsWith(l.href))?"text-orange-400":"text-slate-200 hover:text-orange-400"}`}>
                {l.icon && <BookOpen size={13}/>}{l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:inline-flex items-center px-5 py-2 border border-orange-400/30 text-sm font-bold rounded-xl text-orange-300 bg-slate-800 hover:bg-slate-700 transition">ورود به حساب کاربری</Link>
            <button className="md:hidden text-slate-200" onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?<X size={24}/>:<Menu size={24}/>}</button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-4 space-y-3" dir="rtl">
          {links.map(l=><Link key={l.href} href={l.href} onClick={()=>setMenuOpen(false)} className="block text-slate-200 hover:text-orange-400 font-medium py-2">{l.label}</Link>)}
          <Link href="/login" onClick={()=>setMenuOpen(false)} className="block mt-3 text-center px-5 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm">ورود به حساب کاربری</Link>
        </div>
      )}
    </header>
  );
}
