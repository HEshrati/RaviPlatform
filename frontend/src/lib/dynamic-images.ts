/**
 * dynamic-images.ts — تصاویر لوکال بر اساس کتگوری
 * تصاویر در /public/images/events/ و /public/images/articles/ ذخیره شدن
 */

const EVENT_IMAGES: Record<string, string> = {
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

const ARTICLE_IMAGES: Record<string, string> = {
  attachment:    "/images/articles/attachment.jpg",
  communication: "/images/articles/communication.jpg",
  emotion:       "/images/articles/emotion.jpg",
  social:        "/images/articles/social.jpg",
  psychology:    "/images/articles/psychology.jpg",
  relationship:  "/images/articles/relationship.jpg",
  default:       "/images/articles/default.jpg",
};

export function getEventImage(category?: string, _eventId?: string, _fallback?: string): string {
  const cat = (category || "default").toLowerCase();
  return EVENT_IMAGES[cat] || EVENT_IMAGES.default;
}

export function getEventImageFallback(category?: string): string {
  return getEventImage(category);
}

export function getTopicImage(topic: string, _seed = 1, _w = 800, _h = 400): string {
  const t = topic.toLowerCase();
  if (t.includes("game") || t.includes("board") || t.includes("بازی")) return EVENT_IMAGES.hambazi;
  if (t.includes("coffee") || t.includes("cafe") || t.includes("کافه")) return EVENT_IMAGES.hamsohbat;
  if (t.includes("breakfast") || t.includes("food") || t.includes("صبحانه")) return EVENT_IMAGES.hamgharar;
  if (t.includes("walk") || t.includes("hike") || t.includes("nature") || t.includes("پیاده")) return EVENT_IMAGES.hamghadam;
  if (t.includes("art") || t.includes("music") || t.includes("هنر")) return EVENT_IMAGES.hamhonar;
  if (t.includes("study") || t.includes("learn") || t.includes("یادگیری")) return EVENT_IMAGES.hamamooz;
  if (t.includes("sport") || t.includes("ورزش")) return EVENT_IMAGES.hamvarzesh;
  if (t.includes("team") || t.includes("تیم")) return EVENT_IMAGES.hamteymi;
  if (t.includes("conversation") || t.includes("گفت")) return EVENT_IMAGES.hamsohbat;
  return EVENT_IMAGES.default;
}

export function getArticleImage(category: string): string {
  return ARTICLE_IMAGES[category] || ARTICLE_IMAGES.default;
}

export function getCategoryIcon(categoryId: string, _size = 200): string {
  return EVENT_IMAGES[categoryId] || EVENT_IMAGES.default;
}

export function getInitialsAvatar(seed: string, _size = 128): string {
  // آواتار با حروف اول — همچنان SVG
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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs><linearGradient id="a-${safeId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#a-${safeId})"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Tahoma,sans-serif" font-weight="900" font-size="${size*0.5}" fill="white">${initial}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
