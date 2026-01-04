"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { saveMatchMaking } from "@/lib/db";

const MatchMakingByNamePage = () => {
  const [boyName, setBoyName] = useState("");
  const [girlName, setGirlName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMatchMaking = async () => {
    if (!boyName || !girlName) {
      toast.error("Please enter both Boy and Girl names");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/matchmaking/byName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boyName, girlName }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate matchmaking');
      }

      const data = await response.json();

      // Save to IndexedDB (emulating the same structure as byBirth but with name-based results)
      const matchData = {
        male: {
          raw: {
            planets: {
              Moon: data.boy,
            }
          },
          meta: {
            name: boyName,
            isByName: true
          }
        },
        female: {
          raw: {
            planets: {
              Moon: data.girl,
            }
          },
          meta: {
            name: girlName,
            isByName: true
          }
        },
        gunMilan: data.gunMilan,
        tara: data.tara,
        totalScore: data.totalScore,
        isByName: true
      };

      await saveMatchMaking(matchData);
      toast.success("Matchmaking Generated Successfully!");

      // Navigate to matchInfo page (it should handle name-based results if updated too)
      router.push("/matchmatching/byName/matchInfo");

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-[98%] mx-auto p-2'>
      {/* HEADER */}
      <div className="rounded-3xl overflow-hidden mb-4">
        <div className="card-bg p-5 flex gap-4 items-center">
          <img src="/images/kundaliHead.png" className="w-12" />
          <span className="bg-linear-to-l from-[#F26A20]/50 to-red-500 bg-clip-text text-transparent text-2xl">
            Match Making 
          </span>
        </div>
      </div>

      {/* MOBILE FORMS - SCROLLABLE */}
      <div className="card-bg rounded-3xl p-5 max-h-[80vh] overflow-y-auto">

        {/* MALE FORM */}
        <div className="mb-8">
          <div className="space-y-6">

            {/* Boy Name */}
            <div>
              <label className="text-[#d5d5d5] font-semibold">Boy Name:</label>
              <input
                className="w-full bg-transparent border-b border-gray-400 mt-1 p-1 outline-none text-white"
                placeholder="Male Name"
                value={boyName}
                onChange={(e) => setBoyName(e.target.value)}
              />
            </div>

            {/* Girl Name */}
            <div>
              <label className="text-[#d5d5d5] font-semibold">Girl Name:</label>
              <input
                className="w-full bg-transparent border-b border-gray-400 mt-1 p-1 outline-none text-white"
                placeholder="Girl Name"
                value={girlName}
                onChange={(e) => setGirlName(e.target.value)}
              />
            </div>

            <button
              onClick={handleMatchMaking}
              disabled={loading}
              className="w-full bg-[#104072] rounded-xl py-3 text-white font-semibold mt-6 disabled:opacity-50"
            >
              {loading ? "Calculating..." : "Generate Match Making"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchMakingByNamePage;
