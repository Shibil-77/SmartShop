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
        
    },
    addressId: {
        type: String,
        
    },
    paymentAmount: {
        type: Number,
        
    },
    paymentMethod:{
        type:String,
    },
    orderStatus:{
        type:String,
    },
    offerData:{
        type:String,
    },
    cart:{
        type:Array,
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



