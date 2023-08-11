require('dotenv').config();

var express = require('express')
var admin_route = express();
admin_route.set('views','./views/admin')
const adminController = require("../controller/adminController")
const auth = require("../../middleware/adminAuth.js")



admin_route.get('/admin_sign_in',auth.isLogout, adminController.adminSignin)
admin_route.post('/admin_signin_post',auth.isLogout,adminController.adminSigninPost)
admin_route.get('/admin_dashboard',auth.isLogin,adminController.adminDashboard)
admin_route.get('/customers',adminController.viewCustomers)






admin_route.get('/admin_logout',auth.isLogin,adminController.adminLogout)









module.exports = admin_route