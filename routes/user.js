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
       .get(controller.editProfile)
       .post(controller.postProfile)  

router.get('/shopsingle/:id',controller.shopsingle)

router.route('/otp')
      .get(controller.otp)
      .post(controller.postotp)
router.get("/cart/:id",controller.cart)

router.route('/cartList')
       .get(session,controller.cartList)

router.get('/shop',controller.shop)

router.get('/categoryfilter/:data',controller.categoryfilter)

router.get('/wishList/:id',controller.wishList)

router.get('/Cartquantity/:id',controller.Cartquantity)

router.get('/lessCartquantity/:id',controller.lessCartquantity)

router.get('/deletecart/:id',controller.deletecart)

router.post('/checkout',controller.checkoutpage)

router.route('/checkoutPage').
       post(controller.postcheckout)

router.get('/wishListPage',controller.wishListPage)  

router.get('/deletewishlist/:id',controller.deletewishlist)

router.post('/verifyPayment',controller.verifyPayment)

router.get('/orderSuccess',controller.orderSuccess)

router.get('/orderlist',controller.orderlist)

router.get("/orderdetail/:id",controller.orderdetail)

// router.route('/addAddress')
//        .get(controller.addAddress)
//        .post(controller.postaddAddress)

router.get("/addresslist",controller.addresslist)

module.exports = router;