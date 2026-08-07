const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const protect = require('../middleware/authMiddleware')

const validateEmail = (email) => typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email)
const validatePassword = (password) => typeof password === 'string' && password.length >= 8

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({ message: 'Name, valid email, and password of at least 8 characters are required.' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })

    const savedUser = await newUser.save()

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router