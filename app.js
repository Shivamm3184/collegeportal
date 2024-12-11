const express = require('express')
const app = express()
const port = 3000
const web = require('./routes/web')
const connectDb = require('./Database/connectDb')


// view set ejs
app.set('view engine','ejs')

//css image js link public
app.use(express.static('public'))
//connectDB
connectDb()
// parse application form se data get karne ke liye
app.use(express.urlencoded({ extended: false }))












//route load
 app.use('/',web)
// server create
app.listen(port, () => {
    console.log(`server start localhost: ${port}`)
  })