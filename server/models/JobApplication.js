const mongoose = require("mongoose")

const jobApplicationSchema = new mongoose.Schema({
    companyName:{
        type :String,
        required: true
    },
    jobRole:{
        type :String,
        required : true
    },
    applicationDate:{
        type : Date,
        required : true
    },
    status : {
        type : String,
        enum: ["Applied","Interview","Offer","Rejected"],
        default : "Applied"
    },
    deadline: {
        type : Date
    },
    notes : {
        type : String
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

},
{timestamps : true})

module.exports = mongoose.model("JobApplication",jobApplicationSchema)