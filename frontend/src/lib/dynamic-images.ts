/**
 * dynamic-images.ts — تصاویر SVG خودکار بر اساس موضوع
 * بدون وابستگی به CDN خارجی — ۱۰۰٪ قابل دسترس در ایران
 */

/* ── تنظیمات رنگ و آیکون برای هر کتگوری ایونت ── */
interface CategoryTheme {
  label: string;
  emoji: string;
  gradient: [string, string];
  accent: string;
  pattern: string; // SVG pattern element
}

const EVENT_THEMES: Record<string, CategoryTheme> = {
  hambazi: {
    label: "هم‌بازی",
    emoji: "🎲",
    gradient: ["#10B981", "#059669"],
    accent: "#D1FAE5",
    pattern: `<circle cx="60" cy="40" r="18" fill="white" opacity="0.08"/><circle cx="180" cy="70" r="25" fill="white" opacity="0.06"/><rect x="250" y="20" width="30" height="30" rx="6" fill="white" opacity="0.05" transform="rotate(15 265 35)"/><circle cx="350" cy="55" r="12" fill="white" opacity="0.07"/>`,
  },
  hamneshin: {
    label: "همنشین",
    emoji: "☕",
    gradient: ["#FF6B00", "#E05500"],
    accent: "#FFF3E0",
    pattern: `<circle cx="70" cy="35" r="22" fill="white" opacity="0.08"/><circle cx="200" cy="60" r="30" fill="white" opacity="0.05"/><circle cx="320" cy="30" r="15" fill="white" opacity="0.07"/>`,
  },
  hamgharar: {
    label: "هم‌قرار",
    emoji: "🍳",
    gradient: ["#F59E0B", "#D97706"],
    accent: "#FEF3C7",
    pattern: `<circle cx="80" cy="40" r="20" fill="white" opacity="0.07"/><circle cx="220" cy="55" r="28" fill="white" opacity="0.05"/><rect x="330" y="25" width="25" height="25" rx="12" fill="white" opacity="0.06"/>`,
  },
  hamsohbat: {
    label: "هم‌صحبت",
    emoji: "💬",
    gradient: ["#3B82F6", "#2563EB"],
    accent: "#DBEAFE",
    pattern: `<circle cx="65" cy="38" r="20" fill="white" opacity="0.07"/><circle cx="190" cy="65" r="26" fill="white" opacity="0.05"/><circle cx="310" cy="28" r="14" fill="white" opacity="0.08"/>`,
  },
  hampa: {
    label: "هم‌پا",
    emoji: "🥾",
    gradient: ["#8B5CF6", "#7C3AED"],
    accent: "#EDE9FE",
    pattern: `<circle cx="90" cy="45" r="24" fill="white" opacity="0.06"/><path d="M200 20 Q220 60 240 25" stroke="white" stroke-width="3" fill="none" opacity="0.08"/><circle cx="330" cy="50" r="16" fill="white" opacity="0.07"/>`,
  },
  hamghadam: {
    label: "هم‌قدم",
    emoji: "🌿",
    gradient: ["#16A34A", "#15803D"],
    accent: "#DCFCE7",
    pattern: `<circle cx="75" cy="35" r="20" fill="white" opacity="0.07"/><path d="M180 15 Q200 55 220 20" stroke="white" stroke-width="2.5" fill="none" opacity="0.07"/><circle cx="300" cy="50" r="18" fill="white" opacity="0.06"/>`,
  },
  hamamooz: {
    label: "هم‌آموز",
    emoji: "📚",
    gradient: ["#F59E0B", "#B45309"],
    accent: "#FEF3C7",
    pattern: `<rect x="50" y="25" width="35" height="25" rx="3" fill="white" opacity="0.06"/><rect x="190" y="35" width="30" height="22" rx="3" fill="white" opacity="0.05"/><circle cx="320" cy="40" r="16" fill="white" opacity="0.07"/>`,
  },
  hamkar: {
    label: "همکار",
    emoji: "🤝",
    gradient: ["#EF4444", "#DC2626"],
    accent: "#FEE2E2",
    pattern: `<circle cx="70" cy="40" r="22" fill="white" opacity="0.06"/><circle cx="200" cy="55" r="18" fill="white" opacity="0.07"/><rect x="300" y="20" width="28" height="28" rx="14" fill="white" opacity="0.05"/>`,
  },
  hamfekr: {
    label: "هم‌فکر",
    emoji: "💡",
    gradient: ["#EC4899", "#DB2777"],
    accent: "#FCE7F3",
    pattern: `<circle cx="80" cy="35" r="20" fill="white" opacity="0.07"/><circle cx="210" cy="60" r="24" fill="white" opacity="0.05"/><circle cx="340" cy="30" r="12" fill="white" opacity="0.08"/>`,
  },
  hamteymi: {
    label: "هم‌تیمی",
    emoji: "⚽",
    gradient: ["#14B8A6", "#0D9488"],
    accent: "#CCFBF1",
    pattern: `<circle cx="65" cy="42" r="18" fill="white" opacity="0.07"/><circle cx="190" cy="30" r="22" fill="white" opacity="0.05"/><circle cx="310" cy="55" r="15" fill="white" opacity="0.06"/>`,
  },
  hamghesse: {
    label: "هم‌قصه",
    emoji: "📖",
    gradient: ["#A78BFA", "#8B5CF6"],
    accent: "#EDE9FE",
    pattern: `<rect x="55" y="22" width="28" height="35" rx="4" fill="white" opacity="0.06"/><circle cx="200" cy="50" r="20" fill="white" opacity="0.05"/><rect x="310" y="30" width="22" height="28" rx="3" fill="white" opacity="0.06"/>`,
  },
  hamvision: {
    label: "هم‌چشم‌انداز",
    emoji: "🔭",
    gradient: ["#6366F1", "#4F46E5"],
    accent: "#E0E7FF",
    pattern: `<circle cx="80" cy="38" r="22" fill="white" opacity="0.06"/><circle cx="220" cy="55" r="16" fill="white" opacity="0.07"/><circle cx="330" cy="25" r="20" fill="white" opacity="0.05"/>`,
  },
  hamhonar: {
    label: "هم‌هنر",
    emoji: "🎨",
    gradient: ["#F472B6", "#EC4899"],
    accent: "#FCE7F3",
    pattern: `<circle cx="60" cy="45" r="20" fill="white" opacity="0.07"/><circle cx="180" cy="25" r="15" fill="white" opacity="0.06"/><rect x="280" y="30" width="30" height="30" rx="15" fill="white" opacity="0.05"/>`,
  },
  hamvarzesh: {
    label: "هم‌ورزش",
    emoji: "🏃",
    gradient: ["#0EA5E9", "#0284C7"],
    accent: "#E0F2FE",
    pattern: `<circle cx="70" cy="40" r="18" fill="white" opacity="0.07"/><path d="M170 20 L200 50 L230 25" stroke="white" stroke-width="3" fill="none" opacity="0.07"/><circle cx="320" cy="45" r="14" fill="white" opacity="0.06"/>`,
  },
  hamnegah: {
    label: "هم‌نگاه",
    emoji: "👁",
    gradient: ["#8B5CF6", "#6D28D9"],
    accent: "#EDE9FE",
    pattern: `<circle cx="75" cy="38" r="22" fill="white" opacity="0.06"/><circle cx="200" cy="55" r="18" fill="white" opacity="0.07"/><circle cx="310" cy="30" r="14" fill="white" opacity="0.05"/>`,
  },
  hamziste: {
    label: "هم‌زیسته",
    emoji: "🌱",
    gradient: ["#22C55E", "#16A34A"],
    accent: "#DCFCE7",
    pattern: `<circle cx="80" cy="35" r="24" fill="white" opacity="0.06"/><path d="M190 20 C200 50 220 50 230 20" stroke="white" stroke-width="2" fill="none" opacity="0.07"/><circle cx="320" cy="50" r="16" fill="white" opacity="0.06"/>`,
  },
  hamravan: {
    label: "هم‌روان",
    emoji: "🧠",
    gradient: ["#7C3AED", "#6D28D9"],
    accent: "#EDE9FE",
    pattern: `<circle cx="70" cy="40" r="22" fill="white" opacity="0.06"/><circle cx="200" cy="30" r="16" fill="white" opacity="0.07"/><circle cx="300" cy="55" r="20" fill="white" opacity="0.05"/><path d="M340 20 Q360 45 340 65" stroke="white" stroke-width="2" fill="none" opacity="0.06"/>`,
  },
  dustravan: {
    label: "دوست روانشناس",
    emoji: "🩺",
    gradient: ["#0891B2", "#0E7490"],
    accent: "#CFFAFE",
    pattern: `<circle cx="65" cy="38" r="20" fill="white" opacity="0.07"/><circle cx="190" cy="55" r="24" fill="white" opacity="0.05"/><rect x="300" y="25" width="26" height="26" rx="13" fill="white" opacity="0.06"/>`,
  },
  default: {
    label: "رویداد راوی",
    emoji: "✨",
    gradient: ["#FF6B00", "#FF9A3C"],
    accent: "#FFF3E0",
    pattern: `<circle cx="70" cy="35" r="20" fill="white" opacity="0.07"/><circle cx="200" cy="55" r="25" fill="white" opacity="0.05"/><circle cx="320" cy="30" r="15" fill="white" opacity="0.06"/>`,
  },
};

/* ── تنظیمات رنگ و آیکون برای مقالات ── */
const ARTICLE_THEMES: Record<string, CategoryTheme> = {
  attachment: {
    label: "دلبستگی",
    emoji: "❤️",
    gradient: ["#EF4444", "#DC2626"],
    accent: "#FEE2E2",
    pattern: `<circle cx="70" cy="40" r="20" fill="white" opacity="0.06"/><circle cx="200" cy="55" r="22" fill="white" opacity="0.05"/>`,
  },
  communication: {
    label: "ارتباط مؤثر",
    emoji: "🗣",
    gradient: ["#3B82F6", "#2563EB"],
    accent: "#DBEAFE",
    pattern: `<circle cx="80" cy="35" r="22" fill="white" opacity="0.06"/><circle cx="210" cy="55" r="18" fill="white" opacity="0.07"/>`,
  },
  emotion: {
    label: "هوش هیجانی",
    emoji: "🧡",
    gradient: ["#F59E0B", "#D97706"],
    accent: "#FEF3C7",
    pattern: `<circle cx="65" cy="40" r="18" fill="white" opacity="0.07"/><circle cx="200" cy="50" r="24" fill="white" opacity="0.05"/>`,
  },
  social: {
    label: "مهارت اجتماعی",
    emoji: "👥",
    gradient: ["#10B981", "#059669"],
    accent: "#D1FAE5",
    pattern: `<circle cx="75" cy="38" r="20" fill="white" opacity="0.06"/><circle cx="220" cy="50" r="20" fill="white" opacity="0.05"/>`,
  },
  psychology: {
    label: "روانشناسی",
    emoji: "🧠",
    gradient: ["#8B5CF6", "#7C3AED"],
    accent: "#EDE9FE",
    pattern: `<circle cx="80" cy="40" r="22" fill="white" opacity="0.06"/><circle cx="200" cy="55" r="16" fill="white" opacity="0.07"/>`,
  },
  relationship: {
    label: "روابط",
    emoji: "💕",
    gradient: ["#EC4899", "#DB2777"],
    accent: "#FCE7F3",
    pattern: `<circle cx="70" cy="35" r="20" fill="white" opacity="0.07"/><circle cx="210" cy="55" r="22" fill="white" opacity="0.05"/>`,
  },
  default: {
    label: "مقاله راوی",
    emoji: "📝",
    gradient: ["#FF6B00", "#FF9A3C"],
    accent: "#FFF3E0",
    pattern: `<circle cx="75" cy="40" r="20" fill="white" opacity="0.06"/><circle cx="200" cy="50" r="22" fill="white" opacity="0.05"/>`,
  },
};

/* ── ساخت SVG تصویر خودکار ── */
function buildThemedSVG(
  theme: CategoryTheme,
  w = 400,
  h = 220,
  uniqueId = "img"
): string {
  const [c1, c2] = theme.gradient;
  const safeId = uniqueId.replace(/[^a-z0-9]/gi, "x").slice(0, 12);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
  <linearGradient id="g-${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${c1}"/>
    <stop offset="100%" stop-color="${c2}"/>
  </linearGradient>
  <radialGradient id="gl-${safeId}" cx="30%" cy="30%" r="60%">
    <stop offset="0%" stop-color="white" stop-opacity="0.12"/>
    <stop offset="100%" stop-color="white" stop-opacity="0"/>
  </radialGradient>
</defs>
<rect width="${w}" height="${h}" rx="16" fill="url(#g-${safeId})"/>
<rect width="${w}" height="${h}" rx="16" fill="url(#gl-${safeId})"/>
${theme.pattern}
<text x="${w / 2}" y="${h / 2 - 15}" text-anchor="middle" font-size="48">${theme.emoji}</text>
<text x="${w / 2}" y="${h / 2 + 28}" text-anchor="middle" font-family="Tahoma,sans-serif" font-weight="900" font-size="18" fill="white" opacity="0.95" direction="rtl">${theme.label}</text>
<text x="${w / 2}" y="${h / 2 + 50}" text-anchor="middle" font-family="Tahoma,sans-serif" font-size="11" fill="white" opacity="0.55">راوی</text>
</svg>`;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* ── مسیر فایل‌های واقعی ── */
const EVENT_REAL: Record<string, string> = {
  hambazi:    "/images/events/hambazi.jpg",
  hamneshin:  "/images/events/hamneshin.jpg",
  hamgharar:  "/images/events/hamgharar.jpg",
  hamsohbat:  "/images/events/hamsohbat.jpg",
  hampa:      "/images/events/hampa.jpg",
  hamghadam:  "/images/events/hamghadam.jpg",
  hamamooz:   "/images/events/hamamooz.jpg",
  hamkar:     "/images/events/hamkar.jpg",
  hamfekr:    "/images/events/hamfekr.jpg",
  hamteymi:   "/images/events/hamteymi.jpg",
  hamghesse:  "/images/events/hamghesse.jpg",
  hamvision:  "/images/events/hamvision.jpg",
  hamhonar:   "/images/events/hamhonar.jpg",
  hamvarzesh: "/images/events/hamvarzesh.jpg",
  hamnegah:   "/images/events/hamnegah.jpg",
  hamziste:   "/images/events/hamziste.jpg",
  hamravan:   "/images/events/hamravan.jpg",
  dustravan:  "/images/events/dustravan.jpg",
  default:    "/images/events/default.jpg",
};

const ARTICLE_REAL: Record<string, string> = {
  attachment:    "/images/articles/attachment.jpg",
  communication: "/images/articles/communication.jpg",
  emotion:       "/images/articles/emotion.jpg",
  social:        "/images/articles/social.jpg",
  psychology:    "/images/articles/psychology.jpg",
  relationship:  "/images/articles/relationship.jpg",
  default:       "/images/articles/default.jpg",
};

/* ── API اصلی — عکس واقعی اول، SVG به عنوان fallback ── */

export function getEventImage(
  category?: string,
  _eventId?: string,
  _fallback?: string
): string {
  const cat = (category || "default").toLowerCase();
  return EVENT_REAL[cat] || EVENT_REAL.default;
}

export function getEventImageFallback(category?: string): string {
  const cat = (category || "default").toLowerCase();
  const theme = EVENT_THEMES[cat] || EVENT_THEMES.default;
  return buildThemedSVG(theme, 400, 220, `ev-${cat}`);
}

const TOPIC_MAPPING: [string[], string][] = [
  [["game", "board", "بازی"], "hambazi"],
  [["coffee", "cafe", "کافه", "نشین"], "hamneshin"],
  [["breakfast", "food", "صبحانه", "غذا"], "hamgharar"],
  [["walk", "hike", "nature", "پیاده", "طبیعت"], "hamghadam"],
  [["art", "music", "هنر", "نقاشی"], "hamhonar"],
  [["study", "learn", "یادگیری", "آموز"], "hamamooz"],
  [["sport", "ورزش"], "hamvarzesh"],
  [["team", "تیم"], "hamteymi"],
  [["conversation", "گفت", "صحبت"], "hamsohbat"],
  [["story", "book", "قصه", "کتاب"], "hamghesse"],
  [["idea", "فکر", "ایده"], "hamfekr"],
  [["therapy", "روان", "مشاور"], "hamravan"],
  [["coexist", "زیست"], "hamziste"],
  [["friend", "دوست", "روانشناس"], "dustravan"],
];

export function getTopicImage(
  topic: string,
  _seed = 1,
  _w = 800,
  _h = 400
): string {
  const t = topic.toLowerCase();
  for (const [keywords, cat] of TOPIC_MAPPING) {
    if (keywords.some((k) => t.includes(k))) {
      return EVENT_REAL[cat] || EVENT_REAL.default;
    }
  }
  return EVENT_REAL.default;
}

export function getArticleImage(category: string): string {
  const cat = category.toLowerCase();
  return ARTICLE_REAL[cat] || ARTICLE_REAL.default;
}

export function getCategoryIcon(categoryId: string, _size = 200): string {
  return EVENT_REAL[categoryId] || EVENT_REAL.default;
}

export function getInitialsAvatar(seed: string, _size = 128): string {
  const initial = (seed?.[0] || "ر").toUpperCase();
  let hash = 0;
  for (let i = 0; i < (seed || "x").length; i++) {
    hash = (hash << 5) - hash + (seed || "x").charCodeAt(i);
    hash |= 0;
  }
  const palette: [string, string][] = [
    ["#FF6B00", "#FF9A3C"],
    ["#7C3AED", "#A78BFA"],
    ["#0EA5E9", "#7DD3FC"],
    ["#16A34A", "#86EFAC"],
    ["#DB2777", "#F472B6"],
    ["#F59E0B", "#FCD34D"],
  ];
  const size = _size;
  const [c1, c2] = palette[Math.abs(hash) % palette.length];
  const safeId = seed?.replace(/[^a-z0-9]/gi, "x").slice(0, 8) || "av";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs><linearGradient id="a-${safeId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="url(#a-${safeId})"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Tahoma,sans-serif" font-weight="900" font-size="${size * 0.5}" fill="white">${initial}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
