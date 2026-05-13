"use client";


import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Star, MapPin, Globe, CheckCircle2, Calendar, Clock, Award, Zap, Loader2, Lock } from "lucide-react";
import { myTherapistAPI, type TherapistProfile, type SessionMode } from "@/app/lib/my-therapist-api";
import { MOCK_THERAPISTS } from "@/app/lib/my-therapist-mock";

export default function TherapistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [therapist, setTherapist] = useState<TherapistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [selectedMode, setSelectedMode] = useState<SessionMode>("online");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    myTherapistAPI.getTherapist(id)
      .then(data => setTherapist(data || MOCK_THERAPISTS.find(t => t.id === id) || null))
      .catch(() => setTherapist(MOCK_THERAPISTS.find(t => t.id === id) || null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleBook() {
    if (!selectedSlot || !therapist) return;
    setBooking(true);
    try {
      const res = await myTherapistAPI.bookSession({ therapistId: therapist.id, slotDate: selectedSlot.date, slotTime: selectedSlot.time, mode: selectedMode });
      if ((res as any)?.paymentUrl) window.location.href = (res as any).paymentUrl;
      else router.push("/payment-success?type=therapy_session");
    } catch (e) { alert("خطا در رزرو جلسه"); }
    finally { setBooking(false); }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={36} className="animate-spin text-orange-500" /></div>;
  if (!therapist) return <div className="min-h-screen flex items-center justify-center">روانشناس پیدا نشد</div>;

  return (
    <div className="min-h-screen pb-32" dir="rtl">
      <div className="sticky top-0 z-30 border-b bg-white/85 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-100"><ChevronLeft size={20} /></button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="mt-5 rounded-3xl overflow-hidden bg-gradient-to-r from-[#1B2A4A] to-[#0d1e35] p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 flex items-center justify-center text-white font-black text-2xl">
              {therapist.name.slice(0, 2)}
            </div>
            <div>
              <h2 className="font-black text-white text-xl">{therapist.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-white">{therapist.rating}</span>
              </div>
              {therapist.matchScore && <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400"><Zap size={10} /> {therapist.matchScore}٪ تطابق</div>}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
          <h3 className="font-black mb-2">درباره من</h3>
          <p className="text-sm text-slate-600">{therapist.bio}</p>
        </div>

        <div className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
          <h3 className="font-black mb-3 flex items-center gap-2"><Award size={16} className="text-orange-500" /> مدارک</h3>
          {therapist.credentials.map(c => <div key={c} className="flex items-center gap-2 text-sm"><CheckCircle2 size={14} className="text-green-500" /> {c}</div>)}
        </div>

        {therapist.availableSlots && therapist.availableSlots.length > 0 && (
          <div className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="font-black mb-3 flex items-center gap-2"><Calendar size={16} className="text-orange-500" /> زمان‌های در دسترس</h3>
            <div className="grid grid-cols-2 gap-2">
              {therapist.availableSlots.map((slot, i) => (
                <button key={i} onClick={() => setSelectedSlot(slot)} className="rounded-xl p-3 text-center" style={selectedSlot === slot ? { background: "linear-gradient(135deg,#FF6B00,#FF9A3C)", color: "white" } : { background: "#f1f5f9" }}>
                  <div className="text-xs">{slot.date}</div>
                  <div className="text-sm font-black">{slot.time}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 rounded-2xl p-4 bg-green-50 flex items-start gap-2">
          <Lock size={16} className="text-green-600" />
          <p className="text-xs text-green-700">تمام جلسات محرمانه است. اطلاعات شما با هیچکس به اشتراک گذاشته نمی‌شود.</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-slate-500">هزینه جلسه</div>
            <div className="text-lg font-black">{therapist.pricePerSession.toLocaleString()} تومان</div>
          </div>
          <button onClick={handleBook} disabled={!selectedSlot || booking} className="px-6 py-3 rounded-2xl text-white font-black bg-gradient-to-r from-orange-500 to-orange-400 disabled:opacity-50">
            {booking ? <Loader2 size={16} className="animate-spin" /> : selectedSlot ? "رزرو جلسه" : "زمان را انتخاب کنید"}
          </button>
        </div>
      </div>
    </div>
  );
}
