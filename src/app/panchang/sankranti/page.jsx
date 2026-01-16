"use client"

import { useState } from "react";
import PanchangHeader from "@/components/PanchangHeader";
import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from 'next/navigation';


export default function SankrantiPage() {

    const [isSideOpen, setIsSideOpen] = useState(false);
    const router = useRouter();

    const rahuKaal = [
        {
            day: "जनवरी",
            time: "14"
        },
        {
            day: "फरवरी",
            time: "12"
        },
        {
            day: "मार्च",
            time: "14"
        },
        {
            day: "अप्रैल",
            time: "14"
        },
        {
            day: "मई",
            time: "15"
        },
        {
            day: "जून",
            time: "15"
        },
        {
            day: "जुलाई",
            time: "16"
        },
        {
            day: "अगस्त",
            time: "17"
        },
        {
            day: "सितम्बर",
            time: "17"
        },
        {
            day: "अक्टूबर",
            time: "17"
        },
        {
            day: "नवम्बर",
            time: "16"
        },
        {
            day: "दिसम्बर",
            time: "16"
        },
    ]

    return (
        <div className="md:hidden p-2 text-white">
            <div className="w-[98%] mx-auto">
                <PanchangHeader title="संक्रांति" isSideOpen={isSideOpen} setIsSideOpen={setIsSideOpen} />

                <div className="flex flex-col bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-10 p-3">

                    <div className="my-5 text-black font-bold flex gap-2">
                        <span onClick={() => router.back()} className="px-2 py-2 border bg-black text-white rounded-full flex gap-2 justify-center items-center">
                            <MdArrowBackIos size={12} /> Back
                        </span>
                    </div>

                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-black mb-4">संक्रांति समय सारणी</h1>
                    </div>

                    <div className="flex flex-col text-black">
                        <div className="flex bg-white">
                            <div className="w-[50%] py-3 text-center border">महीना</div>
                            <div className="w-[50%] py-3 text-center border">संक्रांति</div>
                        </div>
                        <div className="flex flex-col">
                            {
                                rahuKaal.map((item, index) => (
                                    <div key={index} className="flex">
                                        <div className="w-[50%] py-3 text-center border">{item.day}</div>
                                        <div className="w-[50%] py-3 text-center border">{item.time}</div>
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