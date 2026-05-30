/**
 * Calculates the Shashtyamsa (D60) Chart positions.
 * Divides each zodiac sign into 60 equal divisions of 30' (0.5 degrees) each.
 * The mapping rule for any sign starts counting from the sign itself:
 * Formula: (Original Rashi Index + Shashtyamsa Division Index) % 12
 * 
 * @param {Object} kundali - The raw Kundali input containing ascendant and planets
 * @returns {Object|null} The calculated D60 chart object
 */
export function computeD60Chart(kundali) {
    if (!kundali) return null;

    const asc = kundali.ascendant;
    const planets = kundali.planets;

    const d60 = {
        ascendant: {},
        planets: {}
    };

    // 30 degrees / 60 divisions = 0.5 degrees per division (30 minutes of arc)
    const D60_SIZE = 30 / 60; 

    // Helper to calculate which of the 60 slices the planet lands inside (0 to 59)
    const getD60Index = (deg) => Math.floor(deg / D60_SIZE);

    const getD60Rashi = (rashiIndex, ansh) => {
        const dIdx = getD60Index(ansh);
        
        // Counting starts from the sign itself, cycling through all 12 signs
        return (rashiIndex + dIdx) % 12;
    };

    const getD60Degree = (ansh) => {
        return ansh % D60_SIZE;
    };

    const tattvaMap = {
        0: "अग्नि",  1: "पृथ्वी", 2: "वायु",  3: "जल",
        4: "अग्नि",  5: "पृथ्वी", 6: "वायु",  7: "जल",
        8: "अग्नि",  9: "पृथ्वी", 10: "वायु", 11: "जल"
    };

    // 1. CALCULATE D60 ASCENDANT
    const ascRashiIndex = asc.rashiIndex;
    const ascD60RashiIndex = getD60Rashi(ascRashiIndex, asc.ansh);

    d60.ascendant = {
        rashiIndex: ascD60RashiIndex,
        rashi: ascD60RashiIndex, 
        house: 1
    };

    // 2. CALCULATE D60 PLANETS
    for (const [name, p] of Object.entries(planets)) {
        const rashiIndex = p.rashiIndex;
        const ansh = p.ansh;

        const d60Rashi = getD60Rashi(rashiIndex, ansh);
        const d60Degree = getD60Degree(ansh);

        // Find house offset relative to D60 Ascendant
        const house = ((d60Rashi - ascD60RashiIndex + 12) % 12) + 1;

        d60.planets[name] = {
            rashiIndex: d60Rashi,
            degree: d60Degree,
            tatva: tattvaMap[d60Rashi],
            house
        };
    }

    return d60;
}