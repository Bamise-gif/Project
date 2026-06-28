const Database = require("better-sqlite3")

const db = new Database("campuspulse.db")

db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT,
    category TEXT,
    description TEXT,
    urgency TEXT,
    status TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS work_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset TEXT,
    detail TEXT,
    status TEXT DEFAULT 'Pending',
    outcome TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`)

try {
  db.exec("ALTER TABLE work_orders ADD COLUMN outcome TEXT")
} catch (e) {
  // column already exists, ignore
}

db.exec(`
  CREATE TABLE IF NOT EXISTS buildings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    health INTEGER,
    status TEXT
  )
`)

const existing = db.prepare("SELECT COUNT(*) as count FROM buildings").get()
if (existing.count === 0) {
  const insert = db.prepare("INSERT INTO buildings (name, health, status) VALUES (?, ?, ?)")
  insert.run("Hartwell Engineering Hall", 62, "Critical")
  insert.run("Linden Residence Tower B", 78, "Watch")
  insert.run("Meridian Library", 94, "Healthy")
}

module.exports = db