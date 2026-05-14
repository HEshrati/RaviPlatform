'use client';
import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function Inner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => document.documentElement.classList.add('loading');
    const handleStop = () => document.documentElement.classList.remove('loading');
    handleStop();
  }, [pathname, searchParams]);

  return null;
}

export default function GlobalPageLoader() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
