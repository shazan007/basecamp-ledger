/* ===== BASECAMP LEDGER — app.js ===== */
let MEMBERS = [];
const DEFAULT_MEMBERS = [
  { id: 'shazan', name: 'Shazan', tagline: 'Budding Vlogger' },
  { id: 'kanika', name: 'Kanika', tagline: 'Exquisite Being' },
  { id: 'saloni', name: 'Saloni', tagline: 'Newbie to mountains' },
  { id: 'anmol', name: 'Anmol', tagline: 'Instagramable, CEO' },
  { id: 'yash', name: 'Yash', tagline: 'Adrenaline Junkie' }
];
const CATEGORIES = ['Transport', 'Stay', 'Food', 'Permits', 'Gear', 'Misc'];
const CAT_ICONS = { Transport: '🚌', Stay: '🏕️', Food: '🍜', Permits: '📋', Gear: '🎒', Misc: '📦' };
const BUDGET = 50000;
const CIRC = 2 * Math.PI * 78; // 489.8
const RUPEE = '\u20B9';
const REGION_TIMEZONE = 'Asia/Kolkata';
const WEATHER_REFRESH_MS = 30 * 60 * 1000;
const WEATHER_SYNC_CHECK_MS = 5 * 60 * 1000;
const THEME_CHECK_MS = 60 * 1000;
const WEATHER_LOCATIONS = [
  { id: 'dharamshala', name: 'Dharamshala', subtitle: 'Kangra valley base', latitude: 32.2143039, longitude: 76.3196717 },
  { id: 'kareri', name: 'Kareri Village', subtitle: 'Trek starting point', latitude: 32.2802168, longitude: 76.2802137 },
  { id: 'kareriLake', name: 'Kareri Lake', subtitle: 'High-altitude campsite', latitude: 32.3256472, longitude: 76.2738851 }
];
const PREVIEW_THEME_PHASES = new Set(['day', 'dawn', 'sunset', 'night']);

// Animated SVG avatars (PNG embedded inside SVG with CSS animation overlays)
const AVATAR_IMGS = {
  shazan: 'Images/shazan-pixel.svg',
  kanika: 'Images/kanika-pixel.svg',
  saloni: 'Images/saloni-pixel.svg',
  yash: 'Images/yash-pixel.svg',
  anmol: 'Images/anmol-pixel.svg'
};

// Animation CSS class per character
const AVATAR_ANIM_CLASS = {
  shazan: 'av-shazan-hop',
  kanika: 'av-kanika-scan',
  saloni: 'amazed-hop',
  yash: 'av-yash-nod',
  anmol: 'av-anmol-tilt'
};

function renderAvatar(id, size) {
  size = size || 48;
  const animCls = AVATAR_ANIM_CLASS[id] || '';
  return `<div class="${animCls}" style="width:100%;height:100%;position:relative;overflow:visible;">
    <object data="Images/${id}-pixel.svg" type="image/svg+xml" style="width:100%;height:100%;border-radius:inherit;display:block;pointer-events:none;" aria-label="${id}"></object>
  </div>`;
}

// ====== FIREBASE SETUP ======
const firebaseConfig = {
  // 🔴 IMPORTANT TODO: PASTE YOUR FIREBASE CONFIG HERE 🔴
  apiKey: "AIzaSyAB0bqPXJRJBU4vdlRLgrG0xEcUAqhppLU",
  authDomain: "himalayan-ledger.firebaseapp.com",
  databaseURL: "https://himalayan-ledger-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "himalayan-ledger",
  storageBucket: "himalayan-ledger.firebasestorage.app",
  messagingSenderId: "766472031056",
  appId: "1:766472031056:web:1a41514f87c50cc7aeba55",
  measurementId: "G-K9SWR9S6KF"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Global State & Storage
let SERVER_STATE = { members: [], expenses: [], settlements: [], activity: [], weather: null, weatherSyncLock: null };
let WEATHER_SYNC_TIMER = null;
let WEATHER_THEME_TIMER = null;
let CLOCK_TIMER = null;
let WEATHER_SYNC_IN_FLIGHT = false;
let LAST_APPLIED_THEME = '';

function load(key, fallback = []) { return SERVER_STATE[key] ?? fallback; }

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
function genId(prefix) { return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6); }
function getClientId() {
  let clientId = localStorage.getItem('kareri:client-id');
  if (!clientId) {
    clientId = genId('client');
    localStorage.setItem('kareri:client-id', clientId);
  }
  return clientId;
}

// Toast
function toast(msg) {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0' }, 2200);
  setTimeout(() => { t.remove() }, 2600);
}

// Confirm dialog
let confirmCb = null;
function showConfirm(title, msg, cb) {
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-msg').textContent = msg;
  document.getElementById('confirm-backdrop').classList.remove('hidden');
  confirmCb = cb;
}
document.getElementById('confirm-cancel').onclick = () => { document.getElementById('confirm-backdrop').classList.add('hidden'); confirmCb = null };
document.getElementById('confirm-ok').onclick = () => { document.getElementById('confirm-backdrop').classList.add('hidden'); if (confirmCb) confirmCb(); confirmCb = null };

// Particles
function spawnParticles() {
  const c = document.getElementById('particles');
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div'); p.className = 'particle';
    const sz = 2 + Math.random() * 4;
    p.style.cssText = `left:${Math.random() * 100}%;width:${sz}px;height:${sz}px;animation-duration:${10 + Math.random() * 14}s;animation-delay:${Math.random() * 10}s;opacity:${0.3 + Math.random() * 0.4}`;
    c.appendChild(p);
  }
}

// Identity modal
function showIdentityModal() {
  const grid = document.getElementById('pick-grid');
  grid.innerHTML = MEMBERS.map(m => `
    <div class="pick" data-id="${m.id}" id="pick-${m.id}">
      <div class="pick-avatar">${renderAvatar(m.id, 56)}</div>
      <div class="pick-name">${m.name}</div>
      <div class="pick-tag">${m.tagline}</div>
    </div>`).join('');
  grid.querySelectorAll('.pick').forEach(el => {
    el.onclick = () => {
      setMe(el.dataset.id);
      document.getElementById('modal-backdrop').classList.add('hidden');
      boot();
    };
  });
  document.getElementById('modal-backdrop').classList.remove('hidden');
}

// Tab switching
function switchTab(viewId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === viewId));
  document.querySelectorAll('.view').forEach(v => {
    const isActive = v.id === viewId;
    v.classList.toggle('active', isActive);
    if (isActive) { v.style.animation = 'none'; v.offsetHeight; v.style.animation = 'fadeIn 0.4s cubic-bezier(0.2,0.8,0.2,1)' }
  });
  renderView(viewId);
}
document.querySelectorAll('.tab').forEach(t => { t.onclick = () => switchTab(t.dataset.view) });

// Header who-pill
document.getElementById('who-pill').onclick = () => showIdentityModal();

// ===== BALANCE CALCULATION =====
function calcBalances() {
  const expenses = load('expenses'), settlements = load('settlements');
  const bal = {};
  MEMBERS.forEach(m => bal[m.id] = 0);
  expenses.forEach(e => {
    bal[e.payerId] = (bal[e.payerId] || 0) + e.amount;
    e.splits.forEach(s => { bal[s.memberId] = (bal[s.memberId] || 0) - s.amount });
  });
  settlements.forEach(s => {
    bal[s.fromId] = (bal[s.fromId] || 0) + s.amount;
    bal[s.toId] = (bal[s.toId] || 0) - s.amount;
  });
  return bal;
}

function simplifyDebts() {
  const bal = calcBalances();
  const debtors = [], creditors = [];
  Object.entries(bal).forEach(([id, b]) => {
    if (b < -0.01) debtors.push({ id, amt: Math.abs(b) });
    if (b > 0.01) creditors.push({ id, amt: b });
  });
  debtors.sort((a, b) => b.amt - a.amt);
  creditors.sort((a, b) => b.amt - a.amt);
  const result = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i], cr = creditors[j];
    const a = Math.min(d.amt, cr.amt);
    result.push({ from: d.id, to: cr.id, amount: a });
    d.amt -= a; cr.amt -= a;
    if (d.amt < 0.01) i++;
    if (cr.amt < 0.01) j++;
  }
  return result;
}

// ===== ACTIVITY LOGGING =====
function logActivity(actorId, action, detail) {
  const acts = load('activity');
  acts.unshift({ id: genId('a'), actorId, action, detail, timestamp: Date.now() });
  save('activity', acts.slice(0, 300));
}

// ===== WEATHER =====
function getClockText(date) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: REGION_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(date || new Date());
}

function getShortClockText(date) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: REGION_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date || new Date());
}

function getRegionNowParts(timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timeZone || REGION_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    hour12: false
  }).formatToParts(new Date());
  const map = {};
  parts.forEach((part) => {
    if (part.type !== 'literal') map[part.type] = part.value;
  });
  return {
    dateKey: `${map.year}-${map.month}-${map.day}`,
    minutes: Number(map.hour) * 60 + Number(map.minute),
    seconds: Number(map.second)
  };
}

function parseIsoClock(isoString) {
  if (!isoString) return null;
  const bits = isoString.split('T');
  if (bits.length !== 2) return null;
  const timePart = bits[1].slice(0, 5);
  const dateKey = bits[0];
  const [hour, minute] = timePart.split(':').map(Number);
  return { dateKey, hour, minute, minutes: hour * 60 + minute };
}

function formatIsoClock(isoString) {
  const parsed = parseIsoClock(isoString);
  if (!parsed) return '--';
  const hour12 = ((parsed.hour + 11) % 12) + 1;
  const suffix = parsed.hour >= 12 ? 'PM' : 'AM';
  return `${hour12}:${String(parsed.minute).padStart(2, '0')} ${suffix}`;
}

function formatDayLabel(dateKey) {
  if (!dateKey) return '--';
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return new Intl.DateTimeFormat('en-IN', { weekday: 'short', timeZone: REGION_TIMEZONE }).format(date);
}

function formatUpdatedLabel(timestamp) {
  if (!timestamp) return 'Not synced yet';
  return `${timeAgo(timestamp)} at ${getShortClockText(new Date(timestamp))}`;
}

function formatWeatherTemp(value) {
  return `${Math.round(value)}&deg;C`;
}

function getPreviewThemeOverride() {
  const params = new URLSearchParams(window.location.search);
  const phase = params.get('themePreview');
  if (!phase || !PREVIEW_THEME_PHASES.has(phase)) return null;
  const tone = params.get('weatherPreview') || 'clear';
  return {
    phase,
    tone,
    label: `Preview / ${phase.charAt(0).toUpperCase() + phase.slice(1)}`,
    basedOn: 'preview',
    timezone: REGION_TIMEZONE,
    updatedAt: Date.now()
  };
}

function getWeatherCodeMeta(code, isDay) {
  if (code === 0) return { label: 'Clear sky', shortLabel: 'Clear', icon: isDay ? '&#9728;' : '&#9790;', tone: 'clear' };
  if ([1, 2].includes(code)) return { label: 'Partly cloudy', shortLabel: 'Partly cloudy', icon: '&#9925;', tone: 'cloudy' };
  if (code === 3) return { label: 'Overcast', shortLabel: 'Overcast', icon: '&#9729;', tone: 'cloudy' };
  if ([45, 48].includes(code)) return { label: 'Fog', shortLabel: 'Fog', icon: '&#127787;', tone: 'cloudy' };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Drizzle', shortLabel: 'Drizzle', icon: '&#127783;', tone: 'rain' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: 'Rain', shortLabel: 'Rain', icon: '&#127783;', tone: 'rain' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Snow', shortLabel: 'Snow', icon: '&#10052;', tone: 'snow' };
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', shortLabel: 'Storm', icon: '&#9889;', tone: 'storm' };
  return { label: 'Mountain weather', shortLabel: 'Mixed', icon: '&#9925;', tone: 'cloudy' };
}

function buildThemeState(weather) {
  const fallback = { phase: 'day', tone: 'clear', label: 'Day / Clear', basedOn: 'dharamshala', timezone: REGION_TIMEZONE, updatedAt: Date.now() };
  if (!weather || !weather.locations) return fallback;
  const focus = weather.locations.dharamshala || weather.locations.kareri || weather.locations.kareriLake;
  if (!focus) return fallback;

  const currentDay = getRegionNowParts(focus.timezone || REGION_TIMEZONE);
  const todayForecast = (focus.daily || []).find((entry) => entry.date === currentDay.dateKey) || focus.daily?.[0];
  if (!todayForecast) return fallback;

  const sunrise = parseIsoClock(todayForecast.sunrise);
  const sunset = parseIsoClock(todayForecast.sunset);
  let phase = 'day';

  if (!sunrise || !sunset) {
    phase = focus.current?.isDay ? 'day' : 'night';
  } else if (currentDay.minutes < sunrise.minutes - 45 || currentDay.minutes >= sunset.minutes + 35) {
    phase = 'night';
  } else if (currentDay.minutes < sunrise.minutes + 75) {
    phase = 'dawn';
  } else if (currentDay.minutes >= sunset.minutes - 75) {
    phase = 'sunset';
  }

  const weatherMeta = getWeatherCodeMeta(focus.current?.weatherCode, focus.current?.isDay);
  const tone = weatherMeta.tone;
  const label = `${phase.charAt(0).toUpperCase() + phase.slice(1)} / ${weatherMeta.shortLabel}`;
  return {
    phase,
    tone,
    label,
    basedOn: focus.id,
    timezone: focus.timezone || REGION_TIMEZONE,
    sunrise: todayForecast.sunrise,
    sunset: todayForecast.sunset,
    updatedAt: Date.now()
  };
}

function renderBirdMarkup(variant) {
  const birds = [
    { top: '14%', duration: '24s', delay: '0s', scale: '0.85', drift: '-12px' },
    { top: '18%', duration: '26s', delay: '6s', scale: '0.72', drift: '10px' },
    { top: '24%', duration: '22s', delay: '12s', scale: '0.92', drift: '-16px' },
    { top: '30%', duration: '28s', delay: '3s', scale: '0.68', drift: '8px' },
    { top: '20%', duration: '30s', delay: '15s', scale: '0.58', drift: '-7px' }
  ];
  const birdClass = variant ? ` ${variant}` : '';
  return birds.map((bird) => `
    <div class="ambient-bird${birdClass}" style="--ambient-top:${bird.top};--ambient-duration:${bird.duration};--ambient-delay:${bird.delay};--ambient-scale:${bird.scale};--ambient-drift:${bird.drift};">
      <svg viewBox="0 0 24 12" aria-hidden="true">
        <path d="M1 8 Q6 2 12 8 Q18 2 23 8"></path>
      </svg>
    </div>
  `).join('');
}

function renderSkyAmbient(theme) {
  const ambient = document.getElementById('sky-ambient');
  if (!ambient) return;

  const phase = theme?.phase || 'day';
  const tone = theme?.tone || 'clear';
  let markup = '';

  if (phase === 'night') {
    markup = `
      <div class="ambient-scene">
        <div class="ambient-milky-way"></div>
        <div class="ambient-moon-scene">
          <div class="ambient-moon"></div>
          <div class="ambient-iss">
            <span class="iss-panel left"></span>
            <span class="iss-arm"></span>
            <span class="iss-core"></span>
            <span class="iss-fin"></span>
            <span class="iss-panel right"></span>
          </div>
        </div>
      </div>
    `;
  } else {
    const showBirds = tone !== 'storm';
    const birdVariant = phase === 'sunset' ? ' ambient-bird-soft' : '';
    const birds = showBirds ? `<div class="ambient-birds">${renderBirdMarkup(birdVariant.trim())}</div>` : '';
    const sun = tone === 'clear' && phase !== 'day'
      ? `<div class="ambient-sun ${phase === 'sunset' ? 'sunset' : 'sunrise'}"></div>`
      : '';
    markup = `<div class="ambient-scene">${sun}${birds}</div>`;
  }

  ambient.innerHTML = markup;
}

function applyWeatherAppearance(weather) {
  const previewOverride = getPreviewThemeOverride();
  const theme = previewOverride || weather?.theme || buildThemeState(weather);
  const themeKey = `${theme.phase}:${theme.tone}`;
  document.body.dataset.themePhase = theme.phase || 'day';
  document.body.dataset.weatherTone = theme.tone || 'clear';
  LAST_APPLIED_THEME = themeKey;
  renderSkyAmbient(theme);

  const badge = document.getElementById('weather-theme-badge');
  if (badge) badge.textContent = theme.label || 'Regional weather';
}

function normalizeWeatherPayload(location, payload) {
  const daily = (payload.daily?.time || []).map((date, index) => ({
    date,
    sunrise: payload.daily.sunrise?.[index] || '',
    sunset: payload.daily.sunset?.[index] || '',
    weatherCode: payload.daily.weather_code?.[index],
    maxTemp: payload.daily.temperature_2m_max?.[index],
    minTemp: payload.daily.temperature_2m_min?.[index],
    precipChance: payload.daily.precipitation_probability_max?.[index] ?? 0
  }));

  return {
    id: location.id,
    name: location.name,
    subtitle: location.subtitle,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: payload.timezone || REGION_TIMEZONE,
    current: {
      time: payload.current?.time || '',
      temperature: payload.current?.temperature_2m ?? 0,
      apparentTemperature: payload.current?.apparent_temperature ?? 0,
      precipitation: payload.current?.precipitation ?? 0,
      weatherCode: payload.current?.weather_code ?? 0,
      isDay: Boolean(payload.current?.is_day),
      windSpeed: payload.current?.wind_speed_10m ?? 0
    },
    daily
  };
}

async function fetchWeatherForLocation(location) {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: 'temperature_2m,apparent_temperature,precipitation,weather_code,is_day,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
    forecast_days: '4',
    timezone: REGION_TIMEZONE
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) throw new Error(`Weather request failed for ${location.name}`);
  const payload = await response.json();
  return normalizeWeatherPayload(location, payload);
}

async function fetchWeatherBundle() {
  const results = await Promise.all(WEATHER_LOCATIONS.map((location) => fetchWeatherForLocation(location)));
  const locations = {};
  results.forEach((entry) => { locations[entry.id] = entry; });

  const now = Date.now();
  const weather = {
    source: {
      name: 'Open-Meteo',
      docsUrl: 'https://open-meteo.com/en/docs'
    },
    refreshMs: WEATHER_REFRESH_MS,
    updatedAt: now,
    nextRefreshAt: now + WEATHER_REFRESH_MS,
    locations
  };
  weather.theme = buildThemeState(weather);
  return weather;
}

function shouldRefreshWeather(weather) {
  if (!weather || !weather.locations) return true;
  if (!weather.updatedAt) return true;
  const missingLocation = WEATHER_LOCATIONS.some((location) => !weather.locations[location.id]);
  if (missingLocation) return true;
  return (Date.now() - weather.updatedAt) >= WEATHER_REFRESH_MS;
}

async function acquireWeatherLock() {
  const clientId = getClientId();
  const now = Date.now();
  const lockRef = db.ref('weatherSyncLock');
  const tx = await lockRef.transaction((current) => {
    if (current && current.expiresAt > now && current.owner !== clientId) return;
    return { owner: clientId, acquiredAt: now, expiresAt: now + (2 * 60 * 1000) };
  });
  return Boolean(tx.committed && tx.snapshot?.val()?.owner === clientId);
}

async function releaseWeatherLock() {
  try {
    const current = load('weatherSyncLock', null);
    if (!current || current.owner === getClientId()) {
      await db.ref('weatherSyncLock').remove();
    }
  } catch (err) {
    console.warn('Weather lock release failed', err);
  }
}

async function syncWeatherIfNeeded(force) {
  if (WEATHER_SYNC_IN_FLIGHT) return;
  const currentWeather = load('weather', null);
  if (!force && !shouldRefreshWeather(currentWeather)) return;

  WEATHER_SYNC_IN_FLIGHT = true;
  let ownsLock = false;
  try {
    ownsLock = await acquireWeatherLock();
    if (!ownsLock) return;

    const freshest = load('weather', null);
    if (!force && !shouldRefreshWeather(freshest)) return;

    const weatherPayload = await fetchWeatherBundle();
    await save('weather', weatherPayload);
  } catch (err) {
    console.error('Weather sync failed', err);
    if (!currentWeather) toast('Weather forecast could not be refreshed right now.');
  } finally {
    if (ownsLock) await releaseWeatherLock();
    WEATHER_SYNC_IN_FLIGHT = false;
  }
}

async function syncThemeStateIfNeeded() {
  const previewOverride = getPreviewThemeOverride();
  if (previewOverride) {
    applyWeatherAppearance({ theme: previewOverride });
    return;
  }
  const weather = load('weather', null);
  if (!weather || !weather.locations) return;
  const nextTheme = buildThemeState(weather);
  const currentTheme = weather.theme || {};
  const themeChanged = currentTheme.phase !== nextTheme.phase || currentTheme.tone !== nextTheme.tone || currentTheme.label !== nextTheme.label;
  if (!themeChanged) {
    applyWeatherAppearance(weather);
    return;
  }

  const nextWeather = { ...weather, theme: nextTheme };
  SERVER_STATE.weather = nextWeather;
  applyWeatherAppearance(nextWeather);
  if (document.querySelector('.tab.active')?.dataset.view === 'v-weather') renderWeather();
  await save('weather', nextWeather);
}

function renderWeatherOverview(weather) {
  const theme = weather.theme || buildThemeState(weather);
  const focus = weather.locations[theme.basedOn] || weather.locations.dharamshala || weather.locations.kareri || weather.locations.kareriLake;
  const focusMeta = getWeatherCodeMeta(focus.current?.weatherCode, focus.current?.isDay);
  const nextRefresh = weather.nextRefreshAt ? getShortClockText(new Date(weather.nextRefreshAt)) : '--';
  const updated = weather.updatedAt ? getShortClockText(new Date(weather.updatedAt)) : '--';
  return `
    <div class="weather-overview-card">
      <div class="over-label">Theme Window</div>
      <div class="over-value">${theme.label}</div>
      <div class="over-sub">Driven by ${focus.name} and updated from stored sunrise/sunset timing.</div>
    </div>
    <div class="weather-overview-card">
      <div class="over-label">Current Signal</div>
      <div class="over-value">${focusMeta.shortLabel}</div>
      <div class="over-sub">Latest sync at ${updated}. Next shared refresh after ${nextRefresh}.</div>
    </div>
    <div class="weather-overview-card">
      <div class="over-label">Sync Mode</div>
      <div class="over-value">30 min cache</div>
      <div class="over-sub">One shared forecast bundle in Firebase keeps the app responsive on every client.</div>
    </div>
  `;
}

function renderWeatherLocationCard(location) {
  const currentMeta = getWeatherCodeMeta(location.current.weatherCode, location.current.isDay);
  const today = location.daily?.[0];
  const forecastMarkup = (location.daily || []).slice(0, 4).map((entry) => {
    const meta = getWeatherCodeMeta(entry.weatherCode, true);
    return `
      <div class="forecast-pill">
        <div class="forecast-day">${formatDayLabel(entry.date)}</div>
        <div class="forecast-icon">${meta.icon}</div>
        <div class="forecast-range">${Math.round(entry.maxTemp)}&deg; / ${Math.round(entry.minTemp)}&deg;</div>
        <div class="forecast-rain">${Math.round(entry.precipChance || 0)}% rain</div>
      </div>
    `;
  }).join('');

  return `
    <article class="weather-card">
      <div class="weather-card-head">
        <div>
          <div class="weather-place">${location.name}</div>
          <div class="weather-region">${location.subtitle}</div>
        </div>
        <div class="weather-icon">${currentMeta.icon}</div>
      </div>
      <div class="weather-current">
        <div>
          <div class="weather-temp">${formatWeatherTemp(location.current.temperature)}</div>
          <div class="weather-feels">Feels like ${formatWeatherTemp(location.current.apparentTemperature)}</div>
        </div>
        <div class="weather-condition">${currentMeta.label}</div>
      </div>
      <div class="weather-stats">
        <div class="weather-stat">
          <div class="weather-stat-label">Today</div>
          <div class="weather-stat-value">${today ? `${Math.round(today.maxTemp)}&deg; / ${Math.round(today.minTemp)}&deg;` : '--'}</div>
        </div>
        <div class="weather-stat">
          <div class="weather-stat-label">Wind</div>
          <div class="weather-stat-value">${Math.round(location.current.windSpeed)} km/h</div>
        </div>
        <div class="weather-stat">
          <div class="weather-stat-label">Rain Risk</div>
          <div class="weather-stat-value">${today ? `${Math.round(today.precipChance || 0)}%` : '--'}</div>
        </div>
        <div class="weather-stat">
          <div class="weather-stat-label">Sun Window</div>
          <div class="weather-stat-value">${today ? `${formatIsoClock(today.sunrise)} - ${formatIsoClock(today.sunset)}` : '--'}</div>
        </div>
      </div>
      <div class="weather-forecast">${forecastMarkup}</div>
    </article>
  `;
}

function renderWeather() {
  const weather = load('weather', null);
  const overview = document.getElementById('weather-overview-grid');
  const cards = document.getElementById('weather-location-grid');
  const meta = document.getElementById('weather-meta');
  const badge = document.getElementById('weather-theme-badge');

  if (!weather || !weather.locations) {
    overview.innerHTML = '<div class="weather-loading">Preparing the shared mountain forecast cache...</div>';
    cards.innerHTML = '<div class="weather-empty">Weather cards will appear after the first successful sync.</div>';
    meta.textContent = 'Shared forecast cache for Dharamshala, Kareri Village, and Kareri Lake.';
    badge.textContent = 'Waiting for forecast';
    return;
  }

  applyWeatherAppearance(weather);
  overview.innerHTML = renderWeatherOverview(weather);
  cards.innerHTML = WEATHER_LOCATIONS
    .map((location) => weather.locations[location.id])
    .filter(Boolean)
    .map((location) => renderWeatherLocationCard(location))
    .join('');
  meta.textContent = `Last shared sync ${formatUpdatedLabel(weather.updatedAt)}. Forecast source: ${weather.source?.name || 'Open-Meteo'}.`;
}

function updateClock() {
  const clock = document.getElementById('clock-time');
  if (clock) clock.textContent = getClockText(new Date());
}

function ensureBackgroundJobs() {
  if (!CLOCK_TIMER) {
    updateClock();
    CLOCK_TIMER = setInterval(updateClock, 1000);
  }
  if (!WEATHER_SYNC_TIMER) {
    WEATHER_SYNC_TIMER = setInterval(() => { syncWeatherIfNeeded(false); }, WEATHER_SYNC_CHECK_MS);
  }
  if (!WEATHER_THEME_TIMER) {
    WEATHER_THEME_TIMER = setInterval(() => { syncThemeStateIfNeeded(); }, THEME_CHECK_MS);
  }
}

// ===== RENDERING =====
function renderView(viewId) {
  const me = getMe(); if (!me) return;
  if (viewId === 'v-home') renderHome();
  else if (viewId === 'v-weather') renderWeather();
  else if (viewId === 'v-ledger') renderLedger();
  else if (viewId === 'v-add') renderAddForm();
  else if (viewId === 'v-settle') renderSettle();
  else if (viewId === 'v-activity') renderActivityView();
}

function renderHome() {
  const expenses = load('expenses'), bal = calcBalances();
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const pct = Math.min(100, (total / BUDGET) * 100);

  // Budget ring
  const offset = CIRC * (1 - pct / 100);
  document.getElementById('ring-fg').setAttribute('stroke-dashoffset', offset);
  document.getElementById('ring-pct').textContent = Math.round(pct) + '%';
  document.getElementById('ring-sub').textContent = `of ₹${BUDGET.toLocaleString()}`;
  document.getElementById('stat-spent').textContent = '₹' + total.toLocaleString(undefined, { maximumFractionDigits: 0 });
  document.getElementById('stat-remaining').textContent = '₹' + Math.max(0, BUDGET - total).toLocaleString(undefined, { maximumFractionDigits: 0 });

  // Category bars
  const catTotals = {};
  CATEGORIES.forEach(c => catTotals[c] = 0);
  expenses.forEach(e => catTotals[e.category] = (catTotals[e.category] || 0) + e.amount);
  const maxCat = Math.max(1, ...Object.values(catTotals));
  document.getElementById('cat-bars').innerHTML = CATEGORIES.map(c => {
    const v = catTotals[c] || 0;
    const w = Math.max(0, (v / maxCat) * 100);
    return `<div class="cat-bar"><div class="cat-head"><span class="cat-name">${CAT_ICONS[c]} ${c}</span><span class="cat-val">₹${v.toLocaleString()}</span></div><div class="bar-track"><div class="fill" style="width:${w}%"></div></div></div>`;
  }).join('');

  // Crew balances
  document.getElementById('crew-grid').innerHTML = MEMBERS.map(m => {
    const b = bal[m.id] || 0;
    const cls = b > 0.01 ? 'bal-pos' : b < -0.01 ? 'bal-neg' : 'bal-zero';
    const txt = b > 0.01 ? `gets ₹${b.toFixed(0)}` : b < -0.01 ? `owes ₹${Math.abs(b).toFixed(0)}` : 'settled';
    return `<div class="member-card"><div class="pixel-avatar">${renderAvatar(m.id, 56)}</div><div class="member-name">${m.name}</div><div class="member-tagline">${m.tagline}</div><div class="member-balance ${cls}">${txt}</div></div>`;
  }).join('');

  // Recent activity
  const acts = load('activity').slice(0, 5);
  document.getElementById('recent-rows').innerHTML = acts.length ? acts.map((a, i) => {
    const actor = MEMBERS.find(m => m.id === a.actorId) || { name: '?', id: 'shazan' };
    return `<div class="activity-row" style="animation-delay:${i * 0.04}s"><div class="row-avatar">${renderAvatar(actor.id, 36)}</div><div class="row-body"><div class="row-title">${actor.name} ${a.action}</div><div class="row-meta">${a.detail} · ${timeAgo(a.timestamp)}</div></div></div>`;
  }).join('') : '<div class="empty-state">No activity yet — add your first expense!</div>';
}

function renderLedger() {
  const expenses = load('expenses');
  const filter = document.getElementById('filter-cat').value;
  const filtered = filter === 'all' ? expenses : expenses.filter(e => e.category === filter);
  const sorted = filtered.sort((a, b) => b.createdAt - a.createdAt);
  const me = getMe();
  document.getElementById('expense-rows').innerHTML = sorted.length ? sorted.map((e, i) => {
    const payer = MEMBERS.find(m => m.id === e.payerId) || { name: '?', id: 'shazan' };
    const catCls = 'cat-' + e.category.toLowerCase();
    const canEdit = me === 'shazan' || e.createdBy === me;
    return `<div class="expense-row" style="animation-delay:${i * 0.04}s">
      <div class="row-icon ${catCls}">${CAT_ICONS[e.category] || '📦'}</div>
      <div class="row-body"><div class="row-title">${e.description}</div><div class="row-meta">Paid by ${payer.name} · ${e.date} · ${e.splitMode}</div></div>
      <div class="row-amount">₹${e.amount.toLocaleString()}</div>
      ${canEdit ? `<div class="row-actions"><button class="edit-btn" onclick="editExpense('${e.id}')">Edit</button><button onclick="deleteExpense('${e.id}')">Del</button></div>` : ''}
    </div>`;
  }).join('') : '<div class="empty-state">No expenses recorded yet.</div>';
}
document.getElementById('filter-cat').onchange = () => renderLedger();

function renderAddForm() {
  const payer = document.getElementById('f-payer');
  if (!payer.children.length) {
    payer.innerHTML = MEMBERS.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
    payer.value = getMe() || 'shazan';
  }
  if (!document.getElementById('f-date').value) {
    document.getElementById('f-date').value = new Date().toISOString().slice(0, 10);
  }
  updateSplitPreview();
}

function updateSplitPreview() {
  const amount = parseFloat(document.getElementById('f-amount').value) || 0;
  const mode = document.querySelector('input[name="splitMode"]:checked').value;
  const container = document.getElementById('split-preview');
  if (amount <= 0) { container.innerHTML = ''; return }
  if (mode === 'equal') {
    const each = (amount / MEMBERS.length);
    container.innerHTML = MEMBERS.map(m => `<div class="split-item"><div class="sp-avatar">${renderAvatar(m.id, 32)}</div><div class="sp-name">${m.name}</div><div class="sp-val">₹${each.toFixed(2)}</div></div>`).join('');
  } else {
    const ph = mode === 'percent' ? '%' : mode === 'shares' ? 'shares' : '₹';
    container.innerHTML = MEMBERS.map(m => `<div class="split-item"><div class="sp-avatar">${renderAvatar(m.id, 32)}</div><div class="sp-name">${m.name}</div><input type="number" class="split-input" data-id="${m.id}" step="0.01" min="0" placeholder="${ph}" oninput="onSplitInput()"></div>`).join('');
  }
}
window.onSplitInput = function () { };
document.querySelectorAll('input[name="splitMode"]').forEach(r => r.onchange = updateSplitPreview);
document.getElementById('f-amount').oninput = updateSplitPreview;

// Submit expense
document.getElementById('expense-form').onsubmit = function (ev) {
  ev.preventDefault();
  const me = getMe(); if (!me) return;
  const amount = parseFloat(document.getElementById('f-amount').value);
  const desc = document.getElementById('f-desc').value.trim();
  const date = document.getElementById('f-date').value;
  const category = document.getElementById('f-category').value;
  const payerId = document.getElementById('f-payer').value;
  const mode = document.querySelector('input[name="splitMode"]:checked').value;
  const editId = document.getElementById('edit-id').value;

  if (!desc || !amount || amount <= 0) { toast('Please fill all fields'); return }

  let splits = [];
  if (mode === 'equal') {
    const each = amount / MEMBERS.length;
    splits = MEMBERS.map(m => ({ memberId: m.id, amount: each }));
  } else {
    const inputs = document.querySelectorAll('.split-input');
    let total = 0;
    inputs.forEach(inp => { total += parseFloat(inp.value) || 0 });
    if (mode === 'exact' && Math.abs(total - amount) > 0.01) { toast('Exact amounts must sum to total'); return }
    if (mode === 'percent' && Math.abs(total - 100) > 0.1) { toast('Percentages must add up to 100%'); return }
    if (mode === 'shares' && total <= 0) { toast('Total shares must be > 0'); return }
    inputs.forEach(inp => {
      const v = parseFloat(inp.value) || 0;
      let a = 0;
      if (mode === 'exact') a = v;
      else if (mode === 'percent') a = (v / 100) * amount;
      else if (mode === 'shares') a = (v / total) * amount;
      splits.push({ memberId: inp.dataset.id, amount: a });
    });
  }

  const expenses = load('expenses');
  if (editId) {
    const idx = expenses.findIndex(e => e.id === editId);
    if (idx >= 0) { expenses[idx] = { ...expenses[idx], description: desc, amount, date, category, payerId, splitMode: mode, splits } }
    save('expenses', expenses);
    logActivity(me, 'edited expense', `${desc} — ₹${amount}`);
    toast('Expense updated!');
  } else {
    expenses.push({ id: genId('e'), description: desc, amount, payerId, category, date, splitMode: mode, splits, createdBy: me, createdAt: Date.now() });
    save('expenses', expenses);
    logActivity(me, 'added expense', `${desc} — ₹${amount}`);
    toast('Expense added!');
  }

  document.getElementById('expense-form').reset();
  document.getElementById('edit-id').value = '';
  document.getElementById('add-title').textContent = 'Record Expense';
  document.getElementById('btn-submit').textContent = 'Add Expense';
  document.getElementById('f-date').value = new Date().toISOString().slice(0, 10);
  document.getElementById('f-payer').value = me;
  document.getElementById('split-preview').innerHTML = '';
  switchTab('v-ledger');
};

// Edit expense
window.editExpense = function (id) {
  const expenses = load('expenses');
  const e = expenses.find(x => x.id === id); if (!e) return;
  document.getElementById('f-desc').value = e.description;
  document.getElementById('f-amount').value = e.amount;
  document.getElementById('f-date').value = e.date;
  document.getElementById('f-category').value = e.category;
  document.getElementById('f-payer').value = e.payerId;
  document.querySelector(`input[name="splitMode"][value="${e.splitMode}"]`).checked = true;
  document.getElementById('edit-id').value = e.id;
  document.getElementById('add-title').textContent = 'Edit Expense';
  document.getElementById('btn-submit').textContent = 'Update Expense';
  switchTab('v-add');
  updateSplitPreview();
};

// Delete expense
window.deleteExpense = function (id) {
  showConfirm('Delete Expense', 'Are you sure you want to delete this expense?', () => {
    let expenses = load('expenses');
    const e = expenses.find(x => x.id === id);
    expenses = expenses.filter(x => x.id !== id);
    save('expenses', expenses);
    if (e) logActivity(getMe(), 'deleted expense', `${e.description} — ₹${e.amount}`);
    toast('Expense deleted');
    renderLedger();
    renderHome();
  });
};

// Settle view
function renderSettle() {
  const debts = simplifyDebts();
  document.getElementById('debt-rows').innerHTML = debts.length ? debts.map((d, i) => {
    const from = MEMBERS.find(m => m.id === d.from) || { name: '?', id: 'shazan' };
    const to = MEMBERS.find(m => m.id === d.to) || { name: '?', id: 'shazan' };
    return `<div class="debt-row" style="animation-delay:${i * 0.04}s"><div class="row-avatar">${renderAvatar(from.id, 36)}</div><div class="row-body"><div class="row-title">${from.name} <span class="debt-arrow">→</span> ${to.name}</div></div><div class="row-amount" style="color:var(--rhodo)">₹${d.amount.toFixed(0)}</div></div>`;
  }).join('') : '<div class="empty-state">All settled up! 🎉</div>';

  // Settle form selectors
  const sf = document.getElementById('s-from'), st = document.getElementById('s-to');
  if (!sf.children.length) {
    sf.innerHTML = MEMBERS.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
    st.innerHTML = MEMBERS.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
    sf.value = getMe() || 'shazan';
    st.value = MEMBERS.find(m => m.id !== (getMe() || 'shazan'))?.id || 'kanika';
  }
  if (!document.getElementById('s-date').value) document.getElementById('s-date').value = new Date().toISOString().slice(0, 10);
}

// Submit settlement
document.getElementById('settle-form').onsubmit = function (ev) {
  ev.preventDefault();
  const me = getMe(); if (!me) return;
  const fromId = document.getElementById('s-from').value;
  const toId = document.getElementById('s-to').value;
  const amount = parseFloat(document.getElementById('s-amount').value);
  const date = document.getElementById('s-date').value;
  if (fromId === toId) { toast('From and To must be different'); return }
  if (!amount || amount <= 0) { toast('Enter a valid amount'); return }
  const settlements = load('settlements');
  settlements.push({ id: genId('s'), fromId, toId, amount, date, createdBy: me, createdAt: Date.now() });
  save('settlements', settlements);
  logActivity(me, 'recorded payment', `${MEMBERS.find(m => m.id === fromId).name} paid ${MEMBERS.find(m => m.id === toId).name} ₹${amount}`);
  toast('Payment recorded!');
  document.getElementById('settle-form').reset();
  document.getElementById('s-date').value = new Date().toISOString().slice(0, 10);
  renderSettle();
  renderHome();
};

// Activity view
function renderActivityView() {
  const acts = load('activity');
  const me = getMe();

  // Admin guard: only Shazan can end the trip
  const endTripBtn = document.getElementById('btn-end-trip');
  if (endTripBtn) {
    endTripBtn.style.display = (me === 'shazan') ? 'inline-block' : 'none';
  }

  document.getElementById('activity-rows').innerHTML = acts.length ? acts.map((a, i) => {
    const actor = MEMBERS.find(m => m.id === a.actorId) || { name: '?', id: 'shazan' };
    return `<div class="activity-row" style="animation-delay:${i * 0.04}s"><div class="row-avatar">${renderAvatar(actor.id, 36)}</div><div class="row-body"><div class="row-title">${actor.name} ${a.action}</div><div class="row-meta">${a.detail} · ${timeAgo(a.timestamp)}</div></div></div>`;
  }).join('') : '<div class="empty-state">No activity yet.</div>';
}

// Export JSON
document.getElementById('btn-export').onclick = function () {
  const data = { expenses: load('expenses'), settlements: load('settlements'), activity: load('activity') };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'basecamp-ledger-export.json'; a.click();
  toast('Export downloaded!');
};

// Trip Ended
document.getElementById('btn-end-trip').onclick = function () {
  showConfirm('End Trip', 'Are you sure you want to permanently delete all expenses, settlements, and activity logs? This cannot be undone!', async () => {
    await save('expenses', []);
    await save('settlements', []);
    await save('activity', []);
    toast('Trip data reset successfully!');
    setTimeout(() => window.location.reload(), 800);
  });
};

// Time ago helper
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}

// Sync indicator
function updateSync() { document.getElementById('sync-text').textContent = 'updated ' + getShortClockText(new Date()) }

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
  const me = getMe();
  if (!me) { showIdentityModal(); return }
  document.getElementById('modal-backdrop').classList.add('hidden');
  ensureBackgroundJobs();
  applyWeatherAppearance(load('weather', null));

  // Update who-pill
  document.getElementById('who-avatar').innerHTML = renderAvatar(me, 36);
  document.getElementById('who-name').textContent = MEMBERS.find(m => m.id === me)?.name || '?';

  // Render active view
  const activeTab = document.querySelector('.tab.active');
  renderView(activeTab?.dataset?.view || 'v-home');
  updateSync();
  syncThemeStateIfNeeded();
  syncWeatherIfNeeded(false);
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
    applyWeatherAppearance(load('weather', null));
    // If already booted, update the screen instantly with the new data
    const activeTab = document.querySelector('.tab.active');
    renderView(activeTab?.dataset?.view || 'v-home');
    updateSync();
  }
});
