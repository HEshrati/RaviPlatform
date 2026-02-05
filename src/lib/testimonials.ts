// src/lib/testimonials.ts
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  initials: string;
  message: string;
  rating: number;
  highlight?: boolean;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "سارا م.",
    role: "کاربر راوی",
    initials: "SM",
    message:
      "تجربه‌ای که زندگیم رو تغییر داد. تحلیل‌های هوش مصنوعی واقعاً شگفت‌انگیز بود.",
    rating: 5,
    highlight: true,
  },
  {
    id: 2,
    name: "حسین الف.",
    role: "کاربر راوی",
    initials: "HA",
    message:
      "از وقتی تو راوی عضو شدم، حس می‌کنم شناخت عمیق‌تری از خودم و دیگران پیدا کردم.",
    rating: 5,
  },
  {
    id: 3,
    name: "نرگس ش.",
    role: "کاربر راوی",
    initials: "NS",
    message:
      "روند ثبت‌نام و انجام تست‌ها خیلی ساده و لذت‌بخشه. پیشنهادش می‌کنم.",
    rating: 4,
  },
  {
    id: 4,
    name: "محمد ک.",
    role: "کاربر راوی",
    initials: "MK",
    message:
      "تطابق‌هایی که پیشنهاد شد واقعاً با معیارهای من هم‌خوان بود. از تیم راوی ممنونم.",
    rating: 5,
  },
  {
    id: 5,
    name: "الهام ر.",
    role: "روان‌شناس",
    initials: "ER",
    message:
      "ترکیب داده‌های روان‌شناختی با هوش مصنوعی حرکت هوشمندانه‌ایه که خیلی کمک می‌کنه.",
    rating: 5,
  },
  {
    id: 6,
    name: "مهسا ی.",
    role: "کاربر راوی",
    initials: "MY",
    message:
      "هر هفته نکات جدیدی برای بهبود روابط شخصی‌ام یاد می‌گیرم. تجربه‌ی فوق‌العاده‌ایه.",
    rating: 4,
  },
  {
    id: 7,
    name: "شقایق د.",
    role: "کاربر راوی",
    initials: "SD",
    message:
      "مطمئن بودم که هیچ پلتفرمی نمی‌تونه مناسب من باشه، اما راوی نظرم رو عوض کرد.",
    rating: 5,
  },
  {
    id: 8,
    name: "علی پ.",
    role: "کاربر راوی",
    initials: "AP",
    message:
      "پشتیبانی سریع و حرفه‌ایه. هر سوالی داشتم، به سرعت از طریق اپلیکیشن پاسخ دادن.",
    rating: 5,
  },
  {
    id: 9,
    name: "فاطمه ق.",
    role: "کاربر راوی",
    initials: "FQ",
    message:
      "از زمانی که عضو شدم، با افراد متفاوتی آشنا شدم که واقعاً به روحیه‌ام نزدیک بودن.",
    rating: 4,
  },
  {
    id: 10,
    name: "رضا ل.",
    role: "کاربر راوی",
    initials: "RL",
    message:
      "به نظرم راوی تونسته فرآیند پیدا کردن شریک زندگی رو از حالت تصادفی به علمی تبدیل کنه.",
    rating: 5,
  },
];

export const testimonials = testimonialsData;
export default testimonialsData;
