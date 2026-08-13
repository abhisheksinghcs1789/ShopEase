const express = require('express');
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', placeOrder);
router.get('/my', getMyOrders);
router.get('/', adminOnly, getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', adminOnly, updateOrderStatus);

module.exports = router;
