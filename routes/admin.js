const express = require('express')
const router = express.Router()
const controller = require('../controllers/adminControllers')
const storage = require('../Middlewares/multer')
const bannerstorage =require('../Middlewares/bannermulter')
const session =require('../Middlewares/adminSession')

router.get('/product',session,controller.productList)

router.get('/error',controller.adminError)

router.route('/addproduct')
       .get(session,controller.viewProduct)
       .post(session,storage.array('image',3),controller.addProduct)

router.get('/user',session,controller.userList) 

router.route('/editproduct/:id')
       .get(session,controller.editProduct)
       .post(session,storage.array('images',3),controller.postEditProduct)

router.get('/deleteProduct/:id',session,controller.deleteProduct)  

router.get('/blockUser/:id',session,controller.blockUser) 

router.route('/category')
       .get(session,controller.addCategory)
       .post(session,controller.postCategory)

router.get('/',session,controller.dashboard) 

router.get('/categoryList',session,controller.categoryList)

router.get('/deletecategory/:id',session,controller.deletecategory) 

router.route('/addbanner')
       .get(session,controller.addbanner)
       .post(bannerstorage.single ("bannerimage"),session,controller.postaddbanner)

router.get('/bannerList',session,controller.bannerList)

router.route('/editbanner/:id')
      .get(session,controller.editBanner)
      .post(bannerstorage.single ("bannerimage"),session,controller.posteditBanner)

router.get('/deletebanner/:id',session,controller.deletebanner) 

router.route('/adminlogin')
       .get(controller.adminlogin)
       .post(controller.postadminlogin)

router.route('/adminsignup')
      .get(controller.adminsignup)
      .post(controller.postadminsignup)

router.get('/adminlist',session,controller.adminList)

router.get('/adminAccess/:id',session,controller.adminAccess)    

router.get('/adminlogout',session,controller.adminlogout)

router.get('/adminAllOrder',session,controller.adminAllOrder)

router.get('/adminOrderDetail/:id/:orderId',session,controller.adminOrderDetail)

router.get("/paymentStatusChange/:id/:orderId",session,controller.paymentStatusChange)

router.route("/addcoupon")
       .get(session,controller.addCoupon)
       .post(session,controller.postAddCoupon)

router.get("/coupon",controller.couponList)

router.get("/deletecoupon/:id",controller.deleteCoupon)

router.get("/salesReport",controller.salesReport)


module.exports = router;