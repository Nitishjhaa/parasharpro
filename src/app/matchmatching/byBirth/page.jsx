"use client";

import { useEffect, useState, useRef } from "react";
import { CiClock2 } from "react-icons/ci";
import { HiLanguage } from "react-icons/hi2";
import { FaDatabase } from "react-icons/fa";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { saveMatchMaking } from "@/lib/db";

export default function MatchMakingPage() {
  const [cities, setCities] = useState([]);

  // Separate state for Male and Female
  const [maleForm, setMaleForm] = useState({
    name: "",
    gender: "Male",
    birthDate: "",
    birthTime: "",
    city: "Delhi",
  });

  const [femaleForm, setFemaleForm] = useState({
    name: "",
    gender: "Female",
    birthDate: "",
    birthTime: "",
    city: "Delhi",
  });

  // City autocomplete state for male
  const [maleFiltered, setMaleFiltered] = useState([]);
  const [maleHighlight, setMaleHighlight] = useState(-1);
  const [maleShowSuggestions, setMaleShowSuggestions] = useState(false);

  // City autocomplete state for female
  const [femaleFiltered, setFemaleFiltered] = useState([]);
  const [femaleHighlight, setFemaleHighlight] = useState(-1);
  const [femaleShowSuggestions, setFemaleShowSuggestions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [maleResult, setMaleResult] = useState(null);
  const [femaleResult, setFemaleResult] = useState(null);

  const router = useRouter();

  // Refs for male form
  const maleCityInputRef = useRef(null);
  const maleSuggestionsRef = useRef(null);
  const maleDdRef = useRef(null);
  const maleMmRef = useRef(null);
  const maleYyyyRef = useRef(null);
  const maleHhRef = useRef(null);
  const maleMinRef = useRef(null);
  const maleSecRef = useRef(null);

  // Refs for female form
  const femaleCityInputRef = useRef(null);
  const femaleSuggestionsRef = useRef(null);
  const femaleDdRef = useRef(null);
  const femaleMmRef = useRef(null);
  const femaleYyyyRef = useRef(null);
  const femaleHhRef = useRef(null);
  const femaleMinRef = useRef(null);
  const femaleSecRef = useRef(null);

  const malePrev = useRef({
    dd: "", mm: "", yyyy: "", hh: "", min: "", sec: ""
  });

  const femalePrev = useRef({
    dd: "", mm: "", yyyy: "", hh: "", min: "", sec: ""
  });

  // Load cities.json
  useEffect(() => {
    fetch("/data/cities.json")
      .then((r) => r.json())
      .then((data) => setCities(data || []));
  }, []);

  // FILTER CITIES
  function filterCities(q, type) {
    if (!q || q.trim() === "") {
      if (type === "male") {
        setMaleFiltered([]);
        setMaleShowSuggestions(false);
      } else {
        setFemaleFiltered([]);
        setFemaleShowSuggestions(false);
      }
      return;
    }

    const query = q.toLowerCase();
    const matches = cities
      .filter((c) =>
        c.city.toLowerCase().includes(query) ||
        c.admin_name.toLowerCase().includes(query)
      )
      .slice(0, 20);

    if (type === "male") {
      setMaleFiltered(matches);
      setMaleShowSuggestions(true);
      setMaleHighlight(0);
    } else {
      setFemaleFiltered(matches);
      setFemaleShowSuggestions(true);
      setFemaleHighlight(0);
    }
  }

  // HANDLE INPUT CHANGE
  function handleChange(e, type) {
    const { name, value } = e.target;

    if (type === "male") {
      setMaleForm((s) => ({ ...s, [name]: value }));
      if (name === "city") filterCities(value, "male");
    } else {
      setFemaleForm((s) => ({ ...s, [name]: value }));
      if (name === "city") filterCities(value, "female");
    }
  }

  // SELECT CITY
  function selectCity(cityName, type) {
    const obj = cities.find(c => c.city === cityName);

    if (type === "male") {
      setMaleForm((s) => ({
        ...s,
        city: cityName,
        state: obj?.admin_name || ""
      }));
      setMaleFiltered([]);
      setMaleShowSuggestions(false);
      setMaleHighlight(-1);
    } else {
      setFemaleForm((s) => ({
        ...s,
        city: cityName,
        state: obj?.admin_name || ""
      }));
      setFemaleFiltered([]);
      setFemaleShowSuggestions(false);
      setFemaleHighlight(-1);
    }
  }

  // ARROW KEY NAVIGATION for male
  function handleCityKeyDown(e, type) {
    const showSuggestions = type === "male" ? maleShowSuggestions : femaleShowSuggestions;
    const filtered = type === "male" ? maleFiltered : femaleFiltered;
    const highlight = type === "male" ? maleHighlight : femaleHighlight;
    const setHighlight = type === "male" ? setMaleHighlight : setFemaleHighlight;
    const setShowSuggestions = type === "male" ? setMaleShowSuggestions : setFemaleShowSuggestions;

    if (!showSuggestions || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1 >= filtered.length ? 0 : h + 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 < 0 ? filtered.length - 1 : h - 1));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (highlight >= 0) selectCity(filtered[highlight].city, type);
    }

    if (e.key === "Escape") setShowSuggestions(false);
  }

  // NORMALIZE DATE (DD-MM-YYYY → YYYY-MM-DD)
  function normalizeDateToISO(dateStr) {
    if (!dateStr) return null;
    const s = dateStr.trim();

    // Already ISO
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

    // DD-MM-YYYY
    let m;
    if ((m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/))) {
      let [_, dd, mm, yyyy] = m;
      dd = dd.padStart(2, "0");
      mm = mm.padStart(2, "0");
      if (yyyy.length === 2) yyyy = "20" + yyyy;
      return `${yyyy}-${mm}-${dd}`;
    }
    return null;
  }

  // NORMALIZE TIME (HH:MM:SS → HH:MM)
  function normalizeTime(timeStr) {
    if (!timeStr) return null;
    let parts = timeStr.split(":");
    let hh = parts[0];
    let mm = parts[1] || "00";
    if (hh.length === 1) hh = "0" + hh;
    if (mm.length === 1) mm = "0" + mm;
    return `${hh}:${mm}`;
  }

  // SUBMIT BOTH KUNDALIS
  async function submitMatchMaking() {
    // Validate Male Form
    const maleCityObj = cities.find((c) => c.city === maleForm.city);
    if (!maleCityObj) {
      toast.error("Please select a valid city for Male");
      return;
    }

    const maleIsoDate = normalizeDateToISO(maleForm.birthDate);
    if (!maleIsoDate) {
      toast.error("Invalid Male Date Format (Use DD-MM-YYYY)");
      return;
    }

    const maleIsoTime = normalizeTime(maleForm.birthTime);
    if (!maleIsoTime) {
      toast.error("Invalid Male Time Format (Use HH:MM)");
      return;
    }


    // Validate Female Form
    const femaleCityObj = cities.find((c) => c.city === femaleForm.city);
    if (!femaleCityObj) {
      toast.error("Please select a valid city for Female");
      return;
    }

    const femaleIsoDate = normalizeDateToISO(femaleForm.birthDate);
    if (!femaleIsoDate) {
      toast.error("Invalid Female Date Format (Use DD-MM-YYYY)");
      return;
    }

    const femaleIsoTime = normalizeTime(femaleForm.birthTime);
    if (!femaleIsoTime) {
      toast.error("Invalid Female Time Format (Use HH:MM)");
      return;
    }

    // Prepare payloads
    const malePayload = {
      name: maleForm.name,
      gender: "Male",
      birthDate: maleIsoDate,
      birthTime: maleIsoTime,
      lat: Number(maleCityObj.lat),
      lon: Number(maleCityObj.lng),
      city: maleCityObj.city,
      timeZone: "Asia/Kolkata",
    };

    const femalePayload = {
      name: femaleForm.name,
      gender: "Female",
      birthDate: femaleIsoDate,
      birthTime: femaleIsoTime,
      lat: Number(femaleCityObj.lat),
      lon: Number(femaleCityObj.lng),
      city: femaleCityObj.city,
      timeZone: "Asia/Kolkata",
    };

    setLoading(true);
    setMaleResult(null);
    setFemaleResult(null);

    try {
      // Hit API for both at the same time
      const [maleResponse, femaleResponse] = await Promise.all([
        fetch("https://kundalipwa.onrender.com/kundali", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(malePayload),
        }),
        fetch("https://kundalipwa.onrender.com/kundali", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(femalePayload),
        })
      ]);

      const maleData = await maleResponse.json();
      const femaleData = await femaleResponse.json();

      setMaleResult(maleData);
      setFemaleResult(femaleData);

      // Save to IndexedDB
      const matchData = {
        male: {
          raw: maleData,
          meta: {
            name: maleForm.name,
            gender: "Male",
            birthDate: maleForm.birthDate,
            birthTime: maleForm.birthTime,
            city: maleForm.city,
          }
        },
        female: {
          raw: femaleData,
          meta: {
            name: femaleForm.name,
            gender: "Female",
            birthDate: femaleForm.birthDate,
            birthTime: femaleForm.birthTime,
            city: femaleForm.city,
          }
        }
      };

      await saveMatchMaking(matchData);

      toast.success("Both Kundalis Generated Successfully!");

      // Navigate to matchInfo page
      router.push("/matchmatching/byBirth/matchInfo");

    } catch (err) {
      toast.error("Failed to fetch Kundalis");
      console.error(err);
    }

    setLoading(false);
  }

  // Auto-focus logic for male form
  useEffect(() => {
    const [dd = "", mm = "", yyyy = ""] = (maleForm.birthDate || "").split("-");
    const [hh = "", min = "", sec = ""] = (maleForm.birthTime || "").split(":");

    if (dd?.length === 2 && malePrev.current.dd.length !== 2) {
      maleMmRef.current?.focus();
    }
    if (mm?.length === 2 && malePrev.current.mm.length !== 2) {
      maleYyyyRef.current?.focus();
    }

    if (yyyy?.length === 4 && malePrev.current.yyyy.length !== 4) {
      maleHhRef.current?.focus();
    }

    if (hh?.length === 2 && malePrev.current.hh.length !== 2) {
      maleMinRef.current?.focus();
    }
    if (min?.length === 2 && malePrev.current.min.length !== 2) {
      maleSecRef.current?.focus();
    }

    malePrev.current = { dd, mm, yyyy, hh, min, sec };
  }, [maleForm.birthDate, maleForm.birthTime]);

  // Auto-focus logic for female form
  useEffect(() => {
    const [dd = "", mm = "", yyyy = ""] = (femaleForm.birthDate || "").split("-");
    const [hh = "", min = "", sec = ""] = (femaleForm.birthTime || "").split(":");

    if (dd?.length === 2 && femalePrev.current.dd.length !== 2) {
      femaleMmRef.current?.focus();
    }
    if (mm?.length === 2 && femalePrev.current.mm.length !== 2) {
      femaleYyyyRef.current?.focus();
    }

    if (yyyy?.length === 4 && femalePrev.current.yyyy.length !== 4) {
      femaleHhRef.current?.focus();
    }

    if (hh?.length === 2 && femalePrev.current.hh.length !== 2) {
      femaleMinRef.current?.focus();
    }
    if (min?.length === 2 && femalePrev.current.min.length !== 2) {
      femaleSecRef.current?.focus();
    }

    femalePrev.current = { dd, mm, yyyy, hh, min, sec };
  }, [femaleForm.birthDate, femaleForm.birthTime]);

  // OUTSIDE CLICK HIDES SUGGESTIONS
  useEffect(() => {
    function outsideClick(e) {
      if (
        maleSuggestionsRef.current &&
        !maleSuggestionsRef.current.contains(e.target) &&
        maleCityInputRef.current &&
        !maleCityInputRef.current.contains(e.target)
      ) {
        setMaleShowSuggestions(false);
      }
      if (
        femaleSuggestionsRef.current &&
        !femaleSuggestionsRef.current.contains(e.target) &&
        femaleCityInputRef.current &&
        !femaleCityInputRef.current.contains(e.target)
      ) {
        setFemaleShowSuggestions(false);
      }
    }
    document.addEventListener("click", outsideClick);
    return () => document.removeEventListener("click", outsideClick);
  }, []);

  return (
    <div className="min-h-screen">

      {/* ====================== MOBILE VERSION ====================== */}
      <div className="md:hidden p-4 text-white">
        <div className="w-[98%] mx-auto">

          {/* HEADER */}
          <div className="rounded-3xl overflow-hidden mb-4">
            <div className="card-bg p-5 flex gap-4 items-center">
              <img src="/images/kundaliHead.png" className="w-12" />
              <span className="bg-linear-to-l from-[#F26A20]/50 to-red-500 bg-clip-text text-transparent text-2xl">
                Match Making
              </span>
            </div>
          </div>

          {/* MOBILE FORMS - SCROLLABLE */}
          <div className="card-bg rounded-3xl p-5 max-h-[80vh] overflow-y-auto">

            {/* MALE FORM */}
            <div className="mb-8">
              <div className="space-y-6">

                {/* Name */}
                <div>
                  <label className="text-[#d5d5d5] font-semibold">Name:</label>
                  <input
                    className="w-full bg-transparent border-b border-gray-400 mt-1 p-1 outline-none"
                    placeholder="Male Name"
                    name="name"
                    value={maleForm.name}
                    onChange={(e) => handleChange(e, "male")}
                  />
                </div>

                {/* DATE SPLIT */}
                <div>
                  <label className="text-[#d5d5d5] font-semibold">Date:</label>
                  <div className="grid grid-cols-3 gap-3 mt-1">
                    {/* DD */}
                    <input
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      maxLength={2}
                      type="number"
                      placeholder="DD"
                      ref={maleDdRef}
                      value={maleForm.birthDate.split("-")[0] || ""}
                      onChange={(e) => {
                        const dd = e.target.value;
                        const [_, mm, yyyy] = maleForm.birthDate.split("-");
                        setMaleForm((s) => ({ ...s, birthDate: `${dd}-${mm || ""}-${yyyy || ""}` }));
                      }}
                    />
                    {/* MM */}
                    <input
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      maxLength={2}
                      type="number"
                      placeholder="MM"
                      ref={maleMmRef}
                      value={maleForm.birthDate.split("-")[1] || ""}
                      onChange={(e) => {
                        let mm = e.target.value.replace(/\D/g, "");
                        const [dd, oldMM, yyyy] = maleForm.birthDate.split("-");

                        if (mm === "") {
                          setMaleForm((s) => ({ ...s, birthDate: `${dd || ""}-${""}-${yyyy || ""}` }));
                          return;
                        }

                        if (mm.length === 1) {
                          if (Number(mm) > 1) {
                            mm = "0" + mm;
                          }
                          setMaleForm((s) => ({ ...s, birthDate: `${dd || ""}-${mm}-${yyyy || ""}` }));
                          return;
                        }

                        if (mm.length === 2) {
                          let num = Number(mm);
                          if (num < 1) num = 1;
                          if (num > 12) num = 12;
                          mm = String(num).padStart(2, "0");
                        }

                        setMaleForm((s) => ({ ...s, birthDate: `${dd || ""}-${mm}-${yyyy || ""}` }));
                      }}
                    />
                    {/* YYYY */}
                    <input
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      maxLength={4}
                      placeholder="YYYY"
                      type="number"
                      ref={maleYyyyRef}
                      value={maleForm.birthDate.split("-")[2] || ""}
                      onChange={(e) => {
                        const yyyy = e.target.value;
                        const [dd, mm, _] = maleForm.birthDate.split("-");
                        setMaleForm((s) => ({ ...s, birthDate: `${dd || ""}-${mm || ""}-${yyyy}` }));
                      }}
                    />
                  </div>
                </div>

                {/* TIME SPLIT */}
                <div>
                  <label className="text-[#d5d5d5] font-semibold">Time (24 hrs):</label>
                  <div className="grid grid-cols-3 gap-3 mt-1">
                    {/* HH */}
                    <input
                      maxLength={2}
                      type="number"
                      placeholder="HH"
                      ref={maleHhRef}
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      value={maleForm.birthTime.split(":")[0] || ""}
                      onChange={(e) => {
                        const h = e.target.value;
                        const [_, m, s2] = maleForm.birthTime.split(":");
                        setMaleForm((s) => ({ ...s, birthTime: `${h}:${m || ""}:${s2 || ""}` }));
                      }}
                    />
                    {/* MM */}
                    <input
                      maxLength={2}
                      type="number"
                      placeholder="MM"
                      ref={maleMinRef}
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      value={maleForm.birthTime.split(":")[1] || ""}
                      onChange={(e) => {
                        let m2 = e.target.value.replace(/\D/g, "");
                        if (Number(m2) > 59) m2 = "59";
                        const [h, _, s2] = maleForm.birthTime.split(":");
                        setMaleForm((s) => ({ ...s, birthTime: `${h || ""}:${m2}:${s2 || ""}` }));
                      }}
                    />
                    {/* SS */}
                    <input
                      maxLength={2}
                      type="number"
                      placeholder="SS"
                      ref={maleSecRef}
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      value={maleForm.birthTime.split(":")[2] || ""}
                      onChange={(e) => {
                        const s3 = e.target.value;
                        const [h, m2, _] = maleForm.birthTime.split(":");
                        setMaleForm((s) => ({ ...s, birthTime: `${h || ""}:${m2 || ""}:${s3}` }));
                      }}
                    />
                  </div>
                </div>

                {/* CITY */}
                <div className="relative" ref={maleSuggestionsRef}>
                  <label className="text-[#d5d5d5] font-semibold">Place:</label>
                  <input
                    ref={maleCityInputRef}
                    className="w-full bg-transparent border-b border-gray-400 mt-1 p-2 outline-none"
                    placeholder="City Name"
                    name="city"
                    value={maleForm.city}
                    onChange={(e) => handleChange(e, "male")}
                    onKeyDown={(e) => handleCityKeyDown(e, "male")}
                    autoComplete="off"
                  />

                  {maleShowSuggestions && maleFiltered.length > 0 && (
                    <div className="absolute left-0 right-0 bg-[#1e1e1e] rounded-xl max-h-60 overflow-auto z-50 mt-2">
                      {maleFiltered.map((c, i) => (
                        <div
                          key={i}
                          onClick={() => selectCity(c.city, "male")}
                          className={`p-3 cursor-pointer ${maleHighlight === i ? "bg-[#333]" : ""}`}
                        >
                          <div className="font-semibold">{c.city}</div>
                          <div className="text-xs text-gray-400">{c.admin_name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          {/* <div className="border-t border-2 p-[2px] my-10 bg-white"></div> */}

          <div className="card-bg rounded-3xl p-5 max-h-[80vh] overflow-y-auto mt-5">

            {/* FEMALE FORM */}
            <div className="mb-6">

              <div className="space-y-6">

                {/* Name */}
                <div>
                  <label className="text-[#d5d5d5] font-semibold">Name:</label>
                  <input
                    className="w-full bg-transparent border-b border-gray-400 mt-1 p-1 outline-none"
                    placeholder="Female Name"
                    name="name"
                    value={femaleForm.name}
                    onChange={(e) => handleChange(e, "female")}
                  />
                </div>

                {/* DATE SPLIT */}
                <div>
                  <label className="text-[#d5d5d5] font-semibold">Date:</label>
                  <div className="grid grid-cols-3 gap-3 mt-1">
                    <input
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      maxLength={2}
                      type="number"
                      placeholder="DD"
                      ref={femaleDdRef}
                      value={femaleForm.birthDate.split("-")[0] || ""}
                      onChange={(e) => {
                        const dd = e.target.value;
                        const [_, mm, yyyy] = femaleForm.birthDate.split("-");
                        setFemaleForm((s) => ({ ...s, birthDate: `${dd}-${mm || ""}-${yyyy || ""}` }));
                      }}
                    />
                    <input
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      maxLength={2}
                      type="number"
                      placeholder="MM"
                      ref={femaleMmRef}
                      value={femaleForm.birthDate.split("-")[1] || ""}
                      onChange={(e) => {
                        let mm = e.target.value.replace(/\D/g, "");
                        const [dd, oldMM, yyyy] = femaleForm.birthDate.split("-");

                        if (mm === "") {
                          setFemaleForm((s) => ({ ...s, birthDate: `${dd || ""}-${""}-${yyyy || ""}` }));
                          return;
                        }

                        if (mm.length === 1) {
                          if (Number(mm) > 1) {
                            mm = "0" + mm;
                          }
                          setFemaleForm((s) => ({ ...s, birthDate: `${dd || ""}-${mm}-${yyyy || ""}` }));
                          return;
                        }

                        if (mm.length === 2) {
                          let num = Number(mm);
                          if (num < 1) num = 1;
                          if (num > 12) num = 12;
                          mm = String(num).padStart(2, "0");
                        }

                        setFemaleForm((s) => ({ ...s, birthDate: `${dd || ""}-${mm}-${yyyy || ""}` }));
                      }}
                    />
                    <input
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      maxLength={4}
                      type="number"
                      placeholder="YYYY"
                      ref={femaleYyyyRef}
                      value={femaleForm.birthDate.split("-")[2] || ""}
                      onChange={(e) => {
                        const yyyy = e.target.value;
                        const [dd, mm, _] = femaleForm.birthDate.split("-");
                        setFemaleForm((s) => ({ ...s, birthDate: `${dd || ""}-${mm || ""}-${yyyy}` }));
                      }}
                    />
                  </div>
                </div>

                {/* TIME SPLIT */}
                <div>
                  <label className="text-[#d5d5d5] font-semibold">Time (24 hrs):</label>
                  <div className="grid grid-cols-3 gap-3 mt-1">
                    <input
                      maxLength={2}
                      type="number"
                      placeholder="HH"
                      ref={femaleHhRef}
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      value={femaleForm.birthTime.split(":")[0] || ""}
                      onChange={(e) => {
                        const h = e.target.value;
                        const [_, m, s2] = femaleForm.birthTime.split(":");
                        setFemaleForm((s) => ({ ...s, birthTime: `${h}:${m || ""}:${s2 || ""}` }));
                      }}
                    />
                    <input
                      maxLength={2}
                      type="number"
                      placeholder="MM"
                      ref={femaleMinRef}
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      value={femaleForm.birthTime.split(":")[1] || ""}
                      onChange={(e) => {
                        let m2 = e.target.value.replace(/\D/g, "");
                        if (Number(m2) > 59) m2 = "59";
                        const [h, _, s2] = femaleForm.birthTime.split(":");
                        setFemaleForm((s) => ({ ...s, birthTime: `${h || ""}:${m2}:${s2 || ""}` }));
                      }}
                    />
                    <input
                      maxLength={2}
                      type="number"
                      placeholder="SS"
                      ref={femaleSecRef}
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      value={femaleForm.birthTime.split(":")[2] || ""}
                      onChange={(e) => {
                        const s3 = e.target.value;
                        const [h, m2, _] = femaleForm.birthTime.split(":");
                        setFemaleForm((s) => ({ ...s, birthTime: `${h || ""}:${m2 || ""}:${s3}` }));
                      }}
                    />
                  </div>
                </div>

                {/* CITY */}
                <div className="relative" ref={femaleSuggestionsRef}>
                  <label className="text-[#d5d5d5] font-semibold">Place:</label>
                  <input
                    ref={femaleCityInputRef}
                    className="w-full bg-transparent border-b border-gray-400 mt-1 p-2 outline-none"
                    placeholder="City Name"
                    name="city"
                    value={femaleForm.city}
                    onChange={(e) => handleChange(e, "female")}
                    onKeyDown={(e) => handleCityKeyDown(e, "female")}
                    autoComplete="off"
                  />

                  {femaleShowSuggestions && femaleFiltered.length > 0 && (
                    <div className="absolute left-0 right-0 bg-[#1e1e1e] rounded-xl max-h-60 overflow-auto z-50 mt-2">
                      {femaleFiltered.map((c, i) => (
                        <div
                          key={i}
                          onClick={() => selectCity(c.city, "female")}
                          className={`p-3 cursor-pointer ${femaleHighlight === i ? "bg-[#333]" : ""}`}
                        >
                          <div className="font-semibold">{c.city}</div>
                          <div className="text-xs text-gray-400">{c.admin_name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              onClick={submitMatchMaking}
              className="w-full bg-[#104072] rounded-xl py-3 text-white font-semibold mt-6"
            >
              {loading ? "Calculating..." : "Generate Match Making"}
            </button>
          </div>
        </div>
      </div>

      {/* ====================== DESKTOP VERSION ====================== */}
      <div className="hidden md:block bg-[#fff7e6] p-10 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white/80 border border-yellow-300 rounded-3xl shadow-lg p-12">

          <h1 className="text-center text-5xl font-bold text-[#d98b00] mb-4">
            Match Making
          </h1>
          <p className="text-center text-gray-600 mb-10">
            Enter birth details for both partners to check compatibility
          </p>

          {/* TWO COLUMN LAYOUT */}
          <div className="grid grid-cols-2 gap-8 mb-8">

            {/* MALE COLUMN */}
            <div className="space-y-6 border-r border-gray-300 pr-8">
              <h2 className="text-2xl font-bold text-blue-600 text-center mb-4">Male</h2>

              {/* NAME */}
              <div className="space-y-1">
                <label className="text-[#e29d00] font-semibold">Name</label>
                <input
                  className="w-full bg-white rounded-xl p-4 shadow outline-none text-black"
                  name="name"
                  placeholder="Male Name"
                  value={maleForm.name}
                  onChange={(e) => handleChange(e, "male")}
                />
              </div>

              {/* DOB */}
              <div className="space-y-1">
                <label className="text-[#e29d00] font-semibold">Date Of Birth</label>
                <input
                  className="w-full bg-white rounded-xl p-4 shadow outline-none text-black"
                  name="birthDate"
                  value={maleForm.birthDate}
                  onChange={(e) => handleChange(e, "male")}
                  type="date"
                />
              </div>

              {/* TIME */}
              <div className="space-y-1">
                <label className="text-[#e29d00] font-semibold">Birth Time</label>
                <input
                  className="w-full bg-white rounded-xl p-4 shadow outline-none text-black"
                  name="birthTime"
                  value={maleForm.birthTime}
                  onChange={(e) => handleChange(e, "male")}
                  type="time"
                />
              </div>

              {/* CITY AUTOCOMPLETE */}
              <div className="space-y-1 relative" ref={maleSuggestionsRef}>
                <label className="text-[#e29d00] font-semibold">Birth City</label>
                <input
                  ref={maleCityInputRef}
                  name="city"
                  value={maleForm.city}
                  onChange={(e) => handleChange(e, "male")}
                  onKeyDown={(e) => handleCityKeyDown(e, "male")}
                  autoComplete="off"
                  placeholder="Delhi"
                  className="w-full bg-white rounded-xl p-4 shadow outline-none text-black"
                />

                {maleShowSuggestions && maleFiltered.length > 0 && (
                  <div className="absolute left-0 right-0 bg-white rounded-xl shadow max-h-60 overflow-auto z-50 mt-2 border border-gray-200">
                    {maleFiltered.map((c, i) => (
                      <div
                        key={i}
                        onClick={() => selectCity(c.city, "male")}
                        className={`p-3 cursor-pointer hover:bg-gray-100 ${maleHighlight === i ? "bg-gray-200" : ""}`}
                      >
                        <div className="font-semibold text-black">{c.city}</div>
                        <div className="text-xs text-gray-500">{c.admin_name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* FEMALE COLUMN */}
            <div className="space-y-6 pl-8">
              <h2 className="text-2xl font-bold text-pink-600 text-center mb-4">Female</h2>

              {/* NAME */}
              <div className="space-y-1">
                <label className="text-[#e29d00] font-semibold">Name</label>
                <input
                  className="w-full bg-white rounded-xl p-4 shadow outline-none text-black"
                  name="name"
                  placeholder="Female Name"
                  value={femaleForm.name}
                  onChange={(e) => handleChange(e, "female")}
                />
              </div>

              {/* DOB */}
              <div className="space-y-1">
                <label className="text-[#e29d00] font-semibold">Date Of Birth</label>
                <input
                  className="w-full bg-white rounded-xl p-4 shadow outline-none text-black"
                  name="birthDate"
                  value={femaleForm.birthDate}
                  onChange={(e) => handleChange(e, "female")}
                  type="date"
                />
              </div>

              {/* TIME */}
              <div className="space-y-1">
                <label className="text-[#e29d00] font-semibold">Birth Time</label>
                <input
                  className="w-full bg-white rounded-xl p-4 shadow outline-none text-black"
                  name="birthTime"
                  value={femaleForm.birthTime}
                  onChange={(e) => handleChange(e, "female")}
                  type="time"
                />
              </div>

              {/* CITY AUTOCOMPLETE */}
              <div className="space-y-1 relative" ref={femaleSuggestionsRef}>
                <label className="text-[#e29d00] font-semibold">Birth City</label>
                <input
                  ref={femaleCityInputRef}
                  name="city"
                  value={femaleForm.city}
                  onChange={(e) => handleChange(e, "female")}
                  onKeyDown={(e) => handleCityKeyDown(e, "female")}
                  autoComplete="off"
                  placeholder="Delhi"
                  className="w-full bg-white rounded-xl p-4 shadow outline-none text-black"
                />

                {femaleShowSuggestions && femaleFiltered.length > 0 && (
                  <div className="absolute left-0 right-0 bg-white rounded-xl shadow max-h-60 overflow-auto z-50 mt-2 border border-gray-200">
                    {femaleFiltered.map((c, i) => (
                      <div
                        key={i}
                        onClick={() => selectCity(c.city, "female")}
                        className={`p-3 cursor-pointer hover:bg-gray-100 ${femaleHighlight === i ? "bg-gray-200" : ""}`}
                      >
                        <div className="font-semibold text-black">{c.city}</div>
                        <div className="text-xs text-gray-500">{c.admin_name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={submitMatchMaking}
            disabled={loading}
            className="w-full bg-linear-to-r from-[#d98b00] to-[#e29d00] hover:from-[#c77d00] hover:to-[#d18e00] text-white font-bold text-xl py-4 rounded-xl shadow-lg disabled:opacity-50"
          >
            {loading ? "Calculating Both Kundalis..." : "Generate Match Making"}
          </button>

          {/* RESULTS PREVIEW */}
          {(maleResult || femaleResult) && (
            <div className="mt-8 grid grid-cols-2 gap-6">
              {maleResult && (
                <div className="bg-blue-50 border border-blue-300 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">Male Kundali ✅</h3>
                  <p className="text-gray-700 text-sm">Data received and stored</p>
                  <p className="text-gray-500 text-xs mt-2">Ready for match calculations</p>
                </div>
              )}
              {femaleResult && (
                <div className="bg-pink-50 border border-pink-300 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-pink-600 mb-2">Female Kundali ✅</h3>
                  <p className="text-gray-700 text-sm">Data received and stored</p>
                  <p className="text-gray-500 text-xs mt-2">Ready for match calculations</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}