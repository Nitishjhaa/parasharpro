"use client";

import { useState, useEffect } from "react";

export default function MatchHeader({
  title = "मिलान",
  isSideOpen,
  setIsSideOpen,
}) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  // ---------- SWIPE DETECTION ----------
  useEffect(() => {
    const handleTouchStart = (e) => {
      setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
      setCurrentX(e.touches[0].clientX);

      // Swipe from LEFT EDGE to OPEN
      if (startX < 20 && currentX - startX > 50) {
        setIsSideOpen(true);
      }

      // Swipe to CLOSE when drawer open
      if (isSideOpen && startX > 240 && startX - currentX > 50) {
        setIsSideOpen(false);
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [startX, currentX, isSideOpen, setIsSideOpen]);

  return (
    <>
      {/* LEFT EDGE SWIPE OPENER */}
      <div
        className="fixed top-0 left-0 h-screen w-5 z-50"
        onTouchStart={() => setIsSideOpen(true)}
      ></div>

      {/* ---------- TOP HEADER ---------- */}
      <div className="rounded-3xl overflow-hidden mb-4">
        <div className="bg-linear-to-r from-[#FFE984] to-[#FFB111] p-5 flex gap-4 items-center">
          <img
            src="/images/kundaliHead.png"
            className={`${isSideOpen ? "rotate-180" : ""
              } transition-all duration-300 w-12 brightness-0`}
            onClick={() => setIsSideOpen(!isSideOpen)}
          />
          <span className="bg-linear-to-l from-[#F26A20]/50 to-red-500 bg-clip-text text-transparent text-xl">
            {title}
          </span>
        </div>
      </div>

    </>
  );
}
