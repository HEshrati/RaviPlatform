import CourseCard from "@/components/CourseCard";
import { Search, SlidersHorizontal, Bell, ArrowLeft } from "lucide-react";

const mockEvents = [
  {
    id: 1,
    title: "مسترکلس طراحی محصول و تجربه کاربری (UX)",
    image:
      "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?auto=format&fit=crop&q=80&w=800",
    time: "۱۲ ساعت",
    price: "1500000",
    students: 120,
    rating: 4.8,
    isProfileComplete: true,
  },
  {
    id: 2,
    title: "کارگاه روانشناسی شناختی در مدیریت تیم",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    time: "۴ ساعت",
    price: "450000",
    students: 85,
    rating: 4.9,
    isProfileComplete: false,
  },
  {
    id: 3,
    title: "دوره جامع برنامه‌نویسی ری‌اکت پیشرفته",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    time: "۴۰ ساعت",
    price: "3200000",
    students: 240,
    rating: 4.7,
    isProfileComplete: true,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* هدر بالای داشبورد */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900">
            داشبورد رویدادها
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            به پلتفرم یادگیری تعاملی راوی خوش آمدید.
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* نوار جستجو */}
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-4 h-4 md:w-[18px] md:h-[18px]" />
            <input
              type="text"
              placeholder="جستجو در رویدادها..."
              className="pl-3 md:pl-4 pr-9 md:pr-10 py-2 md:py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>

          <button className="p-2 md:p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition shadow-sm">
            <SlidersHorizontal size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
          <button className="p-2 md:p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition shadow-sm relative">
            <Bell size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="absolute top-1.5 md:top-2 right-2 md:right-2.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      {/* بنر وضعیت */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-900/20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          <div>
            <h2 className="text-base md:text-lg lg:text-xl font-bold mb-2">
              مسیر یادگیری خود را کامل کنید!
            </h2>
            <p className="text-indigo-100 text-xs md:text-sm opacity-90 max-w-lg leading-relaxed">
              طبق دیاگرام آنبوردینگ، برای دسترسی به رویدادهای تخصصی (Phase 2)،
              نیاز است پروفایل روانشناسی و تگ‌های علایق خود را تکمیل نمایید.
            </p>
          </div>
          <a
            href="/dashboard/profile"
            className="whitespace-nowrap px-5 md:px-6 py-2.5 md:py-3 bg-white text-indigo-700 rounded-xl font-bold text-xs md:text-sm hover:bg-indigo-50 transition shadow-lg flex items-center gap-2 w-full md:w-auto justify-center"
          >
            تکمیل پروفایل
            <ArrowLeft size={14} className="md:w-4 md:h-4" />
          </a>
        </div>
      </div>

      {/* لیست کارت‌ها */}
      <div>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-base md:text-lg font-bold text-slate-800">
            جدیدترین رویدادها
          </h2>
          <a
            href="#"
            className="text-xs text-indigo-600 font-bold hover:underline"
          >
            مشاهده همه
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
          {mockEvents.map((event) => (
            <CourseCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
}
