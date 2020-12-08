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

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (ADMIN)

const deleteProduct = asyncHandler(async (req, res) => {
  //   Find product from DB based on ID from URL
  const product = await Product.findById(req.params.id);

  // If product found, remove from DB
  if (product) {
    await product.remove();
    res.json({ message: "Product deleted from database" });

    // Otherwise, return error - use custom error handling middleware
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Add a product
// @route   POST /api/products
// @access  Private (ADMIN)

const createProduct = asyncHandler(async (req, res) => {
  // Create new product - add sample data (user taken straight to edit after)
  const product = new Product({
    name: "Product name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.png",
    brand: "Product brand",
    category: "Product category",
    countInStock: 0,
    numReviews: 0,
    description: "Product Description",
  });

  // Save to DB
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Edit a product
// @route   PUT /api/products/:id
// @access  Private (ADMIN)

const updateProduct = asyncHandler(async (req, res) => {
  // Get details entered by user from request
  const {
    name,
    price,
    description,
    image,
    brand,
    countInStock,
    category,
  } = req.body;

  // Get product by ID from URL
  const product = await Product.findById(req.params.id);

  if (product) {
    // Set product details to new data from form
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    // Save to DB
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
