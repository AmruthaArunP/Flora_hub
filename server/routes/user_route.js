const express = require('express')
var user_route = express()
const session = require('express-session')
user_route.set('views', './views/user')
const userController = require("../controller/userController")


// user_route.get("/", userControllers.loginPage)




module.exports = user_route
