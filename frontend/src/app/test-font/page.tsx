import FontShowcase from '@/components/FontShowcase';

export default function TestFontPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 my-8">
          <h1 className="font-dana-bold text-4xl mb-4 text-center">
            تست فونت دانا
          </h1>
          <p className="text-center text-gray-600 mb-8">
            این صفحه برای تست و نمایش فونت دانا در وزن‌های مختلف طراحی شده است
          </p>
          <FontShowcase />
        </div>
      </div>
    </div>
  );
}
