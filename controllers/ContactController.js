const Contact = require('../models/contact'); 

const ContactController = {
    contactForm: (req, res) => {
        res.render('contact'); // Render the contact.ejs form
    },
    saveContact: async (req, res) => {
        try {
            // console.log(req.body)
            const { name, username,phone, email, address } = req.body;

            const newContact = new Contact({
            name, 
            username,
            phone,
             email, 
             address, 
             });
            await newContact.save();
            req.flash("info", "Your message sent");
            res.redirect('/contact');
        } catch (error) {
            console.error(error);
            
        }
    }
};

module.exports = ContactController;
