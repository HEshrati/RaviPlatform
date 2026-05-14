"use client";

import { useEffect, useState } from "react";
import {
  fetchWallet,
  fetchWalletTransactions,
  chargeWallet,
  WalletInfo,
  WalletTransaction,
} from "@/lib/api";
import { Wallet, ArrowDownCircle, ArrowUpCircle, RefreshCw, Plus, AlertCircle } from "lucide-react";

const CHARGE_PRESETS = [50000, 100000, 200000, 500000];

function toPersianDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
}

function formatAmount(amount: number): string {
  return toPersianDigits(Number(amount).toLocaleString("fa-IR"));
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [chargeAmount, setChargeAmount] = useState(200000);
  const [isCharging, setIsCharging] = useState(false);
  const [chargeStatus, setChargeStatus] = useState("");
  const [showChargeForm, setShowChargeForm] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [w, txs] = await Promise.all([
        fetchWallet(),
        fetchWalletTransactions(),
      ]);
      setWallet(w);
      setTransactions(txs);
    } catch {
      setWallet({ balance: 0, currency: "IRR" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCharge(e: React.FormEvent) {
    e.preventDefault();
    if (chargeAmount < 10000) {
      setChargeStatus("حداقل مبلغ شارژ ۱۰,۰۰۰ تومان است.");
      return;
    }
    setIsCharging(true);
    setChargeStatus("");
    try {
      const result = await chargeWallet(chargeAmount);
      if (result?.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        setChargeStatus("در حال انتقال به درگاه پرداخت...");
        await loadData();
        setShowChargeForm(false);
      }
    } catch (err: any) {
      setChargeStatus(err?.message || "خطا در اتصال به درگاه پرداخت. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsCharging(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pb-24 space-y-5">
      {/* ── کارت موجودی ── */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-orange-500 to-orange-700 p-6 shadow-xl shadow-orange-500/30 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <Wallet size={20} />
            </div>
            <span className="font-black text-lg">کیف پول راوی</span>
          </div>
          <button
            onClick={loadData}
            className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-white/70 text-sm mb-1">موجودی فعلی</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black">
              {formatAmount(wallet?.balance || 0)}
            </span>
            <span className="text-white/70 mb-1">تومان</span>
          </div>
        </div>

        <button
          onClick={() => setShowChargeForm(!showChargeForm)}
          className="w-full bg-white text-orange-600 font-black py-3 rounded-2xl hover:bg-orange-50 transition flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus size={20} />
          شارژ کیف پول
        </button>
      </div>

      {/* ── فرم شارژ ── */}
      {showChargeForm && (
        <div className="app-card rounded-3xl p-6">
          <h3 className="font-black text-white mb-4">شارژ کیف پول</h3>
          <form onSubmit={handleCharge} className="space-y-4">
            {/* مبالغ پیش‌فرض */}
            <div className="grid grid-cols-2 gap-2">
              {CHARGE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setChargeAmount(preset)}
                  className={`py-2.5 rounded-xl font-bold text-sm transition-all border ${
                    chargeAmount === preset
                      ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:border-orange-500/50"
                  }`}
                >
                  {formatAmount(preset)} تومان
                </button>
              ))}
            </div>

            {/* مبلغ دلخواه */}
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">یا مبلغ دلخواه وارد کنید</label>
              <div className="relative">
                <input
                  type="number"
                  min={10000}
                  step={10000}
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 pr-16"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  تومان
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isCharging}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-black py-3 rounded-2xl transition-all shadow-lg shadow-orange-500/30"
            >
              {isCharging ? "در حال اتصال به درگاه..." : `پرداخت ${formatAmount(chargeAmount)} تومان`}
            </button>

            {chargeStatus && (
              <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                chargeStatus.includes("خطا") || chargeStatus.includes("حداقل")
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              }`}>
                <AlertCircle size={14} className="flex-shrink-0" />
                {chargeStatus}
              </div>
            )}

            <p className="text-xs text-slate-500 text-center">
              پرداخت از طریق درگاه زرین‌پال انجام می‌شود
            </p>
          </form>
        </div>
      )}

      {/* ── تاریخچه تراکنش‌ها ── */}
      <div className="app-card rounded-3xl p-5">
        <h3 className="font-black text-white mb-4">تاریخچه تراکنش‌ها</h3>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <Wallet size={36} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">هنوز تراکنشی ثبت نشده است.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    tx.type === "charge" || tx.type === "refund"
                      ? "bg-green-500/20"
                      : "bg-red-500/20"
                  }`}
                >
                  {tx.type === "charge" || tx.type === "refund" ? (
                    <ArrowDownCircle
                      size={20}
                      className="text-green-400"
                    />
                  ) : (
                    <ArrowUpCircle size={20} className="text-red-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {tx.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatDate(tx.createdAt)}
                  </p>
                </div>

                <div className="text-left flex-shrink-0">
                  <p
                    className={`text-sm font-black ${
                      tx.type === "charge" || tx.type === "refund"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {tx.type === "charge" || tx.type === "refund" ? "+" : "-"}
                    {formatAmount(tx.amount)}
                  </p>
                  <p className="text-xs text-slate-500">تومان</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
