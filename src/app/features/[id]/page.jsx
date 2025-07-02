"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function InvestorDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { cards } = useSelector((state) => state.features);
  const [investor, setInvestor] = useState(null);

  useEffect(() => {
    const data = cards.find((c) => c.id.toString() === id);
    setInvestor(data);
  }, [id, cards]);

  if (!investor)
    return <div className="text-center py-20 text-gray-600">Investor not found...</div>;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-16 text-gray-900">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex flex-col items-center mb-6">
          <img
            src={investor.image}
            alt={investor.title}
            className="w-28 h-28 rounded-full border-4 border-indigo-500 mb-4"
          />
          <h1 className="text-2xl font-bold text-indigo-700 mb-1">{investor.title}</h1>
          <p className="text-gray-500 text-sm">{investor.location}</p>
          <p className="text-sm text-indigo-500">{investor.email || "investor@example.com"}</p>
        </div>

        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Sector:</strong> {investor.sector}</p>
          <p><strong>Investment:</strong> {investor.amount}</p>
          <p><strong>About:</strong> {investor.bio}</p>
          <p><strong>Experience:</strong> {investor.items}</p>
          <p><strong>Startups Funded:</strong> {investor.funded || "18"}</p>
          <p><strong>Avg Ticket Size:</strong> {investor.ticketSize || "$150K"}</p>
          <p><strong>Pitch Preferences:</strong> {investor.preferences || "FinTech, SaaS, GreenTech"}</p>
          <p><strong>Last Active:</strong> {investor.lastActive || "July 2, 2025"}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-indigo-700 font-bold text-lg mb-2">Portfolio Highlights</h3>
          <ul className="list-disc pl-6 text-sm text-gray-600">
            {(investor.portfolio || ["Startup A", "Startup B", "Startup C"]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex gap-4">
          <a href={investor.linkedin || "#"} className="text-indigo-600 hover:underline text-sm">
            LinkedIn
          </a>
          <a href={investor.twitter || "#"} className="text-indigo-600 hover:underline text-sm">
            Twitter
          </a>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => router.push("/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg text-sm font-medium shadow"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
