const mongoose = require('mongoose')
const Schema = mongoose.Schema

const product = new Schema({
    Name :{
        type:String,
        required:true
    },
    Price :{
        type:Number,
        required:true
    },
    Category :{
        type:String,
        required:true
    },
    Thumnail :{
        type:String,
        required:true 
    },
    Brand :{
        type:String,
        required:true
    },
    Discount :{
        type:Number,
        required:true
    },
    Stock :{
        type:String,
        required:true
    },
    moreImage :{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('product',product)