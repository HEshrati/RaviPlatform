// src/components/Preloader.tsx
"use client";

type Props = {
  isDone?: boolean;
};

export default function Preloader({ isDone = false }: Props) {
  return (
    <div className={`preloader-overlay ${isDone ? "hide" : ""}`}>
      <div className="preloader-content">
        <div className="preloader-logo">RAAVI</div>
        <div className="preloader-dots">
          <span className="dot dot-1" />
          <span className="dot dot-2" />
          <span className="dot dot-3" />
        </div>
      </div>
    </div>
  );
}
