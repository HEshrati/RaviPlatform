"use client";

// ─────────────────────────────────────────────────────────────────────────────
// تغییر ۱: بنر "پیشنهاد راوی" — جایگزین بنر فعلی در بالای کتگوری‌ها
// این قطعه را جایگزین div بنر فعلی کن (کد با کامنت "── بنر کتگوری با بک‌گراند سورمه‌ای ──")
// ─────────────────────────────────────────────────────────────────────────────

// در ابتدای فایل این import را اضافه کن:
// import { Zap } from "lucide-react";

/*
بنر پیشنهاد راوی — اضافه کن بالای گرید کتگوری‌ها:
*/

const RaviBanner = ({ userName, router }: { userName: string; router: any }) => (
  <button
    onClick={() => router.push("/dashboard/recommendations")}
    className="w-full mt-4 mb-5 relative rounded-2xl overflow-hidden text-right select-none transition-all hover:scale-[1.01] active:scale-[0.99]"
    style={{
      background: "linear-gradient(135deg, #1B2A4A 0%, #0d1e35 60%, #1a1035 100%)",
      boxShadow: "0 8px 32px rgba(27,42,76,0.35)",
      minHeight: "128px",
    }}
  >
    {/* دکوراسیون پس‌زمینه */}
    <div
      className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
      style={{ background: "radial-gradient(circle, #FF6B00, transparent)", transform: "translate(30%,-30%)" }}
    />
    <div
      className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
      style={{ background: "radial-gradient(circle, #6366f1, transparent)", transform: "translate(-30%,30%)" }}
    />

    <div className="relative z-10 flex items-center justify-between px-5 py-4 h-full min-h-[128px]">
      {/* متن سمت راست */}
      <div className="text-white flex-1">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black mb-2"
          style={{ background: "rgba(255,107,0,0.25)", border: "1px solid rgba(255,107,0,0.4)", color: "#FF8C3A" }}
        >
          <Zap size={10} />
          الگوریتم هوشمند راوی
        </div>
        <h2 className="text-xl font-black leading-snug">
          پیشنهاد راوی
        </h2>
        <p className="text-sm font-black leading-snug mt-0.5" style={{ color: "#FF8C3A" }}>
          به {userName} 👋
        </p>
        <p className="text-[11px] opacity-60 mt-1 line-clamp-1">
          رویدادهایی که دقیقاً برای تو انتخاب شده‌اند
        </p>
      </div>

      {/* آیکون سمت چپ */}
      <div className="flex flex-col items-center gap-2 mr-3">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: "rgba(255,107,0,0.15)",
            border: "1px solid rgba(255,107,0,0.25)",
            boxShadow: "0 4px 20px rgba(255,107,0,0.2)",
          }}
        >
          <Sparkles size={28} className="text-orange-400" />
        </div>
        <div
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black text-white"
          style={{ background: "rgba(255,107,0,0.9)", boxShadow: "0 2px 12px rgba(255,107,0,0.4)" }}
        >
          مشاهده →
        </div>
      </div>
    </div>
  </button>
);


// ─────────────────────────────────────────────────────────────────────────────
// تغییر ۲: کتگوری‌های جدید با ۳ گروه اصلی
// این را جایگزین آرایه CATEGORIES و گرید کتگوری‌ها کن
// ─────────────────────────────────────────────────────────────────────────────

const MAIN_CATEGORIES = [
  {
    id: "entertainment",
    title: "سرگرمی",
    emoji: "🎮",
    color: "#FF6B00",
    bg: "rgba(255,107,0,0.12)",
    border: "rgba(255,107,0,0.25)",
    subcategories: [
      { id: "hambazi", title: "بازی" },
      { id: "musiki", title: "موسیقی" },
      { id: "varzesh", title: "ورزش" },
      { id: "cinema", title: "سینما" },
    ],
    icon: "/categories/4.PNG",
  },
  {
    id: "psychology",
    title: "دوست روانشناس من",
    emoji: "🧠",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.25)",
    subcategories: [
      { id: "rashdFardi", title: "رشد فردی" },
      { id: "meditation", title: "مدیتیشن" },
      { id: "groupSupport", title: "حمایت گروهی" },
      { id: "tarapist", title: "گروه درمانی" },
    ],
    icon: "/categories/5.PNG",
  },
  {
    id: "culture",
    title: "هنر و فرهنگ",
    emoji: "🎨",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.25)",
    subcategories: [
      { id: "naghashi", title: "نقاشی" },
      { id: "ketab", title: "کتاب‌خوانی" },
      { id: "akasi", title: "عکاسی" },
      { id: "theatre", title: "تئاتر" },
    ],
    icon: "/categories/2.PNG",
  },
];

// ─── کامپوننت کتگوری‌های جدید ────────────────────────────────────────────────
// این JSX را جایگزین div گرید کتگوری‌ها کن:

const NewCategoriesGrid = ({
  events,
  activeCategoriesInCity,
  userCity,
  router,
}: {
  events: any[];
  activeCategoriesInCity: string[];
  userCity: string;
  router: any;
}) => {
  const [openMain, setOpenMain] = useState<string | null>(null);

  return (
    <div className="mb-6">
      {/* ── ۳ کتگوری اصلی ── */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {MAIN_CATEGORIES.map((cat) => {
          const isOpen = openMain === cat.id;
          const subEvents = events.filter(e =>
            cat.subcategories.some(s => s.id === e.category)
          );
          const isActive = !userCity || cat.subcategories.some(s =>
            activeCategoriesInCity.includes(s.id)
          );

          return (
            <button
              key={cat.id}
              onClick={() => setOpenMain(isOpen ? null : cat.id)}
              className="relative rounded-2xl aspect-square flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
              style={{
                background: isOpen ? cat.bg : "#1a3a5c",
                border: isOpen ? `1.5px solid ${cat.border}` : "1px solid rgba(255,255,255,0.08)",
                boxShadow: isOpen ? `0 4px 20px ${cat.border}` : "none",
              }}
            >
              {/* تصویر */}
              <img
                src={cat.icon}
                alt={cat.title}
                className={`w-14 h-14 object-contain transition-all duration-200 ${!isActive ? "opacity-40" : ""}`}
              />

              {/* بادج تعداد */}
              {isActive && subEvents.length > 0 && (
                <span className="absolute top-1.5 right-1.5 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full z-10"
                  style={{ background: cat.color }}>
                  {subEvents.length}
                </span>
              )}

              {/* غیرفعال */}
              {!isActive && (
                <span className="absolute top-1.5 left-1.5 bg-orange-500/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">
                  🔜
                </span>
              )}

              {/* اموجی */}
              <span className="text-base mb-0.5">{cat.emoji}</span>

              <p className={`text-[10px] font-black mt-0.5 text-center px-1 leading-tight ${isOpen ? "" : "text-white"}`}
                style={isOpen ? { color: cat.color } : {}}>
                {cat.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* ── زیرکتگوری‌ها ── */}
      {openMain && (() => {
        const mainCat = MAIN_CATEGORIES.find(c => c.id === openMain)!;
        return (
          <div
            className="rounded-2xl p-4 mb-2 transition-all duration-300"
            style={{ background: mainCat.bg, border: `1px solid ${mainCat.border}` }}
          >
            <p className="text-xs font-black mb-3" style={{ color: mainCat.color }}>
              {mainCat.emoji} {mainCat.title}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {mainCat.subcategories.map(sub => {
                const subCount = events.filter(e => e.category === sub.id).length;
                const isSubActive = !userCity || activeCategoriesInCity.includes(sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => router.push(`/events/category/${sub.id}`)}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:scale-105"
                    style={{
                      background: isSubActive ? "white" : "rgba(255,255,255,0.4)",
                      boxShadow: isSubActive ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                      opacity: isSubActive ? 1 : 0.6,
                    }}
                  >
                    <span className="text-base">
                      {sub.id === "hambazi" ? "🎮" : sub.id === "musiki" ? "🎵" :
                        sub.id === "varzesh" ? "⚽" : sub.id === "cinema" ? "🎬" :
                          sub.id === "rashdFardi" ? "🌱" : sub.id === "meditation" ? "🧘" :
                            sub.id === "groupSupport" ? "🤝" : sub.id === "tarapist" ? "💬" :
                              sub.id === "naghashi" ? "🎨" : sub.id === "ketab" ? "📚" :
                                sub.id === "akasi" ? "📸" : "🎭"}
                    </span>
                    <p className="text-[9px] font-black text-slate-700 text-center leading-tight">{sub.title}</p>
                    {subCount > 0 && (
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white"
                        style={{ background: mainCat.color }}>
                        {subCount}
                      </span>
                    )}
                    {!isSubActive && (
                      <span className="text-[8px] text-slate-400">به‌زودی</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export { RaviBanner, NewCategoriesGrid, MAIN_CATEGORIES };
