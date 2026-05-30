export function computeD12Chart(kundali) {
    if (!kundali) return null;

    const asc = kundali.ascendant;
    const planets = kundali.planets;

    const d12 = {
        ascendant: {},
        planets: {}
    };

    const DWADASHAMSHA_SIZE = 30 / 12; // 2.5°

    const getDwadashamshaIndex = (deg) =>
        Math.floor(deg / DWADASHAMSHA_SIZE);

    const getD12Rashi = (rashiIndex, ansh) => {
        const d12Idx = getDwadashamshaIndex(ansh);

        return (rashiIndex + d12Idx) % 12;
    };

    const getD12Degree = (ansh) => {
        return ansh % DWADASHAMSHA_SIZE;
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
    const ascD12RashiIndex = getD12Rashi(
        asc.rashiIndex,
        asc.ansh
    );

    d12.ascendant = {
        rashiIndex: ascD12RashiIndex,
        rashi: ascD12RashiIndex,
        house: 1
    };

    // PLANETS
    for (const [name, p] of Object.entries(planets)) {
        const d12Rashi = getD12Rashi(
            p.rashiIndex,
            p.ansh
        );

        const d12Degree = getD12Degree(p.ansh);

        const house =
            ((d12Rashi - ascD12RashiIndex + 12) % 12) + 1;

        d12.planets[name] = {
            rashiIndex: d12Rashi,
            degree: d12Degree,
            tatva: tattvaMap[d12Rashi],
            house
        };
    }

    return d12;
}