export function computeD24Chart(kundali) {
    if (!kundali) return null;

    const asc = kundali.ascendant;
    const planets = kundali.planets;

    const d24 = {
        ascendant: {},
        planets: {}
    };

    const CHATURVIMSHAMSHA_SIZE = 30 / 24; // 1.25°

    const getChaturvimshamshaIndex = (deg) =>
        Math.floor(deg / CHATURVIMSHAMSHA_SIZE);

    const getD24Rashi = (rashiIndex, ansh) => {
        const d24Idx = getChaturvimshamshaIndex(ansh);

        const oddSigns = [0, 2, 4, 6, 8, 10];

        const start = oddSigns.includes(rashiIndex)
            ? 4  // Leo
            : 3; // Cancer

        return (start + d24Idx) % 12;
    };

    const getD24Degree = (ansh) => {
        return ansh % CHATURVIMSHAMSHA_SIZE;
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

    const ascD24RashiIndex = getD24Rashi(
        asc.rashiIndex,
        asc.ansh
    );

    d24.ascendant = {
        rashiIndex: ascD24RashiIndex,
        rashi: ascD24RashiIndex,
        house: 1
    };

    for (const [name, p] of Object.entries(planets)) {

        const d24Rashi = getD24Rashi(
            p.rashiIndex,
            p.ansh
        );

        const d24Degree = getD24Degree(
            p.ansh
        );

        const house =
            ((d24Rashi - ascD24RashiIndex + 12) % 12) + 1;

        d24.planets[name] = {
            rashiIndex: d24Rashi,
            degree: d24Degree,
            tatva: tattvaMap[d24Rashi],
            house
        };
    }

    return d24;
}