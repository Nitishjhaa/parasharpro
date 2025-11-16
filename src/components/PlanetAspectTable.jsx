"use client";

import { getPlanetaryDrishti } from "@/lib/getPlanetaryDrishti";

const planetList = [
    { hi: "सूर्य", en: "Sun" },
    { hi: "चंद्र", en: "Moon" },
    { hi: "मंगल", en: "Mars" },
    { hi: "बुध", en: "Mercury" },
    { hi: "गुरु", en: "Jupiter" },
    { hi: "शुक्र", en: "Venus" },
    { hi: "शनि", en: "Saturn" },
    { hi: "राहु", en: "Rahu" },
    { hi: "केतु", en: "Ketu" }
];

export default function PlanetAspectTable({ kundali }) {

    if (!kundali) return null;

    const drishti = getPlanetaryDrishti(kundali);

    return (
        <div className="flex flex-col items-center w-full p-1.5">
            <h2 className="text-2xl mb-3">
                ग्रह दृष्टि
            </h2>

            <table className="w-full border-2 border-black text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2">ग्रह</th>
                        <th className="px-4 py-2">पूर्ण दृष्टि</th>
                        <th className="px-4 py-2">1 पाद</th>
                        <th className="px-4 py-2">2 पाद</th>
                        <th className="px-4 py-2">3 पाद</th>
                    </tr>
                </thead>

                <tbody>
                    {planetList.map((p) => {
                        const d = drishti[p.en] || {};

                        return (
                            <tr key={p.en}>
                                <td className="border-2 border-black px-2 py-3 text-center font-semibold">
                                    {p.hi}
                                </td>

                                <td className="border-2 border-black px-2 py-3 text-center">
                                    {d.purnDrishti?.join(", ") || "--"}
                                </td>

                                <td className="border-2 border-black px-2 py-3 text-center">
                                    {d.ekPaadDrishti?.join(", ") || "--"}
                                </td>

                                <td className="border-2 border-black px-2 py-3 text-center">
                                    {d.doPaadDrishti?.join(", ") || "--"}
                                </td>

                                <td className="border-2 border-black px-2 py-3 text-center">
                                    {d.teenPaadDrishti?.join(", ") || "--"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
