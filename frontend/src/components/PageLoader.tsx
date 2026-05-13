'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function Inner() {
  useSearchParams();
  return null;
}
export default function PageLoader() {
  return <Suspense fallback={null}><Inner /></Suspense>;
}
