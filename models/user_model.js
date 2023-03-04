// Require the necessary modules
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

// Create a new Mongoose schema instance with the desired fields
const userSchema = new Schema(
  {
    fname: {
      type: String,
      required: [true, "Please Enter your First Name"],
    },
    lname: {
      type: String,
      required: [true, "Please Enter your Last Name"],
    },
    email: {
      type: String,
      required: [true, "Please Enter your First Name"],
      validate: [validator.isEmail, "Please enter a valid email"],
      unique: [true, "This email is already registered"],
    },
    password: {
      type: String,
      required: [true, "Please Enter your Password"],
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true, // Add timestamp fields to the schema
  }
);

// HASH THE PASSWORD USING BCRYPTJS
userSchema.pre("save", async function (next) {
  try {
    const saltRounds = await bcrypt.genSalt(10); // Generate a salt with 10 rounds

    const hashed = await bcrypt.hash(this.password, saltRounds); // Hash the password using the generated salt

    this.password = hashed; // Set the password field to the hashed value

    next();
  } catch (error) {
    // if any error
    next(error);
  }
});

// Compare the entered password with the user's stored password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Use bcryptjs to compare the entered password with the stored password
};

// Create a new Mongoose model with the schema and export it
const User = mongoose.model("User", userSchema);

module.exports = User;
