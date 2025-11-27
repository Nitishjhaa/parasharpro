"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function KundaliHeader({
  title = "कुंडली",
  indexParam,
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
            className={`${
              isSideOpen ? "rotate-180" : ""
            } transition-all duration-300 w-12 brightness-0`}
            onClick={() => setIsSideOpen(!isSideOpen)}
          />
          <span className="bg-linear-to-l from-[#F26A20]/50 to-red-500 bg-clip-text text-transparent text-xl">
            {title}
          </span>
        </div>
      </div>

      {/* ---------- OVERLAY ---------- */}
      {isSideOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10"
          onClick={() => setIsSideOpen(false)}
        />
      )}

      {/* ---------- FRAMER MOTION SIDE DRAWER ---------- */}
      <motion.div
        initial={{ x: -260 }}
        animate={{ x: isSideOpen ? 0 : -260 }}   // FULL OPEN = 0
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed top-0 left-0 h-screen bg-black z-20 rounded-r-3xl p-3"
        style={{ width: "270px" }}
      >
        <img
          src="/images/kundaliHead.png"
          className={`${
            isSideOpen ? "rotate-180" : ""
          } transition-all duration-300 w-12 brightness-0 invert-100`}
          onClick={() => setIsSideOpen(false)}
        />

        <div
          className="w-full text-white mt-5 text-lg"
          onClick={() => setIsSideOpen(false)}
        >
          <div className="border-b-2 pb-2">
            <Link href={`/kundaliInfo?index=${indexParam}`}>लग्न कुंडली</Link>
          </div>

          <div className="border-b-2 py-2">
            <Link href={`/kundaliInfo/navmansha?index=${indexParam}`}>
              नवमांश कुंडली
            </Link>
          </div>

          <div className="border-b-2 py-2">
            <Link href={`/kundaliInfo/mahadasha?index=${indexParam}`}>
              महादशा
            </Link>
          </div>

          <div className="border-b-2 py-2">
            <Link href={`/kundaliInfo/Info?index=${indexParam}`}>
              सामान्य परिचय
            </Link>
          </div>

          <div className="border-b-2 py-2">
            <Link href={`/kundaliInfo/astaVargaChakra?index=${indexParam}`}>
              अष्टकवर्ग चक्र
            </Link>
          </div>

          <div className="border-b-2 py-2">
            <Link href={`/kundaliInfo/sodasVargaKundali?index=${indexParam}`}>
              षोडश वर्ग कुंडली
            </Link>
          </div>

          <div className="border-b-2 py-2">
            <Link href={`/kundaliInfo/faladesh?index=${indexParam}`}>
              फलादेश
            </Link>
          </div>

          <div className="border-b-2 py-2">
            <Link href={`/kundaliInfo/dosha?index=${indexParam}`}>
              दोष
            </Link>
          </div>

          <div className="border-b-2 py-2">
            <Link href={`/kundaliInfo/ratna?index=${indexParam}`}>
              रत्न
            </Link>
          </div>

          <div className="border-b-2 py-2">उपाय</div>
        </div>
      </motion.div>
    </>
  );
}
