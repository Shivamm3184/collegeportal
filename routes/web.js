const express = require("express");
const FrontController = require("../controllers/FrontController");
const route = express.Router();
const checkAuth = require("../middleware/auth");
const CourseController = require("../controllers/CourseController");
const ContactController = require('../controllers/ContactController');
const AdminController = require("../controllers/admin/AdminController");
const adminRole = require('../middleware/adminRole')
const isLogin = require('../middleware/isLogin')

// routes
route.get("/home", checkAuth, FrontController.home);
route.get("/about", checkAuth, FrontController.about);
route.get("/contact", checkAuth, FrontController.contact);
route.get("/",isLogin, FrontController.login);
route.get("/register", FrontController.register);

// insert data
route.post("/userinsert", FrontController.userinsert);
route.post("/verifyLogin", FrontController.verifyLogin);
route.get("/logout", FrontController.logout);

// profile
route.get('/profile',checkAuth,FrontController.profile)
route.post('/changePassword',checkAuth,FrontController.changePassword)
route.post('/updateProfile',checkAuth,FrontController.updateProfile)

//course
route.post("/course_insert", checkAuth,CourseController.createCourse);
//displaycourse
route.get("/courseDisplay", checkAuth, CourseController.courseDisplay);
route.get('/viewCourse/:id',checkAuth,CourseController.viewCourse)
route.get('/deleteCourse/:id',checkAuth,CourseController.deleteCourse)
route.get('/editCourse/:id',checkAuth,CourseController.editCourse)
route.post('/courseUpdate/:id',checkAuth,CourseController.courseUpdate)


//adminController
route.get('/admin/dashboard',checkAuth,adminRole('admin'),AdminController.dashboard)
// admin course
route.get('/admin/courseDisplay',checkAuth,adminRole('admin'),AdminController.courseDisplay)
route.get('/courseView/:_id',checkAuth,adminRole('admin'),AdminController.courseView)
route.get('/courseEdit/:_id',checkAuth,adminRole('admin'),AdminController.courseEdit)
route.post('/course1Update/:_id',checkAuth,adminRole('admin'),AdminController.course1Update)
route.get('/courseDelete/:id',checkAuth,adminRole('admin'),AdminController.courseDelete)
//admin profile
route.get('/profile1',checkAuth,adminRole('admin'),AdminController.profile)
route.post('/updateProfile1',checkAuth,adminRole('admin'),AdminController.updateProfile1)
route.post('/admin/changePassword',checkAuth,adminRole('admin'),AdminController.changePassword)
route.get('/admin/contactDisplay',checkAuth,adminRole('admin'),AdminController.contactDisplay)
route.post('/admin/update_status/:id',checkAuth,adminRole('admin'),AdminController.update_status)

//forget password
route.post("/forgot_Password",FrontController.forgetPasswordVerify)
route.get('/reset-password',FrontController.reset_Password)
route.post('/reset_Password1',FrontController.reset_Password1)

//verify mail
route.get('/register/verify',FrontController.verifyMail)










//contact
route.get('/contact', ContactController.contactForm); 
route.post('/contact', ContactController.saveContact);









module.exports = route;
