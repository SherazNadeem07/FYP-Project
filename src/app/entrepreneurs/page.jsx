"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEntrepreneurs } from "../../Redux/Slices/enterpreneur";
import { useRouter } from "next/navigation";

export default function EntrepreneursPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list, loading, error } = useSelector((state) => state.entrepreneurs);

  useEffect(() => {
    dispatch(fetchEntrepreneurs());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#14142B] text-white py-16 px-6 md:px-16">
      {/* Back to Home Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/")}
          className="text-white bg-indigo-700 hover:bg-[#D0140F] cursor-pointer px-6 py-2 rounded-lg font-medium shadow-lg transition"
        >
          ← Back to Home
        </button>
      </div>

      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-tight text-indigo-400">
        Featured Entrepreneurs
      </h1>

      {loading && <p className="text-center text-indigo-300 text-lg">Loading profiles...</p>}
      {error && <p className="text-center text-red-400 text-lg">Error: {error}</p>}

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {list.map((entrepreneur) => (
          <div
            key={entrepreneur.id}
            className="bg-[#1E1E3F] rounded-2xl p-6 shadow-lg hover:shadow-indigo-600 transition duration-300 border border-indigo-700"
          >
            <div className="flex flex-col items-center">
              <img
                src={entrepreneur.image}
                alt={entrepreneur.name}
                className="w-24 h-24 object-cover rounded-full border-4 border-indigo-500 shadow-md mb-4"
              />
              <h2 className="text-xl font-bold text-center">{entrepreneur.name}</h2>
              <p className="text-indigo-300 text-sm text-center mb-2">{entrepreneur.title}</p>
              <p className="text-sm text-center text-gray-300 mb-4">{entrepreneur.bio}</p>
            </div>

            <div className="bg-[#25254a] p-4 rounded-xl mt-4 space-y-2">
              <div className="text-sm text-gray-400">
                <span className="font-semibold text-indigo-300">Startup Idea:</span>{" "}
                {entrepreneur.idea}
              </div>
              <div className="text-sm text-gray-400">
                <span className="font-semibold text-indigo-300">Product:</span>{" "}
                {entrepreneur.product}
              </div>
              <div className="text-sm text-gray-400">
                <span className="font-semibold text-indigo-300">Investment Raised:</span>{" "}
                ${entrepreneur.investment}K
              </div>
              <div className="text-sm text-gray-400">
                <span className="font-semibold text-indigo-300">Profit:</span>{" "}
                <span className="text-green-400">${entrepreneur.profit}K</span>
              </div>
              <div className="text-sm text-gray-400">
                <span className="font-semibold text-indigo-300">Loss:</span>{" "}
                <span className="text-red-400">${entrepreneur.loss}K</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
