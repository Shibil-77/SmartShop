
const userSchema= require('../models/shecma/user-schema')
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
            // console.log(bcryptpassword);

            // schema
            const userData = new userSchema({
                Name,
                Email,
                Age,
                Phone,
                Password:bcryptpassword
            })
            // console.log(userData);
            //data Add to  database
            // userData.save(err=>{
            //     if(err){
            //         console.log("data insert error");
            //     }else{
            //        console.log("insert data");
            //     }
            // })
            userData.save().then((result)=>{
                console.log(result);
            }).catch((err)=>{
                console.log(err);
            })
            
           }else{
           console.log("hello");
           }
        } catch (error) {
            console.log("error");
        }
    
    }

}