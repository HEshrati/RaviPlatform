"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import AppProvider from "@/context/AppContext";

const BottomNav = dynamic(() => import("@/components/BottomNav"), { ssr: false });
const TopHeader = dynamic(() => import("@/components/TopHeader"), { ssr: false });
const AuthGate = dynamic(() => import("@/components/AuthGate"), { ssr: false });
const TestGate = dynamic(() => import("@/components/TestGate"), { ssr: false });
const AIChatWidget = dynamic(() => import("@/components/AIChatWidget"), { ssr: false });
const GlobalPageLoader = dynamic(() => import("@/components/GlobalPageLoader"), { ssr: false });
const DashboardAwarePadding = dynamic(() => import("@/components/DashboardAwarePadding"), { ssr: false });
const ProfileGuard = dynamic(() => import("@/components/ProfileGuard").then(m => ({ default: m.ProfileGuard })), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <Suspense fallback={null}>
        <GlobalPageLoader />
      </Suspense>
      <AuthGate>
        <TestGate>
          <TopHeader />
          <DashboardAwarePadding>
            <ProfileGuard>{children}</ProfileGuard>
          </DashboardAwarePadding>
          <BottomNav />
          <AIChatWidget />
        </TestGate>
      </AuthGate>
    </AppProvider>
  );
}
