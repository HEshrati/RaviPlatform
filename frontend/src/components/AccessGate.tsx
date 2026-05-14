"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

const publicRoutes = ["/login", "/test", "/verify-mobile", "/about", "/"];

export default function AccessGate({ children }: { children: React.ReactNode }) {
  const { state, hydrated } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    const isPublic = publicRoutes.includes(pathname);

    if (!state.isLoggedIn && !isPublic) {
      router.replace("/login");
      return;
    }

    if (state.isLoggedIn && !state.isTestTaken && pathname !== "/test") {
      /* DISABLED: */ void 0;
      return;
    }

    if (state.isLoggedIn && state.isTestTaken && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [hydrated, pathname, router, state.isLoggedIn, state.isTestTaken]);

  if (!hydrated) {
    return null;
  }

  return <>{children}</>;
}
