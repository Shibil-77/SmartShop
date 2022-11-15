const express = require('express')
const router = express.Router()
const controller = require('../controllers/userControllers')
const session =require('../Middlewares/session')

router.get('/',controller.home)

router.route('/login')
      .get(controller.login)
      .post(controller.dologin)

router.route('/signup')
      .get(controller.signup)
      .post(controller.doSignup)

router.get('/404',controller.error)

router.get('/forgotPassword',controller.forgotPassword)

router.get('/Profile',session,controller.Profile)

router.route('/editprofile/:id')
       .get(session,controller.editProfile)
       .post(session,controller.postProfile)  

router.get('/shopsingle/:id',controller.shopsingle)

router.route('/otp')
      .get(session,controller.otp)
      .post(session,controller.postotp)
router.get("/cart/:id",session,controller.cart)

router.route('/cartList')
       .get(session,controller.cartList)

router.get('/shop',controller.shop)

router.get('/categoryfilter/:data',controller.categoryfilter)

router.get('/wishList/:id',session,controller.wishList)

router.get('/Cartquantity/:id',session,controller.Cartquantity)

router.get('/lessCartquantity/:id',session,controller.lessCartquantity)

router.get('/deletecart/:id',session,controller.deletecart)

router.post('/checkout',session,controller.checkoutpage)

router.route('/checkoutPage').
       post(session,controller.postcheckout)

router.get('/wishListPage',session,controller.wishListPage)  

router.get('/deletewishlist/:id',session,controller.deletewishlist)

router.post('/verifyPayment',controller.verifyPayment)

router.get('/orderSuccess',controller.orderSuccess)

router.get('/orderlist',session,controller.orderlist)

router.get("/orderdetail/:id",session,controller.orderdetail)

// router.route('/addAddress')
//        .get(controller.addAddress)
//        .post(controller.postaddAddress)

router.get("/addresslist",session,controller.addresslist)

router.get("/deleteAddress/:id",session,controller.deleteAddress)

router.route('/editaddress/:id')
      .get(session,controller.editAddress)
      .post(session,controller.postEditAddress)

module.exports = router;