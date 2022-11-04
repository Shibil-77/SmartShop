
module.exports = (req,res,next)=>{
   if(req.session.userloggedIn){
    next()
   }else{
    res.redirect('/login')
   }
 }