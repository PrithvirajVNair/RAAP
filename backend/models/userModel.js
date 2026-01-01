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
    role:{
        type : String,
        required : true
    },
    companyId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"companies"
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

const users = mongoose.model("users",userSchema)
module.exports = users