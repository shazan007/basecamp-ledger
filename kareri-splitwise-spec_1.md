# Kareri Lake Trek — Group Expense Tracker

**Project codename:** `BasecampLedger`
**Target platform:** Antigravity Website Builder (single-page web app)
**Theme:** Himalayan trek / Kareri Lake, Himachal Pradesh
**Tech:** HTML + TailwindCSS + vanilla JS (or React). No backend framework required — uses shared key-value storage for real-time sync.

---

## 1. Group Members

| Handle | Name | Role | Avatar Concept | Accent Color |
|---|---|---|---|---|
| `shazan` | Shazan | Group Admin & Organizer | **The Sherpa** — compass, map roll, lantern | `#E8B84A` (lantern gold) |
| `kanika` | Kanika | Expert Travel Planner | **The Cartographer** — binoculars, route map, pin badges | `#3D7A5F` (pine green) |
| `saloni` | Saloni | Newbie to Mountains | **The Cub** — oversized beanie, hot cocoa mug, wide eyes | `#D96C5A` (terracotta) |
| `anmol` | Anmol | Founder / Entrepreneur | **The Summit CEO** — laptop on rock, headset, power bank | `#4A6FA5` (alpine blue) |
| `yash` | Yash | Genius Coder | **The Debug Ranger** — glowing laptop, headphones, bracket hoodie | `#8B5FBF` (twilight violet) |

Avatars are rendered as inline SVG — no external image dependencies, always available offline, scale cleanly.

---

## 2. Feature Set (Splitwise parity)

### Core
- Add expense: payer, amount, description, date, category, split mode
- Split modes: **equal**, **exact amounts**, **percentage**, **shares**
- Settle up: record payments between members
- Running balance per member (who owes whom, net)
- Simplified debts algorithm (minimizes number of transactions to settle)
- Expense categories: Transport, Stay, Food, Permits, Gear, Misc
- Edit / delete expense (admin-guarded)
- Activity feed: chronological log of every action with timestamp + actor

### Online / Shared
- All expenses stored in **shared storage** (`window.storage` with `shared=true`)
- Any member opens the app → sees the same ledger
- Activity feed shows *who* added *what* and *when*
- Auto-refresh every 10 seconds to pull latest state

### Group admin (Shazan)
- Can edit/delete any entry
- Others can only edit/delete their own entries
- "Who am I?" picker on first load — persisted in local storage

### Nice-to-haves included
- Trek budget target + progress bar
- Per-category spend breakdown
- Export as JSON backup
- Dark-mode only (matches alpine night theme)

---

## 3. Visual Theme — "Alpine Night"

- **Palette:** deep navy `#0B1220` base, pine green `#1E3A2F` panels, snow white `#F4F1EA` text, lantern gold `#E8B84A` primary accent, terracotta `#D96C5A` alert
- **Typography:** `Fraunces` (display serif, for headings — editorial, mountaineering-journal feel) + `JetBrains Mono` (numbers, amounts, timestamps) + `Inter` fallback for body
- **Background:** layered SVG mountain silhouettes (3 ridge layers, parallax depth), subtle grain overlay, faint topographic contour lines
- **Motion:** stagger-in on load, gold shimmer on "settled" state, snowfall particle in header, subtle hover lifts on cards
- **Icons:** inline SVG, hand-drawn weight (stroke 1.5)

---

## 4. Data Model

```js
// shared storage keys
"trip:meta"              → { name, destination, startDate, endDate, budget, currency }
"trip:members"           → [ { id, name, role, avatarSeed, color } ]
"trip:expenses"          → [ { id, payerId, amount, description, category, date,
                               splitMode, splits: [{memberId, amount}], createdAt, createdBy } ]
"trip:settlements"       → [ { id, fromId, toId, amount, date, createdAt, createdBy } ]
"trip:activity"          → [ { id, actorId, action, target, timestamp, detail } ]
```

All keys use `shared=true` so every member sees the same data.

---

## 5. Pages / Views (single-page, tab-switched)

1. **Basecamp** (home) — trip summary, budget ring, recent activity, net balances
2. **Ledger** — full expense list, filter by member/category/date
3. **Add** — expense entry form with live split preview
4. **Settle** — simplified debts view + "record payment" action
5. **Activity** — full audit log

---

## 6. Antigravity Builder Prompt

> Build a single-page web app called **Basecamp Ledger** — a Splitwise-style expense tracker themed around a Himalayan trek to Kareri Lake. Use the Alpine Night palette (deep navy, pine green, lantern gold, terracotta). Typography: Fraunces for headings, JetBrains Mono for numbers. Use inline SVG mountain silhouettes as the page background with 3 parallax ridge layers and a subtle grain overlay. Five fixed members with inline SVG avatars (Shazan-Sherpa, Kanika-Cartographer, Saloni-Cub, Anmol-CEO, Yash-DebugRanger). All state in `window.storage` with `shared=true` so every member sees the same ledger. Implement equal/exact/percentage/shares splits, simplified-debts settle-up, activity feed with actor + timestamp, budget tracker, category breakdown, and JSON export. Dark mode only. No external image dependencies.

---

## 7. Acceptance Checklist

- [ ] All 5 members render with distinct inline SVG avatars
- [ ] Expenses persist across browser sessions and across users (shared storage)
- [ ] Balances recompute correctly for all four split modes
- [ ] Simplified-debts algorithm reduces to ≤ N-1 settlements
- [ ] Activity feed records every add/edit/delete/settle with actor + UTC timestamp
- [ ] "Who am I?" picker persists in local (non-shared) storage
- [ ] App works offline after first load (no external fetches)
- [ ] Zero external image URLs
