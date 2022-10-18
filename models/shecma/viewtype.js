const mongoose = require('mongoose')
const Schema = mongoose.Schema

const viewType = new Schema({
    viewType:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('viewType',viewType)