const multer =require('multer')



    const fileEngine = multer.diskStorage({
    destination :(req,file,callback)=>{
        callback(null,'../public/img/sample')
    },
    filename :(req,file,callback)=>{
      callback(null,file.originalname)
    }
   })


   const upload =multer({storage:fileEngine})

   module.exports = upload;