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

// get all company risk
router.get("/get-risk",jwtMiddleware,riskController.getAllCompanyRiskController)

// get worker company risk
router.get("/get-risk-worker",jwtMiddleware,riskController.getWorkerRiskController)

// create risk
router.post("/create-risk",jwtMiddleware,riskController.createRiskController)

// update risk
router.post("/update-risk",jwtMiddleware,riskController.updateRiskController)

// risk status
router.post("/update-risk-status",jwtMiddleware,riskController.changeRiskStatusController)

// get risk dashboard status
router.get("/get-risk-dashboard-status",jwtMiddleware,riskController.getRiskDashbordStatusController)

module.exports = router