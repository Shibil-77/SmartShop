const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userId = new Schema({
    userId: {
        type: String,
    }})

const coupon = new Schema({
    couponName:{
        type:String,
        required:true
    },
    couponId:{
        type:String,
        unique: true,
        required:true
    },
    couponDiscount:{
        type:Number,
        required:true
    },
    couponExpiredDate:{
        type:Date,
        required:true
    },
    userData:{
        type:[userId]
    },
    Amount:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('coupon',coupon)