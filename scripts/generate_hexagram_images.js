#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../assets/hexagrams');

const trigramBinary = {
  0: '111', // Ch'ien - Heaven
  1: '100', // Chên - Thunder
  2: '010', // K'an - Water
  3: '001', // Kên - Mountain
  4: '000', // K'un - Earth
  5: '101', // Sun - Wind
  6: '110', // Li - Fire
  7: '011'  // Tui - Lake
};

const hexagramChart = [
  [
    { number: 1, name: "Ch'ien / The Creative" },
    { number: 34, name: 'Ta Chuang / The Power of the Great' },
    { number: 5, name: 'Hsü / Waiting' },
    { number: 26, name: "Ta Ch'u / The Taming Power of the Great" },
    { number: 11, name: "T'ai / Peace" },
    { number: 9, name: "Hsiao Ch'u / The Taming Power of the Small" },
    { number: 14, name: 'Ta Yu / Possession in Great Measure' },
    { number: 43, name: 'Kuai / Break-through' }
  ],
  [
    { number: 25, name: 'Wu Wang / Innocence' },
    { number: 51, name: "Chên / The Arousing" },
    { number: 3, name: 'Chun / Difficulty at the Beginning' },
    { number: 27, name: 'I / The Corners of the Mouth' },
    { number: 24, name: 'Fu / Return' },
    { number: 42, name: 'I / Increase' },
    { number: 21, name: 'Shih Ho / Biting Through' },
    { number: 17, name: 'Sui / Following' }
  ],
  [
    { number: 6, name: 'Sung / Conflict' },
    { number: 40, name: 'Hsieh / Deliverance' },
    { number: 29, name: "K'an / The Abysmal" },
    { number: 4, name: 'Meng / Youthful Folly' },
    { number: 7, name: 'Shih / The Army' },
    { number: 59, name: 'Huan / Dispersion' },
    { number: 64, name: 'Wei Chi / Before Completion' },
    { number: 47, name: "K'un / Oppression" }
  ],
  [
    { number: 33, name: 'Tun / Retreat' },
    { number: 62, name: 'Hsiao Kuo / Preponderance of the Small' },
    { number: 39, name: 'Chien / Obstruction' },
    { number: 52, name: "Kên / Keeping Still" },
    { number: 15, name: "Ch'ien / Modesty" },
    { number: 53, name: 'Chien / Development' },
    { number: 56, name: "Lü / The Wanderer" },
    { number: 31, name: 'Hsien / Influence' }
  ],
  [
    { number: 12, name: "P'i / Standstill" },
    { number: 16, name: "Yü / Enthusiasm" },
    { number: 8, name: 'Pi / Holding Together' },
    { number: 23, name: 'Po / Splitting Apart' },
    { number: 2, name: "K'un / The Receptive" },
    { number: 20, name: 'Kuan / Contemplation' },
    { number: 35, name: 'Chin / Progress' },
    { number: 45, name: "Ts'ui / Gathering Together" }
  ],
  [
    { number: 44, name: 'Kou / Coming to Meet' },
    { number: 32, name: 'Heng / Duration' },
    { number: 48, name: 'Ching / The Well' },
    { number: 18, name: 'Ku / Work on What Has Been Spoiled' },
    { number: 46, name: 'Shêng / Pushing Upward' },
    { number: 57, name: 'Sun / The Gentle' },
    { number: 50, name: 'Ting / The Cauldron' },
    { number: 28, name: 'Ta Kuo / Preponderance of the Great' }
  ],
  [
    { number: 13, name: "T'ung Jên / Fellowship with Men" },
    { number: 55, name: 'Fêng / Abundance' },
    { number: 63, name: 'Chi Chi / After Completion' },
    { number: 36, name: 'Ming I / Darkening of the Light' },
    { number: 37, name: "Chia Jên / The Family" },
    { number: 30, name: 'Li / The Clinging' },
    { number: 49, name: 'Ko / Revolution' },
    { number: 22, name: 'Pi / Grace' }
  ],
  [
    { number: 10, name: "Lü / Treading" },
    { number: 54, name: 'Kuei Mei / The Marrying Maiden' },
    { number: 60, name: 'Chieh / Limitation' },
    { number: 41, name: 'Sun / Decrease' },
    { number: 19, name: 'Lin / Approach' },
    { number: 61, name: 'Chung Fu / Inner Truth' },
    { number: 38, name: "K'uei / Opposition" },
    { number: 58, name: 'Tui / The Joyous' }
  ]
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getLinePattern(lowerBinary, upperBinary) {
  const lines = [];
  for (let i = 0; i < lowerBinary.length; i += 1) {
    lines.push(lowerBinary[i] === '1' ? 'yang' : 'yin');
  }
  for (let i = 0; i < upperBinary.length; i += 1) {
    lines.push(upperBinary[i] === '1' ? 'yang' : 'yin');
  }
  return lines;
}

function getPalette(hexagramNumber) {
  const palettes = [
    ['#fde1f3', '#ffe7d6', '#f6f8ff'],
    ['#d2f1ff', '#ffd7f6', '#fff6d5'],
    ['#fee4e5', '#e6f2ff', '#f9e3ff'],
    ['#e8f7e1', '#ffe9f2', '#e5f0ff']
  ];
  const index = hexagramNumber % palettes.length;
  const [start, mid, end] = palettes[index];
  return { start, mid, end };
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function createSparkles(hexagramNumber, width, height) {
  const rand = seededRandom(hexagramNumber * 9871);
  const sparkles = [];
  const count = 8 + Math.floor(rand() * 6);
  for (let i = 0; i < count; i += 1) {
    const cx = (rand() * (width - 40) + 20).toFixed(2);
    const cy = (rand() * (height - 40) + 20).toFixed(2);
    const r = (1.2 + rand() * 1.8).toFixed(2);
    const opacity = (0.35 + rand() * 0.45).toFixed(2);
    sparkles.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" opacity="${opacity}" />`);
  }
  return sparkles.join('\n');
}

function createLineSVG(lineType, index, total) {
  const thickness = 10;
  const spacing = 28;
  const y = 50 + index * spacing;
  const length = 220;
  const radius = 6;

  if (lineType === 'yang') {
    return `<rect x="40" y="${y}" width="${length}" height="${thickness}" rx="${radius}" fill="rgba(25, 20, 38, 0.88)" filter="url(#glow)" />`;
  }

  const segment = (length - 40) / 2;
  return `
    <rect x="40" y="${y}" width="${segment}" height="${thickness}" rx="${radius}" fill="rgba(25, 20, 38, 0.78)" filter="url(#glow)" />
    <rect x="${40 + segment + 40}" y="${y}" width="${segment}" height="${thickness}" rx="${radius}" fill="rgba(25, 20, 38, 0.78)" filter="url(#glow)" />
  `;
}

function buildSVG({ hexagramNumber, name, lines }) {
  const width = 300;
  const height = 360;
  const palette = getPalette(hexagramNumber);
  const sparkles = createSparkles(hexagramNumber, width, height);
  const svgLines = lines
    .map((lineType, idx) => createLineSVG(lineType, idx, lines.length))
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${hexagramNumber}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.start}" />
      <stop offset="55%" stop-color="${palette.mid}" />
      <stop offset="100%" stop-color="${palette.end}" />
    </linearGradient>
    <filter id="noise" x="0" y="0">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.18  0 0 0 0 0.25  0 0 0 0.05 0" />
    </filter>
    <filter id="glow" x="-10" y="-10" width="140" height="140">
      <feGaussianBlur stdDeviation="2.2" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#bg-${hexagramNumber})" rx="32" />
  <rect x="12" y="12" width="${width - 24}" height="${height - 24}" rx="28" fill="rgba(255,255,255,0.35)" />
  <rect x="18" y="18" width="${width - 36}" height="${height - 36}" rx="24" fill="rgba(255,255,255,0.42)" filter="url(#noise)" opacity="0.35" />
  ${sparkles}
  <text x="50%" y="58" text-anchor="middle" font-family="'Nunito', 'Segoe UI', sans-serif" font-size="18" fill="rgba(25, 20, 38, 0.82)">
    Hexagram ${hexagramNumber}
  </text>
  <text x="50%" y="86" text-anchor="middle" font-family="'Nunito', 'Segoe UI', sans-serif" font-size="14" fill="rgba(25, 20, 38, 0.66)">
    ${name.replace(/&/g, '&amp;')}
  </text>
  ${svgLines}
</svg>`;
}

function generateImages() {
  ensureDir(OUTPUT_DIR);

  const seen = new Set();

  hexagramChart.forEach((row, lowerIndex) => {
    row.forEach((entry, upperIndex) => {
      const { number, name } = entry;
      if (seen.has(number)) {
        return;
      }
      seen.add(number);

      const lowerBinary = trigramBinary[lowerIndex];
      const upperBinary = trigramBinary[upperIndex];
      const lines = getLinePattern(lowerBinary, upperBinary);

      const svgContent = buildSVG({
        hexagramNumber: number,
        name,
        lines
      });

      const filename = `hexagram_${String(number).padStart(2, '0')}.svg`;
      const filepath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(filepath, svgContent, 'utf8');
      console.log(`Generated ${filename}`);
    });
  });
}

generateImages();

