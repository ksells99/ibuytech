import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import connectDB from "./config/db.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Allows us to accept JSON data in API request body
app.use(express.json());

// Link API calls to respective routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

// Paypal client ID route
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// Make uploads folder static - get current path
const __dirname = path.resolve();
// Then make it static - use current path (__dirname), then go to /uploads
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  // Make front end build folder static
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  // If not accessing API routes, point to index.html
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Pick up port from env file - if not, use 5000
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server on port ${PORT} - ${process.env.NODE_ENV} mode`.yellow.bold
  )
);
