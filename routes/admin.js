const express = require('express')
const router = express.Router()
const controller = require('../controllers/adminControllers')
router.get('/product',controller.productList)
router.get('/error',controller.adminError)
router.route('/addproduct')
       .get(controller.viewProduct)
       .post(controller.addProduct)
router.get('/user',controller.userList) 
router.route('/editproduct/:id')
       .get(controller.editProduct)
       .post(controller.postEditProduct)
router.get('/deleteProduct/:id',controller.deleteProduct)  
router.get('/blockUser/:id',controller.blockUser)     
router.get('/unblockUser/:id',controller.unblockUser) 
router.route('/category')
       .get(controller.addCategory)
       .post(controller.postCategory)
router.route('/viewType')
       .get(controller.addviewType)
       .post(controller.postviewType)
router.get('/',controller.dashboard)    
router.get('/categoryList',controller.categoryList)           

module.exports = router;