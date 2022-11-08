const mongoose = require('mongoose')
const Schema = mongoose.Schema

const address = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true 
    },
    email:{
        type:String,
        required:true 
    },
    countryName:{
        type:String,
        required:true 
    },
    state:{
        type:String,
        required:true 
    },
    arrresLine:{
        type:String,
        required:true 
    },
    address:{
        type:String,
        required:true 
    },
    postCode:{
        type:String,
        required:true 
    },
    UserId:{
        type:String,
        required:true 
    },
    phoneNumber:{
        type:Number,
        required:true 
    }
})

module.exports = mongoose.model('address',address)