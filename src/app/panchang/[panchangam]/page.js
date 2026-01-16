"use client"

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdArrowBackIos } from "react-icons/md";
import PanchangHeader from "@/components/PanchangHeader";

export default function Panchangam() {
    const params = useParams();
    const panchangamType = params.panchangam;
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSideOpen, setIsSideOpen] = useState(false);
    const [months, setMonths] = useState();

    useEffect(() => {
        if (panchangamType) {
            fetchPanchangamData();
        }
    }, [panchangamType]);

    const fetchPanchangamData = async () => {
        try {
            const response = await fetch(`/api/panchang?nameOfWork=${panchangamType}`);
            const data = await response.json();
            if (data.success) {
                setEvents(data.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;

    const englishToHindiMonth = {
        "01": "जनवरी", "January": "जनवरी",
        "02": "फरवरी", "February": "फरवरी",
        "03": "मार्च", "March": "मार्च",
        "04": "अप्रैल", "April": "अप्रैल",
        "05": "मई", "May": "मई",
        "06": "जून", "June": "जून",
        "07": "जुलाई", "July": "जुलाई",
        "08": "अगस्त", "August": "अगस्त",
        "09": "सितंबर", "September": "सितंबर",
        "10": "अक्टूबर", "October": "अक्टूबर",
        "11": "नवंबर", "November": "नवंबर",
        "12": "दिसंबर", "December": "दिसंबर"
    };

    const getMonthIndex = (monthName) => {
        if (!monthName) return -1;
        // Handle numeric string months like "01", "02"
        const numericMonth = parseInt(monthName);
        if (!isNaN(numericMonth) && numericMonth >= 1 && numericMonth <= 12) {
            return numericMonth - 1;
        }

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months.indexOf(monthName);
    };

    const formatTitle = (slug) => {
        return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#222] p-2 mx-auto w-[98%] animate-pulse">
                {/* Header Skeleton */}
                <div className="bg-gray-700 rounded-3xl w-full h-24 mb-5"></div>

                {/* Body Content Skeleton */}
                <div className="bg-linear-to-r from-[#FFE984]/20 to-[#FFB111]/20 rounded-3xl w-full h-[calc(100vh-140px)] p-4">
                    {/* Back Button Skeleton */}
                    <div className="flex gap-2 mb-5">
                        <div className="w-10 h-10 rounded-full bg-gray-600"></div>
                    </div>

                    {/* Table Skeleton */}
                    <div className="w-full space-y-4">
                        {/* Table Header */}
                        <div className="h-12 bg-white/10 rounded-lg w-full"></div>

                        {/* Table Rows */}
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-white/5 rounded-lg w-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-[98%] mx-auto p-2">
            <div>
                <PanchangHeader title={formatTitle(panchangamType)} isSideOpen={isSideOpen} setIsSideOpen={setIsSideOpen} />

                <div className="mt-2 bg-linear-to-r from-[#FFE984] to-[#FFB111] min-h-screen rounded-3xl p-4">

                    <div className="my-5 text-black font-bold flex gap-2">
                        <span onClick={() => router.back()} className="px-2 py-2 border bg-black text-white rounded-full flex gap-2 justify-center items-center">
                            <MdArrowBackIos size={12} /> Back
                        </span>
                    </div>

                    {events.length > 0 ? (
                        <div className="overflow-x-auto">

                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border text-black bg-white text-sm">
                                        <th className="p-4 py-2 font-semibold border-r border-l-2xl ">दिनांक</th>
                                        <th className="p-4 py-2 font-semibold border-r">समय</th>
                                        {
                                            panchangamType !== "moolShanti" && (
                                                <>
                                                    <th className="p-4 py-2 font-semibold border-r">पक्ष</th>
                                                    <th className="p-4 py-2 font-semibold border-r">तिथि</th>
                                                </>
                                            )
                                        }
                                        <th className="p-4 py-2 font-semibold">विवरण</th>
                                    </tr>
                                </thead>

                                <tbody className="text-black text-sm">
                                    {events.filter(item => {
                                        if (!item.month || !item.year) return true;

                                        const eventMonthIndex = getMonthIndex(item.month);
                                        const eventYear = parseInt(item.year);

                                        if (eventMonthIndex === -1 || isNaN(eventYear)) return true;

                                        const currentYear = currentDate.getFullYear();
                                        const currentMonthIndex = currentDate.getMonth(); // 0-11

                                        if (eventYear < currentYear) return false;
                                        if (eventYear === currentYear && eventMonthIndex < currentMonthIndex) return false;

                                        return true;
                                    }).sort((a, b) => {
                                        const dateA = parseInt(a.date) || 0;
                                        const monthIndexA = getMonthIndex(a.month);
                                        const yearA = parseInt(a.year) || 0;

                                        const dateB = parseInt(b.date) || 0;
                                        const monthIndexB = getMonthIndex(b.month);
                                        const yearB = parseInt(b.year) || 0;

                                        if (yearA !== yearB) return yearA - yearB;
                                        if (monthIndexA !== monthIndexB) return monthIndexA - monthIndexB;
                                        return dateA - dateB;
                                    }).map((item) => (
                                        <tr key={item._id} className="border hover:bg-white/5 transition-colors">
                                            <td className="p-4 py-2 whitespace-nowrap border-r">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-black">
                                                        {item.date || 'N/A'} / {item.month || 'N/A'} / {item.year || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 py-2 whitespace-nowrap border-r">{item.time || 'N/A'}</td>
                                            {
                                                panchangamType !== "moolShanti" && (
                                                    <>
                                                        <td className="p-4 py-2 whitespace-nowrap border-r">{item.paksha || 'N/A'}</td>
                                                        <td className="p-4 py-2 whitespace-nowrap border-r">{item.tithi || 'N/A'}</td>
                                                    </>
                                                )
                                            }

                                            <td className="p-4 py-2 min-w-[200px] border-r">
                                                <div className="text-black mb-1">{item.description || 'N/A'} </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <div className="text-xl">No events found for {formatTitle(panchangamType)}.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}