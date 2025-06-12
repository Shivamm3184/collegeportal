const CourseModel = require("../../models/course")
const ContactModel = require("../../models/contact")
const nodemailer = require('nodemailer')
const UserModel = require('../../models/user');
const cloudinary = require('cloudinary');
const bcrypt = require('bcrypt');

class AdminController {
    static dashboard = async (req, res) => {
        try {
            const { name, email, image } = req.udata
            const totalUsers = await CourseModel.countDocuments(); // Count all users
            const approvedUsers = await CourseModel.countDocuments({ status: "Approved" });
            const pendingUsers = await CourseModel.countDocuments({ status: "pending" });
            const rejectedUsers = await CourseModel.countDocuments({ status: "Reject" });

            // console.log("Total Users:", totalUsers);  // Debugging
            // console.log("Approved Users:", approvedUsers);
            // console.log("Pending Users:", pendingUsers);
            // console.log("Rejected Users:", rejectedUsers);

            res.render('admin/dashboard', { n: name, i: image, e: email , totalUsers, approvedUsers, pendingUsers, rejectedUsers })
        } catch (error) {
            console.log(error)
        }
    }
    static courseDisplay = async (req, res) => {
        try {
            const { name, email, image } = req.udata
            const course = await CourseModel.find()
            res.render('admin/coursedisplay', { n: name, i: image, e: email, c: course })
        } catch (error) {
            console.log(error)
        }
    }
    static courseView = async (req, res) => {
        try {
            const {name,image} = req.udata
            const _id = req.params._id
            // console.log(id)
            const course = await CourseModel.findById(_id)
            // console.log(course)
            res.render('admin/view',{c:course,n:name,i:image})
        } catch (error) {
            console.log(error);
        }
    };
    static courseEdit = async (req, res) => {
        try {
            const {name,image} = req.udata
            const _id = req.params._id
            // console.log(id)
            const course = await CourseModel.findById(_id)
            // console.log(course)
            res.render('admin/edit',{c:course,n:name,i:image})
        } catch (error) {
            console.log(error);
        }
    };
    static course1Update = async (req, res) => {
        try {
            const _id = req.params._id
            // console.log(id)
            const{name,email,phone,dob,address,gender,education,course}= req.body;
            await CourseModel.findByIdAndUpdate(_id,{
                name,
                email,
                phone,
                dob,
                address,
                gender,
                education,
                course
            });
            req.flash("success","Course Update Successfully")
            res.redirect("/admin/coursedisplay")
        } catch (error) {
            console.log(error);
        }
    };
    static courseDelete = async (req, res) => {
        try {
            const {name,image} = req.udata
            const id = req.params.id
            // console.log(id)
            const course = await CourseModel.findByIdAndDelete(id)
            res.redirect('/admin/courseDisplay')
        } catch (error) {
            console.log(error);
        }
    };
    static contactDisplay = async (req, res) => {
        try {
            const { name, email, image } = req.udata
            const contact = await ContactModel.find()
            res.render('admin/contactDisplay', { n: name, i: image, e: email, c: contact })
        } catch (error) {
            console.log(error)
        }
    }
    //profile
    static profile = async (req, res) => {
        try {
            const { name, image, email } = req.udata
            res.render("admin/profile1", { n: name, i: image, e: email, message: req.flash('error') })
        } catch (error) {
            console.log(error)
        }
    }
     // profile update
     static updateProfile1 = async (req, res) => {
        try {
            const { id } = req.udata;
            const { name, email, role } = req.body;
            if (req.files) {
                const user = await UserModel.findById(id);
                const imageID = user.image.public_id;
                // console.log(imageID);

                //deleting image from Cloudinary
                await cloudinary.uploader.destroy(imageID);
                //new image update
                const imagefile = req.files.image;
                const imageupload = await cloudinary.uploader.upload(
                    imagefile.tempFilePath,
                    {
                        folder: "userprofile",
                    }
                );
                var data = {
                    name: name,
                    email: email,
                    image: {
                        public_id: imageupload.public_id,
                        url: imageupload.secure_url,
                    },
                };
            } else {
                var data = {
                    name: name,
                    email: email,
                };
            }
            await UserModel.findByIdAndUpdate(id, data);
            req.flash("success", "Update Profile successfully");
            res.redirect("/profile1");
        } catch (error) {
            console.log(error);
        }
    };
    //  changePassword
    static changePassword = async (req, res) => {
        try {
            const { _id } = req.udata;
            // console.log(req.body);
            const { op, np, cp } = req.body;
            if (op && np && cp) {
                const user = await UserModel.findById(_id);
                const isMatched = await bcrypt.compare(op, user.password);
                //console.log(isMatched)
                if (!isMatched) {
                    req.flash("error", "Current password is incorrect ");
                    res.redirect("/profile1");
                } else {
                    if (np != cp) {
                        req.flash("error", "Password does not match");
                        res.redirect("/profile1");
                    } else {
                        const newHashPassword = await bcrypt.hash(np, 10);
                        await UserModel.findByIdAndUpdate(_id, {
                            password: newHashPassword,
                        });
                        req.flash("success", "Password Updated successfully ");
                        res.redirect("/");
                    }
                }
            } else {
                req.flash("error", "ALL fields are required ");
                res.redirect("/profile1");
            }
        } catch (error) {
            console.log(error);
        }

    };
    static update_status = async (req, res) => {
        try {
            const id = req.params.id;
            const { name, email, course, status, comment } = req.body
            await CourseModel.findByIdAndUpdate(id, {
                status,
                comment
            })
            if (status == "Reject") {
                this.RejectEmail(name, email, course, status, comment)
            } else {
                this.ApprovedEmail(name, email, course, status, comment)
            }
            //  this.sendEmail(name,email,course,status,comment)
            res.redirect('/admin/Coursedisplay')
        } catch (error) {
            console.log(error)
        }
    }
    static RejectEmail = async (name, email, course, status, comment) => {
        //console.log(name, email, course)
        // connenct with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "shivammishrakiddys@gmail.com",
                pass: "olfx swfh chmc ngwz",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: ` Course ${course} Reject`, // Subject line
            text: "heelo", // plain text body
            html: `<head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border: 1px solid #dddddd;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .email-body {
                    font-size: 16px;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .email-footer {
                    font-size: 14px;
                    color: #777777;
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">Message Registered Successfully</div>
                <div class="email-body">
                    <p>Dear <b>${name}</b>,</p>
                     
                    <p>Unfortunately, your course has been rejected. Please review the feedback below for further details:<br>
                   ${comment}</p>
                    <p>We appreciate your effort and encourage you to reach out if you have any questions or need clarification.</p>
                </div>
                <div class="email-footer">
                    Thank you,<br>
                    The Support Team
                </div>
            </div>
        </body>
             `, // html body
        });
    }
    static ApprovedEmail = async (name, email, course, status, comment) => {
        // console.log(name, email, course)
        // connenct with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "shivammishrakiddys@gmail.com",
                pass: "olfx swfh chmc ngwz",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: ` Course ${course} Approved`, // Subject line
            text: "heelo", // plain text body
            html: `<head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border: 1px solid #dddddd;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .email-body {
                    font-size: 16px;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .email-footer {
                    font-size: 14px;
                    color: #777777;
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">Message Registered Successfully</div>
                <div class="email-body">
                    <p>Dear <b>${name}</b>,</p>
                   <p>We are pleased to inform you that your course has been approved! Congratulations on your hard work and dedication.<br>
                   ${comment}<p>
                    <p>We appreciate your effort and encourage you to reach out if you have any questions or need clarification.</p>
                </div>
                <div class="email-footer">
                    Thank you,<br>
                    The Support Team
                </div>
            </div>
        </body>
             `, // html body
        });
    }


}
module.exports = AdminController