/**
 * Generates animated pixel avatar SVGs for all 5 Basecamp Ledger characters.
 * Overwrites Images/{name}-pixel.svg with animation-enriched versions.
 */
const fs   = require('fs');
const path = require('path');

const S    = 64;   // pixels per grid cell (1024 / 16)
const SIZE = 1024;
const RX   = 90;   // border-radius equivalent

// ─── Palettes ────────────────────────────────────────────────────────────────
const P = {
  shazan: { k:'#1A2E2A', s:'#E8C19C', h:'#D4973A', c:'#8B5A2B', a:'#3A8A9E', g:'#F4F6F2', r:'#C85A7C' },
  kanika: { k:'#1A2E2A', s:'#E8C19C', h:'#6B8E4E', c:'#3D5C42', a:'#1F5866', g:'#E8B867', r:'#C85A7C' },
  saloni: { k:'#1A2E2A', s:'#F2D2B0', h:'#C85A7C', c:'#8B5A2B', a:'#E89AAF', g:'#FFFFFF', r:'#D4973A' },
  anmol:  { k:'#1A2E2A', s:'#E8C19C', h:'#2A2A2E', c:'#3A8A9E', a:'#D4973A', g:'#F2D2B0', r:'#C85A7C' },
  yash:   { k:'#1A2E2A', s:'#E8C19C', h:'#2A2A2E', c:'#8B5FBF', a:'#5FB0C2', g:'#E8B867', r:'#3A8A9E' },
};

// ─── Sprite maps (16×16) ─────────────────────────────────────────────────────
const SPRITES = {
  shazan: [
    '................','..kkkkkk........','.....kkkkkk.....',
    '....khhhhhhk....','...khhhhhhhhk...','..khhhhhhhhhhk..',
    '..kkkssssssskk..','..kskssksskksk..','..kssssskssssk..',
    '..ksssskkssssk..','..kkcccccccckk..','.kccckaaaakcck..',
    '.kccakggggakck..','.kccakgkkgakck..','.kccakggggakck..',
    '.kcckaaaaakcck..','..kk..........k.',
  ].slice(2), // remove the duplicate header rows I accidentally added
  kanika: [
    '................','....khhhhhhk....','...khhhhghhhk...',
    '..khhhhhhhhhhk..','..khhhhhhhhhhk..','..kkkssssssskk..',
    '..ksaaksskaaksk.','..ksaggksgagksk.','..ksaaksskaaksk.',
    '..ksskkkkkkssk..','..kssssssssssk..','..kccccccccckk..',
    '.kcackccccckcck.','.kcack......ckk.','.kcack......kk..',
    '..kk...........',
  ],
  saloni: [
    '................','...khhhhhhhhk...','..khhhhhhhhhhk..',
    '.khhkhhhhhhhkhk.','.khhhhhhhhhhhhk.','..kkkssssssskk..',
    '..kssggsskggssk.','..kskgsskskgssk.','..krskkkkkkrksk.',
    '..ksssskkssssk..','..kkcccccccckk..','..kccaaaaaccck..',
    '..kcagggggackk..','..kcagkkkgackk..','..kcaaaaaaackk..',
    '..kkk..kk.......',
  ],
  anmol: [
    '................','.....kkkkkk.....','....khhhhhhk....',
    '...khhhhhhhhk...','..khhhhhhhhhhk..','..kkkssssssskk..',
    '..kkkkkskkkkksk.','..khkhkskhkhksk.','..kssskkkksssk..',
    '..kssssrrsssssk.','..kkcccccccckk..','..kcccaaaaccck..',
    '..kcccagggackk..','..kccaagggakck..','..kcckaggakckk..',
    '..kkk.kkkk.kk...',
  ],
  yash: [
    '................','....khhhhhhk....','...khhhhhhhhk...',
    '..khhhkkkhhhhk..','..khhhhhhhhhhk..','..khccccccccsk..',
    '..kcksskkssksk..','..kckgsskgsksk..','..kckkssskssssk.',
    '..kssssssssssk..','..kccccccccckk..','.kaaaaaaaaaaak..',
    '.kaggggggggggak.','.kaggkgggkgggak.','.kaaaaaaaaaaak..',
    '...k........k...',
  ],
};

// Fix shazan sprites array that got messed up in the write above
SPRITES.shazan = [
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
];

// ─── Group classifier ────────────────────────────────────────────────────────
function groupOf(id, row, char) {
  switch (id) {
    case 'shazan':
      if (row <= 4)  return 'hat';
      if (row <= 8)  return 'face';
      if (row >= 10 && (char === 'a' || char === 'g')) return 'clipboard';
      return 'body';
    case 'kanika':
      if (row <= 4)  return 'hat';
      if (row <= 10) return 'face';
      return 'body';
    case 'saloni':
      if (row <= 4) return 'hat';
      if ((row === 6 || row === 7) && char === 'g') return 'eyes';
      if (row <= 9) return 'face';
      if (row >= 11 && (char === 'a' || char === 'g')) return 'mug';
      return 'body';
    case 'anmol':
      if (row <= 4) return 'hat';
      if (row <= 9) return 'face';
      if (row >= 11 && (char === 'a' || char === 'g')) return 'phone';
      return 'body';
    case 'yash':
      if (row <= 4) return 'headphones';
      if (row <= 9) return 'face';
      if (row >= 11 && char === 'g') return 'screen';
      return 'body';
    default: return 'body';
  }
}

// ─── Build grouped rects ─────────────────────────────────────────────────────
function buildGroups(id) {
  const pal = P[id];
  const spr = SPRITES[id];
  const grps = {};
  for (let row = 0; row < 16; row++) {
    const line = spr[row] || '';
    for (let col = 0; col < 16; col++) {
      const ch = line[col] || '.';
      if (ch === '.') continue;
      const fill = pal[ch];
      if (!fill) continue;
      const g = groupOf(id, row, ch);
      (grps[g] = grps[g] || []).push(
        `    <rect x="${col*S}" y="${row*S}" width="${S}" height="${S}" fill="${fill}"/>`
      );
    }
  }
  return grps;
}

function gWrap(id, items, extra = '') {
  return `  <g id="${id}"${extra}>\n${(items||[]).join('\n')}\n  </g>`;
}

function head(id, viewBox = `0 0 ${SIZE} ${SIZE}`) {
  return `<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="${viewBox}" width="${SIZE}" height="${SIZE}"
  shape-rendering="crispEdges" data-character="${id}">
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#B8D4E0"/>
      <stop offset="100%" stop-color="#F4F6F2"/>
    </linearGradient>
    <clipPath id="clip-${id}">
      <rect width="${SIZE}" height="${SIZE}" rx="${RX}" ry="${RX}"/>
    </clipPath>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHAZAN — checks clipboard + smiles
// ═══════════════════════════════════════════════════════════════════════════════
function buildShazan(g) {
  return `${head('shazan')}
    <style>
      /* clipboard tilts forward as if reviewing tasks */
      #cb { transform-box: fill-box; transform-origin: center top;
            animation: cbTilt 4s ease-in-out infinite; }
      @keyframes cbTilt {
        0%,100% { transform: rotate(0deg) translateY(0px); }
        20%     { transform: rotate(-9deg) translateY(-24px); }
        50%     { transform: rotate(-7deg) translateY(-20px); }
        75%     { transform: rotate(-9deg) translateY(-24px); }
        88%     { transform: rotate(-2deg) translateY(-6px); }
      }
      /* smile fades in while clipboard is raised */
      #smile { animation: smFade 4s ease-in-out infinite; opacity:0; }
      @keyframes smFade {
        0%,18%  { opacity: 0; }
        32%,78% { opacity: 1; }
        92%,100%{ opacity: 0; }
      }
      /* checkmark tick appears on clipboard */
      #tick { animation: tickPop 4s ease-in-out infinite; opacity:0;
              transform-box: fill-box; transform-origin: center center; }
      @keyframes tickPop {
        0%,22%  { opacity:0; transform:scale(0.4); }
        38%,78% { opacity:1; transform:scale(1); }
        90%,100%{ opacity:0; transform:scale(0.4); }
      }
    </style>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg-shazan)" rx="${RX}" ry="${RX}"/>
  <g clip-path="url(#clip-shazan)">
${gWrap('hat-s', g.hat)}
${gWrap('face-s', g.face)}
${gWrap('body-s', g.body)}
${gWrap('cb', g.clipboard)}
    <!-- smile overlay: covers neutral mouth, adds smile corners + rosy cheeks -->
    <g id="smile">
      <rect x="448" y="512" width="${S}" height="${S}" fill="#E8C19C"/>
      <rect x="512" y="512" width="${S}" height="${S}" fill="#E8C19C"/>
      <rect x="256" y="512" width="${S}" height="${S}" fill="#1A2E2A"/>
      <rect x="704" y="512" width="${S}" height="${S}" fill="#1A2E2A"/>
      <rect x="128" y="448" width="${S}" height="${S}" fill="#C85A7C" opacity="0.55"/>
      <rect x="832" y="448" width="${S}" height="${S}" fill="#C85A7C" opacity="0.55"/>
    </g>
    <!-- checkmark on clipboard screen: three pixels forming a ✓ -->
    <g id="tick">
      <rect x="320" y="768" width="${S}" height="${S}" fill="#1A2E2A"/>
      <rect x="384" y="832" width="${S}" height="${S}" fill="#1A2E2A"/>
      <rect x="448" y="768" width="${S}" height="${S}" fill="#1A2E2A"/>
      <rect x="512" y="704" width="${S}" height="${S}" fill="#1A2E2A"/>
    </g>
  </g>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// KANIKA — cropped viewBox + confidence bounce + binocular sparkle
// ═══════════════════════════════════════════════════════════════════════════════
function buildKanika(g) {
  // Crop: chop top empty row (y=0-64) and a bit of bottom → viewBox starts at y=64
  // This zooms in ~6% making her look more prominently framed
  const vb = `0 64 1024 960`;
  return `${head('kanika', vb)}
    <style>
      /* confident pro-trekker subtle bounce */
      #char-k { animation: confBounce 2.8s ease-in-out infinite; }
      @keyframes confBounce {
        0%,100% { transform: translateY(0px); }
        45%     { transform: translateY(-18px); }
        55%     { transform: translateY(-20px); }
        70%     { transform: translateY(-4px); }
      }
      /* golden sparkle near binocular lens */
      #sparkle-k { animation: sparkSpin 2.8s ease-in-out infinite;
                   transform-box: fill-box; transform-origin: center center; }
      @keyframes sparkSpin {
        0%,35%  { opacity: 0; transform: scale(0) rotate(0deg); }
        50%,60% { opacity: 1; transform: scale(1) rotate(45deg); }
        80%,100%{ opacity: 0; transform: scale(0) rotate(90deg); }
      }
    </style>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg-kanika)" rx="${RX}" ry="${RX}"/>
  <g clip-path="url(#clip-kanika)">
    <g id="char-k">
${gWrap('hat-k', g.hat)}
${gWrap('face-k', g.face)}
${gWrap('body-k', g.body)}
      <!-- golden star sparkle at binocular lens position -->
      <g id="sparkle-k">
        <rect x="480" y="400" width="32" height="96" fill="#E8B867"/>
        <rect x="432" y="448" width="96" height="32" fill="#E8B867"/>
        <rect x="448" y="416" width="64" height="64" fill="#FFFFFF" opacity="0.8"/>
      </g>
    </g>
  </g>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SALONI — blink + amazed + steam from mug
// ═══════════════════════════════════════════════════════════════════════════════
function buildSaloni(g) {
  // Eye whites bounding boxes:
  // Left eye:  x=320-384, y=384-512 (cols 5-6 rows 6-7)
  // Right eye: x=640-704, y=384-512 (cols 10-11 rows 6-7)
  // Steam rises from above mug (mug center ~x=448, y=640)
  return `${head('saloni')}
    <style>
      /* eyelid slams shut then opens — wide-eyed blink */
      #lid-l, #lid-r {
        transform-box: fill-box;
        transform-origin: center top;
        animation: blink 3.5s ease-in-out infinite;
      }
      #lid-r { animation-delay: 0.04s; } /* tiny offset for realism */
      @keyframes blink {
        0%,70%,100% { transform: scaleY(0); }
        76%,86%     { transform: scaleY(1); }
      }
      /* steam particles float upward from mug */
      .stm { animation: steamRise 2.2s ease-out infinite; opacity: 0; }
      .stm2 { animation-delay: 0.7s; }
      .stm3 { animation-delay: 1.4s; }
      @keyframes steamRise {
        0%   { transform: translateY(0)   translateX(0)   scale(1);   opacity: 0.75; }
        40%  { transform: translateY(-80px)  translateX(8px)  scale(0.9); opacity: 0.6; }
        70%  { transform: translateY(-150px) translateX(-6px) scale(0.7); opacity: 0.3; }
        100% { transform: translateY(-220px) translateX(4px)  scale(0.4); opacity: 0; }
      }
    </style>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg-saloni)" rx="${RX}" ry="${RX}"/>
  <g clip-path="url(#clip-saloni)">
${gWrap('hat-sal', g.hat)}
${gWrap('face-sal', g.face)}
${gWrap('eyes-sal', g.eyes)}
${gWrap('body-sal', g.body)}
${gWrap('mug-sal', g.mug)}
    <!-- pink eyelids slide down to blink -->
    <rect id="lid-l" x="320" y="384" width="128" height="128" fill="#C85A7C"/>
    <rect id="lid-r" x="640" y="384" width="128" height="128" fill="#C85A7C"/>
    <!-- steam rising from cocoa mug (mug center ~x=440, top ~y=640) -->
    <ellipse class="stm"  cx="400" cy="640" rx="18" ry="12" fill="#F4F6F2"/>
    <ellipse class="stm stm2" cx="460" cy="630" rx="14" ry="10" fill="#F4F6F2"/>
    <ellipse class="stm stm3" cx="520" cy="640" rx="16" ry="11" fill="#F4F6F2"/>
  </g>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANMOL — raises camera + photo flash
// ═══════════════════════════════════════════════════════════════════════════════
function buildAnmol(g) {
  return `${head('anmol')}
    <style>
      /* phone lifts up and tilts like raising a camera */
      #phone-a {
        transform-box: fill-box;
        transform-origin: center bottom;
        animation: liftCam 3.5s ease-in-out infinite;
      }
      @keyframes liftCam {
        0%,45%,100% { transform: translate(0,0) rotate(0deg); }
        60%          { transform: translate(0,-140px) rotate(18deg); }
        68%          { transform: translate(0,-148px) rotate(14deg); }
        80%          { transform: translate(0,-140px) rotate(18deg); }
        92%          { transform: translate(0,-20px) rotate(3deg); }
      }
      /* full-canvas white flash when shutter fires */
      #flash-a { animation: camFlash 3.5s ease-in-out infinite; opacity: 0; pointer-events: none; }
      @keyframes camFlash {
        0%,62%,100% { opacity: 0; }
        65%          { opacity: 1; }
        70%          { opacity: 0.4; }
        74%          { opacity: 0; }
      }
      /* four-point sparkle burst at camera lens area */
      #burst-a { animation: burstPop 3.5s ease-in-out infinite; opacity: 0;
                 transform-box: fill-box; transform-origin: center center; }
      @keyframes burstPop {
        0%,60%,100% { opacity: 0; transform: scale(0.2); }
        66%          { opacity: 1; transform: scale(1.2); }
        72%          { opacity: 0; transform: scale(1.6); }
      }
    </style>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg-anmol)" rx="${RX}" ry="${RX}"/>
  <g clip-path="url(#clip-anmol)">
${gWrap('hat-a', g.hat)}
${gWrap('face-a', g.face)}
${gWrap('body-a', g.body)}
${gWrap('phone-a', g.phone)}
    <!-- 4-point star burst at lens (phone upper area, approx x=440,y=690 when raised) -->
    <g id="burst-a">
      <rect x="416" y="534" width="16" height="64"  fill="#FFFDE7"/>
      <rect x="386" y="564" width="64" height="16"  fill="#FFFDE7"/>
      <rect x="424" y="548" width="16" height="32"  fill="#FFFFFF" opacity="0.9"/>
    </g>
    <!-- white flash overlay (rounded to match card) -->
    <rect id="flash-a" width="${SIZE}" height="${SIZE}" fill="white" rx="${RX}" ry="${RX}"/>
  </g>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// YASH — neon headphone glow + laptop screen activity
// ═══════════════════════════════════════════════════════════════════════════════
function buildYash(g) {
  return `${head('yash')}
    <style>
      /* cyan neon pulse on headphone arc */
      #hp {
        filter: drop-shadow(0 0 6px #5FB0C2);
        animation: neonGlow 1.6s ease-in-out infinite;
      }
      @keyframes neonGlow {
        0%,100% { filter: drop-shadow(0 0 4px #5FB0C2) drop-shadow(0 0 8px #3A8A9E); }
        50%     { filter: drop-shadow(0 0 14px #5FB0C2) drop-shadow(0 0 28px #5FB0C2) drop-shadow(0 0 48px #B8D4E0); }
      }
      /* laptop screen brightens/dims like active terminal */
      #scr {
        animation: scrPulse 2.1s ease-in-out infinite;
      }
      @keyframes scrPulse {
        0%,100% { filter: brightness(1) saturate(1); }
        30%     { filter: brightness(1.5) saturate(1.4); }
        55%     { filter: brightness(0.8) saturate(0.9); }
        75%     { filter: brightness(1.6) saturate(1.5); }
      }
      /* scrolling code bar — a thin rect sweeping across screen */
      #codeline {
        animation: codeSweep 2.1s linear infinite;
      }
      @keyframes codeSweep {
        0%   { transform: translateY(0);   opacity: 0.9; }
        100% { transform: translateY(192px); opacity: 0; }
      }
    </style>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg-yash)" rx="${RX}" ry="${RX}"/>
  <g clip-path="url(#clip-yash)">
${gWrap('hp', g.headphones)}
${gWrap('face-y', g.face)}
${gWrap('body-y', g.body)}
${gWrap('scr', g.screen)}
    <!-- scanning code line sweeping down the laptop screen -->
    <rect id="codeline" x="192" y="768" width="576" height="16" fill="#5FB0C2" opacity="0.7" rx="4"/>
  </g>
</svg>`;
}

// ─── Assemble & write ─────────────────────────────────────────────────────────
const BUILDERS = { shazan: buildShazan, kanika: buildKanika,
                   saloni: buildSaloni, anmol: buildAnmol, yash: buildYash };
const OUT = path.join(__dirname, 'Images');

for (const [id, build] of Object.entries(BUILDERS)) {
  const groups = buildGroups(id);
  const svg    = build(groups);
  const file   = path.join(OUT, `${id}-pixel.svg`);
  fs.writeFileSync(file, svg, 'utf8');
  console.log(`✓ ${id}-pixel.svg`);
}
console.log('\nAll 5 animated pixel avatars written.');
