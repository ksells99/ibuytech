import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Fetch all products. Async handler means no trycatch required
// @route   GET /api/products
// @access  Public

const getProducts = asyncHandler(async (req, res) => {
  // No of products per page
  const pageSize = 3;
  // Get page number from API URL - if not there, use page 1
  const page = Number(req.query.pageNumber) || 1;

  // Get search query from API URL called e.g. /products?iphone - if exists, set name based on regex. Else do nothing
  const keyword = req.query.keyword
    ? {
        name: {
          // Contains part of name
          $regex: req.query.keyword,
          // Case insensitive
          $options: "i",
        },
      }
    : {};

  // Get count of products matching search keyword
  const count = await Product.countDocuments({ ...keyword });

  //   Find all from DB (based on search keyword )& return result - limit to pageSize specified above, skip depending on page number
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // Send product back - also send page number and how many pages
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
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

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private

const createProductReview = asyncHandler(async (req, res) => {
  // Get review entered by user from request
  const { rating, comment } = req.body;

  // Get product by ID from URL
  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if user has already reviewed product - compare user ID on review with logged in user - true if so
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    // If so, throw error
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You have already reviewed this product");
    }

    // Otherwise continue and create review object
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    // Add new review to product
    product.reviews.push(review);

    // Update no. reviews
    product.numReviews = product.reviews.length;

    // Calculate new avg rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added successfully" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  // Get top 3 rated products
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getTopProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};
