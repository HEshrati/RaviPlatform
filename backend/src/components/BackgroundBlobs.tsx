"use client";

export default function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden bg-white">
      {/* دایره‌های نارنجی متحرک */}
      <div className="absolute top-0 -left-10 md:-left-20 w-[200px] md:w-[500px] h-[200px] md:h-[500px] bg-orange-400/20 md:bg-orange-400/25 rounded-full mix-blend-multiply filter blur-[60px] md:blur-[80px] animate-blob"></div>
      <div className="absolute top-0 -right-10 md:-right-20 w-[150px] md:w-[400px] h-[150px] md:h-[400px] bg-yellow-400/20 md:bg-yellow-400/25 rounded-full mix-blend-multiply filter blur-[60px] md:blur-[80px] animate-blob animation-delay-2000"></div>
      <div className="absolute top-[40%] -left-10 md:-left-20 w-[150px] md:w-[400px] h-[150px] md:h-[400px] bg-orange-300/25 md:bg-orange-300/30 rounded-full mix-blend-multiply filter blur-[60px] md:blur-[80px] animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-0 -right-10 md:-right-20 w-[200px] md:w-[600px] h-[200px] md:h-[600px] bg-orange-100/40 md:bg-orange-100/45 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] animate-blob"></div>
      <div className="absolute bottom-20 left-1/3 w-[180px] md:w-[450px] h-[180px] md:h-[450px] bg-orange-200/30 rounded-full mix-blend-multiply filter blur-[70px] md:blur-[90px] animate-blob animation-delay-2000"></div>
    </div>
  );
}
