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
    }

},
{timestamps : true})

module.exports = mongoose.model("JobApplication",jobApplicationSchema)