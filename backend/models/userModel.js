import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    shippingAddress: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// Compare encrypted password on login
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Compare password entered with the correct hashed password of the user
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to encrypt new user password before saving to DB
userSchema.pre("save", async function (next) {
  // Don't run if password isn't modified
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);

  // Get password and encrypt with salt
  this.password = await bcrypt.hash(this.password, salt);
});

// Create model and pass in above schema
const User = mongoose.model("User", userSchema);

export default User;
