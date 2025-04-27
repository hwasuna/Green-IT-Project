document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in by getting user data from localStorage
    const userConnected = JSON.parse(localStorage.getItem('user'));
    if (userConnected) {
        // If the user is logged in, show the cart link
        const cartLink = document.getElementById('cartLink');
        if (cartLink) {
            cartLink.style.display = 'inline-block';
        }
    }

    // Get the product list container from the DOM
    const productList = document.querySelector('.products-list');

    // Fetch products only if the productList element exists
    if (productList) {
        fetch('http://localhost:3000/api/products')
            .then(response => response.json()) // Parse the JSON response
            .then(products => {
                if (products.length === 0) {
                    productList.innerHTML = '<p>No products available yet.</p>'; // Show message if no products
                    return;
                }

                // Check if the user is an admin
                const user = JSON.parse(localStorage.getItem('user'));
                const isAdmin = user?.role === 'admin';

                // Loop through each product and create a div to display its details
                products.forEach(product => {
                    const div = document.createElement('div');
                    div.classList.add('product');

                    div.innerHTML = `
                        <h3>${product.name}</h3>
                        <p><strong>Category:</strong> ${product.category}</p>
                        <p><strong>Description:</strong> ${product.description}</p>
                        <p><strong>Price:</strong> $${product.price}</p>
                        ${
                            user ? ` 
                                <div class="quantity-control">
                                    <button class="decrease-qty">-</button>
                                    <span class="quantity">1</span>
                                    <button class="increase-qty">+</button>
                                </div>
                                <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
                            ` 
                            : `<p><em>Login to add to cart</em></p>`
                        }
                        ${
                            isAdmin ? `
                                <button class="delete-product" data-id="${product.id}">Delete</button>
                            ` : ''
                        }
                    `;
                    productList.appendChild(div);
                });
            })
            .catch(error => {
                console.error('Error fetching products:', error); // Log any errors
            });
    }

    // Event delegation: single event listener for all actions
    document.addEventListener('click', (e) => {
        // Increase quantity when the "+" button is clicked
        if (e.target.classList.contains('increase-qty')) {
            const qtySpan = e.target.parentElement.querySelector('.quantity');
            qtySpan.textContent = parseInt(qtySpan.textContent) + 1;
        }

        // Decrease quantity when the "-" button is clicked
        if (e.target.classList.contains('decrease-qty')) {
            const qtySpan = e.target.parentElement.querySelector('.quantity');
            const currentQty = parseInt(qtySpan.textContent);
            if (currentQty > 1) {
                qtySpan.textContent = currentQty - 1;
            }
        }

        // Add product to cart when the "Add to Cart" button is clicked
        if (e.target.classList.contains('add-to-cart')) {
            const id = e.target.getAttribute('data-id');
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));

            const quantitySelector = e.target.previousElementSibling;
            const quantity = parseInt(quantitySelector.querySelector('.quantity').textContent);

            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Check if the product is already in the cart
            const existingProduct = cart.find(item => item.id === id);

            if (existingProduct) {
                existingProduct.quantity += quantity; // Update the quantity if already in cart
            } else {
                cart.push({ id, name, price, quantity }); // Add new product to the cart
            }

            // Reset quantity back to 1
            quantitySelector.querySelector('.quantity').textContent = '1';

            localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to localStorage

            alert(`${quantity} x ${name} added to cart!`); // Show a confirmation alert
        }

        // Admin only: Delete product when the "Delete" button is clicked
        if (e.target.classList.contains('delete-product')) {
            const productId = e.target.getAttribute('data-id');
            const token = localStorage.getItem('token');

            // Check if the user is logged in (by checking token)
            if (!token) {
                alert('You must be logged in to delete a product.');
                return;
            }

            // Make DELETE request to remove the product from the database
            fetch(`http://localhost:3000/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(response => {
                if (response.ok) {
                    e.target.closest('.product').remove(); // Remove the product from UI
                    alert('Product deleted successfully');
                } else {
                    alert('Error deleting product');
                }
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                alert('Error deleting product');
            });
        }
    });

    // Handle product addition through a form submission (for admin only)
    document.getElementById('productForm')?.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        const product = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            price: parseFloat(document.getElementById('price').value),
            seller_id: document.getElementById('seller_id').value
        };

        // Send the new product data to the backend API
        fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product) // Send the product data as JSON
        })
        .then(res => res.json())
        .then(data => {
            console.log('Product added:', data);
            alert('Product added!'); // Show success alert
        })
        .catch(err => {
            console.error('Error: ', err);
            alert('Something went wrong'); // Show error alert
        });
    });
});
