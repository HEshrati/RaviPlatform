"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ArrowLeft, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { testimonialsData, Testimonial } from "@/lib/testimonials";

const VISIBLE_COUNT = 3;

export default function TestimonialsCarousel({
  testimonials = testimonialsData,
  className,
}: {
  testimonials?: Testimonial[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;

  const visibleTestimonials = useMemo(() => {
    if (!total) return [];
    return Array.from({ length: VISIBLE_COUNT }, (_, i) => {
      return testimonials[(index + i) % total];
    });
  }, [index, total, testimonials]);

  const handlePrev = () => {
    if (!total) return;
    setIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!total) return;
    setIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-end gap-4 mb-8">
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-orange-500 hover:border-orange-500 transition-shadow shadow-sm"
          aria-label="نمایش بعدی"
        >
          <ArrowRight className="mx-auto" size={18} />
        </button>
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-orange-500 hover:border-orange-500 transition-shadow shadow-sm"
          aria-label="نمایش قبلی"
        >
          <ArrowLeft className="mx-auto" size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {visibleTestimonials.map((item) => (
          <article
            key={item.id}
            className="h-full rounded-3xl border border-slate-100 bg-white p-8 shadow-lg shadow-slate-200/40 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black">
                {item.initials}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {item.name}
                </h4>
                <p className="text-sm text-slate-500">{item.role}</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 flex-1">
              «{item.message}»
            </p>

            <div className="flex items-center gap-1 pt-6">
              {Array.from({ length: 5 }).map((_, starIdx) => (
                <Star
                  key={starIdx}
                  size={16}
                  className={cn(
                    "text-orange-400",
                    starIdx + 1 <= item.rating
                      ? "fill-orange-400"
                      : "fill-slate-200 text-slate-300",
                  )}
                />
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
