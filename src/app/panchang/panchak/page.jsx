"use client"

import { useState } from "react";
import PanchangHeader from "@/components/PanchangHeader";
import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from 'next/navigation';


export default function PanchakPage() {

    const [isSideOpen, setIsSideOpen] = useState(false);
    const router = useRouter();

    const panchak = [
        {
            day: "जनवरी",
            time: "21 जनवरी 1:36 AM से 25 जनवरी 1:36 PM तक"
        },
        {
            day: "फरवरी",
            time: "17 फरवरी 9:06 AM से 21 फरवरी 7:07 PM तक"
        },
        {
            day: "मार्च",
            time: "16 मार्च 6:14 PM से 21 मार्च 2:28 AM तक"
        },
        {
            day: "अप्रैल",
            time: "13 अप्रैल 03:45 AM से 17 अप्रैल 12:03 PM तक"
        },
        {
            day: "मई",
            time: "10 मई 12:13 PM से 14 मई 10:34 PM तक"
        },
        {
            day: "जून",
            time: "06 जून 07:04 PM से 11 जून 08:17 AM तक"
        },
        {
            day: "जुलाई",
            time: "03 जुलाई 00:49 AM से 08 जुलाई 04:00 PM तक"
        },
        {
            day: "अगस्त",
            time: "31 जुलाई 06:38 AM से 04 अगस्त 09:54 PM तक || 27 अगस्त 01:36 PM से 01 सितम्बर 03:24 AM तक"
        },
        {
            day: "सितम्बर",
            time: "23 सितम्बर 09:57 PM से 28 सितम्बर 10:17 AM तक"
        },
        {
            day: "अक्टूबर",
            time: "21 अक्टूबर 07:01 AM से 25 अक्टूबर 07:22 PM तक"
        },
        {
            day: "नवम्बर",
            time: "17 नवम्बर 03:31 PM से 22 नवम्बर 05:55 AM तक"
        },
        {
            day: "दिसम्बर",
            time: "14 दिसम्बर 10:36 PM से 19 दिसम्बर 03:58 PM तक"
        },
    ]

    return (
        <div className="md:hidden p-2 text-white">
            <div className="w-[98%] mx-auto">
                <PanchangHeader title="पंचक" isSideOpen={isSideOpen} setIsSideOpen={setIsSideOpen} />

                <div className="flex flex-col bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-10 p-3 mt-3">

                    <div className="my-5 text-black font-bold flex gap-2">
                        <span onClick={() => router.back()} className="px-2 py-2 border bg-black text-white rounded-full flex gap-2 justify-center items-center">
                            <MdArrowBackIos size={12} /> Back
                        </span>
                    </div>

                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-black mb-4">पंचक सारणी</h1>
                    </div>

                    <div className="flex flex-col text-black">
                        <div className="flex flex-col">
                            {
                                panchak.map((item, index) => (
                                    <div key={index} className={`flex flex-col rounded-lg ${index % 2 === 0 ? "bg-white mb-5 overflow-hidden" : "mb-5"}`}>
                                        <div className={`w-full py-3 text-center ${index % 2 === 0 ? "border-black  border-b" : "border"}`}>{item.day}</div>
                                        <div className={`w-full py-3 text-center  ${index % 2 === 0 ? "border-black border-t" : "border"}`}>{item.time}</div>
                                    </div>
                                ))
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}