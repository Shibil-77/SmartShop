const express = require('express')
const router = express.Router()
const controller = require('../controllers/adminControllers')

router.get('/',controller.productList)
router.route('/addproduct')
      .get(controller.addProduct)
      .post(controller.doProduct)
module.exports = router;