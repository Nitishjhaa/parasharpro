export function computeD16Chart(kundali) {
    if (!kundali) return null;

    const asc = kundali.ascendant;
    const planets = kundali.planets;

    const d16 = {
        ascendant: {},
        planets: {}
    };

    const SHODASHAMSHA_SIZE = 30 / 16; // 1.875°

    const getShodashamshaIndex = (deg) =>
        Math.floor(deg / SHODASHAMSHA_SIZE);

    const getD16Rashi = (rashiIndex, ansh) => {
        const d16Idx = getShodashamshaIndex(ansh);

        const movable = [0, 3, 6, 9];
        const fixed = [1, 4, 7, 10];
        const dual = [2, 5, 8, 11];

        let start;

        if (movable.includes(rashiIndex)) {
            start = 0; // Aries
        }
        else if (fixed.includes(rashiIndex)) {
            start = 4; // Leo
        }
        else if (dual.includes(rashiIndex)) {
            start = 8; // Sagittarius
        }

        return (start + d16Idx) % 12;
    };

    const getD16Degree = (ansh) => {
        return ansh % SHODASHAMSHA_SIZE;
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
    const ascD16RashiIndex = getD16Rashi(
        asc.rashiIndex,
        asc.ansh
    );

    d16.ascendant = {
        rashiIndex: ascD16RashiIndex,
        rashi: ascD16RashiIndex,
        house: 1
    };

    // PLANETS
    for (const [name, p] of Object.entries(planets)) {

        const d16Rashi = getD16Rashi(
            p.rashiIndex,
            p.ansh
        );

        const d16Degree = getD16Degree(
            p.ansh
        );

        const house =
            ((d16Rashi - ascD16RashiIndex + 12) % 12) + 1;

        d16.planets[name] = {
            rashiIndex: d16Rashi,
            degree: d16Degree,
            tatva: tattvaMap[d16Rashi],
            house
        };
    }

    return d16;
}