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

  // console.log((kundali?.raw?.planets?.Sun?.house))
  // console.log((kundali))

  if (!kundali) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="p-2 overflow-hidden text-black" >
      <div className="w-[98%] mx-auto">

        <KundaliHeader
          title="लग्न कुंडली"
          indexParam={indexParam}
          isSideOpen={isSideOpen}
          setIsSideOpen={setIsSideOpen}
        />

        {/* <h1 className="text-2xl mb-4">Kundali Information</h1> */}

        {/* <div className="mb-4 p-3 bg-white/10 rounded">
        <div className="font-semibold text-lg">{kundali.meta?.name}</div>
        <div className="text-sm text-gray-300">
          {kundali.meta?.birthDate} • {kundali.meta?.birthTime}
        </div>
        <div className="text-sm text-gray-400">{kundali.meta?.city}</div>
      </div> */}
        <div className="flex flex-col justify-center items-center bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-10">
          <KundaliStructure kundali={kundali} title="लग्न कुंडली" />
          <PlanetTable kundali={kundali} />
          <PlanetAspectTable kundali={kundali} />

        </div>

      </div>
      {/* <pre className="whitespace-pre-wrap bg-black/40 p-3 rounded-xl text-white">
        {JSON.stringify(kundali.raw, null, 2)}
      </pre> */}
    </div>
  );
}
