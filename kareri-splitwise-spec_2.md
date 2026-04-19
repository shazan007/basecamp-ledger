# Basecamp Ledger — Antigravity Website Builder Specification

**Project:** `BasecampLedger`
**Version:** 2.0
**Destination:** Kareri Lake, Himachal Pradesh
**Group:** Shazan · Kanika · Saloni · Anmol · Yash

---

## 1. Overview

A real-time, shared expense-splitting web app for a 5-person Himalayan trek. Functionally equivalent to Splitwise. All data persists in shared key-value storage so every member sees the same live ledger from any device.

---

## 2. Visual Identity

### 2.1 Palette — "Kareri Seasonal"

Derived from the four visual seasons at Kareri Lake: spring rhododendron bloom, summer teal water, autumn larch amber, winter glacial mist.

| Token | Hex | Source |
|---|---|---|
| `--bg` | `#E8EEE8` | Glacial mist / snow haze |
| `--bg-2` | `#F4F6F2` | Snow crust light |
| `--ink` | `#1A2E2A` | Deep pine shadow |
| `--ink-soft` | `#4A5D56` | Moss mid-tone |
| `--dim` | `#7A8A82` | Haze grey |
| `--lake` | `#3A8A9E` | Kareri summer water |
| `--lake-2` | `#5FB0C2` | Water highlight |
| `--lake-deep` | `#1F5866` | Deep water shadow |
| `--moss` | `#6B8E4E` | Spring meadow |
| `--moss-2` | `#8FAC6D` | Bright meadow |
| `--amber` | `#D4973A` | Autumn larch |
| `--amber-2` | `#E8B867` | Warm larch highlight |
| `--snow` | `#F7F9FA` | Fresh snow |
| `--snow-blue` | `#B8D4E0` | Winter sky / ice |
| `--rhodo` | `#C85A7C` | Rhododendron bloom |
| `--rhodo-soft` | `#E89AAF` | Rhododendron petal |

### 2.2 Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display / Headings | `Fraunces` (serif) | 600–800 | Italic variant for accent words |
| Numbers / Amounts | `JetBrains Mono` | 400–700 | All monetary values, timestamps, codes |
| Body / UI | `Inter` | 400–600 | Forms, labels, meta text |
| Pixel Avatar Labels | `Press Start 2P` | 400 | Optional, small size only |

**Import:** `https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400&family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600&family=Press+Start+2P`

### 2.3 Surfaces

```css
--card-bg:  rgba(255, 255, 255, 0.72)  /* frosted glass panels */
--card-br:  rgba(26, 46, 42, 0.10)     /* subtle ink border */
--shadow:   0 4px 20px rgba(31,88,102,0.08)
--shadow-lg:0 10px 40px rgba(31,88,102,0.15)
```

All cards: `backdrop-filter: blur(10px)`, `border-radius: 20px`.

---

## 3. Layout

### 3.1 Page Structure

```
<body>
  ├── .particles          (fixed, z:0 — falling mist)
  ├── .mountains          (fixed, z:0 — SVG ridge layers)
  ├── body::before        (fixed, z:0 — radial gradient sky)
  ├── body::after         (fixed, z:0 — grain texture overlay)
  └── .page               (relative, z:2 — all content)
       ├── <header>
       ├── <nav.tabs>
       └── <section.view> × 5
```

### 3.2 Breakpoints

- Default: max-width `1200px`, padding `32px 24px 120px`
- `.grid-2`, `.grid-3` → single column at `≤ 780px`

### 3.3 Tab Views

| Tab | ID | Content |
|---|---|---|
| Basecamp | `v-home` | Budget ring, category bars, crew balances, recent activity |
| Ledger | `v-ledger` | Filterable expense list |
| Add Expense | `v-add` | Expense form with live split preview |
| Settle Up | `v-settle` | Simplified debts + record payment form |
| Activity | `v-activity` | Full audit log |

---

## 4. Character Roster

### 4.1 Members

| ID | Name | Tagline | Avatar Key Attributes |
|---|---|---|---|
| `shazan` | Shazan | *Group admin & organizer* | Amber beanie, clipboard in hands |
| `kanika` | Kanika | *Expert travel planner* | Green cap, binoculars |
| `saloni` | Saloni | *Newbie to mountains* | Pink beanie, cocoa mug, wide eyes |
| `anmol` | Anmol | *Slow but instagramable* | Sunglasses, phone/camera |
| `yash` | Yash | *Genius coder* | Headphones, glasses, laptop with code |

**Display rule:** Show name + italic tagline only. No role badge chips/tags.

### 4.2 Pixel Avatar System

- Grid: **16×16 pixels**, `shape-rendering: crispEdges`
- Rendered as inline SVG `<rect>` elements — zero external dependencies
- Each character has a personal **palette** (`k` ink, `s` skin, `h` hair/hat, `c` clothing, `a` accessory, `g` gadget screen, `r` rim/cheek)
- Scale formula: `scale = Math.floor(size / 16)`, minimum 1
- Avatar `background`: `linear-gradient(180deg, var(--snow-blue), var(--bg-2))`
- Avatar container: `border-radius: 14px` (cards), `50%` (header who-pill), `8px` (rows)

#### Character Palette Reference

```js
PALETTES = {
  shazan: { k:'#1A2E2A', s:'#E8C19C', h:'#D4973A', c:'#8B5A2B', a:'#3A8A9E', g:'#F4F6F2', r:'#C85A7C' },
  kanika: { k:'#1A2E2A', s:'#E8C19C', h:'#6B8E4E', c:'#3D5C42', a:'#1F5866', g:'#E8B867', r:'#C85A7C' },
  saloni: { k:'#1A2E2A', s:'#F2D2B0', h:'#C85A7C', c:'#8B5A2B', a:'#E89AAF', g:'#FFFFFF', r:'#D4973A' },
  anmol:  { k:'#1A2E2A', s:'#E8C19C', h:'#2A2A2E', c:'#3A8A9E', a:'#D4973A', g:'#F2D2B0', r:'#C85A7C' },
  yash:   { k:'#1A2E2A', s:'#E8C19C', h:'#2A2A2E', c:'#8B5FBF', a:'#5FB0C2', g:'#E8B867', r:'#3A8A9E' },
}
```

#### Sprite Maps (16 rows × 16 chars)

Legend: `.` transparent · `k` ink · `s` skin · `h` hat/hair · `c` clothing · `a` accessory · `g` gadget screen · `r` cheek/rim

**Shazan** (amber beanie + clipboard)
```
................
.....kkkkkk.....
....khhhhhhk....
...khhhhhhhhk...
..khhhhhhhhhhk..
..kkkssssssskk..
..kskssksskksk..
..kssssskssssk..
..ksssskkssssk..
..kkcccccccckk..
.kccckaaaakcck..
.kccakggggakck..
.kccakgkkgakck..
.kccakggggakck..
.kcckaaaaakcck..
..kk..........k.
```

**Kanika** (green cap + binoculars)
```
................
....khhhhhhk....
...khhhhghhhk...
..khhhhhhhhhhk..
..khhhhhhhhhhk..
..kkkssssssskk..
..ksaaksskaaksk.
..ksaggksgagksk.
..ksaaksskaaksk.
..ksskkkkkkssk..
..kssssssssssk..
..kccccccccckk..
.kcackccccckcck.
.kcack......ckk.
.kcack......kk..
..kk...........
```

**Saloni** (pink beanie + cocoa mug + wide eyes)
```
................
...khhhhhhhhk...
..khhhhhhhhhhk..
.khhkhhhhhhhkhk.
.khhhhhhhhhhhhk.
..kkkssssssskk..
..kssggsskggssk.
..kskgsskskgssk.
..krskkkkkkrksk.
..ksssskkssssk..
..kkcccccccckk..
..kccaaaaaccck..
..kcagggggackk.a
..kcagkkkgack.aa
..kcaaaaaaack.a.
..kkk..kk....a..
```

**Anmol** (sunglasses + phone — instagramable)
```
................
.....kkkkkk.....
....khhhhhhk....
...khhhhhhhhk...
..khhhhhhhhhhk..
..kkkssssssskk..
..kkkkkskkkkksk.
..khkhkskhkhksk.
..kssskkkksssk..
..kssssrrsssssk.
..kkcccccccckk..
..kcccaaaaccck..
..kcccagggackk..
..kccaagggakck..
..kcckaggakckk..
..kkk.kkkk.kk...
```

**Yash** (headphones + glasses + laptop)
```
................
....khhhhhhk....
...khhhhhhhhk...
..khhhkkkhhhhk..
..khhhhhhhhhhk..
..khccccccccsk..
..kcksskkssksk..
..kckgsskgsksk..
..kckkssskssssk.
..kssssssssssk..
..kccccccccckk..
.kaaaaaaaaaaak..
.kaggggggggggak.
.kaggkgggkgggak.
.kaaaaaaaaaaak..
...k........k...
```

---

## 5. Feature Specification

### 5.1 Expense Management

| Feature | Detail |
|---|---|
| Add expense | Payer, amount, description, date, category, split mode |
| Split modes | `equal` · `exact` · `percent` · `shares` |
| Edit expense | Admin (shazan) can edit any; others edit own |
| Delete expense | Confirm dialog, soft-delete from array |
| Categories | Transport · Stay · Food · Permits · Gear · Misc |
| Live split preview | Per-member computed amount updates on every keystroke |

### 5.2 Balance & Settlement

- **Balance algorithm:** `paidAmount − shareOwed + settlementsReceived − settlementsSent`
- **Simplified debts:** Greedy creditor/debtor matching → ≤ N−1 transactions
- **Settlement recording:** from/to/amount/date logged to shared storage
- Balance display: green `gets ₹X` / red `owes ₹X` / muted `all settled`

### 5.3 Activity Feed

Every add/edit/delete/settle logs:
```js
{ id, actorId, action, detail, timestamp }
```
Displayed as: `[avatar] Actor action — detail` + human-readable timestamp.

### 5.4 Admin

- `shazan` = group admin. Can edit/delete any entry.
- All others: edit/delete own entries only.
- "Who am I?" identity persisted in `localStorage` (non-shared).

### 5.5 Export

JSON export of full `{ expenses, settlements, activity }` state as downloadable file.

---

## 6. Data Model

### 6.1 Storage Keys (all `shared: true`)

| Key | Type | Description |
|---|---|---|
| `kareri:expenses` | `Expense[]` | All expense records |
| `kareri:settlements` | `Settlement[]` | All payment records |
| `kareri:activity` | `Activity[]` | Audit log (capped at 300) |

### 6.2 Schemas

```ts
Expense {
  id:          string           // 'e_' + timestamp + random
  description: string
  amount:      number           // INR float
  payerId:     MemberId
  category:    Category
  date:        string           // YYYY-MM-DD
  splitMode:   'equal' | 'exact' | 'percent' | 'shares'
  splits:      { memberId: MemberId, amount: number }[]
  createdBy:   MemberId
  createdAt:   number           // Unix ms
}

Settlement {
  id:          string           // 's_' + timestamp + random
  fromId:      MemberId
  toId:        MemberId
  amount:      number
  date:        string
  createdBy:   MemberId
  createdAt:   number
}

Activity {
  id:          string           // 'a_' + timestamp + random
  actorId:     MemberId
  action:      string           // 'added expense' | 'edited expense' | etc.
  detail:      string           // human-readable detail
  timestamp:   number
}
```

### 6.3 Live Sync

Poll every **10 seconds** — compare `[expenses.length, settlements.length, activity.length]` before/after load; re-render on change. Update sync indicator to `updated HH:MM`.

---

## 7. Interaction Patterns

### 7.1 Identity Modal

- Opens on first load if no stored identity.
- 5-column pick grid, each showing pixel avatar + name + tagline.
- Selection saved to `localStorage('kareri:whoami')`.
- Persists across sessions; re-openable via header who-pill.

### 7.2 Form Flow

1. User fills Add Expense form
2. Split preview updates live (per-member computed amounts)
3. Submit → save → redirect to Ledger tab
4. Edit loads expense data back into form with `editId` hidden field

### 7.3 Validation

| Field | Rule |
|---|---|
| `exact` split | Sum of inputs must equal total (±0.01 tolerance) |
| `percent` split | Sum must equal 100% (±0.1 tolerance) |
| `shares` split | Total shares must be > 0 |
| From ≠ To | Settlement from and to must differ |

---

## 8. Animation Specification

### 8.1 Background & Environment

#### Mountain Ridges (3 layers, CSS animation)
```css
/* Layer 1 — foreground moss hills */
.ridge-1 { animation: drift1 60s ease-in-out infinite alternate; }
@keyframes drift1 { from { transform: translateX(-10px); } to { transform: translateX(10px); } }

/* Layer 2 — mid pine range */
.ridge-2 { animation: drift2 80s ease-in-out infinite alternate; }
@keyframes drift2 { from { transform: translateX(-5px); } to { transform: translateX(15px); } }

/* Layer 3 — far snowy peaks */
.ridge-3 { animation: drift3 100s ease-in-out infinite alternate; }
@keyframes drift3 { from { transform: translateX(0); } to { transform: translateX(8px); } }
```
- SVG `viewBox="0 0 1200 300"`, `preserveAspectRatio="none"`
- 3 `<path>` elements using ridge-gradient fills at 20–55% opacity
- `position: fixed; bottom: 0; z-index: 0; pointer-events: none`

#### Falling Mist Particles (JS-spawned, CSS animation)
```css
.particle {
  position: absolute;
  top: -20px;
  background: #F7F9FA;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(255,255,255,0.6);
  animation: fall linear infinite;
}
@keyframes fall {
  0%   { transform: translateY(0) translateX(0); opacity: 0; }
  10%  { opacity: 0.7; }
  90%  { opacity: 0.7; }
  100% { transform: translateY(105vh) translateX(30px); opacity: 0; }
}
```
- **Count:** 18 particles spawned on boot
- **Size:** random `2–6px`
- **Duration:** random `10–24s` per particle
- **Delay:** random `0–10s`
- **Opacity:** random `0.3–0.7`

#### Gradient Sky (static radial, CSS)
```css
body::before {
  background:
    radial-gradient(ellipse 80% 60% at 20% 0%,   rgba(184,212,224,0.5), transparent 60%),
    radial-gradient(ellipse 70% 50% at 85% 10%,   rgba(232,184,103,0.25), transparent 60%),
    radial-gradient(ellipse 60% 40% at 50% 100%,  rgba(95,176,194,0.2), transparent 70%),
    linear-gradient(180deg, #E8F0F2 0%, #F4F6F2 40%, #EEF0E8 100%);
}
```

#### Grain Texture (static, CSS multiply blend)
```css
body::after {
  background-image: url("data:image/svg+xml; /* feTurbulence fractalNoise */ ...");
  opacity: 0.6;
  mix-blend-mode: multiply;
}
```

---

### 8.2 Page Load Sequence (staggered entry)

All entry animations use `animation-fill-mode: backwards` so elements start invisible.

| Element | Animation | Duration | Delay |
|---|---|---|---|
| `<header>` | `slideDown` — opacity 0→1, translateY -12→0 | 0.6s | 0s |
| `<nav.tabs>` | `slideDown` | 0.7s | 0.05s |
| `.card:nth-child(1)` | `cardIn` — opacity 0→1, translateY 16→0 | 0.6s | 0.05s |
| `.card:nth-child(2)` | `cardIn` | 0.6s | 0.12s |
| `.card:nth-child(3)` | `cardIn` | 0.6s | 0.20s |
| `.member-card:nth-child(n)` | `memberPop` — scale 0.85→1, translateY 10→0, opacity | 0.5s | 0.1s + (n × 0.08s) |

```css
@keyframes slideDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes cardIn    { from { opacity: 0; transform: translateY(16px); }  to { opacity: 1; transform: translateY(0); } }
@keyframes memberPop { from { opacity: 0; transform: scale(0.85) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
```

Easing for all entry animations: `cubic-bezier(0.2, 0.8, 0.2, 1)` (spring-like, fast-out).
Member pop uses: `cubic-bezier(0.2, 1.2, 0.5, 1)` (slight overshoot bounce).

---

### 8.3 View Transitions

```css
.view { animation: fadeIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
```
Applied every time a tab switches and re-renders the active view.

---

### 8.4 List Item Animations

**Expense rows, debt rows, activity rows:**
```css
animation: rowIn 0.4s ease backwards;
animation-delay: calc(index × 0.04s);    /* JS: style="animation-delay:${i*0.04}s" */

@keyframes rowIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
```

---

### 8.5 Hover Interactions

| Element | Hover effect |
|---|---|
| `.member-card` | `translateY(-4px) scale(1.02)` + `box-shadow` deepens |
| `.member-card::before` | Color bar at top: `scaleX(0 → 1)`, gradient lake→moss→amber, `0.4s ease` |
| `.member-card .pixel-avatar` | `bounce` — translateY 0→-6→0, `0.5s ease` |
| `.expense-row` | `translateX(4px)` + border → `--lake-2` + soft shadow |
| `.activity-row` | bg tint deepens, left border → `--amber` |
| `.debt-row` | border → `--amber` |
| `.pick` (modal) | `translateY(-3px)` + border → `--lake` + shadow |
| `.who` (header pill) | `translateY(-2px)` + shadow deepens + border → `--lake-2` |
| `.budget-stats .row` | `padding-left: 6px` slide-in |

---

### 8.6 Continuous / Ambient Animations

#### Title gradient shimmer
```css
.brand h1 .italic {
  background: linear-gradient(120deg, var(--lake) 0%, var(--moss) 50%, var(--amber) 100%);
  background-size: 200% 100%;
  animation: shimmer 6s ease-in-out infinite;
}
@keyframes shimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
```

#### Category bar gradient flow
```css
.cat-bar .fill {
  background: linear-gradient(90deg, var(--moss), var(--lake), var(--amber));
  background-size: 200% 100%;
  animation: flowBar 4s ease-in-out infinite;
}
@keyframes flowBar { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
```

#### Sync dot pulse
```css
.sync-dot { animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
```

#### Debt arrow slide
```css
.debt-row .arrow { animation: slideArrow 1.8s ease-in-out infinite; }
@keyframes slideArrow { 0%, 100% { transform: translateX(-3px); } 50% { transform: translateX(3px); } }
```

---

### 8.7 Budget Ring

```css
.ring-fg {
  stroke: url(#ringGrad);              /* SVG linearGradient: lake → moss → amber */
  stroke-linecap: round;
  stroke-dasharray: <circumference>;   /* 2π × 78 = 489.8 */
  stroke-dashoffset: <circumference × (1 - pct)>;
  transition: stroke-dashoffset 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  filter: drop-shadow(0 2px 8px rgba(212,151,58,0.4));
}
```
- Animates from 0% on first render.
- Percentage label text uses gradient clip: `linear-gradient(135deg, --lake-deep, --amber)`.

---

### 8.8 Modals

```css
/* Backdrop */
.modal-backdrop { animation: fadeIn 0.2s ease; }

/* Modal card */
.modal { animation: modalIn 0.35s cubic-bezier(0.2, 1.2, 0.5, 1); }
@keyframes modalIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
```
Backdrop: `backdrop-filter: blur(8px)`, `background: rgba(26,46,42,0.5)`.

---

### 8.9 Toast Notifications

```css
.toast { animation: slideUp 0.4s cubic-bezier(0.2, 1.2, 0.5, 1); }
@keyframes slideUp { from { transform: translate(-50%, 30px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
```
- Appears fixed bottom-center
- Auto-fades after 2.2s (`opacity: 0`, `transition: 0.3s`), removed from DOM at 2.6s
- Style: `background: var(--ink)`, `border: 1px solid var(--lake-2)`, `border-radius: 12px`

---

## 9. Anti-Gravity Builder Prompt

> Build a single-page app called **Basecamp Ledger** — a real-time Splitwise-style trek expense tracker for Kareri Lake, Himachal Pradesh.
>
> **Theme:** "Kareri Seasonal" — light palette derived from four seasons at the lake. Background: layered SVG mountain ridges (3 depth layers with CSS parallax drift, 60–100s alternating translate), falling mist particles (18 JS-spawned circles, 10–24s fall, opacity fade in/out), radial gradient sky (lake teal top-left, amber top-right, lake bottom), subtle fractalNoise grain overlay at 0.6 opacity multiply blend.
>
> **Typography:** Fraunces (headings, italic accent words in amber), JetBrains Mono (amounts, timestamps), Inter (body). Title "Basecamp Ledger" with "Ledger" in italic gradient-shimmer (lake → moss → amber), 6s cycle.
>
> **Members (5):** Shazan (admin, amber beanie + clipboard), Kanika (green cap + binoculars), Saloni (pink beanie + cocoa mug + wide eyes), Anmol (sunglasses + phone — "slow but instagramable"), Yash (headphones + glasses + laptop). All avatars hand-plotted 16×16 pixel SVGs with per-character color palettes. No role badge chips — show name + italic tagline only.
>
> **Animations:** staggered cardIn entry on load (translateY 16→0, opacity, 0.05–0.2s delays), memberPop with slight overshoot (scale 0.85→1, cubic-bezier overshoot), rowIn on list items (translateX -8→0, staggered 0.04s per item), hover lift + scale on member cards with top color bar scaleX reveal, pixel avatar bounce on member card hover, animated budget ring (stroke-dashoffset, 1.2s spring, lake-to-amber gradient stroke with amber glow shadow), flowing gradient category bars, pulsing sync dot, sliding debt arrows, spring modal entry.
>
> **Features:** Equal/exact/percent/shares splits with live per-member preview, simplified-debts settle-up (greedy algorithm, ≤ N−1 transactions), full activity log (actor + timestamp), budget ring at ₹50,000 target, category breakdown, JSON export, admin guards (shazan edits any entry), identity picker persisted in localStorage, shared storage polling every 10s for live sync across all members.

---

## 10. Acceptance Checklist

### Visual
- [ ] All palette tokens match Kareri seasonal spec exactly
- [ ] Fraunces/JetBrains Mono/Inter loaded from Google Fonts
- [ ] Header "Ledger" gradient shimmer runs continuously
- [ ] 3-layer mountain SVG visible at bottom of viewport, all layers
- [ ] 18 mist particles falling with staggered timings
- [ ] Grain texture visible (subtle, multiply blend)

### Avatars
- [ ] All 5 pixel avatars render at correct scale (16px grid, crisp)
- [ ] Shazan: amber beanie visible, clipboard in lower body
- [ ] Kanika: green cap, binoculars in face area (dual circles)
- [ ] Saloni: pink beanie, wide white eyes, cocoa mug lower-right
- [ ] Anmol: dark sunglasses bar, phone body in lower section
- [ ] Yash: headphones top arc + ear cups, glasses frames, laptop bottom rows
- [ ] No role badge tags visible anywhere

### Animations
- [ ] Header + tabs slide down on load
- [ ] Cards animate in with staggered delays
- [ ] Member cards pop in with overshoot, sequenced
- [ ] Tab switch triggers fadeIn on new view
- [ ] Expense/debt/activity rows animate in with rowIn + stagger
- [ ] Member card hover: lift + scale + top bar reveal + avatar bounce
- [ ] Budget ring animates to correct percentage on render
- [ ] Category bars show flowing gradient animation
- [ ] Sync dot pulses continuously
- [ ] Debt arrows slide back and forth
- [ ] Modal animates in with spring scale + backdrop blur
- [ ] Toast slides up from bottom, auto-dismisses

### Functionality
- [ ] Identity modal opens on first visit, persists in localStorage
- [ ] All 4 split modes work with correct math
- [ ] Live split preview updates on amount/member change
- [ ] Simplified debts computed correctly
- [ ] Activity log records all CRUD operations with actor + timestamp
- [ ] Shazan can edit/delete any entry; others only own
- [ ] Shared storage read on every tab switch + 10s poll
- [ ] State change triggers full re-render of active view
- [ ] JSON export downloads valid file
- [ ] Zero external image URLs

---

## 11. File Delivery

| File | Description |
|---|---|
| `basecamp-ledger.html` | Complete single-file app (HTML + CSS + JS inline) |
| `kareri-splitwise-spec.md` | This specification document |

No build step. No dependencies beyond Google Fonts CDN. Open `basecamp-ledger.html` in any modern browser.
