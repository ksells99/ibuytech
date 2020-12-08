import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders,
} from "../controllers/orderController.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";

// ROUTES

// POST request for adding new order / GET all orders (admin protected)
router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, adminProtect, getAllOrders);
// GET user orders
router.route("/myorders").get(protect, getMyOrders);
// GET order by ID
router.route("/:id").get(protect, getOrderById);

// PUT to update payment & delivery status
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, adminProtect, updateOrderToDelivered);

export default router;
