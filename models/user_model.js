const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "A user must have a address"],
      trim: true,
    },
    contactNumber: {
      type: Number,
      required: [true, "A user must have a contact number"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    cardType: {
      type: String,
      enum: ["Student", "Senior", "Standard"],
    },
  },
  { timestamps: true }
);

// userSchema.pre("save", async function (next) {
//   // Ony run when password is modified
//   if (!this.isModified("password")) return next();
//   //hash password with the cost of 12
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// userSchema.methods.comparePassword = async function (
//   enteredPassword,
//   userPassword
// ) {
//   return await bcrypt.compare(enteredPassword, userPassword);
// };

module.exports = mongoose.model("User", userSchema);
