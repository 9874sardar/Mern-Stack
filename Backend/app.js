const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middleware/error");

app.use(express.json()) 
app.use(cookieParser());
//The app.use() function is used to mount the specified middleware function(s) 
//at the path which is being specified.

//routes imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute")

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);

//Middleware for error control
app.use(errorMiddleware);

module.exports = app