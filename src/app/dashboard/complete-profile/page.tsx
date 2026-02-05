"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/AppContext";
import { ArrowLeft, Save } from "lucide-react";

export default function CompleteProfilePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get("redirect") || "/events/next/booking";

  const { state, dispatch } = useAppContext();
  const { userCity, isTestTaken } = state; // دریافت اطلاعات موجود

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const city = (formData.get("city") as string) || "تهران";
    // در اینجا می‌توانید سایر فیلدها را هم ذخیره کنید

    // شبیه‌سازی ذخیره در سرور
    await new Promise((r) => setTimeout(r, 600));

    // ذخیره در کانتکست
    dispatch({ type: "SET_CITY", payload: city });
    dispatch({ type: "COMPLETE_PROFILE" });

    setLoading(false);

    // منطق هوشمند هدایت کاربر
    if (isTestTaken) {
      // اگر کاربر قبلاً تست را داده، به پروفایل برگردد (چون فقط ویرایش کرده)
      router.push("/dashboard/profile");
    } else {
      // اگر تست نداده، به صفحه تست برود
      router.push(`/test?redirect=${encodeURIComponent(redirect)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 lg:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-slate-800">
            {isTestTaken ? "ویرایش اطلاعات پروفایل" : "تکمیل پروفایل کاربری"}
          </h1>
          <button
            onClick={() => router.back()}
            className="text-slate-400 hover:text-slate-800 transition"
          >
            <ArrowLeft />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              نام و نام خانوادگی
            </label>
            <Input
              name="fullname"
              placeholder="مثلاً: آرین رضایی"
              // اگر نام در کانتکست بود اینجا قرار دهید، فعلا یک مقدار پیش‌فرض می‌گذاریم
              defaultValue="سارا جهانگیری"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              شهر سکونت
            </label>
            <Input
              name="city"
              placeholder="مثلاً: تهران"
              // پر کردن خودکار با مقدار موجود در کانتکست
              defaultValue={userCity || ""}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              شغل / تخصص
            </label>
            <Input
              name="job"
              placeholder="مثلاً: برنامه‌نویس ارشد"
              defaultValue="توسعه‌دهنده وب"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              علایق
            </label>
            <Input
              name="interests"
              placeholder="مثلاً: فیلم، موسیقی، بازی‌های فکری"
              defaultValue="کتاب، سفر، تکنولوژی"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white rounded-xl py-4 font-bold transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:shadow-orange-500/25"
            } ${
              // تغییر رنگ دکمه بر اساس وضعیت تست
              isTestTaken
                ? "bg-slate-900 hover:bg-slate-800"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? (
              "در حال ذخیره..."
            ) : isTestTaken ? (
              <>
                <Save size={20} />
                ذخیره تغییرات
              </>
            ) : (
              <>
                ثبت و شروع تست روانشناسی
                <ArrowLeft size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
