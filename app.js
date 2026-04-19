/* ===== BASECAMP LEDGER — app.js ===== */
let MEMBERS=[];
const DEFAULT_MEMBERS=[
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

// Animated SVG avatars (PNG embedded inside SVG with CSS animation overlays)
const AVATAR_IMGS={
  shazan:'Images/shazan-pixel.svg',
  kanika:'Images/kanika-pixel.svg',
  saloni:'Images/saloni-pixel.svg',
  yash:'Images/yash-pixel.svg',
  anmol:'Images/anmol-pixel.svg'
};

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
  const animCls=AVATAR_ANIM_CLASS[id]||'';
  return `<div class="${animCls}" style="width:100%;height:100%;position:relative;overflow:visible;">
    <object data="Images/${id}-pixel.svg" type="image/svg+xml" style="width:100%;height:100%;border-radius:inherit;display:block;pointer-events:none;" aria-label="${id}"></object>
  </div>`;
}

// ====== FIREBASE SETUP ======
const firebaseConfig = {
  // 🔴 IMPORTANT TODO: PASTE YOUR FIREBASE CONFIG HERE 🔴
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Global State & Storage
let SERVER_STATE = { members: [], expenses: [], settlements: [], activity: [] };

function load(key) { return SERVER_STATE[key] || []; }

async function save(key, data) {
  SERVER_STATE[key] = data; // Update local immediately
  try {
    await db.ref(key).set(data);
  } catch (err) {
    console.error("Firebase Save Failed:", err);
    toast("Error saving data to Firebase!");
  }
}

function getMe() { return localStorage.getItem('kareri:whoami'); }
function setMe(id) { localStorage.setItem('kareri:whoami', id); }
function genId(prefix) { return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2,6); }

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
  const me=getMe();
  
  // Admin guard: only Shazan can end the trip
  const endTripBtn = document.getElementById('btn-end-trip');
  if (endTripBtn) {
    endTripBtn.style.display = (me === 'shazan') ? 'inline-block' : 'none';
  }

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

// Trip Ended
document.getElementById('btn-end-trip').onclick = function() {
  showConfirm('End Trip', 'Are you sure you want to permanently delete all expenses, settlements, and activity logs? This cannot be undone!', async () => {
    await save('expenses', []);
    await save('settlements', []);
    await save('activity', []);
    toast('Trip data reset successfully!');
    setTimeout(() => window.location.reload(), 800);
  });
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

// Edit Crew Functions
function openEditCrewModal() {
  const container = document.getElementById('edit-crew-list');
  container.innerHTML = MEMBERS.map(m => `
    <div class="form-row" style="margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px;">
      <div class="form-group" style="width: 40%">
        <label>Name (${m.id})</label>
        <input type="text" id="edit-name-${m.id}" value="${m.name}" required>
      </div>
      <div class="form-group" style="width: 60%">
        <label>Tagline</label>
        <input type="text" id="edit-tagline-${m.id}" value="${m.tagline}" required>
      </div>
    </div>
  `).join('');
  document.getElementById('edit-crew-backdrop').classList.remove('hidden');
}

function saveCrewEdits(e) {
  e.preventDefault();
  MEMBERS.forEach(m => {
    m.name = document.getElementById(`edit-name-${m.id}`).value.trim();
    m.tagline = document.getElementById(`edit-tagline-${m.id}`).value.trim();
  });
  save('members', MEMBERS);
  document.getElementById('edit-crew-backdrop').classList.add('hidden');
  toast('Crew identities updated!');
  // Quick reload to update all instances (dropdowns, cards, logs)
  setTimeout(() => window.location.reload(), 500);
}

// ===== BOOT & REALTIME SYNC =====
function boot() {
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

// Listen to Firebase Realtime Database (Replaces 10s Polling Loop)
db.ref().on('value', (snapshot) => {
  const data = snapshot.val() || {};
  SERVER_STATE = { ...SERVER_STATE, ...data };

  // Handle first time initialization
  if (!SERVER_STATE.members || SERVER_STATE.members.length === 0) {
     const defaults = JSON.parse(JSON.stringify(DEFAULT_MEMBERS));
     save('members', defaults);
     MEMBERS = defaults;
  } else {
     MEMBERS = SERVER_STATE.members;
  }

  // Only boot the UI once we have data
  if (!window._booted) {
    window._booted = true;
    boot();
  } else {
    // If already booted, update the screen instantly with the new data
    const activeTab = document.querySelector('.tab.active');
    renderView(activeTab?.dataset?.view || 'v-home');
    updateSync();
  }
});
