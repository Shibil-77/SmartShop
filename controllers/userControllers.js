
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

let userError = null
module.exports = {

    home: async (req, res) => {
        let banner_Data = await banner.find()
        let product = await products.find({ Delete: false })
        let UserId = req.session.UserId
        res.render('user/home', { product, banner_Data, UserId })
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
                    userData.save()
                        .then(data => {
                            req.session.UserId = data.id
                            req.session.userData = null
                            req.session.loggedIn = true
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
            res.render('user/cart', { UserId, cartData, data })
        } else {
            res.redirect('/user/error')
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

    checkoutpage: (req, res) => {
        let totalBill = req.body.totalBill
        const UserId = req.session.UserId
        res.render('user/checkout', { UserId, totalBill })
    },

    postcheckout: async (req, res) => {
        try {
            const UserId = req.session.UserId
            if (req.body) {
                const data = req.body
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
                const addressId = addressData.id
                let today = new Date();
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                let yyyy = today.getFullYear();
                today = mm + '/' + dd + '/' + yyyy;
                const cartData = await cart.findOne({ UserId }).populate('Product.ProductId').exec()
                const orderdata = {
                    paymentMethod: "cash",
                    paymentAmount: data.totalBill,
                    orderStatus: "pending",
                    orderDate: today,
                    addressId: addressId,
                    cart: cartData
                }
                let orderId 
                const orderData = await order.findOne({ userId: UserId })
                if (orderData) {
                    orderData.orders.push(orderdata)
                    await orderData.save()
                    orderId = orderData.id
                } else {
                    order.create({
                        userId: mongoose.Types.ObjectId(UserId),
                        orders: [orderdata]
                    }).then((data) => {
                        console.log("creat");
                    })
                }
                if (req.body.cash == 'cash') {
                   res.json({paymentSuccess:true})
                } else {
                    console.log('orderId',orderId);
                    const totalBill = data.totalBill
                    let options = {
                        amount: totalBill,  // amount in the smallest currency unit
                        currency: "INR",
                        receipt: "" + orderId
                    };
                    instance.orders.create(options, function (err, order) {
                        console.log(order);
                        res.json(order)
                    });
                }
            } else {

            }
        } catch (error) {
            res.redirect('/')
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
                res.redirect('/admin/error')
            }
        } catch (error) {
            res.redirect('/admin/error')
        }
    },
    verifyPayment:(req,res)=>{
        console.log(req.body);
    }
}

