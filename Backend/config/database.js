const mongoose = require("mongoose"); //importing the mongoDB

//function of calling a connection of database
const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      // Hosting it in cloud or online
      //   .connect("mongo://localhost:27017/Ecommerce", { // Hosting it in LocalHost
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((data) => {
      console.log(
        `Mongodb connected with the server data ${data.connection.host}`
      );
    })
    //we dont need the catch here as because we are handling the catch or unhandled promise rejection in server.js file
    // .catch((err) => {
    //   console.log("Error", err);
    // });
};

module.exports = connectDatabase