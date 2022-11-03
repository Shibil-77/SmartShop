const express = require('express')
const router = express.Router()
const controller = require('../controllers/userControllers')
const session =require('../Midlewares/session')

router.get('/',controller.home)
router.route('/login')
            .get(controller.login)
            .post(controller.dologin)
router.route('/signup')
      .get(controller.signup)
      .post(controller.doSignup)
router.get('/404',controller.error)
router.get('/forgotPassword',controller.forgotPassword)
router.get('/Profile',controller.Profile)
router.get('/editprofile',controller.editProfile)
router.post('/editprofile/:id',controller.postProfile)  
router.get('/shopsingle/:id',controller.shopsingle)
router.get('/otp',controller.otp)

module.exports = router;