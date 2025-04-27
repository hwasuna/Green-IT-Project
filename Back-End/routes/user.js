// user.js
import express from "express"; // Import Express to handle HTTP requests
import db from "./db.js"; // Import the database connection
import bcrypt from "bcryptjs"; // Import bcryptjs for hashing passwords
import jwt from "jsonwebtoken"; // Import jsonwebtoken to create JWT tokens
import authMiddleware from './authMiddleware.js'; // Import the authMiddleware to protect routes

const router = express.Router();

// Secret key for signing JWT tokens, can be set in the environment variables
const SECRET_KEY = process.env.SECRET_KEY || "not_really_a_secret"; // Default fallback key for signing tokens

// REGISTER - Create a new user
router.post('/register', async (req, res) => {
  // Destructure user details from the request body
  const { username, email, password } = req.body;

  // Validation basic checks - ensure all fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // SQL query to insert a new user into the 'users' table
    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

    // Run the SQL query with the provided data
    db.run(sql, [username, email, hashedPassword], function (err) {
      if (err) {
        console.error(err); // Log any error that occurs
        return res.status(400).json({ error: "Email already exists." }); // Return error if the email already exists
      }

      // Return a success response with the new user's ID, username, and email
      res.status(201).json({ id: this.lastID, username, email });
    });
  } catch (err) {
    // Handle errors such as hashing errors
    console.error(err);
    res.status(500).json({ error: "Server error while registering the user." });
  }
});

// LOGIN - Authenticate a user
router.post('/login', (req, res) => {
  // Destructure email and password from the request body
  const { email, password } = req.body;

  // Ensure that both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  // SQL query to find the user by email
  const sql = `SELECT * FROM users WHERE email = ?`;

  // Fetch user from the database
  db.get(sql, [email], async (err, user) => {
    if (err) {
      console.error(err); // Log any error that occurs
      return res.status(500).json({ error: "Server error." }); // Return error if a server issue occurs
    }

    // If no user is found, return an invalid credentials error
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Compare the plain password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." }); // Return error if passwords don't match
    }

    // Create a JWT token for the authenticated user
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, username: user.username },
      SECRET_KEY,
      { expiresIn: "30d" } // Token expires in 30 days
    );

    // Return the token and the user's details in the response
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

// Profile route - Requires Authentication (using authMiddleware)
router.get('/profile', authMiddleware, (req, res) => {
  const userId = req.user.id; // Get the user ID from the token (provided by authMiddleware)

  // SQL query to fetch the user profile data from the 'users' table
  const sql = `SELECT id, username, email, role FROM users WHERE id = ?`;

  // Fetch the user's data from the database
  db.get(sql, [userId], (err, user) => {
    if (err) {
      // Handle any errors that occur while fetching the user data
      return res.status(500).json({ error: err.message });
    }

    // If no user is found, return a 404 error
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Return the user profile data
    res.json(user); // Send back the user details (id, username, email, role)
  });
});

// Export the router to use in other parts of the application
export default router;
