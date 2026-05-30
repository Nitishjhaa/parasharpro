export function computeD10Chart(kundali) {
    if (!kundali) return null;

    const asc = kundali.ascendant;
    const planets = kundali.planets;

    const d10 = {
        ascendant: {},
        planets: {}
    };

    const DASHAMSHA_SIZE = 30 / 10; // 3°

    const getDashamshaIndex = (deg) =>
        Math.floor(deg / DASHAMSHA_SIZE);

    const getD10Rashi = (rashiIndex, ansh) => {
        const dashamshaIdx = getDashamshaIndex(ansh);

        const isOddSign =
            [0, 2, 4, 6, 8, 10].includes(rashiIndex);

        const start = isOddSign
            ? rashiIndex
            : (rashiIndex + 8) % 12;

        return (start + dashamshaIdx) % 12;
    };

    const getD10Degree = (ansh) => {
        return ansh % DASHAMSHA_SIZE;
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

    const ascD10RashiIndex = getD10Rashi(
        asc.rashiIndex,
        asc.ansh
    );

    d10.ascendant = {
        rashiIndex: ascD10RashiIndex,
        rashi: ascD10RashiIndex,
        house: 1
    };

    for (const [name, p] of Object.entries(planets)) {
        const d10Rashi = getD10Rashi(
            p.rashiIndex,
            p.ansh
        );

        const d10Degree = getD10Degree(p.ansh);

        const house =
            ((d10Rashi - ascD10RashiIndex + 12) % 12) + 1;

        d10.planets[name] = {
            rashiIndex: d10Rashi,
            degree: d10Degree,
            tatva: tattvaMap[d10Rashi],
            house
        };
    }

    return d10;
}