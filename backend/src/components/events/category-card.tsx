'use client';
import Link from 'next/link';

interface Props { id: string; title: string; image?: string; icon?: string; emoji?: string; }

export function CategoryCard({ id, title, image, emoji }: Props) {
  return (
    <Link href={`/events/category/${id}`}>
      <div className="group flex flex-col items-center gap-2 cursor-pointer select-none">
        <div className="w-full aspect-square rounded-2xl bg-[#f5f5f5] overflow-hidden flex items-center justify-center relative transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 border border-gray-200">
          {image ? <img src={image} alt={title} className="w-full h-full object-cover"/> :
           emoji ? <span className="text-5xl">{emoji}</span> :
           <div className="w-full h-full flex items-center justify-center p-4"><DefaultIllustration title={title}/></div>}
        </div>
        <span className="text-sm font-medium text-gray-700 text-center group-hover:text-orange-500 transition-colors">{title}</span>
      </div>
    </Link>
  );
}

function DefaultIllustration({ title }: { title: string }) {
  const map: Record<string,string> = {
    'هم‌بازی':'M30,32 a14,14 0 1,0 28,0 a14,14 0 1,0-28,0 M55,28 a11,11 0 1,0 22,0 a11,11 0 1,0-22,0 M10,48 h26 a8,8 0 0,1 8,8 v14 h-42 a0,0 0 0,1 0,0 v-14 a8,8 0 0,1 8,-8 M38,44 h22 a8,8 0 0,1 8,8 v14 h-38 v-14 a8,8 0 0,1 8,-8',
    'هم‌صحبت':'M28,30 a13,13 0 1,0 26,0 a13,13 0 1,0-26,0 M53,26 a11,11 0 1,0 22,0 a11,11 0 1,0-22,0 M10,46 h24 a8,8 0 0,1 8,8 v16 h-40 v-16 a8,8 0 0,1 8,-8 M36,42 h20 a8,8 0 0,1 8,8 v16 h-36 v-16 a8,8 0 0,1 8,-8',
  };
  const d = map[title] || 'M26,30 a13,13 0 1,0 26,0 a13,13 0 1,0-26,0 M52,26 a12,12 0 1,0 24,0 a12,12 0 1,0-24,0';
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <path d={d} fill="#60a5fa" fillRule="evenodd"/>
    </svg>
  );
}
