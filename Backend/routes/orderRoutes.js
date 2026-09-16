const express = require("express");

const router = express.Router();

const { createOrder, getAdminReport } = require("../controllers/orderController.js");

const { protect, adminOnly } = require("../middleware/authMiddleware.js");

router.get("/admin-report", protect, adminOnly, getAdminReport);
router.post("/", protect, createOrder);

module.exports = router;