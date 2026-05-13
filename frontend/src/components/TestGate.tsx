"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

const EXEMPT_PATHS = ["/test", "/login", "/verify-mobile", "/about", "/"];

export default function TestGate({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (state.isLoading) return;
    if (!state.isLoggedIn) return;
    if (state.isTestTaken) return;
    if (EXEMPT_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) return;

    /* DISABLED: */ void 0;
  }, [state.isLoggedIn, state.isTestTaken, state.isLoading, pathname, router]);

  return <>{children}</>;
}
