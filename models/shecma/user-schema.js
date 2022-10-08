const mongoose = require('mongoose')

const Schema = mongoose.Schema
const users = new Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true 
    },
    Age:{
        type:Number,
        required:true  
    },
    Phone:{
        type:Number,
        required:true    
    },
    Password:{
        type:String,
        required:true  
    }
   
   
   
})
module.exports =mongoose.model('users',users)