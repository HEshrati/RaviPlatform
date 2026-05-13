'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const Preloader = dynamic(() => import('./Preloader'));

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [showPreloader, setShowPreloader] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setShowPreloader(true);

    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {showPreloader && <Preloader />}
      <div className={showPreloader ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>{children}</div>
    </>
  );
}
