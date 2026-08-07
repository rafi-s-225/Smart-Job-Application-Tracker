const mongoose = require("mongoose")

const jobApplicationSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  jobRole: {
    type: String,
    required: true,
    trim: true
  },
  applicationDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["Wishlist", "Applied", "Interview", "Offer", "Rejected", "Withdrawn"],
    default: "Applied"
  },
  deadline: {
    type: Date
  },
  salary: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  jobUrl: {
    type: String,
    trim: true
  },
  contactName: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true
  },
  favorite: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model("JobApplication", jobApplicationSchema)