export default function PitchesPage() {
  return (
    <div className="bg-[#2C2C2C] p-6 rounded-lg shadow-sm text-[#E8E8E8]">
      <h1 className="text-2xl font-bold mb-6">Your Pitches</h1>
      
      <div className="space-y-4">
        {/* Pitch Card 1 */}
        <div className="border border-[#3F3F3F] bg-[#383838] rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white">Eco-Friendly Packaging</h2>
          <p className="text-[#9ca3af]">
            Status: <span className="text-yellow-400">Pending</span>
          </p>
          <p className="text-[#9ca3af]">Funding Goal: <span className="text-[#E8E8E8]">$50,000</span></p>
        </div>

        {/* Pitch Card 2 */}
        <div className="border border-[#3F3F3F] bg-[#383838] rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white">Health Tracker App</h2>
          <p className="text-[#9ca3af]">
            Status: <span className="text-green-400">Live</span>
          </p>
          <p className="text-[#9ca3af]">Funding Goal: <span className="text-[#E8E8E8]">$75,000</span></p>
        </div>
      </div>
    </div>
  );
}
