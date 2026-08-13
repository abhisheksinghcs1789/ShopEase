const express = require('express');
const {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getAllProductsAdmin,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Public
router.get('/', getProducts);
router.get('/categories', getCategories);

// Admin (declared before "/:id" so "admin/all" isn't swallowed by the id route)
router.get('/admin/all', protect, adminOnly, getAllProductsAdmin);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.patch('/:id/stock', protect, adminOnly, updateStock);

// Public (kept last - ":id" would otherwise match routes above)
router.get('/:id', getProductById);

module.exports = router;
