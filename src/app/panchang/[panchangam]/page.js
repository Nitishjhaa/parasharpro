"use client"

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function Panchangam() {
    const params = useParams();
    const panchangamType = params.panchangam;
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const formatTitle = (slug) => {
        return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (loading) {
        return <div className="min-h-screen bg-[#222] flex justify-center items-center">
            <div className="text-xl font-semibold text-white">Loading...</div>
        </div>;
    }

    return (
        <div className="w-[98%] mx-auto p-2">
            <div>
                <div className="rounded-3xl overflow-hidden mb-4">
                    <div className="card-bg p-5 flex gap-4 items-center">
                        <Link href="/panchang">
                            <img src="/images/kundaliHead.png" className="w-12 brightness-0 invert-100" />
                        </Link>
                        <span className="bg-linear-to-l from-[#F26A20]/50 to-red-500 bg-clip-text text-transparent text-2xl">
                            {formatTitle(panchangamType)} Muhurat
                        </span>
                    </div>
                </div>

                <div className="mt-2 bg-linear-to-r from-[#FFE984] to-[#FFB111] min-h-screen rounded-3xl p-4">
                    {events.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-black text-sm">
                                        <th className="p-4 font-semibold">Date</th>
                                        <th className="p-4 font-semibold">Time</th>
                                        <th className="p-4 font-semibold">Paksha</th>
                                        <th className="p-4 font-semibold">Tithi</th>
                                        <th className="p-4 font-semibold">Event</th>
                                    </tr>
                                </thead>
                                <tbody className="text-black text-sm">
                                    {events.map((item) => (
                                        <tr key={item._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 whitespace-nowrap">
                                                <span className="font-medium text-black">
                                                    {item.date || 'N/A'} / {item.month || 'N/A'} / {item.year || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">{item.time || 'N/A'}</td>
                                            <td className="p-4 whitespace-nowrap">{item.paksha || 'N/A'}</td>
                                            <td className="p-4 whitespace-nowrap">{item.tithi || 'N/A'}</td>
                                            <td className="p-4 min-w-[200px]">
                                                <div className="text-black mb-1">({item.description || 'N/A'}) </div>
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