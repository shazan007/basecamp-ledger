# Basecamp Ledger

Basecamp Ledger is a lightweight, real-time group expense tracker built for a trekking crew visiting Kareri Lake, Himachal Pradesh. It behaves like a themed, trip-specific Splitwise clone: teammates can log shared expenses, split costs in multiple ways, track balances, record settlements, and review a shared activity feed.

Live site: https://shazan007.github.io/basecamp-ledger/

GitHub repository: https://github.com/shazan007/basecamp-ledger

## Overview

The app is a static front end written in plain HTML, CSS, and JavaScript. It uses Firebase Realtime Database directly from the browser, so there is no backend application layer in this snapshot. The UI is designed around a trek theme with animated pixel avatars, mountain scenery, and rotating seasonal doodles.

This local folder appears to be a project snapshot rather than a live git checkout:

- `.git` is not present in this workspace
- `package.json` is not present
- `README.md` was missing before this documentation pass

That means the app can still be documented and run locally as a static site, but git-based workflows must be done from a proper cloned repository.

## Key Features

- Real-time shared expense tracking through Firebase Realtime Database
- Identity picker stored in `localStorage` so each person can act as themselves
- Budget dashboard with total spend, remaining budget, and category breakdown
- Shared regional weather tab for Dharamshala, Kareri Village, and Kareri Lake
- Crew balance cards showing who owes money and who should receive money
- Four split modes for expenses:
  - `equal`
  - `exact`
  - `percent`
  - `shares`
- Expense ledger with category filtering
- Edit and delete controls for the expense creator and the admin user `shazan`
- Automatic debt simplification for settlement suggestions
- Manual settlement logging
- Shared activity log
- JSON export of trip data
- Crew name and tagline editing
- Admin-only "Trip Ended" reset action
- Region clock pinned in the top-right corner
- Database-driven visual theme changes for day, sunset, dawn, night, and weather overlays
- Animated seasonal doodle widget and custom avatar preview page

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Firebase Realtime Database v8 compat SDK loaded from CDN
- GitHub Pages for hosting

## Project Structure

```text
.
|-- index.html              Main single-page application shell
|-- app.js                  Core application logic and Firebase sync
|-- styles.css              Full visual system and responsive styling
|-- doodles.js              Animated seasonal doodle engine
|-- avatar-preview.html     Standalone preview page for trek avatars
|-- Images/
|   |-- *.png               Source portrait assets
|   |-- *-pixel.svg         Animated avatar assets used in the app
|-- node_modules/           Checked-in dependencies, not used by a build step here
```

## How The App Works

### 1. Identity

On first load, the user picks a crew identity from the modal. The selected member id is stored in browser storage under:

```text
kareri:whoami
```

There is no real authentication layer. Identity is client-side only.

### 2. Data Storage

The app keeps an in-memory `SERVER_STATE` object and syncs these top-level Firebase collections:

- `members`
- `expenses`
- `settlements`
- `activity`

The browser listens to the database root with `db.ref().on('value', ...)`, so changes appear across all open clients in real time.

Weather data is also stored in Firebase under:

- `weather`
- `weatherSyncLock`

### 3. First-Time Initialization

If Firebase has no `members` data yet, the app seeds these default trek members:

- `shazan`
- `kanika`
- `saloni`
- `anmol`
- `yash`

### 4. Balances And Settlements

Balances are calculated by:

- adding each expense amount to the payer
- subtracting each participant's split share
- adjusting balances again when settlements are recorded

The "Simplified Debts" view uses a greedy debtor/creditor matching algorithm to reduce the number of transfers needed to settle the group.

## Main Screens

### Basecamp

The dashboard shows:

- expedition budget progress
- total spent vs remaining
- category totals
- per-member balance status
- recent activity

### Weather

The weather tab shows a shared regional forecast for:

- Dharamshala
- Kareri Village
- Kareri Lake

The forecast is fetched from Open-Meteo and cached in Firebase so clients do not each repeatedly hit the weather API.

Weather behavior:

- refreshes the shared weather payload every 30 minutes when stale
- uses a lightweight Firebase lock to avoid duplicate refreshes from multiple open clients
- stores a theme state derived from current conditions and sunrise/sunset timing
- updates the app background between day, dawn, sunset, and night modes
- adds a subtle overlay for clear, cloudy, rain, storm, or snow conditions

The current budget constant is:

```text
50000
```

### Add Expense

Users can record:

- description
- amount
- date
- category
- payer
- split mode

Split behavior:

- `equal`: divides the total evenly among all members
- `exact`: entered values must equal the full amount
- `percent`: entered values must total 100
- `shares`: entered values become weighted shares of the total

### Ledger

The ledger lists all expenses sorted by most recent first and supports filtering by category.

Editing permissions:

- the creator of the expense can edit/delete it
- `shazan` can edit/delete any expense

### Settle Up

The settle view shows:

- simplified suggested transfers
- a form to record manual payments between members

### Activity

The activity screen contains:

- expedition log
- JSON export button
- admin-only reset button labeled `Trip Ended`

## Data Model

Representative shapes used by the app:

```json
{
  "members": [
    { "id": "shazan", "name": "Shazan", "tagline": "Budding Vlogger" }
  ],
  "expenses": [
    {
      "id": "e_...",
      "description": "Bus to Dharamshala",
      "amount": 2400,
      "payerId": "shazan",
      "category": "Transport",
      "date": "2026-04-20",
      "splitMode": "equal",
      "splits": [
        { "memberId": "shazan", "amount": 480 }
      ],
      "createdBy": "shazan",
      "createdAt": 1776700000000
    }
  ],
  "settlements": [
    {
      "id": "s_...",
      "fromId": "saloni",
      "toId": "kanika",
      "amount": 500,
      "date": "2026-04-20",
      "createdBy": "saloni",
      "createdAt": 1776700000000
    }
  ],
  "activity": [
    {
      "id": "a_...",
      "actorId": "shazan",
      "action": "added expense",
      "detail": "Bus to Dharamshala - Rs 2400",
      "timestamp": 1776700000000
    }
  ]
}
```

## Running Locally

Because this is a static app, there is no required build step in the checked-in code. The simplest options are:

1. Serve the folder with a local static server.
2. Open the hosted GitHub Pages deployment.

Recommended local options:

- VS Code Live Server
- `python -m http.server`
- any equivalent static file server

Then open:

```text
http://localhost:<port>/index.html
```

You can also open:

```text
avatar-preview.html
```

to inspect the character assets separately.

## Firebase Setup

The app expects Firebase to be configured in `app.js` and currently contains a Firebase config object already wired into the code.

Relevant initialization flow:

- `firebase.initializeApp(firebaseConfig)`
- `const db = firebase.database()`
- `db.ref().on('value', ...)`

If you want to run this against your own Firebase project:

1. Create a Firebase project.
2. Enable Realtime Database.
3. Replace the `firebaseConfig` object in `app.js`.
4. Configure Realtime Database rules appropriately.
5. Reload the app.

## Deployment

This project is structured to work well with GitHub Pages because it is a static site:

- `index.html` is the entry point
- assets are relative-path based
- no bundling step is required

The live deployment URL found in the app metadata is:

```text
https://shazan007.github.io/basecamp-ledger/
```

## Notes About Dependencies

`node_modules/` is present in this workspace, but there is no top-level `package.json` or active build process in the checked-in app files. The visible application logic is fully client-side and does not import those packages from the browser code.

In practice, this means:

- the app behaves like a static site
- npm install is not required for the current front-end flow
- the checked-in `node_modules/` directory is not the source of truth for application behavior

## Known Limitations

- No real authentication or access control on the client
- Admin behavior is hard-coded around the member id `shazan`
- Firebase credentials are embedded in the front end, so database rules matter
- No automated test suite is included in this snapshot
- No package manifest is included for reproducible dependency management
- This local workspace is not a git checkout, so git commands cannot be used here directly

## Suggested Improvements

- Add proper authentication instead of local identity selection only
- Move privileged operations behind secure backend logic or stronger Firebase rules
- Add a real `package.json` if dependency management is expected
- Add a small local development server script
- Add automated tests for balance calculation and debt simplification
- Split `app.js` into smaller modules for maintainability
- Add environment-specific Firebase configuration

## Repository Access Check

Repository access was verified separately from this local snapshot:

- GitHub homepage was reachable from the environment
- GitHub Pages for this project was reachable
- `https://github.com/shazan007/basecamp-ledger` responded successfully
- The repository title resolved as `GitHub - shazan007/basecamp-ledger: Splitwise for trekkers`

That confirms the remote repository is accessible, even though this specific local folder is not a git clone.
