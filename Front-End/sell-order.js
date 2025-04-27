document.addEventListener('DOMContentLoaded', () => {
    // Populate the category dropdown with predefined categories
    const categories = ['Electronics', 'Clothing', 'Home', 'Garden', 'Food', 'Sports', 'Books', "Kitchen"];
    const categorySelect = document.getElementById('category');
    categories.forEach(cat => {
        const option = document.createElement('option'); // Create an option element for each category
        option.value = cat;
        option.textContent = cat; // Set the text and value to the category name
        categorySelect.appendChild(option); // Append the option to the dropdown
    });

    // Retrieve the seller ID from the token stored in localStorage
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token to get the seller ID
        document.getElementById('seller_id').value = decodedToken.id; // Set the seller ID to a hidden input field
    }

    // Handle form submission to create a new sell order
    const form = document.getElementById('sellOrderForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form); // Get all the form data
        const data = Object.fromEntries(formData); // Convert form data to a plain object

        try {
            // Send a POST request to the server to create a new product
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type to JSON
                    'Authorization': `Bearer ${token}` // Attach the token for authentication
                },
                body: JSON.stringify(data) // Send the form data as the body of the request
            });

            if (response.ok) {
                alert('Sell order added successfully!'); // Notify user of successful submission
                window.location.href = 'catalogue.html'; // Redirect to the catalogue page
            } else {
                alert('Error while adding sell order'); // Handle error if the request fails
            }
        } catch (error) {
            console.error('Network error:', error); // Log any network errors
            alert('Error while adding sell order'); // Notify user of an error
        }
    });
});
