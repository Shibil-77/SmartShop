
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const orderDetailes = new Schema({
    orderDate: {
        type: String,
        required:true
    },
    addressId: {
        type: String,
        required:true
    },
    paymentAmount: {
        type: Number,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    orderStatus:{
        type:String,
        required:true
    },
    offerData:{
        type:String,
    },
    cart:{
        type:Array,
        required:true
    }
})

const order= new Schema({
    userId:{
        type:String,
        require:true
    },
    orders: [orderDetailes]
})
module.exports = mongoose.model('order',order)



