import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Fetch all products. Async handler means no trycatch required
// @route   GET /api/products
// @access  Public

const getProducts = asyncHandler(async (req, res) => {
  //   Find all from DB & return result
  const products = await Product.find({});
  res.json(products);
});

// @desc    Fetch specific product
// @route   GET /api/products/:id
// @access  Public

const getProductById = asyncHandler(async (req, res) => {
  //   Find product from DB based on ID from URL
  const product = await Product.findById(req.params.id);

  // If product found, return it...
  if (product) {
    res.json(product);

    // Otherwise, return error - use custom error handling middleware
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export { getProducts, getProductById };
