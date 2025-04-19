// Importing the express module (file) from the express's package
import express from "express";

// Importing db from the db.js
import db from "./db.js";

// Creating a mini express app to handle a route concerning products
const router = express.Router();

// Defining the endpoint for products list
router.get('/', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            console.error('Database error : ', err.message)
            return res.status(500).json({error: 'Database failed'})
        }
        res.json(rows)
    })
})

// Exporting this router to index.js to be called 
export default router