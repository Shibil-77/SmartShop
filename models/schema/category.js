const mongoose = require('mongoose')
const Schema = mongoose.Schema

const category = new Schema({
    category:{
        type:String,
        unique: true,
        required:true
    }
})

module.exports = mongoose.model('category',category)