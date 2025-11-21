"use client";

import Link from "next/link";

export default function KundaliHeader({
  title = "कुंडली",
  indexParam,
  isSideOpen,
  setIsSideOpen,
}) {
  return (
    <>
      {/* ---------- TOP HEADER ---------- */}
      <div className="rounded-3xl overflow-hidden mb-4">
        <div className="bg-linear-to-r from-[#FFE984] to-[#FFB111] p-5 flex gap-4 items-center">
          <img
            src="/images/kundaliHead.png"
            className={`${isSideOpen ? "rotate-180" : ""} transition-all duration-300 w-12 brightness-0`}
            onClick={() => setIsSideOpen(!isSideOpen)}
          />
          <span className="bg-linear-to-l from-[#F26A20]/50 to-red-500 bg-clip-text text-transparent text-xl">
            {title}
          </span>
        </div>
      </div>

      {/* ---------- SIDE MENU (Mobile) ---------- */}
      <div
        // max-md:block hidden
        className={`h-screen w-70 bg-black absolute z-20 rounded-3xl p-3 transition-all duration-300 delay-150 top-2 ${isSideOpen ? "left-2" : "-left-80"
          }`}
      >
        <img
          src="/images/kundaliHead.png"
          className={`${isSideOpen ? "rotate-180" : ""} transition-all duration-300 w-12 brightness-0 invert-100`}
          onClick={() => setIsSideOpen(!isSideOpen)}
        />

        <div
          className="w-full text-white mt-5 text-lg"
          onClick={() => setIsSideOpen(false)}
        >
          <div className="border-b-2 pb-2">
            <Link href={`/kundaliInfo?index=${indexParam}`}>लग्न कुंडली</Link>
          </div>

          <div className="border-b-2 py-2">
            <Link href={`/kundaliInfo/navmansha?index=${indexParam}`}>
              नवमांश कुंडली
            </Link>
          </div>

          <div className="border-b-2 py-2">
            <Link href={`/kundaliInfo/mahadasha?index=${indexParam}`}>
              महादशा
            </Link>
          </div>

          <div className="border-b-2 py-2">
            <Link href={`/kundaliInfo/Info?index=${indexParam}`}>
              सामान्य परिचय
            </Link>
          </div>

          <div className="border-b-2 py-2">
            <Link href={`/kundaliInfo/faladesh?index=${indexParam}`}>
              फलादेश
            </Link>
          </div>

          <div className="border-b-2 py-2">दोष</div>

          <div className="border-b-2 py-2">
            <Link href={`/kundaliInfo/ratna?index=${indexParam}`}>
              रत्न
            </Link>
          </div>

          <div className="border-b-2 py-2">उपाय</div>
        </div>
      </div>
    </>
  );
}
