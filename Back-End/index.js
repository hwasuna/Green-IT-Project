// Importing the express module (file) from the express's package
import express from 'express';

// Importing the cors module (file) from the cors's package
import cors from 'cors';

// Creating an express app 
const app = express();
const port = 3000;

// Importing the products endpoint from products.js
import productsRoutes from './routes/products.js'
app.use('/api/products', productsRoutes)

// Allowing front-end's request to the back-end
app.use(cors());

// Parsing JSON data into Javascript Object
app.use(express.json());

// Testing the communication between the front-end and back-end
app.get('/api/test', (req, res)=>{
    res.json({message: "Ecobazaar back-end is working"});
});

app.listen(port, ()=> {
    console.log(`Server is running at http://localhost:${port}`);
});