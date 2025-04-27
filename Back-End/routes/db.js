// Importing the sqlite3 module from the sqlite3 framework
import sqlite3 from 'sqlite3';

// Creating a connection to the database file "ecobazaar.db"
const db = new sqlite3.Database('./ecobazaar.db');

// Creating a table within the database file
db.run(`
    CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price REAL,
    available INTEGER DEFAULT 1,
    seller_id INTEGER
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    )
  `);

export default db