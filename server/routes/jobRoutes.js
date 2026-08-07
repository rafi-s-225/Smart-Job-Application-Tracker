const express = require('express')
const router = express.Router()
const JobApplication = require('../models/JobApplication')
const protect = require('../middleware/authMiddleware')

const allowedUpdates = [
  'companyName',
  'jobRole',
  'applicationDate',
  'status',
  'deadline',
  'notes',
  'salary',
  'location',
  'jobUrl',
  'contactName',
  'contactEmail',
  'favorite'
]

const allowedStatuses = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn']

router.get('/', protect, async (req, res) => {
  try {
    const applications = await JobApplication.find({ user: req.userId }).sort({ createdAt: -1 })
    res.json(applications)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/stats', protect, async (req, res) => {
  try {
    const applications = await JobApplication.find({ user: req.userId })
    const total = applications.length
    
    const statusCounts = {
      Wishlist: 0,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
      Withdrawn: 0
    }

    const now = new Date()
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    let upcomingDeadlinesCount = 0

    applications.forEach(app => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++
      }
      if (app.deadline && new Date(app.deadline) >= now && new Date(app.deadline) <= in7Days) {
        upcomingDeadlinesCount++
      }
    })

    const responseRate = total > 0 
      ? Math.round(((statusCounts.Interview + statusCounts.Offer + statusCounts.Rejected) / total) * 100)
      : 0

    res.json({
      total,
      statusCounts,
      responseRate,
      upcomingDeadlinesCount
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const {
      companyName,
      jobRole,
      applicationDate,
      status,
      deadline,
      notes,
      salary,
      location,
      jobUrl,
      contactName,
      contactEmail,
      favorite
    } = req.body

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
      status: status || 'Applied',
      deadline: deadline || null,
      notes: notes || '',
      salary: salary || '',
      location: location || '',
      jobUrl: jobUrl || '',
      contactName: contactName || '',
      contactEmail: contactEmail || '',
      favorite: Boolean(favorite),
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