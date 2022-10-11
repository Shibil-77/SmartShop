const product= require('../models/shecma/product-schema')
const mongoose =require('mongoose')
module.exports = {
productList : (req,res)=>{
    res.render('admin/product')
},
addProduct :(req,res)=>{
    res.render('admin/addProduct')
},
doProduct :(req,res)=>{
   let product = req.body
   console.log(product);
   product.save()
   .then(data => {
      res.redirect('/admin')
   })
   .catch(err => {
       console.log(err);
       console.log("hello");
   })
}
}