// Importing the express module (file) from the express's package
import express from 'express';

// Importing the cors module (file) from the cors's package
import cors from 'cors';

// Creating an express app 
const app = express();

// Allowing front-end's request to the back-end
app.use(cors());

// Parsing JSON data into Javascript Object
app.use(express.json());

// Defining a port for the app
const port = process.env.PORT || 3000;

// Importing the products endpoint from products.js
import productsRoutes from './routes/products.js';
app.use('/api/products', productsRoutes);

import userRoutes from './routes/user.js';
app.use('/api/users', userRoutes)



// Testing the communication between the front-end and back-end
app.get('/api/test', (req, res)=>{
    res.json({message: "Ecobazaar back-end is working"});
});

// Default endpoint
app.get('/', (req, res) => {
    res.send(`
    <html>
        <head>
            <title> EcoBazaar </title>
        </head>
        <body>
            <h1> Welcome to Ecobazaar Back-end </h1>
            <p> This is your API. Use /api/products to see product data </p>
            <p> This is your API. Use /api/users to see user data </p>
        </body>
    </html>
    `);
})

// App running at local port 3000
app.listen(port, ()=> {
    console.log(`Server is running at http://localhost:${port}`);
});
