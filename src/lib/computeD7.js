export function computeD7Chart(kundali) {
    if (!kundali) return null;

    const asc = kundali.ascendant;
    const planets = kundali.planets;

    const d7 = {
        ascendant: {},
        planets: {}
    };

    const SAPTAMSHA_SIZE = 30 / 7;

    const getSaptamshaIndex = (deg) =>
        Math.floor(deg / SAPTAMSHA_SIZE);

    const getD7Rashi = (rashiIndex, ansh) => {
        const saptamshaIdx = getSaptamshaIndex(ansh);

        const isOddSign = [0, 2, 4, 6, 8, 10].includes(rashiIndex);

        const start = isOddSign
            ? rashiIndex
            : (rashiIndex + 6) % 12;

        return (start + saptamshaIdx) % 12;
    };

    const getD7Degree = (ansh) => {
        return ansh % SAPTAMSHA_SIZE;
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
    const ascD7RashiIndex = getD7Rashi(
        ascRashiIndex,
        asc.ansh
    );

    d7.ascendant = {
        rashiIndex: ascD7RashiIndex,
        rashi: ascD7RashiIndex,
        house: 1
    };

    // PLANETS
    for (const [name, p] of Object.entries(planets)) {
        const rashiIndex = p.rashiIndex;
        const ansh = p.ansh;

        const d7Rashi = getD7Rashi(
            rashiIndex,
            ansh
        );

        const d7Degree = getD7Degree(ansh);

        const house =
            ((d7Rashi - ascD7RashiIndex + 12) % 12) + 1;

        d7.planets[name] = {
            rashiIndex: d7Rashi,
            degree: d7Degree,
            tatva: tattvaMap[d7Rashi],
            house
        };
    }

    return d7;
}