document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();

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
            alert('Product added !')
        })
        .catch(err => {
            console.error('Error: ', err)
            alert('Something went wrong')
        })
})

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
      localStorage.setItem('user', JSON.stringify(data.user)); // ✅ Save logged user
      window.location.href = 'catalogue.html'; // Redirect after login
    })
    .catch(err => {
      console.error('Login error:', err);
      alert('Invalid login credentials.');
    });
  });