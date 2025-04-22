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
