import { NextResponse } from "next/server";

export const revalidate = 86400;

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  url: string;
  publishedAt: string;
}

const ARTICLES_POOL: Article[] = [
  { id: "1",  title: "چگونه استرس روزانه را مدیریت کنیم؟",       summary: "تکنیک‌های علمی و کاربردی برای کاهش استرس و افزایش آرامش در زندگی روزمره. از تنفس عمیق تا مدیریت زمان، همه چیز را بیاموزید.",   category: "مدیریت استرس",    readTime: "۵ دقیقه", url: "/articles/stress-management",      publishedAt: "۱۴۰۴/۲/۱"  },
  { id: "2",  title: "هوش هیجانی و تأثیر آن بر روابط",           summary: "نقش هوش هیجانی در بهبود کیفیت ارتباطات و ایجاد روابط عمیق‌تر. چگونه احساسات خود و دیگران را بهتر بشناسیم؟",                   category: "هوش هیجانی",      readTime: "۷ دقیقه", url: "/articles/emotional-intelligence", publishedAt: "۱۴۰۴/۲/۲"  },
  { id: "3",  title: "راهکارهای افزایش اعتماد به نفس",           summary: "گام‌های عملی برای تقویت اعتماد به نفس و ساخت تصویر ذهنی مثبت از خود. از تغییر الگوهای فکری تا اقدام عملی.",                    category: "رشد فردی",        readTime: "۶ دقیقه", url: "/articles/self-confidence",        publishedAt: "۱۴۰۴/۲/۳"  },
  { id: "4",  title: "ذهن‌آگاهی: کلید آرامش در دنیای پرشتاب",   summary: "مدیتیشن و تکنیک‌های ذهن‌آگاهی برای کاهش اضطراب و بهبود تمرکز. چگونه در لحظه حال زندگی کنیم؟",                               category: "ذهن‌آگاهی",      readTime: "۸ دقیقه", url: "/articles/mindfulness",            publishedAt: "۱۴۰۴/۲/۴"  },
  { id: "5",  title: "چگونه روابط سالم‌تری بسازیم؟",             summary: "اصول ارتباط مؤثر و راهکارهای ایجاد پیوندهای عمیق و معنادار. مرزهای سالم، ارتباط صادقانه و احترام متقابل.",                     category: "روابط سالم",      readTime: "۶ دقیقه", url: "/articles/healthy-relationships",  publishedAt: "۱۴۰۴/۲/۵"  },
  { id: "6",  title: "قدرت روانشناسی مثبت در زندگی روزمره",      summary: "چگونه تمرکز بر نقاط قوت و احساسات مثبت می‌تواند کیفیت زندگی را متحول کند. علم پشت خوش‌بینی و شادی.",                         category: "روانشناسی مثبت", readTime: "۵ دقیقه", url: "/articles/positive-psychology",    publishedAt: "۱۴۰۴/۲/۶"  },
  { id: "7",  title: "خودشناسی: سفری به درون",                    summary: "ابزارها و روش‌های شناخت بهتر خود، ارزش‌ها، باورها و الگوهای رفتاری. آیا واقعاً خودت را می‌شناسی؟",                              category: "خودشناسی",        readTime: "۹ دقیقه", url: "/articles/self-awareness",         publishedAt: "۱۴۰۴/۲/۷"  },
  { id: "8",  title: "بهداشت روان در عصر دیجیتال",                summary: "تأثیر شبکه‌های اجتماعی بر سلامت روان و راهکارهای حفظ تعادل در دنیای آنلاین. فاصله‌گیری سالم از فضای مجازی.",               category: "بهداشت روان",     readTime: "۷ دقیقه", url: "/articles/digital-mental-health",  publishedAt: "۱۴۰۴/۲/۸"  },
  { id: "9",  title: "مرزگذاری سالم در روابط",                    summary: "چرا مرزها مهم هستند و چگونه بدون احساس گناه مرزهای سالم تعیین کنیم. احترام به خود از طریق نه گفتن.",                            category: "روابط سالم",      readTime: "۶ دقیقه", url: "/articles/healthy-boundaries",     publishedAt: "۱۴۰۴/۲/۹"  },
  { id: "10", title: "اضطراب و راه‌های غلبه بر آن",               summary: "درک ریشه‌های اضطراب و تکنیک‌های CBT برای مدیریت نگرانی‌های روزانه. وقتی ذهن نمی‌تواند آرام بگیرد.",                           category: "بهداشت روان",     readTime: "۸ دقیقه", url: "/articles/anxiety-management",     publishedAt: "۱۴۰۴/۲/۱۰" },
  { id: "11", title: "عادت‌های افراد موفق و شاد",                 summary: "الگوهای رفتاری مشترک در افراد شاد و موفق. از روتین صبحگاهی تا نحوه تعامل با شکست‌ها.",                                         category: "رشد فردی",        readTime: "۷ دقیقه", url: "/articles/habits-of-happy-people", publishedAt: "۱۴۰۴/۲/۱۱" },
  { id: "12", title: "هنر گوش دادن فعال",                         summary: "مهارتی که روابط را متحول می‌کند. چگونه واقعاً بشنویم، نه فقط منتظر صحبت کردن باشیم. تمرین‌های عملی.",                         category: "روابط سالم",      readTime: "۵ دقیقه", url: "/articles/active-listening",       publishedAt: "۱۴۰۴/۲/۱۲" },
  { id: "13", title: "رشد پس از شکست: هنر رزیلیانس",             summary: "چگونه از شکست‌ها یاد بگیریم و قوی‌تر بازگردیم. علم رزیلیانس و روش‌های تقویت آن.",                                             category: "رشد فردی",        readTime: "۶ دقیقه", url: "/articles/resilience",             publishedAt: "۱۴۰۴/۲/۱۳" },
  { id: "14", title: "ارتباط مؤثر در دنیای مدرن",                 summary: "مهارت‌های ارتباطی در عصر دیجیتال. چگونه در دنیای پر از نوتیفیکیشن، واقعاً ارتباط برقرار کنیم؟",                                category: "روابط سالم",      readTime: "۷ دقیقه", url: "/articles/effective-communication",publishedAt: "۱۴۰۴/۲/۱۴" },
  { id: "15", title: "ترس از تنها ماندن و راهکارهای آن",          summary: "اتوفوبیا یا ترس از تنهایی چیست و چگونه می‌توان با آن کنار آمد. تمایز بین تنهایی و انزوا.",                                    category: "بهداشت روان",     readTime: "۸ دقیقه", url: "/articles/fear-of-loneliness",     publishedAt: "۱۴۰۴/۲/۱۵" },
  { id: "16", title: "خودمراقبتی: اولویت دادن به خود",            summary: "چرا خودمراقبتی خودخواهی نیست. روش‌های عملی برای حفظ سلامت روحی و جسمی در دنیای پرمشغله.",                                    category: "بهداشت روان",     readTime: "۵ دقیقه", url: "/articles/self-care",              publishedAt: "۱۴۰۴/۲/۱۶" },
  { id: "17", title: "شکرگزاری و تأثیر آن بر مغز",               summary: "علم پشت شکرگزاری. چگونه تمرین روزانه قدردانی می‌تواند ساختار مغز و کیفیت زندگی را تغییر دهد.",                                 category: "روانشناسی مثبت", readTime: "۶ دقیقه", url: "/articles/gratitude",              publishedAt: "۱۴۰۴/۲/۱۷" },
  { id: "18", title: "قدرت گفت‌وگوی درونی مثبت",                  summary: "صدایی که درون سرمان است بیشترین تأثیر را بر زندگی ما دارد. چگونه منتقد درونی را به حامی تبدیل کنیم.",                          category: "خودشناسی",        readTime: "۷ دقیقه", url: "/articles/positive-self-talk",     publishedAt: "۱۴۰۴/۲/۱۸" },
  { id: "19", title: "مدیریت خشم: بیان، نه سرکوب",               summary: "خشم یک احساس طبیعی است. تفاوت بین ابراز سالم خشم و رفتار پرخاشگرانه. تکنیک‌های مدیریت خشم.",                                  category: "هوش هیجانی",      readTime: "۶ دقیقه", url: "/articles/anger-management",       publishedAt: "۱۴۰۴/۲/۱۹" },
  { id: "20", title: "اهمال‌کاری: دشمن پنهان موفقیت",            summary: "ریشه‌های روانشناختی اهمال‌کاری و راه‌های عملی برای غلبه بر آن. چرا می‌دانیم باید انجام دهیم اما نمی‌دهیم؟",                 category: "رشد فردی",        readTime: "۸ دقیقه", url: "/articles/procrastination",        publishedAt: "۱۴۰۴/۲/۲۰" },
];

function getDailyArticles(): Article[] {
  const now = new Date();
  const dayIndex = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const seed = dayIndex % ARTICLES_POOL.length;
  const step = Math.floor(ARTICLES_POOL.length / 3);
  return [
    ARTICLES_POOL[seed % ARTICLES_POOL.length],
    ARTICLES_POOL[(seed + step) % ARTICLES_POOL.length],
    ARTICLES_POOL[(seed + step * 2) % ARTICLES_POOL.length],
  ];
}

export async function GET() {
  const allArticles = [...ARTICLES_POOL].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return NextResponse.json(allArticles, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      "X-Daily-Featured": getDailyArticles().map((a) => a.id).join(","),
    },
  });
}

export async function POST() {
  return NextResponse.json(getDailyArticles());
}
