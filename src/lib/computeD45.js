export function computeD45Chart(kundali) {
    if (!kundali) return null;

    const asc = kundali.ascendant;
    const planets = kundali.planets;

    const d45 = {
        ascendant: {},
        planets: {}
    };

    const AKSHAVEDAMSHA_SIZE = 30 / 45; // 0.6666667°

    const getAkshavedamshaIndex = (deg) =>
        Math.floor(deg / AKSHAVEDAMSHA_SIZE);

    const getD45Rashi = (rashiIndex, ansh) => {
        const d45Idx = getAkshavedamshaIndex(ansh);

        const movable = [0, 3, 6, 9];
        const fixed = [1, 4, 7, 10];
        const dual = [2, 5, 8, 11];

        let start;

        if (movable.includes(rashiIndex)) {
            start = 0; // Aries
        } else if (fixed.includes(rashiIndex)) {
            start = 4; // Leo
        } else {
            start = 8; // Sagittarius
        }

        return (start + d45Idx) % 12;
    };

    const getD45Degree = (ansh) => {
        return ansh % AKSHAVEDAMSHA_SIZE;
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

    const ascD45RashiIndex = getD45Rashi(
        asc.rashiIndex,
        asc.ansh
    );

    d45.ascendant = {
        rashiIndex: ascD45RashiIndex,
        rashi: ascD45RashiIndex,
        house: 1
    };

    for (const [name, p] of Object.entries(planets)) {

        const d45Rashi = getD45Rashi(
            p.rashiIndex,
            p.ansh
        );

        const d45Degree = getD45Degree(
            p.ansh
        );

        const house =
            ((d45Rashi - ascD45RashiIndex + 12) % 12) + 1;

        d45.planets[name] = {
            rashiIndex: d45Rashi,
            degree: d45Degree,
            tatva: tattvaMap[d45Rashi],
            house
        };
    }

    return d45;
}