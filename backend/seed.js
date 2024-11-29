const mongoose = require('mongoose');
const Product = require('./models/Product');


const mongoURI = 'mongodb+srv://oafamn:ZRXyHLS1dtlS1GG5@cluster0.stad7.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';

const products = [
    {
        title: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation.',
        price: 99.99,
        imageUrl: 'ecommerce-frontend/src/assets/images/headphones.jpg',
        featured: true,
    },
    {
        title: 'Smartwatch',
        description: 'Stylish smartwatch with multiple health tracking features.',
        price: 149.99,
        imageUrl: 'ecommerce-frontend/src/assets/images/smartwatch.jpg',
        featured: true,
    },
    {
        title: 'Gaming Mouse',
        description: 'Ergonomic gaming mouse with customizable DPI settings.',
        price: 49.99,
        imageUrl: 'ecommerce-frontend/src/assets/images/mouse.jpg',
        featured: false,
    },
    {
        title: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with excellent sound quality.',
        price: 59.99,
        imageUrl: 'ecommerce-frontend/src/assets/images/speaker.jpg',
        featured: false,
    },
    {
        title: 'Laptop Backpack',
        description: 'Durable and stylish backpack designed for laptops up to 15 inches.',
        price: 39.99,
        imageUrl: 'ecommerce-frontend/src/assets/images/backpack.jpg',
        featured: false,
    },
];

mongoose.connect(mongoURI)
    .then(async () => {
        console.log('MongoDB connected');
        // Clear existing products
        await Product.deleteMany({});
        console.log('Existing products removed');

        // Insert sample products
        await Product.insertMany(products);
        console.log('Sample products inserted');

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
