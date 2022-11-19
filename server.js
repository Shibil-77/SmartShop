const mongoose = require("mongoose");
module.exports = {
 database : ()=>{
    const connectionParams = {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }  
    try{
        mongoose.connect("mongodb+srv://Shibil:3SCSNGMjlr4GOIxG@cluster0.fxwwlws.mongodb.net/smartshop?retryWrites=true&w=majority").then((data)=>{
            connectionParams,
            console.log("Databse connected");
        }).catch((error)=>{
            throw new Error('Error')
        })
        
    }catch(err){
        console.log("Database Failedeeee");
    }
}
}
// mongodb+srv://Shibil:3SCSNGMjlr4GOIxG@cluster0.fxwwlws.mongodb.net/?retryWrites=true&w=majority
//password 3SCSNGMjlr4GOIxG

