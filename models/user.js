const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
    name:{
        type:String,
        require
    },
    email:{
        type:String,
        require
    },
    password:{
        type:String,
        require
    }
})
const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel