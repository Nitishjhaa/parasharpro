function testEnv(envName) {
  process.env.NODE_ENV = envName;
  delete require.cache[require.resolve('mhah-panchang')];
  delete require.cache[require.resolve('mhah-panchang/dist/mhah-panchang.cjs.production.min.js')];
  delete require.cache[require.resolve('mhah-panchang/dist/mhah-panchang.cjs.development.js')];
  delete require.cache[require.resolve('mhah-panchang/dist/index.js')];

  const { MhahPanchang } = require('mhah-panchang');
  const panchang = new MhahPanchang();

  console.log(`--- Testing with NODE_ENV = ${envName} ---`);
  for (let hour = 0; hour < 24; hour += 4) {
    const hrStr = hour.toString().padStart(2, '0');
    const date = new Date(`2026-05-30T${hrStr}:00:00`);
    const details = panchang.calendar(date, 28.6139, 77.2090);
    console.log(`${hrStr}:00 - Tithi: ${details.Tithi.name_en_IN} (ino: ${details.Tithi.ino}), Nakshatra: ${details.Nakshatra.name_en_IN}`);
  }
}

testEnv('development');
testEnv('production');
