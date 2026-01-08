"use client"

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';

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
        return <div className="min-h-screen flex justify-center items-center">
            <div className="text-xl font-semibold text-purple-600">Loading...</div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 border-b-2 border-purple-200 pb-4">
                    {formatTitle(panchangamType)} Muhurat
                </h1>

                {events.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                        {events.map((item) => (
                            <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-bold text-purple-700">{item.nameOfWork}</h2>
                                        <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            {item.date}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center">
                                            <span className="font-semibold w-20">Time:</span>
                                            <span>{item.time || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-semibold w-20">Paksha:</span>
                                            <span>{item.paksha || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-semibold w-20">Tithi:</span>
                                            <span>{item.tithi || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-gray-700 italic">"{item.description}"</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <p className="text-xl text-gray-500">No events found for {formatTitle(panchangamType)}.</p>
                    </div>
                )}
            </div>
        </div>
    );
}