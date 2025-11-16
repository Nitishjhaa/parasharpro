export function computeD9Chart(kundali) {
    if (!kundali) return null;

    const asc =  kundali?.raw?.ascendant;
    const planets = kundali?.raw?.planets;

    const d9 = {
        ascendant: {},
        planets: {}
    };

    const getNavamsaIndex = (degree) => {
        return Math.floor(degree / (30 / 9)); // 3°20' = 3.333...
    };

    const getD9Rashi = (rashiIndex, ansh) => {
        const navIdx = getNavamsaIndex(ansh);

        // Movable signs (Chara)
        const chara = [0, 3, 6, 9];

        // Fixed signs (Sthira)
        const sthira = [1, 4, 7, 10];

        // Dual signs (Dwiswabhava)
        const dual = [2, 5, 8, 11];

        let start;

        if (chara.includes(rashiIndex)) {
            // Starts from same sign
            start = rashiIndex;
        }
        else if (sthira.includes(rashiIndex)) {
            // Starts from 9th sign = +8
            start = (rashiIndex + 8) % 12;
        }
        else if (dual.includes(rashiIndex)) {
            // Starts from 5th sign = +4
            start = (rashiIndex + 4) % 12;
        }

        // Final D9 rashi
        return (start + navIdx) % 12;
    };

    // ASCENDANT
    const ascRashiIndex = asc.rashiIndex;
    const ascD9RashiIndex = getD9Rashi(ascRashiIndex, asc.ansh);

    d9.ascendant = {
        rashiIndex: ascD9RashiIndex,
        house: 1
    };

    // PLANETS
    for (const [name, p] of Object.entries(planets)) {
        const d9Rashi = getD9Rashi(p.rashiIndex, p.ansh);

        const house = ((d9Rashi - ascD9RashiIndex + 12) % 12) + 1;

        d9.planets[name] = {
            rashiIndex: d9Rashi,
            house
        };
    }

    return d9;
}
