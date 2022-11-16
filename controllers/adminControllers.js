const products = require('../models/schema/product-schema')
const users = require('../models/schema/user-schema')
const category = require('../models/schema/category')
const banner = require('../models/schema/banner-schema')
const Admin = require('../models/schema/admin')
const order = require('../models/schema/orders')
const mongoose = require('mongoose')
const address = require('../models/schema/address')
const bcrypt = require('bcrypt')
const dataCheck = require('../Middlewares/data-checking')
const { orderdetail } = require('./userControllers')


module.exports = {
   adminError: (req, res) => {
      res.render('admin/admin-error')
   },
   dashboard: (req, res) => {
      res.render('admin/dashboard')
   },
   adminsignup: (req, res) => {
      res.render('admin/adminsignup')
   },
   adminlogin: (req, res) => {
      res.render('admin/adminlogin')
   },

   adminlogout: (req, res) => {
      req.session.AdminId = null
      req.session.adminloggedIn = false
      res.redirect('/admin/adminlogin')
   },

   postadminsignup: async (req, res) => {
      try {
         const AdminData = req.body
         if(AdminData){
            const bcryptpassword = await bcrypt.hash(AdminData.Password, 10)
            if(bcryptpassword){
               const {Name,Email}=AdminData
               AdminData.Password = bcryptpassword
               AdminData.Admin = false
               console.log(AdminData);
               const adminData = new Admin(AdminData)
              await adminData.save()    
              res.json({ status: true })
            }else{
                res.redirect('/admin/error')  
            } 
         }else{
             res.redirect('/admin/error') 
         }
      } catch (error) {
         res.redirect('/admin/error')
      }
     
   },

   postadminlogin: async (req, res) => {
      try {
         let AdminData = await Admin.findOne({ Email: req.body.Email })
         if (AdminData) {
            if (AdminData?.Admin) {
               bcrypt.compare(req.body.Password, AdminData.Password).then((data) => {
                  if (data) {
                     req.session.AdminId = AdminData
                     req.session.adminloggedIn = true
                     res.json({ status: true })
                  } else {
                     res.json({ passworError: true })
                     // console.log("password invalied");
                  }
               })
            } else {
               res.json({ accessError: true })
               // console.log("block");
            }
         } else {
            // console.log("email error");
            res.json({ emailError: true })
         }
      } catch (error) {
         res.redirect('/admin/error')
      }
    
   }
   ,

   adminList: async (req, res) => {
      try {
         let adminData = await Admin?.find()
         res.render('admin/adminList', { adminData })
      } catch (error) {
         res.redirect('/admin/error')
      }
    
   },

   adminAccess: async (req, res) => {
      try { 
         const _id = req.params.id
         const success = await dataCheck(_id,products)
         if(success){
            const data = await Admin?.findOne({_id,Admin:{$eq:true}})
            let Action
                 if(data){
                  Action =false
                  }else{
                  Action =true  
                  }
               await Admin.findOneAndUpdate(
                  { _id: mongoose.Types.ObjectId(_id)},
                  {
                     $set:{ Admin:Action}
                  })
               res.redirect('/admin/adminList')
         }else{
             res.redirect('/admin/error') 
      }  
      } catch (error) {
         res.redirect('/admin/error') 
      }     
   },

   //<- ============= product  management ========== ->

   // productList

   productList: async (req, res) => {
      try {
         const product = await products.find({ Delete: false })
         if (product) {
            res.render('admin/product', {product})
         } else {
             res.redirect('/admin/error') 
         }
      } catch (error) {
         res.redirect('/admin/error')
      }
   },
   // viewProduct

   viewProduct: async (req, res) => {
      try {
         const CATEGORY = await category.find()
         if (CATEGORY) {
            res.render('admin/addProduct', {CATEGORY})
         } else {
             res.redirect('/admin/error') 
         }
      } catch (error) {
         res.redirect('/admin/error')
      }
   },

   //  editProduct

   editProduct: async (req, res) => {
      try {
         let _id = req.params.id
         const success = await dataCheck(_id, products)
         if (success) {
            Promise.all([products.findOne({ _id }), category.find()])
               .then((values) => {
                  const [productData,CATEGORY] = values;
                  res.render('admin/editProduct', { productData,CATEGORY})
               }).catch((error) => {
                  res.redirect('/admin/error')
               })
         } else {
            res.redirect('/admin/error')
         }
      } catch (error) {
         res.redirect('/admin/error')
      }
   },
   // deleteProduct

   deleteProduct: async (req, res) => {
      try {
      let _id = req.params.id
      const success = await dataCheck(_id,products)
      if (success) {
            await products.findOneAndUpdate(
               { _id: mongoose.Types.ObjectId(_id)},
               {
                  $set: {
                     Delete: true
                  }
               })
            res.json({ status: true })
        
      } else {
          res.redirect('/admin/error') 
      }
   } catch (error) {
      res.redirect('/admin/error')
   }
   },

   // addProduct 

   addProduct: async(req, res, next) => {
      try {
         if(req.body){
            if(req.files){
             const  data = req.body
             const image = req.files
               const database_image = image.map((data) => data.filename)
               data.moreImage =  database_image
               data.Delete =false
               if(database_image.length!==0){
                  let productData = new products(data)  
                  console.log(productData); 
                 await productData.save()
                  res.redirect('/admin/product')
               }else{
                console.log("not 3 req.files");
               }
            }else{
               console.log("not req.files");
            }     
         }else{
            console.log("req.body");
         }
      } catch (error) {
         console.log("===============12===========");
         res.redirect('/admin/error')
      }
   },

   // postEditProduct

   postEditProduct: async (req, res) => {
      try { 
      const _id = req.params.id
      const success = await dataCheck(_id,products)
      if(success){
            const Data = req.body  
            const image = req.files
            if(req.files.length === 3){
               database_image = image.map((data) => data.filename)
               Data.moreImage = database_image
            }
            await products.findOneAndUpdate(  
               { _id: mongoose.Types.ObjectId(_id)},
               {
                  $set:Data
               })
            res.redirect('/admin/product')
        
   }else{
       res.redirect('/admin/error') 
   }
} catch (error) { 
   res.redirect('/admin/error')
} 
},

   //<- ============= user  management ========== ->

   //  userList

   userList: async (req, res) => {
      try {   
         const userData = await users?.find()
         if(userData){
            res.render('admin/user', {userData})
         }else{
             res.redirect('/admin/error') 
         } 
      } catch (error) {
         res.redirect('/admin/error')
      }
       
   },

   //  blockUser

   blockUser: async (req, res) => {
      try { 
         const _id = req.params?.id
         const success = await dataCheck(_id,products)
         if(success){
            const data = await users?.findOne({_id,Action:{$eq:true}})
            let Action
                 if(data){
                  Action =false
                  }else{
                  Action =true  
                  }
               await users.findOneAndUpdate(
                  { _id: mongoose.Types.ObjectId(_id)},
                  {
                     $set:{ Action:Action}
                  })
               res.redirect('/admin/user')
         }else{
             res.redirect('/admin/error') 
      }  
      } catch (error) {
         res.redirect('/admin/error') 
      }     
   },

   // < ============= Category  management ========== >

   // addCategory 

   addCategory: (req, res) => {
      const categoryError =  req.session.category
      res.render('admin/Category',{categoryError})
   },

   // postCategory

   postCategory: async(req, res) => {
        try {
         if(req.body){
            const categoryData = new category({
               category: req.body.Category,
            })
           await categoryData.save().then(()=>{
               res.redirect('/admin/categoryList')
               req.session.category = true
           }).catch(()=>{
            req.session.category = true
           })
         }
        } catch (error) {
         res.redirect('/admin/error') 
        }
   },

   categoryList: async (req, res) => {
      try {
      const category_List = await category.find()
         if(category_List){
            res.render('admin/categoryList', { category_List }) 
         }else{
             res.redirect('/admin/error') 
         }  
      } catch (error) {
         res.redirect('/admin/error') 
      }
   },

   deletecategory: async (req, res) => {
      try {
      let categoryId = req.params.id
      const _id = req.params?.id
      const success = await dataCheck(_id,category)
      if(success){
         await category.deleteOne(
            { _id: mongoose.Types.ObjectId(_id) })
             res.redirect('/admin/categoryList')
      }else{
          res.redirect('/admin/error') 
      }   
      }catch (error) {
         res.redirect('/admin/error') 
      }
   },

   // ========= bannner management =========

   addbanner: (req, res) => {
      res.render('admin/addbanner')
   },

   postaddbanner:async (req, res) => {
      try {
         if(req.body){
            if(req.file){
               const image = req.file.filename
                if(image){
                  const data =req.body
                  data.bannerimage = image
                  const bannerData = new banner(data)
                await  bannerData.save()
                res.redirect('/admin/bannerList')
                }else{
              console.log("pleace add image");
                }
            }else{
               console.log("pleace add image");
            }  
         }else{
             res.redirect('/admin/error') 
         }
      } catch (error) { 
         res.redirect('/admin/error')   
      }
   },

   bannerList: async (req, res) => {
      try {
         let banner_List = await banner.find()
         if(banner_List){
            res.render('admin/banner_List', { banner_List })
         }else{
             res.redirect('/admin/error') 
         }
      } catch (error) {
         res.redirect('/admin/error') 
      } 
   },

   editBanner: async (req, res) => {
      try {
         const _id = req.params?.id
         const success = await dataCheck(_id,products)
       if(success){
         const bannerData = await banner.findOne({ _id })
         if(bannerData){
            res.render('admin/banneredit', { bannerData })
         }
       }else{
          res.redirect('/admin/error')    
       }
      } catch (error) {
         res.redirect('/admin/error') 
      }  
   },

   posteditBanner: async (req, res) => {
      try { 
         const _id = req.params.id
         const success = await dataCheck(_id,banner)
         if(success){
               const Data = req.body  
               const image = req.file
               if(req.file){
                  Data.bannerimage = image.filename
                  console.log(Data);
               }
               await banner.findOneAndUpdate(  
                  { _id: mongoose.Types.ObjectId(_id)},
                  {
                     $set:Data
                  })
                  res.redirect('/admin/bannerList')
      }else{
          res.redirect('/admin/error') 
      }
   } catch (error) { 
      res.redirect('/admin/error')
   } 
   },

   deletebanner: async (req, res) => {
      try {
      const _id = req.params.id
      const success = await dataCheck(_id,banner)
      if(success){
         await banner.deleteOne(
            {_id})
         res.redirect('/admin/bannerList')
      }else{
          res.redirect('/admin/error') 
      }     
      }
      catch (error) {
         res.redirect('/admin/error')
      }
   },

    adminAllOrder:async(req,res)=>{
       try {
         const orderdetail = await order.aggregate([
            {
                $unwind: "$orders"
            },
            {
                $project: { orders: 1 }
            },
            {
                $sort: { "orders.date": -1 }
            }
        ])
        if(orderdetail){
           res.render('admin/all-order',{orderdetail})
        }else{
         res.redirect('/admin/error')
        }
       } catch (error) {
         res.redirect('/admin/error')
       }
   },

   adminOrderDetail:async(req,res)=>{
     try {
       const data = await order.findOne({_id:req.params.id}).populate('orders.cart').exec()
          if(data){
            const orderData = data.orders
            const Dataorders = orderData.find((data) => data.id == req.params.orderId)
            console.log(Dataorders)
            if(Dataorders){
               const orderdetail = Dataorders.cart
               const addressId = order.addressId
               const addressData = await address.findOne({ addressId: addressId })
               const orderobj = {}
               orderobj.orderDate = Dataorders.orderDate
               orderobj.paymentAmount = Dataorders.paymentAmount
               orderobj.paymentMethod = Dataorders.paymentMethod
               orderobj.orderStatus = Dataorders.orderStatus
               res.render("admin/orderdetail",{orderdetail,addressData,orderobj})
            }else{
               res.redirect('/admin/error')
            } 
          }else{
            res.redirect('/admin/error')
          }
     } catch (error) {
      res.redirect('/admin/error')
     }     
   },

   paymentStatusChange:async(req,res)=>{
      try {
      const data = await order.findOne({_id:req.params.id}).populate('orders.cart').exec()
                  if(data){
                  let orderIndex = data.orders.findIndex(p => p._id == req.params.orderId)
                  if (orderIndex >= 0) {
                   let changeStatusOrder = data.orders[orderIndex]
                   console.log(changeStatusOrder)
                    if(changeStatusOrder.orderStatus == "pending" ){
                     changeStatusOrder.orderStatus = "shipped"
                    }else if(changeStatusOrder.orderStatus == "shipped"){
                     changeStatusOrder.orderStatus = "packed"
                    }else if(changeStatusOrder.orderStatus == "packed"){
                     changeStatusOrder.orderStatus ="placed"
                    }else if(changeStatusOrder.orderStatus == "cancel"){
                     changeStatusOrder.orderStatus = "cancel"
                    }
                    else{
                     changeStatusOrder.orderStatus = "placed"
                    }
                   data.orders[orderIndex] = changeStatusOrder
                  await data.save()
                  res.redirect('/admin/adminAllOrder')
               }
            }else{
               res.redirect('/admin/error')
            }
      } catch (error) {
         res.redirect('/admin/error')
      }
   }

}


// try { 
//    const _id = req.params?.id
//    const success = await dataCheck(_id,products)
//    if(success){
//       const data = await users?.findOne({_id,Action:{$eq:true}})
//       let Action
//            if(data){
//             Action =false
//             }else{
//             Action =true  
//             }
//          await users.findOneAndUpdate(
//             { _id: mongoose.Types.ObjectId(_id)},
//             {
//                $set:{ Action:Action}
//             })
//          res.redirect('/admin/user')
//    }else{
//        res.redirect('/admin/error') 
// }  
// } catch (error) {
//    res.redirect('/admin/error') 
// }  