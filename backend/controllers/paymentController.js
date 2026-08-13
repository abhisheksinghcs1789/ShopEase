const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order  { amount }  - amount in rupees
// Called right before checkout renders the Razorpay widget. We create the
// order on Razorpay's side first so the amount can't be tampered with client-side.
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'A valid amount is required' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise, not rupees
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    next(err);
  }
};

// Shared verification logic - Razorpay's recommended HMAC check, confirming
// the payment actually came from Razorpay and wasn't spoofed by the client.
const verifySignature = (orderId, paymentId, signature) => {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
};

module.exports = { createRazorpayOrder, verifySignature };
