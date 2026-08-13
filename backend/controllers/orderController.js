const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { verifySignature } = require('./paymentController');

const SHIPPING_FEE = 49;

// POST /api/orders  { shippingAddress, paymentMethod, razorpay: {orderId, paymentId, signature} }
// Builds the order from the user's current cart, so the server - not the
// client - is the source of truth for prices and stock at checkout time.
const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = 'razorpay', razorpay } = req.body;

    const user = await User.findById(req.user._id).populate('cart.product');
    if (!user.cart.length) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // Re-check stock right before committing the order, in case it changed
    // since the cart was last loaded.
    for (const item of user.cart) {
      if (!item.product || !item.product.isActive) {
        return res.status(400).json({ message: 'One of the items in your cart is no longer available' });
      }
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ message: `Only ${item.product.stock} left of ${item.product.name}` });
      }
    }

    if (paymentMethod === 'razorpay') {
      if (!razorpay || !verifySignature(razorpay.orderId, razorpay.paymentId, razorpay.signature)) {
        return res.status(400).json({ message: 'Payment verification failed' });
      }
    }

    const items = user.cart.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalAmount = itemsTotal + SHIPPING_FEE;

    const order = await Order.create({
      user: user._id,
      items,
      shippingAddress,
      itemsTotal,
      shippingFee: SHIPPING_FEE,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'razorpay' ? 'paid' : 'pending',
      razorpay: paymentMethod === 'razorpay' ? razorpay : undefined,
      statusHistory: [{ status: 'pending', note: 'Order placed' }],
    });

    // Decrement stock now that the order is confirmed
    await Promise.all(
      items.map((i) => Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.quantity } }))
    );

    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/my - the logged-in user's own order history
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id - single order, for the tracking page
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Owners can view their own order; only admins can view anyone's
    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

// ---- admin ----

// GET /api/orders (admin) - all orders, for the dashboard
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/orders/:id/status (admin)  { status, note }
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({ status, note });
    await order.save();

    res.json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
