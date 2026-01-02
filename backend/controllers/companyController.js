const companies = require("../models/companyModel")
const users = require("../models/userModel")



// create company
exports.createCompanyController = async (req, res) => {
    const { name, industry } = req.body
    const email = req.payload
    try {
        const Admin = await users.findOne({ email: email })
        if (Admin) {
            if (Admin.companyId && Admin.leftCompanyAt === null) {
                return res.status(400).json("User already belongs to a company")
            }
            else {
                const newCompany = new companies({
                    name, industry, createdBy: Admin._id
                })
                await newCompany.save()
                await users.findByIdAndUpdate(Admin._id, { role: "Admin", companyId: newCompany._id, status: "Active", leftCompanyAt:null }, { new: true })
                res.status(201).json("Company Created")
            }
        }
        else {
            return res.status(404).json("User not found")
        }
    }
    catch (err) {
        res.status(500).json("Server Error")
    }
}