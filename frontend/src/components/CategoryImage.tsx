"use client";

/**
 * CategoryImage.tsx — نسخه‌ی نارنجی روی سرمه‌ای
 * 
 * سبک:
 *  - پس‌زمینه: سرمه‌ای تیره (#1B2A4A → #0F2340 gradient)
 *  - آیکون: نارنجی راوی (#FF6B00 / #FF9A3C)
 *  - چند نقطه‌ی نور و عمق برای جلوگیری از تخت بودن
 *  - آیکون هر category مرتبط با موضوع
 * 
 * استفاده:
 *   <CategoryImage category="hamghadam" alt="هم قدم" />
 *   <CategoryImage category="hamghadam" variant="card" />     // مربع برای دسته‌بندی‌ها
 *   <CategoryImage category="hamghadam" variant="banner" />   // مستطیل برای کارت ایونت
 */

import { useState } from "react";

const COLORS = {
  navy1: "#1B2A4A",
  navy2: "#0F2340",
  navyAccent: "#2A3F66",
  orange1: "#FF6B00",
  orange2: "#FF9A3C",
  orangeLight: "#FFC289",
  white: "#FFFFFF",
};

const CATEGORY_TITLES: Record<string, string> = {
  hamgharar: "هم قرار",
  hamsohbat: "هم صحبت",
  hambazi: "هم بازی",
  hamvision: "هم ویژن",
  hamhonar: "هم هنر",
  hamghadam: "هم قدم",
  hamziste: "دوست روانشناس",
  hamvarzesh: "هم ورزش",
  hamnegah: "هم نگاه",
  hamneshin: "هم نشین",
  hampa: "هم پا",
  hamamooz: "هم آموز",
  hamfekr: "هم فکر",
  hamteymi: "هم تیمی",
  hamghesse: "هم قصه",
  hamkar: "هم کار",
};

const CATEGORY_ICONS: Record<string, string> = {
  hamgharar: `
    <g stroke="${COLORS.orange1}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M95 60 Q90 50 95 40 Q100 30 95 20" opacity="0.6"/>
      <path d="M120 65 Q115 55 120 45 Q125 35 120 25" opacity="0.8"/>
      <path d="M145 60 Q140 50 145 40 Q150 30 145 20" opacity="0.6"/>
    </g>
    <g fill="${COLORS.orange1}">
      <path d="M75 90 L75 150 Q75 180 105 180 L155 180 Q185 180 185 150 L185 90 Z"/>
      <path d="M185 105 Q215 105 215 130 Q215 155 185 155 L185 145 Q205 145 205 130 Q205 115 185 115 Z"/>
    </g>
    <ellipse cx="115" cy="105" rx="20" ry="6" fill="${COLORS.orangeLight}" opacity="0.5"/>
  `,
  hamsohbat: `
    <g fill="${COLORS.orange1}">
      <path d="M75 60 L165 60 Q190 60 190 85 L190 130 Q190 155 165 155 L130 155 L115 175 L115 155 L75 155 Q50 155 50 130 L50 85 Q50 60 75 60 Z" opacity="0.4"/>
      <path d="M105 90 L195 90 Q220 90 220 115 L220 160 Q220 185 195 185 L130 185 L115 205 L115 185 L105 185 Q80 185 80 160 L80 115 Q80 90 105 90 Z"/>
    </g>
    <g fill="${COLORS.white}">
      <circle cx="120" cy="138" r="6"/>
      <circle cx="150" cy="138" r="6"/>
      <circle cx="180" cy="138" r="6"/>
    </g>
  `,
  hambazi: `
    <g fill="${COLORS.orange1}">
      <path d="M75 95 Q40 95 40 130 L40 165 Q40 195 70 195 Q90 195 100 175 L150 175 Q160 195 180 195 Q210 195 210 165 L210 130 Q210 95 175 95 Z"/>
    </g>
    <g fill="${COLORS.navy1}">
      <rect x="68" y="130" width="30" height="10" rx="2"/>
      <rect x="78" y="120" width="10" height="30" rx="2"/>
    </g>
    <g fill="${COLORS.navy1}">
      <circle cx="155" cy="125" r="7"/>
      <circle cx="180" cy="135" r="7"/>
      <circle cx="170" cy="155" r="7"/>
      <circle cx="145" cy="145" r="7"/>
    </g>
  `,
  hamvision: `
    <path d="M40 130 Q125 60 210 130 Q125 200 40 130 Z" fill="${COLORS.orange1}"/>
    <circle cx="125" cy="130" r="32" fill="${COLORS.navy1}"/>
    <circle cx="125" cy="130" r="16" fill="${COLORS.navy2}"/>
    <circle cx="118" cy="123" r="6" fill="${COLORS.white}"/>
    <g stroke="${COLORS.orange1}" stroke-width="5" stroke-linecap="round">
      <line x1="60" y1="80" x2="65" y2="95"/>
      <line x1="90" y1="65" x2="92" y2="80"/>
      <line x1="125" y1="58" x2="125" y2="75"/>
      <line x1="160" y1="65" x2="158" y2="80"/>
      <line x1="190" y1="80" x2="185" y2="95"/>
    </g>
  `,
  hamhonar: `
    <path d="M125 50 Q60 50 50 110 Q40 175 100 195 Q120 200 130 185 Q135 175 130 165 Q125 150 145 145 Q200 130 195 80 Q190 50 125 50 Z" fill="${COLORS.orange1}"/>
    <circle cx="80" cy="100" r="11" fill="${COLORS.white}"/>
    <circle cx="125" cy="85" r="11" fill="${COLORS.navy1}"/>
    <circle cx="165" cy="100" r="11" fill="${COLORS.orangeLight}"/>
    <circle cx="160" cy="145" r="11" fill="${COLORS.white}"/>
    <circle cx="90" cy="155" r="11" fill="${COLORS.navy2}"/>
    <circle cx="115" cy="135" r="14" fill="${COLORS.navy1}"/>
  `,
  hamghadam: `
    <path d="M30 200 L90 90 L130 145 L165 105 L220 200 Z" fill="${COLORS.orange1}" opacity="0.5"/>
    <path d="M50 200 L110 100 L155 165 L200 110 L235 200 Z" fill="${COLORS.orange1}"/>
    <path d="M90 130 L110 100 L130 130 Z" fill="${COLORS.white}"/>
    <path d="M180 130 L200 110 L220 130 Z" fill="${COLORS.white}"/>
    <circle cx="180" cy="65" r="22" fill="${COLORS.orangeLight}"/>
  `,
  hamziste: `
    <path d="M125 60 Q85 60 70 90 Q50 95 50 120 Q50 145 70 155 Q70 180 95 185 Q110 195 125 185 L125 60 Z" fill="${COLORS.orange1}"/>
    <path d="M125 60 Q165 60 180 90 Q200 95 200 120 Q200 145 180 155 Q180 180 155 185 Q140 195 125 185 L125 60 Z" fill="${COLORS.orange2}"/>
    <line x1="125" y1="65" x2="125" y2="190" stroke="${COLORS.navy1}" stroke-width="3"/>
    <g stroke="${COLORS.white}" stroke-width="3" fill="none" stroke-linecap="round">
      <path d="M75 100 Q90 92 105 100"/>
      <path d="M75 130 Q90 122 105 130"/>
      <path d="M75 160 Q90 152 105 160"/>
      <path d="M145 100 Q160 92 175 100"/>
      <path d="M145 130 Q160 122 175 130"/>
      <path d="M145 160 Q160 152 175 160"/>
    </g>
    <path d="M125 200 L115 190 Q105 182 113 174 Q120 168 125 175 Q130 168 137 174 Q145 182 135 190 Z" fill="${COLORS.orangeLight}"/>
  `,
  hamvarsh: ``,
  hamvarzesh: `
    <g fill="${COLORS.orange1}">
      <rect x="35" y="100" width="22" height="60" rx="6"/>
      <rect x="60" y="85" width="20" height="90" rx="6"/>
      <rect x="80" y="125" width="90" height="20" rx="4"/>
      <rect x="170" y="85" width="20" height="90" rx="6"/>
      <rect x="193" y="100" width="22" height="60" rx="6"/>
    </g>
  `,
  hamnegah: `
    <g fill="none" stroke="${COLORS.orange1}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="80" cy="135" r="40" fill="${COLORS.orange1}" fill-opacity="0.2"/>
      <circle cx="170" cy="135" r="40" fill="${COLORS.orange1}" fill-opacity="0.2"/>
      <path d="M120 135 Q125 125 130 135"/>
    </g>
    <g fill="${COLORS.white}" opacity="0.5">
      <ellipse cx="68" cy="120" rx="10" ry="6" transform="rotate(-30 68 120)"/>
      <ellipse cx="158" cy="120" rx="10" ry="6" transform="rotate(-30 158 120)"/>
    </g>
  `,
  hamneshin: `
    <g fill="${COLORS.orange1}">
      <circle cx="85" cy="80" r="22"/>
      <path d="M55 195 L55 145 Q55 115 85 115 Q115 115 115 145 L115 195 Z"/>
      <circle cx="165" cy="80" r="22"/>
      <path d="M135 195 L135 145 Q135 115 165 115 Q195 115 195 145 L195 195 Z"/>
    </g>
    <path d="M125 150 Q120 135 125 125 Q130 115 125 100 Q120 110 115 120 Q120 135 110 145 Q115 155 125 150 Z" fill="${COLORS.orangeLight}"/>
  `,
  hampa: `
    <g fill="${COLORS.orange1}">
      <ellipse cx="80" cy="150" rx="32" ry="42"/>
      <ellipse cx="62" cy="105" rx="9" ry="12"/>
      <ellipse cx="78" cy="95" rx="9" ry="12"/>
      <ellipse cx="95" cy="100" rx="9" ry="12"/>
      <ellipse cx="108" cy="115" rx="8" ry="10"/>
    </g>
    <g fill="${COLORS.orange2}">
      <ellipse cx="175" cy="170" rx="32" ry="42"/>
      <ellipse cx="157" cy="125" rx="9" ry="12"/>
      <ellipse cx="173" cy="115" rx="9" ry="12"/>
      <ellipse cx="190" cy="120" rx="9" ry="12"/>
      <ellipse cx="203" cy="135" rx="8" ry="10"/>
    </g>
  `,
  hamamooz: `
    <g fill="${COLORS.orange1}">
      <path d="M30 90 L120 100 L120 200 L30 195 Q30 180 30 90 Z"/>
      <path d="M220 90 L130 100 L130 200 L220 195 Q220 180 220 90 Z"/>
    </g>
    <g stroke="${COLORS.white}" stroke-width="3" stroke-linecap="round" opacity="0.7">
      <line x1="50" y1="120" x2="105" y2="125"/>
      <line x1="50" y1="140" x2="105" y2="143"/>
      <line x1="50" y1="160" x2="100" y2="163"/>
      <line x1="145" y1="125" x2="200" y2="120"/>
      <line x1="145" y1="143" x2="200" y2="140"/>
      <line x1="145" y1="163" x2="195" y2="160"/>
    </g>
    <line x1="125" y1="95" x2="125" y2="200" stroke="${COLORS.navy1}" stroke-width="3"/>
  `,
  hamfekr: `
    <g fill="${COLORS.orange1}">
      <path d="M125 50 Q80 50 80 100 Q80 130 105 145 L105 165 Q105 175 115 175 L135 175 Q145 175 145 165 L145 145 Q170 130 170 100 Q170 50 125 50 Z"/>
    </g>
    <g fill="${COLORS.navy2}">
      <rect x="105" y="170" width="40" height="8" rx="2"/>
      <rect x="110" y="180" width="30" height="8" rx="2"/>
      <path d="M115 192 L135 192 L130 200 L120 200 Z"/>
    </g>
    <path d="M105 90 Q115 80 125 80 Q135 80 145 90" stroke="${COLORS.white}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7"/>
    <g stroke="${COLORS.orangeLight}" stroke-width="4" stroke-linecap="round">
      <line x1="35" y1="100" x2="55" y2="100"/>
      <line x1="195" y1="100" x2="215" y2="100"/>
      <line x1="55" y1="50" x2="65" y2="60"/>
      <line x1="185" y1="60" x2="195" y2="50"/>
      <line x1="125" y1="20" x2="125" y2="35"/>
    </g>
  `,
  hamteymi: `
    <circle cx="125" cy="130" r="80" fill="${COLORS.orange1}"/>
    <g stroke="${COLORS.navy1}" stroke-width="5" fill="none" stroke-linecap="round">
      <line x1="45" y1="130" x2="205" y2="130"/>
      <line x1="125" y1="50" x2="125" y2="210"/>
      <path d="M75 75 Q125 110 175 75"/>
      <path d="M75 185 Q125 150 175 185"/>
    </g>
    <ellipse cx="95" cy="100" rx="16" ry="10" fill="${COLORS.orangeLight}" opacity="0.5"/>
  `,
  hamghesse: `
    <g fill="${COLORS.orange1}">
      <rect x="50" y="80" width="150" height="120" rx="6"/>
    </g>
    <rect x="50" y="80" width="20" height="120" rx="6" fill="${COLORS.orange2}"/>
    <path d="M125 110 L110 95 Q90 80 105 65 Q120 55 125 70 Q130 55 145 65 Q160 80 140 95 Z" fill="${COLORS.white}"/>
    <g stroke="${COLORS.white}" stroke-width="2" stroke-linecap="round" opacity="0.5">
      <line x1="80" y1="155" x2="180" y2="155"/>
      <line x1="80" y1="170" x2="170" y2="170"/>
      <line x1="80" y1="185" x2="160" y2="185"/>
    </g>
  `,
  hamkar: `
    <g fill="${COLORS.orange1}">
      <rect x="50" y="105" width="150" height="100" rx="10"/>
    </g>
    <path d="M95 105 L95 80 Q95 65 110 65 L140 65 Q155 65 155 80 L155 105" stroke="${COLORS.orange1}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="50" y1="140" x2="200" y2="140" stroke="${COLORS.navy1}" stroke-width="4"/>
    <circle cx="125" cy="140" r="8" fill="${COLORS.white}"/>
  `,
  default: `
    <path d="M125 50 L145 110 L210 110 L160 145 L180 205 L125 170 L70 205 L90 145 L40 110 L105 110 Z" fill="${COLORS.orange1}"/>
    <circle cx="125" cy="135" r="14" fill="${COLORS.orangeLight}"/>
  `,
};

function buildSVG(category: string, variant: "card" | "banner" = "banner"): string {
  const cat = (category || "default").toLowerCase();
  const icon = CATEGORY_ICONS[cat] || CATEGORY_ICONS.default;
  const title = CATEGORY_TITLES[cat] || cat;

  if (variant === "card") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 280" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
      <defs>
        <linearGradient id="bg-${cat}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${COLORS.navy1}"/>
          <stop offset="100%" stop-color="${COLORS.navy2}"/>
        </linearGradient>
        <radialGradient id="glow-${cat}" cx="80%" cy="20%" r="80%">
          <stop offset="0%" stop-color="${COLORS.orange1}" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="${COLORS.orange1}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="250" height="280" fill="url(#bg-${cat})" rx="20"/>
      <rect width="250" height="280" fill="url(#glow-${cat})" rx="20"/>
      <circle cx="40" cy="240" r="50" fill="${COLORS.orange1}" opacity="0.04"/>
      <circle cx="220" cy="50" r="35" fill="${COLORS.orange1}" opacity="0.06"/>
      ${icon}
      <text x="125" y="255" text-anchor="middle" font-family="Vazirmatn, Tahoma, Arial, sans-serif" font-weight="900" font-size="20" fill="${COLORS.white}" direction="rtl">${title}</text>
    </svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
    <defs>
      <linearGradient id="bg-b-${cat}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${COLORS.navy1}"/>
        <stop offset="100%" stop-color="${COLORS.navy2}"/>
      </linearGradient>
      <radialGradient id="glow-b-${cat}" cx="80%" cy="20%" r="60%">
        <stop offset="0%" stop-color="${COLORS.orange1}" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="${COLORS.orange1}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="400" height="240" fill="url(#bg-b-${cat})"/>
    <rect width="400" height="240" fill="url(#glow-b-${cat})"/>
    <circle cx="60" cy="200" r="80" fill="${COLORS.orange1}" opacity="0.05"/>
    <circle cx="350" cy="50" r="40" fill="${COLORS.orange1}" opacity="0.07"/>
    <g transform="translate(75, 0)">${icon}</g>
    <text x="200" y="220" text-anchor="middle" font-family="Vazirmatn, Tahoma, Arial, sans-serif" font-weight="900" font-size="22" fill="${COLORS.white}" direction="rtl">${title}</text>
  </svg>`;
}

function svgToDataURI(svg: string): string {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

interface Props {
  category?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  variant?: "card" | "banner";
  preferRealImage?: boolean;
}

export default function CategoryImage({
  category = "default",
  alt,
  className = "",
  priority = false,
  variant = "banner",
  preferRealImage = true,
}: Props) {
  const cat = (category || "default").toLowerCase();
  const svgURI = svgToDataURI(buildSVG(cat, variant));
  const jpegURL = `/images/categories/${cat}.jpg`;
  const altText = alt || CATEGORY_TITLES[cat] || cat;

  const [useFallback, setUseFallback] = useState(!preferRealImage);

  if (useFallback) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={svgURI}
        alt={altText}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundImage: `url("${svgURI}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={jpegURL}
        alt={altText}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setUseFallback(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}

export function getCategoryImageURI(category: string, variant: "card" | "banner" = "banner"): string {
  return svgToDataURI(buildSVG(category, variant));
}

