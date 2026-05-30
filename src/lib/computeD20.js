


/**
 * Calculates the Vimshamsha (D20) Chart positions.
 * Divides each zodiac sign into 20 equal divisions of 1°30' (1.5 degrees) each.
 * Starting sign depends on the modality of the original rashi:
 * - Movable (Chara): Starts from Aries (0)
 * - Fixed (Sthira): Starts from Sagittarius (8)
 * - Dual (Dvisvabhava): Starts from Leo (4)
 * 
 * @param {Object} kundali - The raw Kundali input containing ascendant and planets
 * @returns {Object|null} The calculated D20 chart object
 */
export function computeD20Chart(kundali) {
    if (!kundali) return null;

    const asc = kundali.ascendant;
    const planets = kundali.planets;

    const d20 = {
        ascendant: {},
        planets: {}
    };

    // 30 degrees / 20 divisions = 1.5 degrees per division (1° 30')
    const VIMSHAMSHA_SIZE = 30 / 20; 

    // Helper to calculate which division (0 to 19) the planet falls into
    const getVimshamshaIndex = (deg) => Math.floor(deg / VIMSHAMSHA_SIZE);

    // Core rule logic for D20 mapping
    const getD20Rashi = (rashiIndex, ansh) => {
        const vIdx = getVimshamshaIndex(ansh);

        const chara = [0, 3, 6, 9];    // Aries, Cancer, Libra, Capricorn
        const sthira = [1, 4, 7, 10];  // Taurus, Leo, Scorpio, Aquarius
        const dual = [2, 5, 8, 11];    // Gemini, Virgo, Sagittarius, Pisces

        let start;

        if (chara.includes(rashiIndex)) {
            start = 0; // Movable signs start counting from Aries (Index 0)
        } else if (sthira.includes(rashiIndex)) {
            start = 8; // Fixed signs start counting from Sagittarius (Index 8)
        } else if (dual.includes(rashiIndex)) {
            start = 4; // Dual signs start counting from Leo (Index 4)
        }

        return (start + vIdx) % 12;
    };

    // Obtains the remainder arc within the specific D20 division slice
    const getD20Degree = (ansh) => {
        return ansh % VIMSHAMSHA_SIZE;
    };

    // Element mapping for individual signs
    const tattvaMap = {
        0: "अग्नि",  1: "पृथ्वी", 2: "वायु",  3: "जल",
        4: "अग्नि",  5: "पृथ्वी", 6: "वायु",  7: "जल",
        8: "अग्नि",  9: "पृथ्वी", 10: "वायु", 11: "जल"
    };

    // 1. CALCULATE D20 ASCENDANT
    const ascRashiIndex = asc.rashiIndex;
    const ascD20RashiIndex = getD20Rashi(ascRashiIndex, asc.ansh);

    d20.ascendant = {
        rashiIndex: ascD20RashiIndex,
        rashi: ascD20RashiIndex, 
        house: 1
    };

    // 2. CALCULATE D20 PLANETS
    for (const [name, p] of Object.entries(planets)) {
        const rashiIndex = p.rashiIndex;
        const ansh = p.ansh;

        const d20Rashi = getD20Rashi(rashiIndex, ansh);
        const d20Degree = getD20Degree(ansh);

        // Calculate relative house index (1-mapped) using the D20 Ascendant as reference
        const house = ((d20Rashi - ascD20RashiIndex + 12) % 12) + 1;

        d20.planets[name] = {
            rashiIndex: d20Rashi,
            degree: d20Degree,
            tatva: tattvaMap[d20Rashi],
            house
        };
    }

    return d20;
}