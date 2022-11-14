// const mongoose = require('mongoose')
// const Schema = mongoose.Schema
// const order = new Schema({
//     userId:{
//         type:String,
//         required:true
//     },
//     paymentMethod:{
//         type:String,
//         required:true
//     },
//     payementAmount:{
//         type:Number,
//         required:true
//     },
//     orderStatus:{
//         type:String,
//         required:true
//     },
//     orderDate:{
//         type:String,
//         required:true
//     },
//     addressId:{
//         type:String,
//         required:true
//     },
//     cart:{
//         type:Array,
//         required:true
//     }
// })

// module.exports = mongoose.model('order',order)


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



