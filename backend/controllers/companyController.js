const audits = require("../models/auditLogModel")
const companies = require("../models/companyModel")
const invites = require("../models/invitationModel")
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
                await users.findByIdAndUpdate(Admin._id, { role: "Admin", companyId: newCompany._id, status: "Active", leftCompanyAt: null }, { new: true })
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

// company invitation
exports.companyInvitationController = async (req, res) => {
    const { email, role } = req.body
    const senderemail = req.payload
    try {
        const Sender = await users.findOne({ email: senderemail })
        const Reciever = await users.findOne({ email: email })
        const existingInvite = await invites.findOne({ email: email, companyId: Sender.companyId })
        if (existingInvite) {
            return res.status(409).json("An Invitation is Pending...")
        }
        else {
            if (!Reciever) {
                return res.status(404).json("User not found")
            }
            // checking if sender exists
            if (Sender) {

                //checking of reciever velongs to any company (only 1 company at a time for a user)
                if (Reciever.companyId && Reciever.leftCompanyAt === null) {
                    return res.status(409).json("User already belongs to a company")
                }

                // checking if sender actually belongs to that company
                if (Sender.companyId && Sender.leftCompanyAt === null) {
                    // checking if the sender is admin of that company
                    if (Sender.role == "Admin") {
                        const newInvite = new invites({
                            email, role, companyId: Sender.companyId, status: "Pending", invitedBy: Sender._id
                        })
                        await newInvite.save()
                        const newAudit = new audits({
                            action:"INVITED",entityType:"USER",entityId:Reciever._id,performedBy:Sender._id,companyId:Sender.companyId
                        })
                        await newAudit.save()
                        res.status(201).json("Invite Sent")
                    }
                    else {
                        return res.status(403).json("You Have No Permission")
                    }
                }
                else {
                    return res.status(403).json("You Have No Permission")
                }
            }
            else {
                return res.status(404).json("User not found")
            }
        }
    }
    catch (err) {
        res.status(500).json("Server Error")
    }
}