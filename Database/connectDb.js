const mongoose =  require('mongoose')
const local_url = 'mongodb://127.0.0.1:27017/collegeportal'


const connectDb = ()=>{
    return mongoose.connect(local_url)
    .then(()=>{
        console.log('connect')
    }).catch((error)=>{
        console.log(error)
    })
}
        

module.exports = connectDb