const mongoose = require("mongoose")

const inviteSchema = new mongoose.Schema({
    email:{
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
    invitedBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    status:{
        type : String,
        required : true
    },
    createdAt:{
        type : Date,
        required : true,
        default : Date.now
    }
})

const invites = mongoose.model("invites",inviteSchema)
module.exports = invites