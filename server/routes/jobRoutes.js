const express = require("express")
const router = express.Router()
const JobApplication = require("../models/JobApplication")
const protect = require("../middleware/authMiddleware")

router.get("/", protect, async (req, res) => {
  try {
    const applications = await JobApplication.find({ user: req.userId })
    res.json(applications)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post("/", protect, async (req, res) => {
  try {
    const newApplication = new JobApplication({
      companyName: req.body.companyName,
      jobRole: req.body.jobRole,
      applicationDate: req.body.applicationDate,
      status: req.body.status,
      deadline: req.body.deadline,
      notes: req.body.notes,
      user: req.userId
    })
    const savedApplication = await newApplication.save()
    res.status(201).json(savedApplication)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put("/:id", protect, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id)

    if (!application) {
      return res.status(404).json({ message: "Job application not found" })
    }

    if (application.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not allowed to update this application" })
    }

    const updatedApplication = await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updatedApplication)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete("/:id", protect, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id)

    if (!application) {
      return res.status(404).json({ message: "Job application not found" })
    }

    if (application.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not allowed to delete this application" })
    }

    await JobApplication.findByIdAndDelete(req.params.id)
    res.json({ message: "Job application deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router