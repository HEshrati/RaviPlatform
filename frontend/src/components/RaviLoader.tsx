"use client";
import { useEffect, useState } from "react";

export default function RaviLoader({ fullScreen = true }: { fullScreen?: boolean }) {
  const [dot, setDot] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setDot((d) => (d + 1) % 3), 450);
    return () => clearInterval(id);
  }, []);

  const wrapStyle: React.CSSProperties = fullScreen
    ? { position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "#0B1628" }
    : { width: "100%", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B1628" };

  return (
    <div style={wrapStyle}>
      {/* هاله نارنجی پس‌زمینه */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,107,0,0.12) 0%, transparent 70%)",
        animation: "raviPulse 3s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>

        {/* لوگو با حلقه‌های چرخان */}
        <div style={{ position: "relative", width: 140, height: 140 }}>

          {/* حلقه بیرونی آرام */}
          <div style={{
            position: "absolute", inset: -8, borderRadius: "50%",
            border: "1.5px solid rgba(255,107,0,0.12)",
            animation: "raviSpin 8s linear infinite",
          }}>
            <div style={{
              position: "absolute", top: -4, left: "50%", marginLeft: -4,
              width: 8, height: 8, borderRadius: "50%",
              background: "rgba(255,107,0,0.3)",
              boxShadow: "0 0 8px rgba(255,107,0,0.4)",
            }} />
          </div>

          {/* حلقه میانی */}
          <div style={{
            position: "absolute", inset: -16, borderRadius: "50%",
            border: "1px solid rgba(255,107,0,0.07)",
            animation: "raviSpin 14s linear infinite reverse",
          }}>
            <div style={{
              position: "absolute", top: -3, left: "50%", marginLeft: -3,
              width: 6, height: 6, borderRadius: "50%",
              background: "rgba(255,154,60,0.5)",
              boxShadow: "0 0 10px rgba(255,107,0,0.5)",
            }} />
          </div>

          {/* حلقه اصلی درخشان */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "2.5px solid rgba(255,107,0,0.08)",
            borderTopColor: "#FF6B00",
            borderRightColor: "rgba(255,107,0,0.5)",
            animation: "raviSpin 1.4s cubic-bezier(0.68,-0.55,0.27,1.55) infinite",
            boxShadow: "0 0 20px rgba(255,107,0,0.15)",
          }} />

          {/* حلقه داخلی معکوس */}
          <div style={{
            position: "absolute", inset: 8, borderRadius: "50%",
            border: "1.5px solid rgba(255,107,0,0.06)",
            borderBottomColor: "rgba(255,154,60,0.6)",
            animation: "raviSpin 2s linear infinite reverse",
          }} />

          {/* متن راوی */}
          <div style={{
            position: "absolute", inset: 12, borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontSize: 34,
              fontWeight: 900,
              color: "#FF6B00",
              fontFamily: "Vazirmatn, Tahoma, Arial, sans-serif",
              direction: "rtl",
              letterSpacing: 1,
              textShadow: "0 0 20px rgba(255,107,0,0.5)",
            }}>
              راوی
            </span>
          </div>
        </div>

        {/* نقاط متحرک */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              display: "inline-block",
              width: dot === i ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: dot === i ? "#FF6B00" : "rgba(255,107,0,0.2)",
              boxShadow: dot === i ? "0 0 16px rgba(255,107,0,0.7)" : "none",
              transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes raviSpin  { to { transform: rotate(360deg); } }
        @keyframes raviPulse { 0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.15)} }
      `}</style>
    </div>
  );
}
