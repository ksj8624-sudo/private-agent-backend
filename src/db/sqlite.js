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
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS agent_histories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_type TEXT NOT NULL,
    workspace TEXT NOT NULL,
    task_type TEXT NOT NULL,
    task TEXT NOT NULL,
    result TEXT,
    status TEXT NOT NULL,
    duration_ms INTEGER,
    error_message TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP )
`);

module.exports = db;
