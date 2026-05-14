"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  MessageSquare,
  User,
  Zap,
} from "lucide-react";

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "داشبورد", icon: LayoutDashboard, path: "/dashboard" },
    { name: "کاوش رویدادها", icon: Compass, path: "/events" },
    { name: "چت‌ها", icon: MessageSquare, path: "/chat" },
    { name: "پروفایل کاربری", icon: User, path: "/dashboard/profile" },
  ];

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col overflow-hidden">
      {/* TEST: Simple colored box to verify rendering */}
      <div className="w-full h-20 bg-orange-500 flex items-center justify-center">
        <h1 className="text-2xl font-bold">TEST SIDEBAR</h1>
      </div>

      {/* هدر */}
      <div className="p-6 bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <Zap size={22} className="text-white" fill="white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">راوی</h2>
            <span className="text-xs text-slate-400">RAAVI</span>
          </div>
        </div>
      </div>

      {/* منوها */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-900">
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => onClose && onClose()}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  ${
                    isActive
                      ? "bg-orange-500 text-white font-bold"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }
                `}
              >
                <Icon size={20} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* بخش تست - اگر این رو ببینید یعنی همه چی کار میکنه */}
        <div className="mt-8 p-4 bg-green-500 rounded-lg">
          <p className="text-white text-sm font-bold">
            ✅ اگر این باکس سبز رو می‌بینید، Sidebar کار می‌کند!
          </p>
        </div>

        {/* پیشنهاد */}
        <div className="mt-4 p-4 bg-slate-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={20} className="text-yellow-400" />
            <span className="text-sm font-bold">پیشنهاد ویژه</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            کارگاه تیم‌سازی با ۵۰٪ تخفیف
          </p>
          <button className="w-full py-2 bg-white text-slate-900 text-xs font-bold rounded-lg">
            مشاهده
          </button>
        </div>
      </div>
    </div>
  );
}
