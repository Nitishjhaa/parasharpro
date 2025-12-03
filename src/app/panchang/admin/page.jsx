"use client";


import { useState } from "react";

export default function AdminPanchang() {
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("01");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    gaadi_lene_ki_taarik: "",
    vivaah_ki_taarik: "",
    grah_parvesh: "",
    pashu_lene_ki_taarik: ""
  });

  const updateField = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveData = async () => {
    setMessage("Saving...");

    const res = await fetch("/api/panchang/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year,
        month,
        data: form
      })
    });

    const result = await res.json();

    if (result.success) {
      setMessage("✅ Panchang updated successfully!");
    } else {
      setMessage("❌ Error: " + result.error);
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin – Update Panchang</h1>

      {/* YEAR */}
      <label className="block font-semibold">Year</label>
      <input
        type="text"
        className="border p-2 rounded w-full mb-4"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />

      {/* MONTH */}
      <label className="block font-semibold">Month (01–12)</label>
      <input
        type="text"
        className="border p-2 rounded w-full mb-4"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      <div className="grid grid-cols-1 gap-4 mt-4">
        {Object.keys(form).map((key) => (
          <div key={key}>
            <label className="block capitalize font-semibold">
              {key.replace(/_/g, " ")}
            </label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={form[key]}
              onChange={(e) => updateField(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={saveData}
        className="mt-6 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
      >
        Save Panchang
      </button>

      {/* Status Message */}
      {message && (
        <p className="mt-4 text-lg">
          {message}
        </p>
      )}
    </div>
  );
}
