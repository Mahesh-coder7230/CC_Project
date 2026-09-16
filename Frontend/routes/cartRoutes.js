const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController.js");
const { protect } = require("../middleware/authMiddleware.js");

// All cart routes require a logged-in user
router.use(protect);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeCartItem);
router.delete("/", clearCart);

module.exports = router;
