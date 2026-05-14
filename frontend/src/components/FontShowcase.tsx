export default function FontShowcase() {
  return (
    <div className="p-8 space-y-6">
      <div className="space-y-4">
        <h1 className="font-dana-bold text-4xl">
          عنوان اصلی با فونت دانا (Bold)
        </h1>
        <h2 className="font-dana-semibold text-3xl">
          عنوان فرعی با فونت دانا (SemiBold)
        </h2>
        <h3 className="font-dana-medium text-2xl">
          عنوان کوچک با فونت دانا (Medium)
        </h3>
        <p className="font-dana-regular text-lg">
          این یک پاراگراف نمونه با فونت دانا است. این فونت برای نوشتن متون فارسی بسیار مناسب است و خوانایی بالایی دارد.
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-bold text-xl">وزن‌های مختلف فونت:</p>
        <p className="font-normal">Regular (400) - متن معمولی</p>
        <p className="font-medium">Medium (500) - متن با تاکید کم</p>
        <p className="font-semibold">SemiBold (600) - متن با تاکید متوسط</p>
        <p className="font-bold">Bold (700) - متن پررنگ</p>
      </div>

      <div className="space-y-2">
        <p className="font-bold text-xl">اعداد فارسی:</p>
        <p className="text-3xl">۰۱۲۳۴۵۶۷۸۹</p>
      </div>

      <div className="space-y-2">
        <p className="font-bold text-xl">علائم نگارشی:</p>
        <p className="text-lg">؟ ، . ؛ : « » - ( ) [ ]</p>
      </div>
    </div>
  );
}
