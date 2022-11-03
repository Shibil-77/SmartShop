const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Admin = new Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Admin:{
        type:Boolean,
        required:true
    }
})

module.exports = mongoose.model('Admin',Admin)