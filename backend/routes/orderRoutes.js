import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

// ROUTES

// POST request for adding new order
router.route("/").post(protect, addOrderItems);
// GET user orders
router.route("/myorders").get(protect, getMyOrders);
// GET order by ID
router.route("/:id").get(protect, getOrderById);

// PUT to update payment status
router.route("/:id/pay").put(protect, updateOrderToPaid);

export default router;
