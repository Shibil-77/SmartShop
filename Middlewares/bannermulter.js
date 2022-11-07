const multer =require('multer')

const storage = multer.diskStorage({
    destination :(req,file,callback)=>{
       callback(null,'public/img/banner');
    },
    filename:(req,file,callback)=>{
      callback(null,Date.now()+"_"+file.originalname)
    }
  });
  
   module.exports = upload = multer({ storage: storage })