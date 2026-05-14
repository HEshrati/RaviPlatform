"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Users,
  Sparkles,
  Shield,
  ChevronLeft,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { myTherapistAPI } from "@/app/lib/my-therapist-api";

export default function MyTherapistLandingPage() {
  const router = useRouter();
  const [intakeDone, setIntakeDone] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("دوست راوی");

  useEffect(() => {
    // تلاش برای دریافت نام کاربر از localStorage یا context
    const localFlag =
      typeof window !== "undefined" &&
      localStorage.getItem("mt_intake_done") === "1";
    if (localFlag) {
      setIntakeDone(true);
    }
    // دریافت نام کاربر
    const storedName = localStorage.getItem("user_name");
    if (storedName) {
      setUserName(storedName.split(" ")[0]);
    }
    
    myTherapistAPI
      .getMyIntake()
      .then((r) => setIntakeDone(!!r))
      .catch(() => setIntakeDone(false));
  }, []);

  return (
    <div className="min-h-screen pb-28" dir="rtl">
      <div
        className="sticky top-0 z-30 border-b border-slate-100/30 shadow-sm"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,107,0,0.1)" }}
            >
              <Heart size={16} className="text-orange-500" />
            </div>
            <h1 className="text-base font-black text-slate-900">
              دوست روانشناس من
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div
          className="mt-5 mb-6 relative rounded-3xl overflow-hidden p-6 lg:p-8"
          style={{
            background:
              "linear-gradient(135deg, #1B2A4A 0%, #0d1e35 60%, #1a1035 100%)",
          }}
        >
          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{
                background: "rgba(255,107,0,0.2)",
                border: "1px solid rgba(255,107,0,0.3)",
                color: "#FF9A3C",
              }}
            >
              <Sparkles size={11} />
              خدمت تخصصی راوی
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight mb-2">
              سلام {userName}، اینجا فضای امن شماست 💜
            </h2>
            <p className="text-slate-300 text-sm lg:text-base leading-relaxed max-w-2xl">
              «دوست روانشناس من» بستری حرفه‌ای و محرمانه برای ارتباط با
              روانشناسان مورد تأیید راوی است.
            </p>
          </div>
        </div>

        {intakeDone === false && (
          <div
            className="mb-6 rounded-2xl p-4 flex items-start gap-3"
            style={{
              background: "rgba(255,107,0,0.08)",
              border: "1px solid rgba(255,107,0,0.2)",
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,107,0,0.15)" }}
            >
              <Sparkles size={16} className="text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-slate-800 text-sm mb-1">
                برای پیشنهاد دقیق‌تر، پرسش‌نامه اختصاصی این بخش را تکمیل کنید
              </p>
              <Link
                href="/dashboard/my-therapist/intake"
                className="inline-flex items-center gap-1 mt-2 text-orange-600 font-bold text-xs hover:text-orange-700"
              >
                تکمیل پرسش‌نامه <ArrowLeft size={12} />
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href={
              intakeDone
                ? "/dashboard/my-therapist/ham-ravan"
                : "/dashboard/my-therapist/intake?next=ham-ravan"
            }
            className="group rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl block"
            style={{
              background: "white",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="relative h-36 overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg,#1B2A4A 0%,#2d4263 60%,#FF6B00 100%)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-md"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Heart size={36} className="text-white" />
                </div>
              </div>
              <div
                className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black"
                style={{ background: "rgba(255,255,255,0.95)", color: "#FF6B00" }}
              >
                یک به یک
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-black text-slate-900 text-lg group-hover:text-orange-600 transition-colors">
                هم‌روان
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                ارتباط با یک روانشناس برای ارزیابی وضعیت روان‌شناختی و تبیین علمی مسائل.
              </p>
              <div
                className="w-full text-center py-2.5 rounded-2xl text-sm font-black text-white transition-all"
                style={{
                  background: "linear-gradient(135deg,#FF6B00,#FF9A3C)",
                  boxShadow: "0 4px 16px rgba(255,107,0,0.3)",
                }}
              >
                مشاهده روانشناسان پیشنهادی
              </div>
            </div>
          </Link>

          <Link
            href={
              intakeDone
                ? "/dashboard/my-therapist/ham-ziste"
                : "/dashboard/my-therapist/intake?next=ham-ziste"
            }
            className="group rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl block"
            style={{
              background: "white",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="relative h-36 overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg,#1a1035 0%,#3b1d63 60%,#6366f1 100%)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-md"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Users size={36} className="text-white" />
                </div>
              </div>
              <div
                className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black"
                style={{ background: "rgba(255,255,255,0.95)", color: "#6366f1" }}
              >
                گروهی
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                هم‌زیسته
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                گروه‌های حمایتی و درمانی مبتنی بر شباهت‌های تجربه‌زیسته با نظارت متخصص.
              </p>
              <div
                className="w-full text-center py-2.5 rounded-2xl text-sm font-black text-white transition-all"
                style={{
                  background: "linear-gradient(135deg,#4f46e5,#818cf8)",
                  boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
                }}
              >
                مشاهده گروه‌های پیشنهادی
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
