import { Image, Clock, Users, Star } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "طراحی داخلی مدرن",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&auto=format&fit=crop&q=60",
    time: "۱۲ ساعت",
    price: "۹۰۰,۰۰۰",
    students: 1200,
    rating: 4.8,
  },
  {
    id: 2,
    title: "یوگا و مدیتیشن در خانه",
    image:
      "https://images.unsplash.com/photo-1544367563-12123d8965cd?w=500&auto=format&fit=crop&q=60",
    time: "۸ ساعت",
    price: "۴۵۰,۰۰۰",
    students: 850,
    rating: 4.9,
  },
  {
    id: 3,
    title: "مدیریت استرس و ودا",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=60",
    time: "۵ ساعت",
    price: "۳۰۰,۰۰۰",
    students: 2000,
    rating: 4.7,
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center md:text-right">
          <h1 className="text-3xl font-bold text-slate-900">دوره‌های آموزشی</h1>
          <p className="text-slate-500 mt-2">
            بهترین دوره‌ها برای رشد و یادگیری شما
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100 group"
            >
              <div className="h-48 overflow-hidden relative">
                <div className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  تخفیف ویژه
                </div>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {course.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    {course.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    {course.students}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    {course.rating}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-slate-900">
                    {course.price}{" "}
                    <span className="text-sm font-normal text-slate-500">
                      تومان
                    </span>
                  </span>
                  <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-transform active:scale-95">
                    ثبت نام
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
