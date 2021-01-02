import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
  getTopProducts,
  getActiveAndArchivedProducts,
} from "../controllers/productController.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";

// Use controllers imported above
// Get all active products, add product & review, get top products.
router.route("/").get(getProducts).post(protect, adminProtect, createProduct);
router.route("/:id/reviews").post(protect, createProductReview);
router.get("/top", getTopProducts);
// Get all active & archived products - admin
router.get("/all", protect, adminProtect, getActiveAndArchivedProducts);

// Get specific product by ID
// & delete/add/update product (admin protected)
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, adminProtect, deleteProduct)
  .put(protect, adminProtect, updateProduct);

export default router;
