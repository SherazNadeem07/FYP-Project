export default function PitchesPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Your Pitches</h1>
      <div className="space-y-4">
        {/* This would be populated with pitch cards */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold">Eco-Friendly Packaging</h2>
          <p className="text-gray-600">Status: <span className="text-yellow-600">Pending</span></p>
          <p className="text-gray-600">Funding Goal: $50,000</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold">Health Tracker App</h2>
          <p className="text-gray-600">Status: <span className="text-green-600">Live</span></p>
          <p className="text-gray-600">Funding Goal: $75,000</p>
        </div>
      </div>
    </div>
  );
}