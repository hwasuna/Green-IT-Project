import db from './routes/db.js';
import bcrypt from 'bcryptjs';

// create user with hashed password
const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash('admin', 10); // hashed password

  const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
  
  db.run(sql, ['admin2', 'admin2@efrei.net', hashedPassword, 'admin'], function(err) {
    if (err) {
      console.error('Error creating admin:', err.message);
    } else {
      console.log('Admin user created with ID:', this.lastID);
    }
  });
};

createAdmin();
