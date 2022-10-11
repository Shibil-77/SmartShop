const products= require('../models/shecma/product-schema')
const users= require('../models/shecma/user-schema')
const mongoose =require('mongoose')
module.exports = {
productList : async(req,res)=>{
    let product = await products.find()
    res.render('admin/product',{product})
},
viewProduct :(req,res)=>{
    res.render('admin/addProduct')
},
userList :async(req,res)=>{
    let userData = await users.find()
    res.render('admin/user',{userData})
},
// <============== add PRoduct===============>
addProduct :(req,res)=>{
   let productData = new products({
        Name:req.body.Name,
        Price:req.body.Price,
        Category:req.body.category,
        Thumnail:req.body.Thumnail,
        Brand:req.body.Brand,
        Discount:req.body.DiscountPrice,
        Stock:req.body.Stock,
        moreImage:req.body.moreImage,
        type:req.body.type,
        Discription:req.body.Descreiption
       
    })
   productData.save()
   .then(data => {
    console.log("success");
      res.redirect('/admin')
   })
   .catch(err => {
    //    console.log(err);
    console.log("error");
   })
}
}