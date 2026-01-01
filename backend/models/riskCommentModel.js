const mongoose = require("mongoose")

const riskCommentSchema = new mongoose.Schema({
    riskId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "risks"
    },
    comment: {
        type : String,
        required : true
    },
    createdBy: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    createdAt: {
        type : Date,
        default : Date.now
    }
})

const comments = mongoose.model("comments",riskCommentSchema)
module.exports = comments