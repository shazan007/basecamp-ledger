/* ===== KARERI LAKE SEASONAL DOODLE ENGINE ===== */
(function(){
  const SEASONS=['winter','spring','summer','autumn'];
  const LABELS={winter:'❄️ Winter',spring:'🌸 Spring',summer:'☀️ Summer',autumn:'🍂 Autumn'};
  const CYCLE_MS=12000;
  let currentIdx=0;

  function winterScene(){
    // Frozen lake, snow mountains, bare trees, snowflakes, yak
    return `<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
      <!-- Sky gradient -->
      <defs>
        <linearGradient id="wsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#C8DDE8"/><stop offset="100%" stop-color="#E8F0F4"/>
        </linearGradient>
        <linearGradient id="wmtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#D8E8F0"/><stop offset="100%" stop-color="#F0F4F8"/>
        </linearGradient>
      </defs>
      <rect width="220" height="220" fill="url(#wsky)"/>
      <!-- Mountains -->
      <path d="M0,100 L40,55 L70,80 L110,40 L150,70 L180,50 L220,90 L220,140 L0,140Z" fill="url(#wmtn)" opacity="0.8"/>
      <path d="M110,40 L115,42 L112,50" fill="white" opacity="0.6"/>
      <path d="M40,55 L45,58 L42,65" fill="white" opacity="0.5"/>
      <!-- Snow ground -->
      <rect x="0" y="140" width="220" height="80" fill="#F0F4F8" rx="0"/>
      <!-- Frozen lake -->
      <ellipse cx="110" cy="160" rx="55" ry="14" fill="#B8D4E0" opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="4s" repeatCount="indefinite"/>
      </ellipse>
      <line x1="90" y1="157" x2="100" y2="162" stroke="white" stroke-width="0.5" opacity="0.5"/>
      <line x1="115" y1="155" x2="125" y2="160" stroke="white" stroke-width="0.5" opacity="0.4"/>
      <!-- Bare tree left -->
      <g style="animation:windSway 8s ease-in-out infinite" transform-origin="30 140">
        <line x1="30" y1="140" x2="30" y2="105" stroke="#8B7D6B" stroke-width="2.5"/>
        <line x1="30" y1="115" x2="20" y2="100" stroke="#8B7D6B" stroke-width="1.2"/>
        <line x1="30" y1="110" x2="40" y2="95" stroke="#8B7D6B" stroke-width="1.2"/>
        <line x1="30" y1="120" x2="22" y2="112" stroke="#8B7D6B" stroke-width="0.8"/>
        <circle cx="20" cy="100" r="3" fill="white" opacity="0.5"/>
        <circle cx="40" cy="95" r="2.5" fill="white" opacity="0.4"/>
      </g>
      <!-- Bare tree right -->
      <g style="animation:windSway 10s ease-in-out infinite;animation-delay:2s" transform-origin="185 140">
        <line x1="185" y1="140" x2="185" y2="110" stroke="#8B7D6B" stroke-width="2"/>
        <line x1="185" y1="120" x2="175" y2="108" stroke="#8B7D6B" stroke-width="1"/>
        <line x1="185" y1="118" x2="195" y2="105" stroke="#8B7D6B" stroke-width="1"/>
        <circle cx="175" cy="108" r="2" fill="white" opacity="0.4"/>
      </g>
      <!-- Yak walking -->
      <g style="animation:yakWalk 20s ease-in-out infinite">
        <ellipse cx="70" cy="173" rx="8" ry="5" fill="#4A3A2A"/>
        <circle cx="63" cy="169" r="3.5" fill="#4A3A2A"/>
        <circle cx="62" cy="167" r="0.5" fill="white"/>
        <line x1="65" y1="178" x2="65" y2="183" stroke="#4A3A2A" stroke-width="1.5"/>
        <line x1="75" y1="178" x2="75" y2="183" stroke="#4A3A2A" stroke-width="1.5"/>
        <line x1="60" y1="169" x2="57" y2="166" stroke="#6B5B4B" stroke-width="0.8"/>
        <line x1="60" y1="168" x2="57" y2="164" stroke="#6B5B4B" stroke-width="0.8"/>
      </g>
      <!-- Snowflakes -->
      ${Array.from({length:12},(_,i)=>{
        const x=15+Math.random()*190, d=4+Math.random()*6, del=Math.random()*8;
        const r=1+Math.random()*2;
        return `<circle cx="${x}" cy="0" r="${r}" fill="white" opacity="0" style="animation:snowfall ${d}s linear ${del}s infinite"/>`;
      }).join('')}
      <!-- Snowflake stars -->
      ${Array.from({length:5},(_,i)=>{
        const x=20+Math.random()*180, d=6+Math.random()*5, del=Math.random()*6;
        return `<text x="${x}" y="0" font-size="6" fill="white" opacity="0" style="animation:snowfallSlow ${d}s linear ${del}s infinite">✻</text>`;
      }).join('')}
    </svg>`;
  }

  function springScene(){
    // Green meadows, rhododendrons, butterflies, birds, clear lake
    return `<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#87CEEB"/><stop offset="100%" stop-color="#D4F0FF"/>
        </linearGradient>
        <linearGradient id="smtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#8FAC6D"/><stop offset="40%" stop-color="#6B8E4E"/><stop offset="100%" stop-color="#4A7A3A"/>
        </linearGradient>
      </defs>
      <rect width="220" height="220" fill="url(#ssky)"/>
      <!-- Snow-capped mountains -->
      <path d="M0,110 L35,60 L65,85 L100,45 L140,75 L175,55 L220,95 L220,145 L0,145Z" fill="url(#smtn)" opacity="0.8"/>
      <path d="M100,45 L105,48 L102,58" fill="white" opacity="0.7"/>
      <path d="M175,55 L180,58 L177,65" fill="white" opacity="0.6"/>
      <!-- Green meadow -->
      <rect x="0" y="145" width="220" height="75" fill="#7DB356" rx="0"/>
      <ellipse cx="110" cy="145" rx="110" ry="8" fill="#8FC46A" opacity="0.6"/>
      <!-- Lake -->
      <ellipse cx="115" cy="162" rx="45" ry="12" fill="#5FB0C2" opacity="0.6"/>
      <ellipse cx="115" cy="160" rx="35" ry="7" fill="#87CEEB" opacity="0.3"/>
      <!-- Rhododendron bushes -->
      ${[{x:25,y:148},{x:50,y:150},{x:170,y:148},{x:195,y:152}].map(b=>
        `<g style="animation:flowerBloom ${3+Math.random()*2}s ease-in-out infinite" transform-origin="${b.x} ${b.y}">
          <circle cx="${b.x}" cy="${b.y}" r="8" fill="#4A7A3A" opacity="0.7"/>
          <circle cx="${b.x-3}" cy="${b.y-3}" r="3" fill="#C85A7C" opacity="0.8"/>
          <circle cx="${b.x+3}" cy="${b.y-2}" r="2.5" fill="#E89AAF" opacity="0.7"/>
          <circle cx="${b.x}" cy="${b.y-5}" r="2" fill="#C85A7C" opacity="0.9"/>
          <circle cx="${b.x+2}" cy="${b.y-4}" r="1.5" fill="#FF88AA" opacity="0.6"/>
        </g>`).join('')}
      <!-- Small flowers in meadow -->
      ${Array.from({length:8},(_,i)=>{
        const x=10+Math.random()*200, y=165+Math.random()*30;
        const c=['#C85A7C','#E89AAF','#FFD700','#FF8844','#FFFFFF'][Math.floor(Math.random()*5)];
        return `<circle cx="${x}" cy="${y}" r="1.5" fill="${c}" style="animation:flowerSway ${2+Math.random()*2}s ease-in-out ${Math.random()*2}s infinite" transform-origin="${x} ${y+5}"/>`;
      }).join('')}
      <!-- Butterflies -->
      ${[{x:60,y:90,c:'#E89AAF'},{x:150,y:80,c:'#FFD700'},{x:100,y:70,c:'#87CEEB'}].map((b,i)=>
        `<g style="animation:butterflyFloat ${5+i*1.5}s ease-in-out infinite" transform-origin="${b.x} ${b.y}">
          <ellipse cx="${b.x-3}" cy="${b.y}" rx="3" ry="2" fill="${b.c}" opacity="0.8" style="animation:butterflyWing 0.3s ease-in-out infinite"/>
          <ellipse cx="${b.x+3}" cy="${b.y}" rx="3" ry="2" fill="${b.c}" opacity="0.8" style="animation:butterflyWing 0.3s ease-in-out 0.15s infinite"/>
          <circle cx="${b.x}" cy="${b.y}" r="1" fill="#333"/>
        </g>`).join('')}
      <!-- Birds -->
      <g style="animation:birdFly 8s linear infinite">
        <path d="M20,50 Q25,45 30,50" fill="none" stroke="#333" stroke-width="1"/>
      </g>
      <g style="animation:birdFly 10s linear 2s infinite">
        <path d="M10,60 Q15,55 20,60" fill="none" stroke="#333" stroke-width="0.8"/>
      </g>
    </svg>`;
  }

  function summerScene(){
    // Bright sun, lush trees, tent, dragonflies, mirror lake
    return `<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="usky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4AA3DF"/><stop offset="100%" stop-color="#87CEEB"/>
        </linearGradient>
        <linearGradient id="umtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#5A8A3E"/><stop offset="100%" stop-color="#3A6A28"/>
        </linearGradient>
      </defs>
      <rect width="220" height="220" fill="url(#usky)"/>
      <!-- Sun -->
      <g transform="translate(180,35)">
        <circle r="14" fill="#FFD700" opacity="0.9">
          <animate attributeName="r" values="14;16;14" dur="4s" repeatCount="indefinite"/>
        </circle>
        <g style="animation:sunRays 20s linear infinite">
          ${Array.from({length:8},(_,i)=>{
            const a=i*45*Math.PI/180;
            return `<line x1="${Math.cos(a)*18}" y1="${Math.sin(a)*18}" x2="${Math.cos(a)*24}" y2="${Math.sin(a)*24}" stroke="#FFD700" stroke-width="1.5" opacity="0.5"/>`;
          }).join('')}
        </g>
      </g>
      <!-- Mountains -->
      <path d="M0,115 L30,65 L60,90 L95,50 L135,80 L170,55 L220,100 L220,150 L0,150Z" fill="url(#umtn)" opacity="0.75"/>
      <!-- Lush ground -->
      <rect x="0" y="148" width="220" height="72" fill="#4A8A2E"/>
      <ellipse cx="110" cy="148" rx="110" ry="6" fill="#5A9A3E" opacity="0.5"/>
      <!-- Mirror lake -->
      <ellipse cx="120" cy="165" rx="50" ry="13" fill="#3A8A9E" opacity="0.5"/>
      <ellipse cx="120" cy="163" rx="38" ry="8" fill="#5FB0C2" opacity="0.3"/>
      <!-- Ripples -->
      <circle cx="110" cy="165" r="3" fill="none" stroke="white" stroke-width="0.4" opacity="0">
        <animate attributeName="r" values="3;12" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.5;0" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="130" cy="163" r="2" fill="none" stroke="white" stroke-width="0.3" opacity="0">
        <animate attributeName="r" values="2;10" dur="3.5s" begin="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;0" dur="3.5s" begin="1.5s" repeatCount="indefinite"/>
      </circle>
      <!-- Lush trees -->
      ${[{x:30,y:130},{x:55,y:135},{x:175,y:132},{x:195,y:138}].map(t=>
        `<g style="animation:treeSway ${6+Math.random()*3}s ease-in-out infinite" transform-origin="${t.x} ${t.y+10}">
          <line x1="${t.x}" y1="${t.y+10}" x2="${t.x}" y2="${t.y-5}" stroke="#5A4A30" stroke-width="3"/>
          <circle cx="${t.x}" cy="${t.y-8}" r="10" fill="#3A7A22" opacity="0.85"/>
          <circle cx="${t.x-5}" cy="${t.y-4}" r="7" fill="#4A8A2E" opacity="0.7"/>
          <circle cx="${t.x+5}" cy="${t.y-5}" r="6" fill="#5A9A3E" opacity="0.6"/>
        </g>`).join('')}
      <!-- Tent -->
      <polygon points="90,185 100,170 110,185" fill="#D4973A" opacity="0.8"/>
      <line x1="100" y1="170" x2="100" y2="185" stroke="#C88A30" stroke-width="0.5"/>
      <rect x="96" y="180" width="4" height="5" fill="#8B5A2B" opacity="0.5"/>
      <!-- Dragonflies -->
      ${[{x:70,y:110},{x:140,y:95}].map((d,i)=>
        `<g style="animation:dragonfly ${6+i*2}s ease-in-out infinite" transform-origin="${d.x} ${d.y}">
          <line x1="${d.x-4}" y1="${d.y}" x2="${d.x+4}" y2="${d.y}" stroke="#5FB0C2" stroke-width="1"/>
          <circle cx="${d.x+5}" cy="${d.y}" r="1.2" fill="#3A8A9E"/>
          <line x1="${d.x}" y1="${d.y-3}" x2="${d.x+2}" y2="${d.y}" stroke="#B8D4E0" stroke-width="0.5" opacity="0.6"/>
          <line x1="${d.x}" y1="${d.y+3}" x2="${d.x+2}" y2="${d.y}" stroke="#B8D4E0" stroke-width="0.5" opacity="0.6"/>
        </g>`).join('')}
    </svg>`;
  }

  function autumnScene(){
    // Golden foliage, amber trees, falling leaves, campfire, clear lake
    return `<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="asky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#D4A06A"/><stop offset="50%" stop-color="#E8C8A0"/><stop offset="100%" stop-color="#F0DCC0"/>
        </linearGradient>
        <linearGradient id="amtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#8B7D4A"/><stop offset="100%" stop-color="#6B5D3A"/>
        </linearGradient>
      </defs>
      <rect width="220" height="220" fill="url(#asky)"/>
      <!-- Mountains -->
      <path d="M0,110 L40,60 L75,85 L105,48 L145,78 L180,58 L220,95 L220,148 L0,148Z" fill="url(#amtn)" opacity="0.65"/>
      <path d="M105,48 L110,52 L107,60" fill="#D8D0C0" opacity="0.5"/>
      <!-- Ground -->
      <rect x="0" y="146" width="220" height="74" fill="#8B7A50"/>
      <ellipse cx="110" cy="146" rx="110" ry="5" fill="#9B8A60" opacity="0.5"/>
      <!-- Lake -->
      <ellipse cx="115" cy="165" rx="40" ry="11" fill="#5FB0C2" opacity="0.4"/>
      <ellipse cx="115" cy="163" rx="28" ry="6" fill="#87CEEB" opacity="0.2"/>
      <!-- Autumn trees -->
      ${[
        {x:30,y:125,c1:'#D4973A',c2:'#E8B867',c3:'#C88030'},
        {x:55,y:130,c1:'#CC4422',c2:'#E86644',c3:'#AA3318'},
        {x:170,y:128,c1:'#E8B867',c2:'#FFD700',c3:'#D4973A'},
        {x:195,y:133,c1:'#CC6633',c2:'#E88855',c3:'#AA4422'}
      ].map(t=>
        `<g style="animation:treeSway ${5+Math.random()*3}s ease-in-out infinite" transform-origin="${t.x} ${t.y+10}">
          <line x1="${t.x}" y1="${t.y+12}" x2="${t.x}" y2="${t.y-2}" stroke="#6B5B4B" stroke-width="3"/>
          <circle cx="${t.x}" cy="${t.y-5}" r="10" fill="${t.c1}" opacity="0.85" style="animation:goldenShimmer 3s ease-in-out infinite"/>
          <circle cx="${t.x-5}" cy="${t.y}" r="7" fill="${t.c2}" opacity="0.7"/>
          <circle cx="${t.x+4}" cy="${t.y-2}" r="6" fill="${t.c3}" opacity="0.65"/>
        </g>`).join('')}
      <!-- Falling leaves -->
      ${Array.from({length:10},(_,i)=>{
        const x=15+Math.random()*190;
        const d=5+Math.random()*6;
        const del=Math.random()*8;
        const c=['#D4973A','#CC4422','#E8B867','#CC6633','#AA3318'][Math.floor(Math.random()*5)];
        const anim=i%2===0?'leafFall':'leafFall2';
        return `<ellipse cx="${x}" cy="0" rx="2.5" ry="1.5" fill="${c}" opacity="0" style="animation:${anim} ${d}s ease-in-out ${del}s infinite"/>`;
      }).join('')}
      <!-- Campfire -->
      <g transform="translate(105,185)">
        <!-- Fire logs -->
        <line x1="-5" y1="5" x2="5" y2="3" stroke="#6B5B4B" stroke-width="2"/>
        <line x1="-4" y1="3" x2="6" y2="5" stroke="#5B4B3B" stroke-width="2"/>
        <!-- Flames -->
        <ellipse cx="0" cy="0" rx="4" ry="6" fill="#E8B867" opacity="0.9" style="animation:fireFlicker 0.4s ease-in-out infinite"/>
        <ellipse cx="0" cy="-2" rx="2.5" ry="4" fill="#FFD700" opacity="0.8" style="animation:fireFlicker 0.3s ease-in-out 0.1s infinite"/>
        <ellipse cx="0" cy="-3" rx="1.5" ry="2.5" fill="#FFF" opacity="0.5" style="animation:fireFlicker 0.35s ease-in-out 0.2s infinite"/>
        <!-- Smoke -->
        ${[0,1,2].map(i=>
          `<circle cx="${-1+i*1.5}" cy="${-8-i*2}" r="${1+i*0.5}" fill="#888" opacity="0" style="animation:smokeRise ${2+i*0.5}s ease-out ${i*0.6}s infinite"/>`
        ).join('')}
      </g>
      <!-- Warm glow overlay -->
      <circle cx="105" cy="185" r="25" fill="#FFD700" opacity="0.05">
        <animate attributeName="opacity" values="0.03;0.08;0.03" dur="1.5s" repeatCount="indefinite"/>
      </circle>
    </svg>`;
  }

  const SCENE_FNS=[winterScene,springScene,summerScene,autumnScene];

  function initDoodles(){
    const container=document.getElementById('doodle-container');
    if(!container) return;
    SCENE_FNS.forEach((fn,i)=>{
      const div=document.createElement('div');
      div.className='doodle-scene'+(i===0?' active':'');
      div.id='doodle-'+SEASONS[i];
      div.innerHTML=fn();
      container.insertBefore(div,container.querySelector('.doodle-label'));
    });
    updateLabel(0);
    setInterval(rotateSeason,CYCLE_MS);
  }

  function rotateSeason(){
    const prev=document.getElementById('doodle-'+SEASONS[currentIdx]);
    currentIdx=(currentIdx+1)%4;
    const next=document.getElementById('doodle-'+SEASONS[currentIdx]);
    if(prev) prev.classList.remove('active');
    if(next) next.classList.add('active');
    updateLabel(currentIdx);
  }

  function updateLabel(idx){
    const el=document.getElementById('doodle-season-text');
    if(el) el.textContent=LABELS[SEASONS[idx]];
  }

  // Boot
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',initDoodles);
  } else {
    initDoodles();
  }
})();
