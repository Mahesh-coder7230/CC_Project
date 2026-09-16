const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware.js');
const {
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
} = require('../controllers/paymentController.js');

// Create a payment order (for initiating Razorpay checkout)
router.post('/create-order',protect , createPaymentOrder);

// Verify payment and create order in database
router.post('/verify-payment', protect, verifyPaymentAndCreateOrder);

module.exports = router;
