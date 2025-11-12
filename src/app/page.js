"use client"

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {
  const cards = [
    { href: "/child", icon: "/images/footprint.svg", title: "Child Kundali", desc: "Understand your child’s cosmic blueprint and future path." },
    { href: "/kundali", icon: "/images/star.svg", title: "Kundali", desc: "Generate detailed birth charts with advanced interpretations." },
    { href: "/matchmatching", icon: "/images/ring.svg", title: "Match-Matching", desc: "Check compatibility and discover perfect astrological matches." },
    { href: "/panchang", icon: "/images/shape.svg", title: "Panchang", desc: "View daily tithis, nakshatras, and auspicious timings." },
  ];

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-linear-to-br from-[#fffaf2] to-[#fdf5e8] dark:from-[#121212] dark:to-[#1a1a1a]">
      {/* Background Aura */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FDC565]/30 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[400px] h-[400px] bg-[#FFAE42]/20 blur-[160px] rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-[92%] md:w-[85%] max-w-7xl text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
            Discover Your Cosmic Path
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Navigate your journey through precise astrology tools designed for
            insight, clarity, and balance.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group relative cursor-pointer rounded-3xl border border-[#e4e4e4] dark:border-[#333] bg-white/70 dark:bg-[#222]/70 backdrop-blur-lg shadow-[0_10px_40px_rgba(0,0,0,0.07)] hover:shadow-[0_15px_50px_rgba(253,197,101,0.3)] transition-all duration-500 overflow-hidden"
            >
              <Link href={card.href}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-b from-[#FDC565]/20 to-transparent"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-80 p-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#FDC565] shadow-[0_0_25px_rgba(253,197,101,0.5)] mb-6 group-hover:scale-110 transition-transform duration-500">
                    <img src={card.icon} alt="" className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 px-3">
                    {card.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
