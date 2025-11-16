"use client";

import { computePlanetTatvas } from "@/lib/getTatva";
import { getHindiNakshatra } from "@/lib/nakshatra";
import { getHindiRashi } from "@/lib/rashi";


export default function PlanetTable({ kundali }) {

    if (!kundali) return null;

    const planets = kundali.planets || kundali.raw?.planets || {};
    const tatvas = computePlanetTatvas(kundali);

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

    return (
        <div className="w-full p-1.5">
            <div className="w-full py-10">
                <h2 className="mb-3 text-2xl text-center">
                    ग्रहों की स्थिति
                </h2>

                <table className="w-full border-2 border-black text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">ग्रह</th>
                            <th className="px-4 py-2">अंश</th>
                            <th className="px-4 py-2">नक्षत्र (चरण)</th>
                            <th className="px-4 py-2">राशि</th>
                            <th className="px-4 py-2">तत्त्व</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((p) => {
                            const data = planets[p.en];
                            const tatva = tatvas[p.en]?.tatva;

                            return (
                                <tr key={p.en}>
                                    {/* ग्रह */}
                                    <td className="border-2 border-black px-2 py-2 text-center font-semibold">
                                        {p.hi}
                                    </td>

                                    {/* अंश */}
                                    <td className="border-2 border-black px-2 py-2 text-center">
                                        {data?.anshDMS
                                            ? `${data.anshDMS.d}:${data.anshDMS.m}:${data.anshDMS.s}`
                                            : "--"}
                                    </td>

                                    {/* नक्षत्र + चरण */}
                                    <td className="border-2 border-black px-2 py-2 text-center">
                                        {getHindiNakshatra(data?.nakshatra)} ({data?.pada})
                                    </td>

                                    {/* राशि */}
                                    <td className="border-2 border-black px-2 py-2 text-center">
                                        {getHindiRashi(data?.rashi)}
                                    </td>

                                    {/* तत्त्व */}
                                    <td className="border-2 border-black px-2 py-2 text-center">
                                        {tatva || "--"}
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
