const ErrorHandler = require("../utils/errorhander");




module.exports = (err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Cast error ,  when given the invalid id params or putting a invalid synatax error
    // of mongoDB
    if(err.name === "CastError"){
        const message = `Resouce not Found. Invalid : ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Mongoose duplicate key error
    if(err.code === 11000 ){
        const message = `Duplicate ${Object.keyValue} Entered`
        err = new ErrorHandler(message, 400);
    }

    //Wrong Json Web token error
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid, try again`;
        err = new ErrorHandler(message, 400);
    }

    //Json web token expire error
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is Expired, try again`;
        err = new ErrorHandler(message, 400);
    }

    //TRY //  const errorStackMess = err.name === "CastError"? " ":err.stack;

    res.status(err.statusCode).json({
        success: false,
        message: err.message, // to veiw the ,message
        error: err.stack // to veiw the extact error location
    });
}