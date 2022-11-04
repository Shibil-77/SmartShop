const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    ProductId:{
        type:mongoose.Schema.Types.ObjectId,
        ref :'products'
    },
    quantity:{
        type:Number,
        //  .poluplate('products')
        required:true
    }
})
const cart = new Schema({
    Product:[productSchema],
    UserId:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('cart',cart)