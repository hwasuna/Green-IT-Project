// Importing the express module from the express's package
import express from "express";

// Importing db from the db.js
import db from "./db.js";

// Creating a mini express app to handle users (register/login) routes
const router = express.Router();

// Defining a POST (http method) to register a user in the db
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
  
    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.run(sql, [username, email, password], function (err) {
      if (err) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(201).json({ id: this.lastID, username, email });
    });
  });

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.get(sql, [email, password], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user });
  });
});