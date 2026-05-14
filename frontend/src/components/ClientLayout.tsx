'use client';
import dynamic from "next/dynamic";
import { Suspense } from "react";

const TopHeader = dynamic(() => import("@/components/TopHeader"));
const BottomNav = dynamic(() => import("@/components/BottomNav"));
const AuthGate = dynamic(() => import("@/components/AuthGate"));
const TestGate = dynamic(() => import("@/components/TestGate"));
const AIChatWidget = dynamic(() => import("@/components/AIChatWidget"));
const GlobalPageLoader = dynamic(() => import("@/components/GlobalPageLoader"));
const DashboardAwarePadding = dynamic(() => import("@/components/DashboardAwarePadding"));
const ProfileGuard = dynamic(() => import("@/components/ProfileGuard").then(m => ({ default: m.ProfileGuard })));

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}><GlobalPageLoader /></Suspense>
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
    </>
  );
}
