document.addEventListener('DOMContentLoaded', () => {
    // Populate category dropdown
    const categories = ['Electronics', 'Clothing', 'Home', 'Garden', 'Food', 'Sports', 'Books', "Kitchen"];
    const categorySelect = document.getElementById('category');
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });

    // Retrieve seller ID from token
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        document.getElementById('seller_id').value = decodedToken.id;
    }

    // Handle form submission
    const form = document.getElementById('sellOrderForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Sell order added successfully!');
                window.location.href = 'catalogue.html';
            } else {
                alert('Error while adding sell order');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Error while adding sell order');
        }
    });
});
