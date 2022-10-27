
const users= require('../models/shecma/user-schema')
const bcrypt =require('bcrypt')
const mongoose =require('mongoose')

let userError =null
let profileEmail
module.exports = {
    
    home : (req,res)=>{
        res.render('user/home')
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
// <- ====================================================== post method ====================================== ->
//   <========== dosignup ========>

    doSignup :async(req,res)=>{
        user = req.body
        // data des
        profileEmail =req.body.Email
        let ouser = await users.find({ Email:user.Email})
        if(ouser[0]){
          userError ="user exist"
          res.redirect('/signup')
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
                 const userData = new users({
                     Name,
                     Email,
                     Age,
                     Phone,
                     Password:bcryptpassword,
                     Date:today,
                     Action:true
                 })
                 //data Add to  database
                 userData.save()
                     .then(data => {
                        req.session.user =userData
                        res.redirect('/')
                     })
                     .catch(err => {
                         console.log(err);
                     })
                }else{
                userError = "confirm  Password"
                res.redirect('/signup')
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
