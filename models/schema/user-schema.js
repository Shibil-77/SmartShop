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
    Phone:{
        type:Number,
        required:true    
    },
    Password:{
        type:String,
        required:true  
    },
    Date:{
        type:String,
        required:true
    },
    Action:{
        type:Boolean,
        required:true
    }
   
})
module.exports =mongoose.model('users',users)