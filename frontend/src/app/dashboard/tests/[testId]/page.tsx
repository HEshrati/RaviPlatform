"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { getTestById, calculateScore } from "@/lib/test-questions";
import type { TestDefinition } from "@/lib/test-questions";
import { saveTestResult } from "@/lib/api";
import {
  ChevronLeft, ChevronRight, Brain, CheckCircle2,
  AlertCircle, Loader2, ArrowRight,
} from "lucide-react";

const CARD = {
  background: "white",
  border: "1px solid rgba(0,0,0,0.06)",
};

export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useApp();
  const testId = params.testId as string;

  const test = useMemo(() => getTestById(testId), [testId]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ total: number; label: string; description: string } | null>(null);

  if (!test || test.questions.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center" dir="rtl">
        <AlertCircle size={48} className="text-orange-400 mx-auto mb-4" />
        <h2 className="text-xl font-black text-slate-900 mb-2">
          {test ? "این تست قبلاً انجام شده" : "تست یافت نشد"}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {test ? "نتایج MBTI هنگام ثبت‌نام ثبت شده است." : "تست مورد نظر در سیستم وجود ندارد."}
        </p>
        <button
          onClick={() => router.push("/dashboard/tests-catalog")}
          className="px-6 py-3 rounded-2xl font-bold text-white text-sm"
          style={{ background: "linear-gradient(135deg, #FF6B00, #FF9A3C)" }}
        >
          بازگشت به کتابخانه تست‌ها
        </button>
      </div>
    );
  }

  const totalQ = test.questions.length;
  const question = test.questions[current];
  const progress = Math.round(((Object.keys(answers).length) / totalQ) * 100);
  const isComplete = Object.keys(answers).length === totalQ;

  function handleAnswer(qId: number, score: number) {
    setAnswers((prev) => ({ ...prev, [qId]: score }));
    if (current < totalQ - 1) {
      setTimeout(() => setCurrent((c) => c + 1), 300);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    const res = calculateScore(testId, answers);
    setResult(res);

    try {
      await saveTestResult({
        test_name: test.name,
        main_result: res.label,
        scores: { testId, score: res.total, answers },
      });
    } catch {
      // Save locally if API fails
      const stored = JSON.parse(localStorage.getItem("testResults") || "{}");
      stored[testId] = { score: res.total, label: res.label, date: new Date().toISOString() };
      localStorage.setItem("testResults", JSON.stringify(stored));
    }
    setSubmitting(false);
  }

  if (result) {
    return <ResultView test={test} result={result} onBack={() => router.push("/dashboard/tests-catalog")} />;
  }

  return (
    <div className="max-w-lg mx-auto pb-24 relative z-10" dir="rtl">
      {/* هدر */}
      <div className="sticky top-0 z-20 py-3 px-4 flex items-center gap-3"
        style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)" }}>
        <button onClick={() => router.push("/dashboard/tests-catalog")}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <ChevronRight size={20} className="text-slate-600" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-black text-slate-900 truncate">{test.fullName}</h1>
          <p className="text-[10px] text-slate-500">{test.name} · سوال {current + 1} از {totalQ}</p>
        </div>
        <div className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: "rgba(255,107,0,0.1)", color: "#FF6B00" }}>
          {progress}%
        </div>
      </div>

      {/* نوار پیشرفت */}
      <div className="mx-4 mb-6">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #FF6B00, #FF9A3C)" }} />
        </div>
      </div>

      {/* دستورالعمل (فقط در سوال اول) */}
      {current === 0 && (
        <div className="mx-4 mb-4 p-4 rounded-2xl"
          style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="text-indigo-400 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600 leading-6">{test.instructions}</p>
          </div>
        </div>
      )}

      {/* سوال */}
      <div className="mx-4 rounded-3xl p-6 mb-4" style={CARD}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
            style={{ background: "rgba(255,107,0,0.1)", color: "#FF6B00" }}>
            {current + 1}
          </div>
          <span className="text-[10px] text-slate-400">{test.construct}</span>
        </div>

        <h2 className="text-base font-black text-slate-900 leading-8 mb-6">
          {question.text}
        </h2>

        <div className="space-y-2.5">
          {question.options.map((opt) => {
            const selected = answers[question.id] === opt.score;
            return (
              <button
                key={opt.id}
                onClick={() => handleAnswer(question.id, opt.score)}
                className="w-full text-right p-4 rounded-2xl transition-all duration-200 active:scale-[0.98]"
                style={selected ? {
                  background: "linear-gradient(135deg, #FF6B00, #FF9A3C)",
                  color: "white",
                  border: "2px solid #FF6B00",
                  boxShadow: "0 4px 16px rgba(255,107,0,0.3)",
                } : {
                  background: "rgba(0,0,0,0.02)",
                  border: "2px solid rgba(0,0,0,0.06)",
                  color: "#334155",
                }}
              >
                <span className="text-sm font-bold">{opt.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ناوبری */}
      <div className="mx-4 flex items-center gap-3">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-slate-600 disabled:opacity-30 transition-all"
          style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}>
          <ChevronRight size={16} /> قبلی
        </button>

        {isComplete ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black text-white transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #FF6B00, #FF9A3C)", boxShadow: "0 4px 16px rgba(255,107,0,0.3)" }}>
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
            مشاهده نتیجه
          </button>
        ) : (
          <button
            onClick={() => setCurrent((c) => Math.min(totalQ - 1, c + 1))}
            disabled={current === totalQ - 1}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-orange-600 disabled:opacity-30 transition-all"
            style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.2)" }}>
            بعدی <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* نقشه سوالات */}
      <div className="mx-4 mt-6 p-4 rounded-2xl" style={CARD}>
        <p className="text-[10px] text-slate-400 mb-2 font-bold">نقشه پاسخ‌ها</p>
        <div className="flex flex-wrap gap-1.5">
          {test.questions.map((q, i) => (
            <button key={q.id}
              onClick={() => setCurrent(i)}
              className="w-7 h-7 rounded-lg text-[10px] font-bold transition-all"
              style={
                i === current
                  ? { background: "#FF6B00", color: "white" }
                  : answers[q.id] !== undefined
                  ? { background: "rgba(34,197,94,0.15)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.3)" }
                  : { background: "rgba(0,0,0,0.04)", color: "#94a3b8", border: "1px solid rgba(0,0,0,0.06)" }
              }>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultView({ test, result, onBack }: {
  test: TestDefinition;
  result: { total: number; label: string; description: string };
  onBack: () => void;
}) {
  const percentage = Math.round((result.total / test.scoring.maxScore) * 100);

  return (
    <div className="max-w-lg mx-auto pb-24 px-4 relative z-10" dir="rtl">
      <div className="mt-8 rounded-3xl p-6 text-center" style={{
        background: "white", border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      }}>
        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(34,197,94,0.1)" }}>
          <CheckCircle2 size={40} className="text-green-500" />
        </div>

        <h2 className="text-xl font-black text-slate-900 mb-1">تست تکمیل شد!</h2>
        <p className="text-sm text-slate-500 mb-6">{test.fullName}</p>

        {/* نمره */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: "rgba(255,107,0,0.06)" }}>
          <div className="text-4xl font-black mb-1" style={{ color: "#FF6B00" }}>{result.total}</div>
          <p className="text-xs text-slate-500">از {test.scoring.maxScore} نمره</p>
          <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
            <div className="h-full rounded-full" style={{
              width: `${percentage}%`,
              background: percentage > 70 ? "#ef4444" : percentage > 40 ? "#f59e0b" : "#22c55e",
            }} />
          </div>
        </div>

        {/* برچسب */}
        <div className="rounded-2xl p-4 mb-4" style={{
          background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)",
        }}>
          <p className="text-lg font-black text-indigo-600 mb-1">{result.label}</p>
          <p className="text-sm text-slate-600 leading-7">{result.description}</p>
        </div>

        {/* محدوده‌ها */}
        <div className="space-y-2 mb-6">
          {test.scoring.ranges.map((range) => {
            const active = result.total >= range.min && result.total <= range.max;
            return (
              <div key={range.label} className="flex items-center gap-3 p-3 rounded-xl text-right"
                style={active ? {
                  background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.2)",
                } : { background: "rgba(0,0,0,0.02)" }}>
                <div className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: active ? "#FF6B00" : "#cbd5e1" }} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold" style={{ color: active ? "#FF6B00" : "#94a3b8" }}>
                    {range.label}
                  </span>
                  <span className="text-[10px] text-slate-400 mr-2">({range.min}-{range.max})</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={onBack}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-slate-600 transition-all"
            style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}>
            بازگشت به تست‌ها
          </button>
          <button onClick={() => window.location.href = "/dashboard/recommendations"}
            className="flex-1 py-3 rounded-2xl text-sm font-black text-white transition-all"
            style={{ background: "linear-gradient(135deg, #FF6B00, #FF9A3C)" }}>
            پیشنهادات <ArrowRight size={14} className="inline mr-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
