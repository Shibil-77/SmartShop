const mongoose = require("mongoose");
module.exports = {
 database : ()=>{
    const connectionParams = {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }  
    try{
        mongoose.connect("mongodb://localhost:27017/test")
        connectionParams,
        console.log("Databse connected");   
    }catch(err){
        console.log("Database Failed");
    }
}
}

// mongodb+srv://Shibil:3SCSNGMjlr4GOIxG@cluster0.fxwwlws.mongodb.net/?retryWrites=true&w=majority
//password 3SCSNGMjlr4GOIxG

