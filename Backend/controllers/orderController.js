const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncError");

//Creating a new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  })
});

//Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req,res,next)=>{

  const order = await Order.findById(req.params.id).populate("user","name email");
  //here we will take the user ID from the order and from that in user DB we will get the name and user 
  //email to do the remaining.
  
  if(!order){ 
    return next(new ErrorHander("Order not found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  })
});

//Get logged in user Order
exports.myOrder = catchAsyncErrors(async (req,res,next)=>{

  const orders = await Order.find({user : req.user._id});

  res.status(200).json({
    success: true,
    orders,
  })
});

//Get All Order --admin
exports.getAllOrder = catchAsyncErrors(async (req,res,next)=>{

  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach(order=>{
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  })
});

//Update Order status --admin
exports.updateOrder = catchAsyncErrors(async (req,res,next)=>{

  const order = await Order.find(req.params.id);

  if(!order){
    return next (new ErrorHander("Order not found with this ID",404));
  }

  if(order.orderStatus === "Delivered"){
    return next (new ErrorHander("We have already delivered this order",400));
  }

  order.orderItems.forEach( async(order)=>{
    await updateStock(order.product,order.quantity);
  });

  order.orderStatus = req.body.status;

  if(req.body.status === "Delivered"){
    order.deliveredAt = Date.now();
  }

  await order.save({validateBeforeSave : false});
  res.status(200).json({
    success: true,
  });
});

async function updateStock (id,quantity){
  const product = await Product.findById(id);

  product.stock -= quantity;
  await order.save({validateBeforeSave : false});

}

//Delete Order --admin
exports.deleteOrder = catchAsyncErrors(async (req,res,next)=>{

  const order = await Order.findById(req.params.id);

  if(!order){
    return next (new ErrorHander("Order not found with this ID",404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});