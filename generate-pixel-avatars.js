const fs = require('fs');
const path = require('path');

const PALETTES = {
  shazan: { k:'#1A2E2A', s:'#E8C19C', h:'#D4973A', c:'#8B5A2B', a:'#3A8A9E', g:'#F4F6F2', r:'#C85A7C' },
  kanika: { k:'#1A2E2A', s:'#E8C19C', h:'#6B8E4E', c:'#3D5C42', a:'#1F5866', g:'#E8B867', r:'#C85A7C' },
  saloni: { k:'#1A2E2A', s:'#F2D2B0', h:'#C85A7C', c:'#8B5A2B', a:'#E89AAF', g:'#FFFFFF', r:'#D4973A' },
  anmol:  { k:'#1A2E2A', s:'#E8C19C', h:'#2A2A2E', c:'#3A8A9E', a:'#D4973A', g:'#F2D2B0', r:'#C85A7C' },
  yash:   { k:'#1A2E2A', s:'#E8C19C', h:'#2A2A2E', c:'#8B5FBF', a:'#5FB0C2', g:'#E8B867', r:'#3A8A9E' },
};

// 16×16 sprite maps — row by row, column by column
// legend: . transparent · k ink · s skin · h hat/hair · c clothing · a accessory · g gadget screen · r cheek/rim
const SPRITES = {
  shazan: [
    '................',
    '.....kkkkkk.....',
    '....khhhhhhk....',
    '...khhhhhhhhk...',
    '..khhhhhhhhhhk..',
    '..kkkssssssskk..',
    '..kskssksskksk..',
    '..kssssskssssk..',
    '..ksssskkssssk..',
    '..kkcccccccckk..',
    '.kccckaaaakcck..',
    '.kccakggggakck..',
    '.kccakgkkgakck..',
    '.kccakggggakck..',
    '.kcckaaaaakcck..',
    '..kk..........k.',
  ],
  kanika: [
    '................',
    '....khhhhhhk....',
    '...khhhhghhhk...',
    '..khhhhhhhhhhk..',
    '..khhhhhhhhhhk..',
    '..kkkssssssskk..',
    '..ksaaksskaaksk.',
    '..ksaggksgagksk.',
    '..ksaaksskaaksk.',
    '..ksskkkkkkssk..',
    '..kssssssssssk..',
    '..kccccccccckk..',
    '.kcackccccckcck.',
    '.kcack......ckk.',
    '.kcack......kk..',
    '..kk...........',
  ],
  saloni: [
    '................',
    '...khhhhhhhhk...',
    '..khhhhhhhhhhk..',
    '.khhkhhhhhhhkhk.',
    '.khhhhhhhhhhhhk.',
    '..kkkssssssskk..',
    '..kssggsskggssk.',
    '..kskgsskskgssk.',
    '..krskkkkkkrksk.',
    '..ksssskkssssk..',
    '..kkcccccccckk..',
    '..kccaaaaaccck..',
    '..kcagggggackk..',
    '..kcagkkkgackk..',
    '..kcaaaaaaackk..',
    '..kkk..kk.......',
  ],
  anmol: [
    '................',
    '.....kkkkkk.....',
    '....khhhhhhk....',
    '...khhhhhhhhk...',
    '..khhhhhhhhhhk..',
    '..kkkssssssskk..',
    '..kkkkkskkkkksk.',
    '..khkhkskhkhksk.',
    '..kssskkkksssk..',
    '..kssssrrsssssk.',
    '..kkcccccccckk..',
    '..kcccaaaaccck..',
    '..kcccagggackk..',
    '..kccaagggakck..',
    '..kcckaggakckk..',
    '..kkk.kkkk.kk...',
  ],
  yash: [
    '................',
    '....khhhhhhk....',
    '...khhhhhhhhk...',
    '..khhhkkkhhhhk..',
    '..khhhhhhhhhhk..',
    '..khccccccccsk..',
    '..kcksskkssksk..',
    '..kckgsskgsksk..',
    '..kckkssskssssk.',
    '..kssssssssssk..',
    '..kccccccccckk..',
    '.kaaaaaaaaaaak..',
    '.kaggggggggggak.',
    '.kaggkgggkgggak.',
    '.kaaaaaaaaaaak..',
    '...k........k...',
  ],
};

// Display names and taglines for each character
const META = {
  shazan: { name: 'Shazan', tagline: 'Group admin & organizer' },
  kanika: { name: 'Kanika', tagline: 'Expert travel planner' },
  saloni: { name: 'Saloni', tagline: 'Newbie to mountains' },
  anmol:  { name: 'Anmol',  tagline: 'Slow but instagramable' },
  yash:   { name: 'Yash',   tagline: 'Genius coder' },
};

const SIZE = 1024;
const GRID = 16;
const SCALE = SIZE / GRID; // 64px per pixel

function generateSVG(id) {
  const palette = PALETTES[id];
  const sprite  = SPRITES[id];
  const meta    = META[id];
  const rects   = [];

  for (let row = 0; row < GRID; row++) {
    const line = sprite[row] || '';
    for (let col = 0; col < GRID; col++) {
      const char  = line[col] || '.';
      if (char === '.') continue;
      const color = palette[char];
      if (!color) continue;
      rects.push(
        `  <rect x="${col * SCALE}" y="${row * SCALE}" width="${SCALE}" height="${SCALE}" fill="${color}"/>`
      );
    }
  }

  // Rounded corner radius for card context (~14px at display size scales up to ~90px at 1024)
  const rx = 90;

  return `<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}"
  shape-rendering="crispEdges"
  data-character="${id}"
  data-name="${meta.name}"
  data-tagline="${meta.tagline}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#B8D4E0"/>
      <stop offset="100%" stop-color="#F4F6F2"/>
    </linearGradient>
    <clipPath id="clip-${id}">
      <rect width="${SIZE}" height="${SIZE}" rx="${rx}" ry="${rx}"/>
    </clipPath>
  </defs>

  <!-- Background gradient -->
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)" rx="${rx}" ry="${rx}"/>

  <!-- Pixel character (16×16 grid, ${SCALE}px per cell) -->
  <g clip-path="url(#clip-${id})">
${rects.join('\n')}
  </g>
</svg>`;
}

const outputDir = path.join(__dirname, 'Images');
const members   = ['shazan', 'kanika', 'saloni', 'anmol', 'yash'];

members.forEach(id => {
  const svg      = generateSVG(id);
  const filePath = path.join(outputDir, `${id}-pixel.svg`);
  fs.writeFileSync(filePath, svg, 'utf8');
  console.log(`✓ ${filePath}`);
});

console.log(`\nDone — ${members.length} pixel avatars written to Images/`);
