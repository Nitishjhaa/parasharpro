"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { CiClock2, CiLocationOn } from "react-icons/ci";
import { toast } from "sonner";
import getPanchangDetails from "@/lib/panchang";
import { nameNotGood, nakshatra } from '@/app/kundaliInfo/AstrologicalData'

// ─── Component ────────────────────────────────────────────────────────────────
export default function CasePage() {
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightIdx, setHighlightIdx] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const [form, setForm] = useState({
        date: "",
        time: "",
        city: "Delhi",
        lat: 28.6139,
        lon: 77.2090,
    });

    const cityInputRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Initialise with current date/time
    useEffect(() => {
        const now = new Date();
        setForm(prev => ({
            ...prev,
            date: now.toISOString().slice(0, 10),
            time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
        }));
        fetch("/data/cities.json")
            .then(r => r.json())
            .then(data => setCities(data || []))
            .catch(err => console.error("Error loading cities:", err));
    }, []);

    // City autocomplete
    function filterCities(q) {
        if (!q?.trim()) { setFilteredCities([]); setShowSuggestions(false); return; }
        const query = q.toLowerCase();
        const matches = cities.filter(c =>
            c.city.toLowerCase().includes(query) || c.admin_name.toLowerCase().includes(query)
        ).slice(0, 10);
        setFilteredCities(matches);
        setShowSuggestions(true);
        setHighlightIdx(0);
    }

    function selectCity(cityObj) {
        setForm(prev => ({ ...prev, city: cityObj.city, lat: Number(cityObj.lat), lon: Number(cityObj.lng) }));
        setFilteredCities([]);
        setShowSuggestions(false);
        setHighlightIdx(-1);
    }

    function handleCityKeyDown(e) {
        if (!showSuggestions || !filteredCities.length) return;
        if (e.key === "ArrowDown") { e.preventDefault(); setHighlightIdx(p => (p + 1 >= filteredCities.length ? 0 : p + 1)); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightIdx(p => (p - 1 < 0 ? filteredCities.length - 1 : p - 1)); }
        else if (e.key === "Enter") { e.preventDefault(); if (highlightIdx >= 0) selectCity(filteredCities[highlightIdx]); }
        else if (e.key === "Escape") setShowSuggestions(false);
    }

    useEffect(() => {
        function outsideClick(e) {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
                cityInputRef.current && !cityInputRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("click", outsideClick);
        return () => document.removeEventListener("click", outsideClick);
    }, []);

    // ─── Calculate ──────────────────────────────────────────────────────────────
    async function handleCalculate() {
        if (!form.date || !form.time) { toast.error("Please enter date and time."); return; }
        setLoading(true);
        try {
            // Panchang
            const panchang = getPanchangDetails(form.date, form.time, form.lat, form.lon);
            const dateObj = new Date(`${form.date}T${form.time}`);
            const weekdayIdx = dateObj.getDay();
            const tithiEnglish = panchang.englishTithi || "";
            const nakshatraEng = panchang.englishNakshatra || "";

            // Kundali API for planetary house positions
            const payload = {
                name: "जातक",
                gender: "Male",
                birthDate: form.date,
                birthTime: form.time,
                lat: Number(form.lat),
                lon: Number(form.lon),
                city: form.city,
                timeZone: "Asia/Kolkata",
            };

            const res = await fetch("https://kundalipwa.onrender.com/kundali", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Kundali API failed");
            const kundaliData = await res.json();

            setResults({
                kundaliData: kundaliData,
            });
            toast.success("Calculation completed!");
        } catch (err) {
            console.error(err);
            toast.error("Error calculating. Please check inputs and try again.");
        } finally {
            setLoading(false);
        }
    }

    const nakInHindi = nakshatra(results?.kundaliData?.planets?.Moon?.nakshatraIndex);
    const pada = results?.kundaliData?.planets?.Moon?.pada;

    const nameData = nameNotGood(results?.kundaliData?.planets?.Moon?.nakshatraIndex);

    // ─── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="w-[98%] mx-auto pt-2 text-black">

            <div className="rounded-3xl overflow-hidden mb-4">
                <div className="bg-linear-to-r from-[#FFE984] to-[#FFB111] p-5 flex gap-4 items-center shadow-md">
                    <img src="/images/kundaliHead.png" className="w-12 brightness-0" alt="Yog Logo" />
                    <div className="flex flex-col">
                        <span className="bg-linear-to-l from-[#F26A20] to-red-600 bg-clip-text text-transparent text-2xl font-bold">
                            नामकरण
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-2">

                {/* ── FORM PANEL ── */}
                <div className="lg:col-span-4 bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-yellow-200 h-fit">
                    <h2 className="text-xl font-bold mb-4 text-[#d98b00] border-b pb-2 flex items-center gap-2">
                        <CiClock2 size={24} /> Fill the Info
                    </h2>

                    <div className="space-y-4">
                        {/* Date */}
                        <div className="flex flex-col gap-4 max-md:flex-row">
                            <div className="flex flex-col w-full">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    className="bg-neutral-50 border border-gray-300 rounded-xl p-3 outline-none focus:border-amber-500 transition-colors text-black font-medium"
                                    value={form.date}
                                    onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Time (24h)</label>
                                <input
                                    type="time"
                                    className="bg-neutral-50 border border-gray-300 rounded-xl p-3 outline-none focus:border-amber-500 transition-colors text-black font-medium"
                                    value={form.time}
                                    onChange={e => setForm(prev => ({ ...prev, time: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* City Autocomplete */}
                        <div className="flex flex-col relative" ref={suggestionsRef}>
                            <label className="text-sm font-semibold text-gray-700 mb-1">Place/City</label>
                            <div className="relative">
                                <input
                                    ref={cityInputRef}
                                    type="text"
                                    placeholder="Search city (e.g., Delhi)..."
                                    className="w-full bg-neutral-50 border border-gray-300 rounded-xl p-3 pl-10 outline-none focus:border-amber-500 transition-colors text-black font-medium"
                                    value={form.city}
                                    onChange={e => { setForm(prev => ({ ...prev, city: e.target.value })); filterCities(e.target.value); }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onKeyDown={handleCityKeyDown}
                                    autoComplete="off"
                                />
                                <CiLocationOn className="absolute left-3 top-3.5 text-gray-500" size={18} />
                            </div>
                            {showSuggestions && filteredCities.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-60 overflow-auto z-50 mt-1">
                                    {filteredCities.map((c, i) => (
                                        <div key={i} onClick={() => selectCity(c)}
                                            className={`p-3 cursor-pointer transition-colors ${highlightIdx === i ? "bg-amber-100 font-semibold" : "hover:bg-neutral-100"}`}>
                                            <div className="text-sm text-black">{c.city}</div>
                                            <div className="text-xs text-gray-500">{c.admin_name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Calculate */}
                        <button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="w-full bg-[#104072] hover:bg-[#0b2d52] disabled:bg-neutral-400 text-white rounded-xl py-3.5 font-bold transition-all duration-200 shadow-md mt-4 flex items-center justify-center gap-2 text-lg active:scale-98"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Calculating...
                                </>
                            ) : "Check"}
                        </button>
                    </div>
                </div>

                {/* ── RESULTS ── */}
                <div className="lg:col-span-8 bg-[#f5f5f5] rounded-3xl p-6 border border-yellow-300 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {!results ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-full text-center py-20 "
                            >

                                <h3 className="text-xl font-bold text-gray-900">Details Will be Shown Here</h3>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                <div className="w-full h-15 flex items-center justify-center gap-5">
                                    <div className="border-2 border-amber-700 shadow-md w-full h-full rounded-xl px-2 py-2 flex justify-center items-center ">
                                        नक्षत्र : {nakInHindi}
                                    </div>
                                    <div className="border-2 border-amber-700 shadow-md w-full h-full rounded-xl px-2 py-2 flex justify-center items-center ">
                                        चरण : {pada}
                                    </div>
                                </div>

                                <div className="w-full flex max-md:flex-col items-center justify-center gap-5">
                                    <div className="border-2 border-gray-700 shadow-md w-full h-15 rounded-xl px-5 py-2 flex  items-center text-lg bg-gray-300">
                                        नक्षत्र नामाक्षर : {nameData.own.akshar.join(" ,")}
                                    </div>

                                    <div className="border-2 border-green-700 shadow-md w-full h-15 rounded-xl px-5 py-2 flex  items-center text-lg bg-green-300">
                                        कार्मिक नामाक्षर : {nameData.karmik.akshar.join(" ,")}
                                    </div>

                                    <div className="border-2 border-green-700 shadow-md w-full h-15 rounded-xl px-5 py-2 flex  items-center text-lg bg-green-300">
                                        सामुदायिक नामाक्षर : {nameData.samudayik.akshar.join(" ,")}
                                    </div>

                                    <div className="border-2 border-red-700 shadow-md w-full h-15 rounded-xl px-5 py-2 flex  items-center text-lg bg-red-300">
                                        घातक नामाक्षर : {nameData.harming.akshar.join(" ,")}
                                    </div>

                                    <div className="border-2 border-red-700 shadow-md w-full h-15 rounded-xl px-5 py-2 flex  items-center text-lg bg-red-300">
                                        ख़राब नामाक्षर : {nameData.destruction.akshar.join(" ,")}
                                    </div>

                                    <div className="border-2 border-red-700 shadow-md rounded-xl p-4 bg-red-300">
                                        <div className="flex flex-wrap gap-3">
                                            <div className="text-lg text-gray-900 mt-1">
                                                नक्षत्र के विपरीत नामाक्षर : 
                                            </div>
                                            {nameData.nonCompatible.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="border border-red-900 rounded-lg px-3 py-2 "
                                                >

                                                    <div className="text-lg text-gray-900 mt-1 ">
                                                        {item.akshar.join(", ")}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>



                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
