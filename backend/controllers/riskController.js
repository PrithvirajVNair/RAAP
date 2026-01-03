const audits = require("../models/auditLogModel")
const riskHistories = require("../models/riskHistoryModel")
const risks = require("../models/riskModel")
const users = require("../models/userModel")


// create Risk
exports.createRiskController = async (req, res) => {
    const { title, description, category, impact, likelihood, solution, assignedTo, dueDate } = req.body
    const email = req.payload
    try {
        const riskOwner = await users.findOne({ email: email })
        if (!riskOwner) {
            return res.status(404).json("User not found")
        }
        else {
            if (riskOwner.role != "Admin" && riskOwner.role != "Manager") {
                return res.status(403).json("You Have No Permission")
            }
            const assignee = await users.findById(assignedTo)
            if (!assignee) {
                return res.status(404).json("Assigned user not found")
            }
            if (String(riskOwner.companyId) !== String(assignee.companyId) || assignee.leftCompanyAt !== null) {
                return res.status(400).json("Assigned user must belong to the same company")
            }
            if (riskOwner.companyId && riskOwner.leftCompanyAt === null) {
                const riskScore = impact * likelihood
                const level = riskScore >= 15 ? "High" : riskScore >= 8 ? "Medium" : "Low"
                const newRisk = new risks({
                    title, 
                    description, 
                    category, 
                    impact, 
                    likelihood, 
                    mitigationPlan: solution, 
                    mitigationOwner: assignedTo, 
                    dueDate, 
                    mitigationStatus: "Open", 
                    createdBy: riskOwner._id, 
                    companyId: riskOwner.companyId, 
                    riskScore, 
                    level
                })
                await newRisk.save()
                
                const newAudit = new audits({
                    action: "CREATED", 
                    entityType: "RISK", 
                    entityId: newRisk._id, 
                    performedBy: riskOwner._id, 
                    companyId: riskOwner.companyId
                })
                await newAudit.save()

                const newRiskHistory = new riskHistories({
                    riskId: newRisk._id, 
                    companyId: riskOwner.companyId, 
                    action: "CREATED", 
                    changedBy: riskOwner._id
                })
                await newRiskHistory.save()

                res.status(201).json("Risk created successfully")
            }
            else {
                return res.status(403).json("You Have No Permission")
            }
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
}

// update risk
exports.updateRiskController = async (req, res) => {
    const { _id, title, description, category, impact, likelihood, solution, assignedTo, dueDate } = req.body
    const email = req.payload
    try {
        const riskEditor = await users.findOne({ email: email })
        const editRisk = await risks.findById(_id)
        const assignee = await users.findById(assignedTo)
        if (!assignee) {
            return res.status(404).json("Assigned user not found")
        }
        if (!riskEditor) {
            return res.status(404).json("User not found")
        }
        if (!editRisk) {
            return res.status(404).json("Risk not found")
        }
        const prevEditRisk = editRisk.toObject()
        if (!riskEditor.companyId || riskEditor.leftCompanyAt !== null) {
            return res.status(403).json("You do not belong to a company")
        }
        if (riskEditor.role != "Admin" && riskEditor.role != "Manager") {
            return res.status(403).json("You Have No Permission")
        }
        if (String(riskEditor.companyId) !== String(editRisk.companyId)) {
            return res.status(403).json("User Must Belong to the Company")
        }
        // below condition might cause issue
        if (String(editRisk.companyId) != String(assignee.companyId) || assignee.leftCompanyAt !== null) {
            return res.status(403).json("Assigned user must belong to the same company")
        }
        const riskScore = impact * likelihood
        const level = riskScore >= 15 ? "High" : riskScore >= 8 ? "Medium" : "Low"
        editRisk.title = title
        editRisk.description = description
        editRisk.category = category
        editRisk.impact = impact
        editRisk.likelihood = likelihood
        editRisk.mitigationPlan = solution
        editRisk.mitigationOwner = assignedTo
        editRisk.dueDate = dueDate
        editRisk.riskScore = riskScore
        editRisk.level = level
        editRisk.updatedAt = Date.now()
        await editRisk.save()
        const newAudit = new audits({
            action: "UPDATED", entityType: "RISK", entityId: editRisk._id, performedBy: riskEditor._id, companyId: riskEditor.companyId
        })
        await newAudit.save()
        const newRiskHistory = new riskHistories({
            riskId: editRisk._id, companyId: editRisk.companyId, action: "UPDATED", changedBy: riskEditor._id, fieldChanged: "MULTIPLE_FIELDS", oldValue: prevEditRisk, newValue: editRisk.toObject()
        })
        await newRiskHistory.save()
        res.status(200).json("Risk updated successfully")
    }
    catch (err) {
        res.status(500).json(err)
    }
}

// change risk status
exports.changeRiskStatusController = async (req, res) => {
    const { status, risk } = req.body
    const { _id } = risk
    const email = req.payload
    const allowedStatuses = ["Open", "In Progress", "Done", "Closed"]
    try {
        const statusEditor = await users.findOne({ email: email })
        const riskStatus = await risks.findById(_id)
        if (!statusEditor) {
            return res.status(404).json("User not found")
        }
        if (!riskStatus) {
            return res.status(404).json("Risk not found")
        }
        if (!statusEditor.companyId || statusEditor.leftCompanyAt !== null) {
            return res.status(403).json("You do not belong to a company")
        }
        const preStatus = riskStatus.mitigationStatus
        if (String(statusEditor._id) != String(riskStatus.mitigationOwner) && statusEditor.role != "Admin" && statusEditor.role != "Manager") {
            return res.status(403).json("You Have No Permission")
        }
        if (String(statusEditor.companyId) !== String(riskStatus.companyId)) {
            return res.status(403).json("User Must Belong to the Company")
        }
        if (allowedStatuses.includes(status)) {
            riskStatus.mitigationStatus = status
        }
        else {
            return res.status(400).json("Invalid Status")
        }
        riskStatus.updatedAt= Date.now()
        await riskStatus.save()
        const newAudit = new audits({
            action: "UPDATED", 
            entityType: "RISK", 
            entityId: riskStatus._id, 
            performedBy: statusEditor._id, 
            companyId: statusEditor.companyId
        })
        await newAudit.save()
        const newRiskHistory = new riskHistories({
            riskId: riskStatus._id, companyId: riskStatus.companyId, action: "UPDATED", changedBy: statusEditor._id, fieldChanged: "Status", oldValue: { status: preStatus }, newValue: { status: riskStatus.mitigationStatus }
        })
        await newRiskHistory.save()
        res.status(200).json("Status Changed!")
    }
    catch (err) {
        res.status(500).json(err)
    }
}

// get risk
exports.getAllCompanyRiskController = async (req, res) => {
    const email = req.payload
    try {
        const user = await users.findOne({ email: email })
        if (!user) {
            return res.status(404).json("User not found")
        }
        if (!user.companyId || user.leftCompanyAt !== null) {
            return res.status(403).json("You do not belong to a company")
        }
        if (user.role != "Admin" && user.role != "Manager") {
            return res.status(403).json("You Have No Permission")
        }
        const allRisks = await risks.find({ companyId: user.companyId }).sort({riskScore:-1})
        const filteredRisk = allRisks.filter((risk)=>risk.mitigationStatus!="Closed")
        res.status(200).json({allRisks,filteredRisk})
    }
    catch (err) {
        res.status(500).json(err)
    }
}

// get worker risks
exports.getWorkerRiskController = async (req, res) => {
    const email = req.payload
    try {
        const user = await users.findOne({ email: email })
        if (!user) {
            return res.status(404).json("User not found")
        }
        if (!user.companyId || user.leftCompanyAt !== null) {
            return res.status(403).json("You do not belong to a company")
        }
        if (user.role != "Worker") {
            return res.status(403).json("You Have No Permission")
        }
        const allRisks = await risks.find({ mitigationOwner: user._id }).sort({riskScore:-1})
        res.status(200).json(allRisks)
    }
    catch (err) {
        res.status(500).json(err)
    }
}

// get company risk dashboard status
exports.getRiskDashbordStatusController = async (req, res) => {
    const email = req.payload
    try{
        const user = await users.findOne({email:email})
        if(!user){
            return res.status(404).json("User not found")
        }
        if (!user.companyId || user.leftCompanyAt !== null) {
            return res.status(403).json("You do not belong to a company")
        }
        if (user.role != "Admin" && user.role != "Manager") {
            return res.status(403).json("You Have No Permission")
        }
        const riskHigh = await risks.find({companyId:user.companyId}).countDocuments({level:"High"})
        const riskMedium = await risks.find({companyId:user.companyId}).countDocuments({level:"Medium"})
        const riskLow = await risks.find({companyId:user.companyId}).countDocuments({level:"Low"})
        res.status(200).json({riskHigh,riskMedium,riskLow})
    }
    catch (err) {
        res.status(500).json(err)
    }
}