const mongoose = require("mongoose")

const riskHistorySchema = new mongoose.Schema({
    riskId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "risks",
        required : true
    },
    companyId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "companies",
        required : true
    },
    action: {
        type : String,           // CREATED, UPDATED, STATUS_CHANGED
        required : true
    },
    fieldChanged: {
        type : String,           // impact, status, mitigationPlan
        required : true
    },
    oldValue:{
        type : Object,
        // required : true
    },
    newValue:{
        type : Object,
        // required : true
    },
    changedBy: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "users",
        required : true
    },
    changedAt: {
        type : Date,
        default : Date.now
    }
})

const riskHistories = mongoose.model("riskHistories",riskHistorySchema)
module.exports = riskHistories