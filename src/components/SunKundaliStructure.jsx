
const SunKundaliChart = ({ ascendant, sun, moon, mars, mercury, jupiter, venus, saturn, rahu, ketu, sunOffset }) => {
    
    const housePositions = [
      { x: 193, y: 70 },
      { x: 170, y: 65 },
      { x: 53, y: 180 },
      { x: 60, y: 205 },
      { x: 52, y: 230 },
      { x: 170, y: 345 },
      { x: 193, y: 340 },
      { x: 220, y: 345 },
      { x: 334, y: 225 },
      { x: 326, y: 205 },
      { x: 334, y: 180 },
      { x: 220, y: 64 },
    ];
  
    const planetPositions = [
      { x: 185, y: 85 },    //1st house
      { x: 118, y: 63 },    //2nd house
      { x: 55, y: 95 },    //3rd house
      { x: 108, y: 160 },    //4th house
      { x: 55, y: 245 },    //5th house
      { x: 117, y: 300 },   //6th house
      { x: 185, y: 240 },   //7th house
      { x: 262, y: 300 },   //8th house
      { x: 323, y: 240 },   //9th house
      { x: 265, y: 160 },   //10th house
      { x: 325, y: 90 },   //11th house
      { x: 268, y: 63 },    //12th house
    ];
  
    const planets = [
      { name: "सूर्य", pos: sun },
      { name: "चन्द्र", pos: moon },
      { name: "मंगल", pos: mars },
      { name: "बुध", pos: mercury },
      { name: "गुरु", pos: jupiter },
      { name: "शुक्र", pos: venus },
      { name: "शनि", pos: saturn },
      { name: "राहु", pos: rahu },
      { name: "केतु", pos: ketu },
    ];
  
    return (
  
      <div className="w-[110%] lg:w-[50%] mt-10" >
        <h2 className="text-center text-2xl font-semibold tracking-wide pt-10">
          सूर्य कुंडली
        </h2>
        <div className="relative p-3 scale-125 lg:scale-100">
          <svg
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
            
          >
            <rect x="50" y="50" width="300" height="300" stroke="black" fill="none" strokeWidth="1.5" />
            <line x1="50" y1="50" x2="350" y2="350" stroke="black" strokeWidth="1.5" />
            <line x1="50" y1="350" x2="350" y2="50" stroke="black" strokeWidth="1.5" />
            <line x1="200" y1="50" x2="50" y2="200" stroke="black" strokeWidth="1.5" />
            <line x1="200" y1="50" x2="350" y2="200" stroke="black" strokeWidth="1.5" />
            <line x1="50" y1="200" x2="200" y2="350" stroke="black" strokeWidth="1.5" />
            <line x1="200" y1="350" x2="350" y2="200" stroke="black" strokeWidth="1.5" />
  
            {housePositions.map((pos, index) => {
              const houseNumber = ((ascendant - 1 + index) % 12) + 1;
              return (
                <text key={index} x={pos.x} y={pos.y} fontSize="14" fill="black" fontWeight="bold">
                  {houseNumber}
                </text>
              );
            })}
  
            {planets.map((planet, index) => {
              if (!planet.pos) return null;
              const adjustedHouse = ((planet.pos - sunOffset - 1 + 12) % 12) + 1;
              const houseIndex = adjustedHouse - 1;
              const planetPos = planetPositions[houseIndex];
              const sameHousePlanets = planets.filter(p => {
                const adjusted = ((p.pos - sunOffset - 1 + 12) % 12) + 1;
                return adjusted === adjustedHouse;
              });
  
              const planetOffset = sameHousePlanets.findIndex(p => p.name === planet.name) * 14;
  
              return (
                <text
                  key={index}
                  x={planetPos.x}
                  y={planetPos.y + planetOffset}
                  fontSize="11"
                  fontWeight="bold"
                  fill="black"
                >
                  {planet.name}
                </text>
              );
            })}
  
          </svg>
        </div>
      </div>
  
    );
  };
  
  export default SunKundaliChart;
  