"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  fetchAllBookings,
  updateBookingStatus,
  isAdminPhone,
  type Booking,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { Activity, Check, X, Calendar, Filter } from "lucide-react";

const CARD = {
  background: "linear-gradient(145deg, #1B2A4A, #132038)",
  border: "1px solid rgba(255,255,255,0.08)",
};

export default function AdminBookingsPage() {
  const { state } = useApp();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!state.isLoading && !isAdminPhone(state.user?.mobileNumber))
      router.replace("/dashboard");
  }, [state.isLoading, state.user]);

  const load = () => {
    setLoading(true);
    fetchAllBookings({
      status: statusFilter === "all" ? undefined : statusFilter,
    })
      .then((res) => setBookings(res.bookings))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleStatus = async (
    bookingId: string,
    status: "confirmed" | "cancelled",
  ) => {
    setActionLoading(bookingId);
    try {
      await updateBookingStatus(bookingId, status);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b)),
      );
    } catch {}
    setActionLoading(null);
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 space-y-5 relative z-10" dir="rtl">
      <div className="rounded-3xl p-6" style={CARD}>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Activity size={20} className="text-orange-400" /> مدیریت رزروها
        </h1>
        <div className="flex gap-2 mt-3">
          {[
            ["all", "همه"],
            ["pending", "در انتظار"],
            ["confirmed", "تأیید شده"],
            ["cancelled", "لغو شده"],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setStatusFilter(v)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${statusFilter === v ? "bg-orange-500 text-white" : "text-slate-400"}`}
              style={
                statusFilter === v
                  ? {}
                  : {
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
              }
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-3xl p-8 text-center" style={CARD}>
          <Activity size={36} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">رزروی یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-2xl p-4" style={CARD}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div>
                  <p className="font-black text-white text-sm">
                    {b.eventTitle || b.eventId || "رزرو"}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {b.userName || "کاربر"}
                    {b.userPhone ? ` · ${b.userPhone}` : ""} ·{" "}
                    {b.createdAt
                      ? new Date(b.createdAt).toLocaleDateString("fa-IR")
                      : ""}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    b.status === "confirmed"
                      ? "bg-green-500/15 text-green-400 border border-green-500/25"
                      : b.status === "cancelled"
                        ? "bg-red-500/15 text-red-400 border border-red-500/25"
                        : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25"
                  }`}
                >
                  {b.status === "confirmed"
                    ? "تأیید"
                    : b.status === "cancelled"
                      ? "لغو"
                      : "در انتظار"}
                </span>
              </div>

              {b.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleStatus(b.id, "confirmed")}
                    disabled={actionLoading === b.id}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-green-400 transition"
                    style={{
                      background: "rgba(16,185,129,0.12)",
                      border: "1px solid rgba(16,185,129,0.25)",
                    }}
                  >
                    <Check size={13} className="inline mr-1" /> تأیید
                  </button>
                  <button
                    onClick={() => handleStatus(b.id, "cancelled")}
                    disabled={actionLoading === b.id}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-red-400 transition"
                    style={{
                      background: "rgba(239,68,68,0.12)",
                      border: "1px solid rgba(239,68,68,0.25)",
                    }}
                  >
                    <X size={13} className="inline mr-1" /> لغو
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
