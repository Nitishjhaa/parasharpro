"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MdArrowBackIos, MdCheckCircle, MdCancel, MdInfo } from "react-icons/md";
import { CiClock2, CiLocationOn } from "react-icons/ci";
import { toast } from "sonner";
import getPanchangDetails from "@/lib/panchang";
import { cheakMool } from "@/app/kundaliInfo/AstrologicalData";

// Hindi day names map
const HINDI_DAYS = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];

// English to Hindi translation maps
const TITHI_MAP = {
  "Vidhiya": "द्वितीया",
  "Sapthami": "सप्तमी",
  "Dvadasi": "द्वादशी",
  "Padyami": "प्रतिपदा",
  "Thadiya": "तृतीया",
  "Chavithi": "चतुर्थी",
  "Chaviti": "चतुर्थी",
  "Panchami": "पंचमी",
  "Shasti": "षष्ठी",
  "Ashtami": "अष्टमी",
  "Navami": "नवमी",
  "Dasami": "दशमी",
  "Ekadasi": "एकादशी",
  "Trayodasi": "त्रयोदशी",
  "Chaturdasi": "चतुर्दशी",
  "Punnami": "पूर्णिमा",
  "Amavasya": "अमावस्या"
};

const NAKSHATRA_MAP = {
  "Krittika": "कृत्तिका",
  "Punarvasu": "पुनर्वसु",
  "Vishakha": "विशाखा",
  "UttaraPhalguni": "उत्तराफाल्गुनी",
  "PurvaBhadrapada": "पूर्वाभाद्रपद",
  "UttaraAshadha": "उत्तराषाढ़ा",
  "Mrigashira": "मृगशीर्षा",
  "Chitra": "चित्रा",
  "Dhanishta": "धनिष्ठा",
  "Ashwini": "अश्विनी",
  "Bharani": "भरणी",
  "Rohini": "रोहिणी",
  "Ardra": "आर्द्रा",
  "Pushya": "पुष्य",
  "Ashlesha": "आश्लेषा",
  "Magha": "मघा",
  "PurvaPhalguni": "पूर्वाफाल्गुनी",
  "Hasta": "हस्त",
  "Swati": "स्वाती",
  "Anuradha": "अनुराधा",
  "Jyeshtha": "ज्येष्ठा",
  "Mula": "मूला",
  "PurvaAshadha": "पूर्वाषाढ़ा",
  "Shravana": "श्रवण",
  "Shatabhisha": "शतभिषा",
  "UttaraBhadrapada": "उत्तराभाद्रपद",
  "Revati": "रेवती"
};

// Yog check helper functions
function evaluateTripushkar(weekdayIdx, englishTithi, englishNakshatra) {
  const allowedTithis = ["Vidhiya", "Sapthami", "Dvadasi"];
  const allowedNakshatras = ["Krittika", "Punarvasu", "Vishakha", "UttaraPhalguni", "PurvaBhadrapada", "UttaraAshadha"];
  const allowedWeekdays = [0, 2, 6]; // Sunday, Tuesday, Saturday

  const tithiMatch = allowedTithis.includes(englishTithi);
  const nakshatraMatch = allowedNakshatras.includes(englishNakshatra);
  const weekdayMatch = allowedWeekdays.includes(weekdayIdx);

  const isStrict = tithiMatch && nakshatraMatch && weekdayMatch;
  const isLiberal = tithiMatch && nakshatraMatch;

  return {
    present: isStrict,
    partial: isLiberal && !isStrict,
    matchedTithi: tithiMatch,
    matchedNakshatra: nakshatraMatch,
    matchedWeekday: weekdayMatch
  };
}

function evaluateDvipushkar(weekdayIdx, englishTithi, englishNakshatra) {
  const allowedTithis = ["Vidhiya", "Sapthami", "Dvadasi"];
  const allowedNakshatras = ["Mrigashira", "Chitra", "Dhanishta"];
  const allowedWeekdays = [0, 2, 6]; // Sunday, Tuesday, Saturday

  const tithiMatch = allowedTithis.includes(englishTithi);
  const nakshatraMatch = allowedNakshatras.includes(englishNakshatra);
  const weekdayMatch = allowedWeekdays.includes(weekdayIdx);

  const isStrict = tithiMatch && nakshatraMatch && weekdayMatch;
  const isLiberal = tithiMatch && nakshatraMatch;

  return {
    present: isStrict,
    partial: isLiberal && !isStrict,
    matchedTithi: tithiMatch,
    matchedNakshatra: nakshatraMatch,
    matchedWeekday: weekdayMatch
  };
}

export default function YogPage() {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: "जातक",
    gender: "Male",
    date: "",
    time: "",
    city: "Delhi",
    lat: 28.6139,
    lon: 77.2090
  });

  // Calculation Results
  const [results, setResults] = useState(null);

  const cityInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Initialize with current client date/time on mount
  useEffect(() => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

    setForm(prev => ({
      ...prev,
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hh}:${min}`
    }));

    // Fetch cities list
    fetch("/data/cities.json")
      .then(res => res.json())
      .then(data => setCities(data || []))
      .catch(err => console.error("Error loading cities:", err));
  }, []);

  // Filter cities for autocomplete
  function filterCities(q) {
    if (!q || q.trim() === "") {
      setFilteredCities([]);
      setShowSuggestions(false);
      return;
    }
    const query = q.toLowerCase();
    const matches = cities
      .filter(c => c.city.toLowerCase().includes(query) || c.admin_name.toLowerCase().includes(query))
      .slice(0, 10);

    setFilteredCities(matches);
    setShowSuggestions(true);
    setHighlightIdx(0);
  }

  function selectCity(cityObj) {
    setForm(prev => ({
      ...prev,
      city: cityObj.city,
      lat: Number(cityObj.lat),
      lon: Number(cityObj.lng)
    }));
    setFilteredCities([]);
    setShowSuggestions(false);
    setHighlightIdx(-1);
  }

  function handleCityKeyDown(e) {
    if (!showSuggestions || filteredCities.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx(prev => (prev + 1 >= filteredCities.length ? 0 : prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx(prev => (prev - 1 < 0 ? filteredCities.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIdx >= 0) selectCity(filteredCities[highlightIdx]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  // Outside click closes autocomplete
  useEffect(() => {
    function outsideClick(e) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("click", outsideClick);
    return () => document.removeEventListener("click", outsideClick);
  }, []);

  // Run Calculations
  async function handleCalculate() {
    if (!form.date || !form.time) {
      toast.error("Please enter the date and time.");
      return;
    }

    setLoading(true);
    try {
      // 1. Calculate Local Panchang Details
      const panchang = getPanchangDetails(form.date, form.time, form.lat, form.lon);
      
      const dateObj = new Date(`${form.date}T${form.time}`);
      const weekdayIdx = dateObj.getDay();
      const hindiWeekday = HINDI_DAYS[weekdayIdx];

      const tithiEnglish = panchang.englishTithi || "";
      const nakshatraEnglish = panchang.englishNakshatra || "";

      // 2. Evaluate Dvipushkar & Tripushkar Yogas
      const tripushkar = evaluateTripushkar(weekdayIdx, tithiEnglish, nakshatraEnglish);
      const dvipushkar = evaluateDvipushkar(weekdayIdx, tithiEnglish, nakshatraEnglish);

      // 3. Retrieve Moon Nakshatra & Charan for Mool Dosha from Kundali API
      const payload = {
        name: form.name || "जातक",
        gender: form.gender,
        birthDate: form.date,
        birthTime: form.time,
        lat: Number(form.lat),
        lon: Number(form.lon),
        city: form.city,
        timeZone: "Asia/Kolkata"
      };

      const res = await fetch("https://kundalipwa.onrender.com/kundali", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Kundali API request failed");
      }

      const kundaliData = await res.json();
      const moonNakshatra = kundaliData?.planets?.Moon?.nakshatra;
      const moonPada = kundaliData?.planets?.Moon?.pada;

      // Evaluate Mool Dosha
      const moolResult = cheakMool(moonNakshatra, moonPada);

      setResults({
        tithi: panchang.tithi?.name || TITHI_MAP[tithiEnglish] || tithiEnglish,
        nakshatra: NAKSHATRA_MAP[nakshatraEnglish] || nakshatraEnglish,
        weekday: hindiWeekday,
        tripushkar,
        dvipushkar,
        mool: {
          present: moolResult.status === "गण्डमूल दोष उपस्थित",
          status: moolResult.status,
          definition: moolResult.definition,
          moonNakshatra: NAKSHATRA_MAP[moonNakshatra] || moonNakshatra,
          moonPada
        }
      });
      toast.success("Calculation completed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("error calculating details. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  }

  // Set default current time action
  function fillCurrentDateTime() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

    setForm(prev => ({
      ...prev,
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hh}:${min}`,
      city: "Delhi",
      lat: 28.6139,
      lon: 77.2090
    }));
    toast.success("Current date, time and location filled!");
  }

  return (
    <div className="w-[98%] mx-auto pt-2 text-black">
      {/* ---------- HEADER ---------- */}
      <div className="rounded-3xl overflow-hidden mb-4">
        <div className="bg-linear-to-r from-[#FFE984] to-[#FFB111] p-5 flex gap-4 items-center shadow-md">
          <img src="/images/kundaliHead.png" className="w-12 brightness-0" alt="Yog Logo" />
          <div className="flex flex-col">
            <span className="bg-linear-to-l from-[#F26A20] to-red-600 bg-clip-text text-transparent text-2xl font-bold">
              योग और दोष
            </span>
          </div>
        </div>
      </div>

      <div className="my-3 text-black font-bold flex gap-2">
        <Link href="/astrohelp" className="px-3 py-2 border bg-black text-white rounded-full flex gap-2 justify-center items-center text-sm hover:bg-neutral-800 transition-colors">
          <MdArrowBackIos size={12} /> Back
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-2">
        {/* ---------- FORM PANEL (LHS) ---------- */}
        <div className="lg:col-span-4 bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-yellow-200 h-fit">
          <h2 className="text-xl font-bold mb-4 text-[#d98b00] border-b pb-2 flex items-center gap-2">
            <CiClock2 size={24} /> Enter Details
          </h2>

          <div className="space-y-4">
            {/* Quick Fill Button */}
            <button
              onClick={fillCurrentDateTime}
              className="w-full bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl py-2 px-4 text-sm font-semibold transition-all duration-200 shadow-sm active:scale-95"
            >
              Fill Current Date, Time and Location
            </button>

            {/* Date Input */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="bg-neutral-50 border border-gray-300 rounded-xl p-3 outline-none focus:border-amber-500 transition-colors text-black font-medium"
                value={form.date}
                onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            {/* Time Input */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Time (24-hour format)</label>
              <input
                type="time"
                className="bg-neutral-50 border border-gray-300 rounded-xl p-3 outline-none focus:border-amber-500 transition-colors text-black font-medium"
                value={form.time}
                onChange={e => setForm(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>

            {/* City Autocomplete */}
            <div className="flex flex-col relative" ref={suggestionsRef}>
              <label className="text-sm font-semibold text-gray-700 mb-1">Location (City)</label>
              <div className="relative">
                <input
                  ref={cityInputRef}
                  type="text"
                  placeholder="Search for city name (e.g., Delhi)..."
                  className="w-full bg-neutral-50 border border-gray-300 rounded-xl p-3 pl-10 outline-none focus:border-amber-500 transition-colors text-black font-medium"
                  value={form.city}
                  onChange={e => {
                    setForm(prev => ({ ...prev, city: e.target.value }));
                    filterCities(e.target.value);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleCityKeyDown}
                  autoComplete="off"
                />
                <CiLocationOn className="absolute left-3 top-3.5 text-gray-500" size={18} />
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && filteredCities.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-60 overflow-auto z-50 mt-1">
                  {filteredCities.map((c, i) => (
                    <div
                      key={i}
                      onClick={() => selectCity(c)}
                      className={`p-3 cursor-pointer transition-colors ${
                        highlightIdx === i ? "bg-amber-100 font-semibold" : "hover:bg-neutral-100"
                      }`}
                    >
                      <div className="text-sm text-black">{c.city}</div>
                      <div className="text-xs text-gray-500">{c.admin_name} | Lat: {c.lat}, Lng: {c.lng}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Gender Selection */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Gender (for Kundali analysis)</label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={form.gender === "Male"}
                    onChange={e => setForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="accent-amber-500"
                  />
                  Male
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={form.gender === "Female"}
                    onChange={e => setForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="accent-amber-500"
                  />
                  Female
                </label>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full bg-[#104072] hover:bg-[#0b2d52] disabled:bg-neutral-400 text-white rounded-xl py-3.5 font-bold transition-all duration-200 shadow-md mt-4 flex items-center justify-center gap-2 text-lg active:scale-98"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                    Calculating...
                </>
              ) : (
                "Calculate"
              )}
            </button>
          </div>
        </div>

        {/* ---------- RESULTS DISPLAY (RHS) ---------- */}
        <div className="lg:col-span-8 bg-linear-to-r from-[#FFE984]/20 to-[#FFB111]/20 rounded-3xl p-6 border border-yellow-300 min-h-[500px]">
          <AnimatePresence mode="wait">
            {!results ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center h-full text-center py-20"
              >
                
                <h3 className="text-xl font-bold text-gray-700"> Details Will Be Shown Here</h3>
                
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* ---------- TITI / NAKSHATRA INFO CHIPS ---------- */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-2xl p-4 text-center border border-yellow-200 shadow-xs">
                    <span className="text-xs text-gray-500 font-semibold block mb-1">तिथि</span>
                    <span className="text-lg font-bold text-amber-700">{results.tithi}</span>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center border border-yellow-200 shadow-xs">
                    <span className="text-xs text-gray-500 font-semibold block mb-1">नक्षत्र</span>
                    <span className="text-lg font-bold text-amber-700">{results.nakshatra}</span>
                  </div>
                  <div className="bg-white rounded-2xl p-4 text-center border border-yellow-200 shadow-xs">
                    <span className="text-xs text-gray-500 font-semibold block mb-1">वार</span>
                    <span className="text-lg font-bold text-amber-700">{results.weekday}</span>
                  </div>
                </div>

                {/* ---------- YOGAS AND DOSHA CARDS ---------- */}

                {/* 1. TRIPUSHKAR YOG CARD */}
                <div className="bg-white rounded-3xl border border-yellow-200 shadow-md overflow-hidden transition-all hover:shadow-lg">
                  <div className="bg-linear-to-r from-red-500 to-orange-500 px-6 py-4 text-white flex justify-between items-center">
                    <h3 className="text-xl font-bold">त्रिपुष्कर योग (Tripushkar Yog)</h3>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-extrabold shadow-sm ${
                      results.tripushkar.present
                        ? "bg-green-500 text-white"
                        : results.tripushkar.partial
                        ? "bg-yellow-500 text-black"
                        : "bg-neutral-200 text-neutral-600"
                    }`}>
                      {results.tripushkar.present ? "पूर्ण उपस्थित" : results.tripushkar.partial ? "आंशिक उपस्थित" : "अनुपस्थित"}
                    </span>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Status details */}
                    <div className="flex flex-wrap gap-4 text-sm font-semibold">
                      <span className={`flex items-center gap-1.5 ${results.tripushkar.matchedTithi ? "text-green-600" : "text-neutral-400"}`}>
                        {results.tripushkar.matchedTithi ? <MdCheckCircle size={18} /> : <MdCancel size={18} />}
                        तिथि: द्वितीया, सप्तमी, द्वादश
                      </span>
                      <span className={`flex items-center gap-1.5 ${results.tripushkar.matchedNakshatra ? "text-green-600" : "text-neutral-400"}`}>
                        {results.tripushkar.matchedNakshatra ? <MdCheckCircle size={18} /> : <MdCancel size={18} />}
                        नक्षत्र: कृतिका, पुनर्वसु, विशाखा, उ. फा., पू. भा., उ. आ.
                      </span>
                      <span className={`flex items-center gap-1.5 ${results.tripushkar.matchedWeekday ? "text-green-600" : "text-neutral-400"}`}>
                        {results.tripushkar.matchedWeekday ? <MdCheckCircle size={18} /> : <MdCancel size={18} />}
                        वार: रविवार, मंगलवार, शनिवार
                      </span>
                    </div>

                    <div className="bg-neutral-50 rounded-2xl p-4 border text-sm text-gray-700 leading-relaxed space-y-2">
                      <p><strong>परिणाम:</strong> इसमें मृत्यू, हानि, विनाश व लाभ तीन गुणा होते हैं।</p>
                      <p className="text-xs text-neutral-500 font-medium">
                        * नोट: शास्त्रानुसार त्रिपुष्कर योग में कोई भी हानि होने पर उसका तीन बार पुनरावृत्ति हो सकती है, इसी प्रकार लाभ होने पर वह भी तीन गुणा बढ़ जाता है। (आंशिक योग केवल तिथि और नक्षत्र के मेल से बनता है, वार के अभाव में)।
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. DVIPUSHKAR YOG CARD */}
                <div className="bg-white rounded-3xl border border-yellow-200 shadow-md overflow-hidden transition-all hover:shadow-lg">
                  <div className="bg-linear-to-r from-amber-500 to-yellow-600 px-6 py-4 text-white flex justify-between items-center">
                    <h3 className="text-xl font-bold">द्विपुष्कर योग (Dvipushkar Yog)</h3>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-extrabold shadow-sm ${
                      results.dvipushkar.present
                        ? "bg-green-500 text-white"
                        : results.dvipushkar.partial
                        ? "bg-yellow-500 text-black"
                        : "bg-neutral-200 text-neutral-600"
                    }`}>
                      {results.dvipushkar.present ? "पूर्ण उपस्थित" : results.dvipushkar.partial ? "आंशिक उपस्थित" : "अनुपस्थित"}
                    </span>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Status details */}
                    <div className="flex flex-wrap gap-4 text-sm font-semibold">
                      <span className={`flex items-center gap-1.5 ${results.dvipushkar.matchedTithi ? "text-green-600" : "text-neutral-400"}`}>
                        {results.dvipushkar.matchedTithi ? <MdCheckCircle size={18} /> : <MdCancel size={18} />}
                        तिथि: द्वितीया, सप्तमी, द्वादश
                      </span>
                      <span className={`flex items-center gap-1.5 ${results.dvipushkar.matchedNakshatra ? "text-green-600" : "text-neutral-400"}`}>
                        {results.dvipushkar.matchedNakshatra ? <MdCheckCircle size={18} /> : <MdCancel size={18} />}
                        नक्षत्र: मृगशिर, चित्रा, धनिष्ठा
                      </span>
                      <span className={`flex items-center gap-1.5 ${results.dvipushkar.matchedWeekday ? "text-green-600" : "text-neutral-400"}`}>
                        {results.dvipushkar.matchedWeekday ? <MdCheckCircle size={18} /> : <MdCancel size={18} />}
                        वार: रविवार, मंगलवार, शनिवार
                      </span>
                    </div>

                    <div className="bg-neutral-50 rounded-2xl p-4 border text-sm text-gray-700 leading-relaxed space-y-2">
                      <p><strong>परिणाम:</strong> इसमें मृत्यू, हानि, विनाश व लाभ दो गुणा होते हैं।</p>
                      
                      <p className="text-xs text-neutral-500 font-medium">
                        * नोट: इस योग में किसी भी हानि की दो बार पुनरावृत्ति हो सकती है, इसी प्रकार किया गया शुभ कार्य या लाभ भी दो गुणा होता है।
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. GANDMOOL DOSHA CARD */}
                <div className="bg-white rounded-3xl border border-yellow-200 shadow-md overflow-hidden transition-all hover:shadow-lg">
                  <div className="bg-linear-to-r from-purple-700 to-indigo-600 px-6 py-4 text-white flex justify-between items-center">
                    <h3 className="text-xl font-bold">गण्डमूल दोष (Mool Dosha)</h3>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-extrabold shadow-sm ${
                      results.mool.present ? "bg-red-500 text-white" : "bg-green-500 text-white"
                    }`}>
                      {results.mool.present ? "दोष उपस्थित" : "दोष अनुपस्थित"}
                    </span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="text-sm font-semibold flex items-center gap-3">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg">
                        चन्द्र नक्षत्र: {results.mool.moonNakshatra}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg">
                        चरण (Pada): {results.mool.moonPada || "N/A"}
                      </span>
                    </div>

                    <div className="bg-neutral-50 rounded-2xl p-4 border text-sm text-gray-700 leading-relaxed space-y-2">
                      {results.mool.present ? (
                        <>
                          <p className="text-red-700 font-bold text-md">{results.mool.status}</p>
                          <p>{results.mool.definition}</p>
                          <p className="text-xs text-neutral-500 font-medium">
                            * गण्डमूल के ६ नक्षत्र माने गए हैं: अश्विनी, अश्लेषा, मघा, ज्येष्ठा, मूल और रेवती। यदि चन्द्रमा इनमें से किसी एक नक्षत्र में जन्म के समय उपस्थित हो तो गण्डमूल दोष होता है। इसके निवारण हेतु 27वें दिन मूल शांति पूजा कराई जाती है।
                          </p>
                        </>
                      ) : (
                        <p className="text-green-700 font-bold text-md">
                          गण्डमूल दोष नहीं है। चन्द्रमा शुभ एवं सामान्य नक्षत्रों में गतिमान है।
                        </p>
                      )}
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