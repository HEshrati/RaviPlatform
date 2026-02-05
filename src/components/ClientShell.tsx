// src/components/ClientShell.tsx
"use client";

import { useEffect, useState } from "react";
import Preloader from "@/components/Preloader";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const done = () => {
      // کمی تاخیر برای حس بهتر
      setTimeout(() => setReady(true), 300);
    };

    if (document.readyState === "complete") {
      done();
    } else {
      window.addEventListener("load", done);
      return () => window.removeEventListener("load", done);
    }
  }, []);

  return (
    <>
      <Preloader isDone={ready} />
      {children}
    </>
  );
}
