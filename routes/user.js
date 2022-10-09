const express = require('express')
const router = express.Router()
const controller = require('../controllers/userControllers')


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
router.route('/editProfile/:id')
    
      .get(controller.editProfile)
      .post(controller.postProfile)


module.exports = router;