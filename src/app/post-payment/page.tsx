"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

// کامپوننت جداگانه برای استفاده از useSearchParams
function PostPaymentContent() {
  const searchParams = useSearchParams();
  const { dispatch } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      dispatch({ type: "SET_PAYMENT_SUCCESS", payload: true });
      setTimeout(() => {
        router.push("/payment-success");
      }, 1000);
    }
  }, [searchParams, dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
        <p className="text-slate-600 font-bold">در حال پردازش پرداخت...</p>
      </div>
    </div>
  );
}

// کامپوننت اصلی با Suspense
export default function PostPaymentPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">در حال بارگذاری...</div>}>
      <PostPaymentContent />
    </Suspense>
  );
}
