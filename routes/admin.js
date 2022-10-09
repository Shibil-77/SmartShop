const express = require('express')
const router = express.Router()
const controller = require('../controllers/adminControllers')


router.get('/admin',controller.productList)