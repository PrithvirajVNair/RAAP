const audits = require("../models/auditLogModel")
const users = require("../models/userModel")


// get audit
exports.getAuditController = async(req, res) => {
    const email = req.payload
    try{
        const user = await users.findOne({email:email})
        if(!user){
            return res.status(404).json("User not found")
        }
        if (!user.companyId || user.leftCompanyAt !== null) {
            return res.status(403).json("You do not belong to a company")
        }
        if (user.role != "Admin" && user.role != "Auditor") {
            return res.status(403).json("You Have No Permission")
        }
        const allAudit = await audits.find({companyId:user.companyId})
        res.status(200).json(allAudit)
    }
    catch (err) {
        res.status(500).json(err)
    }
}