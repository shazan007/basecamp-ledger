const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Serve static frontend files
app.use(express.static(__dirname));

// Initialize DB if it doesn't exist
const defaultDb = {
  members: [],
  expenses: [],
  settlements: [],
  activity: []
};

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2));
}

// Read DB helper
function readDb() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading DB:", err);
    return defaultDb;
  }
}

// Write DB helper
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing DB:", err);
  }
}

// API Routes
app.get('/api/state', (req, res) => {
  const db = readDb();
  res.json(db);
});

app.post('/api/state', (req, res) => {
  const { key, data } = req.body;
  
  if (!key || data === undefined) {
    return res.status(400).json({ error: 'Missing key or data' });
  }

  const db = readDb();
  db[key] = data;
  writeDb(db);
  
  res.json({ success: true, message: `Updated ${key}` });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Basecamp Ledger Server running at http://localhost:${PORT}`);
});
