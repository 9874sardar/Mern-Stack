const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const { validate } = require("../models/userModel");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

//Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      //temporary as we will get the data later in cloud
      public_id: "this is a sample id",
      url: "profilePicUrl",
    },
  });

  //CREATED A UTIL TOKEN FOR THIS
  //   const token = user.getJWTToken();

  //   res.status(201).json({
  //     success: true,
  //     token,
  //   });

  sendToken(user, 201, res);
});

//Login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  //searching the user in the database
  //findone is used to search the single enitity in the database
  const user = await User.findOne({ email }).select("+password"); //we need to add the password field here like this because we have given the select field in password as false.

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401)); //401 = aunauthoried
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401)); //401 = unauthorized
  }

  //CREATED A UTIL FUNCTION FOR THIS
  //   const token = user.getJWTToken();

  //   res.status(200).json({
  //     success: true,
  //     token,
  //   });

  sendToken(user, 200, res);
});

//Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

//Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  //get resetpassword token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetpasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetpasswordUrl} \n\n If you have not requested this email then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
});

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //Creating token hask
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset password token is invalid or has been expired",
        400
      )
    );
    //400 bad request
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password doesnt match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//tO GET THE DETAILS OF THE USER
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//Update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldpassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Old password is Incorrect", 401)); //401 = unauthorized
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("Password doesnt match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

//Update user PROFILE
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // we will add cloudinary later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//Get all users ---- admin
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//Get single users details ---- admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with id : ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//Update user ROLE -- admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//Delete user PROFILE -- admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHander(`USer does not exist with id : ${req.params.id}`));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message:"User deleted Successfully"
  });
});