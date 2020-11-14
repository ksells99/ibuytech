import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // If there is a token included in user's request...
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get the token & decode it
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //   Find user in DB based on user ID from decoded JWT
      req.user = await User.findById(decoded.id).select("-password");
      next();

      //
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorised - token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorised - no token");
  }
});

export { protect };
