import { MhahPanchang } from 'mhah-panchang'

export default function getPanchangDetails(birthDate, birthTime, lat, lon) {

     if (!birthDate || !birthTime) {
        return { error: "Invalid date or time" };
    }

    const panchang = new MhahPanchang();
    const date = new Date(`${birthDate}T${birthTime}`);
    const panchangDetails = panchang.calendar(date, lat, lon);

    // Extract Amanta month
    const amantaMonth = panchangDetails.Masa.name_en_IN;

    // Extract other details
    const paksha = panchangDetails.Paksha.name_en_IN;
    const tithiName = panchangDetails.Tithi.name_en_IN;
    const karna = panchangDetails.Karna.name_en_IN;
    const yoga = panchangDetails.Yoga.name_en_IN;
    const guna = panchangDetails.Guna.name_en_IN;
    const gana = panchangDetails.Gana.name_en_IN;
    const ritu = panchangDetails.Ritu.name_en_UK;

    const rituNameInHindi = (ritu) => {
        switch (ritu) {
            case 'Spring':
                return 'वसंत';
            case 'Summer':
                return 'ग्रीष्म';
            case 'Monsoon':
                return 'मानसून';
            case 'Autumn':
                return 'शरद';
            case 'Pre-Winter':
                return 'हेमंत';
            case 'Winter':
                return 'शीत';
            default:
                return 'अज्ञात'; // Unknown case
        }
    };


    // Tithi sequence from MhahPanchang
    const tithiList = [
        'Padyami', 'Vidhiya', 'Thadiya', 'Chavithi', 'Panchami', 'Shasti', 'Sapthami', 'Ashtami',
        'Navami', 'Dasami', 'Ekadasi', 'Dvadasi', 'Trayodasi', 'Chaturdasi', 'Punnami', // 14 (Full Moon)
        'Padyami', 'Vidhiya', 'Thadiya', 'Chaviti', 'Panchami', 'Shasti', 'Sapthami', 'Ashtami',
        'Navami', 'Dasami', 'Ekadasi', 'Dvadasi', 'Trayodasi', 'Chaturdasi', 'Amavasya' // 29 (New Moon)
    ];

    // Hindu months in Amanta system
    const months = [
        'Baisakha', 'Jyestha', 'Asadha', 'Srabana',
        'Bhadraba', 'Aswina', 'Karttika', 'Margasira',
        'Pausa', 'Magha', 'Phalguna', 'Chaitra'
    ];

    const hindiMonths = (month) => {
        switch (month) {
            case 'Baisakha':
                return 'वैशाख';
            case 'Jyestha':
                return 'ज्येष्ठ';
            case 'Asadha':
                return 'आषाढ़';
            case 'Srabana':
                return 'श्रावण';
            case 'Bhadraba':
                return 'भाद्रपद';
            case 'Aswina':
                return 'अश्विन';
            case 'Karttika':
                return 'कार्तिक';
            case 'Margasira':
                return 'मार्गशीर्ष';
            case 'Pausa':
                return 'पौष';
            case 'Magha':
                return 'माघ';
            case 'Phalguna':
                return 'फाल्गुन';
            case 'Chaitra':
                return 'चैत्र';
            default:
                return 'अज्ञात'; // Unknown case
        }
    };


    // Find the Tithi index
    const tithiIndex = tithiList.indexOf(tithiName);

    // Convert Amanta month to Purnimanta month
    const convertToPurnimanta = (amantaMonth, tithiIndex) => {
        let monthIndex = months.indexOf(amantaMonth);
        if (monthIndex === -1) return "Unknown";

        // If Tithi is Purnima (Index 14) or Krishna Paksha (Index 15-29), shift back one month
        if (tithiIndex >= 14) {
            monthIndex = (monthIndex - 1 + 12) % 12;
        }

        return months[monthIndex];
    };

    const tithiInHindi = (tithiName) => {
        switch (tithiName) {
            case "Punnami":
                return "पूर्णिमा";
            case "Amavasya":
                return "अमावस्या";
            case "Padyami":
                return "प्रतिपदा";
            case "Vidhiya":
                return "द्वितीया";
            case "Thadiya":
                return "तृतीया";
            case "Chavithi":
            case "Chaviti":
                return "चतुर्थी";
            case "Panchami":
                return "पंचमी";
            case "Shasti":
                return "षष्ठी";
            case "Sapthami":
                return "सप्तमी";
            case "Ashtami":
                return "अष्टमी";
            case "Navami":
                return "नवमी";
            case "Dasami":
                return "दशमी";
            case "Ekadasi":
                return "एकादशी";
            case "Dvadasi":
                return "द्वादशी";
            case "Trayodasi":
                return "त्रयोदशी";
            case "Chaturdasi":
                return "चतुर्दशी";
            default:
                return tithiName; // Return the original if no match is found
        }
    };


    const pakshaInHindi = (paksha) => {
        switch (paksha) {
            case "Shukla":
                return "शुक्ल पक्ष";
            case "Krishna":
                return "कृष्ण पक्ष";
            default:
                return "अज्ञात"; // Unknown case
        }
    };

    const ganaInHindi = (gana) => {
        switch (gana) {
            case 'Devata':
                return "देव";
            case 'Manushya':
                return "मनुष्य";
            case 'Rakshasa':
                return "राक्षस"
        }
    }



    // Get the converted month
    const purnimantaMonth = tithiIndex !== -1 ? convertToPurnimanta(amantaMonth, tithiIndex) : "Unknown"

    return {
        ritu: rituNameInHindi(ritu),
        paksha: pakshaInHindi(paksha),
        tithi: { name: tithiInHindi(tithiName) },
        yoga,
        guna,
        gana: ganaInHindi(gana),
        amantaMonth,
        purnimantaMonth: hindiMonths(purnimantaMonth)
    };
};


