// export function computeD4Chart(kundali) {
//     if (!kundali) return null;

//     const asc = kundali.ascendant;
//     const planets = kundali.planets;

//     const d4 = {
//         ascendant: {},
//         planets: {}
//     };

//     const CHATURTHAMSHA_SIZE = 30 / 4; // 7.5°

//     const getChaturthamshaIndex = (deg) => Math.floor(deg / CHATURTHAMSHA_SIZE);

//     const getD4Rashi = (rashiIndex, ansh) => {
//         const quadIdx = getChaturthamshaIndex(ansh); // 0, 1, 2, or 3
        
//         // Define the nature of the signs (Chara, Sthira, Dwiswabhava)
//         const chara = [0, 3, 6, 9]; // Aries, Cancer, Libra, Capricorn
//         const sthira = [1, 4, 7, 10]; // Taurus, Leo, Scorpio, Aquarius
//         const dual = [2, 5, 8, 11]; // Gemini, Virgo, Sagittarius, Pisces

//         let startRashiIndex;

//         // Determine the starting Rashi based on the sign's nature
//         if (chara.includes(rashiIndex)) {
//             // Chara (Movable) signs start in the sign itself (+0)
//             startRashiIndex = rashiIndex; 
//         } else if (sthira.includes(rashiIndex)) {
//             // Sthira (Fixed) signs start in the 5th sign (+4)
//             startRashiIndex = (rashiIndex + 4) % 12;
//         } else if (dual.includes(rashiIndex)) {
//             // Dwiswabhava (Dual) signs start in the 9th sign (+8)
//             startRashiIndex = (rashiIndex + 8) % 12;
//         } else {
//             // Fallback (Should not happen)
//             startRashiIndex = 0;
//         }

//         // D4 Rashi is the starting Rashi + the quadrant index (0 to 3)
//         return (startRashiIndex + quadIdx) % 12;
//     };

//     const getD4Degree = (ansh) => {
//         // Degree within the 7.5° Chaturthamsha
//         return ansh % CHATURTHAMSHA_SIZE;
//     };

//     const tattvaMap = {
//         0: "अग्नि", 1: "पृथ्वी", 2: "वायु", 3: "जल",
//         4: "अग्नि", 5: "पृथ्वी", 6: "वायु", 7: "जल",
//         8: "अग्नि", 9: "पृथ्वी", 10: "वायु", 11: "जल"
//     };

//     // ASCENDANT
//     const ascRashiIndex = asc.rashiIndex;
//     const ascD4RashiIndex = getD4Rashi(ascRashiIndex, asc.ansh);

//     d4.ascendant = {
//         rashiIndex: ascD4RashiIndex,
//         rashi: ascD4RashiIndex,
//         house: 1
//     };

//     // PLANETS
//     for (const [name, p] of Object.entries(planets)) {
//         const rashiIndex = p.rashiIndex;
//         const ansh = p.ansh;

//         const d4Rashi = getD4Rashi(rashiIndex, ansh);
//         const d4Degree = getD4Degree(ansh);

//         const house = ((d4Rashi - ascD4RashiIndex + 12) % 12) + 1;

//         d4.planets[name] = {
//             rashiIndex: d4Rashi,
//             degree: d4Degree,
//             tatva: tattvaMap[d4Rashi],
//             house
//         };
//     }

//     return d4;
// }