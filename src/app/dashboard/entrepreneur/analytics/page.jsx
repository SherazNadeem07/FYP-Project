export default function AnalyticsPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Pitch Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total Views</h2>
          <p className="text-3xl font-bold">1,245</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total Likes</h2>
          <p className="text-3xl font-bold">356</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total Comments</h2>
          <p className="text-3xl font-bold">89</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Performance Over Time</h2>
        <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Performance chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
}