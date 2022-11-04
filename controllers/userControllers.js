
const users = require('../models/shecma/user-schema')           
const products = require('../models/shecma/product-schema')
const banner = require('../models/shecma/banner-schema')
const cart = require('../models/shecma/cart')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const twilioDatas = require('../twilio/twilio')
let accountSid = twilioDatas.accountSid
let authToken = twilioDatas.authToken
let verifySid = twilioDatas.verifySid
const client = require('twilio')(accountSid, authToken);

let userError = null
module.exports = {

    home: async (req, res) => {
        let banner_Data = await banner.find()
        let product = await products.find({ Delete: false })
        let UserId = req.session.UserId
        let userId = await products.findOne({ _id: UserId })
        // req.session.userId = userId
        res.render('user/home', { product, banner_Data, UserId })
    },

    login: (req, res) => {
        res.render('user/loginPage')
    },

    signup: (req, res) => {
        res.render('user/register', { userError })
        userError = null
    },

    error: (req, res) => {
        res.render('user/error')
    },

    forgotPassword: (req, res) => {
        res.render('user/forgot-password')
    },

    Profile: async (req, res) => {
        let UserId = req.session.UserId
        let profile = await users.findOne({ _id: UserId })
        res.render('user/profile', { profile, UserId })
    },

    editProfile: async (req, res) => {
        let UserId = req.session.UserId
        let profileId = req.params.id
        let Profile = await users.findOne({ _id: profileId })
        res.render('user/editProfile', { Profile, UserId })
    },

    postProfile: async (req, res) => {
        try {
            ProfileId = req.params.id
            console.log(ProfileId);
            await users.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(ProfileId) },
                {
                    $set: {
                        Name: req.body.Name,
                        Email: req.body.Email,
                        Phone: req.body.Phone
                    }
                })
            res.redirect('/profile')
        }
        catch (e) {
            console.log("e",)
        }
    },

    shopsingle: async (req, res) => {
        console.log(req.params.id);
        let product = await products.findOne({ _id: req.params.id })
        let UserId = req.session.UserId
        res.render('user/shopsingle', { product, UserId })
    },

    otp: (req, res) => {
        res.render('user/otp', { OTPincorrect })
    },
    // <- ====================================================== post method ====================================== ->
    //   <========== dosignup ========>

    doSignup: async (req, res) => {
        let user = req.body
        console.log(user);
        let Password = user.Password
        let confirmPassword = user.confirmPassword
        if (Password === confirmPassword) {
            let UserData = await users.findOne({ Email: user.Email })
            if (!UserData) {
                req.session.userData = user
                // Download the helper library from https://www.twilio.com/docs/node/install
                // Find your Account SID and Auth Token at twilio.com/console
                // and set the environment variables. See http://twil.io/secure
                // const client = require('twilio')(accountSid, authToken);

                client.verify.v2.services(verifySid)
                    .verifications
                    .create({ to: '+91' + user.Phone, channel: 'sms' })
                    .then(verification => console.log(verification.status));


                res.json({ status: true })

            } else {
                res.json({ emailExist: true })
                console.log("user Exist");
            }
        } else {
            res.json({ confirmpasswordError: true })
            console.log("confirmPassword");
        }
    },
    //    <- ========dologin======== ->

    dologin: async (req, res) => {
        let User = await users.findOne({ Email: req.body.Email })
        console.log(User.Action);
        //   console.log(User);
        if (User.Action) {
            if (User.Email === req.body.Email) {
                bcrypt.compare(req.body.Password, User.Password).then((data) => {
                    if (data) {
                        req.session.UserId = User.id
                        res.json({ status: true })
                    } else {
                        res.json({ passworError: true })
                    }
                })
            } else {
                res.json({ emailError: true })
            }
        } else {
            res.json({ accessError: true })
        }
    },

    //    <- ======== edit profile======== ->

    postotp: (req, res) => {
        console.log(req.body.otp);

        client.verify.v2.services(verifySid)
            .verificationChecks
            .create({ to: '+91' + req.session.userData.Phone, code: req.body.otp })
            .then(async (verification_check) => {

                if (verification_check.status == "approved") {
                    let UserData = req.session.userData
                    let bcryptpassword = await bcrypt.hash(UserData.Password, 10)
                    let today = new Date();
                    let dd = String(today.getDate()).padStart(2, '0');
                    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    let yyyy = today.getFullYear();
                    today = mm + '/' + dd + '/' + yyyy;

                    const userData = new users({
                        Name: UserData.Name,
                        Email: UserData.Email,
                        Phone: UserData.Phone,
                        Password: bcryptpassword,
                        Date: today,
                        Action: true
                    })
                    userData.save()
                        .then(data => {
                            req.session.UserId = data.id
                            req.session.userData = null
                            req.session.loggedIn = true
                            res.redirect('/')
                        })
                } else {
                    req.session.userData = null
                    console.log("OTP ERROR");
                }
            });
    },

    cart: async (req, res) => {
        // console.log("hello");
        // console.log(req.params.id);
        let productId = req.params.id
        let product = await products.findOne({ _id: productId })
        let totalAmount = product.Price
        // console.log("==========2=========",totalAmount);
        let userId = req.session.UserId
        // console.log("=========3=========",userId);

        let cartData = await cart.findOne({ UserId:userId})

        if (cartData) {
         let productIndex =  cartData.Product.findIndex(p=> p.ProductId == productId)
         console.log(productIndex)
         if(productIndex>=0){
              cartData.Product[productIndex].quantity = Number(cartData.Product[productIndex].quantity)+1
              await cartData.save()
              res.json({status:true})

         }else{
            cartData.Product.push({ProductId:productId,quantity:1})
            await cartData.save()
            res.json({status:true})
         }
        
        //  cartData.products[productIndex]

        } else {

            // console.log("======5========");

            cart.create({
                UserId: mongoose.Types.ObjectId(userId),
                totalBill: totalAmount,
                Product: [{
                    ProductId:mongoose.Types.ObjectId(productId),
                    quantity: 1
                }]

            }).then((data)=>{
                res.json({status:true})
                // console.log("====66====",data);
            })
        }

    },

    cartList :async(req,res)=>{
        let UserId = req.session.UserId

        let userCartData = await cart.findOne({ UserId: UserId})
        
        console.log("===========44======",userCartData);
       res.render('user/cart',{UserId,userCartData})
    }

}
