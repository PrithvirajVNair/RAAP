const riskHistories = require("../models/riskHistoryModel")
const users = require("../models/userModel")


// get risk history
exports.getRiskHistoryController = async(req, res) => {
    const {id} = req.body
    const email = req.payload
    try{
        const user = await users.findOne({email:email})
        const riskHistory = await riskHistories.find({riskId:id})
        if(!user){
            return res.status(404).json("User not found")
        }
        if(!riskHistory){
            return res.status(404).json("History not found")
        }
        if (!user.companyId || user.leftCompanyAt !== null) {
            return res.status(403).json("You do not belong to a company")
        }
        res.status(200).json(riskHistory)
    }
    catch (err) {
        res.status(500).json(err)
    }
}