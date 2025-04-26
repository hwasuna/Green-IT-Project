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

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    console.log('Submit button clicked');
  
    const loginData = {
      email: document.getElementById('loginEmail').value,
      password: document.getElementById('loginPassword').value
    };
  
    fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    })
    .then(res => res.json())
    .then(data => {
      console.log('Login successful:', data);
      alert('Welcome ' + data.user.username + '!');
      localStorage.setItem('user', JSON.stringify(data.user)); // ✅ Save logged-in user
      window.location.href = 'catalogue.html'; // Redirect after login
    })
    .catch(err => {
      console.error('Login error:', err);
      alert('Invalid login credentials.');
    });
});

document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevents the page from reloading

    console.log('Submit button clicked');

    // Get form data
    const signupData = {
        email: document.getElementById('signupEmail').value,
        username: document.getElementById('signupUsername').value,
        password: document.getElementById('signupPassword').value
    };

    console.log("Signup data sent to server:", signupData); // Debugging: Display the sent data

    // Send a POST request to register
    fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData) // Send data as JSON
    })
    .then(res => res.json())
    .then(data => {
        console.log('Signup successful:', data); // If registration is successful
        alert('Registration successful! You can now log in.');
        // Redirect to login page after successful registration
        window.location.href = 'profile.html';
    })
    .catch(err => {
        console.error('Signup error:', err); // If there is an error
        alert('Error during registration. Please try again.');
    });
});

const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
    // If user is not logged in, show the login form
    document.getElementById('loginBox').style.display = 'block';
    document.getElementById('signupBox').style.display = 'none';
    document.getElementById('profileBox').style.display = 'none';
} else {
    // If user is logged in, display their information
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('signupBox').style.display = 'none';
    document.getElementById('profileBox').style.display = 'block';

    document.getElementById('username').textContent = user.username;
    document.getElementById('email').textContent = user.email;
}

// Logout function
document.getElementById('logoutBtn').addEventListener('click', function () {
    // Remove user from localStorage
    localStorage.removeItem('user');
    
    // Redirect to homepage after logout
    window.location.href = 'home.html'; // Or redirect to login page
});
