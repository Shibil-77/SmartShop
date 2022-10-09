const express = require('express')
const app =express()
const ejs = require('ejs');
const mongoose = require("mongoose");
const path = require ('path')
const bodyParser =require('body-parser')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/',userRouter)
app.use('/admin',adminRouter)

// set the view engine to ejs

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

// data base connecting
//password 3SCSNGMjlr4GOIxG

database=()=>{
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
database();

// server coccenting 

app.listen(3000)

