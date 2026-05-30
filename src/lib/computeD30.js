export function computeD30Chart(kundali) {
    if (!kundali) return null;

    const asc = kundali.ascendant;
    const planets = kundali.planets;

    const d30 = {
        ascendant: {},
        planets: {}
    };

    const getD30Rashi = (rashiIndex, ansh) => {

        const isOddSign =
            [0, 2, 4, 6, 8, 10].includes(rashiIndex);

        if (isOddSign) {

            if (ansh < 5) return 0;        // Aries
            if (ansh < 10) return 10;      // Aquarius
            if (ansh < 18) return 8;       // Sagittarius
            if (ansh < 25) return 2;       // Gemini

            return 6;                      // Libra

        } else {

            if (ansh < 5) return 1;        // Taurus
            if (ansh < 12) return 5;       // Virgo
            if (ansh < 20) return 11;      // Pisces
            if (ansh < 25) return 9;       // Capricorn

            return 7;                      // Scorpio
        }
    };

    const getD30Degree = (ansh, rashiIndex) => {

        const isOddSign =
            [0, 2, 4, 6, 8, 10].includes(rashiIndex);

        if (isOddSign) {

            if (ansh < 5) return ansh;
            if (ansh < 10) return ansh - 5;
            if (ansh < 18) return ansh - 10;
            if (ansh < 25) return ansh - 18;

            return ansh - 25;

        } else {

            if (ansh < 5) return ansh;
            if (ansh < 12) return ansh - 5;
            if (ansh < 20) return ansh - 12;
            if (ansh < 25) return ansh - 20;

            return ansh - 25;
        }
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

    const ascD30RashiIndex =
        getD30Rashi(
            asc.rashiIndex,
            asc.ansh
        );

    d30.ascendant = {
        rashiIndex: ascD30RashiIndex,
        rashi: ascD30RashiIndex,
        house: 1
    };

    for (const [name, p] of Object.entries(planets)) {

        const d30Rashi =
            getD30Rashi(
                p.rashiIndex,
                p.ansh
            );

        const d30Degree =
            getD30Degree(
                p.ansh,
                p.rashiIndex
            );

        const house =
            ((d30Rashi - ascD30RashiIndex + 12) % 12) + 1;

        d30.planets[name] = {
            rashiIndex: d30Rashi,
            degree: d30Degree,
            tatva: tattvaMap[d30Rashi],
            house
        };
    }

    return d30;
}