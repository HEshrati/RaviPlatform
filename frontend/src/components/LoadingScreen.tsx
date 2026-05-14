"use client";
import React from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "لطفا صبر کنید..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {/* Animated circles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { size: 80, x: 10, y: 15, dur: 8, delay: 0 },
          { size: 55, x: 80, y: 10, dur: 10, delay: 1 },
          { size: 70, x: 50, y: 5, dur: 12, delay: 2 },
          { size: 45, x: 25, y: 70, dur: 9, delay: 0.5 },
          { size: 90, x: 75, y: 65, dur: 11, delay: 1.5 },
          { size: 60, x: 90, y: 40, dur: 13, delay: 3 },
          { size: 50, x: 5, y: 45, dur: 7, delay: 2.5 },
          { size: 75, x: 60, y: 80, dur: 10, delay: 4 },
          { size: 40, x: 35, y: 90, dur: 14, delay: 1 },
          { size: 65, x: 15, y: 35, dur: 8, delay: 3.5 },
          { size: 55, x: 45, y: 55, dur: 11, delay: 0.5 },
          { size: 48, x: 70, y: 30, dur: 9, delay: 2 },
          { size: 72, x: 88, y: 80, dur: 12, delay: 4.5 },
          { size: 58, x: 20, y: 85, dur: 10, delay: 1.5 },
          { size: 42, x: 55, y: 25, dur: 13, delay: 3 },
        ].map((c, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-orange-500"
            style={{
              width: `${c.size}px`,
              height: `${c.size}px`,
              left: `${c.x}%`,
              top: `${c.y}%`,
              opacity: 0.7,
              filter: 'blur(2px)',
              animation: `loadFloat ${c.dur}s ${c.delay}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes loadFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(20px, -30px) scale(1.1); }
        }
        @keyframes spin360 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Blurred overlay */}
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative w-28 h-28">
          {/* Spinning ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-orange-200 border-t-orange-500"
            style={{ animation: 'spin360 1.2s linear infinite' }}
          />
          {/* Logo */}
          <div className="absolute inset-2 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
            <Image
              src="/loading.PNG"
              alt="راوی"
              width={72}
              height={72}
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-700 font-bold text-lg">{message}</p>
          <p className="text-orange-500 text-sm font-medium mt-1">راوی</p>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2.5 h-2.5 bg-orange-300 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
