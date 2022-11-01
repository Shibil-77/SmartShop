const products = require('../models/shecma/product-schema')
const users = require('../models/shecma/user-schema')
const category = require('../models/shecma/category')
const viewType = require('../models/shecma/viewtype')
const banner = require('../models/shecma/banner-schema')
const mongoose = require('mongoose')

let CATEGORY
module.exports = {

  adminError: (req, res) => {
    res.render('admin/error')
  },
  dashboard: (req, res) => {
    res.render('admin/dashboard')
  },


  //<- ============= product  management ========== ->


  // productList

  productList: async (req, res) => {
    let product = await products.find()
    res.render('admin/product', { product })
  },
  // viewProduct

  viewProduct: async (req, res) => {
    let CATEGORY = await category.find()
    let viewsType = await viewType.find()
    res.render('admin/addProduct', { CATEGORY, viewsType })
  },

  //  editProduct

  editProduct: async (req, res) => {
    let productId = req.params.id
    let productData = await products.findOne({ _id: productId })
    let CATEGORY = await category.find()
    let viewsType = await viewType.find()
    res.render('admin/editProduct', { productData, CATEGORY, viewsType })
  },
  // deleteProduct

  deleteProduct: async (req, res) => {
    let productId = req.params.id
    try {
      await products.deleteOne(
        { _id: mongoose.Types.ObjectId(productId) })
      res.redirect('/admin/product')
    }
    catch (error) {
      console.log("error=", error);
    }
  },

  // addProduct 

  addProduct: (req, res, next) => {
    const image = req.files
    let database_image = image.map((data) => data.filename)
    let productData = new products({
      Name: req.body.Name,
      Price: req.body.Price,
      Category: req.body.category,
      Brand: req.body.Brand,
      Discount: req.body.DiscountPrice,
      Stock: req.body.Stock,
      moreImage: database_image,
      type: req.body.type,
      Discription: req.body.Descreiption
    })
    productData.save()
      .then(data => {
        res.redirect('/admin/product')
      })
      .catch(err => {
        console.log("error");
      })
  },

  // postEditProduct

  postEditProduct: async (req,res) => {
    let image = req.files
    let ProductId = req.params.id
    if(req.files.length!==0){
     database_image = image.map((data) => data.filename)
     await products.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(ProductId) },
      {
        $set: {
          Name: req.body.Name,
          Price: req.body.Price,
          Category: req.body.category,
          Stock: req.body.Stock,
          Discription: req.body.Descreiption,
          type: req.body.type,
          Discount: req.body.DiscountPrice,
          Brand: req.body.Brand,
          moreImage: database_image
        }
      })
      res.redirect('/admin/product')
    }else{
      try {
        await products.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(ProductId) },
          {
            $set: {
              Name: req.body.Name,
              Price: req.body.Price,
              Category: req.body.category,
              Stock: req.body.Stock,
              Discription: req.body.Descreiption,
              type: req.body.type,
              Discount: req.body.DiscountPrice,
              Brand: req.body.Brand
            }
          })
        res.redirect('/admin/product')
      }
      catch (e) {
        console.log("e",)
      }
    }
    }
  ,

  //<- ============= user  management ========== ->

  //  userList

  userList: async (req, res) => {
    let userData = await users.find()
    res.render('admin/user', { userData })
  },

  //  blockUser

  blockUser: async (req, res) => {
    userId = req.params.id
    await users.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      {
        $set: {
          Action: false
        }
      })
    res.redirect('/admin/user')
  },
  // unblockUser

  unblockUser: async (req, res) => {
    userId = req.params.id
    await users.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      { $set: { Action: true } })
    res.redirect('/admin/user')
  },

  // ============= Category  management ==========

  // addCategory 

  addCategory: (req, res) => {
    res.render('admin/Category')
  },

  // postCategory

  postCategory: (req, res) => {
    let categoryData = new category({
      category: req.body.Category,
    })
    categoryData.save()
      .then(async (data) => {
        console.log("success");
        res.redirect('/admin')
      })
      .catch(err => {
        console.log("error");
      })
  },

  categoryList: async (req, res) => {
    let category_List = await category.find()
    res.render('admin/categoryList', { category_List })
  },

  deletecategory: async (req, res) => {
    let categoryId = req.params.id
    try {
      await category.deleteOne(
        { _id: mongoose.Types.ObjectId(categoryId) })
      res.redirect('/admin/categoryList')
    }
    catch (error) {
      console.log("error=", error);
    }
  },
  //  addviewType

  addviewType: (req, res) => {
    res.render('admin/viewType')
  },
  // postviewType

  postviewType: (req, res) => {
    let viewTypeData = new viewType({
      viewType: req.body.viewType,
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

  viewTypeList: async (req, res) => {
    let viewType_List = await viewType.find()
    res.render('admin/viewTypeList', { viewType_List })
  },

  deleteviewType: async (req, res) => {
    let viewtypeId = req.params.id
    try {
      await viewType.deleteOne(
        { _id: mongoose.Types.ObjectId(viewtypeId) })
      res.redirect('/admin/viewTypeList')
    }
    catch (error) {
      console.log("error=", error);
    }
  },

  // ========= bannner management =========

  addbanner: (req, res) => {
    res.render('admin/addbanner')
  },

  postaddbanner: (req, res) => {
    const image = req.file.filename
    let bannerData = new banner({
      Heading: req.body.Heading,
      offer: req.body.offer,
      bannerimage: image
    })
    bannerData.save()
      .then(data => {
        res.redirect('/admin/product')
      })
      .catch(err => {
        console.log("error");
      })
  },
  bannerList: async(req,res) => {
    let banner_List = await banner.find()
    console.log(banner_List);
    res.render('admin/banner_List',{banner_List})
  }

}
