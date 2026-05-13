

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          شرایط استفاده از خدمات
        </h1>
        <p className="text-sm text-gray-400 mb-8">آخرین بروزرسانی: ۱۴۰۳</p>

        <div className="space-y-6 text-gray-600 leading-8 text-sm">
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ۱. پذیرش شرایط
            </h2>
            <p>
              با استفاده از پلتفرم راوی، شما شرایط و ضوابط این سند را می‌پذیرید.
              در صورت عدم موافقت، لطفاً از استفاده از خدمات خودداری کنید.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ۲. ثبت‌نام و حساب کاربری
            </h2>
            <p>
              برای استفاده از برخی امکانات پلتفرم، ثبت‌نام با شماره موبایل
              الزامی است. شما مسئول حفظ امنیت حساب کاربری خود هستید.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ۳. رزرو و شرکت در رویدادها
            </h2>
            <p>
              رزرو رویداد به منزله تعهد به شرکت در آن است. لغو رزرو تابع
              سیاست‌های هر رویداد می‌باشد. هزینه‌ها پس از تأیید پرداخت قابل
              استرداد نیستند مگر در موارد استثنایی.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ۴. رفتار کاربران
            </h2>
            <p>
              کاربران متعهد می‌شوند در رویدادها با احترام متقابل رفتار کنند.
              هرگونه رفتار مخل یا توهین‌آمیز می‌تواند منجر به تعلیق حساب کاربری
              گردد.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ۵. محدودیت مسئولیت
            </h2>
            <p>
              پلتفرم راوی تسهیل‌کننده ارتباط بین کاربران و برگزارکنندگان رویداد
              است. مسئولیت محتوای رویدادها و تجربه شرکت‌کنندگان بر عهده
              برگزارکننده می‌باشد.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ۶. تغییر در شرایط
            </h2>
            <p>
              پلتفرم راوی حق دارد در هر زمان این شرایط را به‌روزرسانی کند.
              ادامه استفاده از پلتفرم پس از اعمال تغییرات به منزله پذیرش آن‌ها
              است.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ۷. تماس با ما
            </h2>
            <p>
              در صورت داشتن سوال درباره شرایط استفاده، از طریق صفحه{" "}
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
