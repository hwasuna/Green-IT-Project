// user.js
import express from "express";
import db from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from './authMiddleware.js'; // Import the authMiddleware

const router = express.Router();

// Secret key for signing JWT tokens
const SECRET_KEY = process.env.SECRET_KEY || "not_really_a_secret"; 

// REGISTER - Create a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validation basic checks
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
  db.run(sql, [username, email, hashedPassword], function (err) {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: "Email already exists." });
    }
    res.status(201).json({ id: this.lastID, username, email });
  });
});

// LOGIN - Authenticate a user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const sql = `SELECT * FROM users WHERE email = ?`; 
  db.get(sql, [email], async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error." });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // 👇 Compare plain password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, username: user.username },
      SECRET_KEY,
      { expiresIn: "30d" }
    );

    res.json({
      message: 'Login successful',
      token: token,
      user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
      }
  });
  
  });
});


// Profile route - Requires Authentication
router.get('/profile', authMiddleware, (req, res) => {
  const userId = req.user.id; // Get user ID from the token

  const sql = `SELECT id, username, email, role FROM users WHERE id = ?`;
  db.get(sql, [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user); // Send user profile data
  });
});

export default router;
