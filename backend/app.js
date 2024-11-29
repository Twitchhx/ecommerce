const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')('your-stripe-secret-key'); // Add your Stripe secret key here

const app = express();

// Middleware
app.use(express.json());

// MongoDB connection
const uri = 'mongodb+srv://oafamn:ZRXyHLS1dtlS1GG5@cluster0.stad7.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Routes

// Register user
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'yourSecretKey', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create a product
app.post('/api/products', async (req, res) => {
  const { title, description, price } = req.body;

  try {
    const product = new Product({ title, description, price });
    await product.save();
    res.status(201).json({ message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// **Add to Cart and Place an Order** (1.2)
app.post('/api/cart', async (req, res) => {
  const { userId, products } = req.body;

  try {
    let totalAmount = 0;
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      totalAmount += product.price * item.quantity;
    }

    const order = new Order({
      user: userId,
      products: products.map(p => ({
        product: p.productId,
        quantity: p.quantity,
      })),
      totalAmount,
      status: 'Pending',
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// **Create Payment Intent** (2.1)
app.post('/api/create-payment-intent', async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Stripe requires amount in cents
      currency: 'usd',
      metadata: { orderId: order._id.toString() },
    });

    order.paymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      clientSecret: paymentIntent.client_secret, // Send this to the frontend
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// **Handle Payment Confirmation** (2.2)
app.post('/api/payment-success', async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    const order = await Order.findOne({ paymentIntentId });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      order.status = 'Paid';
    } else {
      order.status = 'Failed';
    }

    await order.save();
    res.json({ message: 'Order payment status updated', order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// View past orders (for logged-in user)
app.get('/api/orders/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ user: userId }).populate('products.product');
    if (orders.length === 0) return res.status(404).json({ error: 'No orders found for this user' });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, price } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, { title, description, price }, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Place an order
app.post('/api/orders', async (req, res) => {
  const { userId, productIds } = req.body;

  try {
    const order = new Order({ user: userId, products: productIds });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
