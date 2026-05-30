export function computeD40Chart(kundali) {
    if (!kundali) return null;

    const asc = kundali.ascendant;
    const planets = kundali.planets;

    const d40 = {
        ascendant: {},
        planets: {}
    };

    const KHAVEDAMSHA_SIZE = 30 / 40; // 0.75°

    const getKhavedamshaIndex = (deg) =>
        Math.floor(deg / KHAVEDAMSHA_SIZE);

    const getD40Rashi = (rashiIndex, ansh) => {
        const d40Idx = getKhavedamshaIndex(ansh);

        const isOddSign =
            [0, 2, 4, 6, 8, 10].includes(rashiIndex);

        const start = isOddSign
            ? 0   // Aries
            : 6;  // Libra

        return (start + d40Idx) % 12;
    };

    const getD40Degree = (ansh) => {
        return ansh % KHAVEDAMSHA_SIZE;
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

    const ascD40RashiIndex = getD40Rashi(
        asc.rashiIndex,
        asc.ansh
    );

    d40.ascendant = {
        rashiIndex: ascD40RashiIndex,
        rashi: ascD40RashiIndex,
        house: 1
    };

    for (const [name, p] of Object.entries(planets)) {

        const d40Rashi = getD40Rashi(
            p.rashiIndex,
            p.ansh
        );

        const d40Degree = getD40Degree(
            p.ansh
        );

        const house =
            ((d40Rashi - ascD40RashiIndex + 12) % 12) + 1;

        d40.planets[name] = {
            rashiIndex: d40Rashi,
            degree: d40Degree,
            tatva: tattvaMap[d40Rashi],
            house
        };
    }

    return d40;
}