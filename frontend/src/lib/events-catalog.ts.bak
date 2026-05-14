import {
  BookOpen,
  Brain,
  Briefcase,
  Dumbbell,
  Home,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getTopicImage } from "@/lib/dynamic-images";

export type EventCategory = {
  id: string;
  title: string;
  icon: LucideIcon;
  theme: string;
  description: string;
  samples: string[];
  discounts: string[];
};

export const categories: EventCategory[] = [
  {
    id: "hamgharar",
    title: "هم قرار",
    icon: Users,
    theme: "meeting arrangement",
    description: "برای دورهمی‌های امن، صمیمی و آشنا شدن با افراد هم‌فرکانس.",
    samples: ["کافه‌گردی دو نفره", "بردگیم گروهی", "پیاده‌روی عصرانه"],
    discounts: ["۱۵٪ تخفیف اولین رزرو", "۲۵٪ تخفیف رزرو گروهی"],
  },
  {
    id: "hamsohbat",
    title: "هم صحبت",
    icon: Users,
    theme: "deep conversation",
    description: "برای گفت‌وگوهای عمیق درباره زندگی، تجربه‌ها و دغدغه‌ها.",
    samples: ["گفت‌وگوی موضوعی", "کتاب‌خوانی و تحلیل", "گپ عصرانه"],
    discounts: ["۱۰٪ تخفیف عصرهای سه‌شنبه", "بسته ۲ جلسه با ۲۰٪ تخفیف"],
  },
  {
    id: "hambazi",
    title: "هم بازی",
    icon: Sparkles,
    theme: "play and game",
    description: "برای بازی‌های گروهی، سرگرمی و لحظات شاد.",
    samples: ["بازی‌های فکری", "بردگیم", "فعالیت‌های تفریحی"],
    discounts: ["۲۰٪ تخفیف رزرو گروهی", "۱۵٪ تخفیف رزرو آخر هفته"],
  },
  {
    id: "hamvision",
    title: "هم ویژن",
    icon: Brain,
    theme: "vision and goals",
    description: "برای تبادل اهداف، رویاها و برنامه‌ریزی آینده.",
    samples: ["جلسه هدف‌گذاری", "تبادل تجربه", "برنامه‌ریزی استراتژیک"],
    discounts: ["۱۵٪ تخفیف بسته ماهانه", "۱۰٪ تخفیف رزرو اولیه"],
  },
  {
    id: "hamhonar",
    title: "هم هنر",
    icon: Sparkles,
    theme: "art and creativity",
    description: "برای فعالیت‌های هنری، خلاقیت و تجربه‌های زیبا‌شناختی.",
    samples: ["کارگاه هنری", "نمایش و تئاتر", "موسیقی و نقاشی"],
    discounts: ["۲۰٪ تخفیف کارگاه‌های هنری", "۱۸٪ تخفیف رزرو گروهی"],
  },
  {
    id: "hamghadam",
    title: "هم قدم",
    icon: Dumbbell,
    theme: "walking and hiking",
    description: "برای پیاده‌روی، گردش و فعالیت‌های در طبیعت.",
    samples: ["پیاده‌روی صبحگاهی", "کوهنوردی", "دوچرخه‌سواری"],
    discounts: ["۲۵٪ تخفیف رزرو صبحگاهی", "۱۵٪ تخفیف رزرو هفتگی"],
  },
  {
    id: "hamziste",
    title: "هم زیسته",
    icon: Home,
    theme: "life sharing",
    description: "برای اشتراک تجربه‌های زندگی و حمایت متقابل.",
    samples: ["جلسه تجربه‌ها", "گفت‌وگوی زندگی", "حمایت همدلانه"],
    discounts: ["۱۵٪ تخفیف جلسات هفتگی", "۲۰٪ تخفیف بسته ماهانه"],
  },
  {
    id: "hamvarzesh",
    title: "هم ورزش",
    icon: Dumbbell,
    theme: "sport partner",
    description: "برای فعالیت‌های ورزشی و سبک زندگی سالم.",
    samples: ["باشگاه دونفره", "یوگا گروهی", "ورزش‌های تیمی"],
    discounts: ["۳۰٪ تخفیف رزرو صبحگاهی", "اشتراک هفتگی با ۱۸٪ تخفیف"],
  },
  {
    id: "hamnegah",
    title: "هم نگاه",
    icon: Brain,
    theme: "perspective sharing",
    description: "برای تبادل نظر، دیدگاه‌ها و تفکر انتقادی.",
    samples: ["بحث موضوعی", "تحلیل رویدادها", "گفت‌وگوی فلسفی"],
    discounts: ["۱۵٪ تخفیف جلسات شبانه", "۲۲٪ تخفیف بسته ماهانه"],
  },
];

export const popularEvents = [
  {
    id: "boardgame",
    categoryId: "hamneshin",
    title: "دورهمی همبازی (بردگیم گروهی) - پنجشنبه ۲۳ بهمن",
    time: "پنجشنبه، ۲۳ بهمن ساعت ۱۵:۰۰",
    topic: "board game friends",
  },
  {
    id: "breakfast",
    categoryId: "hamsohbat",
    title: "قرار صبحانه (میز منتخب)",
    time: "جمعه، ۲۴ بهمن ساعت ۱۰:۰۰",
    topic: "breakfast cafe table",
  },
  {
    id: "cafe",
    categoryId: "hamfekr",
    title: "کافه گفت‌وگو، جمعه ۲۴ بهمن",
    time: "جمعه، ۲۴ بهمن ساعت ۱۰:۰۰",
    topic: "coffee conversation",
  },
  {
    id: "mafia",
    categoryId: "hamteami",
    title: "همبازی ۲۴ بهمن (مافیا)",
    time: "جمعه، ۲۴ بهمن ساعت ۱۶:۰۰",
    topic: "team game night",
  },
].map((event, idx) => ({
  ...event,
  image: getTopicImage(event.topic, idx + 11),
}));

export function getCategoryById(categoryId: string) {
  return categories.find((item) => item.id === categoryId);
}

export function getEventById(eventId: string) {
  return popularEvents.find((item) => item.id === eventId);
}
