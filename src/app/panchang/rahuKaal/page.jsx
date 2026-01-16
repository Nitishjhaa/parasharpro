"use client"

import { useState } from "react";
import PanchangHeader from "@/components/PanchangHeader";
import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from 'next/navigation';


export default function RahuKaalPage() {

    const [isSideOpen, setIsSideOpen] = useState(false);
    const router = useRouter();

    const rahuKaal = [
        {
            day: "सोमवार",
            time: "07:30 AM - 09:00 AM"
        },
        {
            day: "मंगलवार",
            time: "03:00 PM - 04:30 PM"
        },
        {
            day: "बुधवार",
            time: "12:00 PM - 01:30 PM"
        },
        {
            day: "गुरुवार",
            time: "01:30 PM - 03:00 PM"
        },
        {
            day: "शुक्रवार",
            time: "10:30 AM - 12:00 PM"
        },
        {
            day: "शनिवार",
            time: "09:00 AM - 10:30 AM"
        },
        {
            day: "रविवार",
            time: "04:30 PM - 06:00 PM"
        },
    ]

    return (
        <div className=" p-2 text-white">
            <div className="w-[98%] mx-auto">
                <PanchangHeader title="राहु काल" isSideOpen={isSideOpen} setIsSideOpen={setIsSideOpen} />

                <div className="flex flex-col bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-10 p-3 mt-3">

                    <div className="my-5 text-black font-bold flex gap-2">
                        <span onClick={() => router.back()} className="px-2 py-2 border bg-black text-white rounded-full flex gap-2 justify-center items-center">
                            <MdArrowBackIos size={12} /> Back
                        </span>
                    </div>

                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-black mb-4">समय सारणी</h1>
                    </div>

                    <div className="flex flex-col text-black ">
                        <div className="flex bg-white">
                            <div className="w-[30%] py-3 text-center border">दिन</div>
                            <div className="w-[70%] py-3 text-center border">समय</div>
                        </div>
                        <div className="flex flex-col">
                            {
                                rahuKaal.map((item, index) => (
                                    <div key={index} className="flex">
                                        <div className="w-[30%] py-3 text-center border">{item.day}</div>
                                        <div className="w-[70%] py-3 text-center border">{item.time}</div>
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