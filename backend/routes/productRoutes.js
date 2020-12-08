import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
} from "../controllers/productController.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";

// Use controllers imported above
// Get all products & add product
router.route("/").get(getProducts).post(protect, adminProtect, createProduct);

// Get specific product by ID
// & delete/add/update product (admin protected)
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, adminProtect, deleteProduct)
  .put(protect, adminProtect, updateProduct);

export default router;
