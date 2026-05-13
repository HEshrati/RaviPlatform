"use client";

/**
 * HeroBackground.tsx
 * 
 * سکشن hero صفحه‌ی اصلی با ویدیو یا slideshow پس‌زمینه
 * بهینه‌سازی شده برای اینترنت ایران:
 * 
 *  - اول poster image (~۲۰KB) فوراً نمایش داده می‌شه (LCP سریع)
 *  - بعد ویدیو در پس‌زمینه lazy load می‌شه
 *  - اگه ویدیو نباشه یا لود نشه، slideshow CSS-only اجرا می‌شه
 *  - ویدیو muted + loop + playsInline برای autoplay روی iOS
 *  - preload="metadata" — فقط متادیتا اول لود می‌شه، نه کل ویدیو
 * 
 * نحوه‌ی استفاده:
 *   <HeroBackground />
 *   <HeroBackground videoSrc="/videos/intro.mp4" posterSrc="/images/hero-poster.jpg" />
 * 
 * فایل‌های مورد نیاز (اگه ویدیو می‌خوای):
 *   public/videos/intro.mp4         (~500KB-1MB، 720p، 10-20 ثانیه، h264)
 *   public/videos/intro.webm        (نسخه‌ی فشرده‌تر)
 *   public/images/hero-poster.jpg   (~20KB، اولین فریم ویدیو)
 * 
 * اگه فقط slideshow می‌خوای، ۳-۴ تا تصویر توی public/images/hero/ بذار
 */

import { useEffect, useRef, useState } from "react";

interface Props {
  /** مسیر mp4 — اگه نباشه از slideshow استفاده می‌شه */
  videoSrc?: string;
  /** مسیر webm — اختیاری، برای فایل سبک‌تر روی مرورگرهای جدید */
  videoSrcWebm?: string;
  /** تصویر poster که قبل از لود ویدیو نمایش داده می‌شه */
  posterSrc?: string;
  /** کلاس‌های CSS اضافی */
  className?: string;
  /** متن overlay */
  children?: React.ReactNode;
  /** ارتفاع — پیش‌فرض 100vh */
  height?: string;
}

// تصاویر slideshow پیش‌فرض — اگه این فایل‌ها وجود نداشتن، gradient ساده نمایش داده می‌شه
const DEFAULT_SLIDES = [
  "/images/hero/slide-1.jpg",
  "/images/hero/slide-2.jpg",
  "/images/hero/slide-3.jpg",
];

// SVG با gradient زیبا — fallback برای وقتی هیچ فایل تصویری نیست
const FALLBACK_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1B2A4A"/>
      <stop offset="50%" stop-color="#0B1F3A"/>
      <stop offset="100%" stop-color="#FF6B00"/>
    </linearGradient>
    <radialGradient id="g2" cx="30%" cy="40%" r="60%">
      <stop offset="0%" stop-color="rgba(255,107,0,0.4)"/>
      <stop offset="100%" stop-color="rgba(255,107,0,0)"/>
    </radialGradient>
    <radialGradient id="g3" cx="80%" cy="70%" r="40%">
      <stop offset="0%" stop-color="rgba(99,102,241,0.3)"/>
      <stop offset="100%" stop-color="rgba(99,102,241,0)"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#g1)"/>
  <rect width="1920" height="1080" fill="url(#g2)"/>
  <rect width="1920" height="1080" fill="url(#g3)"/>
  <circle cx="500" cy="300" r="150" fill="rgba(255,255,255,0.03)"/>
  <circle cx="1500" cy="800" r="200" fill="rgba(255,255,255,0.04)"/>
  <circle cx="1300" cy="200" r="80" fill="rgba(255,255,255,0.05)"/>
</svg>
`)}`;

export default function HeroBackground({
  videoSrc = "/videos/intro.mp4",
  videoSrcWebm,
  posterSrc = "/images/hero-poster.jpg",
  className = "",
  children,
  height = "100vh",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [posterFailed, setPosterFailed] = useState(false);

  // ─── slideshow rotation ─────────────────────────────────────
  useEffect(() => {
    if (!videoFailed) return; // فقط وقتی ویدیو fail کرد slideshow رو فعال کن
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % DEFAULT_SLIDES.length);
    }, 5000); // ۵ ثانیه بین هر اسلاید
    return () => clearInterval(id);
  }, [videoFailed]);

  // ─── lazy load video بعد از mount ──────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // فقط بعد از mount کامل، src رو ست کن
    // این از block شدن first paint توسط ویدیو جلوگیری می‌کنه
    const timer = setTimeout(() => {
      try {
        v.load();
        v.play().catch(() => {
          // اگه autoplay block شد، fallback به slideshow
          setVideoFailed(true);
        });
      } catch {
        setVideoFailed(true);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // ─── timeout: اگه ۶ ثانیه طول کشید لود نشد، fallback ─────────
  useEffect(() => {
    if (videoLoaded || videoFailed) return;
    const timeout = setTimeout(() => {
      if (!videoLoaded) setVideoFailed(true);
    }, 6000);
    return () => clearTimeout(timeout);
  }, [videoLoaded, videoFailed]);

  const finalPoster = posterFailed ? FALLBACK_SVG : posterSrc;

  return (
    <div
      className={`relative overflow-hidden w-full ${className}`}
      style={{ height, background: "#0B1628" }}
    >
      {/* ─── لایه ۱: poster (همیشه فوراً نمایش داده می‌شه) ─── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url("${finalPoster}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "opacity 0.8s ease-out",
          opacity: videoLoaded ? 0 : 1,
        }}
      />

      {/* پیش‌بارگذاری poster برای trigger کردن onError */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterSrc}
        alt=""
        style={{ display: "none" }}
        onError={() => setPosterFailed(true)}
      />

      {/* ─── لایه ۲: ویدیو (وقتی لود شد ظاهر می‌شه) ─── */}
      {!videoFailed && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={finalPoster}
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoFailed(true)}
          onStalled={() => {
            // اگه ۶ ثانیه stall کرد، fallback
            setTimeout(() => {
              if (!videoLoaded) setVideoFailed(true);
            }, 6000);
          }}
          className="absolute inset-0 w-full h-full object-cover z-[1]"
          style={{
            transition: "opacity 1s ease-in",
            opacity: videoLoaded ? 1 : 0,
          }}
        >
          {videoSrcWebm && <source src={videoSrcWebm} type="video/webm" />}
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* ─── لایه ۲ جایگزین: slideshow وقتی ویدیو fail کرد ─── */}
      {videoFailed && (
        <div className="absolute inset-0 z-[1]">
          {DEFAULT_SLIDES.map((slide, i) => (
            <div
              key={slide}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                backgroundImage: `url("${slide}"), url("${FALLBACK_SVG}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: i === slideIndex ? 1 : 0,
                transform: i === slideIndex ? "scale(1.05)" : "scale(1)",
                transition: "opacity 1s ease-in-out, transform 6s ease-out",
              }}
            />
          ))}
        </div>
      )}

      {/* ─── لایه ۳: overlay تیره برای خوانایی متن ─── */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,22,40,0.4) 0%, rgba(11,22,40,0.65) 70%, rgba(11,22,40,0.85) 100%)",
        }}
      />

      {/* ─── لایه ۴: محتوا ─── */}
      {children && (
        <div className="relative z-[3] w-full h-full flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

