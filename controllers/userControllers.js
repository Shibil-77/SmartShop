
const users = require('../models/schema/user-schema')
const products = require('../models/schema/product-schema')
const banner = require('../models/schema/banner-schema')
const cart = require('../models/schema/cart')
const categorys = require('../models/schema/category')
const wishList = require('../models/schema/wishList_schema')
const address = require('../models/schema/address')
const order = require('../models/schema/orders')
const Razorpay = require('razorpay')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const twilioDatas = require('../twilio/twilio')
const RazorpayData = require('../Razorpay/razorpay')
const dataCheck = require('../Middlewares/data-checking')

let accountSid = twilioDatas.accountSid
let authToken = twilioDatas.authToken
let verifySid = twilioDatas.verifySid
const key_id = RazorpayData.key_id
const key_secret = RazorpayData.key_secret
const client = require('twilio')(accountSid, authToken);
const instance = new Razorpay({
    key_id: key_id,
    key_secret: key_secret
})
let orderId
let userError = null
module.exports = {

    home: async (req, res) => {
        try {
            const banner_Data = await banner.find()
            const product = await products.find({ Delete: false })
            const UserId = req.session.UserId 
            if(banner_Data&&product){
              res.render('user/home', { product, banner_Data, UserId })
            }else{
               res.redirect('/404')
            } 
        } catch (error) {
            res.redirect('/404')
        }
    },
    orderSuccess:(req,res)=>{
        res.render("user/orderSuccess")
     },

    login: (req, res) => {
        res.render('user/loginPage')
    },

    signup: (req, res) => {
        res.render('user/register')
    },

    error: (req, res) => {
        res.render('user/error')
    },

    forgotPassword: (req, res) => {
        res.render('user/forgot-password')
    },

    Profile: async (req, res) => {
        let UserId = req.session.UserId
        let profile = await users.findOne({ _id: UserId })
        res.render('user/profile', { profile, UserId })
    },

    editProfile: async (req, res) => {
        const UserId = req.session.UserId
        const profileId = req.params.id
        const Profile = await users.findOne({ _id: profileId })
        res.render('user/editProfile', { Profile, UserId })
    },

    postProfile: async (req, res) => {
        try {
            ProfileId = req.params.id
            console.log(ProfileId);
            await users.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(ProfileId) },
                {
                    $set: {
                        Name: req.body.Name,
                        Email: req.body.Email,
                        Phone: req.body.Phone
                    }
                })
            res.redirect('/profile')
        }
        catch (e) {
            console.log("e",)
        }
    },

    shopsingle: async (req, res) => {
        let product = await products.findOne({ _id: req.params.id })
        let UserId = req.session.UserId
        res.render('user/shopsingle', { product, UserId })
    },

    otp: (req, res) => {
        res.render('user/otp')
    },
    // <- ====================================================== post method ====================================== ->
    //   <========== dosignup ========>

    doSignup: async (req, res) => {
        let user = req.body
        let Password = user.Password
        let confirmPassword = user.confirmPassword
        if (Password === confirmPassword) {
            let UserData = await users.findOne({ Email: user.Email })
            if (!UserData) {
                req.session.userData = user
                // Download the helper library from https://www.twilio.com/docs/node/install
                // Find your Account SID and Auth Token at twilio.com/console
                // and set the environment variables. See http://twil.io/secure
                // const client = require('twilio')(accountSid, authToken);

                client.verify.v2.services(verifySid)
                    .verifications
                    .create({ to: '+91' + user.Phone, channel: 'sms' })
                    .then(verification => console.log(verification.status));


                res.json({ status: true })

            } else {
                res.json({ emailExist: true })
                console.log("user Exist");
            }
        } else {
            res.json({ confirmpasswordError: true })
            console.log("confirmPassword");
        }
    },
    //    <- ========dologin======== ->

    dologin: async (req, res) => {
        let User = await users.findOne({ Email: req.body.Email })
        if (User.Action) {
            if (User.Email === req.body.Email) {
                bcrypt.compare(req.body.Password, User.Password).then((data) => {
                    if (data) {
                        req.session.UserId = User.id
                        req.session.userloggedIn = true
                        res.json({ status: true })
                    } else {
                        res.json({ passworError: true })
                    }
                })
            } else {
                res.json({ emailError: true })
            }
        } else {
            res.json({ accessError: true })
        }
    },

    //    <- ======== edit profile======== ->

    postotp: (req, res) => {
        client.verify.v2.services(verifySid)
            .verificationChecks
            .create({ to: '+91' + req.session.userData.Phone, code: req.body.otp })
            .then(async (verification_check) => {

                if (verification_check.status == "approved") {
                    let UserData = req.session.userData
                    let bcryptpassword = await bcrypt.hash(UserData.Password, 10)
                    let today = new Date();
                    let dd = String(today.getDate()).padStart(2, '0');
                    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    let yyyy = today.getFullYear();
                    today = mm + '/' + dd + '/' + yyyy;

                    const userData = new users({
                        Name: UserData.Name,
                        Email: UserData.Email,
                        Phone: UserData.Phone,
                        Password: bcryptpassword,
                        Date: today,
                        Action: true
                    })
                  await userData.save()
                        .then(data => {
                            req.session.UserId = data.id
                            req.session.userData = null
                            req.session.userloggedIn = true
                            res.redirect('/')
                        })
                } else {
                    req.session.userData = null
                    console.log("OTP ERROR");
                }
            });
    },

    cart: async (req, res) => {
        if (req.session.userloggedIn) {
            const productId = req.params.id
            const product = await products.findOne({ _id: productId })
            const totalAmount = product.Price
            const userId = req.session.UserId
            const cartData = await cart.findOne({ UserId: userId })
            if (cartData) {
                let productIndex = cartData.Product.findIndex(p => p.ProductId == productId)
                if (productIndex >= 0) {
                    cartData.Product[productIndex].quantity = Number(cartData.Product[productIndex].quantity) + 1
                    await cartData.save()
                    res.json({ status: true })
                } else {
                    cartData.Product.push({ ProductId: mongoose.Types.ObjectId(productId), quantity: 1 })
                    await cartData.save()
                    res.json({ status: true })
                }
            } else {
                cart.create({
                    UserId: mongoose.Types.ObjectId(userId),
                    totalBill: totalAmount,
                    Product: [{
                        ProductId: mongoose.Types.ObjectId(productId),
                        quantity: 1
                    }]
                }).then((data) => {
                    res.json({ status: true })
                })
            }
        } else {
            res.json({ notUser: true })
        }
    }
    ,
    cartList: async (req, res) => {
        const UserId = req.session.UserId
        const data = await cart.findOne({ UserId }).populate('Product.ProductId').exec()
        if (data) {
            const dataLength = data.Product.length
            console.log(dataLength);
            const cartData = data.Product.map((data) => {
                let array = {}
                array.quantity = data.quantity
                array.ProductId = data.ProductId
                array.totalAmount = data.ProductId.Price * data.quantity
                array.arrayId = data.id
                return array
            })
            let totalBill = cartData.reduce((total, value) => total + value.totalAmount, 0)
            cartData.totalBill = totalBill
            res.render('user/cart', { UserId, cartData, data,dataLength })
        } else {
            res.redirect('/')
        }
    },

    shop: async (req, res) => {
        let UserId = req.session.UserId
        let category = await categorys.find()
        if (req.session.categoryData) {
            let product = req.session.categoryData
            req.session.categoryData = null
            res.render('user/shop-grid', { UserId, category, product })
        } else {
            let product = await products.find({ Delete: false })
            res.render('user/shop-grid', { UserId, product, category })
            req.session.categoryData = null
        }
    },

    categoryfilter: async (req, res) => {
        req.session.categoryData = null
        let categoryData = await products.find({ $and: [{ Delete: false }, { Category: req.params.data }] })
        req.session.categoryData = categoryData
        res.redirect('/shop')
    },

    wishList: async (req, res) => {
        try {
            if (req.session.userloggedIn) {
                const _id = req.params.id
                const product = await products.findOne({ _id: _id })
                const userId = req.session.UserId
                const wishListData = await wishList.findOne({ UserId: userId })
                if (wishListData) {
                    let productIndex = wishListData.Product.findIndex(p => p.ProductId == _id)
                    // let productIndex = wishList.Product.findIndex({ProductId :{ $eq :productId}})
                    if (productIndex >= 0) {
                        res.json({ wishList: true })
                    } else {
                        wishListData.Product.push({ ProductId: mongoose.Types.ObjectId(_id) })
                        await wishListData.save()
                        res.json({ status: true })
                    }
                } else {
                    await wishList.create({
                        UserId: mongoose.Types.ObjectId(userId),
                        Product: [{
                            ProductId: mongoose.Types.ObjectId(_id),
                        }]
                    }).then((data) => {
                        res.json({ status: true })
                    })
                }
            } else {
                res.json({ notUser: true })
            }
        } catch (error) {
            res.redirect('/admin/error')
        }
    },


    Cartquantity: async (req, res) => {
        try {
            const _id = req.params.id
            const UserId = req.session.UserId
            const cartData = await cart.findOne({ UserId })
            if (cartData) {
                let productIndex = cartData.Product.findIndex(p => p.ProductId == _id)
                cartData.Product[productIndex].quantity += 1
                cartData.save().then((data) => {
                    res.json({ status: true })
                })
            } else {
                res.redirect('/admin/error')
            }
        } catch (error) {
            res.redirect('/admin/error')
        }
    },

    lessCartquantity: async (req, res) => {
        try {
            const _id = req.params.id
            const userId = req.session.UserId
            let cartData = await cart.findOne({ UserId: userId })
            let productIndex = cartData.Product.findIndex(p => p.ProductId == _id)
            cartData.Product[productIndex].quantity -= 1
            if (cartData.Product[productIndex].quantity > 0) {
                cartData.save().then((data) => {
                    res.json({ status: true })
                })
            } else {
                res.json({ error: true })
            }
        } catch (error) {
            res.redirect('/admin/error')
        }
    },

    deletecart: async (req, res) => {
        try {
            const ProductId = req.params.id
            const UserId = req.session.UserId
            const data = await cart.updateOne({ UserId }, { $pull: { Product: { _id: mongoose.Types.ObjectId(ProductId) } } })
            if (data) {
                res.redirect('/cartList')
            } else {
                res.redirect('/admin/error')
            }
        } catch (error) {
            res.redirect('/admin/error')
        }
    },

    checkoutpage: async(req, res) => {
        let totalBill = req.body.totalBill
        const UserId = req.session.UserId
        const addressData = await address.find({UserId}).limit(3);
        res.render('user/checkout', { UserId, totalBill ,addressData})
    },

    postcheckout: async (req, res) => {
        try {
            const UserId = req.session.UserId
            if (req.body) {
                const data = req.body
                let addressId 
                if(data.Address){
                    addressId = data.Address
                }else{
                const addressData = new address({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    countryName: data.countryName,
                    state: data.state,
                    arrresLine: data.addresLine,
                    address: data.address,
                    postCode: data.postCode,
                    UserId: UserId,
                    phoneNumber: data.number
                })
                await addressData.save()
                 addressId = addressData.id
            }
                let today = new Date();
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                let yyyy = today.getFullYear();
                today = mm + '/' + dd + '/' + yyyy;
                const cartData = await cart.findOne({UserId}).populate('Product.ProductId').exec()
                const cartDatas = cartData.Product.map((data) => {
                    let array = {}
                    array.quantity = data.quantity
                    array.ProductId = data.ProductId
                    array.totalAmount = data.ProductId.Price * data.quantity
                    array.Name = data.ProductId.Name
                    array.moreImage = data.ProductId.moreImage
                    array.Category = data.ProductId.Category
                    array.Brand = data.ProductId.Brand
                    return array
                })
                console.log('cartDatas ',cartDatas)
                // cartDataquantity = cartData
                const orderdata = {
                    paymentMethod: "cash",
                    paymentAmount: data.totalBill,
                    orderStatus: "pending",
                    orderDate: today,
                    addressId: addressId,
                    cart: cartDatas
                }
            
                const orderData = await order.findOne({ userId: UserId })
                if (orderData) {
                    orderData.orders.push(orderdata)
                    await orderData.save()
                      let index = orderData.orders.length
                        orderId = orderData.orders[index-1].id
                } else {
                    order.create({
                        userId: mongoose.Types.ObjectId(UserId),
                        orders: [orderdata]
                    }).then((data) => {
                        let index = data.orders.length
                        orderId = data.orders[index-1].id
                    })
                }
                if (req.body.cash == 'cash') {
                     await cart.deleteOne({UserId})
                      res.json({paymentSuccess:true})
                } else {
                    console.log('orderId', orderId);
                    const totalBill = data.totalBill
                    let options = {
                        amount: totalBill*100,  // amount in the smallest currency unit
                        currency: "INR",
                        receipt: "" + orderId
                    };
                    instance.orders.create(options, function (err, order) {
                        console.log(order);
                        console.log("error",err);
                        res.json(order)
                    });
                }
            } else {
                res.redirect('/404')
            }
        } catch (error) {
            res.redirect('/404')
        }
    },

    wishListPage: async (req, res) => {
        if (req.session.userloggedIn) {
            const UserId = req.session.UserId
            const wishlistData = await wishList.findOne({ UserId }).populate('Product.ProductId').exec()
            if (wishlistData) {
                const wishData = wishlistData.Product.map((data) => {
                    let array = {}
                    array.ProductId = data.ProductId
                    array.arrayId = data.id
                    return array
                })
                res.render('user/wishlist', { UserId, wishData })
            } else {
                res.redirect('/')
            }
        } else {
            res.redirect('/login')
        }
    },


    deletewishlist: async (req, res) => {
        try {
            const ProductId = req.params.id
            const UserId = req.session.UserId
            const data = await wishList.updateOne({ UserId }, { $pull: { Product: { _id: mongoose.Types.ObjectId(ProductId) } } })
            if (data) {
                res.redirect('/wishListPage')
            } else {
                res.redirect('/404')
            }
        } catch (error) {
            res.redirect('/404')
        }
    },

    verifyPayment: async(req, res) => {
        const UserId = req.session.UserId
        const crypto = require('crypto')
        let hmac = crypto.createHmac('sha256','ktvJfYCp7BxR2pAydfHF1Y79')
        hmac.update(req.body.payment.razorpay_order_id+'|'+req.body.payment.razorpay_payment_id)
        hmac = hmac.digest('hex')
        if(hmac==req.body.payment.razorpay_signature){
            let userOrder = await order.findOne({ UserId: UserId })
               if(userOrder){  
                let orderIndex = userOrder.orders.findIndex(p => p._id == orderId)
                if (orderIndex >= 0) {
                     let changeStatus = userOrder.orders[orderIndex]
                     changeStatus.orderStatus = "Placed"
                     changeStatus.paymentMethod = "online payment"
                     userOrder.orders[orderIndex] = changeStatus
                     await userOrder.save()
                     await cart.deleteOne({UserId})
                     res.json({status:true})
                }
               }else{
                  
               }
        }else{
            res.redirect('/checkoutPage')
        }
    },

    orderlist:async(req,res)=>{
      const UserId = req.session.UserId
            try {
                const data = await order.findOne({ UserId }).populate('orders.cart').exec()
                if(data){
                    const orderData = data.orders
                    if(orderData){
                        const orderDatas = orderData.filter((data)=>data.cart)
                        res.render('user/order-list',{UserId,orderDatas})
                    }else{
                        res.redirect('/404')
                    }
                }else{
                    res.redirect('/404')
                }     
            } catch (error) {
                res.redirect('/404') 
            }
    },
    orderdetail:async(req,res)=>{
    const UserId = req.session.UserId
    try {
        console.log('req.params.id',req.params.id);
        const data = await order.findOne({ UserId }).populate('orders.cart').exec()
        if(data){
            const  orderData  =data.orders
            const order = orderData.find((data)=>data.id == req.params.id )
             if(order){
                 const orderdetail = order.cart
                 console.log(orderdetail);
                 if(orderdetail){
                  const  addressId =  order.addressId
                   const addressData = await address.findOne({addressId:addressId})
                        const  orderobj = {}
                        orderobj.orderDate = order.orderDate
                        orderobj.paymentAmount = order. paymentAmount
                        orderobj.paymentMethod = order.paymentMethod
                        orderobj.orderStatus = order.orderStatus
                   if(addressData){
                    res.render('user/order-detail',{UserId,orderdetail,addressData,orderobj})
                   } 
                 }else{
                    res.redirect('/404')
                 }   
             }else{
                res.redirect('/404')
             }    
        }else{
            res.redirect('/404')
        }
    } catch (error) {
        res.redirect('/404') 
    }
    },
    // addAddress:(req,res)=>{
    // const UserId = req.session.UserId
    //  res.render("user/add-address",{UserId})
    // },

    // postaddAddress:async(req,res)=>{
    //     try {
    //     const UserId = req.session.UserId
    //     if(req.body){
    //         req.body.UserId = UserId
    //         const data = req.body
    //         console.log(data)
    //         if(address.length<=5){
    //             const addressData = new address(data)
    //             console.log(addressData);
    //             await addressData.save()
    //         }else{
    //          console.log("only 5 address")
    //         }  
    //     }else{
    //         res.redirect('/404') 
    //     }
    //     } catch (error) {
    //         res.redirect('/404')  
    //     }  
    // }

    addresslist :async(req,res)=>{
            try {
            const UserId = req.session.UserId
            const addressData = await address.find({UserId})
             if(addressData){
                res.render('user/address-list',{UserId,addressData})
             }else{
         
             }
         } catch (error) {
            res.redirect('/404') 
         }   
    },

    deleteAddress:async(req,res)=>{
         try {
            const  addressId =req.params.id
            const addressData = await address.findOne({_id : req.params.id })
              if(addressData){
                 await address.deleteOne(
                     { _id: mongoose.Types.ObjectId(addressId)})
                     res.json({status:true})
              }else{
                 res.redirect('/404') 
              }
         } catch (error) {
            res.redirect('/404') 
         }
     },

    editAddress:async(req,res)=>{
     try {
        const addressId = req.params.id
        const UserId = req.session.UserId
        const addressData = await address.findOne({_id : req.params.id })
        if(addressData){
             res.render("user/editaddress",{addressData,UserId})
        }else{
            res.redirect('/404') 
        }
     } catch (error) {
        res.redirect('/404') 
     }
    },

    postEditAddress:async(req,res)=>{
      try {
      const  addressId = req.params.id
      const addressData = req.body 
      const userAddress = await address.findOne({_id:mongoose.Types.ObjectId(addressId)})
      if(userAddress){
        await address.findOneAndUpdate(  
            { _id: mongoose.Types.ObjectId(addressId)},
            {
               $set:addressData
            })
            res.redirect("/addresslist")
            }else{
                res.redirect('/404')
            }
            }catch (error) {
            res.redirect('/404')
            }    
     } , 
}

