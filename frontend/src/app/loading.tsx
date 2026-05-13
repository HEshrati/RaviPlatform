"use client";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f172a" }}>
      <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
    </div>
  );
}
