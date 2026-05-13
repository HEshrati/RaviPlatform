"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const MIN_CHARS = 200;

export default function TestsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const sid = params?.get("sid") || "";
  const [data, setData] = useState<any>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/consultation-flow/${sid}/required-tests`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, [sid]);

  async function submit() {
    if (text.length < MIN_CHARS) { setErr(`حداقل ${MIN_CHARS} کاراکتر بنویسید`); return; }
    setSubmitting(true); setErr("");
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/consultation-flow/${sid}/concerns`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ concernsText: text }),
    });
    if (res.ok) router.push(`/dashboard/booking-flow/complete?sid=${sid}`);
    else { setErr("خطایی پیش آمد"); setSubmitting(false); }
  }

  const remaining = MIN_CHARS - text.length;
  const testLabels: Record<string, string> = {
    phq9: "PHQ-9 (افسردگی)", gad7: "GAD-7 (اضطراب)", bdi2: "BDI-II", bai: "BAI",
    dass21: "DASS-21", ecr_r: "ECR-R (دلبستگی)", love_languages: "زبان‌های عشق",
    iri: "IRI (همدلی)", mbti: "MBTI", neo_ffi: "NEO-FFI (شخصیت)",
  };

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5">←</button>
          <div>
            <p className="text-slate-500 text-xs mb-1">مرحله ۳ از ۳</p>
            <h1 className="text-2xl font-black text-white">دغدغه‌ها و تست‌ها</h1>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-500 text-center py-10">در حال بارگذاری...</div>
        ) : (
          <>
            {/* Privacy notice */}
            <div className="p-4 rounded-2xl mb-6 flex gap-3 items-start"
              style={{ background: "rgba(255,165,0,0.08)", border: "1px solid rgba(255,165,0,0.2)" }}>
              <span className="text-orange-400 text-xl flex-shrink-0">🔒</span>
              <p className="text-orange-200 text-sm leading-relaxed">
                {data?.privacyNote || "نتایج فقط برای روانشناست قابل مشاهده است."}
              </p>
            </div>

            {/* Required tests */}
            {data?.requiredTests?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-bold mb-3 text-sm">تست‌های مرتبط با موضوع شما:</h3>
                <div className="flex flex-wrap gap-2">
                  {data.requiredTests.map((t: string) => (
                    <span key={t} className="text-xs bg-white/5 border border-white/10 text-slate-300 px-3 py-1 rounded-full">
                      {testLabels[t] || t}
                    </span>
                  ))}
                </div>
                <p className="text-slate-500 text-xs mt-2">این تست‌ها توسط متخصص در جلسه با شما بررسی می‌شوند.</p>
              </div>
            )}

            {/* Main textarea */}
            <div className="mb-4">
              <label className="text-white font-bold text-sm block mb-3">
                دغدغه‌ها، افکار و احساساتتان را بنویسید
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="هر چه در ذهنتان می‌گذرد را آزادانه بنویسید. چه چیزی شما را نگران کرده؟ چه مدت است که این احساس را دارید؟ چه تجربه‌هایی داشته‌اید؟..."
                rows={8}
                className="w-full rounded-2xl p-4 text-sm resize-none outline-none text-white placeholder-slate-600"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${text.length >= MIN_CHARS ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.1)"}`,
                  lineHeight: "1.8",
                }}
              />
              <div className={`flex justify-between mt-2 text-xs ${
                text.length >= MIN_CHARS ? "text-green-400" : remaining > 50 ? "text-slate-500" : "text-orange-400"
              }`}>
                <span>{text.length >= MIN_CHARS ? "عالی، ادامه دهید" : `${remaining} کاراکتر دیگر بنویسید`}</span>
                <span>{text.length} / {MIN_CHARS}</span>
              </div>
            </div>

            {err && <p className="text-red-400 text-sm mb-4">{err}</p>}

            <button
              onClick={submit}
              disabled={text.length < MIN_CHARS || submitting}
              className={`w-full py-4 rounded-2xl font-black text-base transition-all ${
                text.length >= MIN_CHARS ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-white/5 text-slate-600 cursor-not-allowed"
              }`}
            >
              {submitting ? "در حال ارسال..." : "ارسال و تکمیل"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
