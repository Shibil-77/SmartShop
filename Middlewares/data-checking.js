const products = require('../models/schema/product-schema')
const users = require('../models/schema/user-schema')
const category = require('../models/schema/category')
const banner = require('../models/schema/banner-schema')
const Admin = require('../models/schema/admin')
const wishList = require('../models/schema/wishList_schema')

module.exports =async (data,dataBase)=>{

     if(Admin === dataBase){
      if(await Admin.findOne({data})){
         return true
      }else{
        return false
      }   
     }
     else if(banner === dataBase){

      if(await banner.findOne({data})){
        return true
      }else{
       return false
     }

     }
     else if(users === dataBase){

      if(await users.findOne({data})){
        return true
     }else{
       return false
     } 

     }
     else if(category === dataBase){

      if(await category.findOne({data})){
        return true
     }else{
       return false
     } 
 
     } else if(products === dataBase){

      if(await products.findOne({data})){
        return true
     }else{
       return false
     } 
     }else if(wishList === dataBase){

      if(await wishList.findOne({data})){
        return true
     }else{
       return false
     } 
     }
  
 }