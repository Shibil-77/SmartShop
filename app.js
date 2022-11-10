const express = require('express')
const app =express()
const path = require ('path')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const dataBase = require('./server')
const session = require('express-session')


// set the view engine to ejs

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

// set the session 

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge:60000*20}
  }))

// set the roters

app.use('/admin',adminRouter)
app.use('/',userRouter)

app.use(function(req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('user/error', { url: req.url });
    return;
    }
  });

// server coccenting 

app.listen(3000)
// data base connecting 

dataBase.database();







