"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import RaviLoader from "./RaviLoader";

export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 600);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);
  if (!visible) return null;
  return <RaviLoader />;
}
