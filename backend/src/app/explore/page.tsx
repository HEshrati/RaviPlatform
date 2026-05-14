'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchEvents, ApiEvent } from '@/lib/api';

export default function ExplorePage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [filters, setFilters] = useState({ city: '', category: '', date: '', price: '' as '' | 'free' | 'paid' });

  useEffect(() => {
    fetchEvents({ ...filters, limit: 24 }).then((res) => setEvents(res.events));
  }, [filters]);

  return (
    <main className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black mb-6">اکسپلور همنشینی‌ها</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <input className="rounded-xl border p-2" placeholder="شهر" value={filters.city} onChange={(e)=>setFilters({...filters,city:e.target.value})} />
          <input className="rounded-xl border p-2" placeholder="دسته‌بندی" value={filters.category} onChange={(e)=>setFilters({...filters,category:e.target.value})} />
          <input className="rounded-xl border p-2" type="date" value={filters.date} onChange={(e)=>setFilters({...filters,date:e.target.value})} />
          <select className="rounded-xl border p-2" value={filters.price} onChange={(e)=>setFilters({...filters,price:e.target.value as '' | 'free' | 'paid'})}>
            <option value="">همه قیمت‌ها</option><option value="free">رایگان</option><option value="paid">پرداختی</option>
          </select>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => {
            const remaining = event.capacity - event.reservedCount;
            return (
              <Link key={event.id} href={`/events/${event.id}`} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-lg transition">
                <p className="text-xs text-orange-600">{event.category || 'Hamneshini'}</p>
                <h3 className="font-bold text-lg mt-1">{event.title}</h3>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{event.description}</p>
                <div className="mt-4 text-sm text-slate-600">{event.city || 'آنلاین'} • {new Date(event.startDate).toLocaleDateString('fa-IR')}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-black">{Number(event.price).toLocaleString('fa-IR')} تومان</span>
                  <span className="text-xs">باقی‌مانده {remaining}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
