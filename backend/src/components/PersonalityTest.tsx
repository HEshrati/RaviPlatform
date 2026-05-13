"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { saveTestResult } from "@/lib/api";
import { useApp } from "@/context/AppContext";

type Axis = "EI" | "SN" | "TF" | "JP" | "SOCIAL" | "PACE";
type Scores = Record<Axis, number>;

interface Option { id: string; text: string; icon: string; scores: Partial<Scores>; }
interface Question { id: number; text: string; basis: string; options: Option[]; }

const questions: Question[] = [
  { id: 1, text: "بعد از یک هفته شلوغ، کدام برنامه بیشتر شارژت می‌کند؟", basis: "انرژی اجتماعی: درون‌گرایی / برون‌گرایی", options: [
    { id: "q1_i", text: "جمع کوچک و عمیق با چند نفر قابل اعتماد", icon: "☕", scores: { EI: -2, SOCIAL: -1 } },
    { id: "q1_e", text: "جمع پرانرژی با آدم‌های تازه", icon: "🎉", scores: { EI: 2, SOCIAL: 2 } },
  ]},
  { id: 2, text: "در رویداد جدید دنبال چه تجربه‌ای هستی؟", basis: "سبک تجربه: جزئیات آشنا / کشف و تنوع", options: [
    { id: "q2_s", text: "برنامه روشن، مکان مشخص و فعالیت قابل پیش‌بینی", icon: "🧭", scores: { SN: -2, JP: 1 } },
    { id: "q2_n", text: "غافلگیری، ایده تازه و گفت‌وگوی غیرمنتظره", icon: "✨", scores: { SN: 2, PACE: 1 } },
  ]},
  { id: 3, text: "وقتی اختلاف سلیقه پیش می‌آید، اولویت تو چیست؟", basis: "تصمیم‌گیری: منطق / همدلی", options: [
    { id: "q3_t", text: "اول مسئله را دقیق و منصفانه تحلیل می‌کنم", icon: "🧠", scores: { TF: -2 } },
    { id: "q3_f", text: "اول حال آدم‌ها و حفظ رابطه برایم مهم است", icon: "💛", scores: { TF: 2, SOCIAL: 1 } },
  ]},
  { id: 4, text: "برای یک قرار گروهی کدام حالت را ترجیح می‌دهی؟", basis: "ساختار رفتاری: برنامه‌مند / منعطف", options: [
    { id: "q4_j", text: "از قبل بدانم چه زمانی، کجا و با چه برنامه‌ای", icon: "📋", scores: { JP: 2, PACE: -1 } },
    { id: "q4_p", text: "فضا باز باشد و همان لحظه تصمیم بگیریم", icon: "🌊", scores: { JP: -2, PACE: 1 } },
  ]},
  { id: 5, text: "در گروه‌ها معمولاً چه نقشی می‌گیری؟", basis: "نقش اجتماعی اولیه", options: [
    { id: "q5_c", text: "هماهنگ‌کننده؛ کمک می‌کنم گفتگو جلو برود", icon: "🤝", scores: { EI: 1, SOCIAL: 2, JP: 1 } },
    { id: "q5_o", text: "مشاهده‌گر فعال؛ کم‌حرف‌ترم اما عمیق وصل می‌شوم", icon: "👀", scores: { EI: -1, SOCIAL: -1, TF: 1 } },
  ]},
  { id: 6, text: "ریتم ایده‌آل تو برای آشنایی چیست؟", basis: "ریتم اعتمادسازی و مچینگ", options: [
    { id: "q6_slow", text: "آرام، مرحله‌ای و با زمان کافی", icon: "🌱", scores: { PACE: -2, JP: 1 } },
    { id: "q6_fast", text: "سریع، پویا و بدون تعارف زیاد", icon: "⚡", scores: { PACE: 2, EI: 1 } },
  ]},
];

const emptyScores: Scores = { EI: 0, SN: 0, TF: 0, JP: 0, SOCIAL: 0, PACE: 0 };

function buildResult(scores: Scores) {
  const code = `${scores.EI >= 0 ? "E" : "I"}${scores.SN >= 0 ? "N" : "S"}${scores.TF >= 0 ? "F" : "T"}${scores.JP >= 0 ? "J" : "P"}`;
  const social = scores.SOCIAL >= 2 ? "جمع‌ساز" : scores.SOCIAL <= -2 ? "ارتباط عمیق دونفره" : "متعادل اجتماعی";
  const pace = scores.PACE >= 2 ? "ریتم سریع" : scores.PACE <= -2 ? "ریتم آرام" : "ریتم منعطف";
  const descriptions: Record<string, string> = {
    ENFJ: "گرم، جمع‌ساز و هدفمند؛ برای رویدادهای گفتگو محور و تیمی عالی هستی.",
    ENFP: "کنجکاو، پرانرژی و ایده‌پرداز؛ با تجربه‌های تازه و جمع‌های متنوع مچ می‌شوی.",
    INFJ: "عمیق، معناگرا و همدل؛ جمع‌های کوچک و گفت‌وگوهای باکیفیت برایت مناسب‌تر است.",
    INFP: "اصیل، احساسی و خلاق؛ با آدم‌های امن و فضاهای آرام بهتر وصل می‌شوی.",
    ENTJ: "تصمیم‌ساز و ساختارمند؛ در رویدادهای هدفمند یا حرفه‌ای خوب می‌درخشی.",
    ENTP: "چالش‌دوست و گفتگو محور؛ بازی، مناظره و تجربه‌های غیرکلیشه‌ای مناسب توست.",
    INTJ: "تحلیلی و مستقل؛ برنامه‌های کم‌حاشیه، دقیق و فکری برایت بهتر است.",
    INTP: "کاوشگر و منطقی؛ جمع‌های فکری و بازی‌های استراتژیک مچ خوبی هستند.",
    ESFJ: "حمایت‌گر و اجتماعی؛ با دورهمی‌های گرم و آشنا سریع ارتباط می‌گیری.",
    ESFP: "تجربه‌گرا و پرشور؛ برنامه‌های سرگرم‌کننده و پرانرژی مناسب توست.",
    ISFJ: "وفادار و مراقب؛ جمع‌های امن، قابل پیش‌بینی و صمیمی برایت بهترند.",
    ISFP: "آرام، هنری و تجربه‌محور؛ فضاهای لطیف، کافه‌ای و کم‌فشار مناسب توست.",
    ESTJ: "اجرایی و منظم؛ رویدادهای برنامه‌دار و نتیجه‌محور برایت جذاب‌تر است.",
    ESTP: "عمل‌گرا و هیجان‌دوست؛ فعالیت، بازی و چالش زنده مناسب توست.",
    ISTJ: "دقیق و قابل اعتماد؛ برنامه‌های منظم، کوچک و با قوانین روشن برایت بهتر است.",
    ISTP: "مستقل و تجربه‌گر؛ فعالیت‌های عملی و کم‌حرفی اضافی برایت جذاب است.",
  };
  return {
    code,
    type: `${code} · ${social} · ${pace}`,
    description: descriptions[code] || "پروفایل تو ترکیبی است و برای مچینگ نیاز به چند تعامل واقعی دیگر داریم.",
    matchingBasis: {
      mbtiLikeCode: code,
      socialEnergy: scores.EI,
      noveltyPreference: scores.SN,
      empathyLogic: scores.TF,
      structureNeed: scores.JP,
      groupAffinity: scores.SOCIAL,
      trustPace: scores.PACE,
    },
  };
}

export default function PersonalityTest() {
  const router = useRouter();
  const { setUser, state } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Option>>({});
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const scores = useMemo(() => Object.values(answers).reduce((acc, option) => {
    Object.entries(option.scores).forEach(([axis, value]) => { acc[axis as Axis] += value || 0; });
    return acc;
  }, { ...emptyScores }), [answers]);
  const result = buildResult(scores);

  const handleAnswer = async (questionId: number, option: Option) => {
    const next = { ...answers, [questionId]: option };
    setAnswers(next);
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion((q) => q + 1), 220);
      return;
    }
    setSaving(true);
    const finalScores = Object.values(next).reduce((acc, item) => {
      Object.entries(item.scores).forEach(([axis, value]) => { acc[axis as Axis] += value || 0; });
      return acc;
    }, { ...emptyScores });
    const finalResult = buildResult(finalScores);
    try {
      await saveTestResult({
        test_name: "raavi_matching_basis_v1",
        main_result: finalResult.type,
        scores: { ...finalScores, matchingBasis: finalResult.matchingBasis, answers: Object.fromEntries(Object.entries(next).map(([k, v]) => [k, v.id])) },
      });
      if (state.user) setUser({ ...state.user, isTestTaken: true });
    } catch {}
    setSaving(false);
    setShowResult(true);
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-100 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-orange-100">
          <div className="text-5xl mb-4">🧬</div>
          <p className="text-orange-500 text-xs font-black mb-2">مبنای اولیه مچینگ تو</p>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">{result.type}</h2>
          <p className="text-base text-gray-600 leading-8 mb-6">{result.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-7 text-right">
            {[
              ["انرژی اجتماعی", scores.EI], ["تنوع‌خواهی", scores.SN], ["همدلی/منطق", scores.TF],
              ["نیاز به ساختار", scores.JP], ["گروه‌پذیری", scores.SOCIAL], ["ریتم اعتماد", scores.PACE],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-lg font-black text-slate-900">{Number(value) > 0 ? "+" : ""}{String(value)}</p>
              </div>
            ))}
          </div>
          <button onClick={() => router.push("/dashboard")} className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-black hover:bg-orange-600 transition-colors">
            مشاهده نتیجه در داشبورد
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-100 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-2xl w-full">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
            <span>سوال {currentQuestion + 1} از {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} /></div>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-orange-100">
          <p className="text-orange-500 text-xs font-black mb-3">{question.basis}</p>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-9">{question.text}</h2>
          <div className="space-y-4 mt-8">
            {question.options.map((option) => (
              <button key={option.id} onClick={() => handleAnswer(question.id, option)} disabled={saving} className="w-full p-5 rounded-2xl border-2 text-right transition-all duration-300 hover:scale-[1.01] hover:shadow-lg border-orange-100 bg-orange-50 hover:border-orange-400 disabled:opacity-60">
                <div className="flex items-center gap-4"><span className="text-3xl">{option.icon}</span><span className="text-base font-bold text-gray-800">{option.text}</span></div>
              </button>
            ))}
          </div>
          {saving && <p className="text-center text-sm text-orange-500 mt-5 font-bold">در حال ذخیره نتیجه...</p>}
        </div>
      </div>
    </div>
  );
}
