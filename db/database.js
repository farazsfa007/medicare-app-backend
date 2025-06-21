const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'medicare.db'), (err) => {
    if (err) console.error("DB Connection Error:", err.message);
    else console.log("Connected to SQLite DB.");
});

// Create users table if not exists
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS medications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        frequency TEXT NOT NULL,
        isTaken INTEGER DEFAULT 0,
        date TEXT NOT NULL,
        FOREIGN KEY(userId) REFERENCES users(id)
    )
`);


module.exports = db;
