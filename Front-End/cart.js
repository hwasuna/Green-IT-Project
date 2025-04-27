// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements for displaying cart items, total quantity, and total price
    const cartItemsContainer = document.getElementById('cartItems');
    const totalItemsSpan = document.getElementById('totalItems');
    const totalPriceSpan = document.getElementById('totalPrice');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Function to update and display cart details
    function updateCartDisplay() {
        // Get the cart from localStorage, or initialize an empty array if no cart is found
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Clear the cart items display area before updating it
        cartItemsContainer.innerHTML = '';

        // If the cart is empty, show a message and disable the checkout button
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = 0.5; // Make the checkout button look inactive
            totalItemsSpan.textContent = '0'; // Set total quantity to 0
            totalPriceSpan.textContent = '0'; // Set total price to 0
            return; // Exit the function if the cart is empty
        }

        let totalQuantity = 0; // Variable to keep track of the total quantity of items
        let totalPrice = 0; // Variable to keep track of the total price of items

        // Loop through each item in the cart and display its details
        cart.forEach((item, index) => {
            const div = document.createElement('div');
            div.classList.add('cart-item'); // Add a class to each cart item for styling
            div.innerHTML = `
                <p><strong>${item.name}</strong> - ${item.price} € x${item.quantity} 
                    (<strong>${(item.price * item.quantity).toFixed(2)} €</strong>)
                    <button class="remove-from-cart" data-index="${index}">Remove</button>
                </p>
            `; // Create an HTML structure for each cart item
            cartItemsContainer.appendChild(div); // Append the item to the container

            totalQuantity += item.quantity; // Add the item's quantity to the total quantity
            totalPrice += item.price * item.quantity; // Add the item's total price to the total price
        });

        // Update the displayed total quantity and total price
        totalItemsSpan.textContent = totalQuantity;
        totalPriceSpan.textContent = totalPrice.toFixed(2); // Format the total price to two decimal places

        // Enable the checkout button and make it fully visible
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = 1;
    }

    // Event listener for when a "Remove" button is clicked
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart')) {
            const index = parseInt(e.target.getAttribute('data-index')); // Get the index of the item to remove
            let cart = JSON.parse(localStorage.getItem('cart')) || []; // Get the current cart from localStorage

            cart.splice(index, 1); // Remove the item from the cart at the specified index
            localStorage.setItem('cart', JSON.stringify(cart)); // Update the cart in localStorage

            updateCartDisplay(); // Refresh the cart display after removal
        }
    });

    // Event listener for when the "Checkout" button is clicked
    checkoutBtn.addEventListener('click', () => {
        alert('Thank you for your purchase! 🛒'); // Show a thank you message
        localStorage.removeItem('cart'); // Remove the cart from localStorage (clear the cart)
        window.location.href = 'home.html'; // Redirect the user to the home page
    });

    // Initial call to update the cart display when the page loads
    updateCartDisplay();
});
