"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliStructure from '@/components/KundaliStructure';
import PlanetTable from "@/components/PlanetTable";
import PlanetAspectTable from "@/components/PlanetAspectTable";
import Link from "next/link";
import { computeD9Chart } from "@/lib/computeD9";

export default function KundaliInfoInner() {
  const [kundali, setKundali] = useState(null);
  const [isSideOpen, setIsSideOpen] = useState(false)
  const params = useSearchParams();
  const router = useRouter();

  const indexParam = params.get("index");

  useEffect(() => {
    async function load() {
      if (indexParam === null) {
        router.push("/");
        return;
      }

      const idx = Number(indexParam);
      if (isNaN(idx) || idx < 0) {
        router.push("/");
        return;
      }

      const record = await loadKundaliByIndex(idx);
      if (!record) {
        router.push("/");
        return;
      }

      setKundali(record);
    }
    load();
  }, [indexParam, router]);

  // console.log((kundali?.raw?.planets?.Sun?.house))

  // d9 chart
  const d9 = computeD9Chart(kundali);

  if (!kundali) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="p-2 overflow-hidden text-black" >
      <div className="w-[98%] mx-auto">

        {/* HEADER */}
        <div className="rounded-3xl overflow-hidden mb-4">
          <div className="bg-linear-to-r from-[#FFE984] to-[#FFB111] p-5 flex gap-4 items-center">
            <img
              src="/images/kundaliHead.png"
              className={`${isSideOpen ? 'rotate-180' : ''} transition-all duration-300 w-12 brightness-0`}
              onClick={() => setIsSideOpen(!isSideOpen)}
            />
            <span className="bg-linear-to-l from-[#F26A20]/50 to-red-500 bg-clip-text text-transparent text-xl">
              {kundali.meta?.name}'s Kundali
            </span>
          </div>
        </div>

        {/* Keep panel mounted always */}
        <div
          className={`max-md:block hidden h-screen w-70 bg-black absolute z-20 rounded-3xl p-3
            transition-all duration-300 delay-150 top-2 ${isSideOpen ? 'left-2' : '-left-80'}`}
        >
          <img
            src="/images/kundaliHead.png"
            className={`${isSideOpen ? 'rotate-180' : ''} transition-all duration-300 w-12 brightness-0 invert-100`}
            onClick={() => setIsSideOpen(!isSideOpen)}
          />
          <div className="w-full text-white mt-5 text-lg" onClick={() => setIsSideOpen(!isSideOpen)}>
            <div className="border-b-2 pb-2">
              <Link href="/panchang" >
                लग्न कुंडली
              </Link>
            </div>
            <div className="border-b-2 py-2">
              नवमांश कुंडली
            </div>
            <div className="border-b-2 py-2">
              सामान्य परिचय
            </div>
            <div className="border-b-2 py-2">
              फलादेश
            </div>
            <div className="border-b-2 py-2">
              महादशा
            </div>
            <div className="border-b-2 py-2">
              दोष
            </div>
            <div className="border-b-2 py-2">
              रत्न
            </div>
            <div className="border-b-2 py-2">
              उपाय
            </div>
          </div>
        </div>


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
           <KundaliStructure kundali={d9} title="D9 - Navamsa Chart" />

        </div>

      </div>
      <pre className="whitespace-pre-wrap bg-black/40 p-3 rounded-xl text-white">
        {JSON.stringify(kundali.raw, null, 2)}
      </pre>
    </div>
  );
}
