"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Users, MapPin, Globe, Calendar, Sparkles, Filter, Zap, Shield } from "lucide-react";
import { myTherapistAPI, type SupportGroup } from "@/app/lib/my-therapist-api";
import { MOCK_GROUPS } from "@/app/lib/my-therapist-mock";

export default function HamZistehListPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myTherapistAPI.getGroups()
      .then(data => setGroups(data.length > 0 ? data : MOCK_GROUPS))
      .catch(() => setGroups(MOCK_GROUPS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen pb-28" dir="rtl">
      <div className="sticky top-0 z-30 border-b bg-white/85 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push("/dashboard/my-therapist")} className="p-2 rounded-xl hover:bg-slate-100">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-indigo-500" />
            <h1 className="text-base font-black">هم‌زیسته</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="mt-5 mb-5 rounded-3xl p-5 bg-gradient-to-r from-[#1a1035] to-[#3b1d63] text-white">
          <h2 className="text-xl font-black">{groups.length} گروه برای شما پیدا شد</h2>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {groups.map((g) => (
            <Link key={g.id} href={`/dashboard/my-therapist/ham-ziste/${g.id}`} className="rounded-3xl bg-white p-5 shadow-sm hover:shadow-xl transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black">{g.name}</h3>
                  <p className="text-xs text-indigo-600 font-bold mt-1">{g.topic}</p>
                </div>
                {g.matchScore && <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700"><Zap size={10} /> {g.matchScore}٪</div>}
              </div>
              <p className="text-xs text-slate-600 mt-2 line-clamp-2">{g.description}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                <Calendar size={11} /> {g.schedule}
                {g.mode === "online" ? <Globe size={11} /> : <MapPin size={11} />}
                {g.mode === "online" ? "آنلاین" : g.city}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <span>{g.membersCount}/{g.capacity} عضو</span>
                <span className="text-sm font-black">{g.pricePerMonth.toLocaleString()} تومان/ماه</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
