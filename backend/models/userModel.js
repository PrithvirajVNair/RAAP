const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    },
    password:{
        type : String,
        required : true
    },
    profile:{
        type : String,
        // required : true
    },
    role:{
        type : String,
        // required : true
    },
    companyId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"companies",
        default: null
    },
    status:{
        type : String,
        required : true,
        default : "Disabled"
    },
    leftCompanyAt:{
        type : Date,
        default: null
    },
    createdAt:{
        type : Date,
        required : true,
        default : Date.now
    },
    updatedAt:{
        type : String,
        required : true,
        default : Date.now
    }
})

const users = mongoose.model("users",userSchema)
module.exports = users