// products.js
import express from "express"; // Import express to handle HTTP requests
import db from "./db.js"; // Import the database connection
import authMiddleware from './authMiddleware.js'; // Import the authMiddleware for authenticated routes

const router = express.Router();

// Route to get all products (public, no authentication needed)
router.get('/', (req, res) => {
    // Query the database to get all products
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            // Log the database error if something goes wrong
            console.error('Database error: ', err.message);
            return res.status(500).json({ error: 'Database failed' });
        }
        // Send the products as a JSON response
        res.json(rows);
    });
});

// Route to add a product (authenticated users can create a product)
router.post('/', authMiddleware, (req, res) => {
    // Destructure product details from the request body
    const { name, description, category, price } = req.body;

    // Use the ID of the currently authenticated user (seller) to store the product
    const seller_id = req.user.id;

    // SQL query to insert a new product into the database
    const sql = `
        INSERT INTO products (name, description, category, price, seller_id)
        VALUES(?, ?, ?, ?, ?)
    `;

    // Run the SQL query with the provided data
    db.run(sql, [name, description, category, price, seller_id], function (err) {
        if (err) {
            // Log the error if the insertion fails
            console.error('Insert error', err.message);
            return res.status(500).json({ error: 'Failed to add product' });
        }

        // Return the new product details (including the generated ID) as a JSON response
        res.status(201).json({ id: this.lastID, name, description, category, price, seller_id });
    });
});

// Route to delete a product (authenticated users can delete their own products)
router.delete('/:id', authMiddleware, (req, res) => {
    const productId = req.params.id; // Get the product ID from the URL parameter
    const userId = req.user.id; // Get the authenticated user's ID

    // SQL query to get the seller ID of the product
    const sqlProduct = 'SELECT seller_id FROM products WHERE id = ?';
    
    // Fetch the product by its ID to check the seller ID
    db.get(sqlProduct, [productId], (err, row) => {
        if (err) {
            // Log error if fetching the product fails
            console.error('Error fetching product:', err.message);
            return res.status(500).json({ error: 'Failed to fetch product' });
        }

        if (!row) {
            // Return error if the product is not found
            return res.status(404).json({ error: 'Product not found.' });
        }

        const productSellerId = row.seller_id;

        // Check if the user is either the admin or the seller of the product
        if (req.user.role === 'admin' || productSellerId === userId) {
            // SQL query to delete the product
            const sqlDelete = 'DELETE FROM products WHERE id = ?';
            db.run(sqlDelete, [productId], function (err) {
                if (err) {
                    // Log error if deleting the product fails
                    console.error('Delete error:', err.message);
                    return res.status(500).json({ error: 'Failed to delete product' });
                }

                if (this.changes === 0) {
                    // Return error if the product was not found in the database
                    return res.status(404).json({ error: 'Product not found.' });
                }

                // Return a success message confirming that the product has been deleted
                res.json({ message: `Product with ID ${productId} deleted.` });
            });
        } else {
            // Return error if the user is not authorized to delete the product
            return res.status(403).json({ error: 'You are not authorized to delete this product.' });
        }
    });
});

// Route to get all products of the logged-in user (seller's products)
router.get('/user/products', authMiddleware, (req, res) => {
    const userId = req.user.id; // Get the logged-in user's ID (seller's ID)

    // SQL query to get all products that belong to the current logged-in user (seller)
    const sql = 'SELECT * FROM products WHERE seller_id = ?';

    // Query the database for products of the current user
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            // Log error if querying the database fails
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database failed' });
        }

        // Send the list of the user's products as a JSON response
        res.json(rows);
    });
});

// Export the router to be used in the main server file
export default router;
