export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col gap-4 p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-xl w-48 mx-auto"></div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-2xl p-4 flex flex-col gap-3">
            <div className="h-40 bg-gray-200 rounded-xl"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
