document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/products')
      .then(response => response.json())
      .then(produits => {
        const productList = document.querySelector('.products-list');
  
        if (produits.length === 0) {
          productList.innerHTML = '<p>No products available yet.</p>';
          return;
        }
  
        produits.forEach(produit => {
          const div = document.createElement('div');
          div.classList.add('product');
  
          div.innerHTML = `
            <h3>${produit.name}</h3>
            <p><strong>Category:</strong> ${produit.category}</p>
            <p><strong>Description:</strong> ${produit.description}</p>
            <p><strong>Price:</strong> $${produit.price}</p>
          `;
  
          productList.appendChild(div);
        });
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  });