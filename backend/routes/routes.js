const express = require("express")

const userController = require('../controllers/userController')
const companyController = require('../controllers/companyController')
const riskController = require('../controllers/riskController')
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

// create company
router.post("/invite-company",jwtMiddleware,companyController.companyInvitationController)




// =============== RISK =====================

// create risk
router.post("/create-risk",jwtMiddleware,riskController.createRiskController)

// risk status
router.post("/create-risk-status",jwtMiddleware,riskController.changeRiskStatusController)

module.exports = router