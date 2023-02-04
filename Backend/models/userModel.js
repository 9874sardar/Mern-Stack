const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should be more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email ID"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your email ID"],
    // maxLength:[30,"Name cannot exceed 30 characters"],
    minLength: [8, "Password should be more than 8 characters"],
    Select: false, // it means whenever we will call the object , the select will only send the password , and it will filterout rest unwanted data
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//To encrypt the password before showing it to the admin panel in database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // if the password was reset before and modidfied then this function will not rehash things again
    // it will check if its modified then move to next function
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

//We will generate a token and store it in cookie to understand that user has registered and now user can get logged in into the app
// to do this we are creating
//JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//compare Password
userSchema.methods.comparePassword = async function (password) {
  //we have the passwords as hashed out . SO we will use the bcrypt to compare weather the password is matching or not.
  //Their is a inbuilt function present in bcrypt as Compare to comapre the two password
  return await bcrypt.compare(password, this.password);
};

//Generating password to reset token
userSchema.methods.getResetPasswordToken = function () {
  //Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing ad add to resetPAsswordToken to userSchema
  //we will use a algorithm named "sha256"
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 *1000;

  return resetToken;

};

module.exports = mongoose.model("User", userSchema);
