const audits = require("../models/auditLogModel")
const comments = require("../models/riskCommentModel")
const users = require("../models/userModel")


// add comment
exports.addCommentController = async (req, res) => {
    const { id, comment, } = req.body
    const email = req.payload
    try {
        const user = await users.findOne({ email: email })
        if (!user) {
            return res.status(404).json("User not found")
        }
        if (!user.companyId || user.leftCompanyAt !== null) {
            return res.status(403).json("You do not belong to a company")
        }
        const newComment = new comments({
            riskId: id, comment, createdBy: user._id
        })
        await newComment.save()
        const newAudit = new audits({
            action: "COMMENTED ON", entityType: "RISK", entityId:id, performedBy:user._id, companyId:user.companyId
        })
        await newAudit.save()
        res.status(200).json("Comment Added!")
    }
    catch (err) {
        res.status(500).json(err)
    }
}

// get risks comment
exports.getCommentController = async (req, res) => {
    const { id } = req.body
    try {
        const allComments = await comments.find({riskId:id})
        res.status(200).json(allComments)
    }
    catch (err) {
        res.status(500).json(err)
    }
}