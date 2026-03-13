"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import KundaliStructure from '@/components/KundaliStructure';
import PlanetTable from "@/components/PlanetTable";
import PlanetAspectTable from "@/components/PlanetAspectTable";
import KundaliHeader from '@/components/KundaliHeader'

export default function KundaliInfoInner() {
  const [kundali, setKundali] = useState(null);
  const [isSideOpen, setIsSideOpen] = useState(false)
  const params = useSearchParams();
  const router = useRouter();
  const [lagna, setLagna] = useState([]);

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

  useEffect(() => {
    fetch('/data/lagans.json')
      .then((r) => r.json())
      .then((data) => setLagna(data));
  }, []);

  let today = new Date();
  let birthDate = new Date(kundali?.raw?.meta?.datetimeUTC);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  // If days are negative, borrow days from previous month
  if (days < 0) {
    months--;

    // Get days in previous month
    let prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  // If months are negative, borrow from years
  if (months < 0) {
    years--;
    months += 12;
  }

  // if (!kundali) return <div className="p-4 text-white">Loading...</div>;
  // if (!kundali?.raw?.ascendant?.rashiIndex) return <div className="p-4 text-white">Loading...</div>;

  const lagnaIndex = kundali?.raw?.ascendant?.rashiIndex;

  const selectedLagna = lagna?.[lagnaIndex] || null;

  const isValid = (value) =>
    value !== null && value !== undefined && value !== "";

  return (
    <div className="p-2 overflow-hidden text-black" >
      <div className="w-[98%] mx-auto">

        <KundaliHeader
          title="लग्न कुंडली"
          indexParam={indexParam}
          isSideOpen={isSideOpen}
          setIsSideOpen={setIsSideOpen}
        />

        <div className="relative flex flex-col justify-center items-center bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-10">
          
          <div className="absolute -top-20 right-18 w-10 h-10 rounded-full bg-black hover:bg-white text-white hover:text-black cursor-pointer flex justify-center items-center transition-all duration-300 active:scale-80">
            <Link href={`/kundaliInfo/mahadasha?index=${indexParam}`}>
              𝕄
            </Link>
          </div>
          
          <KundaliStructure kundali={kundali} title="लग्न कुंडली" />

          <div className="text-xl w-full ml-3">
            उम्र : {years} वर्ष {months} महीने {days} दिन
          </div>

          <PlanetTable kundali={kundali} />
          <PlanetAspectTable kundali={kundali} />

          <div className="h-fit w-full flex flex-col justify-center items-center mt-10">
            <div className="w-40 h-full rounded-2xl flex justify-center items-center text-2xl">
              लग्न परिचय
            </div>

            <div className="border-2 w-[97%] mx-auto h-fit p-4  text-black">

              {selectedLagna ? (
                <div className="space-y-3">

                  {isValid(selectedLagna.nameOfLagan) && (
                    <p><strong>लग्न:</strong> {selectedLagna.nameOfLagan}</p>
                  )}

                  {isValid(selectedLagna.malik) && (
                    <p><strong>स्वामी:</strong> {selectedLagna.malik}</p>
                  )}

                  {isValid(selectedLagna.subh) && (
                    <p><strong>शुभ ग्रह:</strong> {selectedLagna.subh}</p>
                  )}

                  {isValid(selectedLagna.ashubh) && (
                    <p><strong>अशुभ ग्रह:</strong> {selectedLagna.ashubh}</p>
                  )}

                  {isValid(selectedLagna.raajyogKarak) && (
                    <p><strong>राजयोग कारक:</strong> {selectedLagna.raajyogKarak}</p>
                  )}

                  {isValid(selectedLagna.maarak) && (
                    <p><strong>मारक:</strong> {selectedLagna.maarak}</p>
                  )}

                  <div className={`${!isValid(selectedLagna.ghaatak) ? "hidden" : ""}`}>
                    {isValid(selectedLagna.ghaatak) && (
                      <p><strong>घातक:</strong> {selectedLagna.ghaatak}</p>
                    )}
                  </div>

                  <div className={`${!isValid(selectedLagna.parampaapi) ? "hidden" : ""}`}>
                    {isValid(selectedLagna.parampaapi) && (
                      <p><strong>परम पापी:</strong> {selectedLagna.parampaapi}</p>
                    )}
                  </div>

                  {isValid(selectedLagna.description) && (
                    <p className="whitespace-pre-line leading-7">
                      {selectedLagna.description}
                    </p>
                  )}
                </div>
              ) : (
                <p>लग्न विवरण उपलब्ध नहीं है।</p>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
