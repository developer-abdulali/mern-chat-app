// import crypto from "crypto";
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required!"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required!"],
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required!"],
//     },
//     profile_pic: {
//       type: String,
//       default: "",
//     },
//     resetPasswordToken: String,
//     resetPasswordExpire: Date,
//   },
//   {
//     timestamps: true,
//   }
// );

// userSchema.methods.getResetPasswordToken = function () {
//   const resetToken = crypto.randomBytes(20).toString("hex");

//   // Hash the token and set it to the resetPasswordToken field
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   // Set expiration time (e.g., 5 minutes)
//   this.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

//   return resetToken;
// };

// const UserModel = mongoose.model("User", userSchema);

// export default UserModel;

import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    profile_pic: {
      type: String,
      default: "https://via.placeholder.com/150", // Default image URL
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the token and set it to the resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expiration time (configurable)
  this.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

  return resetToken;
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
