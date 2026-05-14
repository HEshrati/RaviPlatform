export default function Loading() {
  return (
    <div className="min-h-screen p-6 animate-pulse max-w-2xl mx-auto">
      <div className="h-8 bg-gray-200 rounded-xl w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
        ))}
      </div>
    </div>
  );
}
