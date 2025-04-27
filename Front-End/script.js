function getUserFromStorage() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (error) {
        console.error('Error parsing user JSON:', error);
        return null;
    }
}
function toggleForm(formType) {
    const loginBox = document.getElementById('loginBox');
    const signupBox = document.getElementById('signupBox');

    if (formType === 'signup') {
        loginBox.style.display = 'none';
        signupBox.style.display = 'block';
    } else {
        loginBox.style.display = 'block';
        signupBox.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginBox = document.getElementById('loginBox');
    const signupBox = document.getElementById('signupBox');
    const profileBox = document.getElementById('profileBox');

    const user = getUserFromStorage();


    if (loginBox && signupBox && profileBox) {
        // Only if these elements exist on the page (ex: profile.html)
        if (user) {
            loginBox.style.display = 'none';
            signupBox.style.display = 'none';
            profileBox.style.display = 'block';
            document.getElementById('username').textContent = user.username;
            document.getElementById('email').textContent = user.email;
        } else {
            loginBox.style.display = 'block';
            signupBox.style.display = 'none';
            profileBox.style.display = 'none';
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('http://localhost:3000/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Login successful: ', data);
                    alert('Welcome ' + data.user.username + '!');
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = 'catalogue.html';
                } else {
                    console.log('Login failed: ', data);
                    alert(data.error || 'Login failed.');
                }
            } catch (error) {
                console.error('Login error: ', error);
                alert('An error occurred during login.');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
        
            const signupData = {
                email: document.getElementById('signupEmail').value,
                username: document.getElementById('signupUsername').value,
                password: document.getElementById('signupPassword').value
            };
        
            fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData)
            })
            .then(res => res.json())
            .then(data => {
                console.log('Signup successful:', data);
                alert('Registration successful! You can now log in.');
                window.location.href = 'profile.html';
            })
            .catch(err => {
                console.error('Signup error:', err);
                alert('Error during registration. Please try again.');
            });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = 'home.html';
        });
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    
    // If token exists, fetch the user profile
    if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const username = decodedToken.username;  // Assuming username is part of the token
        const email = decodedToken.email;  // Assuming email is part of the token

        // Display profile info
        document.getElementById('username').textContent = username;
        document.getElementById('email').textContent = email;

        // Show profile box and hide login/signup forms
        document.getElementById('profileBox').style.display = 'block';
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('signupBox').style.display = 'none';

        console.log(token, username, email);

        // Fetch the products for the logged-in user
        try {
            const response = await fetch('http://localhost:3000/api/products/user/products', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const products = await response.json();
                
                // Get the products list element
                const productsList = document.getElementById('productsList');
                productsList.innerHTML = '';  // Clear the current list

                // If there are products, display them
                if (products.length > 0) {
                    products.forEach(product => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${product.name} - ${product.price} €`;
                                                // Create delete button
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.addEventListener('click', async () => {
                            // Send request to delete the product
                            try {
                                const deleteResponse = await fetch(`http://localhost:3000/api/products/${product.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                });

                                if (deleteResponse.ok) {
                                    // Remove product from the list in the DOM
                                    listItem.remove();
                                    alert(`Product "${product.name}" deleted successfully.`);
                                } else {
                                    alert('Failed to delete product');
                                }
                            } catch (error) {
                                console.error('Network error:', error);
                                alert('Error deleting product');
                            }
                        });

                        // Append the delete button to the list item
                        listItem.appendChild(deleteButton);
                        productsList.appendChild(listItem);
                    });
                } else {
                    const noProductsItem = document.createElement('li');
                    noProductsItem.textContent = 'You have no products listed for sale.';
                    productsList.appendChild(noProductsItem);
                }

                // Show the user's products section
                document.getElementById('userProducts').style.display = 'block';
            } else {
                alert('Error fetching products');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Error fetching products');
        }
    }
});

