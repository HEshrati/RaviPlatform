"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          سیاست حریم خصوصی
        </h1>
        <p className="text-sm text-gray-400 mb-8">آخرین بروزرسانی: ۱۴۰۳</p>

        <div className="space-y-6 text-gray-600 leading-8 text-sm">
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ۱. اطلاعات جمع‌آوری‌شده
            </h2>
            <p>
              پلتفرم راوی اطلاعاتی که هنگام ثبت‌نام یا استفاده از خدمات وارد
              می‌کنید (مانند شماره موبایل، نام و مشخصات پروفایل) را جهت ارائه
              بهتر خدمات جمع‌آوری می‌کند.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ۲. نحوه استفاده از اطلاعات
            </h2>
            <p>
              اطلاعات شما صرفاً جهت ارائه خدمات پلتفرم، ارسال اطلاعیه‌های
              رویداد، و بهبود تجربه کاربری استفاده می‌شود و به هیچ شخص ثالثی
              فروخته یا واگذار نمی‌گردد.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ۳. امنیت اطلاعات
            </h2>
            <p>
              ما از روش‌های استاندارد امنیتی برای حفاظت از اطلاعات شما استفاده
              می‌کنیم. ارتباطات از طریق HTTPS رمزنگاری‌شده انجام می‌شود.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ۴. حقوق کاربران
            </h2>
            <p>
              شما می‌توانید در هر زمان درخواست دسترسی، اصلاح یا حذف اطلاعات
              خود را از طریق بخش پشتیبانی مطرح کنید.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ۵. تماس با ما
            </h2>
            <p>
              در صورت داشتن سوال درباره سیاست حریم خصوصی، از طریق صفحه{" "}
              <Link href="/support" className="text-blue-500 hover:underline">
                پشتیبانی
              </Link>{" "}
              با ما در تماس باشید.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link
            href="/"
            className="text-sm text-blue-500 hover:underline"
          >
            ← بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}
