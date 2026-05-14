import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">صفحه پیدا نشد</h1>
        <p className="text-sm text-slate-600">ممکن است آدرس اشتباه باشد یا صفحه حذف شده باشد.</p>
        <Link
          href="/"
          className="inline-flex rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 transition"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
