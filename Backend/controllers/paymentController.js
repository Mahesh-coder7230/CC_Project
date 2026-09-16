const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order.js');
const { sendOrderConfirmationEmail } = require('../utils/emailService.js');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay payment order
const createPaymentOrder = async (req, res) => {
  try {
    const { amount, items, shippingAddress } = req.body;

    if (!amount || !items || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Amount should be in paise (1 INR = 100 paise)
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
    });
  }
};

// Verify Razorpay payment and create order in database
const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingAddress,
      totalAmount,
    } = req.body;

    // Verify Razorpay signature
    const signatureBody = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(signatureBody)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Create order in database
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod: 'online',
      totalAmount,
      paymentDetails: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
      paymentStatus: 'completed',
    });

    // Send confirmation email
    const userEmail = req.user.email;
    const userName = req.user.name;
    const orderId = order._id;

    await sendOrderConfirmationEmail(
      userEmail,
      userName,
      orderId,
      items,
      totalAmount
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully. Payment completed.',
      order,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment and create order',
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
};
