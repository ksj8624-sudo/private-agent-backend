const Database = require("better-sqlite3");
const db = new Database("data/agent.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS review_histories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repository TEXT NOT NULL,
    pr_number INTEGER NOT NULL,
    title TEXT,
    author TEXT,
    pr_url TEXT,
    review TEXT NOT NULL,
    created_at TEXT NOT NULL )
`);

module.exports = db;
