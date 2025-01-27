const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    }
    
}, { timestamps: true});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;


    //  user_id:{
    //     type: String,
    //  Required: true,
    // }


    
// }, { timestamps: true })//jb ham insert krege to 2 field dega created add -->date time btyegi or update
// const Contact = mongoose.model('Contact', contactSchema)
// module.exports = Contact