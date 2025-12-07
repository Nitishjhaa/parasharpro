"use client";

import { useEffect, useState, useRef } from "react";
import { CiClock2 } from "react-icons/ci";
import { HiLanguage } from "react-icons/hi2";
import { FaDatabase } from "react-icons/fa";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { saveChildKundali, loadChildKundalis } from "@/lib/db";
import { RiCloseLargeFill } from "react-icons/ri";


export default function KundaliPage() {
  const [cities, setCities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [highlight, setHighlight] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recent, setRecent] = useState([]);
  const [isDbClicked, setIsDbClicked] = useState(false)

  useEffect(() => {
    async function load() {
      const list = await loadChildKundalis();
      setRecent(list);
    }
    load();
  }, []);

  const formatMetaDate = (meta) => {
    if (!meta) return "";
    return `${meta.birthDate || ""} ${meta.birthTime ? "• " + meta.birthTime : ""}`;
  };

  const ddRef = useRef(null);
  const mmRef = useRef(null);
  const yyyyRef = useRef(null);

  const hhRef = useRef(null);
  const minRef = useRef(null);
  const secRef = useRef(null);

  const prev = useRef({
    dd: "",
    mm: "",
    yyyy: "",
    hh: "",
    min: "",
    sec: ""
  });

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    gender: "",
    birthDate: "",
    birthTime: "",
    city: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const cityInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Load cities.json
  useEffect(() => {
    fetch("/data/cities.json")
      .then((r) => r.json())
      .then((data) => setCities(data || []));
  }, []);

  // FILTER CITIES
  function filterCities(q) {
    if (!q || q.trim() === "") {
      setFiltered([]);
      setShowSuggestions(false);
      return;
    }

    const query = q.toLowerCase();

    const matches = cities
      .filter((c) =>
        c.city.toLowerCase().includes(query) ||
        c.admin_name.toLowerCase().includes(query)
      )
      .slice(0, 20);

    setFiltered(matches);
    setShowSuggestions(true);
    setHighlight(0);
  }


  // HANDLE INPUTS
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));

    if (name === "city") filterCities(value);
  }

  function selectCity(cityName) {
    const obj = cities.find(c => c.city === cityName);

    setForm((s) => ({
      ...s,
      city: cityName,
      state: obj?.admin_name || ""
    }));

    setFiltered([]);
    setShowSuggestions(false);
    setHighlight(-1);
  }


  // ARROW KEY NAVIGATION
  function handleCityKeyDown(e) {
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
      if (highlight >= 0) selectCity(filtered[highlight].city);
    }

    if (e.key === "Escape") setShowSuggestions(false);
  }

  // OUTSIDE CLICK HIDES SUGGESTIONS
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

  // ------------------------------------------------------------------------------------
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

      if (yyyy.length === 2) yyyy = "20" + yyyy; // assume 20xx

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
  // ------------------------------------------------------------------------------------

  // SUBMIT
  async function submit() {
    const cityObj = cities.find((c) => c.city === form.city);
    if (!cityObj)
      return (
        toast.error("Please select a valid city from suggestions.")
      )

    // Convert UI formats → backend formats
    const isoDate = normalizeDateToISO(form.birthDate);
    if (!isoDate) {
      toast.error("Invalid Date Format (Use DD-MM-YYYY)");
      return;
    }

    const isoTime = normalizeTime(form.birthTime);
    if (!isoTime) {
      toast.error("Invalid Time Format (Use HH:MM)");
      return;
    }

    if (!form.gender) {
      toast.error("Gender needed to progress further");
      return;
    }

    const payload = {
      name: form.name,
      gender: form.gender,
      birthDate: isoDate,
      birthTime: isoTime,
      lat: Number(cityObj.lat),
      lon: Number(cityObj.lng),
      city: cityObj.city,
      timeZone: "Asia/Kolkata",
    };

    setLoading(true);
    setResult(null);

    // http://localhost:8080/kundali
    // https://kundalipwa.onrender.com/kundali

    try {
      const res = await fetch("http://localhost:8080/kundali", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult(data);

      // save full record (raw response + meta)
      await saveChildKundali({
        raw: data,
        meta: {
          name: form.name,
          gender: form.gender,
          birthDate: form.birthDate,
          birthTime: form.birthTime,
          city: form.city,
        }
      });

      // navigate to the newly saved kundali (index 0)
      router.push("/child/childInfo?index=0");
    } catch (err) {
      alert("Failed to fetch");
    }

    setLoading(false);
  }

  useEffect(() => {
    const [dd = "", mm = "", yyyy = ""] = (form.birthDate || "").split("-");
    const [hh = "", min = "", sec = ""] = (form.birthTime || "").split(":");

    // DATE -----------------------------------------------------
    if (dd?.length === 2 && prev.current.dd.length !== 2) {
      mmRef.current?.focus();
    }
    if (mm?.length === 2 && prev.current.mm.length !== 2) {
      yyyyRef.current?.focus();
    }

    // TIME -----------------------------------------------------
    if (hh?.length === 2 && prev.current.hh.length !== 2) {
      minRef.current?.focus();
    }
    if (min?.length === 2 && prev.current.min.length !== 2) {
      secRef.current?.focus();
    }

    // UPDATE PREVIOUS VALUES -----------------------------------------------------
    prev.current = {
      dd,
      mm,
      yyyy,
      hh,
      min,
      sec
    };
  }, [form.birthDate, form.birthTime]);

  return (
    <div className="min-h-screen">

      {/* ====================== MOBILE VERSION ====================== */}
      <div className="md:hidden p-4 text-white">
        <div className="w-[98%] mx-auto">

          {/* HEADER */}
          <div className="rounded-3xl overflow-hidden mb-4">
            <div className="dark:bg-[#232323] bg-[#d0d0d0] p-5 flex gap-4 items-center">
              <img src="/images/kundaliHead.png" className="w-12" />
              <span className="bg-linear-to-l from-[#F26A20]/50 to-red-500 bg-clip-text text-transparent text-3xl">
                Child Kundali
              </span>
            </div>
          </div>

          {/* MOBILE FORM */}
          <div className="card-bg rounded-3xl p-5 h-[80vh]">
            <div className="grid grid-cols-[1fr] gap-3">

              {/* LEFT SIDE */}
              <div className="space-y-6">

                {/* Gender */}
                <div>
                  <label className="text-[#d5d5d5] font-semibold">Gender:</label>
                  <div className="flex items-center gap-4 mt-1">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="gender" value="Male"
                        checked={form.gender === "Male"} onChange={handleChange} />
                      Male
                    </label>

                    <label className="flex items-center gap-2">
                      <input type="radio" name="gender" value="Female"
                        checked={form.gender === "Female"} onChange={handleChange} />
                      Female
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-[#d5d5d5] font-semibold">Name:</label>
                  <input
                    className="w-full bg-transparent border-b border-gray-400 mt-1 p-1 outline-none"
                    placeholder="Your Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
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
                      placeholder="DD"
                      ref={ddRef}
                      value={form.birthDate.split("-")[0] || ""}
                      onChange={(e) => {
                        const dd = e.target.value;
                        const [_, mm, yyyy] = form.birthDate.split("-");
                        setForm((s) => ({ ...s, birthDate: `${dd}-${mm || ""}-${yyyy || ""}` }));
                      }}
                    />
                    {/* MM */}
                    <input
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      maxLength={2}
                      placeholder="MM"
                      ref={mmRef}
                      value={form.birthDate.split("-")[1] || ""}
                      onChange={(e) => {
                        let mm = e.target.value.replace(/\D/g, ""); // numbers only
                        const [dd, oldMM, yyyy] = form.birthDate.split("-");

                        // --------------------------
                        // WHEN USER CLEARS INPUT
                        // --------------------------
                        if (mm === "") {
                          setForm((s) => ({
                            ...s,
                            birthDate: `${dd || ""}-${""}-${yyyy || ""}`
                          }));
                          return;
                        }

                        // --------------------------
                        // IF USER TYPES ONE DIGIT
                        // --------------------------
                        if (mm.length === 1) {
                          // allow 1–9
                          if (Number(mm) > 1) {
                            // Example: user typed "5" → valid as "05"
                            mm = "0" + mm;
                          }
                          // Example: user typed "0" → allow and wait for next digit
                          setForm((s) => ({
                            ...s,
                            birthDate: `${dd || ""}-${mm}-${yyyy || ""}`
                          }));
                          return;
                        }

                        // --------------------------
                        // NOW LENGTH = 2
                        // VALIDATE 01–12
                        // --------------------------
                        if (mm.length === 2) {
                          let num = Number(mm);

                          if (num < 1) num = 1;
                          if (num > 12) num = 12;

                          mm = String(num).padStart(2, "0");
                        }

                        setForm((s) => ({
                          ...s,
                          birthDate: `${dd || ""}-${mm}-${yyyy || ""}`
                        }));
                      }}
                    />

                    {/* YYYY */}
                    <input
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      maxLength={4}
                      placeholder="YYYY"
                      ref={yyyyRef}
                      value={form.birthDate.split("-")[2] || ""}
                      onChange={(e) => {
                        const yyyy = e.target.value;
                        const [dd, mm, _] = form.birthDate.split("-");
                        setForm((s) => ({ ...s, birthDate: `${dd || ""}-${mm || ""}-${yyyy}` }));
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
                      placeholder="HH"
                      ref={hhRef}
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      value={form.birthTime.split(":")[0] || ""}
                      onChange={(e) => {
                        const h = e.target.value;
                        const [_, m, s2] = form.birthTime.split(":");
                        setForm((s) => ({ ...s, birthTime: `${h}:${m || ""}:${s2 || ""}` }));
                      }}
                    />
                    {/* MM */}
                    <input
                      maxLength={2}
                      placeholder="MM"
                      ref={minRef}
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      value={form.birthTime.split(":")[1] || ""}
                      onChange={(e) => {
                        let m2 = e.target.value.replace(/\D/g, ""); // allow only numbers

                        // If number > 59 → restrict (because it's MINUTES)
                        if (Number(m2) > 59) m2 = "59";

                        const [h, _, s2] = form.birthTime.split(":");
                        setForm((s) => ({
                          ...s,
                          birthTime: `${h || ""}:${m2}:${s2 || ""}`
                        }));
                      }}
                    />

                    {/* SS */}
                    <input
                      maxLength={2}
                      placeholder="SS"
                      ref={secRef}
                      className="bg-transparent border-b border-gray-400 p-2 outline-none text-center"
                      value={form.birthTime.split(":")[2] || ""}
                      onChange={(e) => {
                        const s3 = e.target.value;
                        const [h, m2, _] = form.birthTime.split(":");
                        setForm((s) => ({ ...s, birthTime: `${h || ""}:${m2 || ""}:${s3}` }));
                      }}
                    />
                  </div>
                </div>

                {/* CITY */}
                <div className="relative" ref={suggestionsRef}>
                  <label className="text-[#d5d5d5] font-semibold">Place:</label>
                  <input
                    ref={cityInputRef}
                    className="w-full bg-transparent border-b border-gray-400 mt-1 p-2 outline-none"
                    placeholder="City Name"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    onKeyDown={handleCityKeyDown}
                    autoComplete="off"
                  />

                  {showSuggestions && filtered.length > 0 && (
                    <div className="absolute left-0 right-0 bg-[#1e1e1e] rounded-xl max-h-60 overflow-auto z-50 mt-2">
                      {filtered.map((c, i) => (
                        <div
                          key={i}
                          onClick={() => selectCity(c.city)}
                          className={`p-3 cursor-pointer ${highlight === i ? "bg-[#333]" : ""
                            }`}
                        >
                          <div className="font-semibold">{c.city}</div>
                          <div className="text-xs text-gray-400">{c.admin_name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT SIDE BUTTON BAR */}
              <div className="flex justify-left items-center gap-6 pt-5">
                <button className="w-12 h-12 bg-[#ccc] rounded-lg flex items-center justify-center">
                  <span className="text-black text-xl font-bold "><HiLanguage /></span>
                </button>

                <button
                  className="w-12 h-12 bg-[#ccc] rounded-lg flex items-center justify-center"
                  onClick={() => {
                    const now = new Date();

                    const dd = String(now.getDate()).padStart(2, "0");
                    const mm = String(now.getMonth() + 1).padStart(2, "0");
                    const yyyy = now.getFullYear();

                    const hh = String(now.getHours()).padStart(2, "0");
                    const min = String(now.getMinutes()).padStart(2, "0");
                    const ss = String(now.getSeconds()).padStart(2, "0");

                    setForm((s) => ({
                      ...s,
                      birthDate: `${dd}-${mm}-${yyyy}`,
                      birthTime: `${hh}:${min}:${ss}`,
                    }));
                  }}
                >
                  <span className="text-white text-xl"><CiClock2 size={25} color="black" /></span>
                </button>
              </div>

            </div>

            {/* SUBMIT */}
            <button
              onClick={submit}
              className="w-full bg-[#104072] rounded-xl py-3 text-white font-semibold mt-6"
            >
              {loading ? "Calculating..." : "Generate Kundali"}
            </button>
          </div>

          <div className={`card-bg absolute top-2 justify-center items-center scale-0 transition-all duration-300 ease-in ${isDbClicked ? 'scale-100 flex' : 'scale-0 hidden'} `}>
            <div className=" flex-1 rounded-3xl border border-neutral-300 dark:border-neutral-700 card-bg overflow-y-auto w-[90vw] p-3">
              <div className="flex justify-between items-center">
                <div className="mb-1">
                  Last 100 Kundalis.
                </div>
                <button onClick={(e) => setIsDbClicked(!isDbClicked)} className="bg-black w-10 h-10 flex justify-center items-center rounded-full">
                  <RiCloseLargeFill />
                </button>
              </div>
              <div className="mt-3 space-y-3 p-2 rounded overflow-y-auto">
                {recent.length === 0 && (
                  <div className="text-gray-500">No recent kundalis</div>
                )}
                {recent.map((r, idx) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-md bg-white/80 dark:bg-[#1f1f1f] cursor-pointer"
                    onClick={() => router.push(`/kundaliInfo?index=${idx}`)}
                  >
                    <div className="font-semibold">{r.meta?.name || "Unknown"}</div>
                    <div className="text-sm text-gray-300">{formatMetaDate(r.meta)} {" "} | {r.meta?.city || ""} </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================== DESKTOP VERSION ====================== */}
      <div className="hidden md:block bg-[#fff7e6] p-10 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white/80 border border-yellow-300 rounded-3xl shadow-lg p-12">

          <h1 className="text-center text-5xl font-bold text-[#d98b00] mb-4">
            Kundali
          </h1>
          <p className="text-center text-gray-600 mb-10">
            Enter your birth details to generate your personalized Kundali
          </p>

          {/* DESKTOP FORM */}
          <div className="space-y-6">

            {/* NAME */}
            <div className="space-y-1">
              <label className="text-[#e29d00] font-semibold">Name</label>
              <input
                className="w-full bg-white rounded-xl p-4 shadow outline-none text-black"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            {/* DOB / TIME / GENDER */}
            <div className="grid grid-cols-3 gap-6">

              <div className="space-y-1">
                <label className="text-[#e29d00] font-semibold">Date Of Birth</label>
                <input
                  className="w-full bg-white rounded-xl p-4 shadow outline-none text-black"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  type="date"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#e29d00] font-semibold">Birth Time</label>
                <input
                  className="w-full bg-white rounded-xl p-4 shadow outline-none text-black"
                  name="birthTime"
                  value={form.birthTime}
                  onChange={handleChange}
                  type="time"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#e29d00] font-semibold">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full bg-white rounded-xl p-4 shadow outline-none text-black"
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>

            {/* CITY AUTOCOMPLETE */}
            <div className="space-y-1 relative" ref={suggestionsRef}>
              <label className="text-[#e29d00] font-semibold">Birth City</label>

              <input
                ref={cityInputRef}
                name="city"
                value={form.city}
                onChange={handleChange}
                onKeyDown={handleCityKeyDown}
                autoComplete="off"
                placeholder="Delhi"
                className="w-full bg-white rounded-xl p-4 shadow outline-none text-black"
              />

              {showSuggestions && filtered.length > 0 && (
                <div className="absolute left-0 right-0 bg-white rounded-xl shadow max-h-60 overflow-auto z-50 mt-2 border border-gray-200">
                  {filtered.map((c, i) => (
                    <div
                      key={i}
                      onClick={() => selectCity(c.city)}
                      className={`p-3 cursor-pointer ${i === highlight ? "bg-yellow-100" : ""
                        }`}
                    >
                      <div className="font-semibold text-black">{c.city}</div>
                      <div className="text-xs text-gray-600">{c.admin_name}</div>
                    </div>

                  ))}
                </div>
              )}
            </div>

            {/* SUBMIT */}
            <button
              onClick={submit}
              className="w-full bg-[#f2b300] hover:bg-[#e0a000] text-white rounded-xl py-4 text-lg font-semibold shadow"
            >
              {loading ? "Calculating..." : "Generate Kundali"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
