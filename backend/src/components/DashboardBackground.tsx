'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const SHAPE_SVG = `<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="c" gradientTransform="rotate(45 .5 .5)"><stop offset="0%" stop-color="#FAD961"/><stop offset="100%" stop-color="#F76B1C"/></linearGradient><clipPath id="b"><path fill="currentColor" d="M722.5 714.5Q500 929 275 714.5t0-427q225-212.5 447.5 0t0 427Z"/></clipPath></defs><g clip-path="url(#b)"><path fill="url(#c)" d="M722.5 714.5Q500 929 275 714.5t0-427q225-212.5 447.5 0t0 427Z"/></g></svg>`;

const SHAPES_CONFIG = [
  { id: 1,  size: 180, top: 8,  left: 10, dur: 20, delay: 0,    op: 0.30, xR: 90,  yR: 70,  rot: 20  },
  { id: 2,  size: 90,  top: 20, left: 78, dur: 25, delay: -6,   op: 0.24, xR: 110, yR: 80,  rot: -35 },
  { id: 3,  size: 240, top: 52, left: 3,  dur: 30, delay: -12,  op: 0.20, xR: 70,  yR: 100, rot: 50  },
  { id: 4,  size: 70,  top: 78, left: 85, dur: 17, delay: -4,   op: 0.35, xR: 100, yR: 55,  rot: -18 },
  { id: 5,  size: 150, top: 40, left: 52, dur: 34, delay: -18,  op: 0.22, xR: 120, yR: 110, rot: 65  },
  { id: 6,  size: 60,  top: 88, left: 28, dur: 22, delay: -9,   op: 0.38, xR: 80,  yR: 60,  rot: -50 },
  { id: 7,  size: 120, top: 12, left: 43, dur: 27, delay: -14,  op: 0.27, xR: 100, yR: 85,  rot: 30  },
  { id: 8,  size: 200, top: 60, left: 68, dur: 32, delay: -22,  op: 0.18, xR: 75,  yR: 115, rot: -65 },
  { id: 9,  size: 55,  top: 44, left: 18, dur: 18, delay: -5,   op: 0.40, xR: 105, yR: 60,  rot: 15  },
  { id: 10, size: 100, top: 4,  left: 88, dur: 24, delay: -20,  op: 0.28, xR: 90,  yR: 75,  rot: -22 },
  { id: 11, size: 160, top: 82, left: 58, dur: 38, delay: -28,  op: 0.21, xR: 95,  yR: 120, rot: 55  },
  { id: 12, size: 75,  top: 32, left: 33, dur: 21, delay: -8,   op: 0.33, xR: 115, yR: 80,  rot: -40 },
  { id: 13, size: 210, top: 68, left: 45, dur: 40, delay: -32,  op: 0.16, xR: 60,  yR: 100, rot: 75  },
  { id: 14, size: 85,  top: 50, left: 80, dur: 26, delay: -15,  op: 0.32, xR: 100, yR: 65,  rot: -28 },
  { id: 15, size: 130, top: 18, left: 62, dur: 29, delay: -24,  op: 0.25, xR: 85,  yR: 95,  rot: 42  },
];

type Spark = { id: number; x: number; y: number; born: number };

function getShapePos(shape: typeof SHAPES_CONFIG[0], t: number, vw: number, vh: number) {
  const dur = shape.dur;
  const delay = shape.delay;
  const raw = ((t - delay) % dur) / dur;
  const p = raw < 0 ? raw + 1 : raw;
  const kx = [0, shape.xR * 0.6, -shape.xR * 0.8, shape.xR * 0.4, 0];
  const ky = [0, -shape.yR * 0.7, shape.yR * 0.5, -shape.yR * 0.3, 0];
  const kt = [0, 0.25, 0.5, 0.75, 1.0];
  let seg = 0;
  for (let i = 0; i < kt.length - 1; i++) {
    if (p >= kt[i] && p <= kt[i + 1]) { seg = i; break; }
  }
  const segP = (p - kt[seg]) / (kt[seg + 1] - kt[seg]);
  const ease = segP < 0.5 ? 2 * segP * segP : -1 + (4 - 2 * segP) * segP;
  return {
    x: (shape.left / 100) * vw + kx[seg] + (kx[seg + 1] - kx[seg]) * ease,
    y: (shape.top / 100) * vh + ky[seg] + (ky[seg + 1] - ky[seg]) * ease,
  };
}

export default function DashboardBackground() {
  const shapeUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SHAPE_SVG)}`;
  const [sparks, setSparks] = useState<Spark[]>([]);
  const sparkIdRef = useRef(0);
  const lastCollisionRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number | null>(null);

  // رنگ body رو در داشبورد سورمه‌ای می‌کنیم
  useEffect(() => {
    document.body.style.setProperty('background-color', '#0f172a', 'important');
    return () => {
      document.body.style.removeProperty('background-color');
    };
  }, []);

  const detectCollisions = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const now = performance.now() / 1000;
    const positions = SHAPES_CONFIG.map((s) => ({ ...s, pos: getShapePos(s, now, vw, vh) }));
    const newSparks: Spark[] = [];
    const currentPairs = new Set<string>();

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const a = positions[i];
        const b = positions[j];
        const dx = a.pos.x - b.pos.x;
        const dy = a.pos.y - b.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const threshold = (a.size + b.size) / 2 * 0.6;
        const pairKey = `${a.id}-${b.id}`;
        if (dist < threshold) {
          currentPairs.add(pairKey);
          if (!lastCollisionRef.current.has(pairKey)) {
            newSparks.push({
              id: ++sparkIdRef.current,
              x: (a.pos.x + b.pos.x) / 2 + a.size / 2,
              y: (a.pos.y + b.pos.y) / 2 + a.size / 2,
              born: Date.now(),
            });
          }
        }
      }
    }
    lastCollisionRef.current = currentPairs;
    if (newSparks.length > 0) {
      setSparks((prev) => [...prev.filter((s) => Date.now() - s.born < 3000), ...newSparks]);
    } else {
      setSparks((prev) => {
        const fresh = prev.filter((s) => Date.now() - s.born < 3000);
        return fresh.length === prev.length ? prev : fresh;
      });
    }
    rafRef.current = requestAnimationFrame(detectCollisions);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(detectCollisions);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [detectCollisions]);

  return (
    <>
      <style>{`
        @keyframes floatShapeDash {
          0%   { transform: translate(0px, 0px) rotate(0deg) scale(1); }
          25%  { transform: translate(var(--x1), var(--y1)) rotate(var(--r1)) scale(1.05); }
          50%  { transform: translate(var(--x2), var(--y2)) rotate(var(--r2)) scale(0.95); }
          75%  { transform: translate(var(--x3), var(--y3)) rotate(var(--r3)) scale(1.08); }
          100% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
        }
        @keyframes sparkAppearDash {
          0%   { transform: translate(-50%, -50%) scale(0);   opacity: 0.9; }
          30%  { transform: translate(-50%, -50%) scale(1.4); opacity: 0.8; }
          70%  { transform: translate(-50%, -50%) scale(1.1); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
        }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        {SHAPES_CONFIG.map((s) => (
          <div
            key={s.id}
            style={{
              position: 'absolute',
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              backgroundImage: `url("${shapeUrl}")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              opacity: s.op,
              animation: `floatShapeDash ${s.dur}s ease-in-out ${s.delay}s infinite`,
              '--x1': `${Math.round(s.xR * 0.6)}px`,
              '--y1': `${Math.round(-s.yR * 0.7)}px`,
              '--x2': `${Math.round(-s.xR * 0.8)}px`,
              '--y2': `${Math.round(s.yR * 0.5)}px`,
              '--x3': `${Math.round(s.xR * 0.4)}px`,
              '--y3': `${Math.round(-s.yR * 0.3)}px`,
              '--r1': `${s.rot}deg`,
              '--r2': `${Math.round(-s.rot * 0.7)}deg`,
              '--r3': `${Math.round(s.rot * 1.3)}deg`,
              willChange: 'transform',
            } as React.CSSProperties}
          />
        ))}

        {sparks.map((spark) => (
          <div
            key={spark.id}
            style={{
              position: 'absolute',
              left: spark.x,
              top: spark.y,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(250,217,97,0.95) 0%, rgba(247,107,28,0.7) 60%, transparent 100%)',
              boxShadow: '0 0 12px 4px rgba(247,107,28,0.4)',
              animation: 'sparkAppearDash 3s ease-out forwards',
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>
    </>
  );
}
