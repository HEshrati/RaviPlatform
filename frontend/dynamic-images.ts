// ─── رنگ‌بندی دسته‌بندی‌ها (نارنجی + سورمه‌ای) ──────────────────────────────
const CAT_CONFIG: Record<string, { label: string; pattern: string }> = {
  hambazi: {
    label: 'هم‌بازی',
    pattern: `<circle cx="200" cy="140" r="60" fill="none" stroke="rgba(255,154,60,0.35)" stroke-width="3"/>
              <circle cx="200" cy="140" r="38" fill="rgba(255,107,0,0.12)" stroke="rgba(255,107,0,0.55)" stroke-width="2"/>
              <rect x="176" y="126" width="48" height="28" rx="6" fill="none" stroke="rgba(255,154,60,0.7)" stroke-width="2"/>
              <circle cx="186" cy="136" r="4" fill="rgba(255,107,0,0.9)"/>
              <circle cx="214" cy="136" r="4" fill="rgba(255,107,0,0.9)"/>
              <line x1="196" y1="131" x2="196" y2="143" stroke="rgba(255,154,60,0.9)" stroke-width="2"/>
              <line x1="190" y1="137" x2="202" y2="137" stroke="rgba(255,154,60,0.9)" stroke-width="2"/>`,
  },
  hamneshin: {
    label: 'همنشین',
    pattern: `<circle cx="168" cy="128" r="26" fill="rgba(255,107,0,0.1)" stroke="rgba(255,107,0,0.5)" stroke-width="2"/>
              <circle cx="232" cy="128" r="26" fill="rgba(255,154,60,0.1)" stroke="rgba(255,154,60,0.5)" stroke-width="2"/>
              <circle cx="168" cy="116" r="13" fill="rgba(255,107,0,0.3)"/>
              <circle cx="232" cy="116" r="13" fill="rgba(255,154,60,0.3)"/>
              <path d="M152 158 Q200 143 248 158" stroke="rgba(255,107,0,0.7)" stroke-width="3" fill="none"/>`,
  },
  hamsohbat: {
    label: 'هم‌صحبت',
    pattern: `<rect x="128" y="108" width="88" height="58" rx="16" fill="rgba(255,107,0,0.1)" stroke="rgba(255,107,0,0.5)" stroke-width="2"/>
              <polygon points="153,166 143,184 168,166" fill="rgba(255,107,0,0.4)"/>
              <rect x="178" y="123" width="78" height="53" rx="16" fill="rgba(255,154,60,0.08)" stroke="rgba(255,154,60,0.4)" stroke-width="2"/>
              <polygon points="258,176 270,192 253,176" fill="rgba(255,154,60,0.35)"/>
              <line x1="146" y1="131" x2="198" y2="131" stroke="rgba(255,107,0,0.6)" stroke-width="2"/>
              <line x1="146" y1="143" x2="188" y2="143" stroke="rgba(255,107,0,0.4)" stroke-width="2"/>`,
  },
  hampa: {
    label: 'هم‌پا',
    pattern: `<path d="M100 195 Q150 158 200 168 Q250 178 300 148" stroke="rgba(255,107,0,0.5)" stroke-width="3" fill="none"/>
              <circle cx="185" cy="112" r="17" fill="rgba(255,107,0,0.18)" stroke="rgba(255,107,0,0.6)" stroke-width="2"/>
              <line x1="185" y1="129" x2="185" y2="168" stroke="rgba(255,107,0,0.6)" stroke-width="2.5"/>
              <line x1="185" y1="148" x2="170" y2="163" stroke="rgba(255,107,0,0.6)" stroke-width="2.5"/>
              <line x1="185" y1="148" x2="200" y2="163" stroke="rgba(255,107,0,0.6)" stroke-width="2.5"/>
              <line x1="185" y1="168" x2="173" y2="186" stroke="rgba(255,107,0,0.6)" stroke-width="2.5"/>
              <line x1="185" y1="168" x2="197" y2="186" stroke="rgba(255,107,0,0.6)" stroke-width="2.5"/>`,
  },
  hamamooz: {
    label: 'هم‌آموز',
    pattern: `<rect x="143" y="103" width="108" height="78" rx="6" fill="rgba(255,107,0,0.08)" stroke="rgba(255,107,0,0.5)" stroke-width="2"/>
              <line x1="163" y1="123" x2="233" y2="123" stroke="rgba(255,107,0,0.7)" stroke-width="2"/>
              <line x1="163" y1="138" x2="218" y2="138" stroke="rgba(255,107,0,0.5)" stroke-width="2"/>
              <line x1="163" y1="153" x2="208" y2="153" stroke="rgba(255,107,0,0.4)" stroke-width="2"/>
              <circle cx="238" cy="173" r="19" fill="rgba(255,154,60,0.12)" stroke="rgba(255,154,60,0.6)" stroke-width="2"/>
              <text x="238" y="179" text-anchor="middle" font-size="14" fill="rgba(255,154,60,0.9)">★</text>`,
  },
  hamkar: {
    label: 'همکار',
    pattern: `<rect x="148" y="113" width="98" height="68" rx="8" fill="rgba(255,107,0,0.08)" stroke="rgba(255,107,0,0.5)" stroke-width="2"/>
              <rect x="168" y="106" width="58" height="13" rx="4" fill="rgba(255,107,0,0.22)" stroke="rgba(255,107,0,0.6)" stroke-width="1.5"/>
              <line x1="197" y1="113" x2="197" y2="181" stroke="rgba(255,107,0,0.35)" stroke-width="1.5"/>
              <line x1="148" y1="148" x2="246" y2="148" stroke="rgba(255,107,0,0.35)" stroke-width="1.5"/>`,
  },
  hamfekr: {
    label: 'هم‌فکر',
    pattern: `<circle cx="200" cy="128" r="34" fill="rgba(255,154,60,0.1)" stroke="rgba(255,154,60,0.5)" stroke-width="2"/>
              <path d="M184 153 Q184 168 214 168 Q214 153 214 153" stroke="rgba(255,107,0,0.6)" stroke-width="2" fill="none"/>
              <line x1="192" y1="168" x2="208" y2="168" stroke="rgba(255,107,0,0.6)" stroke-width="2"/>
              <line x1="194" y1="173" x2="206" y2="173" stroke="rgba(255,107,0,0.5)" stroke-width="2"/>
              <line x1="200" y1="94" x2="200" y2="104" stroke="rgba(255,154,60,0.7)" stroke-width="2"/>
              <line x1="221" y1="101" x2="214" y2="108" stroke="rgba(255,154,60,0.7)" stroke-width="2"/>
              <line x1="179" y1="101" x2="186" y2="108" stroke="rgba(255,154,60,0.7)" stroke-width="2"/>`,
  },
  hamteymi: {
    label: 'هم‌تیمی',
    pattern: `<circle cx="200" cy="146" r="40" fill="rgba(255,107,0,0.07)" stroke="rgba(255,107,0,0.4)" stroke-width="2"/>
              <path d="M200 106 L200 186" stroke="rgba(255,107,0,0.3)" stroke-width="1.5"/>
              <path d="M160 146 L240 146" stroke="rgba(255,107,0,0.3)" stroke-width="1.5"/>
              <circle cx="200" cy="146" r="11" fill="rgba(255,107,0,0.22)" stroke="rgba(255,107,0,0.7)" stroke-width="2"/>
              <circle cx="159" cy="146" r="6" fill="rgba(255,154,60,0.65)"/>
              <circle cx="241" cy="146" r="6" fill="rgba(255,154,60,0.65)"/>`,
  },
  hamghesse: {
    label: 'هم‌قصه',
    pattern: `<path d="M153 108 L153 188 Q153 193 158 193 L200 183 L242 193 Q247 193 247 188 L247 108 Q247 103 242 103 L200 113 L158 103 Q153 103 153 108Z" 
              fill="rgba(255,107,0,0.08)" stroke="rgba(255,107,0,0.5)" stroke-width="2"/>
              <line x1="200" y1="113" x2="200" y2="183" stroke="rgba(255,107,0,0.35)" stroke-width="1.5"/>
              <line x1="166" y1="128" x2="198" y2="128" stroke="rgba(255,107,0,0.5)" stroke-width="1.5"/>
              <line x1="166" y1="143" x2="198" y2="143" stroke="rgba(255,107,0,0.4)" stroke-width="1.5"/>
              <line x1="166" y1="158" x2="198" y2="158" stroke="rgba(255,107,0,0.3)" stroke-width="1.5"/>`,
  },
};

function buildSVG(cat: string, small = false): string {
  const cfg = CAT_CONFIG[cat];
  const label = cfg?.label || cat;
  const pattern = cfg?.pattern || '';
  const h = small ? 300 : 300;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="${h}" viewBox="0 0 400 ${h}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0f1e"/>
        <stop offset="100%" stop-color="#0e1728"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stop-color="rgba(255,107,0,0.15)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
      </radialGradient>
    </defs>
    <rect width="400" height="${h}" fill="url(#bg)"/>
    <rect width="400" height="${h}" fill="url(#glow)"/>
    <circle cx="40" cy="40" r="65" fill="rgba(255,107,0,0.04)"/>
    <circle cx="360" cy="${h - 40}" r="80" fill="rgba(255,154,60,0.04)"/>
    ${pattern}
    <rect x="0" y="${h - 42}" width="400" height="42" fill="rgba(0,0,0,0.5)"/>
    <text x="200" y="${h - 16}" text-anchor="middle" font-family="Vazirmatn, Tahoma, sans-serif"
      font-weight="700" font-size="17" fill="#FF9A3C">${label}</text>
  </svg>`;

  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

// ─── Public API ─────────────────────────────────────────────────────────────

/** تصویر کتگوری برای گرید کتگوری‌ها */
export function getCategoryImage(category?: string): string {
  const cat = (category || '').toLowerCase();
  return buildSVG(CAT_CONFIG[cat] ? cat : 'hamneshin', true);
}

/** تصویر رویداد برای کارت‌های رویداد */
export function getEventImage(category?: string, eventId?: string, fallback?: string): string {
  const cat = (category || '').toLowerCase();
  return buildSVG(CAT_CONFIG[cat] ? cat : 'hamneshin');
}

export function getTopicImage(topic: string): string {
  return getEventImage(topic);
}

export function getEventImageFallback(category?: string): string {
  return getEventImage(category);
}
