"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "پروفایل", href: "/dashboard/profile" },
  { label: "بازی‌ها", href: "/games" },
  { label: "اعلان‌ها", href: "/notifications" },
  { label: "رزرو", href: "/events" },
];

export default function GlobalNavbar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex sticky top-0 z-40 bg-[#0B1F3A] border-b border-[#12345f] px-6 py-3 items-center justify-center gap-3">
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
              active
                ? "bg-[#FF7A00] text-white"
                : "bg-[#0f2a4d] text-slate-200 hover:bg-[#FF7A00]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
