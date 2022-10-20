const products= require('../models/shecma/product-schema')
const users= require('../models/shecma/user-schema')
const category =require('../models/shecma/category')
const viewType =require('../models/shecma/viewtype')
const mongoose =require('mongoose')
const midlewares =require("../Midlewares/midlewares")


let CATEGORY 
module.exports = {

adminError :(req,res)=>{
 render('admin/error')
},

productList : async(req,res)=>{
    let product = await products.find()
    res.render('admin/product',{product})
},

viewProduct :async(req,res)=>{
    let CATEGORY = await category.find()
    let viewsType =await viewType.find()
    res.render('admin/addProduct',{CATEGORY,viewsType})
},

userList :async(req,res)=>{
    let userData = await users.find()
    res.render('admin/user',{userData})
},

editProduct :async(req,res)=>{
    let productData = await products.find()
    res.render('admin/editProduct',{productData})  
},

deleteProduct :async(req,res)=>{
     let productId =req.params.id
  try {
    await  products.deleteOne(  
        { _id: mongoose.Types.ObjectId(productId)})
        res.redirect('/admin')
     } 
   catch (error) {
    console.log("error=",error);
  }      
},

blockUser :async(req,res)=>{
userId = req.params.id
await users.findOneAndUpdate(  
    { _id: mongoose.Types.ObjectId(userId)},
    {$set:{
     Action:false
    }})
  res.redirect('/admin/user')
},

unblockUser :async(req,res)=>{
userId = req.params.id
    await  users.findOneAndUpdate(  
        { _id: mongoose.Types.ObjectId(userId)},
        {$set:{   Action:true   }})
        res.redirect('/admin/user')
},

addCategory :(req,res)=>{
  res.render('admin/Category')
},

postCategory :(req,res)=>{
  console.log(req.body.Category);
  let categoryData = new category({
      category:req.body.Category,
})
   categoryData.save()
    .then(async(data) => {
    console.log("success");
     res.redirect('/admin')
  })
  .catch(err => {
   console.log("error");
  })
},

addviewType :(req,res)=>{
    res.render('admin/viewType')
},

postviewType :(req,res)=>{
  console.log(req.body.viewType);
  let viewTypeData = new viewType({
    viewType:req.body.viewType,
})
    viewTypeData.save()
    .then((data) => {
    console.log("success");
     res.redirect('/admin')
  })
  .catch(err => {
   console.log("errorrr");
  })
},

// <============== add PRoduct===============>

addProduct :(req,res)=>{
  console.log(req.body.type);
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
    console.log(productData);
   productData.save()
   .then(data => {
     console.log("success");
      res.redirect('/admin')
   })
   .catch(err => {
    console.log("error");
   })
},

postEditProduct :async(req,res)=>{
console.log(req.params.id)
console.log(req.body);
try{
    console.log(req.params.id); 
    let ProductId =req.params.id
    await  products.findOneAndUpdate(  
    { _id: mongoose.Types.ObjectId(ProductId)},
    {$set:{
     Name:req.body.Name,
     Price:req.body.Price,
     Category:req.body.category,
     Stock:req.body.Stock,
     Thumnail:req.body.Thumnail,
     moreImage:req.body.moreImage,
     Discription:req.body.Descreiption,
     type:req.body.type,
     Discount:req.body.DiscountPrice,
     Brand:req.body.Brand
  }})
  res.redirect('/admin')
}
catch(e){
    console.log("e",)
}
}
}
