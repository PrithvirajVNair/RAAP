const mongoose = require("mongoose")

const riskSchema = new mongoose.Schema({
    title:{
        type : String,
        required : true
    },
    description:{
        type : String,
        required : true
    },
    category:{
        type : String,
        required : true
    },
    impact:{
        type : Number,
        required : true
    },
    likelihood:{
        type : Number,
        required : true
    },
    riskScore:{
        type : Number,
        required : true
    },
    level:{
        type : String,
        required : true
    },
    mitigationPlan:{
        type : String,
        required : true
    },
    mitigationOwner:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    mitigationStatus:{
        type : String,
        required : true
    },
    dueDate:{
        type : Date,
        // required : true
    },
    createdBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    companyId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"companies"
    },
    createdAt:{
        type : Date,
        required : true,
        default : Date.now
    },
    updatedAt:{
        type : Date,
        required : true,
        default : Date.now
    }
})

const risks = mongoose.model("risks",riskSchema)
module.exports = risks