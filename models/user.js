const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    role:{
        type:String,
        default:"student"
    },
    token:{
        type:String
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },
    is_verify:{
        type:String,
        default:0
    },

}, { timestamps: true })
const UserModel = mongoose.model('user', UserSchema)
module.exports = UserModel