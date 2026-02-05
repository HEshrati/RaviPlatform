"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import Link from "next/link";

const questions = [
  {
    id: 1,
    text: "وقتی با دیگران نظر متفاوتی دارید، چطور نظر خود را بیان می‌کنید؟",
    options: [
      {
        text: "سعی می‌کنم با آرامش صحبت کنم و نظرات او را بشنوم",
        score: "diplomatic",
      },
      {
        text: "مسلماً نظرم را می‌گویم و بحث می‌کنم تا حقم به جا برسد",
        score: "assertive",
      },
    ],
  },
  {
    id: 2,
    text: "در یک پروژه تیمی، نقش ترجیحی شما چیست؟",
    options: [
      { text: "رهبری و مدیریت تیم", score: "leader" },
      { text: "اجرای دقیق وظایف محوله", score: "executor" },
    ],
  },
];

export default function TestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = () => {
    if (selectedOption !== null && currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedOption(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-3xl">
        {/* هدر صفحه */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-slate-600"
          >
            <ChevronRight className="inline" /> بازگشت
          </Link>
          <h1 className="text-xl font-bold text-slate-800">
            MBTI و تست شخصیت‌شناسی
          </h1>
          <div className="w-24"></div> {/* Spacer for centering title */}
        </div>

        {/* نوار پیشرفت */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
            <span>پیشرفت</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-primary-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* کارت سوال */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 leading-tight">
            {questions[currentQuestion].text}
          </h2>

          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedOption(idx)}
                className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between group
                  ${
                    selectedOption === idx
                      ? "border-primary-500 bg-orange-50"
                      : "border-slate-200 hover:border-primary-300 hover:bg-slate-50"
                  }`}
              >
                <span
                  className={`text-lg md:text-xl ${selectedOption === idx ? "text-slate-900 font-semibold" : "text-slate-600"}`}
                >
                  {option.text}
                </span>
                {selectedOption === idx && (
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white">
                    <Check size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* دکمه‌های کنترل */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="px-6 py-3 text-slate-500 font-medium hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronRight size={20} /> بازگشت
          </button>

          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className="px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
          >
            {currentQuestion === questions.length - 1
              ? "پایان و مشاهده نتیجه"
              : "ادامه"}
            <ChevronLeft size={20} />
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          با ادامه دادن، شما با شرایط حریم خصوصی موافقت می‌کنید.
        </p>
      </div>
    </div>
  );
}
