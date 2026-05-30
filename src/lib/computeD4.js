export function computeD4Chart(kundali) {
    if (!kundali) return null;

    const asc = kundali.ascendant;
    const planets = kundali.planets;

    const d4 = {
        ascendant: {},
        planets: {}
    };

    const CHATURTHAMSHA_SIZE = 30 / 4; // 7.5°

    const getChaturthamshaIndex = (deg) =>
        Math.floor(deg / CHATURTHAMSHA_SIZE);

    const getD4Rashi = (rashiIndex, ansh) => {
        const part = getChaturthamshaIndex(ansh);

        const offsets = [0, 3, 6, 9];

        return (rashiIndex + offsets[part]) % 12;
    };

    const getD4Degree = (ansh) => {
        return ansh % CHATURTHAMSHA_SIZE;
    };

    const tattvaMap = {
        0: "अग्नि",
        1: "पृथ्वी",
        2: "वायु",
        3: "जल",
        4: "अग्नि",
        5: "पृथ्वी",
        6: "वायु",
        7: "जल",
        8: "अग्नि",
        9: "पृथ्वी",
        10: "वायु",
        11: "जल"
    };

    // ASCENDANT
    const ascRashiIndex = asc.rashiIndex;
    const ascD4RashiIndex = getD4Rashi(
        ascRashiIndex,
        asc.ansh
    );

    d4.ascendant = {
        rashiIndex: ascD4RashiIndex,
        rashi: ascD4RashiIndex,
        house: 1
    };

    // PLANETS
    for (const [name, p] of Object.entries(planets)) {
        const rashiIndex = p.rashiIndex;
        const ansh = p.ansh;

        const d4Rashi = getD4Rashi(
            rashiIndex,
            ansh
        );

        const d4Degree = getD4Degree(ansh);

        const house =
            ((d4Rashi - ascD4RashiIndex + 12) % 12) + 1;

        d4.planets[name] = {
            rashiIndex: d4Rashi,
            degree: d4Degree,
            tatva: tattvaMap[d4Rashi],
            house
        };
    }

    return d4;
}