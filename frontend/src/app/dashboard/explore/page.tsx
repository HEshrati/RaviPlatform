"use client";


import { useState } from "react";
import { EVENTS_DATA } from "@/lib/events-data";
import { Search, MapPin, Calendar, ArrowLeft, Compass, Filter } from "lucide-react";
import Link from "next/link";

export default function ExploreEvents() {
  const [query, setQuery] = useState("");

  const filtered = EVENTS_DATA.filter((e) =>
    !query || e.title?.toLowerCase().includes(query.toLowerCase()) ||
    e.category?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto pb-8 space-y-5">

      {/* Header */}
      <div className="rounded-3xl p-5 border border-white/8"
        style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #0f172a 100%)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,107,0,0.2)", border: "1px solid rgba(255,107,0,0.3)" }}>
            <Compass size={20} className="text-orange-400" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">کشف همنشینی</h1>
            <p className="text-slate-400 text-xs">همنشینی‌های متناسب با شما</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input
            type="text"
            placeholder="جستجو در همنشینی‌ها..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl pr-9 pl-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-orange-500"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          />
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl p-10 text-center border border-white/8"
          style={{ background: "rgba(255,255,255,0.03)" }}>
          <Search size={32} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">همنشینی یافت نشد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.slice(0, 12).map((event) => (
            <Link href={`/events/${event.id}`} key={event.id} className="group block">
              <div className="rounded-2xl overflow-hidden border border-white/8 hover:border-orange-500/30 transition-all hover:-translate-y-0.5"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img
                    src={event.image || "/categories/1.PNG"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {event.category && (
                    <span className="absolute top-2 right-2 text-[10px] font-black bg-orange-500 text-white px-2 py-0.5 rounded-full">
                      {event.category}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-black text-white text-sm mb-2 line-clamp-2">{event.title}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {(event as any).city || "تهران"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-black text-orange-400 text-sm">
                      {Number(event.price || 0).toLocaleString("fa-IR")} تومان
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      مشاهده <ArrowLeft size={10} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
