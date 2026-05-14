"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { ArrowLeft } from "lucide-react";

export default function CTAButton() {
  const { state } = useApp();
  const ctaHref = useMemo(() => {
    if (!state.isLoggedIn) return "/test";
    if (!state.isProfileComplete || !state.isTestTaken)
      return "/dashboard/complete-profile";
    return "/events/next/booking";
  }, [state.isLoggedIn, state.isProfileComplete, state.isTestTaken]);

  return (
    <Link href={ctaHref}>
      <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3.5 rounded-2xl font-bold text-base shadow-lg hover:shadow-orange-200 transition-all hover:-translate-y-1 flex items-center gap-2">
        بزن بریم <ArrowLeft size={18} />
      </button>
    </Link>
  );
}
