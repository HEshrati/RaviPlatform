"use client";

type Props = { isDone?: boolean };

export default function Preloader({ isDone = false }: Props) {
  return (
    <div className={`preloader-overlay ${isDone ? "hide" : ""}`}>
      <div className="preloader-content">
        <div className="preloader-logo" aria-label="راوی">
          <span>ر</span>
          <span>ا</span>
          <span>و</span>
          <span>ی</span>
        </div>
        <div className="preloader-bar">
          <div className="preloader-bar-fill" />
        </div>
      </div>
    </div>
  );
}
