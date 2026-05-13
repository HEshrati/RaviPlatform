"use client";

import React, { useEffect, useRef } from "react";

// ─── SVG شیپ نارنجی ───────────────────────────────────────────────────────────
const SHAPE_SVG = `<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="c" gradientTransform="rotate(45 .5 .5)"><stop offset="0%" stop-color="#FAD961"/><stop offset="100%" stop-color="#F76B1C"/></linearGradient><clipPath id="b"><path fill="currentColor" d="M722.5 714.5Q500 929 275 714.5t0-427q225-212.5 447.5 0t0 427Z"/></clipPath></defs><g clip-path="url(#b)"><path fill="url(#c)" d="M722.5 714.5Q500 929 275 714.5t0-427q225-212.5 447.5 0t0 427Z"/></g></svg>`;

const SHAPES_CONFIG = [
  {
    id: 1,
    size: 180,
    top: 8,
    left: 10,
    dur: 20,
    delay: 0,
    op: 0.35,
    xR: 90,
    yR: 70,
    rot: 20,
  },
  {
    id: 2,
    size: 90,
    top: 20,
    left: 78,
    dur: 25,
    delay: -6,
    op: 0.28,
    xR: 110,
    yR: 80,
    rot: -35,
  },
  {
    id: 3,
    size: 240,
    top: 52,
    left: 3,
    dur: 30,
    delay: -12,
    op: 0.22,
    xR: 70,
    yR: 100,
    rot: 50,
  },
  {
    id: 4,
    size: 70,
    top: 78,
    left: 85,
    dur: 17,
    delay: -4,
    op: 0.4,
    xR: 100,
    yR: 55,
    rot: -18,
  },
  {
    id: 5,
    size: 150,
    top: 40,
    left: 52,
    dur: 34,
    delay: -18,
    op: 0.25,
    xR: 120,
    yR: 110,
    rot: 65,
  },
];

export default function AnimatedBackground() {
  const shapeUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SHAPE_SVG)}`;

  const gradientRef = useRef<HTMLDivElement | null>(null);
  const mouse = useRef({ x: 50, y: 50 });
  const smooth = useRef({ x: 50, y: 50 });

  // ─── دنبال کردن موس ─────────────────────────────────────────────
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 100;
      mouse.current.y = (e.clientY / window.innerHeight) * 100;
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // ─── انیمیشن نرم گرادیانت ──────────────────────────────────────
  useEffect(() => {
    let raf: number;

    const animate = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.05;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.05;

      if (gradientRef.current) {
        gradientRef.current.style.background = `
          radial-gradient(
            circle at ${smooth.current.x}% ${smooth.current.y}%,
            rgba(255,255,255,0.95) 0%,
            rgba(250,217,97,0.35) 25%,
            rgba(247,107,28,0.25) 55%,
            rgba(15,23,42,1) 100%
          )
        `;
      }

      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatShape {
          0% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(30px,-20px) rotate(20deg); }
          100% { transform: translate(0,0) rotate(0deg); }
        }
      `}</style>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 🔥 BACKGROUND FOLLOW MOUSE */}
        <div
          ref={gradientRef}
          className="absolute inset-0 transition-colors duration-300"
        />

        {/* SHAPES */}
        {SHAPES_CONFIG.map((s) => (
          <div
            key={s.id}
            style={{
              position: "absolute",
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              backgroundImage: `url("${shapeUrl}")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              opacity: s.op,
              animation: `floatShape ${s.dur}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
}
