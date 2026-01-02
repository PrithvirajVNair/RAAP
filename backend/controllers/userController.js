const users = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
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
            const match = await bcrypt.compare(password,existingUser.password)
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

//get Users
exports.getUsersController = async (req, res) => {
    try {
        const allUsers = await users.find()
        res.status(200).json(allUsers)
    }
    catch (err) {
        res.status(500).json("Server Error")
    }
}