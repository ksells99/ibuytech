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

export { authUser, registerUser, getUserProfile, updateUserProfile };
