function getUserFromStorage() {
    // Retrieve the 'user' object from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) return null; // If no user found, return null
    try {
        return JSON.parse(userStr); // Parse the stored JSON string and return it
    } catch (error) {
        console.error('Error parsing user JSON:', error); // Log any parsing errors
        return null; // Return null if parsing fails
    }
}

function toggleForm(formType) {
    // Get references to the login, signup, and profile boxes
    const loginBox = document.getElementById('loginBox');
    const signupBox = document.getElementById('signupBox');

    // Show the appropriate form (login or signup) based on formType
    if (formType === 'signup') {
        loginBox.style.display = 'none';  // Hide login form
        signupBox.style.display = 'block'; // Show signup form
    } else {
        loginBox.style.display = 'block';  // Show login form
        signupBox.style.display = 'none';  // Hide signup form
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Get references to form elements and buttons
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginBox = document.getElementById('loginBox');
    const signupBox = document.getElementById('signupBox');
    const profileBox = document.getElementById('profileBox');

    const user = getUserFromStorage(); // Get user from localStorage

    // Show appropriate UI elements based on whether the user is logged in
    if (loginBox && signupBox && profileBox) {
        if (user) {
            loginBox.style.display = 'none'; // Hide login form
            signupBox.style.display = 'none'; // Hide signup form
            profileBox.style.display = 'block'; // Show profile box
            document.getElementById('username').textContent = user.username; // Display username
            document.getElementById('email').textContent = user.email; // Display email
        } else {
            loginBox.style.display = 'block'; // Show login form
            signupBox.style.display = 'none'; // Hide signup form
            profileBox.style.display = 'none'; // Hide profile box
        }
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const email = document.getElementById('loginEmail').value; // Get email from form
            const password = document.getElementById('loginPassword').value; // Get password from form

            try {
                const response = await fetch('http://localhost:3000/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }) // Send login credentials
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Login successful: ', data);
                    alert('Welcome ' + data.user.username + '!'); // Alert user on successful login
                    localStorage.setItem('token', data.token); // Store the token in localStorage
                    localStorage.setItem('user', JSON.stringify(data.user)); // Store user info in localStorage
                    window.location.href = 'catalogue.html'; // Redirect to catalogue page
                } else {
                    console.log('Login failed: ', data);
                    alert(data.error || 'Login failed.'); // Display error message
                }
            } catch (error) {
                console.error('Login error: ', error); // Log any network or other errors
                alert('An error occurred during login.'); // Display error message
            }
        });
    }

    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission

            const signupData = {
                email: document.getElementById('signupEmail').value, // Get email from form
                username: document.getElementById('signupUsername').value, // Get username from form
                password: document.getElementById('signupPassword').value // Get password from form
            };

            fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData) // Send signup data
            })
            .then(res => res.json())
            .then(data => {
                console.log('Signup successful:', data);
                alert('Registration successful! You can now log in.'); // Alert on successful registration
                window.location.href = 'profile.html'; // Redirect to profile page
            })
            .catch(err => {
                console.error('Signup error:', err); // Log any signup errors
                alert('Error during registration. Please try again.'); // Alert on error
            });
        });
    }

    // Handle logout button click
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user'); // Remove user from localStorage
            localStorage.removeItem('token'); // Remove token from localStorage
            window.location.href = 'home.html'; // Redirect to home page
        });
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    
    // If token exists, fetch the user profile
    if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token
        const username = decodedToken.username;  // Extract username from the token
        const email = decodedToken.email;  // Extract email from the token

        // Display profile info
        document.getElementById('username').textContent = username;
        document.getElementById('email').textContent = email;

        // Show profile box and hide login/signup forms
        document.getElementById('profileBox').style.display = 'block';
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('signupBox').style.display = 'none';

        // Fetch the products for the logged-in user
        try {
            const response = await fetch('http://localhost:3000/api/products/user/products', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Pass the token for authentication
                }
            });

            if (response.ok) {
                const products = await response.json(); // Get products for the logged-in user
                
                // Get the products list element
                const productsList = document.getElementById('productsList');
                productsList.innerHTML = '';  // Clear the current list

                // If there are products, display them
                if (products.length > 0) {
                    products.forEach(product => {
                        const listItem = document.createElement('li'); // Create a list item for each product
                        listItem.textContent = `${product.name} - ${product.price} €`; // Set product info in list item

                        // Create delete button
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.addEventListener('click', async () => {
                            // Send request to delete the product
                            try {
                                const deleteResponse = await fetch(`http://localhost:3000/api/products/${product.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${token}` // Pass the token for authentication
                                    }
                                });

                                if (deleteResponse.ok) {
                                    // Remove product from the list in the DOM
                                    listItem.remove();
                                    alert(`Product "${product.name}" deleted successfully.`); // Notify user of success
                                } else {
                                    alert('Failed to delete product'); // Notify user of failure
                                }
                            } catch (error) {
                                console.error('Network error:', error); // Log any network errors
                                alert('Error deleting product'); // Notify user of error
                            }
                        });

                        // Append the delete button to the list item
                        listItem.appendChild(deleteButton);
                        productsList.appendChild(listItem);
                    });
                } else {
                    const noProductsItem = document.createElement('li');
                    noProductsItem.textContent = 'You have no products listed for sale.'; // Show message if no products
                    productsList.appendChild(noProductsItem);
                }

                // Show the user's products section
                document.getElementById('userProducts').style.display = 'block';
            } else {
                alert('Error fetching products'); // Notify user if fetching products fails
            }
        } catch (error) {
            console.error('Network error:', error); // Log any network errors
            alert('Error fetching products'); // Notify user of error
        }
    }
});
