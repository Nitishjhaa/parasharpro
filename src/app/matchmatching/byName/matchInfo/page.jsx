"use client";

import { useEffect, useState } from "react";
import { loadMatchMaking } from "@/lib/db";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const MatchInfoByNamePage = () => {
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await loadMatchMaking();
                if (data && data.isByName) {
                    setMatchData(data);
                } else {
                    if (data && !data.isByName) setMatchData(null);
                    else setMatchData(data);
                }
            } catch (error) {
                console.error("Error loading match making data:", error);
                toast.error("Failed to load matchmaking data");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading match data...</div>
            </div>
        );
    }

    if (!matchData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="text-white text-xl">No match making data found</div>
                <button
                    onClick={() => router.push('/matchmatching/byName')}
                    className="bg-[#104072] text-white px-6 py-2 rounded-xl"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const { gunMilan, totalScore } = matchData;
    const individualScores = gunMilan.individualScores;

    const info1 = [
        { label: "वर्ण", female: individualScores.varna, total: 1 },
        { label: "वश्य", female: individualScores.vashya, total: 2 },
        { label: "तारा", female: matchData.tara.points, total: 3 },
        { label: "योनि", female: individualScores.yoni, total: 4 },
        { label: "ग्रह मैत्री", female: individualScores.grahaMaitri, total: 5 },
        { label: "गण", female: individualScores.gana, total: 6 },
        { label: "भकूट (राशि)", female: individualScores.bhakoot, total: 7 },
        { label: "नाड़ी", female: individualScores.nadi, total: 8 },
        { label: "कुल योग", female: (totalScore+matchData.tara.points), total: 36 },
    ];

    return (
        <div className="min-h-screen p-2 w-[98%] mx-auto">
            {/* HEADER */}
            <div className="rounded-3xl overflow-hidden mb-4">
                <div className="bg-linear-to-r from-[#FFE984] to-[#FFB111] p-5 flex gap-4 items-center">
                    <img src="/images/kundaliHead.png" className="w-12 brightness-0" />
                    <span className="bg-linear-to-l from-[#F26A20]/50 to-red-500 bg-clip-text text-transparent text-2xl">
                        Result 
                    </span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-4">
                <div className="bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-2xl overflow-hidden p-6">

                    {/* Names Display */}
                    <div className="flex justify-between items-center mb-8 px-4">
                        <div className="text-center">
                            <h3 className="text-gray-800 font-semibold mb-1">Boy</h3>
                            <p className="text-xl font-bold text-black">{matchData.male.meta.name}</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-gray-800 font-semibold mb-1">Girl</h3>
                            <p className="text-xl font-bold text-black">{matchData.female.meta.name}</p>
                        </div>
                    </div>

                    {/* Ashtakoot Table */}
                    <div className="bg-white/40 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full">
                            <thead className="bg-black/10 text-gray-900 border-b border-black/10">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold">अष्टकूट </th>
                                    <th className="text-center px-3 py-3 font-semibold">प्राप्तांक </th>
                                    <th className="text-center px-3 py-3 font-semibold">पूर्णांक</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/10 text-gray-800">
                                {info1.map((item, index) => (
                                    <tr key={index} className={item.label === "कुल योग" ? "bg-black/5 font-bold" : ""}>
                                        <td className="px-4 py-3">{item.label}</td>
                                        <td className="px-3 py-3 text-center">{item.female}</td>
                                        <td className="px-3 py-3 text-center">{item.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 text-center text-black/70 italic text-sm">
                        * Note: This calculation is based on the first sound of the names provided.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchInfoByNamePage;
