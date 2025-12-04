export function computeD3Chart(kundali) {
    if (!kundali) return null;

    const asc = kundali.ascendant;
    const planets = kundali.planets;

    const d3 = {
        ascendant: {},
        planets: {}
    };

    const DREKKANA_SIZE = 30 / 3; // 10°

    const getDrekkanaIndex = (deg) => Math.floor(deg / DREKKANA_SIZE);

    const getD3Rashi = (rashiIndex, ansh) => {
        const drekIdx = getDrekkanaIndex(ansh); // 0, 1, or 2

        // The Drekkana Lords are:
        // Index 0 (0-10°): The sign itself (+0)
        // Index 1 (10-20°): The 5th sign (trine) (+4)
        // Index 2 (20-30°): The 9th sign (trine) (+8)

        let startRashiOffset = 0;
        if (drekIdx === 1) startRashiOffset = 4;
        if (drekIdx === 2) startRashiOffset = 8;

        return (rashiIndex + startRashiOffset) % 12;
    };

    const getD3Degree = (ansh) => {
        // Degree within the 10° Drekkana
        return ansh % DREKKANA_SIZE;
    };

    // Tattva map is consistent across all charts
    const tattvaMap = {
        0: "अग्नि", 1: "पृथ्वी", 2: "वायु", 3: "जल",
        4: "अग्नि", 5: "पृथ्वी", 6: "वायु", 7: "जल",
        8: "अग्नि", 9: "पृथ्वी", 10: "वायु", 11: "जल"
    };

    // ASCENDANT
    const ascRashiIndex = asc.rashiIndex;
    const ascD3RashiIndex = getD3Rashi(ascRashiIndex, asc.ansh);

    d3.ascendant = {
        rashiIndex: ascD3RashiIndex,
        rashi: ascD3RashiIndex,
        house: 1
    };

    // PLANETS
    for (const [name, p] of Object.entries(planets)) {
        const rashiIndex = p.rashiIndex;
        const ansh = p.ansh;

        const d3Rashi = getD3Rashi(rashiIndex, ansh);
        const d3Degree = getD3Degree(ansh);

        const house = ((d3Rashi - ascD3RashiIndex + 12) % 12) + 1;

        d3.planets[name] = {
            rashiIndex: d3Rashi,
            degree: d3Degree,
            tatva: tattvaMap[d3Rashi],
            house
        };
    }

    return d3;
}