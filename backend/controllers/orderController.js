import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Check to make sure order contains items
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");

    // If it does, create new order in DB, pass in data along with user ID
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private

const getOrderById = asyncHandler(async (req, res) => {
  // Get order from DB - also get name and email from user model
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order status to paid
// @route   PUT /api/orders/:id/pay
// @access  Private

const updateOrderToPaid = asyncHandler(async (req, res) => {
  // Get order from DB
  const order = await Order.findById(req.params.id);

  // If order found...
  if (order) {
    // Update payment status
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      // Data obtained from paypal API
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    // Save order & send new data
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order status to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private (ADMIN)

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  // Get order from DB
  const order = await Order.findById(req.params.id);

  // If order found...
  if (order) {
    // Update delivery status
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    // Save order & send new data
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get orders for logged in user
// @route   GET /api/orders/myorders
// @access  Private

const getMyOrders = asyncHandler(async (req, res) => {
  // Get orders from DB - find based on user ID
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (ADMIN)

const getAllOrders = asyncHandler(async (req, res) => {
  // Get all orders from DB - populate with ID/name from user model
  const orders = await Order.find().populate("user", "id name");
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders,
};
