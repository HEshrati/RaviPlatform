"use client";
/**
 * ProfileGuard — blocks access to Booking (events) and explore pages
 * for regular users who haven't completed their profile (name + city).
 * Admins are excluded.
 */
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { isAdminPhone } from "@/lib/api";

const PROTECTED_PATHS = ["/events", "/dashboard/explore"];

export function ProfileGuard({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (state.isLoading) return;
    if (!state.isLoggedIn) return;
    if (isAdminPhone(state.user?.mobileNumber)) return;

    const needsGuard = PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (!needsGuard) return;

    const hasName = !!(state.user?.name?.trim());
    const hasCity = !!(state.city || (state.user as any)?.city);

    if (!hasName || !hasCity) {
      router.replace("/dashboard/complete-profile");
    }
  }, [state.isLoading, state.isLoggedIn, state.user, state.city, pathname]);

  return <>{children}</>;
}

export default ProfileGuard;
