const express = require("express")

const userController = require('../controllers/userController')

const router = express.Router()

// ============ USER ===============

// register User
router.post("/user-register",userController.registerController)

// login User
router.post("/user-login",userController.userLoginController)

module.exports = router