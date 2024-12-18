const UserModel = require('../models/user')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary')


// Configuration
cloudinary.config({
    cloud_name: 'dhapn8l2b',
    api_key: '284551959953545',
    api_secret: 'eUDsNU2FHklBvTrr4lW77egRYDI'
});


class FrontController {
    static home = async (req, res) => {
        try {
            res.render("home")
        } catch (error) {
            console.log(error)
        }
    }
    static about = async (req, res) => {
        try {
            res.render("about")
        } catch (error) {
            console.log(error)
        }
    }
    static contact = async (req, res) => {
        try {
            res.render("contact")
        } catch (error) {
            console.log(error)
        }
    }
    static login = async (req, res) => {
        try {
            res.render("login", { msg: req.flash('success') })
        } catch (error) {
            console.log(error)
        }
    }
    static register = async (req, res) => {
        try {
            res.render("register", { msg: req.flash('error') })
        } catch (error) {
            console.log(error)
        }
    }

    // userinsert
    static userinsert = async (req, res) => {
        try {

            //  console.log(req.body)
            const { name, email, password, confirmpassword } = req.body
            if (!name || !email || !password || !confirmpassword) {
                req.flash("error", "All fields are Required.");
                return res.redirect("/register");
            }

            const isEmail = await UserModel.findOne({ email });
            if (isEmail) {
                req.flash("error", "Email Already Exists.");
                return res.redirect("/register");
            }

            if (password != confirmpassword) {
                req.flash("error", "Password does not match.");
                return res.redirect("/register");
            }
            // image upload
            const file = req.files.image;
            const imageupload = await cloudinary.uploader.upload(
                file.tempFilePath,
                {
                    folder: "userprofile",
                }
            );
            // console.log(imageupload)

            const hashpassword = await bcrypt.hash(password, 10)

            const data = await UserModel.create({
                name, 
                email,
                password: hashpassword,
                image: {
                    public_id:imageupload.public_id,
                    url:imageupload.secure_url
                }
            });
            req.flash("success", "Register Succesfully ! Please login here");
            res.redirect("/"); //route ~~ web



        } catch (error) {
            console.log(error)
        }
    }


}
module.exports = FrontController