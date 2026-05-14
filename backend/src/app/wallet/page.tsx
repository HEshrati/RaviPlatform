"use client";

import { useEffect, useState } from "react";
import { fetchSubscription, subscribe } from "@/lib/api";

export default function WalletPage() {
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const result = await fetchSubscription();
    setPlan(result.plan);
  };

  useEffect(() => {
    load().catch(() => null);
  }, []);

  const upgrade = async (provider: "zarinpal" | "stripe") => {
    setLoading(true);
    await subscribe(provider);
    await load();
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-black">اشتراک و پرداخت</h1>
      <p className="mt-2">پلن فعلی: <strong>{plan}</strong></p>
      <div className="mt-4 flex gap-3">
        <button disabled={loading} className="rounded-xl bg-orange-500 px-4 py-2 text-white" onClick={() => upgrade("zarinpal")}>پرداخت با زرین‌پال</button>
        <button disabled={loading} className="rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={() => upgrade("stripe")}>پرداخت با Stripe</button>
      </div>
    </div>
  );
}
