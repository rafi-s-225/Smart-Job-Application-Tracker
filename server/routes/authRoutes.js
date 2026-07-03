const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })

    const savedUser = await newUser.save()

    res.status(201).json({
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      token: token,
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