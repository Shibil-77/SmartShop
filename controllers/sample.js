// doSignup :async(req,res)=>{
//     user = req.body
//     profileEmail =req.body.Email
//     let ouser = await users.findOne({ Email:user.Email})
//     if(ouser){
//       userError ="user exist"
//       res.redirect('/signup')
//     }
//     else{  
//         try {
//             const {
//              Name,
//              Email,
//              Age,
//              Phone,
//              Password,
//              confirmPassword
//             }=user  
//          //    console.log(Password);
//             if(Password===confirmPassword){             
//              // password bcrypt
//              bcryptpassword = await bcrypt.hash(Password,10)    
//              // schema
//             let today = new Date();
//                 let dd = String(today.getDate()).padStart(2, '0');
//                 let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//                 let yyyy = today.getFullYear();
//                 today = mm + '/' + dd + '/' + yyyy;
//              const userData = new users({
//                  Name,
//                  Email,
//                  Phone,
//                  Password:bcryptpassword,
//                  Date:today,
//                  Action:true
//              })
//              //data Add to  database
//              userData.save()
//                  .then(data => {
//                     req.session.user =userData
//                     res.redirect('/otp')
//                  })
//                  .catch(err => {
//                      console.log(err);
//                  })
//             }else{
//             userError = "confirm  Password"
//             res.redirect('/signup')
//             }
//          } catch (error) {
//              console.log("error");
//          }
//      }
//     }