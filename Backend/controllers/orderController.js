const Order = require("../models/Order.js");
const { sendOrderConfirmationEmail } = require("../utils/emailService.js");

const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    } = req.body;

    if (
      !items ||
      items.length === 0 ||
      !shippingAddress ||
      !paymentMethod ||
      totalAmount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete order details",
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    // Send confirmation email to user
    const userEmail = req.user.email;
    const userName = req.user.name;
    const orderId = order._id;

    const emailSent = await sendOrderConfirmationEmail(
      userEmail,
      userName,
      orderId,
      items,
      totalAmount
    );

    return res.status(201).json({
      success: true,
      message: emailSent
        ? "Order placed successfully. Confirmation email sent."
        : "Order placed successfully, but the confirmation email could not be sent.",
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

const getAdminReport = async (req, res) => {
  try {
    const orders = await Order.find()
      .select("shippingAddress items totalAmount orderStatus createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const productSales = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = String(item.product);
        if (!productSales[key]) {
          productSales[key] = {
            productId: key,
            name: item.name,
            unitsSold: 0,
            revenue: 0,
          };
        }
        productSales[key].unitsSold += item.quantity;
        productSales[key].revenue += item.price * item.quantity;
      });
    });

    return res.json({
      success: true,
      orders,
      productSales: Object.values(productSales).sort(
        (first, second) => second.unitsSold - first.unitsSold
      ),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load admin report",
    });
  }
};

module.exports = {
  createOrder,
  getAdminReport,
};