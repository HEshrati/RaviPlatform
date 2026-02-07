"use client";

import { EVENTS_DATA } from "@/lib/events-data";
import { Search, MapPin, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ExploreEvents() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header & Search */}
      <div className="mb-8 space-y-4">
        <h1 className="text-2xl font-black text-slate-900">کاوش رویدادها</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="جستجو در رویدادها..."
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pr-10 pl-4 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EVENTS_DATA.map((event) => (
          <Link
            href={`/events/${event.id}/booking`}
            key={event.id}
            className="group"
          >
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1 h-full flex flex-col">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-bold flex items-center gap-1">
                    مشاهده جزئیات <ArrowLeft size={12} />
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {event.category}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>

                <div className="mt-auto space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {event.city}
                    </span>
                  </div>
                  <div className="text-slate-900 font-black text-sm text-left">
                    {event.price.toLocaleString("fa-IR")}{" "}
                    <span className="text-[10px] font-normal text-slate-500">
                      تومان
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
