const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
  resetPasswordToken:String,
  resetPasswordExpire:Date,
});

//To encrypt the password before showing it to the admin panel in database
userSchema.pre("save",async function(next){

    if(!this.iseModified("password")){ 
        // if the password was reset before and modidfied then this function will not rehash things again 
         // it will check if its modified then move to next function   
        next();
    }

    this.password = await bcrypt.hash(this.password,10);
})

module.exports = mongoose.model("User",userSchema);