const User = require('../models/User');
const Product = require('../models/Product');

// Cart lives on the user document itself - simplest storage for a project
// this size, and it means the cart survives across devices once logged in.

// GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    next(err);
  }
};

// POST /api/cart  { productId, quantity }
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Only ${product.stock} left in stock` });
    }

    const user = await User.findById(req.user._id);
    const existing = user.cart.find((item) => item.product.toString() === productId);

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    await user.populate('cart.product');
    res.status(201).json(user.cart);
  } catch (err) {
    next(err);
  }
};

// PUT /api/cart/:productId  { quantity }
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1 - use DELETE to remove an item' });
    }

    const user = await User.findById(req.user._id);
    const item = user.cart.find((i) => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    item.quantity = quantity;
    await user.save();
    await user.populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart/:productId
const removeFromCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);
    await user.save();
    await user.populate('cart.product');
    res.json(user.cart);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart - used after a successful checkout
const clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json([]);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
