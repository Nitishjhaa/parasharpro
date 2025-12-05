// KundaliStructure.jsx
import React from "react";

const hindiPlanetNames = {
  Sun: "सूर्य",
  Moon: "चन्द्र",
  Mars: "मंगल",
  Mercury: "बुध",
  Jupiter: "गुरु",
  Venus: "शुक्र",
  Saturn: "शनि",
  Rahu: "राहु",
  Ketu: "केतु",
};

export default function KundaliStructure({ kundali, title = "कुंडली" }) {
  if (!kundali) return null;

  const planets = kundali?.planets || kundali?.raw?.planets;
  const ascendant = kundali?.ascendant || kundali?.raw?.ascendant;

  const ascHouse = (ascendant?.rashiIndex ?? 0) + 1; // 1..12

  // FIXED SVG HOUSE COORDINATES (YOUR ORIGINAL EXACT POSITIONS)
  const housePositions = [
    { x: 193, y: 70 },
    { x: 170, y: 65 },
    { x: 53, y: 180 },
    { x: 60, y: 205 },
    { x: 52, y: 230 },
    { x: 170, y: 345 },
    { x: 193, y: 340 },
    { x: 220, y: 345 },
    { x: 334, y: 225 },
    { x: 326, y: 205 },
    { x: 334, y: 180 },
    { x: 220, y: 64 },
  ];

  //  FIXED PLANET POSITIONS (YOUR EXACT POINTS)
  const planetPositions = [
    { x: 185, y: 85 },    //1
    { x: 118, y: 63 },    //2
    { x: 55, y: 95 },     //3
    { x: 108, y: 160 },   //4
    { x: 55, y: 245 },    //5
    { x: 117, y: 300 },   //6
    { x: 185, y: 240 },   //7
    { x: 262, y: 300 },   //8
    { x: 323, y: 240 },   //9
    { x: 265, y: 160 },   //10
    { x: 325, y: 90 },    //11
    { x: 268, y: 63 },    //12
  ];

  // Convert backend → usable structure
  const planetList = Object.entries(planets).map(([name, data]) => ({
    name,
    hindi: hindiPlanetNames[name],
    house: data.house, // already 1..12 from backend
  }));

  return (
    <div className="w-[110%] lg:w-[50%] ">
      <h2 className="text-center text-2xl font-semibold tracking-wide pt-10">
        {title}
      </h2>

      <div className="relative p-3 scale-125 lg:scale-100">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          {/* FIXED SHAPE — DO NOT TOUCH */}
          <rect x="50" y="50" width="300" height="300" stroke="black" fill="none" strokeWidth="1.5" />
          <line x1="50" y1="50" x2="350" y2="350" stroke="black" strokeWidth="1.5" />
          <line x1="50" y1="350" x2="350" y2="50" stroke="black" strokeWidth="1.5" />
          <line x1="200" y1="50" x2="50" y2="200" stroke="black" strokeWidth="1.5" />
          <line x1="200" y1="50" x2="350" y2="200" stroke="black" strokeWidth="1.5" />
          <line x1="50" y1="200" x2="200" y2="350" stroke="black" strokeWidth="1.5" />
          <line x1="200" y1="350" x2="350" y2="200" stroke="black" strokeWidth="1.5" />

          {/* HOUSE NUMBERS (ROTATED BY ASCENDANT) */}
          {housePositions.map((pos, index) => {
            const houseNumber = ((ascHouse - 1 + index) % 12) + 1;

            return (
              <text
                key={index}
                x={pos.x}
                y={pos.y}
                fontSize="14"
                fill="black"
                fontWeight="bold"
              >
                {houseNumber}
              </text>
            );
          })}

          {/* PLANETS */}
          {planetList.map((p, idx) => {
            if (!p.house) return null;

            const basePos = planetPositions[p.house - 1];

            // MULTIPLE PLANETS IN SAME HOUSE = STACK
            const sameHouse = planetList.filter(x => x.house === p.house);
            const offset = sameHouse.findIndex(x => x.name === p.name) * 14;

            return (
              <text
                key={idx}
                x={basePos.x}
                y={basePos.y + offset}
                fontSize="11"
                fontWeight="bold"
                fill="black"
              >
                {p.hindi}
              </text>
            );
          })}
        </svg>
      </div>

    </div>
  );
}
