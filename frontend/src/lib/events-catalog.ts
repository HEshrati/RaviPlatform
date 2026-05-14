import {
  BookOpen,
  Brain,
  Briefcase,
  Dumbbell,
  Heart,
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
  /** زیرشاخه‌ها — اختیاری. اگر وجود داشت، در UI به صورت drilldown نمایش داده می‌شود */
  subCategories?: { id: string; title: string; description?: string }[];
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
  // ✅ FIX #12: «هم زیسته» با id «dustravan» جایگزین «دوست روانشناس من» شد
  // و دو زیرشاخه «هم زیسته» و «هم روان» اضافه گردید
  {
    id: "dustravan",
    title: "دوست روانشناس من",
    icon: Heart,
    theme: "psychologist friend",
    description:
      "همراهی با یک دوست روانشناس برای حمایت همدلانه و رشد فردی. شامل دو شاخه: زیست مشترک و گفت‌وگوی روانی.",
    samples: [
      "جلسه همدلی با روانشناس",
      "گفت‌وگوی حمایتی هفتگی",
      "گروه پشتیبانی رشد فردی",
    ],
    discounts: ["۱۵٪ تخفیف جلسات هفتگی", "۲۰٪ تخفیف بسته ماهانه"],
    subCategories: [
      {
        id: "hamziste",
        title: "هم زیسته",
        description:
          "اشتراک تجربه‌های زندگی با کسی که مسیر مشابهی را طی کرده — تجربه‌محور و بدون تخصص بالینی.",
      },
      {
        id: "hamravan",
        title: "هم روان",
        description:
          "گفت‌وگوی حمایتی با همراه آشنا با اصول روانشناسی — تخصصی‌تر و با چارچوب علمی.",
      },
    ],
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
  // پشتیبانی از زیرشاخه‌ها — اگر id یک زیرشاخه باشد، پدر را برمی‌گرداند
  const direct = categories.find((item) => item.id === categoryId);
  if (direct) return direct;
  for (const cat of categories) {
    if (cat.subCategories?.some((sc) => sc.id === categoryId)) return cat;
  }
  return undefined;
}

export function getSubCategoryById(subCategoryId: string) {
  for (const cat of categories) {
    const sub = cat.subCategories?.find((sc) => sc.id === subCategoryId);
    if (sub) return { parent: cat, sub };
  }
  return undefined;
}

export function getEventById(eventId: string) {
  return popularEvents.find((item) => item.id === eventId);
}
