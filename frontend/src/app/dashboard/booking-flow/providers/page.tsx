"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ProvidersPage() {
  const router = useRouter();
  const params = useSearchParams();
  const sid = params?.get("sid") || "";
  const [data, setData] = useState<any>(null);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/consultation-flow/${sid}/providers`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, [sid]);

  async function next() {
    if (!selected) return;
    setSubmitting(true);
    const token = localStorage.getItem("token");
    await fetch(`${API}/api/consultation-flow/${sid}/provider`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ providerId: selected }),
    });
    router.push(`/dashboard/booking-flow/tests?sid=${sid}`);
  }

  const providers = data?.providers || [];

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5">←</button>
          <div>
            <p className="text-slate-500 text-xs mb-1">مرحله ۲ از ۳</p>
            <h1 className="text-2xl font-black text-white">
              {data?.topic ? data.topic.icon + " " + data.topic.name : "انتخاب متخصص"}
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-500 text-center py-10">در حال بارگذاری...</div>
        ) : providers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔜</div>
            <div className="text-white font-bold mb-2">به زودی اضافه می‌شوند</div>
            <div className="text-slate-500 text-sm">{data?.note || "متخصصان این حوزه در حال ثبت‌نام هستند"}</div>
            <button
              onClick={() => router.push("/dashboard/booking-flow/tests?sid=" + sid + "&skip=1")}
              className="mt-6 px-6 py-3 bg-orange-500 rounded-xl font-bold text-white"
            >
              ادامه بدون انتخاب متخصص
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {providers.map((p: any) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`w-full p-4 rounded-2xl border transition-all text-right flex items-start gap-4 ${
                    selected === p.id ? "border-orange-500 bg-orange-500/10" : "border-white/10 hover:border-orange-500/30"
                  }`}
                  style={{ background: selected === p.id ? undefined : "rgba(255,255,255,0.03)" }}
                >
                  {p.avatar_url ? (
                    <img src={p.avatar_url} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" alt="" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0 text-2xl">👨‍⚕️</div>
                  )}
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm">{p.user?.name || "متخصص"}</div>
                    <div className="text-slate-400 text-xs mt-1">{p.years_of_experience} سال تجربه</div>
                    {p.specialties?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.specialties.slice(0, 3).map((s: string) => (
                          <span key={s} className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/20">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={next}
              disabled={!selected || submitting}
              className={`w-full mt-6 py-4 rounded-2xl font-black text-base transition-all ${
                selected ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-white/5 text-slate-600 cursor-not-allowed"
              }`}
            >
              {submitting ? "در حال ثبت..." : "مرحله بعد →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
