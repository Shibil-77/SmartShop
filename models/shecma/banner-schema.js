const mongoose = require('mongoose')
const Schema = mongoose.Schema

const banner = new Schema({
    Heading:{
        type:String,
        required:true
    },
    offer:{
        type:Number,
        required:true 
    },
    bannerimage:{
        type:String,
        required:true 
    }
})

module.exports = mongoose.model('banner',banner)