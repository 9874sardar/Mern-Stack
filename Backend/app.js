const express = require("express");
const app = express();

const errorMiddleware = require("./middleware/error");

app.use(express.json()) 
//The app.use() function is used to mount the specified middleware function(s) 
//at the path which is being specified.

//routes imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");

app.use("/api/v1",productRoute);
app.use("/api/v1",userRoute);

//Middleware for error control
app.use(errorMiddleware);

module.exports = app