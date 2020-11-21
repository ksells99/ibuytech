import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

connectDB();

const app = express();

// Allows us to accept JSON data in API request body
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Link API calls to respective routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Paypal client ID route
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

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
