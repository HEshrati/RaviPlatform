"use client";


import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Home, Save, MapPin, Bell, X } from "lucide-react";
import { eventsAPI, isAdminPhone } from "@/lib/api";
import { useApp } from "@/context/AppContext";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useApp();
  const eventId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (!isAdminPhone(state.user?.mobileNumber)) {
      router.replace("/dashboard");
      return;
    }
    eventsAPI.get(eventId).then((data) => {
      setForm(data);
      setLoading(false);
    }).catch(() => {
      setError("خطا در بارگذاری");
      setLoading(false);
    });
  }, [eventId, state.user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await eventsAPI.update(eventId, form);
      setSuccess("تغییرات ذخیره شد!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  const handleLocationNotify = async () => {
    if (!form.location || !form.city) {
      setError("ابتدا مکان دقیق و شهر را وارد کنید");
      return;
    }
    setNotifying(true);
    try {
      const result = await eventsAPI.updateLocationAndNotify(eventId, form.location, form.city);
      setSuccess(result.message || "مکان آپدیت شد و کاربران مطلع شدند");
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || "خطا در ارسال اعلان");
    } finally {
      setNotifying(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const inputClass = "bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500 transition placeholder-slate-500 w-full";

  return (
    <div className="min-h-screen pb-28 pt-6 px-4" dir="rtl">
      <div className="max-w-lg mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="text-slate-400 hover:text-orange-400 transition">
            <ArrowRight size={22} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-white">ویرایش همنشینی</h1>
            <p className="text-slate-500 text-sm truncate">{form.title}</p>
          </div>
          <Link href="/" className="text-slate-400 hover:text-orange-400">
            <Home size={20} />
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-2xl p-4 mb-4 text-sm flex items-center justify-between">
            {error}
            <button onClick={() => setError(null)}><X size={16} /></button>
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-400 rounded-2xl p-4 mb-4 text-sm">
            ✅ {success}
          </div>
        )}

        {/* بخش آپدیت مکان - با اعلان فوری */}
        <div className="rounded-3xl p-5 mb-5 border border-yellow-600/30" style={{ backgroundColor: "#1a1a2e" }}>
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-yellow-500" />
            <h3 className="font-black text-white">آپدیت مکان + اعلان فوری</h3>
          </div>
          <p className="text-slate-400 text-xs mb-3">
            با کلیک روی «آپدیت و اطلاع‌رسانی»، مکان جدید به همه رزروکنندگان از طریق پیامک و اعلان سایت ارسال می‌شود.
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="شهر (عمومی)"
              value={form.city || ""}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="مکان دقیق (محرمانه - ۱۰ ساعت آخر)"
              value={form.location || ""}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={`${inputClass} border-dashed border-yellow-600/50`}
            />
            <button
              type="button"
              onClick={handleLocationNotify}
              disabled={notifying}
              className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 rounded-2xl transition disabled:opacity-60"
            >
              {notifying
                ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                : <><Bell size={18} /> آپدیت مکان + اطلاع‌رسانی</>
              }
            </button>
          </div>
        </div>

        {/* فرم ویرایش اطلاعات */}
        <form onSubmit={handleSave} className="space-y-4">
          <h3 className="font-black text-white text-base">ویرایش اطلاعات</h3>

          {(() => {
            const eventStarted = form.start_date && new Date(form.start_date) <= new Date();
            return [
              { key: "title", label: "عنوان", type: "text", locked: false },
              { key: "image_url", label: "URL تصویر", type: "url", locked: false },
              { key: "capacity", label: "ظرفیت", type: "number", locked: false },
              { key: "price", label: "قیمت (تومان)", type: "number", locked: !!eventStarted },
            ].map(({ key, label, type, locked }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-300">
                  {label}
                  {locked && <span className="text-xs text-red-400 mr-2">🔒 قفل (رویداد شروع شده)</span>}
                </label>
                <input
                  type={type}
                  value={form[key] ?? ""}
                  onChange={(e) => !locked && setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
                  className={inputClass + (locked ? " opacity-50 cursor-not-allowed" : "")}
                  disabled={locked}
                />
              </div>
            ));
          })()}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-300">توضیحات</label>
            <textarea
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {form.image_url && (
            <img src={form.image_url} alt="" className="h-40 w-full object-cover rounded-2xl" />
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-black py-4 rounded-2xl transition disabled:opacity-60 shadow-lg shadow-orange-500/30"
          >
            {saving
              ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><Save size={18} /> ذخیره تغییرات</>
            }
          </button>

          <Link
            href={`/events/${eventId}`}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-2xl transition border border-slate-700"
          >
            مشاهده صفحه رزرو این همنشینی
          </Link>
        </form>
      </div>
    </div>
  );
}
