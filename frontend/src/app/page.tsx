"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import MobileNavbar from "@/components/MobileNavbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import FAQ from "@/components/landing/FAQ";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Reveal from "@/components/Reveal";

export default function LandingPage() {
  const { state } = useAppContext();

  const ctaHref = useMemo(() => {
    if (!state.isLoggedIn) return "/test";
    if (!state.isProfileComplete || !state.isTestTaken) {
      return "/dashboard/complete-profile";
    }
    return "/events/next/booking";
  }, [state.isLoggedIn, state.isProfileComplete, state.isTestTaken]);

  return (
    <div className="min-h-screen font-sans text-slate-900 overflow-x-hidden relative bg-transparent">
      {/* Mobile Navbar Floating */}
      <MobileNavbar />

      {/* Background Animated Blobs - با شفافیت بیشتر */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden bg-transparent">
        <div className="absolute top-0 -left-10 md:-left-20 w-[200px] md:w-[500px] h-[200px] md:h-[500px] bg-orange-400/20 md:bg-orange-400/25 rounded-full mix-blend-multiply filter blur-[60px] md:blur-[80px] animate-blob"></div>
        <div className="absolute top-0 -right-10 md:-right-20 w-[150px] md:w-[400px] h-[150px] md:h-[400px] bg-yellow-400/20 md:bg-yellow-400/25 rounded-full mix-blend-multiply filter blur-[60px] md:blur-[80px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] -left-10 md:-left-20 w-[150px] md:w-[400px] h-[150px] md:h-[400px] bg-orange-300/25 md:bg-orange-300/30 rounded-full mix-blend-multiply filter blur-[60px] md:blur-[80px] animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 -right-10 md:-right-20 w-[200px] md:w-[600px] h-[200px] md:h-[600px] bg-orange-100/40 md:bg-orange-100/45 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] animate-blob"></div>
      </div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero ctaHref={ctaHref} />

      {/* Features Section */}
      <Features />

      {/* Testimonials Section */}
      <Reveal
        as="section"
        direction="left"
        className="py-16 md:py-24 px-4 md:px-6 bg-transparent"
      >
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-orange-500 font-bold text-xs md:text-sm tracking-widest uppercase">
              نظرات کاربران
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mt-2 mb-4">
              تجربه کاربران راوی
            </h2>
            <p className="text-slate-500 text-xs md:text-sm lg:text-base">
              ببینید دیگران چگونه هم‌نشین‌های خود را پیدا کردند.
            </p>
          </div>

          <TestimonialsCarousel />
        </div>
      </Reveal>

      {/* CTA Section */}
      <Reveal
        as="section"
        direction="left"
        className="py-16 md:py-24 px-4 md:px-6 bg-transparent"
      >
        <div className="container mx-auto bg-slate-900/95 text-white rounded-[30px] md:rounded-3xl px-6 md:px-8 py-10 md:py-16 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
            <div className="text-center md:text-right">
              <h2 className="text-2xl md:text-3xl font-black mb-4">
                آماده‌ای هم‌نشین خودت را پیدا کنی؟
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                با یک تست ۱۵ دقیقه‌ای شروع کن و به جمع ۱۰ هزار نفره راوی اضافه
                شو. تیم ما در کنار توست تا تجربه‌ای امن، علمی و هیجان‌انگیز
                داشته باشی.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Link href={ctaHref} className="w-full sm:w-auto">
                <button className="bg-white/95 text-slate-900 px-8 py-4 rounded-2xl font-bold text-base md:text-lg hover:bg-white transition shadow-lg hover:-translate-y-1 w-full">
                  بزن بریم
                </button>
              </Link>
              <Link href="/events" className="w-full sm:w-auto">
                <button className="bg-transparent border-2 border-white/80 text-white px-8 py-4 rounded-2xl font-bold text-base md:text-lg hover:bg-white/10 transition w-full">
                  شرکت در رویداد بعدی
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
}
