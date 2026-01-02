const express = require("express")

const userController = require('../controllers/userController')
const companyController = require('../controllers/companyController')
const jwtMiddleware = require("../middleware/jwtMiddleware")

const router = express.Router()

// ============ USER ===============

// register User
router.post("/user-register",userController.registerController)

// login User
router.post("/user-login",userController.userLoginController)




// ============== COMPANY CREATION =============

// create company
router.post("/create-company",jwtMiddleware,companyController.createCompanyController)

module.exports = router