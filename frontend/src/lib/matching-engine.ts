/**
 * matching-engine.ts — الگوریتم مچینگ هوشمند
 * بر اساس تست‌ها و رزروهای کاربر، مشکلات و علایق رو تشخیص میده
 * و ایونت و روانشناس مناسب پیشنهاد میده
 */

/* ─── تایپ‌ها ──────────────────────────────────────────── */
export interface UserProfile {
  city?: string;
  mbtiType?: string;
  testResults?: Record<string, { score: number; label: string }>;
  bookingHistory?: { eventCategory: string; count: number }[];
  interests?: string[];
}

export interface MatchedEvent {
  categoryId: string;
  categoryTitle: string;
  matchScore: number;
  reason: string;
}

export interface MatchedTherapist {
  type: "ham-ravan" | "ham-ziste";
  title: string;
  matchScore: number;
  reason: string;
  topics: string[];
}

/* ─── نگاشت تست‌ها به مشکلات ──────────────────────── */
const TEST_PROBLEM_MAP: Record<string, { problem: string; relatedEvents: string[]; therapy: ("ham-ravan" | "ham-ziste")[] }> = {
  phq9: {
    problem: "افسردگی",
    relatedEvents: ["hamneshin", "hampa", "hamghadam", "hamvarzesh", "hamhonar"],
    therapy: ["ham-ravan", "ham-ziste"],
  },
  gad7: {
    problem: "اضطراب",
    relatedEvents: ["hamneshin", "hampa", "hamvarzesh", "hamsohbat"],
    therapy: ["ham-ravan", "ham-ziste"],
  },
  dass21: {
    problem: "استرس و فشار روانی",
    relatedEvents: ["hampa", "hamvarzesh", "hamneshin", "hamhonar", "hamghesse"],
    therapy: ["ham-ravan", "ham-ziste"],
  },
  love_languages: {
    problem: "نیازهای عاطفی",
    relatedEvents: ["hamneshin", "hamsohbat", "hamgharar"],
    therapy: ["ham-ravan"],
  },
  attachment: {
    problem: "مشکلات دلبستگی",
    relatedEvents: ["hamsohbat", "hamneshin", "hamgharar"],
    therapy: ["ham-ravan", "ham-ziste"],
  },
  neo_ffi: {
    problem: "خودشناسی شخصیتی",
    relatedEvents: ["hamfekr", "hamamooz", "hamghesse"],
    therapy: ["ham-ravan"],
  },
  erq: {
    problem: "مدیریت هیجان",
    relatedEvents: ["hamsohbat", "hamfekr", "hamvarzesh"],
    therapy: ["ham-ravan", "ham-ziste"],
  },
  iri: {
    problem: "همدلی و ارتباط",
    relatedEvents: ["hamsohbat", "hamneshin", "hamghesse", "hamgharar"],
    therapy: ["ham-ziste"],
  },
  conflict: {
    problem: "حل تعارض",
    relatedEvents: ["hamsohbat", "hamfekr", "hamkar"],
    therapy: ["ham-ravan", "ham-ziste"],
  },
  isi: {
    problem: "مشکلات خواب",
    relatedEvents: ["hampa", "hamvarzesh", "hamghadam"],
    therapy: ["ham-ravan"],
  },
  asrs: {
    problem: "نقص توجه / بیش‌فعالی",
    relatedEvents: ["hambazi", "hamvarzesh", "hamteymi"],
    therapy: ["ham-ravan"],
  },
  pcl5: {
    problem: "تروما و استرس پس‌سانحه",
    relatedEvents: ["hamneshin", "hamghesse", "hamhonar"],
    therapy: ["ham-ravan", "ham-ziste"],
  },
  bdi2: {
    problem: "افسردگی بالینی",
    relatedEvents: ["hampa", "hamvarzesh", "hamhonar", "hamneshin"],
    therapy: ["ham-ravan"],
  },
  bai: {
    problem: "اضطراب بالینی",
    relatedEvents: ["hampa", "hamvarzesh", "hamsohbat"],
    therapy: ["ham-ravan"],
  },
  mdq: {
    problem: "اختلال خلقی",
    relatedEvents: ["hamneshin", "hamhonar", "hamvarzesh"],
    therapy: ["ham-ravan"],
  },
  ybocs: {
    problem: "وسواس",
    relatedEvents: ["hamfekr", "hamghesse", "hamamooz"],
    therapy: ["ham-ravan"],
  },
  gottman: {
    problem: "مشکلات ارتباطی",
    relatedEvents: ["hamsohbat", "hamgharar", "hamneshin"],
    therapy: ["ham-ravan", "ham-ziste"],
  },
  sexual_compat: {
    problem: "مسائل صمیمیت",
    relatedEvents: ["hamsohbat", "hamgharar"],
    therapy: ["ham-ravan"],
  },
};

/* ─── نگاشت MBTI به ایونت‌ها ──────────────────────── */
const MBTI_EVENT_MAP: Record<string, string[]> = {
  E: ["hamneshin", "hambazi", "hamteymi", "hamgharar", "hamvarzesh"],
  I: ["hamsohbat", "hamghesse", "hamfekr", "hamhonar", "hamamooz"],
  N: ["hamfekr", "hamvision", "hamamooz", "hamghesse"],
  S: ["hambazi", "hamvarzesh", "hampa", "hamghadam"],
  T: ["hamfekr", "hamkar", "hamamooz"],
  F: ["hamsohbat", "hamneshin", "hamghesse", "hamhonar"],
  J: ["hamkar", "hamamooz", "hamgharar"],
  P: ["hambazi", "hampa", "hamvision", "hamhonar"],
};

/* ─── عناوین فارسی ایونت‌ها ──────────────────────── */
const EVENT_TITLES: Record<string, string> = {
  hambazi: "هم‌بازی",
  hamneshin: "همنشین",
  hamgharar: "هم‌قرار",
  hamsohbat: "هم‌صحبت",
  hampa: "هم‌پا",
  hamghadam: "هم‌قدم",
  hamamooz: "هم‌آموز",
  hamkar: "همکار",
  hamfekr: "هم‌فکر",
  hamteymi: "هم‌تیمی",
  hamghesse: "هم‌قصه",
  hamvision: "هم‌ویژن",
  hamhonar: "هم‌هنر",
  hamvarzesh: "هم‌ورزش",
  hamnegah: "هم‌نگاه",
  hamziste: "هم‌زیسته",
  hamravan: "هم‌روان",
  dustravan: "دوست روانشناس",
};

/* ─── الگوریتم اصلی ──────────────────────────────── */
export function getSmartRecommendations(profile: UserProfile): {
  events: MatchedEvent[];
  therapists: MatchedTherapist[];
  detectedProblems: string[];
  detectedInterests: string[];
} {
  const eventScores: Record<string, { score: number; reasons: string[] }> = {};
  const therapyScores: Record<string, { score: number; reasons: string[]; topics: string[] }> = {};
  const detectedProblems: string[] = [];
  const detectedInterests: string[] = [];

  function addEventScore(catId: string, score: number, reason: string) {
    if (!eventScores[catId]) eventScores[catId] = { score: 0, reasons: [] };
    eventScores[catId].score += score;
    eventScores[catId].reasons.push(reason);
  }

  function addTherapyScore(type: "ham-ravan" | "ham-ziste", score: number, reason: string, topic: string) {
    if (!therapyScores[type]) therapyScores[type] = { score: 0, reasons: [], topics: [] };
    therapyScores[type].score += score;
    therapyScores[type].reasons.push(reason);
    if (!therapyScores[type].topics.includes(topic)) therapyScores[type].topics.push(topic);
  }

  // ① تحلیل نتایج تست‌ها
  if (profile.testResults) {
    for (const [testId, result] of Object.entries(profile.testResults)) {
      const mapping = TEST_PROBLEM_MAP[testId];
      if (!mapping) continue;

      const severity = result.label;
      const isModerateOrHigher = ["متوسط", "نسبتاً شدید", "شدید", "بسیار شدید", "احتمال متوسط", "احتمال بالا", "بحرانی", "نیازمند بهبود"]
        .includes(severity);

      if (isModerateOrHigher) {
        detectedProblems.push(mapping.problem);
        const weight = severity.includes("شدید") ? 30 : 20;
        mapping.relatedEvents.forEach((ev) => addEventScore(ev, weight, `تست ${testId}: ${mapping.problem}`));
        mapping.therapy.forEach((t) => addTherapyScore(t, weight, `${mapping.problem} (${severity})`, mapping.problem));
      } else if (severity !== "طبیعی" && severity !== "حداقل") {
        mapping.relatedEvents.forEach((ev) => addEventScore(ev, 10, `تست ${testId}: ${mapping.problem} (${severity})`));
      }
    }
  }

  // ② تحلیل MBTI
  if (profile.mbtiType) {
    for (const letter of profile.mbtiType.split("")) {
      const events = MBTI_EVENT_MAP[letter];
      if (events) {
        events.forEach((ev) => addEventScore(ev, 8, `تیپ ${profile.mbtiType}: ترجیح ${letter}`));
      }
    }
  }

  // ③ تحلیل تاریخچه رزرو (علایق تکرارشونده)
  if (profile.bookingHistory) {
    for (const booking of profile.bookingHistory) {
      if (booking.count >= 2) {
        detectedInterests.push(EVENT_TITLES[booking.eventCategory] || booking.eventCategory);
        addEventScore(booking.eventCategory, 15 * booking.count, `علاقه‌مندی (${booking.count} رزرو قبلی)`);
      }
    }
  }

  // ④ علایق پروفایل
  if (profile.interests) {
    for (const interest of profile.interests) {
      const lower = interest.toLowerCase();
      if (lower.includes("ورزش")) addEventScore("hamvarzesh", 12, "علاقه: ورزش");
      if (lower.includes("کتاب") || lower.includes("مطالعه")) addEventScore("hamghesse", 12, "علاقه: مطالعه");
      if (lower.includes("هنر") || lower.includes("نقاشی")) addEventScore("hamhonar", 12, "علاقه: هنر");
      if (lower.includes("بازی")) addEventScore("hambazi", 12, "علاقه: بازی");
      if (lower.includes("طبیعت") || lower.includes("کوه")) { addEventScore("hampa", 12, "علاقه: طبیعت"); addEventScore("hamghadam", 12, "علاقه: طبیعت"); }
      if (lower.includes("موسیقی")) addEventScore("hamhonar", 10, "علاقه: موسیقی");
      if (lower.includes("آشپزی")) addEventScore("hamneshin", 10, "علاقه: آشپزی");
    }
  }

  // ⑤ مرتب‌سازی و خروجی
  const maxEventScore = Math.max(1, ...Object.values(eventScores).map((e) => e.score));
  const events: MatchedEvent[] = Object.entries(eventScores)
    .map(([catId, data]) => ({
      categoryId: catId,
      categoryTitle: EVENT_TITLES[catId] || catId,
      matchScore: Math.min(100, Math.round((data.score / maxEventScore) * 100)),
      reason: data.reasons[0] || "",
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);

  const therapists: MatchedTherapist[] = Object.entries(therapyScores)
    .map(([type, data]) => ({
      type: type as "ham-ravan" | "ham-ziste",
      title: type === "ham-ravan" ? "هم‌روان (مشاوره فردی)" : "هم‌زیسته (گروه‌درمانی)",
      matchScore: Math.min(100, data.score),
      reason: data.reasons[0] || "",
      topics: data.topics,
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  return { events, therapists, detectedProblems, detectedInterests };
}

/* ─── فیلتر ایونت بر اساس شهر ───────────────────── */
export function filterEventsByCity<T extends { city?: string; location?: string }>(
  events: T[],
  userCity: string | null | undefined,
): T[] {
  if (!userCity) return events;
  const city = userCity.trim().toLowerCase();
  if (!city) return events;

  return events.filter((ev) => {
    const evCity = (ev.city || "").toLowerCase();
    const evLocation = (ev.location || "").toLowerCase();
    return evCity.includes(city) || evLocation.includes(city) || city.includes(evCity) || !evCity;
  });
}
