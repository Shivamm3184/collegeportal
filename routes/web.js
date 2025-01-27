const express = require("express");
const FrontController = require("../controllers/FrontController");
const route = express.Router();
const checkAuth = require("../middleware/auth");
const CourseController = require("../controllers/CourseController");
const ContactController = require('../controllers/ContactController');
const AdminController = require("../controllers/admin/AdminController");

// routes
route.get("/home", checkAuth, FrontController.home);
route.get("/about", checkAuth, FrontController.about);
route.get("/contact", checkAuth, FrontController.contact);
route.get("/", FrontController.login);
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
route.get('/admin/dashboard',checkAuth,AdminController.dashboard)
route.get('/admin/courseDisplay',checkAuth,AdminController.courseDisplay)
route.get('/admin/contactDisplay',checkAuth,AdminController.contactDisplay)
route.post('/admin/update_status/:id',checkAuth,AdminController.update_status)

//forget password
route.post("/forgot_Password",FrontController.forgetPasswordVerify)
route.get('/reset-password',FrontController.reset_Password)
route.post('/reset_Password1',FrontController.reset_Password1)









//contact
route.get('/contact', ContactController.contactForm); 
route.post('/contact', ContactController.saveContact);









module.exports = route;
