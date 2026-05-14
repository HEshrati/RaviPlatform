"use client";
import { useState, useEffect } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";

const CITIES = ["تهران", "اصفهان", "شیراز", "مشهد", "تبریز", "کرج"];

export default function CitySelector() {
  const [cityOpen, setCityOpen] = useState(false);
  const [city, setCity] = useState("تهران");

  useEffect(() => {
    const saved = localStorage.getItem("raavi-city");
    if (saved) setCity(saved);
  }, []);

  const selectCity = (c: string) => {
    setCity(c);
    localStorage.setItem("raavi-city", c);
    setCityOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setCityOpen(!cityOpen)}
        className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-colors"
      >
        <MapPin className="text-orange-500" size={15} />
        <span className="text-xs md:text-sm font-bold text-slate-800">{city}</span>
        <ChevronDown className="text-orange-500" size={14} />
      </button>
      {cityOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-50 min-w-[120px]">
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => selectCity(c)}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-orange-50 transition-colors"
            >
              {city === c && <Check size={12} className="text-orange-500" />}
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
