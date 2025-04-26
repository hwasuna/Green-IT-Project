document.addEventListener('DOMContentLoaded', () => {
  const userConnected = JSON.parse(localStorage.getItem('user'));
  if (userConnected) {
      const cartLink = document.getElementById('cartLink');
      if (cartLink) {
          cartLink.style.display = 'inline-block';
      }
  }

  fetch('http://localhost:3000/api/products')
      .then(response => response.json())
      .then(products => {
          const productList = document.querySelector('.products-list');

          if (products.length === 0) {
              productList.innerHTML = '<p>No products available yet.</p>';
              return;
          }

          const user = JSON.parse(localStorage.getItem('user'));

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
              `;

              productList.appendChild(div);
          });
      })
      .catch(error => {
          console.error('Error fetching products:', error);
      });

  // ➔ One event listener for all actions
  document.addEventListener('click', (e) => {
      // ➔ Handle + buttons
      if (e.target.classList.contains('increase-qty')) {
          const qtySpan = e.target.parentElement.querySelector('.quantity');
          qtySpan.textContent = parseInt(qtySpan.textContent) + 1;
      }

      // ➔ Handle - buttons
      if (e.target.classList.contains('decrease-qty')) {
          const qtySpan = e.target.parentElement.querySelector('.quantity');
          const currentQty = parseInt(qtySpan.textContent);
          if (currentQty > 1) {
              qtySpan.textContent = currentQty - 1;
          }
      }

      // ➔ Add to cart
      if (e.target.classList.contains('add-to-cart')) {
          const id = e.target.getAttribute('data-id');
          const name = e.target.getAttribute('data-name');
          const price = parseFloat(e.target.getAttribute('data-price'));

          // ✨ Get the associated quantity for the product
          const quantitySelector = e.target.previousElementSibling;
          const quantity = parseInt(quantitySelector.querySelector('.quantity').textContent);

          let cart = JSON.parse(localStorage.getItem('cart')) || [];

          // Check if product is already in the cart
          const existingProduct = cart.find(item => item.id === id);

          if (existingProduct) {
              existingProduct.quantity += quantity; // Add to existing one
          } else {
              cart.push({ id, name, price, quantity }); // Otherwise, add new product
          }

          quantitySelector.querySelector('.quantity').textContent = '1';

          localStorage.setItem('cart', JSON.stringify(cart));

          alert(`${quantity} x ${name} added to cart!`);
      }
  });
});

// Product add form
document.getElementById('productForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  console.log('Submit button clicked');

  const product = {
      name: document.getElementById('name').value,
      description: document.getElementById('description').value,
      category: document.getElementById('category').value,
      price: parseFloat(document.getElementById('price').value),
      seller_id: document.getElementById('seller_id').value
  };

  fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
  })
      .then(res => res.json())
      .then(data => {
          console.log('Product added:', data);
          alert('Product added!');
      })
      .catch(err => {
          console.error('Error: ', err);
          alert('Something went wrong');
      });
});
