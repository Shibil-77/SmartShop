


module.exports = (req,res,next)=>{
   if(req.session.userdata){
    next()
   }else{
    res.redirect('/login')
   }
 }