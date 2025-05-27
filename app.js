const express = require('express')
const app = express()
const port = 3000
const web = require('./routes/web')
const connectDb = require('./Database/connectDb')
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser')


// const bodyParser = require('body-parser'); // Optional with Express 4.16.0+

// app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded data
// app.use(express.json()); // Parses JSON data



// image upload
app.use(fileupload({ useTempFiles: true }))
//token
app.use(cookieParser())

// view set ejs
app.set('view engine', 'ejs')

//css image js link public
app.use(express.static('public'))
//connectDB
connectDb()
// parse application form se data get karne ke liye
app.use(express.urlencoded({ extended: false }))

//connect flash and session
const session = require('express-session')
const flash = require('connect-flash')
// messages
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
}));
// false messages
app.use(flash());





//route load
app.use('/', web)
// server create
app.listen(port, () => {
  // console.log(`server start localhost: ${port}`)
  console.log(`login with: http://localhost:3000/`)
})