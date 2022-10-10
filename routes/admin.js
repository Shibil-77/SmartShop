const express = require('express')
const router = express.Router()
const controller = require('../controllers/adminControllers')

router.get('/',controller.productList)
router.get('/add-prod')
module.exports = router;