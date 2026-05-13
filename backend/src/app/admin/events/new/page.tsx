"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { isAdminPhone } from "@/lib/api";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Tag,
  Clock,
  FileText,
  DollarSign,
  Save,
  AlertCircle,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const CATEGORIES = [
  { id: "hamneshin", title: "همنشین" },
  { id: "hamsohbat", title: "هم‌صحبت" },
  { id: "hambazi", title: "هم‌بازی" },
  { id: "hampa", title: "هم‌پا" },
  { id: "hamamooz", title: "هم‌آموز" },
  { id: "hamkar", title: "همکار" },
  { id: "hamfekr", title: "هم‌فکر" },
  { id: "hamteymi", title: "هم‌تیمی" },
  { id: "hamghesse", title: "هم‌قصه" },
];

const CITIES = [
  "تهران", "مشهد", "اصفهان", "شیراز", "تبریز", "کرج", "قم", "اهواز",
  "کرمانشاه", "ارومیه", "رشت", "زاهدان", "کرمان", "همدان", "یزد",
];

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

export default function AdminNewEventPage() {
  const { state } = useApp();
  const router = useRouter();
  const isAdmin = isAdminPhone(state.user?.mobileNumber);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "hamneshin",
    city: "تهران",
    location: "",
    start_date: "",
    start_time: "",
    capacity: 10,
    price: 0,
    tags: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (key: string, val: any) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) return setError("عنوان رویداد الزامی است.");
    if (!form.location.trim()) return setError("مکان برگزاری الزامی است.");
    if (!form.start_date) return setError("تاریخ برگزاری الزامی است.");
    if (!form.start_time) return setError("ساعت برگزاری الزامی است.");

    setSaving(true);
    try {
      const startDatetime = `${form.start_date}T${form.start_time}:00`;
      const tagsArr = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch(`${API}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          city: form.city,
          location: form.location.trim(),
          start_date: startDatetime,
          capacity: Number(form.capacity),
          price: Number(form.price),
          tags: tagsArr,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "خطا در ایجاد رویداد");
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/events"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-3 text-red-400" size={48} />
          <p className="text-white font-bold text-xl mb-3">دسترسی محدود</p>
          <p className="text-slate-400 text-sm mb-4">فقط ادمین‌ها می‌توانند رویداد جدید بسازند</p>
          <button onClick={() => router.push("/admin/dashboard")} className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold">
            بازگشت به داشبورد ادمین
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-white font-black text-xl">رویداد با موفقیت ایجاد شد!</p>
          <p className="text-slate-400 text-sm mt-1">در حال انتقال...</p>
        </div>
      </div>
    );
  }

  const CARD = {
    background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)",
    border: "1px solid rgba(255,255,255,0.07)",
  };

  const inp =
    "w-full rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-orange-400 transition placeholder:text-slate-500";
  const inpStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" } as React.CSSProperties;

  return (
    <div className="min-h-screen p-6 md:p-8" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* هدر */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <ArrowRight size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white">افزودن همنشینی جدید</h1>
            <p className="text-slate-400 text-sm mt-0.5">رویداد جدید در پلتفرم راوی</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-2xl px-4 py-3 flex items-center gap-2 bg-red-500/10 border border-red-500/30">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* اطلاعات اصلی */}
          <div className="rounded-2xl p-5 space-y-4" style={CARD}>
            <h2 className="text-white font-black text-base flex items-center gap-2">
              <FileText size={18} className="text-orange-400" />
              اطلاعات اصلی
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">عنوان رویداد *</label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className={inp}
                style={inpStyle}
                placeholder="مثال: دورهمی همنشین آخر هفته"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">توضیحات</label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className={`${inp} resize-none`}
                style={inpStyle}
                placeholder="توضیح مختصری از رویداد..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">دسته‌بندی</label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className={inp}
                  style={inpStyle}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-800">
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  تگ‌ها (جدا با کاما)
                </label>
                <input
                  value={form.tags}
                  onChange={(e) => set("tags", e.target.value)}
                  className={inp}
                  style={inpStyle}
                  placeholder="بازی، گروهی"
                />
              </div>
            </div>
          </div>

          {/* زمان و مکان */}
          <div className="rounded-2xl p-5 space-y-4" style={CARD}>
            <h2 className="text-white font-black text-base flex items-center gap-2">
              <MapPin size={18} className="text-orange-400" />
              زمان و مکان
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">شهر</label>
                <select
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className={inp}
                  style={inpStyle}
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-800">{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">آدرس / مکان *</label>
                <input
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  className={inp}
                  style={inpStyle}
                  placeholder="کافه، پارک، خانه فرهنگ..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">تاریخ برگزاری *</label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => set("start_date", e.target.value)}
                  className={`${inp} text-left`}
                  style={inpStyle}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">ساعت شروع *</label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) => set("start_time", e.target.value)}
                  className={`${inp} text-left`}
                  style={inpStyle}
                  required
                />
              </div>
            </div>
          </div>

          {/* ظرفیت و قیمت */}
          <div className="rounded-2xl p-5 space-y-4" style={CARD}>
            <h2 className="text-white font-black text-base flex items-center gap-2">
              <Users size={18} className="text-orange-400" />
              ظرفیت و قیمت
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">ظرفیت (نفر)</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => set("capacity", e.target.value)}
                  className={`${inp} text-left`}
                  style={inpStyle}
                  min={2}
                  max={100}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">قیمت (تومان)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className={`${inp} text-left`}
                  style={inpStyle}
                  min={0}
                  step={1000}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-slate-400 transition-all hover:text-white"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3.5 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{ background: saving ? "rgba(249,115,22,0.5)" : "linear-gradient(135deg,#FF6B00,#FF9A3C)" }}
            >
              <Save size={16} />
              {saving ? "در حال ذخیره..." : "ذخیره رویداد"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
