/* ===== BASECAMP LEDGER — app.js ===== */
const MEMBERS=[
  {id:'shazan',name:'Shazan',tagline:'Budding Vlogger'},
  {id:'kanika',name:'Kanika',tagline:'Exquisite Being'},
  {id:'saloni',name:'Saloni',tagline:'Newbie to mountains'},
  {id:'anmol',name:'Anmol',tagline:'Instagramable, CEO'},
  {id:'yash',name:'Yash',tagline:'Adrenaline Junkie'}
];
const CATEGORIES=['Transport','Stay','Food','Permits','Gear','Misc'];
const CAT_ICONS={Transport:'🚌',Stay:'🏕️',Food:'🍜',Permits:'📋',Gear:'🎒',Misc:'📦'};
const BUDGET=50000;
const CIRC=2*Math.PI*78; // 489.8

// Palettes for pixel avatars
const PAL={
  shazan:{k:'#1A2E2A',s:'#E8C19C',h:'#D4973A',c:'#8B5A2B',a:'#3A8A9E',g:'#F4F6F2',r:'#C85A7C'},
  kanika:{k:'#1A2E2A',s:'#E8C19C',h:'#6B8E4E',c:'#3D5C42',a:'#1F5866',g:'#E8B867',r:'#C85A7C'},
  saloni:{k:'#1A2E2A', p:'#F48FB1', q:'#F8BBD0', b:'#5D4037', s:'#FFE0B2', r:'#FFAB91', f:'#E53935', c:'#00BFA5', w:'#E0F2F1', m:'#6D4C41', e:'#FFFFFF', d:'#000000', h:'#F06292'},
  anmol:{k:'#1A2E2A',s:'#E8C19C',h:'#2A2A2E',c:'#3A8A9E',a:'#D4973A',g:'#F2D2B0',r:'#C85A7C'},
  yash:{k:'#1A2E2A',s:'#E8C19C',h:'#2A2A2E',c:'#8B5FBF',a:'#5FB0C2',g:'#E8B867',r:'#3A8A9E'}
};
const SPRITES={
  shazan:[
    '................','....kkkkkk......','...khhhhhhk.....','..khhhhhhhhk....','..khhhhhhhhhk...',
    '..kkkssssskkk..','..kskssksskksk.','..kssssskssssk.','..ksssskkssssk.','..kkcccccccckk.',
    '.kccckaaaakcck.','.kccakggggakck.','.kccakgkkgakck.','.kccakggggakck.','.kcckaaaaakcck.',
    '..kk.......k...'
  ],
  kanika:[
    '................','...khhhhhhk.....','..khhhhghhhk....','..khhhhhhhhhk..','..khhhhhhhhhk..',
    '..kkkssssskkk..','..ksaaksskaaks.','..ksaggksgagks.','..ksaaksskaaks.','..ksskkkkkkssk.',
    '..kssssssssssk.','..kccccccccckk.','.kcackccccckcck','.kcack.....ckk.','.kcack.....kk..',
    '..kk...........'
  ],
  saloni:[
    '......khhk......',
    '.....kppppk.....',
    '...kkpqpppqkk...',
    '..kbbppppppbbk..',
    '.kbbssssssssbbk.',
    '.kbsdeessdeesbk.',
    '.kbseesssseesbk.',
    '..kbrssddssrbk..',
    '...kkffffffkk...',
    '..kcffffffffck..',
    '.kwwfwwwwwwfwwk.',
    '.kcwssemmeesswck.',
    '.kcwwsmmmmswwck.',
    '..kccmmmmmmcck..',
    '..kwwmmmmmmwwk..',
    '...kkkkkkkkkk...'
  ],
  anmol:[
    '................','....kkkkkk......','...khhhhhhk.....','..khhhhhhhhk....','..khhhhhhhhhk..',
    '..kkkssssskkk..','..kkkkkskkkkksk','..khkhkskhkhksk','..kssskkkksssk.','..kssssrrsssssk',
    '..kkcccccccckk.','..kcccaaaaccck.','..kcccagggackk.','..kccaagggakck.','..kcckaggakckk.',
    '..kkk.kkkk.kk..'
  ],
  yash:[
    '................','...khhhhhhk.....','..khhhhhhhhk....','..khhhkkkhhhhk.','..khhhhhhhhhk..',
    '..khccccccccsk.','..kcksskkssksk.','..kckgsskgsksk.','..kckkssskssssk','..kssssssssssk.',
    '..kccccccccckk.','.kaaaaaaaaaaak.','.kaggggggggggak','.kaggkgggkgggak','.kaaaaaaaaaaak.',
    '..k........k...'
  ]
};

// Animated SVG avatars (PNG embedded inside SVG with CSS animation overlays)
const AVATAR_IMGS={
  shazan:'Images/shazan-pixel.svg',
  kanika:'Images/kanika-pixel.svg',
  saloni:'Images/saloni-pixel.svg',
  yash:'Images/yash-pixel.svg',
  anmol:'Images/anmol-pixel.svg'
};

// Character-specific SVG animation overlays
function getAvatarOverlay(id,size){
  if(size<48) return '';
  const S='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:visible;z-index:10';

  // Shazan — warm smile glow on face + green checkmark pops up from clipboard area
  if(id==='shazan') return `<svg viewBox="0 0 100 100" style="${S}">
    <defs>
      <radialGradient id="sg" cx="50%" cy="38%" r="38%">
        <stop offset="0%" stop-color="#FFD88A" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#FFD88A" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- warm smile glow on face, fades in while leaning forward -->
    <ellipse cx="50" cy="38" rx="28" ry="18" fill="url(#sg)" opacity="0">
      <animate attributeName="opacity" values="0;0;0.9;0.9;0.9;0" dur="4s" repeatCount="indefinite"/>
    </ellipse>
    <!-- checkmark badge pops from clipboard area -->
    <g opacity="0">
      <circle cx="74" cy="68" r="9" fill="#3CB87A" stroke="white" stroke-width="1.2"/>
      <path d="M69,68 L73,72 L79,63" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <animate attributeName="opacity" values="0;0;0;1;1;1;0" dur="4s" repeatCount="indefinite"/>
      <animateTransform attributeName="transform" type="translate" values="0,6;0,6;0,6;0,0;0,0;0,0;0,6" dur="4s" repeatCount="indefinite"/>
    </g>
  </svg>`;

  // Kanika — confident sparkle stars + green pro-trekker aura
  if(id==='kanika') return `<svg viewBox="0 0 100 100" style="${S}">
    <defs>
      <radialGradient id="kg" cx="50%" cy="42%" r="50%">
        <stop offset="0%" stop-color="#6B8E4E" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#6B8E4E" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- green confidence aura -->
    <ellipse cx="50" cy="42" rx="40" ry="35" fill="url(#kg)" opacity="0">
      <animate attributeName="opacity" values="0;0.4;0.6;0.4;0" dur="2.8s" repeatCount="indefinite"/>
    </ellipse>
    <!-- star sparkle 1 — near binoculars -->
    <g opacity="0">
      <path d="M78,48 L79.5,52 L83,48 L79.5,44 Z" fill="#FFD700"/>
      <path d="M76,48 L83,48 M79.5,44.5 L79.5,51.5" stroke="#FFD700" stroke-width="1" stroke-linecap="round"/>
      <animate attributeName="opacity" values="0;0;0;1;0.8;0" dur="2.8s" repeatCount="indefinite"/>
      <animateTransform attributeName="transform" type="scale" values="0.4;0.4;0.4;1.2;1;0.4" dur="2.8s" additive="sum" repeatCount="indefinite"/>
    </g>
    <!-- star sparkle 2 — offset timing -->
    <g opacity="0">
      <path d="M18,30 L19,33 L22,30 L19,27 Z" fill="#E8B867"/>
      <path d="M16.5,30 L22,30 M19,27.5 L19,32.5" stroke="#E8B867" stroke-width="0.8" stroke-linecap="round"/>
      <animate attributeName="opacity" values="0;0;0;0;1;0" dur="2.8s" begin="1.4s" repeatCount="indefinite"/>
    </g>
  </svg>`;

  // Saloni — eyelid blink overlay on eyes + steam from mug bottom
  if(id==='saloni') return `<svg viewBox="0 0 100 100" style="${S}">
    <!-- LEFT eyelid — slides down over left eye area -->
    <rect x="26" y="34" width="18" height="10" rx="5" fill="#F2C5A0" opacity="0">
      <animate attributeName="opacity" values="0;0;0;0;1;1;0;0" dur="4s" repeatCount="indefinite"/>
      <animate attributeName="height" values="0;0;0;0;10;10;0;0" dur="4s" repeatCount="indefinite"/>
    </rect>
    <!-- RIGHT eyelid -->
    <rect x="56" y="34" width="18" height="10" rx="5" fill="#F2C5A0" opacity="0">
      <animate attributeName="opacity" values="0;0;0;0;1;1;0;0" dur="4s" begin="0.05s" repeatCount="indefinite"/>
      <animate attributeName="height" values="0;0;0;0;10;10;0;0" dur="4s" begin="0.05s" repeatCount="indefinite"/>
    </rect>
    <!-- steam puff 1 -->
    <circle cx="40" cy="80" r="5" fill="white" opacity="0">
      <animate attributeName="cy"      values="80;58;42"      dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;0.75;0"      dur="2s" repeatCount="indefinite"/>
      <animate attributeName="r"       values="4;6;3"         dur="2s" repeatCount="indefinite"/>
    </circle>
    <!-- steam puff 2 (delayed) -->
    <circle cx="50" cy="80" r="4" fill="white" opacity="0">
      <animate attributeName="cy"      values="80;54;38"      dur="2.3s" begin="0.7s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;0.65;0"      dur="2.3s" begin="0.7s" repeatCount="indefinite"/>
      <animate attributeName="r"       values="3;5;2"         dur="2.3s" begin="0.7s" repeatCount="indefinite"/>
    </circle>
    <!-- steam puff 3 -->
    <circle cx="60" cy="80" r="4" fill="white" opacity="0">
      <animate attributeName="cy"      values="80;56;40"      dur="1.9s" begin="1.3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;0.7;0"       dur="1.9s" begin="1.3s" repeatCount="indefinite"/>
      <animate attributeName="r"       values="3;5;2"         dur="1.9s" begin="1.3s" repeatCount="indefinite"/>
    </circle>
  </svg>`;

  // Yash — cyan neon glow at headphone band + screen-sweep bar + music notes
  if(id==='yash') return `<svg viewBox="0 0 100 100" style="${S}">
    <defs>
      <radialGradient id="nhg" cx="50%" cy="12%" r="45%">
        <stop offset="0%" stop-color="#5FB0C2" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="#5FB0C2" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- neon cyan halo at headphone arc -->
    <ellipse cx="50" cy="12" rx="38" ry="18" fill="url(#nhg)" opacity="0">
      <animate attributeName="opacity" values="0.15;0.7;0.15" dur="1.6s" repeatCount="indefinite"/>
    </ellipse>
    <!-- neon left ear-cup glow -->
    <circle cx="16" cy="32" r="7" fill="none" stroke="#5FB0C2" stroke-width="2" opacity="0">
      <animate attributeName="opacity" values="0.1;0.7;0.1" dur="1.6s" repeatCount="indefinite"/>
    </circle>
    <!-- neon right ear-cup glow -->
    <circle cx="84" cy="32" r="7" fill="none" stroke="#5FB0C2" stroke-width="2" opacity="0">
      <animate attributeName="opacity" values="0.1;0.7;0.1" dur="1.6s" repeatCount="indefinite"/>
    </circle>
    <!-- screen activity sweep bar -->
    <rect x="22" y="74" width="56" height="4" rx="2" fill="#5FB0C2" opacity="0">
      <animate attributeName="opacity" values="0;0.55;0" dur="2.1s" repeatCount="indefinite"/>
      <animate attributeName="y"       values="72;80;72"  dur="2.1s" repeatCount="indefinite"/>
    </rect>
    <!-- music note 1 -->
    <text x="76" y="22" font-size="11" fill="#5FB0C2" opacity="0" font-family="serif">♪
      <animate attributeName="opacity" values="0;0;0.9;0" dur="2.5s" repeatCount="indefinite"/>
      <animateTransform attributeName="transform" type="translate" values="0,0;0,0;-7,-14" dur="2.5s" repeatCount="indefinite"/>
    </text>
    <!-- music note 2 -->
    <text x="82" y="28" font-size="9" fill="#3A8A9E" opacity="0" font-family="serif">♫
      <animate attributeName="opacity" values="0;0;0;0.8;0" dur="3s" begin="0.8s" repeatCount="indefinite"/>
      <animateTransform attributeName="transform" type="translate" values="0,0;0,0;0,0;-9,-18" dur="3s" begin="0.8s" repeatCount="indefinite"/>
    </text>
  </svg>`;

  // Anmol — full-frame photo flash + 4-point sparkle burst at camera
  if(id==='anmol') return `<svg viewBox="0 0 100 100" style="${S}">
    <!-- full-frame white flash when shutter fires -->
    <rect x="0" y="0" width="100" height="100" fill="white" rx="8" opacity="0">
      <animate attributeName="opacity" values="0;0;0;0;0;1;0.4;0" dur="5s" repeatCount="indefinite"/>
    </rect>
    <!-- 4-point star burst at camera/phone position -->
    <g opacity="0">
      <line x1="72" y1="58" x2="72" y2="46" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="72" y1="58" x2="72" y2="70" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="72" y1="58" x2="60" y2="58" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="72" y1="58" x2="84" y2="58" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="72" y1="58" x2="64" y2="50" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="72" y1="58" x2="80" y2="50" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="72" y1="58" x2="64" y2="66" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="72" y1="58" x2="80" y2="66" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <animate attributeName="opacity" values="0;0;0;0;0;0.9;0" dur="5s" repeatCount="indefinite"/>
      <animateTransform attributeName="transform" type="scale" values="0.3;0.3;0.3;0.3;0.3;1.3;0.3" dur="5s" additive="sum" repeatCount="indefinite"/>
    </g>
  </svg>`;

  return '';
}

// Animation CSS class per character
const AVATAR_ANIM_CLASS={
  shazan:'av-shazan-hop',
  kanika:'av-kanika-scan',
  saloni:'amazed-hop',
  yash:'av-yash-nod',
  anmol:'av-anmol-tilt'
};

function renderAvatar(id,size){
  size=size||48;
  // Use high-res image if available
  if(AVATAR_IMGS[id]){
    const animCls=AVATAR_ANIM_CLASS[id]||'';
    const overlay=getAvatarOverlay(id,size);
    return `<div class="${animCls}" style="width:100%;height:100%;position:relative;overflow:visible;">
      <object data="${AVATAR_IMGS[id]}" type="image/svg+xml" style="width:100%;height:100%;border-radius:inherit;display:block;pointer-events:none;" aria-label="${id}"></object>
      ${overlay}
    </div>`;
  }

  // Fallback to pixel art (Anmol)
  const sp=SPRITES[id], p=PAL[id]; if(!sp||!p) return '';
  const sc=Math.max(1,Math.floor(size/16));
  let rects='';
  for(let y=0;y<16;y++){
    const row=sp[y]||'';
    for(let x=0;x<row.length;x++){
      const ch=row[x]; if(ch==='.') continue;
      const col=p[ch]||'#000';
      rects+=`<rect x="${x*sc}" y="${y*sc}" width="${sc}" height="${sc}" fill="${col}"/>`;
    }
  }
  let anim='';
  const s=16*sc, h=sc;
  if(id==='anmol'&&size>=48){
    // Camera flash sparkle
    anim+=`<circle cx="${12*sc}" cy="${5*sc}" r="${h*0.6}" fill="#FFF" opacity="0">
      <animate attributeName="opacity" values="0;0;0;1;0;0" dur="5s" repeatCount="indefinite"/>
    </circle>`;
  }
  return `<svg viewBox="0 0 ${s} ${s}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${rects}${anim}</svg>`;
}

// Storage
function load(key){ try{return JSON.parse(localStorage.getItem('kareri:'+key))||[]}catch(e){return[]} }
function save(key,data){ localStorage.setItem('kareri:'+key,JSON.stringify(data)) }
function getMe(){ return localStorage.getItem('kareri:whoami') }
function setMe(id){ localStorage.setItem('kareri:whoami',id) }
function genId(prefix){ return prefix+'_'+Date.now()+'_'+Math.random().toString(36).slice(2,6) }

// Toast
function toast(msg){
  const c=document.getElementById('toast-container');
  const t=document.createElement('div'); t.className='toast'; t.textContent=msg;
  c.appendChild(t);
  setTimeout(()=>{t.style.opacity='0'},2200);
  setTimeout(()=>{t.remove()},2600);
}

// Confirm dialog
let confirmCb=null;
function showConfirm(title,msg,cb){
  document.getElementById('confirm-title').textContent=title;
  document.getElementById('confirm-msg').textContent=msg;
  document.getElementById('confirm-backdrop').classList.remove('hidden');
  confirmCb=cb;
}
document.getElementById('confirm-cancel').onclick=()=>{document.getElementById('confirm-backdrop').classList.add('hidden');confirmCb=null};
document.getElementById('confirm-ok').onclick=()=>{document.getElementById('confirm-backdrop').classList.add('hidden');if(confirmCb)confirmCb();confirmCb=null};

// Particles
function spawnParticles(){
  const c=document.getElementById('particles');
  for(let i=0;i<18;i++){
    const p=document.createElement('div'); p.className='particle';
    const sz=2+Math.random()*4;
    p.style.cssText=`left:${Math.random()*100}%;width:${sz}px;height:${sz}px;animation-duration:${10+Math.random()*14}s;animation-delay:${Math.random()*10}s;opacity:${0.3+Math.random()*0.4}`;
    c.appendChild(p);
  }
}

// Identity modal
function showIdentityModal(){
  const grid=document.getElementById('pick-grid');
  grid.innerHTML=MEMBERS.map(m=>`
    <div class="pick" data-id="${m.id}" id="pick-${m.id}">
      <div class="pick-avatar">${renderAvatar(m.id,56)}</div>
      <div class="pick-name">${m.name}</div>
      <div class="pick-tag">${m.tagline}</div>
    </div>`).join('');
  grid.querySelectorAll('.pick').forEach(el=>{
    el.onclick=()=>{
      setMe(el.dataset.id);
      document.getElementById('modal-backdrop').classList.add('hidden');
      boot();
    };
  });
  document.getElementById('modal-backdrop').classList.remove('hidden');
}

// Tab switching
function switchTab(viewId){
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.view===viewId));
  document.querySelectorAll('.view').forEach(v=>{
    const isActive=v.id===viewId;
    v.classList.toggle('active',isActive);
    if(isActive){v.style.animation='none';v.offsetHeight;v.style.animation='fadeIn 0.4s cubic-bezier(0.2,0.8,0.2,1)'}
  });
  renderView(viewId);
}
document.querySelectorAll('.tab').forEach(t=>{t.onclick=()=>switchTab(t.dataset.view)});

// Header who-pill
document.getElementById('who-pill').onclick=()=>showIdentityModal();

// ===== BALANCE CALCULATION =====
function calcBalances(){
  const expenses=load('expenses'), settlements=load('settlements');
  const bal={};
  MEMBERS.forEach(m=>bal[m.id]=0);
  expenses.forEach(e=>{
    bal[e.payerId]=(bal[e.payerId]||0)+e.amount;
    e.splits.forEach(s=>{bal[s.memberId]=(bal[s.memberId]||0)-s.amount});
  });
  settlements.forEach(s=>{
    bal[s.fromId]=(bal[s.fromId]||0)+s.amount;
    bal[s.toId]=(bal[s.toId]||0)-s.amount;
  });
  return bal;
}

function simplifyDebts(){
  const bal=calcBalances();
  const debtors=[],creditors=[];
  Object.entries(bal).forEach(([id,b])=>{
    if(b<-0.01)debtors.push({id,amt:Math.abs(b)});
    if(b>0.01)creditors.push({id,amt:b});
  });
  debtors.sort((a,b)=>b.amt-a.amt);
  creditors.sort((a,b)=>b.amt-a.amt);
  const result=[];
  let i=0,j=0;
  while(i<debtors.length&&j<creditors.length){
    const d=debtors[i],cr=creditors[j];
    const a=Math.min(d.amt,cr.amt);
    result.push({from:d.id,to:cr.id,amount:a});
    d.amt-=a;cr.amt-=a;
    if(d.amt<0.01)i++;
    if(cr.amt<0.01)j++;
  }
  return result;
}

// ===== ACTIVITY LOGGING =====
function logActivity(actorId,action,detail){
  const acts=load('activity');
  acts.unshift({id:genId('a'),actorId,action,detail,timestamp:Date.now()});
  save('activity',acts.slice(0,300));
}

// ===== RENDERING =====
function renderView(viewId){
  const me=getMe();if(!me)return;
  if(viewId==='v-home')renderHome();
  else if(viewId==='v-ledger')renderLedger();
  else if(viewId==='v-add')renderAddForm();
  else if(viewId==='v-settle')renderSettle();
  else if(viewId==='v-activity')renderActivityView();
}

function renderHome(){
  const expenses=load('expenses'), bal=calcBalances();
  const total=expenses.reduce((s,e)=>s+e.amount,0);
  const pct=Math.min(100,(total/BUDGET)*100);

  // Budget ring
  const offset=CIRC*(1-pct/100);
  document.getElementById('ring-fg').setAttribute('stroke-dashoffset',offset);
  document.getElementById('ring-pct').textContent=Math.round(pct)+'%';
  document.getElementById('ring-sub').textContent=`of ₹${BUDGET.toLocaleString()}`;
  document.getElementById('stat-spent').textContent='₹'+total.toLocaleString(undefined,{maximumFractionDigits:0});
  document.getElementById('stat-remaining').textContent='₹'+Math.max(0,BUDGET-total).toLocaleString(undefined,{maximumFractionDigits:0});

  // Category bars
  const catTotals={};
  CATEGORIES.forEach(c=>catTotals[c]=0);
  expenses.forEach(e=>catTotals[e.category]=(catTotals[e.category]||0)+e.amount);
  const maxCat=Math.max(1,...Object.values(catTotals));
  document.getElementById('cat-bars').innerHTML=CATEGORIES.map(c=>{
    const v=catTotals[c]||0;
    const w=Math.max(0,(v/maxCat)*100);
    return `<div class="cat-bar"><div class="cat-head"><span class="cat-name">${CAT_ICONS[c]} ${c}</span><span class="cat-val">₹${v.toLocaleString()}</span></div><div class="bar-track"><div class="fill" style="width:${w}%"></div></div></div>`;
  }).join('');

  // Crew balances
  document.getElementById('crew-grid').innerHTML=MEMBERS.map(m=>{
    const b=bal[m.id]||0;
    const cls=b>0.01?'bal-pos':b<-0.01?'bal-neg':'bal-zero';
    const txt=b>0.01?`gets ₹${b.toFixed(0)}`:b<-0.01?`owes ₹${Math.abs(b).toFixed(0)}`:'settled';
    return `<div class="member-card"><div class="pixel-avatar">${renderAvatar(m.id,56)}</div><div class="member-name">${m.name}</div><div class="member-tagline">${m.tagline}</div><div class="member-balance ${cls}">${txt}</div></div>`;
  }).join('');

  // Recent activity
  const acts=load('activity').slice(0,5);
  document.getElementById('recent-rows').innerHTML=acts.length?acts.map((a,i)=>{
    const actor=MEMBERS.find(m=>m.id===a.actorId)||{name:'?',id:'shazan'};
    return `<div class="activity-row" style="animation-delay:${i*0.04}s"><div class="row-avatar">${renderAvatar(actor.id,36)}</div><div class="row-body"><div class="row-title">${actor.name} ${a.action}</div><div class="row-meta">${a.detail} · ${timeAgo(a.timestamp)}</div></div></div>`;
  }).join(''):'<div class="empty-state">No activity yet — add your first expense!</div>';
}

function renderLedger(){
  const expenses=load('expenses');
  const filter=document.getElementById('filter-cat').value;
  const filtered=filter==='all'?expenses:expenses.filter(e=>e.category===filter);
  const sorted=filtered.sort((a,b)=>b.createdAt-a.createdAt);
  const me=getMe();
  document.getElementById('expense-rows').innerHTML=sorted.length?sorted.map((e,i)=>{
    const payer=MEMBERS.find(m=>m.id===e.payerId)||{name:'?',id:'shazan'};
    const catCls='cat-'+e.category.toLowerCase();
    const canEdit=me==='shazan'||e.createdBy===me;
    return `<div class="expense-row" style="animation-delay:${i*0.04}s">
      <div class="row-icon ${catCls}">${CAT_ICONS[e.category]||'📦'}</div>
      <div class="row-body"><div class="row-title">${e.description}</div><div class="row-meta">Paid by ${payer.name} · ${e.date} · ${e.splitMode}</div></div>
      <div class="row-amount">₹${e.amount.toLocaleString()}</div>
      ${canEdit?`<div class="row-actions"><button class="edit-btn" onclick="editExpense('${e.id}')">Edit</button><button onclick="deleteExpense('${e.id}')">Del</button></div>`:''}
    </div>`;
  }).join(''):'<div class="empty-state">No expenses recorded yet.</div>';
}
document.getElementById('filter-cat').onchange=()=>renderLedger();

function renderAddForm(){
  const payer=document.getElementById('f-payer');
  if(!payer.children.length){
    payer.innerHTML=MEMBERS.map(m=>`<option value="${m.id}">${m.name}</option>`).join('');
    payer.value=getMe()||'shazan';
  }
  if(!document.getElementById('f-date').value){
    document.getElementById('f-date').value=new Date().toISOString().slice(0,10);
  }
  updateSplitPreview();
}

function updateSplitPreview(){
  const amount=parseFloat(document.getElementById('f-amount').value)||0;
  const mode=document.querySelector('input[name="splitMode"]:checked').value;
  const container=document.getElementById('split-preview');
  if(amount<=0){container.innerHTML='';return}
  if(mode==='equal'){
    const each=(amount/MEMBERS.length);
    container.innerHTML=MEMBERS.map(m=>`<div class="split-item"><div class="sp-avatar">${renderAvatar(m.id,32)}</div><div class="sp-name">${m.name}</div><div class="sp-val">₹${each.toFixed(2)}</div></div>`).join('');
  } else {
    const ph=mode==='percent'?'%':mode==='shares'?'shares':'₹';
    container.innerHTML=MEMBERS.map(m=>`<div class="split-item"><div class="sp-avatar">${renderAvatar(m.id,32)}</div><div class="sp-name">${m.name}</div><input type="number" class="split-input" data-id="${m.id}" step="0.01" min="0" placeholder="${ph}" oninput="onSplitInput()"></div>`).join('');
  }
}
window.onSplitInput=function(){};
document.querySelectorAll('input[name="splitMode"]').forEach(r=>r.onchange=updateSplitPreview);
document.getElementById('f-amount').oninput=updateSplitPreview;

// Submit expense
document.getElementById('expense-form').onsubmit=function(ev){
  ev.preventDefault();
  const me=getMe();if(!me)return;
  const amount=parseFloat(document.getElementById('f-amount').value);
  const desc=document.getElementById('f-desc').value.trim();
  const date=document.getElementById('f-date').value;
  const category=document.getElementById('f-category').value;
  const payerId=document.getElementById('f-payer').value;
  const mode=document.querySelector('input[name="splitMode"]:checked').value;
  const editId=document.getElementById('edit-id').value;

  if(!desc||!amount||amount<=0){toast('Please fill all fields');return}

  let splits=[];
  if(mode==='equal'){
    const each=amount/MEMBERS.length;
    splits=MEMBERS.map(m=>({memberId:m.id,amount:each}));
  } else {
    const inputs=document.querySelectorAll('.split-input');
    let total=0;
    inputs.forEach(inp=>{total+=parseFloat(inp.value)||0});
    if(mode==='exact'&&Math.abs(total-amount)>0.01){toast('Exact amounts must sum to total');return}
    if(mode==='percent'&&Math.abs(total-100)>0.1){toast('Percentages must add up to 100%');return}
    if(mode==='shares'&&total<=0){toast('Total shares must be > 0');return}
    inputs.forEach(inp=>{
      const v=parseFloat(inp.value)||0;
      let a=0;
      if(mode==='exact')a=v;
      else if(mode==='percent')a=(v/100)*amount;
      else if(mode==='shares')a=(v/total)*amount;
      splits.push({memberId:inp.dataset.id,amount:a});
    });
  }

  const expenses=load('expenses');
  if(editId){
    const idx=expenses.findIndex(e=>e.id===editId);
    if(idx>=0){expenses[idx]={...expenses[idx],description:desc,amount,date,category,payerId,splitMode:mode,splits}}
    save('expenses',expenses);
    logActivity(me,'edited expense',`${desc} — ₹${amount}`);
    toast('Expense updated!');
  } else {
    expenses.push({id:genId('e'),description:desc,amount,payerId,category,date,splitMode:mode,splits,createdBy:me,createdAt:Date.now()});
    save('expenses',expenses);
    logActivity(me,'added expense',`${desc} — ₹${amount}`);
    toast('Expense added!');
  }

  document.getElementById('expense-form').reset();
  document.getElementById('edit-id').value='';
  document.getElementById('add-title').textContent='Record Expense';
  document.getElementById('btn-submit').textContent='Add Expense';
  document.getElementById('f-date').value=new Date().toISOString().slice(0,10);
  document.getElementById('f-payer').value=me;
  document.getElementById('split-preview').innerHTML='';
  switchTab('v-ledger');
};

// Edit expense
window.editExpense=function(id){
  const expenses=load('expenses');
  const e=expenses.find(x=>x.id===id);if(!e)return;
  document.getElementById('f-desc').value=e.description;
  document.getElementById('f-amount').value=e.amount;
  document.getElementById('f-date').value=e.date;
  document.getElementById('f-category').value=e.category;
  document.getElementById('f-payer').value=e.payerId;
  document.querySelector(`input[name="splitMode"][value="${e.splitMode}"]`).checked=true;
  document.getElementById('edit-id').value=e.id;
  document.getElementById('add-title').textContent='Edit Expense';
  document.getElementById('btn-submit').textContent='Update Expense';
  switchTab('v-add');
  updateSplitPreview();
};

// Delete expense
window.deleteExpense=function(id){
  showConfirm('Delete Expense','Are you sure you want to delete this expense?',()=>{
    let expenses=load('expenses');
    const e=expenses.find(x=>x.id===id);
    expenses=expenses.filter(x=>x.id!==id);
    save('expenses',expenses);
    if(e)logActivity(getMe(),'deleted expense',`${e.description} — ₹${e.amount}`);
    toast('Expense deleted');
    renderLedger();
    renderHome();
  });
};

// Settle view
function renderSettle(){
  const debts=simplifyDebts();
  document.getElementById('debt-rows').innerHTML=debts.length?debts.map((d,i)=>{
    const from=MEMBERS.find(m=>m.id===d.from)||{name:'?',id:'shazan'};
    const to=MEMBERS.find(m=>m.id===d.to)||{name:'?',id:'shazan'};
    return `<div class="debt-row" style="animation-delay:${i*0.04}s"><div class="row-avatar">${renderAvatar(from.id,36)}</div><div class="row-body"><div class="row-title">${from.name} <span class="debt-arrow">→</span> ${to.name}</div></div><div class="row-amount" style="color:var(--rhodo)">₹${d.amount.toFixed(0)}</div></div>`;
  }).join(''):'<div class="empty-state">All settled up! 🎉</div>';

  // Settle form selectors
  const sf=document.getElementById('s-from'),st=document.getElementById('s-to');
  if(!sf.children.length){
    sf.innerHTML=MEMBERS.map(m=>`<option value="${m.id}">${m.name}</option>`).join('');
    st.innerHTML=MEMBERS.map(m=>`<option value="${m.id}">${m.name}</option>`).join('');
    sf.value=getMe()||'shazan';
    st.value=MEMBERS.find(m=>m.id!==(getMe()||'shazan'))?.id||'kanika';
  }
  if(!document.getElementById('s-date').value)document.getElementById('s-date').value=new Date().toISOString().slice(0,10);
}

// Submit settlement
document.getElementById('settle-form').onsubmit=function(ev){
  ev.preventDefault();
  const me=getMe();if(!me)return;
  const fromId=document.getElementById('s-from').value;
  const toId=document.getElementById('s-to').value;
  const amount=parseFloat(document.getElementById('s-amount').value);
  const date=document.getElementById('s-date').value;
  if(fromId===toId){toast('From and To must be different');return}
  if(!amount||amount<=0){toast('Enter a valid amount');return}
  const settlements=load('settlements');
  settlements.push({id:genId('s'),fromId,toId,amount,date,createdBy:me,createdAt:Date.now()});
  save('settlements',settlements);
  logActivity(me,'recorded payment',`${MEMBERS.find(m=>m.id===fromId).name} paid ${MEMBERS.find(m=>m.id===toId).name} ₹${amount}`);
  toast('Payment recorded!');
  document.getElementById('settle-form').reset();
  document.getElementById('s-date').value=new Date().toISOString().slice(0,10);
  renderSettle();
  renderHome();
};

// Activity view
function renderActivityView(){
  const acts=load('activity');
  document.getElementById('activity-rows').innerHTML=acts.length?acts.map((a,i)=>{
    const actor=MEMBERS.find(m=>m.id===a.actorId)||{name:'?',id:'shazan'};
    return `<div class="activity-row" style="animation-delay:${i*0.04}s"><div class="row-avatar">${renderAvatar(actor.id,36)}</div><div class="row-body"><div class="row-title">${actor.name} ${a.action}</div><div class="row-meta">${a.detail} · ${timeAgo(a.timestamp)}</div></div></div>`;
  }).join(''):'<div class="empty-state">No activity yet.</div>';
}

// Export JSON
document.getElementById('btn-export').onclick=function(){
  const data={expenses:load('expenses'),settlements:load('settlements'),activity:load('activity')};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='basecamp-ledger-export.json';a.click();
  toast('Export downloaded!');
};

// Time ago helper
function timeAgo(ts){
  const s=Math.floor((Date.now()-ts)/1000);
  if(s<60)return 'just now';
  if(s<3600)return Math.floor(s/60)+'m ago';
  if(s<86400)return Math.floor(s/3600)+'h ago';
  return Math.floor(s/86400)+'d ago';
}

// Sync indicator
function updateSync(){document.getElementById('sync-text').textContent='updated '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}

// ===== BOOT =====
function boot(){
  const me=getMe();
  if(!me){showIdentityModal();return}
  document.getElementById('modal-backdrop').classList.add('hidden');
  // Update who-pill
  document.getElementById('who-avatar').innerHTML=renderAvatar(me,36);
  document.getElementById('who-name').textContent=MEMBERS.find(m=>m.id===me)?.name||'?';
  // Render active view
  const activeTab=document.querySelector('.tab.active');
  renderView(activeTab?.dataset?.view||'v-home');
  updateSync();
}

// Init
spawnParticles();
boot();
// Poll every 10s
setInterval(()=>{if(getMe()){const av=document.querySelector('.tab.active');renderView(av?.dataset?.view||'v-home');updateSync()}},10000);
