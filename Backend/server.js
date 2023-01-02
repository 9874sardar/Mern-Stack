const app = require("./app"); // importing the app
const dotenv = require("dotenv"); // importing the dotenv package . It searches for the enviornment variable from a .env file

//config File
dotenv.config({path:"Backend/config/config.env"});

//listening it on a port.
app.listen(process.env.PORT,()=>{

    console.log(`Server is working on http://localhohst:${process.env.PORT}`)
})
