const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/userModel");

//Register a user
exports.registerUser = catchAsyncErrors (async (req,res,next)=>{

    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            //temporary as we will get the data later in cloud
            public_id:"this is a sample id",
            url:"profilePicUrl",
        }
    });

    res.status(201).json({
        success: true,
        user
    });
})