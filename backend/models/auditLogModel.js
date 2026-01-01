const mongoose = require("mongoose")

const auditLogSchema = new mongoose.Schema({
    action: {
        type : String,              // CREATE_USER, UPDATE_RISK
        required : true
    },
    entityType: {
        type : String,              // User | Risk
        required : true
    },
    entityId: {
        type : mongoose.Schema.Types.ObjectId,              // User | Risk (we manually populate)
        required : true
    },
    performedBy: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    companyId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "companies"
    },
    timestamp: {
        type : Date,
        default : Date.now
    }
})

const audits = mongoose.model("audits",auditLogSchema)
module.exports = audits