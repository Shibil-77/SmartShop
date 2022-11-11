const Swal = require('sweetalert2')
module.exports = (req,res,next)=>{
   if(req.session.userloggedIn){
    next()
   }else{
    Swal.fire({
      title: 'Error!',
      text: 'Do you want to continue',
      icon: 'error',
      confirmButtonText: 'Cool'
    })
   }
 }