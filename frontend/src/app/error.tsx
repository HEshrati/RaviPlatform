"use client";

'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md text-center space-y-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800">مشکلی پیش آمده است</h2>
        <p className="text-gray-600">
          متأسفانه خطایی رخ داده است. لطفاً دوباره تلاش کنید.
        </p>
        {error.message && (
          <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded">
            {error.message}
          </p>
        )}
        <button
          onClick={reset}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}
