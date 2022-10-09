
const users= require('../models/shecma/user-schema')
const bcrypt =require('bcrypt')
const mongoose =require('mongoose')


module.exports = {
    home : (req,res)=>{
        res.render('user/home')
    },
    login :(req,res)=>{
        res.render('user/loginPage')
    },
    signup :(req,res)=>{
        res.render('user/register')
    },
    error :(req,res)=>{
        res.render('user/error')
    },
    forgotPassword :(req,res)=>{
        res.render('user/forgot-password')
    },
  
//   <========== dosignup ========>

    doSignup :async(req,res)=>{
        user = req.body
        // data des
        let ouser = await users.find({ Email:user.Email})
        if(ouser[0]){
          console.log("user ");
        }
        else{
            try {
                const {
                 Name,
                 Email,
                 Age,
                 Phone,
                 Password,
                 confirmPassword
                }=user  
             //    console.log(Password);
                if(Password===confirmPassword){             
                 // password bcrypt
                 bcryptpassword = await bcrypt.hash(Password,10)    
                 // schema
                 const userData = new users({
                     Name,
                     Email,
                     Age,
                     Phone,
                     Password:bcryptpassword
                 })
                 //data Add to  database
                 userData.save()
                     .then(data => {
                        res.redirect('/')
                     })
                     .catch(err => {
                         console.log(err);
                     })
                }else{
                console.log("hello");
                }
             } catch (error) {
                 console.log("error");
             }
         }
        },

    //    <- ========dologin======== ->

        dologin:async(req,res)=>{
          let User = await users.findOne({ Email:req.body.Email})
          console.log(User);   
          if(User.Email===req.body.Email){
            bcrypt.compare(req.body.Password,User.Password).then((data)=>{
               if(data){
                res.redirect('/')
               }else{
                console.log("password invalied");
               }
            })
          }else{
            console.log("user ex");
          }
        },
        
}