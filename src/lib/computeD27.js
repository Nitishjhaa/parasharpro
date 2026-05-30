export function computeD27Chart(kundali) {
    if (!kundali) return null;

    const asc = kundali.ascendant;
    const planets = kundali.planets;

    const d27 = {
        ascendant: {},
        planets: {}
    };

    const BHAMSHA_SIZE = 30 / 27;

    const getBhamshaIndex = (deg) =>
        Math.floor(deg / BHAMSHA_SIZE);

    const getD27Rashi = (rashiIndex, ansh) => {
        const d27Idx = getBhamshaIndex(ansh);

        const fire = [0, 4, 8];
        const earth = [1, 5, 9];
        const air = [2, 6, 10];
        const water = [3, 7, 11];

        let start;

        if (fire.includes(rashiIndex)) {
            start = 0; // Aries
        } else if (earth.includes(rashiIndex)) {
            start = 3; // Cancer
        } else if (air.includes(rashiIndex)) {
            start = 6; // Libra
        } else if (water.includes(rashiIndex)) {
            start = 9; // Capricorn
        }

        return (start + d27Idx) % 12;
    };

    const getD27Degree = (ansh) => {
        return ansh % BHAMSHA_SIZE;
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

    const ascD27RashiIndex = getD27Rashi(
        asc.rashiIndex,
        asc.ansh
    );

    d27.ascendant = {
        rashiIndex: ascD27RashiIndex,
        rashi: ascD27RashiIndex,
        house: 1
    };

    for (const [name, p] of Object.entries(planets)) {

        const d27Rashi = getD27Rashi(
            p.rashiIndex,
            p.ansh
        );

        const d27Degree = getD27Degree(
            p.ansh
        );

        const house =
            ((d27Rashi - ascD27RashiIndex + 12) % 12) + 1;

        d27.planets[name] = {
            rashiIndex: d27Rashi,
            degree: d27Degree,
            tatva: tattvaMap[d27Rashi],
            house
        };
    }

    return d27;
}