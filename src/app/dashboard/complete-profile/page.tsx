"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";

function CompleteProfileContent() {
  const searchParams = useSearchParams();
  const { state, dispatch } = useAppContext();
  const [selectedCity, setSelectedCity] = useState(state.userCity || "");
  const [testCompleted, setTestCompleted] = useState(state.isTestTaken || false);

  const cities = [
    "تهران",
    "مشهد",
    "اصفهان",
    "شیراز",
    "تبریز",
    "کرج",
    "اهواز",
    "قم",
  ];

  const handleSaveProfile = () => {
    if (selectedCity) {
      dispatch({ type: "SET_USER_CITY", payload: selectedCity });
    }
    dispatch({ type: "SET_PROFILE_COMPLETE", payload: true });
  };

  const handleTestCompletion = () => {
    setTestCompleted(true);
    dispatch({ type: "SET_TEST_TAKEN", payload: true });
  };

  const isProfileReady = selectedCity && testCompleted;

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            تکمیل پروفایل
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-2">
            برای استفاده از امکانات راوی، پروفایل خود را تکمیل کنید
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-8 bg-orange-500 rounded-full inline-block"></span>
          <h3 className="font-black text-xl text-slate-800">انتخاب شهر سکونت</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition ${
                selectedCity === city
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {selectedCity && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={20} />
            <p className="text-green-800 font-bold text-sm">
              شهر انتخاب شده: {selectedCity}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-8 bg-orange-500 rounded-full inline-block"></span>
          <h3 className="font-black text-xl text-slate-800">
            تست روانشناسی تطبیق
          </h3>
        </div>

        {!testCompleted ? (
          <div>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
              برای یافتن بهترین هم‌نشین، باید تست روانشناسی را تکمیل کنید. این
              تست تنها ۱۰-۱۵ دقیقه زمان می‌برد.
            </p>
            <Link
              href="/test"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg"
            >
              شروع تست <ArrowLeft size={18} />
            </Link>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={20} />
            <p className="text-green-800 font-bold text-sm">
              تست با موفقیت تکمیل شد!
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold text-sm transition shadow-sm"
        >
          <ArrowRight size={18} />
          بازگشت به داشبورد
        </Link>

        <button
          onClick={handleSaveProfile}
          disabled={!isProfileReady}
          className={`px-8 py-3 rounded-xl font-bold text-sm transition shadow-lg ${
            isProfileReady
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          ذخیره و ادامه
        </button>
      </div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<div className="text-center py-10">در حال بارگذاری...</div>}>
      <CompleteProfileContent />
    </Suspense>
  );
}
