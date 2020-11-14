import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
} from "../controllers/productController.js";

// Use controllers imported above
// Get all products
router.route("/").get(getProducts);

// Get specific product by ID
router.route("/:id").get(getProductById);

export default router;
