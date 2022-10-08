const mongoose = require('mongoose')

const schema = mongoose.schema
const userSchema = new schema ({
    FirstName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true 
    },
    Age:{
        type:Number,
        required:true  
    },
    Phone:{
        type:Number,
        required:true    
    },
    Password:{
        type:String,
        required:true  
    },
    confirmPassword:{
        type:String,
        required:true  
    }
   
   
})
module.exports =mongoose.model('user',userSchema)