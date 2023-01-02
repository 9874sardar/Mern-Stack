const express = require("express");
const app = express();

app.use(express.json()) 
//The app.use() function is used to mount the specified middleware function(s) 
//at the path which is being specified.

//routes imports
const product = require("./routes/productRoute");

app.use("/api/vi",product);

module.exports = app