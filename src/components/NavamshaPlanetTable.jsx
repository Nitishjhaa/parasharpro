"use client";

import { getHindiRashi } from "@/lib/rashi";
import { convertToDMS } from "@/lib/convertToDMS";

export default function NavamshaPlanetTable({ d9 }) {
    if (!d9 || !d9.planets) return null;

    const planets = d9.planets;

    const rows = [
        { hi: "सूर्य", en: "Sun" },
        { hi: "चंद्र", en: "Moon" },
        { hi: "मंगल", en: "Mars" },
        { hi: "बुध", en: "Mercury" },
        { hi: "गुरु", en: "Jupiter" },
        { hi: "शुक्र", en: "Venus" },
        { hi: "शनि", en: "Saturn" },
        { hi: "राहु", en: "Rahu" },
        { hi: "केतु", en: "Ketu" },
    ];

    // List of Rashis to convert index → name
    const rashiList = [
        "Aries", "Taurus", "Gemini", "Cancer",
        "Leo", "Virgo", "Libra", "Scorpio",
        "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];

    return (
        <div className="w-full p-1.5">
            <div className="w-full py-10">
                <h2 className="mb-3 text-2xl text-center">
                    नवमांश ग्रह तालिका
                </h2>

                <table className="w-full border-2 border-black text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">ग्रह</th>
                            <th className="px-4 py-2">अंश (Navamsha)</th>
                            <th className="px-4 py-2">राशि</th>
                            <th className="px-4 py-2">तत्त्व</th>
                            <th className="px-4 py-2">भाव</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((p) => {
                            const data = planets[p.en];

                            return (
                                <tr key={p.en}>
                                    {/* ग्रह */}
                                    <td className="border-2 border-black px-2 py-2 text-center font-semibold">
                                        {p.hi}
                                    </td>

                                    {/* D9 Degree */}
                                    <td className="border-2 border-black px-2 py-2 text-center">
                                        {data?.degree !== undefined
                                            ? convertToDMS(data.degree)
                                            : "--"}
                                    </td>

                                    {/* D9 Rashi */}
                                    <td className="border-2 border-black px-2 py-2 text-center">
                                        {getHindiRashi(rashiList[data?.rashiIndex]) || "--"}
                                    </td>

                                    {/* Tatva */}
                                    <td className="border-2 border-black px-2 py-2 text-center">
                                        {data?.tatva || "--"}
                                    </td>

                                    {/* House */}
                                    <td className="border-2 border-black px-2 py-2 text-center">
                                        {data?.house || "--"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
