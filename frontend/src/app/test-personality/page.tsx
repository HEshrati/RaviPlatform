"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TestPersonalityRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/personality-test");
  }, [router]);
  return null;
}
