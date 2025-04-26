document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalItemsSpan = document.getElementById('totalItems');
    const totalPriceSpan = document.getElementById('totalPrice');
    const checkoutBtn = document.getElementById('checkoutBtn');

    function updateCartDisplay() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = 0.5;
            totalItemsSpan.textContent = '0';
            totalPriceSpan.textContent = '0';
            return;
        }

        let totalQuantity = 0;
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const div = document.createElement('div');
            div.classList.add('cart-item');
            div.innerHTML = `
                <p><strong>${item.name}</strong> - ${item.price} € x${item.quantity} 
                    (<strong>${(item.price * item.quantity).toFixed(2)} €</strong>)
                    <button class="remove-from-cart" data-index="${index}">Remove</button>
                </p>
            `;
            cartItemsContainer.appendChild(div);

            totalQuantity += item.quantity;
            totalPrice += item.price * item.quantity;
        });

        totalItemsSpan.textContent = totalQuantity;
        totalPriceSpan.textContent = totalPrice.toFixed(2);

        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = 1;
    }

    // ➔ When clicking "Remove"
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            cart.splice(index, 1); // Removes 1 item at the position index
            localStorage.setItem('cart', JSON.stringify(cart));

            updateCartDisplay(); // Refresh the display
        }
    });

    // ➔ When clicking "Checkout"
    checkoutBtn.addEventListener('click', () => {
        alert('Thank you for your purchase! 🛒');
        localStorage.removeItem('cart');
        window.location.href = 'home.html'; // Redirect to home page
    });

    updateCartDisplay(); // ➔ Display the cart on load
});
