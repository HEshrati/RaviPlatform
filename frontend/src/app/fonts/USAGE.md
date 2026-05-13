# استفاده از فونت دانا

فونت دانا به صورت خودکار در تمام پروژه فعال شده است.

## استفاده در JSX/TSX

```tsx
// استفاده پیش‌فرض (همه جا فعال است)
<div>این متن با فونت دانا نمایش داده می‌شود</div>

// استفاده با کلاس‌های Tailwind
<h1 className="font-dana font-bold text-2xl">عنوان با فونت دانا</h1>
<p className="font-dana-medium">متن با وزن متوسط</p>
<span className="font-dana-regular">متن با وزن معمولی</span>
```

## استفاده در CSS

```css
.my-custom-class {
  font-family: var(--font-dana);
  font-weight: 500;
}
```

## وزن‌های موجود

- **Regular (400)**: برای متن‌های معمولی
- **Medium (500)**: برای متن‌های با تاکید کم
- **DemiBold (600)**: برای عنوان‌های کوچک
- **Bold (700)**: برای عنوان‌های اصلی

## مثال‌های کاربردی

```tsx
// صفحه لاگین
export default function LoginPage() {
  return (
    <div className="font-dana">
      <h1 className="font-bold text-3xl mb-4">ورود به سیستم</h1>
      <p className="font-medium text-gray-600 mb-8">
        لطفاً اطلاعات خود را وارد کنید
      </p>
      <form>
        <input 
          type="email" 
          placeholder="ایمیل" 
          className="font-dana-regular"
        />
      </form>
    </div>
  );
}
```

## تست فونت

برای اطمینان از نصب صحیح فونت:

1. سرور dev رو اجرا کن: `npm run dev`
2. صفحه رو باز کن
3. در DevTools به تب Elements برو
4. روی یک المنت متنی کلیک راست کن و Inspect کن
5. در تب Computed به font-family نگاه کن
6. باید Dana رو ببینی

## عیب‌یابی

اگر فونت لود نمی‌شه:
1. کش مرورگر رو پاک کن
2. سرور dev رو restart کن
3. بررسی کن فایل‌های .woff2 در `src/app/fonts/` وجود دارند
4. Console مرورگر رو برای خطا بررسی کن
