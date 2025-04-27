import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || "vraiment_pas_un_secret_mdr";

// Middleware to check for a valid JWT token
const authMiddleware = (req, res, next) => {
  // Check if the authorization header exists
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token with the secret key
    const decoded = jwt.verify(token, SECRET_KEY);

    // Attach the user info to the request for later use in the route handler
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid token.' });
  }
};


export default authMiddleware;
