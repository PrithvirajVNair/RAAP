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
            if(riskOwner.role != "Admin" && riskOwner.role != "Manager"){
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
                    title, description, category, impact, likelihood, mitigationPlan: solution, mitigationOwner: assignedTo, dueDate, mitigationStatus: "Open", createdBy: riskOwner._id, companyId: riskOwner.companyId, riskScore, level
                })
                await newRisk.save()
                const newAudit = new audits({
                    action: "CREATED", entityType: "RISK", entityId: newRisk._id, performedBy: riskOwner._id, companyId: riskOwner.companyId
                })
                await newAudit.save()
                const newRiskHistory = new riskHistories({
                    riskId:newRisk._id,companyId:newRisk.companyId,action:"CREATED",changedBy:riskOwner._id
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