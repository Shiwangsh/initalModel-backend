const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A staff memeber must have a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      minlength: 8,
      select: false,
    },
    address: {
      type: String,
      required: [true, "A staff memeber must have a address"],
      trim: true,
    },
    contactNumber: {
      type: Number,
      required: [true, "A staff memeber must have a contact number"],
      unique: true,
    },
    staffType: {
      type: String,
      enum: ["Admin", "Level1", "Level2"],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

staffSchema.pre("save", async function (next) {
  // Ony run when password is modified
  if (!this.isModified("password")) return next();
  //hash password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

staffSchema.methods.comparePassword = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

module.exports = mongoose.model("Staff", staffSchema);
