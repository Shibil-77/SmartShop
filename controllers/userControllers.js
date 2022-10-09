
const users= require('../models/shecma/user-schema')
const bcrypt =require('bcrypt')
const mongoose =require('mongoose')

let profileEmail
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
    Profile :async(req,res)=>{
        // console.log(profileEmail);
        let profile = await users.find({ Email:profileEmail})
        // console.log(profile);
        res.render('user/profile',{profile})
    },
    editProfile :async(req,res)=>{
        let Profile = await users.find({ Email:profileEmail})   
        res.render('user/editProfile',{Profile})
    },
  
//   <========== dosignup ========>

    doSignup :async(req,res)=>{
        user = req.body
        // data des
        profileEmail =req.body.Email
        let ouser = await users.find({ Email:user.Email})
        if(ouser[0]){
          console.log("user");
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
                let today = new Date();
                    let dd = String(today.getDate()).padStart(2, '0');
                    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    let yyyy = today.getFullYear();
                    today = mm + '/' + dd + '/' + yyyy;
                    console.log(today);

                 const userData = new users({
                     Name,
                     Email,
                     Age,
                     Phone,
                     Password:bcryptpassword,
                     Date:today
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
        //   console.log(User);   
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
        },
        postProfile :(req,res)=>{
           console.log(req.body);
        }
        
}