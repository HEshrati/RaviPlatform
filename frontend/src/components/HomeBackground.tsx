"use client";

import { useState, useEffect } from "react";

export default function HomeBackground() {
  const [pos, setPos] = useState({ x: 38, y: 32 });

  useEffect(() => {
    const onMove = (e: MouseEvent) =>
      setPos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
    document.body.style.setProperty("background-color", "#ffffff", "important");
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.style.removeProperty("background-color");
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        background: `
          radial-gradient(ellipse 55% 45% at ${pos.x}% ${pos.y}%, rgba(255,107,0,0.13) 0%, transparent 62%),
          radial-gradient(ellipse 70% 55% at ${100 - pos.x * 0.6}% ${100 - pos.y * 0.5}%, rgba(255,180,80,0.09) 0%, transparent 65%),
          radial-gradient(ellipse 40% 35% at 80% 10%, rgba(255,154,60,0.08) 0%, transparent 50%),
          radial-gradient(ellipse 50% 40% at 10% 90%, rgba(255,200,100,0.07) 0%, transparent 55%),
          linear-gradient(160deg, #ffffff 0%, #fff8f2 45%, #fffaf5 100%)
        `,
        transition: "background 0.12s linear",
      }}
    />
  );
}
