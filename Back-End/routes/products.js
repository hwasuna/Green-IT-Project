// products.js
import express from "express";
import db from "./db.js";
import authMiddleware from './authMiddleware.js'; // Import the authMiddleware

const router = express.Router();

// Route to get all products (public, no auth needed)
router.get('/', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            console.error('Database error: ', err.message);
            return res.status(500).json({error: 'Database failed'});
        }
        res.json(rows);
    });
});

// Route to add a product (authenticated users can create a product)
router.post('/', authMiddleware, (req, res) => {
    const { name, description, category, price } = req.body;

    const seller_id = req.user.id;  // Utilisation de l'ID de l'utilisateur connecté

    const sql = `
        INSERT INTO products (name, description, category, price, seller_id)
        VALUES(?, ?, ?, ?, ?)
    `;

    db.run(sql, [name, description, category, price, seller_id], function (err) {
        if (err) {
            console.error('Insert error', err.message);
            return res.status(500).json({ error: 'Failed to add product' });
        }

        res.status(201).json({ id: this.lastID, name, description, category, price, seller_id });
    });
});


// Route to delete a product (authenticated users can delete their own products)
router.delete('/:id', authMiddleware, (req, res) => {
    const productId = req.params.id;
    const userId = req.user.id;

    const sqlProduct = 'SELECT seller_id FROM products WHERE id = ?';
    db.get(sqlProduct, [productId], (err, row) => {
        if (err) {
            console.error('Error fetching product:', err.message);
            return res.status(500).json({ error: 'Failed to fetch product' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        const productSellerId = row.seller_id;

        // Si l'utilisateur est l'admin ou le vendeur du produit
        if (req.user.role === 'admin' || productSellerId === userId) {
            const sqlDelete = 'DELETE FROM products WHERE id = ?';
            db.run(sqlDelete, [productId], function (err) {
                if (err) {
                    console.error('Delete error:', err.message);
                    return res.status(500).json({ error: 'Failed to delete product' });
                }

                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Product not found.' });
                }

                res.json({ message: `Product with ID ${productId} deleted.` });
            });
        } else {
            return res.status(403).json({ error: 'You are not authorized to delete this product.' });
        }
    });
});

// Route to get all products of the logged-in user
router.get('/user/products', authMiddleware, (req, res) => {
    const userId = req.user.id; // Get the logged-in user's ID

    const sql = 'SELECT * FROM products WHERE seller_id = ?';
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database failed' });
        }

        res.json(rows);
    });
});



export default router;
