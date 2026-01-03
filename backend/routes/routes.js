const express = require("express")

const userController = require('../controllers/userController')
const companyController = require('../controllers/companyController')
const riskController = require('../controllers/riskController')
const commentController = require('../controllers/commentController')
const jwtMiddleware = require("../middleware/jwtMiddleware")

const router = express.Router()

// ============ USER ===============

// register User
router.post("/user-register",userController.registerController)

// login User
router.post("/user-login",userController.userLoginController)

// get company user (for admin/manager to access for adding/assigning users to risk)
router.get("/get-company-user",jwtMiddleware,userController.getCompanyUsersController)

// search users
router.post("/search-user",userController.getUsersController)

// invite users
router.post("/invite-user",jwtMiddleware,userController.sendInviteController)

// get invite 
router.get("/get-invite",jwtMiddleware,userController.getInviteController)

// get invite 
router.put("/accept-invite",jwtMiddleware,userController.acceptInviteController)


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

// =============== COMMENT =====================

// add comment
router.post("/add-comment",jwtMiddleware,commentController.addCommentController)

// add comment
router.post("/get-comment",jwtMiddleware,commentController.getCommentController)

module.exports = router