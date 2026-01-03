const users = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const invites = require("../models/invitationModel")
const audits = require("../models/auditLogModel")
const salt = 10

// register user
exports.registerController = async (req, res) => {
    const { username, email, password } = req.body
    try {
        const existingUser = await users.findOne({ email: email })
        if (existingUser) {
            return res.status(409).json("Email Already Registered...")
        }
        else {
            const hashedPassword = await bcrypt.hash(password, salt)
            const newUser = new users({
                username, email, password: hashedPassword
            })
            await newUser.save()
            res.status(201).json({ message: "Registration successful. Please login." })
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
}

// user login
exports.userLoginController = async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await users.findOne({ email: email })
        if (!existingUser) {
            return res.status(404).json("User Not Found! Please Register...")
        }
        else {
            const match = await bcrypt.compare(password, existingUser.password)
            if (match) {
                const token = jwt.sign({ email: existingUser.email, username: existingUser.username, profile: existingUser.profile }, process.env.SECRET_KEY)
                return res.status(200).json({
                    message: "Login Successful",
                    user: {
                        _id: existingUser.id,
                        username: existingUser.username,
                        email: existingUser.email,
                        profile: existingUser.profile,
                        status: existingUser.status,
                        companyId: existingUser.companyId,
                        createdAt: existingUser.createdAt,
                        updatedAt: existingUser.updatedAt,
                        role: existingUser.role
                    },
                    token
                })
            }
            else {
                return res.status(401).json("Password Does Not Match!")
            }
        }
    }
    catch (err) {
        res.status(500).json("Server Error")
    }
}

//get company Users
exports.getCompanyUsersController = async (req, res) => {
    const email = req.payload
    console.log(email);

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
        const companyUsers = await users.find({ companyId: user.companyId })
        res.status(200).json(companyUsers)
    }
    catch (err) {
        res.status(500).json("Server Error")
    }
}

//get company Users
exports.getUsersController = async (req, res) => {
    const { searchData } = req.body
    const query = {
        email: {
            $regex: searchData, $options: "i"
        }
    }
    try {
        const allUser = await users.find(query)
        res.status(200).json(allUser)
    }
    catch (err) {
        res.status(500).json("Server Error")
    }
}

// send invite to user (when hover searched user)
exports.sendInviteController = async (req, res) => {
    const { inviteData } = req.body
    const { inviteUser, inviteDetails } = inviteData
    const email = req.payload
    try {
        const user = await users.findOne({ email: email })
        if (!user) {
            return res.status(404).json("User not found")
        }
        if (!user.companyId || user.leftCompanyAt !== null) {
            return res.status(403).json("You do not belong to a company")
        }
        if (user.role != "Admin") {
            return res.status(403).json("You Have No Permission")
        }
        const newInvite = new invites({
            email: inviteUser.email,
            role: inviteDetails.role,
            companyId: inviteDetails.companyId,
            invitedBy: user._id,
            status: "Pending"
        })
        await newInvite.save()
        const newAudit = new audits({
            action: "INVITED",
            entityType: "USER",
            entityId: inviteUser._id,
            performedBy: user._id,
            companyId: user.companyId
        })
        await newAudit.save()
        res.status(200).json("Invite Send!")
    }
    catch (err) {
        res.status(500).json("Server Error")
    }
}

// get invite
exports.getInviteController = async (req, res) => {
    const email = req.payload
    try {
        const userInvites = await invites.find({ email: email, status:"Pending" })
        res.status(200).json(userInvites)
    }
    catch (err) {
        res.status(500).json("Server Error")
    }
}

// accept invite
exports.acceptInviteController = async (req, res) => {
    const { invite } = req.body
    const email = req.payload
    console.log(email);
    try {
        const user = await users.findOne({ email: email })
        if (!user) {
            return res.status(404).json("User not found")
        }
        if (user.companyId && user.leftCompanyAt == null) {
            return res.status(403).json("Leave Current Company to Join Another!")
        }
        if(invite.email!=email){
            return res.status(403).json("You Have No Permission!")
        }
        const editUser = await users.findByIdAndUpdate(user._id, { companyId: invite.companyId, role: invite.role, status: "Active", leftCompanyAt: null, updatedAt: Date.now() }, { new: true })
        await invites.findByIdAndUpdate(invite._id,{status:"Accepted"},{new:true})
        const newAudit = new audits({
            action: "ACCEPTED INVITE FROM",
            entityType: "USER",
            entityId: invite.invitedBy,
            performedBy: user._id,
            companyId: invite.companyId
        })
        await newAudit.save()
        res.status(200).json("Invite Accepted!")
    }
    catch (err) {
        res.status(500).json("Server Error")
    }
}