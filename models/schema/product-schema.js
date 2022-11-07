const mongoose = require('mongoose')
const { array } = require('../../Middlewares/multer')
const Schema = mongoose.Schema

const products = new Schema({
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
        type:Array,
        required:true
    },
    Discription :{
        type:String,
        required:true 
    },
    Delete:{
        type:Boolean,
        required:true 
    }
})

module.exports = mongoose.model('products',products)