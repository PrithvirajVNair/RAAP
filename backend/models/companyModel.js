const mongoose = require("mongoose")

const companySchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    industry:{
        type : String,
        required : true
    },
    status:{
        type : String,
        required : true
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

const companies = mongoose.model("companies", companySchema)
module.exports = companies