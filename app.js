const express = require('express')
const app =express()


const userRouter = require('./routes/user')
app.use('/user',userRouter)

app.listen(3000)