"use client";

import { useAppContext } from "@/context/AppContext";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

const cities = [
  "تهران",
  "مشهد",
  "اصفهان",
  "شیراز",
  "تبریز",
  "کرج",
  "قم",
  "اهواز",
  "کرمانشاه",
  "ارومیه",
  "رشت",
  "زاهدان",
  "کرمان",
  "همدان",
  "یزد",
];

export default function CompleteProfilePage() {
  const { state, dispatch } = useAppContext();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [step, setStep] = useState<"city" | "test">("city");

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  const handleCitySubmit = () => {
    if (selectedCity) {
      dispatch({ type: "SET_CITY", payload: selectedCity });
    }
    setStep("test");
  };

  const handleProfileCompletion = () => {
    if (selectedCity) {
      dispatch({ type: "SET_CITY", payload: selectedCity });
    }
    // ✅ اصلاح شده: بدون payload
    dispatch({ type: "COMPLETE_PROFILE" });
  };

  const handleTestCompletion = () => {
    dispatch({ type: "TAKE_TEST" });
  };

  if (state.isProfileComplete && state.isTestTaken) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            پروفایل شما کامل شد! 🎉
          </h1>
          <p className="text-slate-600 mb-6">
            حالا می‌توانید در رویدادهای متناسب با شخصیت‌تان شرکت کنید.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition"
          >
            بازگشت به داشبورد
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            تکمیل پروفایل
          </h1>
          <p className="text-slate-600">
            برای پیشنهاد رویدادهای بهتر، لطفاً اطلاعات زیر را تکمیل کنید
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === "city"
                  ? "bg-orange-500 text-white"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              ۱
            </div>
            <div className="text-sm font-medium mx-2">شهر محل سکونت</div>
          </div>

          <div className="w-16 h-1 bg-slate-200 mx-4"></div>

          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === "test"
                  ? "bg-orange-500 text-white"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              ۲
            </div>
            <div className="text-sm font-medium mx-2">تست شخصیت‌شناسی</div>
          </div>
        </div>

        {/* Content */}
        {step === "city" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              شهر محل سکونت خود را انتخاب کنید
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className={`py-3 px-4 rounded-lg border transition ${
                    selectedCity === city
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
            <button
              onClick={handleCitySubmit}
              disabled={!selectedCity}
              className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                selectedCity
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              ادامه
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              تست شخصیت‌شناسی راوی
            </h2>
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-medium text-slate-900 mb-2">
                  چرا باید تست شخصیت‌شناسی بدهم؟
                </h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs ml-2 mt-0.5">
                      ✓
                    </div>
                    <span>شناسایی دقیق تیپ شخصیتی شما</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs ml-2 mt-0.5">
                      ✓
                    </div>
                    <span>پیشنهاد رویدادهای متناسب با شخصیت شما</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs ml-2 mt-0.5">
                      ✓
                    </div>
                    <span>ارتباط با افرادی که بیشترین سازگاری را دارید</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-medium text-slate-900 mb-2">
                  نحوه انجام تست
                </h3>
                <p className="text-slate-600 text-sm">
                  تست شامل ۳۰ سوال چندگزینه‌ای است که حدود ۱۰ دقیقه زمان می‌برد.
                  پاسخ‌های شما به صورت کاملاً محرمانه نگهداری می‌شود و تنها برای
                  بهبود تجربه شما استفاده می‌شود.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setStep("city")}
                  className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
                >
                  بازگشت
                </button>
                <button
                  onClick={handleProfileCompletion}
                  className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition"
                >
                  شروع تست شخصیت‌شناسی
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
