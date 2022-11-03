
const users= require('../models/shecma/user-schema')
const products = require('../models/shecma/product-schema')
const banner = require('../models/shecma/banner-schema')
const bcrypt =require('bcrypt')
const mongoose =require('mongoose')

let userError =null
let profileEmail
module.exports = {
    
    home : async(req,res)=>{
        let banner_Data = await banner.find()
        let product = await products.find()
        res.render('user/home',{product,banner_Data})
    },
    login :(req,res)=>{
        res.render('user/loginPage')
    },
    signup :(req,res)=>{
        res.render('user/register',{userError})
        userError=null
    },
    error :(req,res)=>{
        res.render('user/error')
    },
    forgotPassword :(req,res)=>{
        res.render('user/forgot-password')
    },
    Profile :async(req,res)=>{
        let profile = await users.find({ Email:profileEmail})
        res.render('user/profile',{profile})
    },
    editProfile :async(req,res)=>{
        let Profile = await users.find({ Email:profileEmail})   
        res.render('user/editProfile',{Profile})
    },

    shopsingle :async(req,res)=>{
        console.log(req.params.id);
        let product = await products.findOne({ _id :req.params.id})  
        console.log(product);
        res.render('user/shopsingle',{product})
     },
     otp :(req,res)=>{
      res.render('user/otp')
     },
// <- ====================================================== post method ====================================== ->
//   <========== dosignup ========>

    doSignup :async(req,res)=>{
      let  user = req.body
      console.log(user);
      let Password =user.Password
      let confirmPassword = user.confirmPassword
        if(Password===confirmPassword){
            let UserData = await users.findOne({ Email:user.Email})
            console.log("1");
            if(!UserData){
                console.log("2"); 
                req.session.userData = user 
                req.session.userloggedIn =true
                res.json({status:true})
              }else{
                 console.log("user Exist");
              }
        }else{
          console.log("confirmPassword");
        }





    },
    //    <- ========dologin======== ->

        dologin:async(req,res)=>{
          let User = await users.findOne({ Email:req.body.Email})
        //   console.log(User);
        if(User.Action) {
            if(User.Email===req.body.Email){
                bcrypt.compare(req.body.Password,User.Password).then((data)=>{
                   if(data){
                    profileEmail =req.body.Email
                    res.redirect('/')
                }else{
                    console.log("password invalied");
                }
                })
              }else{
                console.log("user ex");
            }
        }else{
            console.log("block");
        }        
        },
        //    <- ======== edit profile======== ->
        postProfile : async(req,res)=>{
            try{
            ProfileId =req.params.id
             await  users.findOneAndUpdate(  
            { _id: mongoose.Types.ObjectId(ProfileId)}  ,
            {$set:{
             Name:req.body.Name,
             Age:req.body.Age,
             Email:req.body.Email,
             Phone:req.body.Phone
          }})
        }
        catch(e){
            console.log("e",)
        }
        },
        
    }
