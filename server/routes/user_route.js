const express = require('express')
var user_route = express()
const session = require('express-session')
user_route.set('views', './views/user')
const auth = require("../../middleware/userAuth.js")
const userController = require("../controller/userController")

const {isLogin,isLogout,blockCheck} = auth

user_route.get('/',userController.index)
user_route.get('/user_register',userController.user_register)
user_route.post('/user_register',userController.user_register_post)

user_route.get('/otp_verification',isLogout, userController.otp_verification)
user_route.post('/otp_verification_post',isLogout, userController.otp_verification_post)
user_route.get("/resentOtp",isLogout,userController.resendOtp )

//Forgot password
user_route.get('/forgot_pass',userController.forgot_password)
user_route.post('/verifyEmail',isLogout,userController.verifyForgotEmail)
user_route.get('/forgotOtpEnter',isLogout,userController.showForgotOtp)
user_route.post('/verifyForgotOtp',isLogout,userController.verifyForgotOtp)
user_route.get('/resendForgotPasswordotp', isLogout ,userController.resendForgotOtp)
user_route.post('/newPassword',isLogout, userController.updatePassword)


user_route.get('/user_login',isLogout, userController.user_login)
user_route.post("/user_login_post",isLogout, userController.user_login_post)

user_route.get('/index',blockCheck, userController.index)
user_route.get('/shop',blockCheck, userController.shop)

user_route.get('/my_account',isLogin,blockCheck, userController.my_account)
user_route.get('/user_logout',isLogin, userController.user_logout)





module.exports = user_route
