// src/components/CountdownTimer.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function Circle({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="bg-orange-500 text-white w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
        <span className="font-bold text-sm md:text-base tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] md:text-xs font-medium text-slate-500">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({
  target,
}: {
  target?: number | string | Date;
}) {
  const targetTime = useMemo(() => {
    if (!target) return Date.now() + 3 * 24 * 60 * 60 * 1000;
    if (typeof target === "number") return target;
    if (target instanceof Date) return target.getTime();
    return new Date(target).getTime();
  }, [target]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const tick = () => {
      const diff = targetTime - Date.now();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    // تراز مرکزی برای تایمر
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-slate-600 font-bold text-xs md:text-sm bg-white/50 px-3 py-1 rounded-full border border-slate-100 backdrop-blur-sm">
        <Clock className="text-orange-500" size={16} />
        <span>زمان باقی‌مانده تا رویداد بعدی</span>
      </div>

      <div className="flex flex-row-reverse items-center gap-3">
        <Circle value={timeLeft.days} label="روز" />
        <Circle value={timeLeft.hours} label="ساعت" />
        <Circle value={timeLeft.minutes} label="دقیقه" />
        <Circle value={timeLeft.seconds} label="ثانیه" />
      </div>
    </div>
  );
}
