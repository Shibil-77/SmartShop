const mongoose = require("mongoose");
module.exports = {
 database : ()=>{
    const connectionParams = {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }  
    try{
        mongoose.connect("mongodb+srv://Shibil:3SCSNGMjlr4GOIxG@cluster0.fxwwlws.mongodb.net/?retryWrites=true&w=majority")
        connectionParams,
        console.log("Databse connected");   
    }catch(err){
        console.log("Database Failed");
    }
}
}
//password 3SCSNGMjlr4GOIxG