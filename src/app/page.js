"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [cities, setCities] = useState([]);
  const [groupedCities, setGroupedCities] = useState({});

  const [form, setForm] = useState({
    name: "",
    gender: "",
    birthDate: "",
    birthTime: "",
    country: "India",
    city: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load indian cities JSON
  useEffect(() => {
    fetch("/data/cities.json")
      .then((r) => r.json())
      .then((data) => {
        setCities(data);

        // GROUP by state (admin_name)
        const grouped = {};
        data.forEach((item) => {
          const state = item.admin_name || "Other";
          if (!grouped[state]) grouped[state] = [];
          grouped[state].push(item);
        });

        setGroupedCities(grouped);
      })
      .catch((e) => console.error("Error loading cities.json", e));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    const selectedCity = cities.find((c) => c.city === form.city);

    if (!selectedCity) {
      alert("City not found in cities.json");
      return;
    }

    const payload = {
      birthDate: form.birthDate,
      birthTime: form.birthTime,
      timeZone: "Asia/Kolkata",
      lat: Number(selectedCity.lat),
      lon: Number(selectedCity.lng),
      gender: form.gender,
      country: form.country,
      city: selectedCity.city,
      name: form.name,
    };

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8080/kundali", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Failed to fetch kundali data");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex justify-center">
      <div className="w-full max-w-xl">

        <h1 className="text-3xl font-bold mb-6">Parashar-Pro</h1>
        <p className="text-gray-400 mb-8">Generate your detailed Kundali instantly.</p>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            />
            <input
              type="time"
              name="birthTime"
              value={form.birthTime}
              onChange={handleChange}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            />
          </div>

          {/* CITY SELECT WITH GROUPING */}
          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
          >
            <option value="">Select Birth City</option>

            {Object.keys(groupedCities).map((state) => (
              <optgroup key={state} label={state}>
                {groupedCities[state].map((cityObj) => (
                  <option key={cityObj.id} value={cityObj.city}>
                    {cityObj.city}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition disabled:bg-blue-900"
          >
            {loading ? "Calculating..." : "Generate Kundali"}
          </button>
        </div>

        {result && (
          <div className="mt-6 bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold">Kundali Result</h2>
            <details className="bg-gray-800 mt-4 p-4 rounded-lg">
              <summary>View JSON</summary>
              <pre className="whitespace-pre-wrap text-sm mt-2">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
