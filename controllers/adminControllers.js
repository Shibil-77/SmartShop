const products= require('../models/shecma/product-schema')
const users= require('../models/shecma/user-schema')
const category =require('../models/shecma/category')
const viewType =require('../models/shecma/viewtype')
const mongoose =require('mongoose')
// const midlewares =require("../Midlewares/midlewares")


let CATEGORY 
module.exports = {

  //  sample

  sample:(req,res)=>{
   res.render('admin/sample')
  },


adminError :(req,res)=>{
 res.render('admin/error')
},
      // productList

productList : async(req,res)=>{
    let product = await products.find()
    res.render('admin/product',{product})
},
   // viewProduct
viewProduct :async(req,res)=>{
    let CATEGORY = await category.find()
    let viewsType =await viewType.find()
    res.render('admin/addProduct',{CATEGORY,viewsType})
},
     //  userList
userList :async(req,res)=>{
    let userData = await users.find()
    res.render('admin/user',{userData})
},
    //  editProduct
editProduct :async(req,res)=>{
    let productId =req.params.id
    let productData = await products.findOne({_id:productId})
    let CATEGORY = await category.find()
    let viewsType =await viewType.find()
    res.render('admin/editProduct',{productData,CATEGORY,viewsType})  
},
      // deleteProduct
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
     //  blockUser
blockUser :async(req,res)=>{
userId = req.params.id
await users.findOneAndUpdate(  
    { _id: mongoose.Types.ObjectId(userId)},
    {$set:{
     Action:false
    }})
  res.redirect('/admin/user')
},
    // unblockUser
unblockUser :async(req,res)=>{
userId = req.params.id
    await  users.findOneAndUpdate(  
        { _id: mongoose.Types.ObjectId(userId)},
        {$set:{   Action:true   }})
        res.redirect('/admin/user')
},
  // addCategory 
addCategory :(req,res)=>{
  res.render('admin/Category')
},
     // postCategory
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
   //  addviewType
addviewType :(req,res)=>{
    res.render('admin/viewType')
},
    // postviewType
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
     // addProduct 
addProduct :(req,res,next)=>{
  console.log(req.body.type);
  let imagesName = [];
  for (file of req.files) {
      imagesName.push(file.filename)
  }
   let productData = new products({
        Name:req.body.Name,
        Price:req.body.Price,
        Category:req.body.category,
        Thumnail:req.body.Thumnail,
        Brand:req.body.Brand,
        Discount:req.body.DiscountPrice,
        Stock:req.body.Stock,
        moreImage:imagesName,
        type:req.body.type,
        Discription:req.body.Descreiption
    })
    console.log(productData);
   productData.save()
   .then(data => {
    let image = req.files.image;
    image.mv("./public/img/sample" + data.id + '.jpg', (err, done) => {
        if (!err) {
            res.redirect('/admin');
        } else {
            console.log(err);
        }
    })
    console.log(result)
    res.redirect('/admin');
})
   .catch(err => {
    console.log("error");
   })
},

   // postEditProduct
postEditProduct :async(req,res)=>{
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
