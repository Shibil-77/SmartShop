
const users= require('../models/shecma/user-schema')
const products = require('../models/shecma/product-schema')
const banner = require('../models/shecma/banner-schema')
const bcrypt =require('bcrypt')
const mongoose =require('mongoose')
const twilioDatas = require('../twilio/twilio')
let accountSid  = twilioDatas.accountSid
let authToken = twilioDatas.authToken
let verifySid = twilioDatas.verifySid
const client = require('twilio')(accountSid, authToken);

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
res.render('user/otp',{OTPincorrect})
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
console.log(req.session.userData);

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
// const client = require('twilio')(accountSid, authToken);

client.verify.v2.services(verifySid)
                .verifications
                .create({to: '+91'+user.Phone, channel: 'sms'})
                .then(verification => console.log(verification.status));


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
res.json({status:true})
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

postotp :(req,res)=>{
    console.log(req.body.otp);

      client.verify.v2.services(verifySid)
      .verificationChecks
      .create({to:'+91'+req.session.userData.Phone, code:req.body.otp})
      .then(async(verification_check) => {

    if(verification_check.status == "approved" ){
        let  UserData =  req.session.userData
        let  bcryptpassword = await bcrypt.hash(UserData.Password,10) 
        let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
        
                    const userData = new users({
                        Name:UserData.Name,
                        Email:UserData.Email,
                        Phone:UserData.Phone,
                        Password:bcryptpassword,
                        Date:today,
                        Action:true
                    })

                    userData.save()
                    .then(data => {
                        req.session.loggedIn =true
                        res.redirect('/')
                    })  
                }else{
                    console.log("OTP ERROR");
                }
      });
},

cart :async(req,res)=>{
    console.log(req.params.id);
   let  productId = req.params.id
    let product = await products.findOne({_id:productId})
     res.render('user/cart')
},

}
