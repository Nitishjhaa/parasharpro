"use client"

import { useState } from "react";
import Link from "next/link";


export default function PanchangPage() {
  const [isSideOpen, setIsSideOpen] = useState(null);

  return (
    <div className="w-[98%] mx-auto p-2">
      <div>
        <div className="rounded-3xl overflow-hidden mb-4">
          <div className="card-bg p-5 flex gap-4 items-center">
            <img src="/images/kundaliHead.png" className="w-12 brightness-0 invert-100" />
            <span className="bg-linear-to-l from-[#F26A20]/50 to-red-500 bg-clip-text text-transparent text-2xl">
              पंचांग
            </span>
          </div>
        </div>

        <div className="mt-2 bg-[#222]/80 min-h-screen rounded-3xl">
          <div className="flex gap-3 h-40 p-2">
            <div className="card-bg w-[50%] rounded-2xl"></div>
            <div className=" w-[50%] rounded-2xl">
              <div className="flex flex-col gap-3">
                <div className="card-bg w-full h-16 rounded-2xl p-4">
                  <Link href="/panchang/rahuKaal">
                    <h1 className="text-lg ">गृह प्रवेश</h1>
                  </Link>
                </div>
                <div className="card-bg w-full h-16 rounded-2xl p-4">
                  <Link href="/panchang/rahuKaal">
                    <h1 className="text-lg ">राहु काल</h1>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 p-2">
            <div className="card-bg rounded-2xl h-16 p-4">
              <Link href="/panchang/rahuKaal">
                <h1 className="text-lg">गाड़ी लेने के दिन</h1>
              </Link>
            </div>
            <div className="card-bg rounded-2xl h-16 p-4">
              <Link href="/panchang/rahuKaal">
                <h1 className="text-lg">व्याह के दिन</h1>
              </Link>
            </div>
            <div className="card-bg rounded-2xl h-16 p-4">
              <Link href="/panchang/rahuKaal">
                <h1 className="text-lg">कुआं पूजन</h1>
              </Link>
            </div>
            <div className="card-bg rounded-2xl h-16 p-4">
              <Link href="/panchang/rahuKaal">
                <h1 className="text-lg"></h1>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}