"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliStructure from '@/components/KundaliStructure';
import PlanetTable from "@/components/PlanetTable";
import PlanetAspectTable from "@/components/PlanetAspectTable";
import KundaliHeader from '@/components/KundaliHeader'

export default function KundaliInfoInner() {
    const [kundali, setKundali] = useState(null);
    const [isSideOpen, setIsSideOpen] = useState(false)
    const params = useSearchParams();
    const router = useRouter();
    const [kundaliNumber, setKundaliNumber] = useState(null)

    const indexParam = params.get("index");

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


    // if (!kundali) return <div className="p-4 text-white">Loading...</div>;
    // if (!kundali?.raw?.ascendant?.rashiIndex) return <div className="p-4 text-white">Loading...</div>;

    return (
        <div className="p-2 overflow-hidden text-black" >
            <div className="w-[98%] mx-auto">

                <div className="">
                    <KundaliHeader
                        title="अन्य वर्ग-कुंडली"
                        indexParam={indexParam}
                        isSideOpen={isSideOpen}
                        setIsSideOpen={setIsSideOpen}
                    />
                    <div className="flex flex-col justify-center items-center bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-10">
                        <KundaliStructure kundali={kundali} title="लग्न कुंडली" />
                        <PlanetTable kundali={kundali} />

                    </div>
                </div>
            </div>
        </div>
    );
}
