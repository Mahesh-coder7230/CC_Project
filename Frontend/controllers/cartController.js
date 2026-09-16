const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");

// Helper: find (or create) the logged-in user's cart, populated with product info
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await cart.populate("items.product");
  }

  return cart;
};

// GET /api/cart  -> get the logged-in user's cart
const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/cart  -> add a product to cart (or increase quantity if it already exists)
// body: { productId, quantity }
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/cart/:productId  -> set/update quantity of a specific item
// body: { quantity }
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || Number(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1 (use the remove endpoint to delete an item)",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find((item) => item.product.toString() === productId);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not in cart" });
    }

    item.quantity = Number(quantity);

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({ success: true, message: "Cart updated", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/cart/:productId  -> remove a single item from cart
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({ success: true, message: "Item removed", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/cart  -> clear the entire cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
