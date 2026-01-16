"use client"

import { useState } from "react";
import Link from "next/link";
import { pName } from "./nameAndHref";


export default function PanchangPage() {
  

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
          <div className="grid gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 p-4">
            {
              pName.map((p, index) => (
                <div className="card-bg w-full h-16 rounded-lg! p-4" key={index}>
                  <Link  href={`/panchang/${p.href}`}>
                    <h1 className="text-lg ">{p.name}</h1>
                  </Link>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}