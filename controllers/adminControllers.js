// const users= require('../models/shecma/admin-schema')
const bcrypt =require('bcrypt')
const mongoose =require('mongoose')
module.exports = {
productList : (req,res)=>{
    res.render('admin/product')
}
}