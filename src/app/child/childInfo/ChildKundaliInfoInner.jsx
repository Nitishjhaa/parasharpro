"use client";

import { useEffect, useState } from "react";
import { loadChildKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliStructure from '@/components/KundaliStructure';
import ChildHeader from '@/components/ChildHeader';

import { rashi, nakshatra, getMoonPaaye, getNakPaaye, getLords, kaalSarpYog, cheakMool, checkManglik } from "../../kundaliInfo/AstrologicalData";
import getPanchangDetails from '@/lib/panchang'

export default function KundaliInfoInner() {
  const [kundali, setKundali] = useState(null);
  const [isSideOpen, setIsSideOpen] = useState(false)
  const params = useSearchParams();
  const router = useRouter();
  const [getCoordinate, setGetCoordinate] = useState([]);
  const [kaalSarpYoga, setKaalSarpYoga] = useState(null);

  // main function for child start
  function getNaamAksharInHindi(nakshatraInput) {
    const nakshatraMap = {
      Ashwini: ["चू", "चे", "चो", "ला"],
      Bharani: ["ली", "लू", "ले", "लो"],
      Krittika: ["अ", "ई", "उ", "ए"],
      Rohini: ["ओ", "वा", "वी", "वु"],
      Mrigashira: ["वे", "वो", "का", "की"],
      Ardra: ["कू", "घ", "ङ", "छ"],
      Punarvasu: ["के", "को", "हा", "ही"],
      Pushya: ["हू", "हे", "हो", "डा"],
      Ashlesha: ["डी", "डू", "डे", "डो"],
      Magha: ["मा", "मी", "मू", "मे"],
      PurvaPhalguni: ["मो", "टा", "टी", "टू"],
      UttaraPhalguni: ["टे", "टो", "पा", "पी"],
      Hasta: ["पू", "ष", "ण", "ठ"],
      Chitra: ["पे", "पो", "रा", "री"],
      Swati: ["रू", "रे", "रो", "ता"],
      Vishakha: ["ती", "तू", "ते", "तो"],
      Anuradha: ["ना", "नी", "नू", "ने"],
      Jyeshtha: ["नो", "या", "यी", "यू"],
      Mula: ["ये", "यो", "भा", "भी"],
      PurvaAshadha: ["भू", "धा", "फा", "ढा"],
      UttaraAshadha: ["भे", "भो", "जा", "जी"],
      Shravana: ["जू", "जे", "जो", "गु"],
      Dhanishta: ["गा", "गी", "गू", "गे"],
      Shatabhisha: ["गो", "सा", "सी", "सू"],
      PurvaBhadrapada: ["से", "सो", "दा", "दी"],
      UttaraBhadrapada: ["दू", "थ", "झ", "ञ"],
      Revati: ["दे", "दो", "चा", "ची"]
    };

    const hindiToEnglish = {
      "अश्विनी": "Ashwini", "भरणी": "Bharani", "कृतिका": "Krittika", "रोहिणी": "Rohini",
      "मृगशिरा": "Mrigashira", "अर्द्रा": "Ardra", "पुनर्वसु": "Punarvasu", "पुष्य": "Pushya",
      "आश्लेषा": "Ashlesha", "मघा": "Magha", "पूर्वाफाल्गुनी": "Purva_Phalguni", "उत्तराफाल्गुनी": "Uttara_Phalguni",
      "हस्त": "Hasta", "चित्रा": "Chitra", "स्वाती": "Swati", "विशाखा": "Vishakha",
      "अनुराधा": "Anuradha", "ज्येष्ठा": "Jyeshtha", "मूल": "Mula", "पूर्वाषाढ़ा": "Purva_Ashadha",
      "उत्तराषाढ़ा": "Uttara_Ashadha", "श्रवण": "Shravana", "धनिष्ठा": "Dhanishta", "शतभिषा": "Shatabhisha",
      "पूर्वभाद्रपदा": "Purva_Bhadrapada", "उत्तराभाद्रपद": "Uttara_Bhadrapada", "रेवती": "Revati"
    };

    // Parse input like "Ashlesha,आश्लेषा"
    const parts = nakshatraInput.split(",").map(p => p.trim());
    let engName = null;

    for (let part of parts) {
      if (nakshatraMap[part]) {
        engName = part;
        break;
      }
      if (hindiToEnglish[part]) {
        engName = hindiToEnglish[part];
        break;
      }
    }

    if (!engName || !nakshatraMap[engName]) {
      return "अमान्य नक्षत्र (Invalid Nakshatra)";
    }


    return nakshatraMap[engName];
  }


  function getSixthDayLater(birthDate) {
    const inputDate = new Date(birthDate);

    const addDays = (base, days) => {
      const date = new Date(base);
      date.setDate(date.getDate() + days);
      return date;
    };

    const fourthDay = addDays(inputDate, 4 - 1);
    const fifthDay = addDays(inputDate, 5 - 1);
    const sixthDay = addDays(inputDate, 6 - 1);
    const seventhDay = addDays(inputDate, 7 - 1);
    const tenthDay = addDays(inputDate, 10 - 1);
    const eleventhDay = addDays(inputDate, 11 - 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    sixthDay.setHours(0, 0, 0, 0);

    const response = {
      sixthDay: formatDate(sixthDay),
      seventhDay: formatDate(seventhDay)
    };

    const fifthDayOfWeek = fifthDay.getDay(); // 0=Sun, 6=Sat
    const tenthDayOfWeek = tenthDay.getDay();

    // 5th day logic
    if ([2, 4, 6].includes(fifthDayOfWeek)) {
      response.fourthDay = formatDate(fourthDay);
    } else {
      response.fifthDay = formatDate(fifthDay);
    }

    // 10th/11th day logic
    if ([2, 4, 6].includes(tenthDayOfWeek)) {
      response.eleventhDay = formatDate(eleventhDay);
    } else {
      response.tenthDay = formatDate(tenthDay);
    }

    return response;
  }

  function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy}`;
  }

  // main function for child end 


  // Load cities.json
  useEffect(() => {
    fetch("/data/cities.json")
      .then((r) => r.json())
      .then((data) => setGetCoordinate(data || []));

    fetch('/data/kaalsarpyogs.json')
      .then((e) => e.json())
      .then((data) => setKaalSarpYoga(data))
  }, []);

  function getLatLon(cityName) {
    const result = getCoordinate.find(item => item.city.toLowerCase() === cityName.toLowerCase());
    if (result) {
      return { lat: result.lat, lon: result.lng };
    }
    return null;
  }

  const indexParam = params.get("index");

  // normal information start
  const cityName = kundali?.raw?.city;

  let lat = null;
  let lon = null;

  if (cityName) {
    const latAndLon = getLatLon(cityName);
    lat = latAndLon?.lat ?? null;
    lon = latAndLon?.lon ?? null;
  }

  const birthString = kundali?.raw?.meta?.datetimeUTC ?? null;

  let birthDate = null;
  let birthTime = null;

  if (birthString) {
    const [date, time] = birthString.split('T');
    birthDate = date;
    birthTime = time?.split('.')[0]; // remove milliseconds
  }

  const panchang = getPanchangDetails(birthDate, birthTime, lat, lon)

  function getHindiWeekday(dob) {

    if (!dob) {
      return 'dob is not found'
    }

    const hindiDays = [
      "रविवार",  // Sunday
      "सोमवार",  // Monday
      "मंगलवार", // Tuesday
      "बुधवार",  // Wednesday
      "गुरुवार", // Thursday
      "शुक्रवार", // Friday
      "शनिवार"   // Saturday
    ];

    let date;
    date = new Date(dob);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid Date Format");
    }

    return hindiDays[date.getDay()];
  }

  getHindiWeekday()

  let tithi = null;

  if (panchang?.tithi?.name) {
    tithi = panchang.tithi.name;
  }

  const chandraRelated = kundali?.raw?.planets?.Moon;
  const kundaliMeta = kundali?.meta;



  // normal information end

  useEffect(() => {
    async function load() {
      if (!indexParam) return;

      const idx = Number(indexParam);
      if (isNaN(idx) || idx < 0) return;

      const record = await loadChildKundaliByIndex(idx);
      if (!record) return;

      setKundali(record);
    }
    load();
  }, [indexParam, router]);

  // mool, manglik and kaalsarpyoga info start

  // PREVENT RUNNING ANYTHING EARLY
  if (!kundali) return <div className="p-4 text-white">Loading Kundali...</div>;
  if (!kundali.raw?.planets) return <div className="p-4 text-white">Loading Planet Data...</div>;
  if (!Array.isArray(kaalSarpYoga)) return <div className="p-4 text-white">Loading Kaal Sarp Yog Details...</div>;


  // extract houses
  const kundaliPath = kundali.raw.planets;

  const sunHouse = kundaliPath.Sun?.house;
  const moonHouse = kundaliPath.Moon?.house;
  const marsHouse = kundaliPath.Mars?.house;
  const mercuryHouse = kundaliPath.Mercury?.house;
  const venusHouse = kundaliPath.Venus?.house;
  const jupiterHouse = kundaliPath.Jupiter?.house;
  const saturnHouse = kundaliPath.Saturn?.house;
  const rahuHouse = kundaliPath.Rahu?.house;
  const ketuHouse = kundaliPath.Ketu?.house;

  const nakshatraa = kundaliPath?.Moon?.nakshatra;
  const nakAkshar = getNaamAksharInHindi(nakshatraa).join(" ,")

  const charana = kundaliPath?.Moon?.pada

  // calculate yog
  const kaalYog = kaalSarpYog(
    sunHouse,
    moonHouse,
    marsHouse,
    mercuryHouse,
    venusHouse,
    jupiterHouse,
    saturnHouse,
    rahuHouse,
    ketuHouse
  );

  // find full description in JSON
  function getKaalSharpaYoga(kaalYog) {
    if (!kaalYog) return null;
    return kaalSarpYoga.find(yoga => yoga.name.toLowerCase() === kaalYog.toLowerCase()) || null;
  }

  const matchedYog = getKaalSharpaYoga(kaalYog);

  const kaalSarpHindiMap = (kaalYog) => {

    if (kaalYog === "Anant Kaal-Sarp Yoga") {
      return "अनंत कालसर्प योग"
    } else if (kaalYog === "Kulik kaal-sarp yoga") {
      return "कुलिक कालसर्प योग"
    } else if (kaalYog === "Vasuki kaal-sarp yoga") {
      return "वसुकि कालसर्प योग"
    } else if (kaalYog === "SankhPal kaal-sarp yoga") {
      return "शंखपाल कालसर्प योग"
    } else if (kaalYog === "Padam kaal-sarp yoga") {
      return "पद्म कालसर्प योग"
    } else if (kaalYog === "Mahapadam kaal-sarp yoga") {
      return "महापद्म कालसर्प योग"
    } else if (kaalYog === "Takshak kaal-sarp yoga") {
      return "तक्षक कालसर्प योग"
    } else if (kaalYog === "Karkotak kaal-sarp yoga") {
      return "कर्कोटक कालसर्प योग"
    } else if (kaalYog === "Sankhnaad kaal-sarp yoga") {
      return "शंखनाद कालसर्प योग"
    } else if (kaalYog === "Paatak kaal-sarp yoga") {
      return "पातक कालसर्प योग"
    } else if (kaalYog === "Vishakt kaal-sarp yoga") {
      return "विषक्त कालसर्प योग"
    } else if (kaalYog === "Shesnaag kaal-sarp yoga") {
      return "शेषनाग कालसर्प योग"
    } else if (kaalYog === "Aansik Kaal Sarp Yog / आंशिक काल सर्प योग") {
      return "आंशिक काल सर्प योग"
    } else if (kaalYog === "No Kaal Sarp Yog / काल सर्प योग नहीं") {
      return "काल सर्प योग नहीं"
    } else {
      "काल सर्प योग"
    }
  };

  // mool
  const gandMool = cheakMool(nakshatraa, charana);

  // manglik
  const manglik = checkManglik(marsHouse)

  // mool, manglik and kaalsarpyoga info end

  // sixth day info

  let datetimeUTC = kundali?.raw?.meta?.datetimeUTC
  datetimeUTC = datetimeUTC.split("T")[0]

  const sixthDayInfo = getSixthDayLater(datetimeUTC);

  console.log("sixthDayInfo", sixthDayInfo)
  // sixth day info end

  const data = [
    {
      "नाम": kundaliMeta?.name,
      "जन्म तिथि": kundaliMeta?.birthDate,
      "जन्म समय": kundaliMeta?.birthTime,
      "जन्म स्थान": kundaliMeta?.city,
      "राशि": rashi(chandraRelated?.rashiIndex),
      "राशिपति": getLords("rashi", chandraRelated?.rashi),
      "लग्न": rashi(kundali?.raw?.ascendant?.rashiIndex),
      "लग्नाधिपति": getLords("lagna", kundali?.raw?.ascendant?.rashi),
      "नक्षत्र": nakshatra(chandraRelated?.nakshatraIndex),
      "चरण": chandraRelated?.pada,
      "नक्षत्रपति": getLords("nakshatra", chandraRelated?.nakshatra),
      "नाम अक्षर": nakAkshar,
      "पाये (राशि से)": getMoonPaaye(chandraRelated?.house),
      "पाये (नक्षत्र से)": getNakPaaye(chandraRelated?.nakshatra),
      "गण": panchang.gana,
      "मास": panchang.purnimantaMonth,
      "पक्ष": panchang.paksha,
      "तिथि": tithi,
      "वार": getHindiWeekday(birthDate),
      "ऋतु": panchang.ritu,
    }
  ];

  console.log(kundali)

  return (
    <div className="p-2 overflow-hidden text-black" >
      <div className="w-[98%] mx-auto">

        <ChildHeader
          title="परिचय"
          indexParam={indexParam}
          isSideOpen={isSideOpen}
          setIsSideOpen={setIsSideOpen}
        />

        <div className="flex flex-col justify-center items-center bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-10">
          <ul className="w-full mt-5 p-5">
            <h3 className="text-2xl ml-5 my-5 font-bold underline underline-offset-8">सामान्य परिचय</h3>
            {Object.entries(data[0]).map(([key, value]) => (
              <li
                key={key}
                className="flex justify-between gap-8 px-6 py-3 border-b border-black/20 text-lg font-medium"
              >
                <span>{key} : </span>
                <span>{value || "-"}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col w-full">
            {/* mool */}
            {gandMool && <div>
              <div className="px-8 py-2">
                <span className={`${gandMool.status === "गण्डमूल दोष अनुपस्थित" ? "text-lg font-semibold" : ""} `}>
                  {gandMool.status === "गण्डमूल दोष अनुपस्थित" ? "गण्डमूल दोष नहीं है।" : gandMool.status}
                </span>
              </div>
            </div>}

            {/* manglik */}
            {manglik && <div>
              <div className="px-8 py-2">
                <div className={`text-lg font-semibold`}>
                  {manglik.status}
                </div>
              </div>
            </div>}

            {/* kaalsarpyog */}
            <div className="px-8 py-2">
              {!matchedYog &&
                <p className="text-lg font-semibold">
                  काल सर्प योग नहीं है।
                </p>}
              {matchedYog && (
                <div className="mt-4">
                  <p className="font-bold text-xl">{kaalSarpHindiMap(matchedYog.name)}</p>
                </div>
              )}
            </div>

          </div>

          <KundaliStructure kundali={kundali} title="लग्न कुंडली" />



          <div className="flex flex-col w-full">
            <p className="px-8 py-2 font-semibold text-base">नहनवार : {sixthDayInfo.fourthDay || sixthDayInfo.fifthDay}</p>
            <p className="px-8 py-2 font-semibold text-base">छठी : {sixthDayInfo.sixthDay}</p>
            <p className="px-8 py-2 font-semibold text-base">सावड़ / खाट बदली : {sixthDayInfo.seventhDay}</p>
            <p className="px-8 py-2 font-semibold text-base">हवन : {sixthDayInfo.tenthDay || sixthDayInfo.eleventhDay}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
