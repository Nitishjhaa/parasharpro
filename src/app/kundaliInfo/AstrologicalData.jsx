import { getHindiGrah } from '@/lib/grah'

// ---- RASHI FUNCTION ----
export const rashi = (rashiIndex) => {
    if (rashiIndex === undefined || rashiIndex === null) {
        return "rashi index not found";
    }

    const rashiHiName = {
        0: "मेष",
        1: "वृष",
        2: "मिथुन",
        3: "कर्क",
        4: "सिंह",
        5: "कन्या",
        6: "तुला",
        7: "वृश्चिक",
        8: "धनु",
        9: "मकर",
        10: "कुंभ",
        11: "मीन",
    };

    return rashiHiName[rashiIndex] ?? "invalid rashi index";
};

// ---- ANOTHER FUNCTION EXAMPLE ----
export const nakshatra = (nakIndex) => {
    const list = {
        0: "अश्विनी",
        1: "भरणी",
        2: "कृत्तिका",
        3: "रोहिणी",
        4: "मृगशिरा",
        5: "आर्द्रा",
        6: "पुनर्वसू",
        7: "पुष्य",
        8: "अश्लेषा",
        9: "मघा",
        10: "पूर्वाफाल्गुनी",
        11: "उत्तराफाल्गुनी",
        12: "हस्त",
        13: "चित्रा",
        14: "स्वाती",
        15: "विशाखा",
        16: "अनुराधा",
        17: "ज्येष्ठा",
        18: "मूला",
        19: "पूर्वाषाढ़ा",
        20: "उत्तराषाढ़ा",
        21: "श्रवण",
        22: "धनिष्ठा",
        23: "शतभिषा",
        24: "पूर्वाभाद्रपदा",
        25: "उत्तराभाद्रपदा",
        26: "रेवती",
    };

    return list[nakIndex] ?? "invalid nakshatra index";
};

// ---- ANOTHER FUNCTION EXAMPLE ----
export const planetName = (planetIndex) => {
    const planets = {
        0: "सूर्य",
        1: "चंद्र",
        2: "मंगल",
        3: "बुध",
        4: "गुरु",
        5: "शुक्र",
        6: "शनि",
        7: "राहु",
        8: "केतु",
    };

    return planets[planetIndex] ?? "invalid planet index";
};

// ---- ghaat chakra ----

export const getGhaatChakraByRashi = (rashiNumber, gender) => {
    const rashiList = [
        "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
        "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
    ];

    const ghaatChakar = []

    const ghaatChakraData = {
        "मेष": {
            घातमास: "कात्तिक", घाततिथि: "1, 6, 11", घातवार: "रविवार", घातनक्षत्र: "मघा",
            घातयोग: "विष्कुम्भ", घातकरण: "बव", प्रहर: "1", पुरुषराशि: "मेष", स्त्रीराशि: "मेष"
        },
        "वृषभ": {
            घातमास: "मार्गशीर्ष", घाततिथि: "5, 10, 15", घातवार: "शनिवार", घातनक्षत्र: "हस्त",
            घातयोग: "शुक्ल", घातकरण: "शकुनि", प्रहर: "4", पुरुषराशि: "कन्या", स्त्रीराशि: "धनु"
        },
        "मिथुन": {
            घातमास: "आषाढ", घाततिथि: "2, 7, 12", घातवार: "सोमवार", घातनक्षत्र: "स्वाति",
            घातयोग: "परिघ", घातकरण: "कौलव", प्रहर: "3", पुरुषराशि: "कुम्भ", स्त्रीराशि: "धनु"
        },
        "कर्क": {
            घातमास: "पोष", घाततिथि: "2, 7, 12", घातवार: "बुधवार", घातनक्षत्र: "अनुराधा",
            घातयोग: "व्याघात", घातकरण: "नाग", प्रहर: "1", पुरुषराशि: "सिंह", स्त्रीराशि: "मीन"
        },
        "सिंह": {
            घातमास: "ज्येष्ठ", घाततिथि: "3, 8, 13", घातवार: "शनिवार", घातनक्षत्र: "मूल",
            घातयोग: "धृति", घातकरण: "बव", प्रहर: "1", पुरुषराशि: "मकर", स्त्रीराशि: "वृश्चिक"
        },
        "कन्या": {
            घातमास: "भाद्रपद", घाततिथि: "5, 10, 15", घातवार: "शनिवार", घातनक्षत्र: "श्रवण",
            घातयोग: "शुक्ल", घातकरण: "कौलव", प्रहर: "1", पुरुषराशि: "मिथुन", स्त्रीराशि: "वृश्चिक"
        },
        "तुला": {
            घातमास: "माघ", घाततिथि: "4, 9, 14", घातवार: "गुरुवार", घातनक्षत्र: "शतभिषा",
            घातयोग: "शुक्ल", घातकरण: "तैतिल", प्रहर: "4", पुरुषराशि: "धनु", स्त्रीराशि: "मीन"
        },
        "वृश्चिक": {
            घातमास: "आष्विन", घाततिथि: "1, 6, 11", घातवार: "शुक्रवार", घातनक्षत्र: "रेवती",
            घातयोग: "व्यतिपात", घातकरण: "गर", प्रहर: "1", पुरुषराशि: "वृषभ", स्त्रीराशि: "धनु"
        },
        "धनु": {
            घातमास: "श्रावण", घाततिथि: "3, 8, 13", घातवार: "शुक्रवार", घातनक्षत्र: "भरणी",
            घातयोग: "वज्र", घातकरण: "तैतिल", प्रहर: "1", पुरुषराशि: "मीन", स्त्रीराशि: "कन्या"
        },
        "मकर": {
            घातमास: "वैशाख", घाततिथि: "4, 9, 14", घातवार: "मंगलवार", घातनक्षत्र: "रोहिणी",
            घातयोग: "वैघृति", घातकरण: "शकुनि", प्रहर: "4", पुरुषराशि: "सिंह", स्त्रीराशि: "वृश्चिक"
        },
        "कुंभ": {
            घातमास: "चैत्र", घाततिथि: "3, 8, 13", घातवार: "गुरुवार", घातनक्षत्र: "आर्द्रा",
            घातयोग: "गण्ड", घातकरण: "किंस्तुघ्न", प्रहर: "3", पुरुषराशि: "धनु", स्त्रीराशि: "मिथुन"
        },
        "मीन": {
            घातमास: "फाल्गुन", घाततिथि: "5, 10, 15", घातवार: "शुक्रवार", घातनक्षत्र: "आश्लेषा",
            घातयोग: "वज्र", घातकरण: "चतुष्पाद", प्रहर: "4", पुरुषराशि: "कुंभ", स्त्रीराशि: "कुंभ"
        }
    };

    const index = rashiNumber;

    const rashiName = rashiList[index];

    if (!rashiName || !ghaatChakraData[rashiName]) {
        return "Invalid Rashi number. It must be between 1 and 12.";
    }

    if (gender === 'Male') {
        ghaatChakar.push({
            घातमास: ghaatChakraData[rashiName].घातमास,
            घाततिथि: ghaatChakraData[rashiName].घाततिथि,
            घातवार: ghaatChakraData[rashiName].घातवार,
            घातनक्षत्र: ghaatChakraData[rashiName].घातनक्षत्र,
            घातयोग: ghaatChakraData[rashiName].घातयोग,
            घातकरण: ghaatChakraData[rashiName].घातकरण,
            प्रहर: ghaatChakraData[rashiName].प्रहर,
            पुरुषराशि: ghaatChakraData[rashiName].पुरुषराशि,
            स्त्रीराशि: ghaatChakraData[rashiName].स्त्रीराशि

        });

        return ghaatChakar;
    }

    else if (gender === 'Female') {
        ghaatChakar.push({
            घातमास: ghaatChakraData[rashiName].घातमास,
            घाततिथि: ghaatChakraData[rashiName].घाततिथि,
            घातवार: ghaatChakraData[rashiName].घातवार,
            घातनक्षत्र: ghaatChakraData[rashiName].घातनक्षत्र,
            घातयोग: ghaatChakraData[rashiName].घातयोग,
            घातकरण: ghaatChakraData[rashiName].घातकरण,
            प्रहर: ghaatChakraData[rashiName].प्रहर,
            पुरुषराशि: ghaatChakraData[rashiName].पुरुषराशि,
            स्त्रीराशि: ghaatChakraData[rashiName].स्त्रीराशि
        });

        return ghaatChakar;
    }
}

export const getMoonPaaye = (h) => {

    // Paaye by Moon house
    if (h === 1 || h === 6 || h === 11) return "सोना";
    if (h === 2 || h === 5 || h === 9) return "चाँदी";
    if (h === 3 || h === 7 || h === 10) return "ताँबा";
    if (h === 4 || h === 8 || h === 12) return "लोहा";

};

export const getNakPaaye = (nak) => {

    const goldPaaye = ['Revati', 'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira'];
    const silverPaaye = ['Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'PurvaPhalguni', 'UttaraPhalguni', 'Hasta', 'Chitra', 'Swati'];
    const copperPaaye = ['Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'PurvaAshadha', 'UttaraAshadha', 'Shravana', 'Dhanishta', 'Shatabhisha'];
    const IronPaaye = ['PurvaBhadrapada', 'UttaraBhadrapada'];

    // Paaye by Nakshatra
    if (goldPaaye.includes(nak)) return "सोना";
    if (silverPaaye.includes(nak)) return "चाँदी";
    if (copperPaaye.includes(nak)) return "ताँबा";
    if (IronPaaye.includes(nak)) return "लोहा";


};


export const getLords = (type, value) => {

    const rashiLords = {
        Aries: "Mars",
        Taurus: "Venus",
        Gemini: "Mercury",
        Cancer: "Moon",
        Leo: "Sun",
        Virgo: "Mercury",
        Libra: "Venus",
        Scorpio: "Mars",
        Sagittarius: "Jupiter",
        Capricorn: "Saturn",
        Aquarius: "Saturn",
        Pisces: "Jupiter"
    };

    const nakshatraLords = {
        Ashwini: "Ketu",
        Bharani: "Venus",
        Krittika: "Sun",
        Rohini: "Moon",
        Mrigashira: "Mars",
        Ardra: "Rahu",
        Punarvasu: "Jupiter",
        Pushya: "Saturn",
        Ashlesha: "Mercury",
        Magha: "Ketu",
        PurvaPhalguni: "Venus",
        UttaraPhalguni: "Sun",
        Hasta: "Moon",
        Chitra: "Mars",
        Swati: "Rahu",
        Vishakha: "Jupiter",
        Anuradha: "Saturn",
        Jyeshtha: "Mercury",
        Mula: "Ketu",
        PurvaAshadha: "Venus",
        UttaraAshadha: "Sun",
        Shravana: "Moon",
        Dhanishta: "Mars",
        Shatabhisha: "Rahu",
        PurvaBhadrapada: "Jupiter",
        UttaraBhadrapada: "Saturn",
        Revati: "Mercury"
    };

    if (type === "lagna" || type === "rashi") {
        return getHindiGrah(rashiLords[value]) || "Unknown";
    }

    if (type === "nakshatra") {
        return getHindiGrah(nakshatraLords[value]) || "Unknown";
    }

    return "Invalid type";
}

export const preditionOnDate = ({ birthDate }) => {

    const dateObj = new Date(birthDate)

    const day = dateObj.getDate();
    const months = dateObj.getMonth() + 1;

    const predition = []

    if ((months === 4 && day >= 14) || (months === 5 && day <= 14)) {
        predition.push({ type: "predition for 14/04 to 14/05", msg: `${day} तारीख को जन्मे जातक गौरवर्ण, बलवान, युद्ध में पीछे न हटने वाले, अधिक भ्रमणशील, ठाठ-बाठ से जीवन यापन करने वाले तथा पारिवारिक स्वभाव के होते हैं। ये व्यक्ति राज्य से लाभ प्राप्त करते हैं, छल-कपट से दूर, धैर्यशील, विद्वान, वैज्ञानिक विचारों वाले, बुद्धिमान होते हैं और स्त्रियों से अधिक प्रभावित नहीं होते तथा ये अपनी मेहनत से अधिकार और ख्याति अर्जित करते हैं।` })
    }
    if ((months === 5 && day >= 15) || (months === 6 && day <= 16)) {
        predition.push({ type: "predition for 15/05 to 16/06", msg: `${day} तारीख को जन्मे जातकों में आत्मविश्वास बहुत अधिक होता है। इन्हें वस्त्रों तथा सुगंधित वस्तुओं से लाभ प्राप्त होता है। अनेक मामलों में देखा गया है कि इनका अपनी पत्नी से तालमेल अच्छा नहीं बन पाता, जिससे घरेलू परिस्थितियाँ कष्टप्रद हो जाती हैं। ऐसे जातक लोकगीत, गीत-संगीत तथा वाद्ययंत्रों के शौकीन होते हैं, परंतु पाप कर्म करने से डरते हैं। इनकी आकृति शांत होती है, किंतु मस्तिष्क सदैव सक्रिय रहता है और उसमें हमेशा कुछ न कुछ चलता रहता है।` })
    }
    if ((months === 6 && day >= 15) || (months === 7 && day <= 15)) {
        predition.push({ type: "predition for 15/06 to 15/07", msg: `${day} तारीख को जन्मे जातक शिक्षा के क्षेत्र में विशेष ख्याति अर्जित करते हैं। ये या तो सर्जन, चिकित्सक अथवा इनसे संबंधित कार्य करते हैं। ये लेखन, चित्रकला आदि में भी विशेष रुचि रखते हैं और इन क्षेत्रों में निपुण भी होते हैं। इन्हें रहस्य या गूढ़ विज्ञान में भी रुचि होती है। सामान्यतः ये जातक अपना व्यवसाय करना अधिक पसंद करते हैं, किंतु अधिकांशतः जातक स्वतंत्र व्यवसाय नहीं कर पाते और अंततः इन्हें नौकरी ही करनी पड़ती है। ` })
    }
    if ((months === 7 && day >= 6) || (months === 8 && day <= 15)) {
        predition.push({ type: "predition for 06/07 to 15/08", msg: `${day} तारीख को जन्मे जातक उग्र स्वभाव के, कभी-कभी निरुत्साहित (discouraged) हो जाने वाले, जल यात्रा के प्रेमी, चंचल प्रकृति के तथा अपनी वस्तुओं का अत्यंत सावधानीपूर्वक उपयोग करने वाले तथा ये कानून के ज्ञाता होते हैं। सभी को समान दर्जा देते हैं। ये अपने कर्तव्यों को सर्वोपरि मानते हैं तथा परोपकारी स्वभाव के होते हैं।` })
    }
    if ((months === 8 && day >= 12) || (months === 9 && day <= 15)) {
        predition.push({ type: "predition for 12/08 to 15/09", msg: `${day} तारीख को जन्मे जातक बलवान, अत्यंत उत्साही, किंतु क्रोधी प्रवृत्ति के होते हैं। ये उद्यमी, तेजस्वी, स्वाभिमानी होते हैं और अकेले में रहना पसंद करते हैं। वन एवं पर्वत क्षेत्रों में ये अत्यधिक आनंद का अनुभव करते हैं। ये आध्यात्मिक विषयों में रुचि रखने वाले, आत्मविश्वास से परिपूर्ण, मित्रों की सहायता करने वाले तथा सम्मान प्राप्त करने वाले व्यक्ति बनते हैं। इन्हें गायों से विशेष लगाव होता है।` })
    }
    if ((months === 9 && day >= 16) || (months === 10 && day <= 15)) {
        predition.push({ type: "predition for 16/09 to 15/10", msg: `${day} तारीख को जन्मे जातक भाषा से संबंधित कार्यों में संलग्न ,तथा कला प्रिय होते हैं। इनकी स्मरण शक्ति अत्यंत तीव्र होती है तथा प्रत्येक विषय पर इनके पास तर्क होते हैं। ये प्रायः परिवार की किसी विशेष चिंता से ग्रसित रहते हैं। इनकी पत्नी का स्वास्थ्य अक्सर खराब रहता है। ये स्वयं अनुशासनप्रिय होते हैं, और कई जातकों का शरीर कोमल   होता है। इन्हें पेट से संबंधित विशेष समस्याएँ भी बनी रहती हैं।` })
    }
    if ((months === 10 && day >= 16) || (months === 11 && day <= 15)) {
        predition.push({ type: "predition for 16/10 to 15/11", msg: `${day} तारीख को जन्मे जातक ऐसे जातकों को प्रायः आत्मिक असंतोष बना रहता है तथा इनकी चेतना निम्न स्तर के विचारों की ओर आकृष्ट होती है। जीवन में पितृ सुख अल्प मात्रा में प्राप्त होता है, और कई बार पिता के प्रति मन में विरोध अथवा द्वेष की भावना उत्पन्न हो जाती है।ये जातक अनुचित कार्यों की ओर प्रवृत्त हो सकते हैं तथा स्वभाव से मलिनचित्त, हीन आचरण वाले तथा संतानों की ओर से चिंतित रहने वाले होते हैं। संगीत के प्रति इनका गहरा लगाव देखा गया है, परंतु ये पैतृक सम्मान व सत्ता के क्षरण के कारण मानसिक द्वंद्व का अनुभव करते हैं।इनकी प्रवृत्ति कई बार मदिरा व नशीली वस्तुओं के निर्माण या उपभोग की ओर झुकाव रखती है। स्वभाव से कभी-कभी झगड़ालू, अस्थिर विचारों वाले, तथा कामुक प्रवृत्ति के हो सकते हैं। विपरीत लिंग के प्रभाव में आकर ये कठिनाइयों व विवादों में भी फँस सकते हैं।इनके मन में निरंतर बेचैनी बनी रहती है, तथा विदेशी भूमि या प्रवास के प्रति आकर्षण रहता है। ये साथियों की सहायता करने में अग्रणी होते हैं। मानसिक द्वंद्व से पीड़ित रहने पर भी अपने शत्रुओं पर विजय पाने की क्षमता रखते हैं।हालाँकि प्रत्येक कार्य को आरंभ करने में इनमें एक प्रकार की हिचकिचाहट होती है, परंतु विपरीत लिंग के प्रति आकर्षण की तीव्रता इन्हें कई बार मानसिक रूप से व्यथित कर देती है।` })
    }
    if ((months === 11 && day >= 16) || (months === 12 && day <= 16)) {
        predition.push({ type: "predition for 16/11 to 16/12", msg: `${day} तारीख को जन्मे जातक समाज में सम्मान प्राप्त करते हैं। यद्यपि वे स्वभावतः लोभी हो सकते हैं, किंतु उनमें गूढ़ ज्ञान और चिकित्सा विज्ञान के प्रति गहरी रुचि पाई जाती है। गुप्त रोगों से पीड़ित रहने की संभावना भी इनमें देखी गई है।ये जातक साहसी होते हैं और प्रत्येक कार्य को निर्भीकतापूर्वक करने की क्षमता रखते हैं। इनके स्वभाव में उग्रता होती है, किंतु साथ ही ये अत्यंत उद्यमी और पराक्रमी सिद्ध होते हैं। धनार्जन के लिए विषैली या मादक वस्तुओं का निर्माण अथवा व्यापार भी कर सकते हैं।ये लोग स्वभावतः चतुर, चालाक और रहस्यप्रिय होते हैं, और इनमें जासूसी, अभियंत्रण (इंजीनियरिंग), लेखन, चिकित्सा, क्रांतिकारी गतिविधियों अथवा कभी-कभी अश्लील साहित्य रचना की प्रवृत्तियाँ भी पाई जाती हैं। इनका जीवन साहस, संघर्ष और मानसिक तीव्रता से भरा होता है।` })
    }
    if ((months === 12 && day >= 15) || (months === 1 && day <= 14)) {
        predition.push({ type: "predition for 15/12 to 14/01", msg: `${day} तारीख को जन्मे जातक उच्च स्तरीय जीवनशैली के अभिलाषी होते हैं। वे भोग-विलासप्रिय होते हुए भी स्वभावतः सज्जन, व्यवहार-कुशल तथा धार्मिक प्रवृत्ति के होते हैं। सरकार अथवा शासन तंत्र द्वारा सम्मानित होने की संभावनाएँ इनके जीवन में प्रबल होती हैं। ये जातक शिल्प, तकनीक, अथवा चिकित्सा जैसे क्षेत्रों में विशेष दक्षता रखते हैं और ख्याति प्राप्ति की तीव्र इच्छा इनमें निहित रहती है।उत्साह एवं निष्कपटता इनके स्वभाव की विशेषताएँ होती हैं, किंतु वैवाहिक जीवन में मतभेद की स्थिति उत्पन्न हो सकती है — विशेषकर पति-पत्नी के विचारों में विरोध के कारण। जातक योग-मार्ग के अनुयायी, आस्तिक विचारधारा के पोषक, तथा साधु-संतों की सेवा में रत रहने वाले होते हैं। इन्हें समाज में सम्मान, प्रतिष्ठा एवं धार्मिक-आध्यात्मिक जगत में आदर प्राप्त होता है।` })
    }
    if ((months === 1 && day >= 15) || (months === 2 && day <= 14)) {
        predition.push({ type: "predition for 15/1 to 15/02", msg: `${day} तारीख को जन्मे जातक झगड़ालू स्वभाव के, उदंड प्रवृत्ति वाले तथा लोभवश अनुचित कार्य करने की ओर प्रवृत्त पाए जाते हैं। ये चंचल चित्त, वाचाल तथा कई बार दुराचार की प्रवृत्तियों से ग्रसित होते हैं। जीवन में इन्हें प्रायः छोटी स्तर की आजीविका प्राप्त होती है और शिक्षा का स्तर भी सीमित ही रहता है।ये जातक लघु व्यापार, दैनिक वस्तुओं के क्रय-विक्रय या स्वल्प स्तर के कारोबार में संलग्न होते हैं तथा दूसरों से धन प्राप्त करने की लालसा इनमें बनी रहती है। यद्यपि चित्त से सतर्क होते हैं, किंतु आचरण में गिरावट और निंदनीय प्रवृत्तियाँ भी देखी जाती हैं।परन्तु इनके भीतर परोपकार की भावना भी विद्यमान रहती है — ये दूसरों की उन्नति देखकर प्रसन्न होते हैं। विनोदी स्वभाव के होते हैं और अपने परिजनों की अपेक्षा बाहरी लोगों के बीच अधिक सुखी रहते हैं। यह भी देखा गया है कि इनके पिता प्रायः अल्पायु होते हैं, अथवा यदि जीवित रहते हैं तो उनके साथ आत्मीय संबंधों में मतभेद और मानसिक दूरी बनी रहती है। पिता से विशेष लाभ की संभावना कम होती है, और परस्पर विचारों में असमानता जीवन भर बनी रह सकती है।` })
    }
    if ((months === 2 && day >= 15) || (months === 3 && day <= 14)) {
        predition.push({ type: "predition for 15/2 to 14/03", msg: `${day} तारीख को जन्मे जातक को जीवन में धनाभाव, मानसिक तनाव और हृदय संबंधी रोगों की संभावना बनी रहती है। अतः जातक को किसी-न-किसी विशेष कार्य में कुशल, प्रतिभाशाली या हुनरमंद अवश्य बना देता है। चारित्रिक दृष्टिकोण से ऐसे जातक अक्सर स्वार्थी, मित्रों से विश्वासघात करने वाले, संशयी, और कभी-कभी गूढ़ विद्याओं जैसे—तंत्र-मंत्र, रहस्यवादी विषयों) में गहरी रुचि रखने वाले होते हैं। इनकी प्रवृत्ति में विद्रोही विचारधारा, सामाजिक ढाँचों से टकराव और निम्नवर्गीय या दुर्भाग्यशाली लोगों के साथ जुड़ाव की प्रवृत्ति भी देखी गई है। हालाँकि, इनमें विशिष्ट मानसिक क्षमता, विश्लेषणात्मक दृष्टि, और पारंपरिक सीमाओं को चुनौती देने का साहस भी होता है — जिससे ये कभी-कभी समाज में विशिष्ट पहचान बना लेते हैं।` })
    }
    if ((months === 3 && day >= 15) || (months === 4 && day <= 13)) {
        predition.push({ type: "predition for 15/3 to 13/4", msg: `${day} तारीख को जन्मे जातक सामान्यतः ज्ञानी, विवेकी, स्थिर चित्त और बुद्धिमान होते हैं। ये अपने भाग्य के निर्माता स्वयं बनते हैं तथा जीवन में प्रगति हेतु कर्मशील रहते हैं। इनके जीवन में श्वसुर पक्ष (ससुराल) से धन प्राप्ति की प्रबल संभावना होती है। ऐसे जातक प्रायः आयात-निर्यात (इम्पोर्ट-एक्सपोर्ट), जल से संबंधित वस्तुएँ जैसे सिंघाड़ा, मोती, अथवा समुद्री उत्पादों से धन लाभ प्राप्त करते हैं। इनका मन धार्मिक प्रवृत्ति का होता है, इन्हें स्त्रियों द्वारा आदर एवं सम्मान भी प्राप्त होता है।` })
    }

    return predition
}


export const checkManglik = (marsHouse) => {
    const manglikHouses = [1, 4, 7, 8, 12];
    const isManglik = manglikHouses.includes(marsHouse);

    if (isManglik) {
        return {
            type: "मंगलीक",
            status: "कुंडली में मांगलिक दोष है",
            definition: "मांगलिक दोष वैदिक ज्योतिष में तब बनता है जब मंगल ग्रह व्यक्ति की जन्म कुंडली के प्रथम, चतुर्थ, सप्तम, अष्टम या द्वादश भाव में स्थित होता है। यह दोष विवाहिक जीवन पर प्रभाव डाल सकता है। इस स्थिति में जन्म लेने वाले व्यक्ति को 'मांगलिक' कहा जाता है।"
        };
    } else {
        return {
            type: "मंगलीक नहीं",
            status: "कुंडली में मंगलीक दोष नहीं है",
            definition: "जिन लोगों की कुंडली में मंगल ग्रह 1, 4, 7, 8 या 12वें भाव में नहीं होता, उन्हें मांगलिक दोष रहित माना जाता है।"
        };
    }
};

export const cheakMool = (moonNakName, charan) => {
    const moolNakshatraDefinitions = {
        "Ashwini": {
            1: "अश्विनी नक्षत्र के पहले चरण में जन्म लेने पर पिता को कष्ट और धनहानि होती है",
            2: "अश्विनी नक्षत्र के दूसरे चरण में जन्म लेने पर जातक को स्वास्थ्य संबंधित समस्याएँ हो सकती है और ज़्यादा ख़र्चा होता है।",
            3: "अश्विनी नक्षत्र के तीसरे चरण में जन्म व्यक्ति के और पिता को आकस्मिक यात्रा करनी पड़ती है।",
            4: "अश्विनी नक्षत्र के चौथे चरण में जन्म से करियर में बाधाएँ संभव हैं।"
        },
        "Ashlesha": {
            1: "आश्लेषा नक्षत्र के पहले चरण में जन्म लेने से जातक को मानसिक तनाव का सामना करना पड़ सकता है।",
            2: "आश्लेषा नक्षत्र के दूसरे चरण में जन्म से पारिवारिक जीवन में कठिनाइयाँ आ सकती हैं।",
            3: "आश्लेषा नक्षत्र के तीसरे चरण में जन्म से माता-पिता के साथ मतभेद हो सकते हैं।",
            4: "आश्लेषा नक्षत्र के चौथे चरण में जन्म से स्वास्थ्य पर विशेष ध्यान देने की आवश्यकता होती है।"
        },
        "Magha": {
            1: "मघा नक्षत्र के पहले चरण में जन्म से जातक को पिता के साथ संबंधों में समस्या आ सकती है।",
            2: "मघा नक्षत्र के दूसरे चरण में जन्म लेने पर नौकरी में अस्थिरता हो सकती है।",
            3: "मघा नक्षत्र के तीसरे चरण में व्यवसायिक क्षेत्र में समस्याएँ हो सकती हैं।",
            4: "मघा नक्षत्र के चौथे चरण में जातक को संतान पक्ष से परेशानी हो सकती है।"
        },
        "Jyeshtha": {
            1: "ज्येष्ठा नक्षत्र के प्रथम चरण हो और मंगलवार भी उस दिन हो तो शिशु अपने बड़े भाई या स्त्री-जातक हो तो जेठ आदि के लिए घातक होता है। जन्म से मानसिक दबाव और संघर्ष देखने को मिल सकते हैं।",
            2: "ज्येष्ठा नक्षत्र के द्वितीय चरण में जन्म हो तो बड़े भाई या बहन अथवा मामा, चाचा को घातक, जातक को निर्णय लेने में कठिनाई हो सकती है।",
            3: "ज्येष्ठा नक्षत्र के तीसरे चरण में अगर जन्म हो तो पिता या माता को घातक होता है।।",
            4: "ज्येष्ठा नक्षत्र के चौथे चरण में जन्म हो तो भाग्यवान, परन्तु अपने स्वास्थ्य के लिए हानिकारक होता है।"
        },
        "Mula": {
            1: "मूल नक्षत्र के पहले चरण में जन्म से जीवन में अचानक परिवर्तन हो सकते हैं।",
            2: "मूल नक्षत्र के दूसरे चरण में व्यक्ति को बार-बार स्थान परिवर्तन का सामना करना पड़ सकता है।",
            3: "मूल नक्षत्र के तीसरे चरण में व्यवसायिक क्षेत्र में समस्याएँ हो सकती हैं।",
            4: "मूल नक्षत्र के चौथे चरण में जातक को संतान पक्ष से परेशानी हो सकती है।"
        },
        "Revati": {
            1: "रेवती नक्षत्र के पहले चरण में जन्म लेने से ऐश्वर्यवान और सुखी होता है ",
            2: "रेवती नक्षत्र के दूसरे चरण में जन्म लेने से जातक धनी और अधिकार संपन्न होता है",
            3: "रेवती नक्षत्र के तीसरे चरण में जन्म लेने से सुख और साधनों से युक्त होता है",
            4: "रेवती नक्षत्र के चौथे चरण में जन्म लेने से अनेक प्रकार के कष्ट होते हैं"
        }
    };

    if (moolNakshatraDefinitions[moonNakName]?.[charan]) {
        return {
            status: "गण्डमूल दोष उपस्थित",
            definition: moolNakshatraDefinitions[moonNakName][charan],
        };
    }

    else {
        return {
            status: "गण्डमूल दोष अनुपस्थित",
            definition: "गण्डमूल दोष अनुपस्थित"
        };
    }
};

export const cheakGuruChandaalYoga = (jupiterHousePosition, rahuHousePosition, ketuHousePosition) => {
    if (jupiterHousePosition === rahuHousePosition || jupiterHousePosition === ketuHousePosition) {
        return {
            status: "गुरु-चांडाल योग या चांडाल योग",
            definition: "वैदिक ज्योतिष में गुरु-चांडाल योग (या दोष) तब बनता है जब जन्म कुंडली में गुरु (बृहस्पति) का मेल राहु या केतु से हो जाता है। गुरु ज्ञान, समझ, नैतिकता और सही रास्ते का प्रतीक है, जबकि राहु-केतु भ्रम, लालच और असमंजस से जुड़े माने जाते हैं। जब ये ग्रह साथ होते हैं, तो व्यक्ति के जीवन में सही-गलत को पहचानने में उलझन आ सकती है। इंसान जानता तो है कि क्या सही है, लेकिन फिर भी गलत फैसलों, अनैतिक आकर्षणों या भटकाव की ओर खिंच सकता है। इसका असर सोच, करियर, रिश्तों और समाज में छवि पर पड़ सकता है। सरल शब्दों में, यह योग व्यक्ति के अंदर ज्ञान और भ्रम के बीच संघर्ष पैदा करता है, जिससे जीवन में बार-बार उलझनें और चुनौतियाँ सामने आ सकती हैं। इसमे जातक भगवान में काम मन्यता रखता है या अपने धर्म के विरुद्ध काम करता है।",
            remedies: "पक्षियों को रोज़ाना दाना पानी दे, यही गुरु-चांडाल योग का सबसे अच्छा उपाय है"

        }
    }
}

/**
 * Returns an array of house numbers in the arc from start to end (inclusive)
 * in a circular 1–12 system.
 *
 * @param {number} start - starting house (inclusive)
 * @param {number} end - ending house (inclusive)
 * @param {string} direction - "clockwise" or "anticlockwise"
 * @returns {number[]} - array of houses in the arc
 */
const getArc = (start, end, direction = "clockwise") => {
    const houses = [];
    let current = start;
    houses.push(current);
    if (direction === "clockwise") {
        while (current !== end) {
            current = current === 12 ? 1 : current + 1;
            houses.push(current);
        }
    } else if (direction === "anticlockwise") {
        while (current !== end) {
            current = current === 1 ? 12 : current - 1;
            houses.push(current);
        }
    }
    return houses;
};

/**
 * Checks whether every planet's house is within the arc.
 *
 * @param {number[]} arc - array of houses representing the arc.
 * @param {number[]} planetHouses - array of house numbers for planets.
 * @returns {boolean}
 */
const allPlanetsInArc = (arc, planetHouses) => {
    return planetHouses.every(house => arc.includes(house));
};

/**
 * Determines the Kaal Sarp Yog name based on planet positions and the provided mapping.
 *
 * Naming mapping (for full Kaal Sarp Yog):
 * - Rahu in 1, Ketu in 7 => "anant kaal-sarp yoga"
 * - Rahu in 2, Ketu in 8 => "Kulik kaal-sarp yoga"
 * - Rahu in 3, Ketu in 9 => "Vasuki kaal-sarp yoga"
 * - Rahu in 4, Ketu in 10 => "SankhPal kaal-sarp yoga"
 * - Rahu in 5, Ketu in 11 => "Padam kaal-sarp yoga"
 * - Rahu in 6, Ketu in 12 => "Mahapadam kaal-sarp yoga"
 * - Rahu in 7, Ketu in 1 => "Takshak kaal-sarp yoga"
 * - Rahu in 8, Ketu in 2 => "Karkotak kaal-sarp yoga"
 * - Rahu in 9, Ketu in 3 => "Sankhnaad kaal-sarp yoga"
 * - Rahu in 10, Ketu in 4 => "Paatak kaal-sarp yoga"
 * - Rahu in 11, Ketu in 5 => "Vishakt kaal-sarp yoga"
 * - Rahu in 12, Ketu in 6 => "Shesnaag kaal-sarp yoga"
 *
 * @param {number} sunHouse
 * @param {number} moonHouse
 * @param {number} marsHouse
 * @param {number} mercuryHouse
 * @param {number} jupiterHouse
 * @param {number} venusHouse
 * @param {number} saturnHouse
 * @param {number} rahuHouse
 * @param {number} ketuHouse
 * @returns {string} - If full Kaal Sarp Yog, returns the mapped name.
 *                     Otherwise returns "Aansik Kaal Sarp Yog".
 */
export const kaalSarpYog = (sunHouse, moonHouse, marsHouse, mercuryHouse, jupiterHouse, venusHouse, saturnHouse, rahuHouse, ketuHouse) => {
    // Collect planet positions.
    const planets = [sunHouse, moonHouse, marsHouse, mercuryHouse, jupiterHouse, venusHouse, saturnHouse];

    // Build both arcs between Rahu and Ketu.
    const clockwiseArc = getArc(rahuHouse, ketuHouse, "clockwise");
    const anticlockwiseArc = getArc(rahuHouse, ketuHouse, "anticlockwise");

    // Count planets in each arc
    const countInArc = (arc) => planets.filter(p => arc.includes(p)).length;
    const clockwiseCount = countInArc(clockwiseArc);
    const anticlockwiseCount = countInArc(anticlockwiseArc);

    // Determine which arc is the clutch (the one with more planets).
    let clutchArc;
    let clutchCount;
    if (clockwiseCount >= anticlockwiseCount) {
        clutchArc = clockwiseArc;
        clutchCount = clockwiseCount;
    } else {
        clutchArc = anticlockwiseArc;
        clutchCount = anticlockwiseCount;
    }

    // The number of planets outside the clutch:
    const outsideCount = planets.length - clutchCount;

    // Determine the result:
    // Full Kaal Sarp Yog: all planets are in one arc.
    if (outsideCount === 0) {
        const mapping = {
            '1-7': 'Anant Kaal-Sarp Yoga',
            '2-8': 'Kulik kaal-sarp yoga',
            '3-9': 'Vasuki kaal-sarp yoga',
            '4-10': 'SankhPal kaal-sarp yoga',
            '5-11': 'Padam kaal-sarp yoga',
            '6-12': 'Mahapadam kaal-sarp yoga',
            '7-1': 'Takshak kaal-sarp yoga',
            '8-2': 'Karkotak kaal-sarp yoga',
            '9-3': 'Sankhnaad kaal-sarp yoga',
            '10-4': 'Paatak kaal-sarp yoga',
            '11-5': 'Vishakt kaal-sarp yoga',
            '12-6': 'Shesnaag kaal-sarp yoga'
        };

        const key = `${rahuHouse}-${ketuHouse}`;
        return mapping[key] || "Kaal Sarp Yog / काल सर्प योग";
    };

    // Aansik Kaal Sarp Yog: exactly one planet is outside.
    if (outsideCount === 1) {
        return "Aansik Kaal Sarp Yog / आंशिक काल सर्प योग";
    }

    // No Kaal Sarp Yog: more than one planet is outside.
    return "No Kaal Sarp Yog / काल सर्प योग नहीं";
};


/**
 * computeAshtakavarga.js
 *
 * Usage:
 *   const res = computeAshtakavarga({
 *     positions: { sun:3, moon:8, mars:11, mercury:2, jupiter:7, venus:10, saturn:12, rahu:5 },
 *     lagna: 1, // optional, numeric 1..12
 *     includeNodes: true, // include rahu/ketu in SAV if provided
 *     customRules: { rahu: [ /* custom distance list */

const DEFAULT_RULES = {
    // NOTE: these are *common* classical-style rule sets used by many Ashtakavarga implementations.
    // If your app has different rule rules, pass `customRules` to override any planet key.
    sun: [1, 2, 4, 7, 8, 9, 10, 11],
    moon: [3, 6, 7, 8, 10, 11],
    mars: [3, 6, 10, 11],
    mercury: [2, 4, 6, 8, 10, 11],
    jupiter: [2, 5, 6, 9, 11],
    venus: [1, 2, 3, 4, 8, 9, 11],
    saturn: [3, 6, 11],
    // default placeholders for nodes (Rahu/Ketu). Many classical systems do not include Rahu/Ketu
    // in standard Ashtakavarga — but you asked for Rahu: provide here or override via customRules.
    rahu: [3, 6, 9, 11], // DEFAULT EXAMPLE — **override if your system uses different rules**
    ketu: [3, 6, 9, 11],
};

/** normalize sign to 1..12 */
function normSign(n) {
    let m = Number(n);
    if (!Number.isFinite(m)) throw new Error("sign must be number 1..12");
    m = ((m - 1) % 12) + 1;
    if (m <= 0) m += 12;
    return m;
}

/** returns distance 1..12 from planetSign -> targetSign (clockwise) */
function houseDistance(planetSign, targetSign) {
    const p = normSign(planetSign), t = normSign(targetSign);
    let d = t - p;
    if (d <= 0) d += 12;
    return d; // 1..12
}

/**
 * computeAshtakavarga
 * @param {Object} opts
 *   - positions: { sun:1..12, moon:1..12, mars:.. }  // required at least for planets you want
 *   - lagna: 1..12 (optional)
 *   - includeNodes: boolean (if true and rahu/ketu provided, include them in SAV)
 *   - customRules: { planetName: [distances...] } override defaults (very important for app parity)
 * @returns {Object} result with per-planet arrays, totals, sarvashtakavarga and chakra layout
 */
export function computeAshtakavarga({
    positions = {},
    lagna = null,
    includeNodes = false,
    customRules = {},
} = {}) {
    // merge rules: custom overrides defaults
    const RULES = { ...DEFAULT_RULES, ...(customRules || {}) };

    // planets to compute: use keys present in positions or in RULES (except ketu/rahu logic handled by includeNodes)
    const planetsToCompute = Object.keys(positions).filter(k => !!positions[k]);

    // ensure only valid planets (we'll compute for these)
    const planetaryTables = {}; // planet -> [12 bindus]
    const planetTotals = {}; // planet -> total bindus (0..12 normally)
    const DRAWER = []; // chakra rows: index 0..11 for sign 1..12

    // initialize chakra array (12 signs) with per-planet entries
    for (let i = 1; i <= 12; i++) {
        DRAWER[i - 1] = { sign: i, byPlanet: {} };
    }

    // compute each planetary ashtakavarga
    planetsToCompute.forEach((planet) => {
        const planetSign = normSign(positions[planet]);
        const rule = RULES[planet] || []; // allow missing rule -> zeroes

        const arr = [];
        for (let targetSign = 1; targetSign <= 12; targetSign++) {
            const dist = houseDistance(planetSign, targetSign); // 1..12
            const bindu = rule.includes(dist) ? 1 : 0;
            arr.push(bindu);
            DRAWER[targetSign - 1].byPlanet[planet] = bindu;
        }

        planetaryTables[planet] = arr;
        planetTotals[planet] = arr.reduce((s, v) => s + v, 0);
    });

    // Lagna Ashtakavarga (if lagna provided) - compute like a "planet" named 'lagna'
    let lagnaTable = null;
    if (lagna != null) {
        const lagnaSign = normSign(lagna);
        // standard practice: Lagna contribution is often computed by same rules as Moon or special table.
        // We'll compute using a simple "lagna-rule" approach: if customRules.lagna present use it,
        // else use moon's rule as default fallback (common approach in some softwares).
        const lagnaRule = customRules.lagna || RULES.lagna || RULES.moon || [];
        lagnaTable = [];
        for (let ts = 1; ts <= 12; ts++) {
            const dist = houseDistance(lagnaSign, ts);
            const bindu = lagnaRule.includes(dist) ? 1 : 0;
            lagnaTable.push(bindu);
            DRAWER[ts - 1].byPlanet['lagna'] = bindu;
        }
        planetaryTables['lagna'] = lagnaTable;
        planetTotals['lagna'] = lagnaTable.reduce((s, v) => s + v, 0);
    }

    // compute Sarvashtakavarga: sum of all planetary arrays included
    // which planets count? classical SAV: sum of 7 planets + Lagna. You asked to include Rahu -> use includeNodes flag.
    const sav = new Array(12).fill(0);
    Object.keys(planetaryTables).forEach((p) => {
        // if p is rahu/ketu and includeNodes==false, skip them
        if ((p === 'rahu' || p === 'ketu') && !includeNodes) return;
        planetaryTables[p].forEach((v, idx) => { sav[idx] += v; });
    });

    // prepare per-sign totals & enriched chakra structure
    const signTotals = sav.map((v, idx) => ({ sign: idx + 1, total: v, byPlanet: DRAWER[idx].byPlanet }));

    // rankings of signs by SAV total
    const signRanking = [...signTotals].sort((a, b) => b.total - a.total).map((x, i) => ({ rank: i + 1, sign: x.sign, total: x.total }));

    // planet rankings by their totals
    const planetRanking = Object.entries(planetTotals)
        .map(([p, t]) => ({ planet: p, total: t }))
        .sort((a, b) => b.total - a.total);

    // return a rich object
    return {
        planetaryTables,    // { sun: [12], moon: [12], ... }
        planetTotals,       // { sun: 8, moon: 6, ... }
        sav,                // [12] totals per sign (Sarvashtakavarga)
        signTotals,         // [{sign:1,total:..., byPlanet:{sun:1,...}}, ...]
        signRanking,        // sorted ranking of signs by total
        planetRanking,      // ranked planets by their bindu totals
        chakra: DRAWER,     // chakra array for UI display
        meta: {
            usedRules: RULES,
            includeNodes: !!includeNodes,
            computedFor: Object.keys(planetaryTables),
        }
    };
}


export const getHouseLordsWithPositions = (ascendant, planetPositions) => {
    const houseLordMap = {
        0: ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"],
        1: ["Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter", "Mars"],
        2: ["Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter", "Mars", "Venus"],
        3: ["Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter", "Mars", "Venus", "Mercury"],
        4: ["Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter", "Mars", "Venus", "Mercury", "Moon"],
        5: ["Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter", "Mars", "Venus", "Mercury", "Moon", "Sun"],
        6: ["Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter", "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury"],
        7: ["Mars", "Jupiter", "Saturn", "Saturn", "Jupiter", "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus"],
        8: ["Jupiter", "Saturn", "Saturn", "Jupiter", "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars"],
        9: ["Saturn", "Saturn", "Jupiter", "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter"],
        10: ["Saturn", "Jupiter", "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"],
        11: ["Jupiter", "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn",]
    };

    if (!houseLordMap[ascendant]) {
        return "Invalid Ascendant Number";
    }

    const houseLords = houseLordMap[ascendant];

    const houseNames = [
        "Lagnesh", "Dwityesh", "Trityesh", "Chaturthesh", "Panchamesh", "Shashthesh",
        "Saptamesh", "Ashtamesh", "Navamesh", "Dashmesh", "Ekadashesh", "Dwadashesh"
    ];

    const result = {};

    houseNames.forEach((name, i) => {
        const lord = houseLords[i];
        result[name] = lord;
        result[`${name}Position`] = planetPositions[lord] || null;
    });

    return result;
}

export function getNakshatraGana(number) {
    if ([1,5,7,8,13,15,17,22,27].includes(number)) {
        return "देव गण";
    }

    if ([2,4,6,11,12,20,21,25,26].includes(number)) {
        return "मनुष्य गण";
    }

    if ([3,9,10,14,16,18,19,23,24].includes(number)) {
        return "राक्षस गण";
    }

    return null;
}

