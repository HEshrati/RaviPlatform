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
  const [isAnimating, setIsAnimating] = useState(false);
  const total = testimonials.length;

  const visibleTestimonials = useMemo(() => {
    if (!total) return [];
    return Array.from({ length: VISIBLE_COUNT }, (_, i) => {
      return testimonials[(index + i) % total];
    });
  }, [index, total, testimonials]);

  const handlePrev = () => {
    if (!total || isAnimating) return;
    setIsAnimating(true);
    setIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (!total || isAnimating) return;
    setIsAnimating(true);
    setIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <button
          onClick={handlePrev}
          disabled={isAnimating}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/80 text-slate-600 hover:text-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
          aria-label="نمایش قبلی"
        >
          <ArrowLeft className="mx-auto" size={16} />
        </button>

        <div className="flex-1" />

        <button
          onClick={handleNext}
          disabled={isAnimating}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/80 text-slate-600 hover:text-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
          aria-label="نمایش بعدی"
        >
          <ArrowRight className="mx-auto" size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3 relative">
        {visibleTestimonials.map((item, cardIndex) => (
          <article
            key={`${item.id}-${index}-${cardIndex}`}
            className={cn(
              "h-full rounded-2xl md:rounded-3xl border border-slate-100/80 bg-white/90 backdrop-blur-sm p-6 md:p-8 shadow-lg shadow-slate-200/30 flex flex-col justify-between",
              "transition-all duration-500 ease-out",
              isAnimating
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0",
            )}
            style={{
              transitionDelay: `${cardIndex * 100}ms`,
            }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm md:text-base">
                {item.initials}
              </div>
              <div>
                <h4 className="text-sm md:text-base font-bold text-slate-900">
                  {item.name}
                </h4>
                <p className="text-xs md:text-sm text-slate-500">{item.role}</p>
              </div>
            </div>

            <p className="text-xs md:text-sm leading-relaxed text-slate-600 flex-1">
              «{item.message}»
            </p>

            <div className="flex items-center gap-1 pt-4 md:pt-6">
              {Array.from({ length: 5 }).map((_, starIdx) => (
                <Star
                  key={starIdx}
                  size={14}
                  className={cn(
                    "text-orange-400 transition-all duration-300",
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

      <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
        {Array.from({ length: total }).map((_, dotIndex) => (
          <button
            key={dotIndex}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setIndex(dotIndex);
                setTimeout(() => setIsAnimating(false), 500);
              }
            }}
            className={cn(
              "h-1.5 md:h-2 rounded-full transition-all duration-300",
              dotIndex === index
                ? "w-6 md:w-8 bg-orange-500"
                : "w-1.5 md:w-2 bg-slate-300 hover:bg-slate-400",
            )}
            aria-label={`برو به نظر ${dotIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
