// export function computeD9Chart(kundali) {
//     if (!kundali) return null;

//     // FIXED
//     const asc = kundali.ascendant;
//     const planets = kundali.planets;

//     const d9 = {
//         ascendant: {},
//         planets: {}
//     };

//     const getNavamsaIndex = (degree) => {
//         return Math.floor(degree / (30 / 9)); // 3°20'
//     };

//     const getD9Rashi = (rashiIndex, ansh) => {
//         const navIdx = getNavamsaIndex(ansh);

//         const chara = [0, 3, 6, 9];
//         const sthira = [1, 4, 7, 10];
//         const dual   = [2, 5, 8, 11];

//         let start;

//         if (chara.includes(rashiIndex)) {
//             start = rashiIndex;
//         } else if (sthira.includes(rashiIndex)) {
//             start = (rashiIndex + 8) % 12;
//         } else if (dual.includes(rashiIndex)) {
//             start = (rashiIndex + 4) % 12;
//         }

//         return (start + navIdx) % 12;
//     };

//     // ASCENDANT
//     const ascRashiIndex = asc.rashiIndex;
//     const ascD9RashiIndex = getD9Rashi(ascRashiIndex, asc.ansh);

//     d9.ascendant = {
//         rashiIndex: ascD9RashiIndex,
//         house: 1
//     };

//     // PLANETS
//     for (const [name, p] of Object.entries(planets)) {
//         const d9Rashi = getD9Rashi(p.rashiIndex, p.ansh);
//         const house = ((d9Rashi - ascD9RashiIndex + 12) % 12) + 1;

//         d9.planets[name] = {
//             rashiIndex: d9Rashi,
//             house
//         };
//     }

//     return d9;
// }

export function computeD9Chart(kundali) {
    if (!kundali) return null;

    const asc = kundali.ascendant;
    const planets = kundali.planets;

    const d9 = {
        ascendant: {},
        planets: {}
    };

    const NAVAMSA_SIZE = 30 / 9; // 3°20' = 3.333...

    const getNavamsaIndex = (deg) => Math.floor(deg / NAVAMSA_SIZE);

    const getD9Rashi = (rashiIndex, ansh) => {
        const navIdx = getNavamsaIndex(ansh);

        const chara = [0, 3, 6, 9];
        const sthira = [1, 4, 7, 10];
        const dual = [2, 5, 8, 11];

        let start;

        if (chara.includes(rashiIndex)) start = rashiIndex;
        else if (sthira.includes(rashiIndex)) start = (rashiIndex + 8) % 12;
        else if (dual.includes(rashiIndex)) start = (rashiIndex + 4) % 12;

        return (start + navIdx) % 12;
    };

    const getD9Degree = (ansh) => {
        const remainder = ansh % NAVAMSA_SIZE;
        return remainder;
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
    const ascD9RashiIndex = getD9Rashi(ascRashiIndex, asc.ansh);

    d9.ascendant = {
        rashiIndex: ascD9RashiIndex,
        rashi: ascD9RashiIndex,
        house: 1
    };

    // PLANETS
    for (const [name, p] of Object.entries(planets)) {
        const rashiIndex = p.rashiIndex;
        const ansh = p.ansh;

        const d9Rashi = getD9Rashi(rashiIndex, ansh);
        const d9Degree = getD9Degree(ansh);

        const house = ((d9Rashi - ascD9RashiIndex + 12) % 12) + 1;

        d9.planets[name] = {
            rashiIndex: d9Rashi,
            degree: d9Degree,
            tatva: tattvaMap[d9Rashi],
            house
        };
    }

    return d9;
}
