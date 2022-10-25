const express = require('express')
const app =express()
const path = require ('path')
const bodyParser =require('body-parser')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const dataBase = require('./server')
const session = require('express-session')
const multer =require('multer')



// set the view engine to ejs

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

//   < ========= multer  ======== >
 
 const filestorage = multer.diskStorage({
  destination:(req,file,callback)=>{
    callback(null,"public/img/sample")
  },
  filename:(req,file,callback)=>{
    callback(null,new Date().toISOString +  file.originalname)
  } 
 })

app.use(multer({dest:'public/img/sample',filestorage: filestorage}).single('image'))

// set the session 

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge:60000*20}
  }))

// set the roters 

app.use('/',userRouter)
app.use('/admin',adminRouter)

// data base connecting 

dataBase.database();

// server coccenting 

app.listen(3000)

