const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const app = express();


app.use(express.json());

app.get('/', (req,res) => {
    res.send('Hello World');
});

app.get('/products', async(req, res) => {
    try
    {   
        const products = await Product.find({});
        res.status(200).json(products);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message: err.message});
    }
});

app.get('/products', async(req, res) => {
    try
    {   
        const products = await Product.find({});
        res.status(200).json(products);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message: err.message});
    }
});

app.get('/products/:id', async(req, res) => {
    try
    {   
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message: err.message});
    }
});

app.put('/products/:id', async(req, res) => {
    try
    {   
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if (!product) {
            res.status(404).json({message: 'Product not found'});
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message: err.message});
    }
});

app.delete('/products/:id', async(req, res) => {
    try
    {   
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            res.status(404).json({message: 'Product not found'});
        }
        res.status(200).json({message: 'Product deleted successfully'});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message: err.message});
    }
});

mongoose.connect('mongodb+srv://root:ishmam123@express-api.e4axtdy.mongodb.net/Node-API?retryWrites=true&w=majority&appName=express-api')
.then(() => {
    console.log('Database connected');
})
.catch((err) => {
    console.log('Error: ', err);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});