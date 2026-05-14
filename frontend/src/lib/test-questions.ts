/**
 * test-questions.ts — بانک سوالات ۲۵ تست روانشناسی
 * هر تست شامل سوالات کامل، گزینه‌ها و نمره‌گذاری
 */

export interface TestOption {
  id: string;
  text: string;
  score: number;
}

export interface TestQuestion {
  id: number;
  text: string;
  options: TestOption[];
}

export interface TestDefinition {
  id: string;
  name: string;
  fullName: string;
  category: string;
  construct: string;
  description: string;
  instructions: string;
  questions: TestQuestion[];
  scoring: {
    ranges: { min: number; max: number; label: string; description: string }[];
    maxScore: number;
  };
}

/* ═══════════════════════════════════════════════════════
   ❶ PHQ-9 — پرسشنامه سلامت بیمار (افسردگی)
   ═══════════════════════════════════════════════════════ */
const PHQ9_OPTIONS: TestOption[] = [
  { id: "0", text: "اصلاً", score: 0 },
  { id: "1", text: "چند روز", score: 1 },
  { id: "2", text: "بیشتر از نیمی از روزها", score: 2 },
  { id: "3", text: "تقریباً هر روز", score: 3 },
];

const PHQ9: TestDefinition = {
  id: "phq9", name: "PHQ-9", fullName: "پرسشنامه سلامت بیمار — افسردگی",
  category: "mental_health", construct: "افسردگی",
  description: "غربالگری سریع و معتبر برای سنجش شدت علائم افسردگی",
  instructions: "در ۲ هفته گذشته، هر یک از مشکلات زیر چقدر شما را آزار داده است؟",
  questions: [
    { id: 1, text: "علاقه یا لذت کم از انجام کارها", options: PHQ9_OPTIONS },
    { id: 2, text: "احساس ناامیدی، افسردگی یا ناراحتی", options: PHQ9_OPTIONS },
    { id: 3, text: "مشکل در خوابیدن، بیدار ماندن یا خواب زیاد", options: PHQ9_OPTIONS },
    { id: 4, text: "احساس خستگی یا کم‌انرژی بودن", options: PHQ9_OPTIONS },
    { id: 5, text: "بی‌اشتهایی یا پرخوری", options: PHQ9_OPTIONS },
    { id: 6, text: "احساس بد درباره خودتان — یا اینکه شکست‌خورده هستید یا خانواده‌تان را ناامید کرده‌اید", options: PHQ9_OPTIONS },
    { id: 7, text: "مشکل در تمرکز روی کارها مثلاً خواندن روزنامه یا تماشای تلویزیون", options: PHQ9_OPTIONS },
    { id: 8, text: "حرکت یا صحبت کردن به قدری آهسته که دیگران متوجه شده‌اند — یا برعکس، بی‌قراری و جنب‌وجوش بیش از حد معمول", options: PHQ9_OPTIONS },
    { id: 9, text: "فکر کردن به اینکه بهتر است بمیرید یا به خودتان آسیب بزنید", options: PHQ9_OPTIONS },
  ],
  scoring: {
    maxScore: 27,
    ranges: [
      { min: 0, max: 4, label: "حداقل", description: "علائم افسردگی ناچیز است" },
      { min: 5, max: 9, label: "خفیف", description: "افسردگی خفیف — مراقبت از خود توصیه می‌شود" },
      { min: 10, max: 14, label: "متوسط", description: "افسردگی متوسط — مشاوره با متخصص پیشنهاد می‌شود" },
      { min: 15, max: 19, label: "نسبتاً شدید", description: "نیاز به مداخله تخصصی دارد" },
      { min: 20, max: 27, label: "شدید", description: "نیاز فوری به مراجعه به متخصص" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ❷ GAD-7 — مقیاس اضطراب فراگیر
   ═══════════════════════════════════════════════════════ */
const GAD7_OPTIONS = PHQ9_OPTIONS;

const GAD7: TestDefinition = {
  id: "gad7", name: "GAD-7", fullName: "مقیاس اضطراب فراگیر",
  category: "mental_health", construct: "اضطراب",
  description: "ارزیابی میزان و شدت اضطراب فراگیر در زندگی روزمره",
  instructions: "در ۲ هفته گذشته، هر یک از مشکلات زیر چقدر شما را آزار داده است؟",
  questions: [
    { id: 1, text: "احساس عصبانیت، اضطراب یا لبه پرتگاه بودن", options: GAD7_OPTIONS },
    { id: 2, text: "ناتوانی در کنترل یا توقف نگرانی", options: GAD7_OPTIONS },
    { id: 3, text: "نگرانی بیش از حد درباره چیزهای مختلف", options: GAD7_OPTIONS },
    { id: 4, text: "مشکل در استراحت کردن و آرام بودن", options: GAD7_OPTIONS },
    { id: 5, text: "بی‌قراری شدید به‌طوری‌که نشستن سخت شده", options: GAD7_OPTIONS },
    { id: 6, text: "به‌راحتی عصبانی یا تحریک‌پذیر شدن", options: GAD7_OPTIONS },
    { id: 7, text: "احساس ترس، انگار اتفاق وحشتناکی قرار است بیفتد", options: GAD7_OPTIONS },
  ],
  scoring: {
    maxScore: 21,
    ranges: [
      { min: 0, max: 4, label: "حداقل", description: "اضطراب ناچیز" },
      { min: 5, max: 9, label: "خفیف", description: "اضطراب خفیف" },
      { min: 10, max: 14, label: "متوسط", description: "مشاوره توصیه می‌شود" },
      { min: 15, max: 21, label: "شدید", description: "نیاز به مداخله تخصصی" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ❸ DASS-21 — افسردگی، اضطراب و استرس
   ═══════════════════════════════════════════════════════ */
const DASS_OPTIONS: TestOption[] = [
  { id: "0", text: "اصلاً", score: 0 },
  { id: "1", text: "کمی / گاهی", score: 1 },
  { id: "2", text: "تا حد قابل توجهی / اغلب", score: 2 },
  { id: "3", text: "خیلی زیاد / تقریباً همیشه", score: 3 },
];

const DASS21: TestDefinition = {
  id: "dass21", name: "DASS-21", fullName: "مقیاس افسردگی، اضطراب و استرس",
  category: "mental_health", construct: "افسردگی · اضطراب · استرس",
  description: "سنجش همزمان سه حوزه اصلی سلامت روان",
  instructions: "لطفاً هر عبارت را بخوانید و مشخص کنید در هفته گذشته چقدر شامل حال شما بوده است.",
  questions: [
    { id: 1, text: "آرام شدن برایم سخت بود (استرس)", options: DASS_OPTIONS },
    { id: 2, text: "متوجه خشکی دهانم شدم (اضطراب)", options: DASS_OPTIONS },
    { id: 3, text: "به نظر نمی‌رسید اصلاً احساس مثبتی داشته باشم (افسردگی)", options: DASS_OPTIONS },
    { id: 4, text: "مشکل تنفسی داشتم مثل نفس‌نفس زدن بدون فعالیت بدنی (اضطراب)", options: DASS_OPTIONS },
    { id: 5, text: "شروع کردن کارها برایم مشکل بود (افسردگی)", options: DASS_OPTIONS },
    { id: 6, text: "تمایل داشتم به موقعیت‌ها واکنش بیش از حد نشان دهم (استرس)", options: DASS_OPTIONS },
    { id: 7, text: "لرزش داشتم مثلاً در دست‌ها (اضطراب)", options: DASS_OPTIONS },
    { id: 8, text: "احساس می‌کردم انرژی عصبی زیادی مصرف می‌کنم (استرس)", options: DASS_OPTIONS },
    { id: 9, text: "نگران موقعیت‌هایی بودم که ممکن بود دستپاچه شوم (اضطراب)", options: DASS_OPTIONS },
    { id: 10, text: "احساس می‌کردم چیزی نیست که منتظرش باشم (افسردگی)", options: DASS_OPTIONS },
    { id: 11, text: "خودم را بی‌قرار می‌دیدم (استرس)", options: DASS_OPTIONS },
    { id: 12, text: "آرام شدن برایم مشکل بود (استرس)", options: DASS_OPTIONS },
    { id: 13, text: "احساس غمگینی و افسردگی می‌کردم (افسردگی)", options: DASS_OPTIONS },
    { id: 14, text: "نسبت به هر چیزی که مانع کارم می‌شد بی‌تاب بودم (استرس)", options: DASS_OPTIONS },
    { id: 15, text: "احساس می‌کردم نزدیک است وحشت‌زده شوم (اضطراب)", options: DASS_OPTIONS },
    { id: 16, text: "نمی‌توانستم نسبت به چیزی مشتاق باشم (افسردگی)", options: DASS_OPTIONS },
    { id: 17, text: "احساس می‌کردم ارزش زیادی به عنوان یک فرد ندارم (افسردگی)", options: DASS_OPTIONS },
    { id: 18, text: "احساس می‌کردم خیلی حساس شده‌ام (استرس)", options: DASS_OPTIONS },
    { id: 19, text: "ضربان قلبم بدون فعالیت بدنی تند می‌شد (اضطراب)", options: DASS_OPTIONS },
    { id: 20, text: "بدون دلیل خاصی احساس ترس می‌کردم (اضطراب)", options: DASS_OPTIONS },
    { id: 21, text: "احساس می‌کردم زندگی بی‌معنی است (افسردگی)", options: DASS_OPTIONS },
  ],
  scoring: {
    maxScore: 63,
    ranges: [
      { min: 0, max: 14, label: "طبیعی", description: "سطح سلامت روان در حد طبیعی" },
      { min: 15, max: 25, label: "خفیف", description: "استرس خفیف — مدیریت استرس توصیه می‌شود" },
      { min: 26, max: 40, label: "متوسط", description: "مشاوره با متخصص پیشنهاد می‌شود" },
      { min: 41, max: 63, label: "شدید", description: "نیاز به مداخله تخصصی فوری" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ❹ Love Languages — زبان‌های عشق چپمن
   ═══════════════════════════════════════════════════════ */
const LL_OPTIONS = (a: string, b: string): TestOption[] => [
  { id: "a", text: a, score: 1 },
  { id: "b", text: b, score: 2 },
];

const LOVE_LANGUAGES: TestDefinition = {
  id: "love_languages", name: "Love Languages", fullName: "زبان‌های عشق چپمن",
  category: "relationship", construct: "ترجیحات دریافت محبت",
  description: "کشف اینکه چه نوع محبتی برایت بیشترین معنا دارد",
  instructions: "در هر جفت، آن جمله‌ای را انتخاب کنید که بیشتر به شما نزدیک است.",
  questions: [
    { id: 1, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("دریافت نامه یا پیام محبت‌آمیز", "دریافت یک بغل گرم") },
    { id: 2, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("وقت اختصاصی با فردی خاص", "دریافت یک هدیه فکرشده") },
    { id: 3, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("کمک در کارهای روزانه", "شنیدن جمله «دوستت دارم»") },
    { id: 4, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("نشستن کنار هم و گفتگو", "دریافت هدیه‌ای غیرمنتظره") },
    { id: 5, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("شنیدن تمجید و تشویق", "تماس فیزیکی مثل دست در دست") },
    { id: 6, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("قدم زدن دونفره", "یکی برایتان غذا درست کند") },
    { id: 7, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("دریافت یک یادداشت عاشقانه", "نوازش موها و دست‌ها") },
    { id: 8, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("تعمیر وسیله خراب توسط عزیزتان", "دریافت گل و هدیه") },
    { id: 9, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("برنامه سفر دونفره", "شنیدن «ممنونم که هستی»") },
    { id: 10, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("گوش دادن فعالانه به حرف‌هایتان", "بغل طولانی") },
    { id: 11, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("شنیدن «به تو افتخار می‌کنم»", "کمک در شستن ظرف‌ها") },
    { id: 12, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("یک هدیه کوچک ولی معنادار", "تماشای فیلم با هم") },
    { id: 13, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("تماس دست هنگام قدم‌زدن", "شنیدن «تو خیلی مهمی»") },
    { id: 14, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("آشپزی با هم", "دریافت یک کتاب دلخواه") },
    { id: 15, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("شنیدن حرف‌های قدردانی", "ماساژ بعد از یک روز سخت") },
    { id: 16, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("وقت بدون موبایل با هم", "کسی خرید هفتگی را انجام دهد") },
    { id: 17, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("دریافت عکس یادگاری با پیام", "دست‌به‌دست نشستن") },
    { id: 18, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("کمک در نظافت خانه", "شنیدن «همیشه کنارتم»") },
    { id: 19, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("یک شام رمانتیک دونفره", "دریافت جعبه شکلات") },
    { id: 20, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("شنیدن «تو بهترین اتفاق زندگیمی»", "نوازش آرامش‌بخش") },
    { id: 21, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("پیاده‌روی طولانی با هم", "شستن ماشین توسط عزیزتان") },
    { id: 22, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("یک هدیه سورپرایز", "تماس چشمی عمیق و گرم") },
    { id: 23, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("شنیدن «ازت ممنونم»", "قدم زدن و حرف زدن") },
    { id: 24, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("کمک در بسته‌بندی برای سفر", "بوسه صبحگاهی") },
    { id: 25, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("تماشای غروب با هم", "دریافت گل بدون مناسبت") },
    { id: 26, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("شنیدن «تو خیلی قوی هستی»", "دست‌گرفتن هنگام فیلم دیدن") },
    { id: 27, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("آماده‌کردن صبحانه توسط عزیزتان", "یک ادکلن هدیه") },
    { id: 28, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("بازی کردن با هم", "شنیدن «تو الهام‌بخشمی»") },
    { id: 29, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("سفر کوتاه دونفره", "بغل‌کردن بدون حرف") },
    { id: 30, text: "ترجیح شما کدام است؟", options: LL_OPTIONS("شنیدن «همه‌چیز درست می‌شه»", "کمک در کارهای اداری") },
  ],
  scoring: {
    maxScore: 60,
    ranges: [
      { min: 0, max: 15, label: "کلمات تأیید", description: "زبان عشق اصلی شما شنیدن حرف‌های محبت‌آمیز است" },
      { min: 16, max: 30, label: "وقت باکیفیت", description: "زبان عشق اصلی شما حضور و توجه اختصاصی است" },
      { min: 31, max: 45, label: "هدیه و لمس", description: "زبان عشق شما ترکیبی از هدیه و تماس فیزیکی است" },
      { min: 46, max: 60, label: "خدمت‌رسانی", description: "زبان عشق اصلی شما کمک و خدمت عملی است" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ❺ ECR-R — سبک دلبستگی بزرگسال
   ═══════════════════════════════════════════════════════ */
const ECR_OPTIONS: TestOption[] = [
  { id: "1", text: "کاملاً مخالفم", score: 1 },
  { id: "2", text: "مخالفم", score: 2 },
  { id: "3", text: "تاحدی مخالفم", score: 3 },
  { id: "4", text: "نه موافق نه مخالف", score: 4 },
  { id: "5", text: "تاحدی موافقم", score: 5 },
  { id: "6", text: "موافقم", score: 6 },
  { id: "7", text: "کاملاً موافقم", score: 7 },
];

const ECR_R: TestDefinition = {
  id: "attachment", name: "ECR-R", fullName: "سبک دلبستگی بزرگسال",
  category: "relationship", construct: "سبک دلبستگی",
  description: "درک الگوی دلبستگی در روابط عاطفی بزرگسالانه",
  instructions: "هر عبارت را بخوانید و میزان موافقت خود را مشخص کنید.",
  questions: [
    { id: 1, text: "نگرانم که شریک عاطفی‌ام واقعاً مرا دوست نداشته باشد", options: ECR_OPTIONS },
    { id: 2, text: "ترجیح می‌دهم احساساتم را با شریکم در میان نگذارم", options: ECR_OPTIONS },
    { id: 3, text: "اغلب نگرانم که شریکم بخواهد مرا ترک کند", options: ECR_OPTIONS },
    { id: 4, text: "در نزدیک شدن به دیگران راحت نیستم", options: ECR_OPTIONS },
    { id: 5, text: "وقتی شریکم کنارم نیست، نگرانم که به کسی دیگر علاقه‌مند شود", options: ECR_OPTIONS },
    { id: 6, text: "ترجیح می‌دهم خیلی صمیمی نشوم", options: ECR_OPTIONS },
    { id: 7, text: "نگرانم اگر خودم واقعی‌ام را نشان دهم طرد شوم", options: ECR_OPTIONS },
    { id: 8, text: "وابسته شدن به دیگران برایم راحت نیست", options: ECR_OPTIONS },
    { id: 9, text: "دلم می‌خواهد خیلی به شریکم نزدیک شوم ولی او عقب می‌کشد", options: ECR_OPTIONS },
    { id: 10, text: "وقتی احساساتم شدید می‌شود ترجیح می‌دهم تنها باشم", options: ECR_OPTIONS },
    { id: 11, text: "نیاز شدیدی به اطمینان‌خاطر از محبت شریکم دارم", options: ECR_OPTIONS },
    { id: 12, text: "گاهی حس می‌کنم دیگران مرا وادار می‌کنند بیشتر از حدم صمیمی شوم", options: ECR_OPTIONS },
    { id: 13, text: "نگرانم که به اندازه کافی خوب نباشم", options: ECR_OPTIONS },
    { id: 14, text: "تکیه کردن به شریکم برایم سخت است", options: ECR_OPTIONS },
    { id: 15, text: "وقتی شریکم توجه کمتری نشان می‌دهد، عصبانی یا ناراحت می‌شوم", options: ECR_OPTIONS },
    { id: 16, text: "ترجیح می‌دهم مستقل باشم و وابسته نشوم", options: ECR_OPTIONS },
    { id: 17, text: "گاهی احساس می‌کنم دیگران مرا به اندازه‌ای که من دوستشان دارم دوست ندارند", options: ECR_OPTIONS },
    { id: 18, text: "صحبت درباره احساسات عمیقم برایم ناراحت‌کننده است", options: ECR_OPTIONS },
  ],
  scoring: {
    maxScore: 126,
    ranges: [
      { min: 0, max: 40, label: "ایمن", description: "سبک دلبستگی ایمن — روابط سالم و متعادل" },
      { min: 41, max: 70, label: "اضطرابی", description: "دلبستگی اضطرابی — نیاز به اطمینان بیشتر" },
      { min: 71, max: 100, label: "اجتنابی", description: "دلبستگی اجتنابی — تمایل به فاصله‌گرفتن" },
      { min: 101, max: 126, label: "آشفته", description: "دلبستگی آشفته — مشاوره تخصصی توصیه می‌شود" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ❻ NEO-FFI — پنج عامل بزرگ شخصیت (فرم کوتاه ۳۰ سوالی)
   ═══════════════════════════════════════════════════════ */
const NEO_OPTIONS: TestOption[] = [
  { id: "1", text: "کاملاً مخالفم", score: 0 },
  { id: "2", text: "مخالفم", score: 1 },
  { id: "3", text: "نظری ندارم", score: 2 },
  { id: "4", text: "موافقم", score: 3 },
  { id: "5", text: "کاملاً موافقم", score: 4 },
];

const NEO_FFI: TestDefinition = {
  id: "neo_ffi", name: "NEO-FFI", fullName: "پنج عامل بزرگ شخصیت",
  category: "personality", construct: "Big Five",
  description: "معتبرترین مدل شخصیتی جهان",
  instructions: "هر عبارت را بخوانید و میزان موافقت خود را مشخص کنید.",
  questions: [
    // روان‌رنجوری (N)
    { id: 1, text: "اغلب احساس تنش و فشار روانی می‌کنم", options: NEO_OPTIONS },
    { id: 2, text: "گاهی احساس ناامنی و بی‌ارزشی می‌کنم", options: NEO_OPTIONS },
    { id: 3, text: "بعضی وقت‌ها آنقدر خجالت می‌کشم که دلم می‌خواهد خودم را پنهان کنم", options: NEO_OPTIONS },
    { id: 4, text: "به‌ندرت احساس تنهایی یا غمگینی می‌کنم", options: NEO_OPTIONS },
    { id: 5, text: "اغلب احساس ناتوانی می‌کنم و دلم می‌خواهد کسی مشکلاتم را حل کند", options: NEO_OPTIONS },
    { id: 6, text: "وقتی تحت فشار زیادی هستم، گاهی احساس می‌کنم دارم از هم می‌پاشم", options: NEO_OPTIONS },
    // برون‌گرایی (E)
    { id: 7, text: "از بودن در جمع لذت می‌برم", options: NEO_OPTIONS },
    { id: 8, text: "خنده و شادی زیادی در زندگی‌ام وجود دارد", options: NEO_OPTIONS },
    { id: 9, text: "آدم خیلی فعال و پرانرژی هستم", options: NEO_OPTIONS },
    { id: 10, text: "ترجیح می‌دهم کارها را به‌تنهایی انجام دهم", options: NEO_OPTIONS },
    { id: 11, text: "معمولاً فرد خوش‌بین و امیدواری هستم", options: NEO_OPTIONS },
    { id: 12, text: "در جمع‌ها معمولاً حرف اول را می‌زنم", options: NEO_OPTIONS },
    // گشودگی (O)
    { id: 13, text: "کنجکاوی ذهنی زیادی دارم", options: NEO_OPTIONS },
    { id: 14, text: "از تجربه‌های هنری و زیبایی‌شناسی لذت می‌برم", options: NEO_OPTIONS },
    { id: 15, text: "معمولاً ایده‌های نو و غیرمعمول را امتحان می‌کنم", options: NEO_OPTIONS },
    { id: 16, text: "تغییر و تنوع برایم مهم است", options: NEO_OPTIONS },
    { id: 17, text: "علاقه‌ای به بحث‌های فلسفی ندارم", options: NEO_OPTIONS },
    { id: 18, text: "تخیل قوی و ذهن فعالی دارم", options: NEO_OPTIONS },
    // توافق‌پذیری (A)
    { id: 19, text: "سعی می‌کنم با همه مهربان و با ملاحظه باشم", options: NEO_OPTIONS },
    { id: 20, text: "معمولاً به دیگران اعتماد می‌کنم", options: NEO_OPTIONS },
    { id: 21, text: "بعضی‌ها فکر می‌کنند خودخواه و خودمحورم", options: NEO_OPTIONS },
    { id: 22, text: "ترجیح می‌دهم با دیگران همکاری کنم نه رقابت", options: NEO_OPTIONS },
    { id: 23, text: "اگر کسی بدرفتاری کند، سعی می‌کنم ببخشم", options: NEO_OPTIONS },
    { id: 24, text: "در مورد نیت دیگران مشکوکم", options: NEO_OPTIONS },
    // وظیفه‌شناسی (C)
    { id: 25, text: "کارهایم را به‌خوبی سازمان‌دهی می‌کنم", options: NEO_OPTIONS },
    { id: 26, text: "تلاش می‌کنم هر کاری را درست و دقیق انجام دهم", options: NEO_OPTIONS },
    { id: 27, text: "گاهی بدون فکر عمل می‌کنم", options: NEO_OPTIONS },
    { id: 28, text: "اهداف روشنی دارم و برنامه‌ریزی‌شده به سمتشان حرکت می‌کنم", options: NEO_OPTIONS },
    { id: 29, text: "خیلی منضبط و خودکنترل هستم", options: NEO_OPTIONS },
    { id: 30, text: "وقتی کاری شروع می‌کنم، آن را تا آخر ادامه می‌دهم", options: NEO_OPTIONS },
  ],
  scoring: {
    maxScore: 120,
    ranges: [
      { min: 0, max: 30, label: "کم", description: "ویژگی‌های شخصیتی در حد پایین" },
      { min: 31, max: 60, label: "پایین‌تر از میانگین", description: "ویژگی‌ها پایین‌تر از حد متوسط" },
      { min: 61, max: 90, label: "بالاتر از میانگین", description: "ویژگی‌ها بالاتر از حد متوسط" },
      { min: 91, max: 120, label: "بالا", description: "ویژگی‌های شخصیتی در حد بالا" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ❼ ERQ — تنظیم هیجان
   ═══════════════════════════════════════════════════════ */
const ERQ: TestDefinition = {
  id: "erq", name: "ERQ", fullName: "پرسشنامه تنظیم هیجان",
  category: "personality", construct: "تنظیم هیجان",
  description: "بررسی سبک‌های مدیریت احساسات",
  instructions: "هر عبارت را بخوانید و میزان موافقت خود را مشخص کنید.",
  questions: [
    { id: 1, text: "وقتی می‌خواهم احساس مثبت بیشتری داشته باشم، نگاهم به موقعیت را تغییر می‌دهم", options: NEO_OPTIONS },
    { id: 2, text: "احساساتم را پیش خودم نگه می‌دارم", options: NEO_OPTIONS },
    { id: 3, text: "وقتی می‌خواهم کمتر احساس منفی داشته باشم، طرز فکرم درباره موقعیت را عوض می‌کنم", options: NEO_OPTIONS },
    { id: 4, text: "وقتی احساس مثبتی دارم آن را نشان می‌دهم", options: NEO_OPTIONS },
    { id: 5, text: "وقتی با موقعیت استرس‌زایی روبه‌رو هستم، سعی می‌کنم طوری به آن فکر کنم که آرام بمانم", options: NEO_OPTIONS },
    { id: 6, text: "احساساتم را کنترل می‌کنم و بیرون نمی‌ریزم", options: NEO_OPTIONS },
    { id: 7, text: "وقتی می‌خواهم احساس مثبت بیشتری داشته باشم، به چیزی متفاوت فکر می‌کنم", options: NEO_OPTIONS },
    { id: 8, text: "وقتی احساس منفی دارم سعی می‌کنم آن را نشان ندهم", options: NEO_OPTIONS },
    { id: 9, text: "وقتی می‌خواهم کمتر احساس منفی داشته باشم، موقعیت را از زاویه دیگری نگاه می‌کنم", options: NEO_OPTIONS },
    { id: 10, text: "وقتی احساس مثبت دارم مراقبم که نشان ندهم", options: NEO_OPTIONS },
  ],
  scoring: {
    maxScore: 40,
    ranges: [
      { min: 0, max: 10, label: "سرکوب‌گر", description: "تمایل به سرکوب احساسات" },
      { min: 11, max: 20, label: "متعادل", description: "تعادل نسبی در مدیریت هیجان" },
      { min: 21, max: 30, label: "بازارزیابی‌کننده", description: "تمایل به بازارزیابی شناختی" },
      { min: 31, max: 40, label: "فعال", description: "مدیریت فعال و سازگارانه هیجان" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ❽ ISI — شاخص شدت بی‌خوابی
   ═══════════════════════════════════════════════════════ */
const ISI_OPTIONS: TestOption[] = [
  { id: "0", text: "اصلاً", score: 0 },
  { id: "1", text: "خفیف", score: 1 },
  { id: "2", text: "متوسط", score: 2 },
  { id: "3", text: "شدید", score: 3 },
  { id: "4", text: "بسیار شدید", score: 4 },
];

const ISI: TestDefinition = {
  id: "isi", name: "ISI", fullName: "شاخص شدت بی‌خوابی",
  category: "mental_health", construct: "خواب",
  description: "ارزیابی کیفیت خواب و تأثیر آن بر عملکرد روزانه",
  instructions: "لطفاً شدت مشکلات خواب فعلی خود را در ۲ هفته اخیر مشخص کنید.",
  questions: [
    { id: 1, text: "مشکل در به‌خواب‌رفتن", options: ISI_OPTIONS },
    { id: 2, text: "مشکل در حفظ خواب (بیدار شدن‌های مکرر)", options: ISI_OPTIONS },
    { id: 3, text: "بیدار شدن زودتر از موعد صبح", options: ISI_OPTIONS },
    { id: 4, text: "رضایت از الگوی فعلی خواب", options: ISI_OPTIONS },
    { id: 5, text: "تأثیر مشکلات خواب بر عملکرد روزانه", options: ISI_OPTIONS },
    { id: 6, text: "میزان آشکار بودن مشکلات خواب برای دیگران", options: ISI_OPTIONS },
    { id: 7, text: "نگرانی درباره مشکلات خواب", options: ISI_OPTIONS },
  ],
  scoring: {
    maxScore: 28,
    ranges: [
      { min: 0, max: 7, label: "طبیعی", description: "بی‌خوابی بالینی وجود ندارد" },
      { min: 8, max: 14, label: "زیرآستانه", description: "بی‌خوابی خفیف" },
      { min: 15, max: 21, label: "متوسط", description: "بی‌خوابی متوسط — مشاوره توصیه می‌شود" },
      { min: 22, max: 28, label: "شدید", description: "بی‌خوابی شدید — نیاز به درمان" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ❾ ASRS — غربالگری ADHD بزرگسال
   ═══════════════════════════════════════════════════════ */
const ASRS_OPTIONS: TestOption[] = [
  { id: "0", text: "هرگز", score: 0 },
  { id: "1", text: "به‌ندرت", score: 1 },
  { id: "2", text: "گاهی", score: 2 },
  { id: "3", text: "اغلب", score: 3 },
  { id: "4", text: "خیلی اغلب", score: 4 },
];

const ASRS: TestDefinition = {
  id: "asrs", name: "ASRS", fullName: "مقیاس ADHD بزرگسال",
  category: "mental_health", construct: "ADHD",
  description: "غربالگری نقص توجه و بیش‌فعالی در بزرگسالان",
  instructions: "در ۶ ماه گذشته، هر مورد زیر چقدر برایتان مصداق داشته؟",
  questions: [
    { id: 1, text: "مشکل در تکمیل جزئیات نهایی یک پروژه", options: ASRS_OPTIONS },
    { id: 2, text: "مشکل در نظم‌دهی به کارها", options: ASRS_OPTIONS },
    { id: 3, text: "فراموش کردن قرارها و تعهدات", options: ASRS_OPTIONS },
    { id: 4, text: "اجتناب از شروع کارهایی که نیاز به فکر زیاد دارند", options: ASRS_OPTIONS },
    { id: 5, text: "بازی کردن با دست‌ها یا پاها هنگام نشستن طولانی", options: ASRS_OPTIONS },
    { id: 6, text: "احساس بیش‌فعالی یا اجبار به انجام کار", options: ASRS_OPTIONS },
    { id: 7, text: "اشتباهات بی‌دقتی در کارهای خسته‌کننده", options: ASRS_OPTIONS },
    { id: 8, text: "مشکل در حفظ توجه در کارها یا فعالیت‌های تفریحی", options: ASRS_OPTIONS },
    { id: 9, text: "مشکل در تمرکز وقتی کسی مستقیماً با شما صحبت می‌کند", options: ASRS_OPTIONS },
    { id: 10, text: "گم کردن وسایل ضروری", options: ASRS_OPTIONS },
    { id: 11, text: "حواس‌پرتی با محرک‌های بیرونی", options: ASRS_OPTIONS },
    { id: 12, text: "برخاستن از صندلی در جلسات", options: ASRS_OPTIONS },
    { id: 13, text: "احساس بی‌قراری داخلی", options: ASRS_OPTIONS },
    { id: 14, text: "مشکل در آرام بودن و استراحت در اوقات فراغت", options: ASRS_OPTIONS },
    { id: 15, text: "حرف زدن بیش از حد در موقعیت‌های اجتماعی", options: ASRS_OPTIONS },
    { id: 16, text: "تمام کردن جملات دیگران قبل از اتمام حرفشان", options: ASRS_OPTIONS },
    { id: 17, text: "مشکل در صبر کردن در نوبت", options: ASRS_OPTIONS },
    { id: 18, text: "قطع کردن صحبت یا مزاحمت دیگران", options: ASRS_OPTIONS },
  ],
  scoring: {
    maxScore: 72,
    ranges: [
      { min: 0, max: 16, label: "طبیعی", description: "علائم ADHD در حد طبیعی" },
      { min: 17, max: 35, label: "احتمال خفیف", description: "بعضی علائم وجود دارد" },
      { min: 36, max: 54, label: "احتمال متوسط", description: "ارزیابی تخصصی توصیه می‌شود" },
      { min: 55, max: 72, label: "احتمال بالا", description: "مراجعه به متخصص ضروری است" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ❿ IRI — شاخص واکنش‌پذیری بین‌فردی (همدلی) - فرم ۱۴ سوالی
   ═══════════════════════════════════════════════════════ */
const IRI: TestDefinition = {
  id: "iri", name: "IRI", fullName: "شاخص واکنش‌پذیری بین‌فردی",
  category: "relationship", construct: "همدلی",
  description: "سنجش ظرفیت همدلی شناختی و هیجانی",
  instructions: "هر عبارت را بخوانید و میزان موافقت خود را مشخص کنید.",
  questions: [
    { id: 1, text: "اغلب سعی می‌کنم مسائل را از دید دیگران ببینم", options: NEO_OPTIONS },
    { id: 2, text: "وقتی فیلم غمگین می‌بینم معمولاً گریه‌ام می‌گیرد", options: NEO_OPTIONS },
    { id: 3, text: "قبل از انتقاد از دیگران، سعی می‌کنم خودم را جای آنها بگذارم", options: NEO_OPTIONS },
    { id: 4, text: "وقتی کسی مورد بی‌عدالتی قرار می‌گیرد، دلسوزی زیادی احساس نمی‌کنم", options: NEO_OPTIONS },
    { id: 5, text: "در شرایط اضطراری معمولاً احساس ناراحتی و اضطراب می‌کنم", options: NEO_OPTIONS },
    { id: 6, text: "سعی می‌کنم هر دو طرف یک اختلاف‌نظر را درک کنم", options: NEO_OPTIONS },
    { id: 7, text: "وقتی کسی گریه می‌کند، خودم هم بغض می‌کنم", options: NEO_OPTIONS },
    { id: 8, text: "درک کردن اینکه چرا دیگران ناراحت شده‌اند برایم آسان است", options: NEO_OPTIONS },
    { id: 9, text: "وقتی یک داستان واقعی تأثیرگذار می‌خوانم، واکنش عاطفی شدیدی دارم", options: NEO_OPTIONS },
    { id: 10, text: "وقتی دوستم آسیب می‌بیند، من هم درد را احساس می‌کنم", options: NEO_OPTIONS },
    { id: 11, text: "به‌ندرت کاملاً در یک کتاب یا فیلم غرق می‌شوم", options: NEO_OPTIONS },
    { id: 12, text: "وقتی با فردی ناراحت مواجه می‌شوم، می‌خواهم کمکش کنم", options: NEO_OPTIONS },
    { id: 13, text: "وقتی دیگران را در حال بحث می‌بینم، سعی می‌کنم هر دو طرف را بفهمم", options: NEO_OPTIONS },
    { id: 14, text: "احساسات شدید دیگران روی من تأثیر می‌گذارد", options: NEO_OPTIONS },
  ],
  scoring: {
    maxScore: 56,
    ranges: [
      { min: 0, max: 14, label: "کم", description: "همدلی پایین" },
      { min: 15, max: 28, label: "متوسط", description: "همدلی متوسط" },
      { min: 29, max: 42, label: "بالا", description: "همدلی بالا" },
      { min: 43, max: 56, label: "بسیار بالا", description: "همدلی بسیار بالا" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ⓫ CRSI — سبک‌های حل تعارض
   ═══════════════════════════════════════════════════════ */
const CRSI: TestDefinition = {
  id: "conflict", name: "CRSI", fullName: "سبک‌های حل تعارض",
  category: "relationship", construct: "تعارض",
  description: "شناخت الگوی مقابله با اختلاف‌نظر در روابط",
  instructions: "وقتی با شریک یا دوست صمیمی‌تان اختلاف‌نظر دارید، هر کدام از رفتارهای زیر را چقدر انجام می‌دهید؟",
  questions: [
    { id: 1, text: "سعی می‌کنم مشکل را با گفتگو حل کنم", options: ASRS_OPTIONS },
    { id: 2, text: "داد می‌زنم یا فریاد می‌کشم", options: ASRS_OPTIONS },
    { id: 3, text: "از طرف مقابل فاصله می‌گیرم و حرف نمی‌زنم", options: ASRS_OPTIONS },
    { id: 4, text: "تلاش می‌کنم دیدگاه طرف مقابل را بفهمم", options: ASRS_OPTIONS },
    { id: 5, text: "توهین یا حرف‌های تحقیرآمیز می‌زنم", options: ASRS_OPTIONS },
    { id: 6, text: "موضوع را نادیده می‌گیرم و وانمود می‌کنم مشکلی نیست", options: ASRS_OPTIONS },
    { id: 7, text: "پیشنهاد راه‌حل عملی می‌دهم", options: ASRS_OPTIONS },
    { id: 8, text: "چیزی پرت می‌کنم یا در می‌زنم", options: ASRS_OPTIONS },
    { id: 9, text: "قهر می‌کنم و روزها حرف نمی‌زنم", options: ASRS_OPTIONS },
    { id: 10, text: "آرام و منطقی صحبت می‌کنم", options: ASRS_OPTIONS },
    { id: 11, text: "تهدید به ترک رابطه می‌کنم", options: ASRS_OPTIONS },
    { id: 12, text: "خودم را مقصر می‌دانم تا دعوا تمام شود", options: ASRS_OPTIONS },
    { id: 13, text: "از طرف مقابل عذرخواهی می‌کنم حتی اگر مقصر نباشم", options: ASRS_OPTIONS },
    { id: 14, text: "با طعنه و کنایه صحبت می‌کنم", options: ASRS_OPTIONS },
    { id: 15, text: "سعی می‌کنم یک راه‌حل برد-برد پیدا کنم", options: ASRS_OPTIONS },
    { id: 16, text: "موضوع را عوض می‌کنم تا از بحث فرار کنم", options: ASRS_OPTIONS },
    { id: 17, text: "احساساتم را با آرامش بیان می‌کنم", options: ASRS_OPTIONS },
    { id: 18, text: "از شبکه‌های اجتماعی طرف مقابل را مسدود می‌کنم", options: ASRS_OPTIONS },
    { id: 19, text: "بعد از دعوا اول من پیش‌قدم می‌شوم", options: ASRS_OPTIONS },
    { id: 20, text: "درباره موضوع با دوست یا خانواده صحبت می‌کنم", options: ASRS_OPTIONS },
  ],
  scoring: {
    maxScore: 80,
    ranges: [
      { min: 0, max: 20, label: "سازنده", description: "سبک حل تعارض سازنده و سالم" },
      { min: 21, max: 40, label: "متعادل", description: "ترکیبی از روش‌های مختلف" },
      { min: 41, max: 60, label: "پرخاشگرانه", description: "تمایل به واکنش‌های هیجانی" },
      { min: 61, max: 80, label: "مخرب", description: "سبک مخرب — مشاوره توصیه می‌شود" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ⓬ BDI-II — افسردگی بک
   ═══════════════════════════════════════════════════════ */
const BDI_OPTIONS: TestOption[] = [
  { id: "0", text: "اصلاً", score: 0 },
  { id: "1", text: "خفیف", score: 1 },
  { id: "2", text: "متوسط", score: 2 },
  { id: "3", text: "شدید", score: 3 },
];

const BDI2: TestDefinition = {
  id: "bdi2", name: "BDI-II", fullName: "پرسشنامه افسردگی بک",
  category: "mental_health", construct: "افسردگی (بالینی)",
  description: "ابزار بالینی برای ارزیابی عمیق‌تر علائم افسردگی",
  instructions: "لطفاً هر عبارت را بخوانید و شدت آن را در ۲ هفته گذشته مشخص کنید.",
  questions: [
    { id: 1, text: "غمگینی", options: BDI_OPTIONS },
    { id: 2, text: "بدبینی نسبت به آینده", options: BDI_OPTIONS },
    { id: 3, text: "احساس شکست", options: BDI_OPTIONS },
    { id: 4, text: "از دست دادن لذت", options: BDI_OPTIONS },
    { id: 5, text: "احساس گناه", options: BDI_OPTIONS },
    { id: 6, text: "احساس تنبیه‌شدن", options: BDI_OPTIONS },
    { id: 7, text: "نارضایتی از خود", options: BDI_OPTIONS },
    { id: 8, text: "خودانتقادی", options: BDI_OPTIONS },
    { id: 9, text: "افکار خودکشی", options: BDI_OPTIONS },
    { id: 10, text: "گریه‌کردن", options: BDI_OPTIONS },
    { id: 11, text: "بی‌قراری و آشفتگی", options: BDI_OPTIONS },
    { id: 12, text: "از دست دادن علاقه", options: BDI_OPTIONS },
    { id: 13, text: "بی‌تصمیمی", options: BDI_OPTIONS },
    { id: 14, text: "بی‌ارزشی", options: BDI_OPTIONS },
    { id: 15, text: "کاهش انرژی", options: BDI_OPTIONS },
    { id: 16, text: "تغییر خواب", options: BDI_OPTIONS },
    { id: 17, text: "تحریک‌پذیری", options: BDI_OPTIONS },
    { id: 18, text: "تغییر اشتها", options: BDI_OPTIONS },
    { id: 19, text: "مشکل تمرکز", options: BDI_OPTIONS },
    { id: 20, text: "خستگی", options: BDI_OPTIONS },
    { id: 21, text: "کاهش علاقه جنسی", options: BDI_OPTIONS },
  ],
  scoring: {
    maxScore: 63,
    ranges: [
      { min: 0, max: 13, label: "حداقل", description: "افسردگی ناچیز" },
      { min: 14, max: 19, label: "خفیف", description: "افسردگی خفیف" },
      { min: 20, max: 28, label: "متوسط", description: "افسردگی متوسط" },
      { min: 29, max: 63, label: "شدید", description: "افسردگی شدید" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ⓭ BAI — اضطراب بک
   ═══════════════════════════════════════════════════════ */
const BAI: TestDefinition = {
  id: "bai", name: "BAI", fullName: "پرسشنامه اضطراب بک",
  category: "mental_health", construct: "اضطراب (بالینی)",
  description: "سنجش دقیق‌تر علائم جسمانی و شناختی اضطراب",
  instructions: "در هفته گذشته، هر علامت زیر چقدر شما را آزار داده است؟",
  questions: [
    { id: 1, text: "بی‌حسی یا گزگز دست و پا", options: BDI_OPTIONS },
    { id: 2, text: "احساس گرما", options: BDI_OPTIONS },
    { id: 3, text: "لرزش پاها", options: BDI_OPTIONS },
    { id: 4, text: "ناتوانی در آرام بودن", options: BDI_OPTIONS },
    { id: 5, text: "ترس از بدترین اتفاق", options: BDI_OPTIONS },
    { id: 6, text: "سرگیجه", options: BDI_OPTIONS },
    { id: 7, text: "تپش قلب", options: BDI_OPTIONS },
    { id: 8, text: "بی‌ثباتی و عدم تعادل", options: BDI_OPTIONS },
    { id: 9, text: "وحشت‌زدگی", options: BDI_OPTIONS },
    { id: 10, text: "عصبانیت", options: BDI_OPTIONS },
    { id: 11, text: "احساس خفگی", options: BDI_OPTIONS },
    { id: 12, text: "لرزش دست‌ها", options: BDI_OPTIONS },
    { id: 13, text: "لرز بدن", options: BDI_OPTIONS },
    { id: 14, text: "ترس از دست دادن کنترل", options: BDI_OPTIONS },
    { id: 15, text: "مشکل در تنفس", options: BDI_OPTIONS },
    { id: 16, text: "ترس از مرگ", options: BDI_OPTIONS },
    { id: 17, text: "وحشت", options: BDI_OPTIONS },
    { id: 18, text: "سوءهاضمه یا ناراحتی معده", options: BDI_OPTIONS },
    { id: 19, text: "غش‌کردن یا احساس ضعف", options: BDI_OPTIONS },
    { id: 20, text: "قرمزی صورت", options: BDI_OPTIONS },
    { id: 21, text: "تعریق (نه ناشی از گرما)", options: BDI_OPTIONS },
  ],
  scoring: {
    maxScore: 63,
    ranges: [
      { min: 0, max: 7, label: "حداقل", description: "اضطراب ناچیز" },
      { min: 8, max: 15, label: "خفیف", description: "اضطراب خفیف" },
      { min: 16, max: 25, label: "متوسط", description: "اضطراب متوسط" },
      { min: 26, max: 63, label: "شدید", description: "اضطراب شدید" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ⓮ PCL-5 — چک‌لیست PTSD
   ═══════════════════════════════════════════════════════ */
const PCL5: TestDefinition = {
  id: "pcl5", name: "PCL-5", fullName: "چک‌لیست PTSD",
  category: "mental_health", construct: "تروما",
  description: "غربالگری علائم اختلال استرس پس از سانحه",
  instructions: "در ماه گذشته، هر مورد زیر چقدر شما را آزار داده؟",
  questions: [
    { id: 1, text: "خاطرات ناخواسته و مکرر از تجربه آزاردهنده", options: ISI_OPTIONS },
    { id: 2, text: "کابوس‌های مکرر درباره تجربه آزاردهنده", options: ISI_OPTIONS },
    { id: 3, text: "احساس اینکه انگار تجربه آزاردهنده دوباره اتفاق می‌افتد", options: ISI_OPTIONS },
    { id: 4, text: "ناراحتی شدید وقتی چیزی یادآور تجربه می‌شود", options: ISI_OPTIONS },
    { id: 5, text: "واکنش‌های جسمانی شدید به یادآوری‌ها", options: ISI_OPTIONS },
    { id: 6, text: "اجتناب از فکر کردن درباره تجربه", options: ISI_OPTIONS },
    { id: 7, text: "اجتناب از مکان‌ها و افراد یادآور", options: ISI_OPTIONS },
    { id: 8, text: "مشکل در به‌یادآوردن بخش‌های مهم تجربه", options: ISI_OPTIONS },
    { id: 9, text: "باورهای منفی درباره خود یا جهان", options: ISI_OPTIONS },
    { id: 10, text: "سرزنش خود یا دیگران برای اتفاق افتاده", options: ISI_OPTIONS },
    { id: 11, text: "احساسات منفی شدید مثل ترس، وحشت، خشم یا گناه", options: ISI_OPTIONS },
    { id: 12, text: "از دست دادن علاقه به فعالیت‌ها", options: ISI_OPTIONS },
    { id: 13, text: "احساس جدایی و بیگانگی از دیگران", options: ISI_OPTIONS },
    { id: 14, text: "مشکل در تجربه احساسات مثبت", options: ISI_OPTIONS },
    { id: 15, text: "رفتار تحریک‌پذیر، عصبانیت یا پرخاشگری", options: ISI_OPTIONS },
    { id: 16, text: "رفتارهای خطرناک یا خودتخریبی", options: ISI_OPTIONS },
    { id: 17, text: "گوش‌به‌زنگ و مراقب بودن بیش از حد", options: ISI_OPTIONS },
    { id: 18, text: "یکه‌خوردن و واکنش شدید به صداها", options: ISI_OPTIONS },
    { id: 19, text: "مشکل در تمرکز", options: ISI_OPTIONS },
    { id: 20, text: "مشکل در خوابیدن", options: ISI_OPTIONS },
  ],
  scoring: {
    maxScore: 80,
    ranges: [
      { min: 0, max: 20, label: "حداقل", description: "علائم PTSD ناچیز" },
      { min: 21, max: 40, label: "خفیف تا متوسط", description: "بعضی علائم وجود دارد" },
      { min: 41, max: 60, label: "متوسط تا شدید", description: "مشاوره تخصصی توصیه می‌شود" },
      { min: 61, max: 80, label: "شدید", description: "نیاز فوری به مداخله تخصصی" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ⓯ MDQ — اختلال خلقی (دوقطبی)
   ═══════════════════════════════════════════════════════ */
const MDQ_OPTIONS: TestOption[] = [
  { id: "0", text: "خیر", score: 0 },
  { id: "1", text: "بله", score: 1 },
];

const MDQ: TestDefinition = {
  id: "mdq", name: "MDQ", fullName: "پرسشنامه اختلال خلقی",
  category: "mental_health", construct: "دوقطبی",
  description: "غربالگری علائم اختلال دوقطبی و مانیا",
  instructions: "آیا تا به حال دوره‌ای داشتید که احساس‌های زیر را تجربه کرده باشید؟",
  questions: [
    { id: 1, text: "احساس خوشحالی و انرژی بسیار بالا که با حالت معمول شما فرق داشت", options: MDQ_OPTIONS },
    { id: 2, text: "آنقدر تحریک‌پذیر بودید که سر دیگران داد زدید یا دعوا کردید", options: MDQ_OPTIONS },
    { id: 3, text: "اعتماد به نفستان خیلی بیشتر از حد معمول بود", options: MDQ_OPTIONS },
    { id: 4, text: "خواب کمتری نیاز داشتید", options: MDQ_OPTIONS },
    { id: 5, text: "بیشتر از حد معمول حرف می‌زدید", options: MDQ_OPTIONS },
    { id: 6, text: "افکار سریع‌تر از حد معمول در ذهنتان جریان داشت", options: MDQ_OPTIONS },
    { id: 7, text: "راحت‌تر حواستان پرت می‌شد", options: MDQ_OPTIONS },
    { id: 8, text: "انرژی بیشتری داشتید و فعالیت‌های زیادی انجام می‌دادید", options: MDQ_OPTIONS },
    { id: 9, text: "اجتماعی‌تر یا برون‌گراتر از حالت عادی بودید", options: MDQ_OPTIONS },
    { id: 10, text: "علاقه بیشتری به فعالیت‌های جنسی داشتید", options: MDQ_OPTIONS },
    { id: 11, text: "کارهایی کردید که معمولاً انجام نمی‌دادید (خرید بی‌رویه، سرمایه‌گذاری عجولانه)", options: MDQ_OPTIONS },
    { id: 12, text: "این علائم باعث مشکل در کار، خانواده یا روابط شد", options: MDQ_OPTIONS },
    { id: 13, text: "چند مورد از علائم بالا همزمان رخ دادند", options: MDQ_OPTIONS },
  ],
  scoring: {
    maxScore: 13,
    ranges: [
      { min: 0, max: 4, label: "طبیعی", description: "علائم دوقطبی مشاهده نشد" },
      { min: 5, max: 8, label: "احتمال خفیف", description: "بعضی علائم وجود دارد" },
      { min: 9, max: 13, label: "احتمال بالا", description: "ارزیابی تخصصی توصیه می‌شود" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ⓰ Y-BOCS — مقیاس وسواس ییل-براون
   ═══════════════════════════════════════════════════════ */
const YBOCS: TestDefinition = {
  id: "ybocs", name: "Y-BOCS", fullName: "مقیاس وسواس ییل-براون",
  category: "mental_health", construct: "OCD",
  description: "ارزیابی شدت علائم وسواس فکری-عملی",
  instructions: "در هفته گذشته، وسواس‌ها و رفتارهای وسواسی شما چگونه بوده‌اند؟",
  questions: [
    { id: 1, text: "چقدر از وقت شما صرف افکار وسواسی می‌شود؟", options: ISI_OPTIONS },
    { id: 2, text: "افکار وسواسی چقدر در کار روزمره‌تان اختلال ایجاد می‌کنند؟", options: ISI_OPTIONS },
    { id: 3, text: "افکار وسواسی چقدر ناراحتتان می‌کنند؟", options: ISI_OPTIONS },
    { id: 4, text: "چقدر تلاش می‌کنید در برابر افکار وسواسی مقاومت کنید؟", options: ISI_OPTIONS },
    { id: 5, text: "چقدر کنترل روی افکار وسواسی دارید؟", options: ISI_OPTIONS },
    { id: 6, text: "چقدر از وقت شما صرف رفتارهای وسواسی (شستن، چک‌کردن و...) می‌شود؟", options: ISI_OPTIONS },
    { id: 7, text: "رفتارهای وسواسی چقدر در کار روزمره اختلال ایجاد می‌کنند؟", options: ISI_OPTIONS },
    { id: 8, text: "اگر رفتار وسواسی انجام ندهید چقدر اضطراب دارید؟", options: ISI_OPTIONS },
    { id: 9, text: "چقدر تلاش می‌کنید در برابر رفتارهای وسواسی مقاومت کنید؟", options: ISI_OPTIONS },
    { id: 10, text: "چقدر کنترل روی رفتارهای وسواسی دارید؟", options: ISI_OPTIONS },
  ],
  scoring: {
    maxScore: 40,
    ranges: [
      { min: 0, max: 7, label: "زیرآستانه", description: "علائم OCD ناچیز" },
      { min: 8, max: 15, label: "خفیف", description: "OCD خفیف" },
      { min: 16, max: 23, label: "متوسط", description: "OCD متوسط" },
      { min: 24, max: 31, label: "شدید", description: "OCD شدید" },
      { min: 32, max: 40, label: "بسیار شدید", description: "OCD بسیار شدید" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ⓱ Gottman — مقیاس‌های ارتباطی
   ═══════════════════════════════════════════════════════ */
const GOTTMAN: TestDefinition = {
  id: "gottman", name: "Gottman", fullName: "مقیاس‌های ارتباطی گاتمن",
  category: "relationship", construct: "پایداری رابطه",
  description: "پیش‌بینی پایداری رابطه و شناسایی الگوهای مخرب",
  instructions: "هر عبارت را بخوانید و میزان موافقت خود را مشخص کنید.",
  questions: [
    { id: 1, text: "شریکم اغلب از من انتقاد می‌کند", options: NEO_OPTIONS },
    { id: 2, text: "وقتی بحث می‌کنیم، از خودم دفاع می‌کنم", options: NEO_OPTIONS },
    { id: 3, text: "گاهی در بحث، تحقیر یا مسخره‌کردن اتفاق می‌افتد", options: NEO_OPTIONS },
    { id: 4, text: "وقتی بحث شدید می‌شود، سکوت می‌کنم و دیوار می‌کشم", options: NEO_OPTIONS },
    { id: 5, text: "بعد از دعوا سعی می‌کنم آشتی کنم", options: NEO_OPTIONS },
    { id: 6, text: "نقشه عشق شریکم را خوب می‌شناسم (علایق، ترس‌ها، رؤیاها)", options: NEO_OPTIONS },
    { id: 7, text: "احترام و تحسین متقابل در رابطه‌مان وجود دارد", options: NEO_OPTIONS },
    { id: 8, text: "به سمت هم برمی‌گردیم نه از هم فاصله نمی‌گیریم", options: NEO_OPTIONS },
    { id: 9, text: "دیدگاه مثبتی نسبت به شریکم دارم", options: NEO_OPTIONS },
    { id: 10, text: "تعارض‌ها را مدیریت می‌کنیم نه فرار", options: NEO_OPTIONS },
    { id: 11, text: "رؤیاها و اهداف مشترکی داریم", options: NEO_OPTIONS },
    { id: 12, text: "معنای مشترکی در رابطه‌مان ایجاد کرده‌ایم", options: NEO_OPTIONS },
    { id: 13, text: "اعتماد و تعهد محکمی بین‌مان وجود دارد", options: NEO_OPTIONS },
    { id: 14, text: "وقتی شریکم ناراحت است، به حرف‌هایش گوش می‌دهم", options: NEO_OPTIONS },
    { id: 15, text: "از شروع بحث‌ها به شکل ملایم استفاده می‌کنم", options: NEO_OPTIONS },
    { id: 16, text: "تأثیر شریکم را در تصمیمات می‌پذیرم", options: NEO_OPTIONS },
    { id: 17, text: "بعضی مشکلات حل‌نشدنی ما را می‌پذیرم", options: NEO_OPTIONS },
    { id: 18, text: "روزانه لحظات مثبت با هم داریم", options: NEO_OPTIONS },
    { id: 19, text: "در مورد احساساتم با شریکم صادقم", options: NEO_OPTIONS },
    { id: 20, text: "رابطه‌مان را یک تیم می‌دانم نه دو رقیب", options: NEO_OPTIONS },
  ],
  scoring: {
    maxScore: 80,
    ranges: [
      { min: 0, max: 20, label: "بحرانی", description: "رابطه نیاز به مداخله فوری دارد" },
      { min: 21, max: 40, label: "نیازمند بهبود", description: "نقاط ضعف قابل توجه" },
      { min: 41, max: 60, label: "خوب", description: "رابطه سالم با جای بهبود" },
      { min: 61, max: 80, label: "عالی", description: "رابطه بسیار سالم و پایدار" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ⓲-⓳ HEXACO (فرم کوتاه ۳۰) + SCI (صمیمیت ۱۰)
   ═══════════════════════════════════════════════════════ */
const HEXACO: TestDefinition = {
  id: "hexaco", name: "HEXACO", fullName: "مدل شش عاملی شخصیت",
  category: "personality", construct: "شخصیت + صداقت",
  description: "شامل بُعد صداقت-فروتنی",
  instructions: "میزان موافقت خود را مشخص کنید.",
  questions: [
    { id: 1, text: "از فریب دادن دیگران برای رسیدن به خواسته‌ام خودداری می‌کنم", options: NEO_OPTIONS },
    { id: 2, text: "ثروت و تجملات برایم خیلی مهم نیست", options: NEO_OPTIONS },
    { id: 3, text: "خودم را بالاتر از دیگران نمی‌دانم", options: NEO_OPTIONS },
    { id: 4, text: "اگر قانون‌شکنی سودی داشته باشد، وسوسه نمی‌شوم", options: NEO_OPTIONS },
    { id: 5, text: "از نشان دادن احساساتم نمی‌ترسم", options: NEO_OPTIONS },
    { id: 6, text: "نگرانی‌های کوچک را بزرگ نمی‌کنم", options: NEO_OPTIONS },
    { id: 7, text: "وابستگی عاطفی به دیگران برایم راحت است", options: NEO_OPTIONS },
    { id: 8, text: "در جمع‌های بزرگ احساس راحتی می‌کنم", options: NEO_OPTIONS },
    { id: 9, text: "معمولاً ابتکار عمل را در دست می‌گیرم", options: NEO_OPTIONS },
    { id: 10, text: "از شوخی و خنده لذت می‌برم", options: NEO_OPTIONS },
    { id: 11, text: "دیگران را بخشیدن برایم آسان است", options: NEO_OPTIONS },
    { id: 12, text: "حتی با افراد عصبانی هم ملایم رفتار می‌کنم", options: NEO_OPTIONS },
    { id: 13, text: "به‌راحتی با دیگران سازش می‌کنم", options: NEO_OPTIONS },
    { id: 14, text: "لجبازی نمی‌کنم", options: NEO_OPTIONS },
    { id: 15, text: "کارهایم را طبق برنامه انجام می‌دهم", options: NEO_OPTIONS },
    { id: 16, text: "تصمیمات عجولانه نمی‌گیرم", options: NEO_OPTIONS },
    { id: 17, text: "نظم و ترتیب برایم مهم است", options: NEO_OPTIONS },
    { id: 18, text: "برای رسیدن به هدفم سخت تلاش می‌کنم", options: NEO_OPTIONS },
    { id: 19, text: "به هنر و زیبایی علاقه‌مندم", options: NEO_OPTIONS },
    { id: 20, text: "کنجکاو و جستجوگرم", options: NEO_OPTIONS },
    { id: 21, text: "ایده‌های خلاقانه و غیرمعمول دارم", options: NEO_OPTIONS },
    { id: 22, text: "به مسائل فلسفی و عمیق علاقه‌مندم", options: NEO_OPTIONS },
    { id: 23, text: "وقتی عصبانی می‌شوم زود آرام می‌شوم", options: NEO_OPTIONS },
    { id: 24, text: "به‌ندرت از کسی کینه به دل می‌گیرم", options: NEO_OPTIONS },
    { id: 25, text: "رفتارم با همه یکسان و بدون تبعیض است", options: NEO_OPTIONS },
    { id: 26, text: "وقتی اشتباه می‌کنم اعتراف می‌کنم", options: NEO_OPTIONS },
    { id: 27, text: "حرف‌هایم صادقانه و بدون اغراق است", options: NEO_OPTIONS },
    { id: 28, text: "از چاپلوسی خودداری می‌کنم", options: NEO_OPTIONS },
    { id: 29, text: "به وعده‌هایم پایبندم", options: NEO_OPTIONS },
    { id: 30, text: "در کارهای تیمی مسئولیت‌پذیرم", options: NEO_OPTIONS },
  ],
  scoring: {
    maxScore: 120,
    ranges: [
      { min: 0, max: 30, label: "کم", description: "ویژگی‌ها در حد پایین" },
      { min: 31, max: 60, label: "میانگین پایین", description: "پایین‌تر از میانگین" },
      { min: 61, max: 90, label: "میانگین بالا", description: "بالاتر از میانگین" },
      { min: 91, max: 120, label: "بالا", description: "ویژگی‌ها در حد بالا" },
    ],
  },
};

const SCI: TestDefinition = {
  id: "sexual_compat", name: "SCI", fullName: "سازگاری صمیمیت جسمی",
  category: "relationship", construct: "صمیمیت",
  description: "تحلیل تطابق نیازها و مرزبندی در روابط صمیمانه",
  instructions: "میزان موافقت خود را مشخص کنید.",
  questions: [
    { id: 1, text: "درباره نیازها و خواسته‌های صمیمانه‌ام با شریکم راحت صحبت می‌کنم", options: NEO_OPTIONS },
    { id: 2, text: "مرزهای فیزیکی شریکم را درک و رعایت می‌کنم", options: NEO_OPTIONS },
    { id: 3, text: "از ابراز محبت فیزیکی (بغل، دست‌دادن) لذت می‌برم", options: NEO_OPTIONS },
    { id: 4, text: "احساس امنیت عاطفی در روابط صمیمانه دارم", options: NEO_OPTIONS },
    { id: 5, text: "نیازهای عاطفی‌ام در رابطه برآورده می‌شود", options: NEO_OPTIONS },
    { id: 6, text: "درباره انتظاراتم از نزدیکی فیزیکی صادقم", options: NEO_OPTIONS },
    { id: 7, text: "اگر چیزی ناراحتم کند، می‌توانم بگویم «نه»", options: NEO_OPTIONS },
    { id: 8, text: "رضایت متقابل در رابطه صمیمانه برایم مهم است", options: NEO_OPTIONS },
    { id: 9, text: "تجربه‌های صمیمانه باعث نزدیکی عاطفی بیشتر می‌شود", options: NEO_OPTIONS },
    { id: 10, text: "ارتباط کلامی درباره صمیمیت جسمی برایم راحت است", options: NEO_OPTIONS },
  ],
  scoring: {
    maxScore: 40,
    ranges: [
      { min: 0, max: 10, label: "نیازمند بهبود", description: "ارتباط و صمیمیت نیاز به توجه دارد" },
      { min: 11, max: 20, label: "متوسط", description: "وضعیت قابل قبول" },
      { min: 21, max: 30, label: "خوب", description: "صمیمیت سالم" },
      { min: 31, max: 40, label: "عالی", description: "صمیمیت بسیار سالم و متعادل" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════
   ⓴-㉕ تست‌های بالینی (فرم کوتاه نمایندگی)
   MMPI-2, MCMI, SCID-5, PID-5, YSQ
   ═══════════════════════════════════════════════════════ */
const CLINICAL_OPTIONS = NEO_OPTIONS;

const MMPI2: TestDefinition = {
  id: "mmpi2", name: "MMPI-2", fullName: "پرسشنامه چندوجهی مینه‌سوتا (فرم غربالگری)",
  category: "clinical", construct: "آسیب‌شناسی شخصیت",
  description: "غربالگری اولیه اختلالات شخصیت — نسخه بالینی کامل ۵۶۷ سوالی نیاز به روانشناس دارد",
  instructions: "هر عبارت را بخوانید و میزان موافقت خود را مشخص کنید.",
  questions: [
    { id: 1, text: "اغلب احساس می‌کنم کسی مرا تحت نظر دارد", options: CLINICAL_OPTIONS },
    { id: 2, text: "گاهی فکر می‌کنم دیگران علیه من توطئه می‌چینند", options: CLINICAL_OPTIONS },
    { id: 3, text: "اغلب سردرد دارم", options: CLINICAL_OPTIONS },
    { id: 4, text: "گاهی صداهایی می‌شنوم که دیگران نمی‌شنوند", options: CLINICAL_OPTIONS },
    { id: 5, text: "خواب‌هایی می‌بینم که بسیار واقعی به نظر می‌رسند", options: CLINICAL_OPTIONS },
    { id: 6, text: "کنترل رفتارم برایم مشکل است", options: CLINICAL_OPTIONS },
    { id: 7, text: "از آدم‌ها فاصله می‌گیرم", options: CLINICAL_OPTIONS },
    { id: 8, text: "احساس می‌کنم هیچ‌کس مرا درک نمی‌کند", options: CLINICAL_OPTIONS },
    { id: 9, text: "آینده‌ام تاریک به نظر می‌رسد", options: CLINICAL_OPTIONS },
    { id: 10, text: "گاهی دلم می‌خواهد چیزی را بشکنم", options: CLINICAL_OPTIONS },
  ],
  scoring: { maxScore: 40, ranges: [
    { min: 0, max: 10, label: "طبیعی", description: "بدون نشانه بالینی" },
    { min: 11, max: 20, label: "خفیف", description: "بعضی نشانه‌ها" },
    { min: 21, max: 30, label: "متوسط", description: "ارزیابی تخصصی توصیه می‌شود" },
    { min: 31, max: 40, label: "بالا", description: "نیاز به ارزیابی بالینی کامل" },
  ]},
};

const MCMI: TestDefinition = {
  id: "mcmi", name: "MCMI", fullName: "پرسشنامه بالینی میلون (فرم غربالگری)",
  category: "clinical", construct: "اختلالات شخصیت",
  description: "غربالگری اولیه — نسخه کامل ۱۷۵ سوالی نیاز به روانشناس دارد",
  instructions: "میزان موافقت خود را مشخص کنید.",
  questions: [
    { id: 1, text: "از نزدیک شدن به دیگران اجتناب می‌کنم", options: CLINICAL_OPTIONS },
    { id: 2, text: "به دیگران وابسته هستم و از تنها بودن می‌ترسم", options: CLINICAL_OPTIONS },
    { id: 3, text: "قوانین و مقررات را جدی می‌گیرم", options: CLINICAL_OPTIONS },
    { id: 4, text: "اغلب نقش قربانی را بازی می‌کنم", options: CLINICAL_OPTIONS },
    { id: 5, text: "به‌راحتی از کوره در می‌روم", options: CLINICAL_OPTIONS },
    { id: 6, text: "خودم را خاص و متفاوت از دیگران می‌دانم", options: CLINICAL_OPTIONS },
    { id: 7, text: "به دنبال جلب توجه هستم", options: CLINICAL_OPTIONS },
    { id: 8, text: "روابطم بی‌ثبات و پرتنش است", options: CLINICAL_OPTIONS },
    { id: 9, text: "به‌سختی به دیگران اعتماد می‌کنم", options: CLINICAL_OPTIONS },
    { id: 10, text: "ترجیح می‌دهم تنها باشم و از اجتماع دوری کنم", options: CLINICAL_OPTIONS },
  ],
  scoring: { maxScore: 40, ranges: [
    { min: 0, max: 10, label: "طبیعی", description: "بدون نشانه" },
    { min: 11, max: 20, label: "خفیف", description: "بعضی ویژگی‌ها" },
    { min: 21, max: 30, label: "متوسط", description: "ارزیابی تخصصی" },
    { min: 31, max: 40, label: "بالا", description: "نیاز به ارزیابی بالینی" },
  ]},
};

const SCID5: TestDefinition = {
  id: "scid5", name: "SCID-5", fullName: "مصاحبه بالینی ساختاریافته DSM-5 (فرم غربالگری)",
  category: "clinical", construct: "تشخیص DSM-5",
  description: "غربالگری اولیه — نسخه کامل ۱۵۰ سوالی نیاز به روانشناس دارد",
  instructions: "آیا در ۶ ماه اخیر هر مورد زیر را تجربه کرده‌اید؟",
  questions: [
    { id: 1, text: "دوره‌های افسردگی شدید داشتم", options: MDQ_OPTIONS },
    { id: 2, text: "دوره‌های اضطراب شدید یا حملات پانیک داشتم", options: MDQ_OPTIONS },
    { id: 3, text: "افکار وسواسی یا رفتارهای تکراری داشتم", options: MDQ_OPTIONS },
    { id: 4, text: "تجربه آزاردهنده‌ای از گذشته مرا اذیت می‌کند", options: MDQ_OPTIONS },
    { id: 5, text: "مشکلات خوردن (بی‌اشتهایی یا پرخوری) داشتم", options: MDQ_OPTIONS },
    { id: 6, text: "مصرف الکل یا مواد مشکل‌ساز شده", options: MDQ_OPTIONS },
    { id: 7, text: "مشکلات خواب جدی داشتم", options: MDQ_OPTIONS },
    { id: 8, text: "مشکل تمرکز یا حافظه جدی داشتم", options: MDQ_OPTIONS },
    { id: 9, text: "افکار آزاردهنده درباره مرگ یا خودکشی داشتم", options: MDQ_OPTIONS },
    { id: 10, text: "این مشکلات در زندگی روزمره‌ام اختلال ایجاد کرده", options: MDQ_OPTIONS },
  ],
  scoring: { maxScore: 10, ranges: [
    { min: 0, max: 2, label: "طبیعی", description: "بدون نشانه بالینی" },
    { min: 3, max: 5, label: "خفیف", description: "بعضی نشانه‌ها" },
    { min: 6, max: 8, label: "متوسط", description: "ارزیابی تخصصی توصیه" },
    { min: 9, max: 10, label: "شدید", description: "نیاز فوری به ارزیابی" },
  ]},
};

const PID5: TestDefinition = {
  id: "pid5", name: "PID-5", fullName: "ویژگی‌های شخصیت DSM-5 (فرم غربالگری)",
  category: "clinical", construct: "شخصیت (DSM-5)",
  description: "غربالگری اولیه — نسخه کامل ۱۰۰ سوالی نیاز به روانشناس دارد",
  instructions: "میزان موافقت خود را مشخص کنید.",
  questions: [
    { id: 1, text: "احساسات من به‌سرعت و شدت تغییر می‌کند", options: CLINICAL_OPTIONS },
    { id: 2, text: "اغلب احساس پوچی و بی‌هدفی می‌کنم", options: CLINICAL_OPTIONS },
    { id: 3, text: "به‌سختی به دیگران اعتماد می‌کنم", options: CLINICAL_OPTIONS },
    { id: 4, text: "ترجیح می‌دهم از دیگران فاصله بگیرم", options: CLINICAL_OPTIONS },
    { id: 5, text: "مسئولیت اعمالم را نمی‌پذیرم", options: CLINICAL_OPTIONS },
    { id: 6, text: "دروغ‌گفتن برایم آسان است", options: CLINICAL_OPTIONS },
    { id: 7, text: "نسبت به احساسات دیگران بی‌تفاوتم", options: CLINICAL_OPTIONS },
    { id: 8, text: "اغلب عصبانی و تحریک‌پذیرم", options: CLINICAL_OPTIONS },
    { id: 9, text: "رفتارهای تکانشی و بدون فکر دارم", options: CLINICAL_OPTIONS },
    { id: 10, text: "افکار و تجربه‌های عجیبی دارم", options: CLINICAL_OPTIONS },
  ],
  scoring: { maxScore: 40, ranges: [
    { min: 0, max: 10, label: "طبیعی", description: "بدون نشانه" },
    { min: 11, max: 20, label: "خفیف", description: "بعضی ویژگی‌ها" },
    { min: 21, max: 30, label: "متوسط", description: "ارزیابی تخصصی" },
    { min: 31, max: 40, label: "بالا", description: "نیاز به ارزیابی بالینی" },
  ]},
};

const YSQ: TestDefinition = {
  id: "ysq", name: "YSQ", fullName: "پرسشنامه طرحواره یانگ (فرم غربالگری)",
  category: "clinical", construct: "طرحواره‌های ناسازگار",
  description: "غربالگری اولیه — نسخه کامل ۲۳۲ سوالی نیاز به روانشناس دارد",
  instructions: "میزان موافقت خود را مشخص کنید.",
  questions: [
    { id: 1, text: "کسانی که به من نزدیک هستند سرانجام مرا ترک می‌کنند", options: ECR_OPTIONS },
    { id: 2, text: "به هیچ‌کس نمی‌توانم اعتماد کنم", options: ECR_OPTIONS },
    { id: 3, text: "از نظر عاطفی محروم بوده‌ام", options: ECR_OPTIONS },
    { id: 4, text: "ایرادی در من هست که اگر دیگران بفهمند طردم می‌کنند", options: ECR_OPTIONS },
    { id: 5, text: "هیچ‌کس مرا دوست ندارد", options: ECR_OPTIONS },
    { id: 6, text: "نمی‌توانم بدون کمک دیگران زندگی کنم", options: ECR_OPTIONS },
    { id: 7, text: "اتفاق بدی قرار است بیفتد", options: ECR_OPTIONS },
    { id: 8, text: "هرگز نتوانسته‌ام از خانواده‌ام جدا شوم", options: ECR_OPTIONS },
    { id: 9, text: "نیازهای دیگران همیشه مهم‌تر از نیازهای من است", options: ECR_OPTIONS },
    { id: 10, text: "باید بهترین باشم وگرنه ارزشی ندارم", options: ECR_OPTIONS },
  ],
  scoring: { maxScore: 70, ranges: [
    { min: 0, max: 17, label: "طبیعی", description: "طرحواره‌های سالم" },
    { min: 18, max: 35, label: "خفیف", description: "بعضی طرحواره‌ها فعال" },
    { min: 36, max: 52, label: "متوسط", description: "طرحواره‌درمانی پیشنهاد" },
    { min: 53, max: 70, label: "شدید", description: "نیاز به روان‌درمانی" },
  ]},
};

/* ═══════════════════════════════════════════════════════
   MBTI — قبلاً در personality-test page موجوده
   ═══════════════════════════════════════════════════════ */
const MBTI: TestDefinition = {
  id: "mbti", name: "MBTI", fullName: "تیپ شخصیتی مایرز-بریگز",
  category: "personality", construct: "تیپ شخصیتی",
  description: "بررسی شده در ثبت‌نام — مبنای اصلی مچینگ راوی",
  instructions: "تست MBTI قبلاً هنگام ثبت‌نام انجام شده است.",
  questions: [],
  scoring: { maxScore: 0, ranges: [] },
};

/* ═══════════════════════════════════════════════════════
   صادرات نهایی
   ═══════════════════════════════════════════════════════ */
export const ALL_TESTS: TestDefinition[] = [
  PHQ9, GAD7, DASS21, LOVE_LANGUAGES, ECR_R,
  NEO_FFI, HEXACO, IRI, ERQ, CRSI,
  BDI2, BAI, PCL5, ISI, ASRS,
  MDQ, YBOCS, GOTTMAN, SCI,
  MMPI2, MCMI, SCID5, PID5, YSQ,
  MBTI,
];

export function getTestById(id: string): TestDefinition | undefined {
  return ALL_TESTS.find((t) => t.id === id);
}

export function calculateScore(testId: string, answers: Record<number, number>): {
  total: number;
  label: string;
  description: string;
} {
  const test = getTestById(testId);
  if (!test) return { total: 0, label: "نامشخص", description: "" };

  const total = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const range = test.scoring.ranges.find((r) => total >= r.min && total <= r.max);

  return {
    total,
    label: range?.label || "نامشخص",
    description: range?.description || "",
  };
}
