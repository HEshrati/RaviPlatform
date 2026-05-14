"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { isAdminPhone } from "@/lib/api";
import {
  Sparkles, CheckCircle2, XCircle, Eye, Clock,
  Edit3, ArrowRight, RefreshCw, FileText,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const CARD = {
  background: "linear-gradient(145deg, #1B2A4A 0%, #132038 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
};

type Tab = "drafts" | "published";

export default function AdminContentPage() {
  const { state } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("drafts");
  const [drafts, setDrafts] = useState<any[]>([]);
  const [published, setPublished] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    if (!state.isLoggedIn || !isAdminPhone(state.user?.mobileNumber)) {
      router.push("/dashboard");
      return;
    }
    loadAll();
  }, [state.isLoggedIn]);

  async function loadAll() {
    setLoading(true);
    try {
      const [draftsRes, pubRes] = await Promise.allSettled([
        fetch(`${API_URL}/api/content/admin/drafts`, { headers }).then((r) => r.json()),
        fetch(`${API_URL}/api/content/articles?page=1&limit=20`).then((r) => r.json()),
      ]);
      if (draftsRes.status === "fulfilled") setDrafts(Array.isArray(draftsRes.value) ? draftsRes.value : []);
      if (pubRes.status === "fulfilled") setPublished(pubRes.value?.data || []);
    } finally {
      setLoading(false);
    }
  }

  async function generate(topic?: string) {
    setGenerating(true);
    try {
      await fetch(`${API_URL}/api/content/admin/generate`, {
        method: "POST",
        headers,
        body: JSON.stringify({ topic }),
      });
      setTimeout(loadAll, 2000);
    } finally {
      setGenerating(false);
    }
  }

  async function approve(id: string) {
    await fetch(`${API_URL}/api/content/admin/approve/${id}`, { method: "POST", headers });
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }

  async function reject(id: string) {
    await fetch(`${API_URL}/api/content/admin/reject/${id}`, { method: "POST", headers });
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }

  async function saveEdit() {
    if (!editItem) return;
    await fetch(`${API_URL}/api/content/admin/edit/${editItem.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ title: editTitle, body: editBody }),
    });
    setEditItem(null);
    loadAll();
  }

  const TOPICS = ["ارتباط موثر", "سبک‌های دلبستگی", "هوش هیجانی", "مرزهای سالم", "گوش دادن فعال"];

  // ویرایشگر
  if (editItem) {
    return (
      <div className="min-h-screen pb-20 px-4 pt-6" style={{ background: "#0D1B2A" }} dir="rtl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setEditItem(null)} className="text-slate-400 hover:text-white">
            <ArrowRight size={20} />
          </button>
          <h1 className="text-lg font-black text-white">ویرایش مقاله</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">عنوان</label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">متن</label>
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows={12}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={saveEdit}
              className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold"
            >
              ذخیره
            </button>
            <button
              onClick={() => setEditItem(null)}
              className="px-4 py-3 bg-white/10 text-slate-400 rounded-xl"
            >
              لغو
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: "#0D1B2A" }} dir="rtl">
      {/* هدر */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-slate-400">
              <ArrowRight size={20} />
            </button>
            <h1 className="text-lg font-black text-white">مدیریت محتوا</h1>
          </div>
          <button onClick={loadAll} className="text-slate-400 hover:text-white">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* تولید محتوا */}
        <div className="rounded-2xl p-4" style={CARD}>
          <h2 className="text-sm font-bold text-white mb-3">تولید محتوای هوشمند</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => generate(topic)}
                disabled={generating}
                className="text-xs bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 px-3 py-1.5 rounded-full border border-orange-500/20 transition disabled:opacity-50"
              >
                {topic}
              </button>
            ))}
          </div>
          <button
            onClick={() => generate()}
            disabled={generating}
            className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #FF6B00, #FF8C42)" }}
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                در حال تولید...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                تولید مقاله تصادفی
              </>
            )}
          </button>
        </div>

        {/* تب‌ها */}
        <div className="flex gap-2">
          {(["drafts", "published"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
                tab === t ? "bg-orange-500 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              {t === "drafts" ? `پیش‌نویس (${drafts.length})` : `منتشرشده (${published.length})`}
            </button>
          ))}
        </div>

        {/* محتوا */}
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : tab === "drafts" ? (
          drafts.length === 0 ? (
            <div className="rounded-2xl p-6 text-center" style={CARD}>
              <FileText size={32} className="text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">پیش‌نویسی وجود ندارد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft) => (
                <div key={draft.id} className="rounded-2xl p-4" style={CARD}>
                  <div className="flex items-start gap-2 mb-2">
                    {draft.topic && (
                      <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full shrink-0">
                        {draft.topic}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">{draft.title}</h3>
                  <p className="text-slate-400 text-xs line-clamp-2 mb-3">{draft.summary}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <Clock size={11} />
                    <span>{draft.reading_time_minutes} دقیقه</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approve(draft.id)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 py-2 rounded-xl"
                    >
                      <CheckCircle2 size={12} />
                      تایید
                    </button>
                    <button
                      onClick={() => {
                        setEditItem(draft);
                        setEditTitle(draft.title);
                        setEditBody(draft.body);
                      }}
                      className="px-3 flex items-center justify-center gap-1 text-xs bg-blue-500/20 text-blue-400 py-2 rounded-xl"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => reject(draft.id)}
                      className="px-3 flex items-center justify-center gap-1 text-xs bg-red-500/20 text-red-400 py-2 rounded-xl"
                    >
                      <XCircle size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-3">
            {published.map((article) => (
              <div key={article.id} className="rounded-2xl p-4" style={CARD}>
                <h3 className="text-white font-bold text-sm mb-1">{article.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Eye size={11} /> {article.view_count}</span>
                  <span className="text-green-400">● منتشرشده</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
