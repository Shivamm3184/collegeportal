const mongoose =  require('mongoose')
const local_url = 'mongodb://127.0.0.1:27017/collegeportal'
const live_URL ='mongodb+srv://shivammishra3184:ram123@cluster0.lpfai.mongodb.net/collegePortal?retryWrites=true&w=majority&appName=Cluster0'


const connectDb = ()=>{
    return mongoose.connect(live_URL)
    .then(()=>{
        console.log('connect')
    }).catch((error)=>{
        console.log(error)
    })
}
        

module.exports = connectDb