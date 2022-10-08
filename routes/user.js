const express = require('express')
const router = express.Router()
const controller = require('../controllers/userControllers')

router.get('/',controller.home)
router.get('/login',controller.login)
router.get('/signup',controller.signup)
router.get('/404',controller.error)
router.get('/forgotPassword',controller.forgotPassword)








module.exports = router;