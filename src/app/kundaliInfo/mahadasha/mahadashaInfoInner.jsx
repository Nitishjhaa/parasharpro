"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp } from "react-icons/md";
import { CiCircleInfo } from "react-icons/ci";
import { GoEyeClosed, GoEye } from "react-icons/go";
import KundaliHeader from "@/components/KundaliHeader";

// ------------------ Planet Hindi Map ------------------
const PLANET_HINDI = {
    Sun: "सूर्य",
    Moon: "चंद्र",
    Mars: "मंगल",
    Mercury: "बुध",
    Jupiter: "गुरु",
    Venus: "शुक्र",
    Saturn: "शनि",
    Rahu: "राहु",
    Ketu: "केतु",
};

export default function MahadashaPage() {
    const [sequence, setSequence] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openMD, setOpenMD] = useState(null);
    const [openAD, setOpenAD] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalText, setModalText] = useState("");
    const [isSideOpen, setIsSideOpen] = useState(false);
    const [indexParam, setIndexParam] = useState(null);

    function openModal(text) {
        setModalText(text || "कोई व्याख्या उपलब्ध नहीं है।");
        setModalOpen(true);
    }

    function formatHindi(dateStr) {
        return new Date(dateStr).toLocaleDateString("hi-IN");
    }

    function isCurrent(start, end) {
        const now = Date.now();
        return now >= new Date(start).getTime() && now <= new Date(end).getTime();
    }

    // READ INDEX PARAM SAFELY
    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        setIndexParam(Number(params.get("index") || 0));
    }, []);

    // LOAD DATA
    useEffect(() => {
        async function load() {
            if (indexParam === null) return;

            const record = await loadKundaliByIndex(indexParam);
            if (!record) {
                setLoading(false);
                return;
            }

            const seq = record.raw?.dasha?.sequence || [];
            setSequence(seq);
            setLoading(false);
        }

        load();
    }, [indexParam]);

    if (loading)
        return <div className="p-10 text-center text-xl text-gray-700">लोड हो रहा है...</div>;

    if (!sequence.length)
        return <div className="p-10 text-center text-xl text-gray-700">कोई दशा उपलब्ध नहीं।</div>;

    return (
        <div className="p-2">
            {/* ✔ Header + Sidebar */}
            {indexParam !== null && (
                <KundaliHeader
                    title="महादशा"
                    indexParam={indexParam}
                    isSideOpen={isSideOpen}
                    setIsSideOpen={setIsSideOpen}
                />
            )}

            {/* MAIN CONTENT */}
            <div className="p-6 md:p-10 bg-linear-to-r from-[#FFE984] to-[#FFB111] min-h-screen text-black rounded-3xl">
                <div className="space-y-4">
                    {sequence.map((md, mdIndex) => {
                        const mdCurrent = isCurrent(md.start, md.end);

                        return (
                            <div
                                key={mdIndex}
                                className={`rounded-xl shadow border ${mdCurrent
                                        ? "bg-[#ffe49b] border-[#ffb300]"
                                        : "bg-white border-yellow-300"
                                    }`}
                            >
                                {/* MAHADASHA HEADER */}
                                <button
                                    onClick={() =>
                                        setOpenMD(openMD === mdIndex ? null : mdIndex)
                                    }
                                    className="w-full text-left p-5 flex justify-between items-center"
                                >
                                    <div>
                                        <div className="text-sm font-bold text-[#b86a00]">
                                            {PLANET_HINDI[md.lord]}
                                        </div>
                                        <div className="text-base text-gray-700">
                                            {formatHindi(md.start)} → {formatHindi(md.end)}
                                        </div>
                                    </div>

                                    <span className="text-2xl">
                                        {openMD === mdIndex ? (
                                            <MdKeyboardDoubleArrowUp />
                                        ) : (
                                            <MdKeyboardDoubleArrowDown />
                                        )}
                                    </span>
                                </button>

                                {/* ANTARDASHA */}
                                {openMD === mdIndex && (
                                    <div className="p-5 border-t space-y-3 bg-[#fffaf0]">
                                        {md.antar.map((ad, adIndex) => {
                                            const adCurrent = isCurrent(ad.start, ad.end);

                                            return (
                                                <div
                                                    key={adIndex}
                                                    className={`rounded-lg p-4 border ${adCurrent
                                                            ? "bg-[#ffe49b] border-[#ffb300]"
                                                            : "bg-[#fff2d9] border-yellow-200"
                                                        }`}
                                                >
                                                    {/* Antardasha Header */}
                                                    <button
                                                        onClick={() =>
                                                            setOpenAD(openAD === adIndex ? null : adIndex)
                                                        }
                                                        className="w-full flex justify-between items-center"
                                                    >
                                                        <div>
                                                            <div className="font-semibold text-lg text-[#a56a00] text-left!">
                                                                {PLANET_HINDI[ad.lord]}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {formatHindi(ad.start)} →{" "}
                                                                {formatHindi(ad.end)}
                                                            </div>
                                                        </div>

                                                        <span>
                                                            {openAD === adIndex ? (
                                                                <MdKeyboardDoubleArrowUp />
                                                            ) : (
                                                                <MdKeyboardDoubleArrowDown />
                                                            )}
                                                        </span>
                                                    </button>

                                                    {openAD === adIndex && (
                                                        <div className="mt-3 pl-4 border-l-4 border-yellow-400 space-y-3">
                                                            <button
                                                                onClick={() => openModal(ad.interpretation)}
                                                                className="mt-2 px-2 py-2 bg-[#d48500] text-white rounded-lg text-sm"
                                                            >
                                                                <GoEye />
                                                            </button>

                                                            {ad.pratyantar.map((pd, pdIndex) => {
                                                                const pdCurrent = isCurrent(
                                                                    pd.start,
                                                                    pd.end
                                                                );

                                                                return (
                                                                    <div
                                                                        key={pdIndex}
                                                                        className={`p-3 rounded-lg ${pdCurrent
                                                                                ? "bg-[#ffe49b] border border-[#ffb300]"
                                                                                : "bg-[#fff9e6]"
                                                                            }`}
                                                                    >
                                                                        <div className="flex justify-between items-start">
                                                                            <div>
                                                                                <div className="font-semibold text-sm text-[#865400]">
                                                                                    {PLANET_HINDI[pd.lord]}
                                                                                </div>
                                                                                <div className="text-xs text-gray-600">
                                                                                    {formatHindi(pd.start)}{" "}
                                                                                    → {formatHindi(pd.end)}
                                                                                </div>
                                                                            </div>

                                                                            <button
                                                                                onClick={() =>
                                                                                    openModal(
                                                                                        pd.interpretation
                                                                                    )
                                                                                }
                                                                                className="px-2 py-2 bg-[#d08b00] text-white rounded text-xs"
                                                                            >
                                                                                <CiCircleInfo
                                                                                    size={18}
                                                                                    color="white"
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ---------------- MODAL ---------------- */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg border border-yellow-300">
                        <div className="flex justify-between">
                            <h2 className="text-xl font-bold text-[#d08b00] mb-3">
                                व्याख्या
                            </h2>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-2 bg-[#d08b00] text-white py-2 rounded-lg shadow"
                            >
                                <GoEyeClosed />
                            </button>
                        </div>

                        <p className="text-gray-800 text-sm whitespace-pre-line mt-2">
                            {modalText}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
