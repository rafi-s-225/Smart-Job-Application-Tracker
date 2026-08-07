const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const JobApplication = require('../models/JobApplication')
const { GoogleGenerativeAI } = require('@google/generative-ai')

router.post('/chat', protect, async (req, res) => {
  try {
    const { message } = req.body

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Message text is required.' })
    }

    const apiKey = (process.env.GEMINI_API_KEY || '').trim()
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(400).json({
        message: 'Gemini API key is not configured. Please set GEMINI_API_KEY in server/.env file.'
      })
    }

    // Retrieve live user job applications for context
    const applications = await JobApplication.find({ user: req.userId }).sort({ createdAt: -1 })

    const formattedApps = applications.map((app, index) => ({
      index: index + 1,
      company: app.companyName,
      role: app.jobRole,
      status: app.status,
      appliedDate: app.applicationDate ? app.applicationDate.toISOString().substring(0, 10) : 'N/A',
      deadline: app.deadline ? app.deadline.toISOString().substring(0, 10) : 'None',
      location: app.location || 'N/A',
      salary: app.salary || 'N/A',
      contactName: app.contactName || 'N/A',
      notes: app.notes || 'None'
    }))

    const systemPrompt = `You are JobPilot AI, the intelligent assistant embedded inside the JobPilot AI website.

STRICT OPERATIONAL DIRECTIVES:
1. You answer ONLY questions related to:
   - The user's job applications, pipeline status, upcoming deadlines, and metrics.
   - Interview prep, company research, resume alignment, or salary advice SPECIFIC to the roles/companies in their tracker.
   - Site navigation and features (Kanban board, filtering, adding/editing applications).
2. If the user asks anything completely unrelated (such as recipes, sports, random trivia, general programming unrelated to job search), politely decline by stating:
   "I am your JobPilot AI Assistant. I can only assist with questions regarding your job applications, interview prep, career pipeline, and site features."
3. Always be encouraging, concise, structured, and professional.

CURRENT USER'S TRACKED JOB APPLICATIONS (Total: ${applications.length}):
${JSON.stringify(formattedApps, null, 2)}

USER QUESTION: "${message}"`

    const genAI = new GoogleGenerativeAI(apiKey)
    const candidateModels = [
      'gemini-flash-latest',
      'gemini-flash-lite-latest',
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-2.0-flash-001'
    ]
    
    let replyText = ''
    let lastError = null

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent(systemPrompt)
        const response = await result.response
        replyText = response.text()
        if (replyText) break
      } catch (err) {
        console.warn(`Model ${modelName} attempt failed:`, err.message)
        lastError = err
      }
    }

    if (!replyText) {
      throw lastError || new Error('Could not generate response with available Gemini models.')
    }

    res.json({ reply: replyText })
  } catch (err) {
    console.error('Gemini API Error:', err)
    res.status(500).json({
      message: err.message || 'Error processing AI chat response.'
    })
  }
})

module.exports = router
