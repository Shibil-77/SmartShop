const products = require('../models/schema/product-schema')
const users = require('../models/schema/user-schema')
const category = require('../models/schema/category')
const banner = require('../models/schema/banner-schema')
const Admin = require('../models/schema/admin')
const order = require('../models/schema/orders')
const mongoose = require('mongoose')
const address = require('../models/schema/address')
const coupon = require("../models/schema/coupon")



module.exports = {
    sales:async()=>{
        const data = await order.aggregate([

            {
                $project: {
                    orders: 1
                }
            },
            {
                $unwind: "$orders"
            },
            {
                $group: {
                    _id: {
                        date: "$orders.orderDate",
                    },
                    totalPrice: {
                        $sum: "$orders.paymentAmount"
                    },
                    count: { $sum: 1 },
                }
            },
            {
                $sort: {
                    "_id.date": -1
                }
            },
        ]).limit(7)
     return data
    },

    orderPaymentMethodOnline:async()=>{
         const PaymentMethod = await order.aggregate([

            {
                $project: {
                    orders: 1
                }
            },
            {
                $unwind: "$orders"
            },
            {
                $match: {
                    "orders.paymentMethod": 'online payment'
                }
            },
            {
                $group: {
                    _id: {
                        payment: "$orders.paymentMethod"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id.orderDate": -1
                }
            }
        ]).limit(7)
        const paymentCountOnline = PaymentMethod.map((data)=>data.count)
        return paymentCountOnline
    },

    orderPaymentMethodCod:async()=>{
        const PaymentMethod = await order.aggregate([

           {
               $project: {
                   orders: 1
               }
           },
           {
               $unwind: "$orders"
           },
           {
               $match: {
                   "orders.paymentMethod": 'cash'
               }
           },
           {
               $group: {
                   _id: {
                       payment: "$orders.paymentMethod"
                   },
                   count: { $sum: 1 }
               }
           }
       ])
       const paymentCountCod =await PaymentMethod.map((data)=>data.count)
       return paymentCountCod
   }
   
}