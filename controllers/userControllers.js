module.exports = {
    home : (req,res)=>{
        res.render('user/home')
    },
    login :(req,res)=>{
        res.render('user/loginPage')
    },
    singup :(req,res)=>{
        res.render('user/singup')
    },
    error :(req,res)=>{
        res.render('user/error')
    },
    forgotPassword :(req,res)=>{
        res.render('user/forgot-password')
    }
}