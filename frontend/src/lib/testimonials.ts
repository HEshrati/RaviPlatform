export interface Testimonial {
  id: string;
  name: string;
  role: string;
  initials: string;
  message: string;
  rating: number;
  avatar?: string;
  content?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "علی محمدی",
    role: "کاربر پلتفرم",
    initials: "ع.م",
    message: "تجربه عالی و کاربرپسندی بالا. واقعا از این پلتفرم راضی هستم.",
    content: "تجربه عالی و کاربرپسندی بالا",
    rating: 5,
  },
  {
    id: "2",
    name: "سارا احمدی",
    role: "کاربر پلتفرم",
    initials: "س.ا",
    message: "خدمات بسیار خوب و پشتیبانی عالی. تیم پشتیبانی فوق‌العاده هستند.",
    content: "خدمات بسیار خوب و پشتیبانی عالی",
    rating: 5,
  },
  {
    id: "3",
    name: "رضا کریمی",
    role: "کاربر پلتفرم",
    initials: "ر.ک",
    message:
      "راضی از استفاده از این پلتفرم هستم. توصیه می‌کنم حتما امتحان کنید.",
    content: "راضی از استفاده از این پلتفرم هستم",
    rating: 4,
  },
  {
    id: "4",
    name: "مریم حسینی",
    role: "کاربر پلتفرم",
    initials: "م.ح",
    message: "پلتفرم بسیار کاربرپسند و رابط کاربری زیبایی دارد.",
    content: "پلتفرم بسیار کاربرپسند",
    rating: 5,
  },
  {
    id: "5",
    name: "حسین رضایی",
    role: "کاربر پلتفرم",
    initials: "ح.ر",
    message: "امکانات خوب و متنوع. قیمت‌ها هم مناسب است.",
    content: "امکانات خوب و متنوع",
    rating: 4,
  },
  {
    id: "6",
    name: "فاطمه نوری",
    role: "کاربر پلتفرم",
    initials: "ف.ن",
    message: "بهترین تجربه‌ای که تاکنون داشتم. عالی است!",
    content: "بهترین تجربه",
    rating: 5,
  },
];

// Export with the name used in TestimonialsCarousel
export const testimonialsData = testimonials;

export function getTestimonials(): Testimonial[] {
  return testimonials;
}

export function getTestimonialById(id: string): Testimonial | undefined {
  return testimonials.find((t) => t.id === id);
}
