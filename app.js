const express = require('express')
const app =express()
const ejs = require('ejs');
const mongoose = require("mongoose");
const path = require ('path')

const userRouter = require('./routes/user')
app.use('/user',userRouter)


// set the view engine to ejs

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// data base connecting

mongoose.connect("mongodb://localhost:27017/iworld")
  .then(data => {
    console.log("Database Connected")
  }).catch(err => console.log(err))

// server coccenting 

app.listen(3000)

