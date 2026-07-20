const express = require('express')
const router = express.Router()
const JobApplication = require('../models/JobApplication')
const protect = require('../middleware/authMiddleware')

const allowedUpdates = ['companyName', 'jobRole', 'applicationDate', 'status', 'deadline', 'notes']
const allowedStatuses = ['Applied', 'Interview', 'Offer', 'Rejected']

router.get('/', protect, async (req, res) => {
  try {
    const applications = await JobApplication.find({ user: req.userId }).sort({ createdAt: -1 })
    res.json(applications)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const { companyName, jobRole, applicationDate, status, deadline, notes } = req.body

    if (!companyName || !jobRole || !applicationDate) {
      return res.status(400).json({ message: 'Company name, job role, and application date are required.' })
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid application status.' })
    }

    const newApplication = new JobApplication({
      companyName,
      jobRole,
      applicationDate,
      status,
      deadline,
      notes,
      user: req.userId
    })
    const savedApplication = await newApplication.save()
    res.status(201).json(savedApplication)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((field) => allowedUpdates.includes(field))

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid update fields.' })
    }

    if (req.body.status && !allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid application status.' })
    }

    const application = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!application) {
      return res.status(404).json({ message: 'Job application not found or access denied' })
    }

    res.json(application)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const application = await JobApplication.findOneAndDelete({ _id: req.params.id, user: req.userId })

    if (!application) {
      return res.status(404).json({ message: 'Job application not found or access denied' })
    }

    res.json({ message: 'Job application deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router