"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import RaviLoader from "./RaviLoader";

export default function GlobalPageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state } = useApp();

  // ناوبری بین صفحات
  const [navLoading, setNavLoading] = useState(false);
  const [prevPath, setPrevPath] = useState("");

  useEffect(() => {
    if (!prevPath) {
      setPrevPath(pathname);
      return;
    }
    if (prevPath === pathname) return;
    setNavLoading(true);
    const t = setTimeout(() => setNavLoading(false), 700);
    setPrevPath(pathname);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  // ریلود اولیه صفحه — state.isLoading فقط موقع اولین بار true است
  const [initDone, setInitDone] = useState(false);
  useEffect(() => {
    if (!state.isLoading) setInitDone(true);
  }, [state.isLoading]);

  const visible = navLoading || (!initDone && state.isLoading);

  if (!visible) return null;
  return <RaviLoader fullScreen />;
}
