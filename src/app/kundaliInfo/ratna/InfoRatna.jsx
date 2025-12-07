"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliHeader from "@/components/KundaliHeader";
import { gemForLagan } from "@/lib/gemsForLagan";
import { getDrishtiFromHouses } from '../AstrologicalData'

export default function KundaliInfoInner() {
    const [kundali, setKundali] = useState(null);
    const [ratna, setRatna] = useState(null);
    const [isSideOpen, setIsSideOpen] = useState(false);

    const params = useSearchParams();
    const router = useRouter();

    const indexParam = params.get("index");

    // Load Kundali
    useEffect(() => {
        async function load() {
            if (!indexParam) return;

            const idx = Number(indexParam);
            if (isNaN(idx) || idx < 0) return;

            const record = await loadKundaliByIndex(idx);
            if (!record) return;

            setKundali(record);
        }
        load();
    }, [indexParam, router]);

    // Compute gemstones when kundali is ready
    useEffect(() => {
        const asc = kundali?.raw?.ascendant?.rashiIndex;

        if (asc === undefined || asc === null) return;

        if (asc >= 0 && asc <= 11) {
            const result = gemForLagan(asc);
            setRatna(result);
        }
    }, [kundali]);

    // Loading screen
    if (!kundali || ratna === null) {
        return <div className="p-4 text-white">Loading...</div>;
    }

    return (
        <div className="p-2 overflow-hidden text-black">
            <div className="w-[98%] mx-auto">
                <KundaliHeader
                    title="रत्न"
                    indexParam={indexParam}
                    isSideOpen={isSideOpen}
                    setIsSideOpen={setIsSideOpen}
                />

                <div className="flex flex-col justify-center items-center bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-10">

                    {/* Render all valid gemstones */}
                    <div className="w-full grid grid-cols-3 xl:grid-cols-5 gap-5 mt-6 p-5 lg:p-10">
                        {Object.entries(ratna)
                            .filter(([key, value]) => value && value.planet) // render only valid entries
                            .map(([key, value]) => (
                                <div key={key} className="lg:w-40 w-25 h-25 shadow-2xl lg:h-40 flex flex-col justify-center items-center rounded-2xl">
                                    {/* Category Hindi Title */}
                                    <h3 className="font-bold md:text-base text-sm text-center">
                                        {value.categoryHindi}
                                    </h3>

                                    {/* Stone Hindi */}
                                    <p className="text-base text-red-600">
                                        {value.hindiGem}
                                    </p>
                                </div>
                            ))}

                    </div>
                </div>
            </div>
        </div>
    );
}
