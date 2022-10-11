const express = require('express')
const router = express.Router()
const controller = require('../controllers/adminControllers')

router.get('/',controller.productList)
router.route('/addproduct')
      .get(controller.viewProduct)
      .post(controller.addProduct)
router.get('/user',controller.userList) 

module.exports = router;