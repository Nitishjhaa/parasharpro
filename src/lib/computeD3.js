export function computeD2Chart(kundali) {
    if (!kundali) return null;

    const asc = kundali.ascendant;
    const planets = kundali.planets;

    const d2 = {
        ascendant: {},
        planets: {}
    };

    // D2 (HORA) rules
    const SUN_HORA = 4;   // Leo
    const MOON_HORA = 3;  // Cancer

    const getD2Rashi = (rashiIndex, ansh) => {
        const isOddSign = [0, 2, 4, 6, 8, 10].includes(rashiIndex);

        if (isOddSign) {
            // Odd signs
            return ansh < 15 ? SUN_HORA : MOON_HORA;
        } else {
            // Even signs
            return ansh < 15 ? MOON_HORA : SUN_HORA;
        }
    };

    const getD2Degree = (ansh) => {
        // Degree within each 15° Hora
        return ansh % 15;
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
    const ascD2Rashi = getD2Rashi(ascRashiIndex, asc.ansh);

    d2.ascendant = {
        rashiIndex: ascD2Rashi,
        rashi: ascD2Rashi,
        house: 1
    };

    // PLANETS
    for (const [name, p] of Object.entries(planets)) {
        const rashiIndex = p.rashiIndex;
        const ansh = p.ansh;

        const d2Rashi = getD2Rashi(rashiIndex, ansh);
        const d2Degree = getD2Degree(ansh);

        const house = ((d2Rashi - ascD2Rashi + 12) % 12) + 1;

        d2.planets[name] = {
            rashiIndex: d2Rashi,
            degree: d2Degree,
            tatva: tattvaMap[d2Rashi],
            house
        };
    }

    return d2;
}
