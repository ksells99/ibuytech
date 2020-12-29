import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc    Login user & get token
// @route   POST /api/users/login
// @access  Public

const authUser = asyncHandler(async (req, res) => {
  // Get email/PW from request
  const { email, password } = req.body;

  // Find user in DB based on email
  const user = await User.findOne({ email });

  //   If there is a user & the password matches (calls function in route)
  if (user && (await user.matchPassword(password))) {
    //   Send user data
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      //   Call generateToken function imported above to get JWT, pass in user ID
      token: generateToken(user._id),
    });

    // Otherwise send credentials error
  } else {
    res.status(401);
    throw new Error(
      "Invalid email address and password combination. Please try again."
    );
  }
});

// @desc    Register new user
// @route   POST /api/users
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  // Get name/email/PW from request
  const { name, email, password } = req.body;

  // Check if email address already in use
  const userExists = await User.findOne({ email });

  // If it is, throw error
  if (userExists) {
    res.status(400);
    throw new Error("Email address is already in use");
  }

  // If not, proceed and create new user in DB
  const user = await User.create({
    name,
    email,
    password,
    // Add blank shipping address
    shippingAddress: {
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  // If user is created successfully, send user data in response (used to auto login)
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      //   Call generateToken function imported above to get JWT, pass in user ID
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User creation error");
  }
});

// @desc    Get user's profile
// @route   GET /api/users/profile
// @access  Private

const getUserProfile = asyncHandler(async (req, res) => {
  // Find user by ID
  const user = await User.findById(req.user._id);

  //   If user exists, send user data
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      shippingAddress: user.shippingAddress,
    });

    //   Else send error
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user's profile
// @route   PUT /api/users/profile
// @access  Private

const updateUserProfile = asyncHandler(async (req, res) => {
  // Find user by ID
  const user = await User.findById(req.user._id);

  //   If user exists, send user data
  if (user) {
    // If new details submitted, update, if not keep as is
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    // Save user in DB
    const updatedUser = await user.save();

    //   Send new user data & generate new token
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      //   Call generateToken function imported above to get JWT, pass in updatedUser ID
      token: generateToken(updatedUser._id),
    });

    //   Else send error
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user's saved shipping address
// @route   PUT /api/users/shipping
// @access  Private

const updateUserShippingAddress = asyncHandler(async (req, res) => {
  // Find user by ID
  const user = await User.findById(req.user._id);

  //   If user exists, set new address
  if (user) {
    console.log(req.body);
    // If new details submitted, update, if not keep as is
    user.shippingAddress.address =
      req.body.address || user.shippingAddress.address;
    user.shippingAddress.city = req.body.city || user.shippingAddress.city;
    user.shippingAddress.postalCode =
      req.body.postalCode || user.shippingAddress.postalCode;
    user.shippingAddress.country =
      req.body.country || user.shippingAddress.country;

    // Save user in DB
    const updatedUser = await user.save();

    //   Send new user data & generate new token
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      shippingAddress: updatedUser.shippingAddress,
    });

    //   Else send error
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private (ADMIN)

const getUsers = asyncHandler(async (req, res) => {
  // Find all users
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (ADMIN)

const deleteUser = asyncHandler(async (req, res) => {
  // Find user based on ID from URL
  const user = await User.findById(req.params.id);

  if (user) {
    // Remove record from DB
    await user.remove();
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (ADMIN)

const getUserById = asyncHandler(async (req, res) => {
  // Find user based on URL ID (don't select password)
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (ADMIN)

const updateUser = asyncHandler(async (req, res) => {
  // Find user by ID
  const user = await User.findById(req.params.id);

  //   If user exists, send user data
  if (user) {
    // If new details submitted, update, if not keep as is
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    // Change isAdmin status - leave as is if not sent, otherwise update
    user.isAdmin =
      req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin;

    // Save user in DB
    const updatedUser = await user.save();

    //   Send new user data
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });

    //   Else send error
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  updateUserShippingAddress,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
