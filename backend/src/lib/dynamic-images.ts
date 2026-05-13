/**
 * تصاویر داینامیک برای رویدادها بر اساس دسته‌بندی و موضوع
 * از Unsplash استفاده می‌شود (مشابه صفحه اصلی)
 */

const EVENT_CATEGORY_IMAGES: Record<string, string[]> = {
  hambazi: [
    '/images/raavi-placeholder-2.svg',
    '/images/raavi-placeholder-6.svg',
    '/images/raavi-placeholder-6.svg',
    '/images/raavi-placeholder-4.svg',
  ],
  hamneshin: [
    '/images/raavi-placeholder-6.svg',
    '/images/raavi-placeholder-2.svg',
    '/images/raavi-placeholder-1.svg',
    '/images/raavi-placeholder-5.svg',
  ],
  hamsohbat: [
    '/images/raavi-placeholder-5.svg',
    '/images/raavi-placeholder-4.svg',
    '/images/raavi-placeholder-1.svg',
    '/images/raavi-placeholder-3.svg',
  ],
  hampa: [
    '/images/raavi-placeholder-6.svg',
    '/images/raavi-placeholder-2.svg',
    '/images/raavi-placeholder-2.svg',
    '/images/raavi-placeholder-6.svg',
  ],
  hamamooz: [
    '/images/raavi-placeholder-2.svg',
    '/images/raavi-placeholder-3.svg',
    '/images/raavi-placeholder-2.svg',
    '/images/raavi-placeholder-4.svg',
  ],
  hamkar: [
    '/images/raavi-placeholder-1.svg',
    '/images/raavi-placeholder-3.svg',
    '/images/raavi-placeholder-6.svg',
    '/images/raavi-placeholder-4.svg',
  ],
  hamfekr: [
    '/images/raavi-placeholder-2.svg',
    '/images/raavi-placeholder-2.svg',
    '/images/raavi-placeholder-3.svg',
    '/images/raavi-placeholder-4.svg',
  ],
  hamteymi: [
    '/images/raavi-placeholder-5.svg',
    '/images/raavi-placeholder-6.svg',
    '/images/raavi-placeholder-3.svg',
    '/images/raavi-placeholder-1.svg',
  ],
  hamghesse: [
    '/images/raavi-placeholder-3.svg',
    '/images/raavi-placeholder-3.svg',
    '/images/raavi-placeholder-6.svg',
    '/images/raavi-placeholder-3.svg',
  ],
  default: [
    '/images/raavi-placeholder-4.svg',
    '/images/raavi-placeholder-4.svg',
    '/images/raavi-placeholder-3.svg',
    '/images/raavi-placeholder-1.svg',
  ],
};

/**
 * دریافت تصویر داینامیک برای رویداد بر اساس دسته‌بندی و ID
 * از seed برای ثبات تصویر در هر بار لود استفاده می‌شود
 */
export function getEventImage(
  category?: string,
  eventId?: string,
  fallback?: string,
): string {
  if (fallback && !fallback.includes('/categories/')) return fallback;

  const cat = category?.toLowerCase() || 'default';
  const images = EVENT_CATEGORY_IMAGES[cat] || EVENT_CATEGORY_IMAGES['default'];

  // تولید index ثابت بر اساس eventId
  let seed = 0;
  if (eventId) {
    for (let i = 0; i < eventId.length; i++) {
      seed = (seed + eventId.charCodeAt(i)) % images.length;
    }
  } else {
    seed = Math.floor(Math.random() * images.length);
  }

  return images[seed % images.length];
}

/**
 * تصویر موضوع‌محور برای کارت‌ها
 */
export function getTopicImage(topic: string, seed = 1, width = 1200, height = 800): string {
  const query = encodeURIComponent(topic);
  return `/images/raavi-placeholder-${(Number(seed) % 6) + 1}.svg`;
}

/**
 * تصویر fallback برای خطا در لود تصویر
 */
export function getEventImageFallback(category?: string): string {
  return getEventImage(category, 'fallback');
}
