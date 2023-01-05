const app = require("./app"); // importing the app
const dotenv = require("dotenv"); // importing the dotenv package . It searches for the enviornment variable from a .env file
const connectDatabase = require("./config/database"); //calling the function which connects the database


//Handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`ErrorL: ${err.message}`);
    console.log(`Shutting down the server due to uncaught Exception`);
    process.exit(1);    
})

//config File
dotenv.config({path:"Backend/config/config.env"});

//connecting the database
connectDatabase()




// console.log(you); // uncaught error


//listening it on a port.
const server = app.listen(process.env.PORT,()=>{

    console.log(`Server is working on http://localhohst:${process.env.PORT}`)
})


//unhandled promise rejection if the URL is miss match or the connection of database is wrong
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to Unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);
    });
});